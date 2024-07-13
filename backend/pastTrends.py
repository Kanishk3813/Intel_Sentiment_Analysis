from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)

# Load the cleaned CSV file into a DataFrame
file_path = 'backend/output.csv'
df = pd.read_csv(file_path)
df['date'] = pd.to_datetime(df['date'],format = "%d-%m-%Y")

@app.route('/past-trends', methods=['GET'])
def get_past_trends():
    # Extract product names
    products = df['category'].unique()
    
    trends = []
    for product in products:
        product_df = df[df['category'] == product]
        product_trends = {
            'product': "Intel Core "+product+" Processor",
            'description': f'Sentiment analysis for {product}.',
            'sentiments': {
                'positive': int((product_df['sentiment'] == 'Positive').sum()),
                'neutral': int((product_df['sentiment'] == 'Neutral').sum()),
                'negative': int((product_df['sentiment'] == 'Negative').sum())
            },
            'dates': product_df['date'].dt.strftime('%Y-%m-%d').tolist(),
            'reviews': product_df['content'].tolist()
        }
        trends.append(product_trends)
        # print("Trends:", trends)
    
    return jsonify(trends)

if __name__ == '__main__':
    print("Starting Flask server for Past Trends...")
    app.run(debug=True, port=5001, use_reloader=False)
