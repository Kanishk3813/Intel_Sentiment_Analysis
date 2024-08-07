from flask import Flask, request, jsonify, Response, send_file
from flask_cors import CORS
import bs4
from dateutil import parser as dateparser
import requests
import torch
from transformers import BertTokenizer, BertForSequenceClassification
import spacy
import json
from io import StringIO, BytesIO
from suggestions import improvement_suggestions
from dotenv import load_dotenv
import os
from collections import deque
import pandas as pd
import matplotlib.pyplot as plt
from wordcloud import WordCloud


load_dotenv()

app = Flask(__name__)
CORS(app)

SCRAPER_API_KEY = os.getenv('SCRAPER_API_KEY')

model_path = "backend/bert_model"
model = BertForSequenceClassification.from_pretrained(model_path)
tokenizer = BertTokenizer.from_pretrained(model_path)

nlp = spacy.load("en_core_web_sm")

recent_analyses = deque(maxlen=10)

def scrape_with_scraperapi(url):
    params = {'api_key': SCRAPER_API_KEY, 'url': url, 'render': 'true'}
    response = requests.get('https://api.scraperapi.com', params=params)
    return response.content if response.status_code == 200 else None

def extract_reviews(url, max_reviews):
    reviews = []
    page_number = 1

    while (len(reviews) < max_reviews) and (page_number <= 10) :
        page_url = f"{url}&pageNumber={page_number}" if "amazon" in url else f"{url}&page={page_number}"
        webpage_content = scrape_with_scraperapi(page_url)
        if not webpage_content:
            print(f"Failed to fetch content from {page_url}")
            break

        soup = bs4.BeautifulSoup(webpage_content, "html.parser")

        if "amazon" in url:
            # Amazon CSS Selectors
            review_blocks = soup.select('div.a-row div.a-section.celwidget')
            product_name_elem = soup.select_one('h1.a-size-large a.a-link-normal')
        elif "flipkart" in url:
            # Flipkart CSS Selectors
            review_blocks = soup.select('div.col div.col')
            product_name_elem = soup.select_one('div.Vu3-9u')

        product_name = product_name_elem.text.strip() if product_name_elem else "Unknown Product"
        if len(review_blocks) == 0:
            continue

        for review in review_blocks:
            if len(reviews) >= max_reviews:
                break

            if "amazon" in url:
                title_elem = review.select_one('a.a-size-base span:nth-of-type(2)')
                content_elem = review.select_one('div.a-row.a-spacing-small span.a-size-base span')
                date_elem = review.select_one('span.a-size-base.a-color-secondary')
                author_elem = review.select_one('span.a-profile-name')
                rating_elem = review.select_one('i.a-icon-star span')
            elif "flipkart" in url:
                title_elem = review.select_one('p.z9E0IG')
                content_elem = review.select_one('div.ZmyHeo div div')
                date_elem = review.select_one('p._2NsDsF:nth-of-type(3)')
                author_elem = review.select_one('p._2NsDsF.AwS1CA')
                rating_elem = review.select_one('div.XQDdHH')

            title = title_elem.text.strip() if title_elem else "No title"
            content = content_elem.text.strip() if content_elem else "No content"
            fdate = date_elem.text.strip().partition("on ")[2] if date_elem else "No date"
            date = dateparser.parse(fdate).strftime("%Y-%m-%d") if fdate else "No date"
            author = author_elem.text.strip() if author_elem else "No author"
            rating = rating_elem.text.split(' ')[0] if rating_elem else "No rating"

            reviews.append({
                'title': title,
                'content': content,
                'date': date,
                'author': author,
                'rating': rating,
                'product': product_name,
                'url': url
            })

        page_number += 1

    print(f"Extracted {len(reviews)} reviews from {url}")
    return reviews

def analyze_review(text):
    inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=512)
    outputs = model(**inputs)
    logits = outputs.logits
    probabilities = torch.nn.functional.softmax(logits, dim=-1)
    sentiment = torch.argmax(probabilities, dim=1).item()
    sentiment_map = {0: 'Negative', 1: 'Neutral', 2: 'Positive'}
    
    probabilities = probabilities.squeeze().tolist()
    formatted_probabilities = {
        'Negative': f"{probabilities[0]:.2f}",
        'Neutral': f"{probabilities[1]:.2f}",
        'Positive': f"{probabilities[2]:.2f}"
    }

    return sentiment_map[sentiment], formatted_probabilities

def highlight_sentiment(text):
    doc = nlp(text)
    positive_parts = []
    negative_parts = []
    neutral_parts = []
    improvements = []

    for sent in doc.sents:
        sentiment, _ = analyze_review(sent.text)
        if sentiment == 'Positive':
            positive_parts.append(sent.text)
        elif sentiment == 'Negative':
            negative_parts.append(sent.text)
            for word in sent.text.split():
                word_lower = word.lower()
                if word_lower in improvement_suggestions:
                    improvements.append(improvement_suggestions[word_lower])
        else:
            neutral_parts.append(sent.text)

    return {
        'positive_parts': ' '.join(positive_parts),
        'negative_parts': ' '.join(negative_parts),
        'neutral_parts': ' '.join(neutral_parts),
        'improvements': list(set(improvements))
    }

@app.route('/extract', methods=['POST'])
def extract_and_analyze():
    data = request.json
    url = data.get('url')
    max_reviews = data.get('max_reviews', 10)
    print(f"Received URL: {url} with max reviews: {max_reviews}")
    
    source = "Amazon" if "amazon" in url else "Flipkart"
    
    reviews = extract_reviews(url, max_reviews)
    product_name = reviews[0]['product'] if reviews else "Unknown Product"
    analysis = []
    for review in reviews:
        sentiment, probabilities = analyze_review(review['content'])
        highlighted_parts = highlight_sentiment(review['content'])
        highlighted_review = review['content'][:100] + "..." if len(review['content']) > 100 else review['content']
        analysis.append({
            'title': review['title'],
            'content': review['content'],
            'date': review['date'],
            'author': review['author'],
            'rating': review['rating'],
            'product': review['product'],
            'sentiment': sentiment,
            'probabilities': probabilities,
            'highlighted_review': highlighted_review,
            'positive_parts': highlighted_parts['positive_parts'],
            'negative_parts': highlighted_parts['negative_parts'],
            'neutral_parts': highlighted_parts['neutral_parts'],
            'improvements': highlighted_parts['improvements']
        })
    
    recent_analyses.append({
        'product': product_name,
        'source': source,
        'reviews': analysis
    })

    print(f"Analysis complete for {len(reviews)} reviews")
    return jsonify({'product': product_name, 'source': source, 'reviews': analysis})

@app.route('/generate_wordcloud', methods=['POST'])
def generate_wordcloud():
    data = request.json
    reviews = data.get('reviews', [])
    if not reviews:
        return jsonify({"error": "No reviews provided"}), 400
    
    sentiment_type = data.get('sentiment_type', 'all')
    text = ''
    
    for review in reviews:
        sentiment = review['sentiment']
        if sentiment_type == 'all' or sentiment == sentiment_type.capitalize():
            text += ' ' + review['content']

    wordcloud = WordCloud(width=800, height=400, background_color='white').generate(text)
    
    img = BytesIO()
    wordcloud.to_image().save(img, format='PNG')
    img.seek(0)
    
    return send_file(img, mimetype='image/png')

@app.route('/recent', methods=['GET'])
def get_recent_analyses():
    return jsonify(list(recent_analyses))

@app.route('/recent/clear', methods=['POST'])
def clear_recent_analyses():
    recent_analyses.clear()
    return jsonify({"message": "Recent analyses cleared."})

@app.route('/download_json', methods=['POST'])
def download_json():
    data = request.json
    reviews = data.get('reviews', [])
    
    json_file = json.dumps(reviews)
    return Response(json_file, mimetype='application/json', headers={'Content-Disposition':'attachment;filename=reviews.json'})

if __name__ == '__main__':
    print("Starting Flask server for Analyzer...")
    app.run(debug=True, port=5000, use_reloader=False)