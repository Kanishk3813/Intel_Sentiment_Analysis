# Review Analyzer

## Overview

Review Analyzer is a powerful tool designed to help businesses understand customer sentiments through automated analysis of reviews. This project leverages state-of-the-art NLP techniques to classify reviews, highlight key sentiments, generate word clouds, and visualize trends over time. 

## Features

- **Automated Sentiment Analysis**: Utilizes the BERT model to classify reviews into positive, neutral, or negative categories. Additionally, it highlights the positive and negative parts of each review and provides improvement suggestions based on negative feedback.
- **Word Cloud Generation**: Creates a visual representation of the most frequently mentioned words in the reviews, helping users quickly identify common themes and topics.
- **Past Trends Visualization**: Graphical representation of review sentiments over different periods, allowing businesses to track changes in customer perception over time.
- **CSV Upload**: Users can easily upload a CSV file containing reviews, enabling batch processing and analysis of large datasets.
- **Downloadable Reports**: Analyzed data can be downloaded in JSON format, providing users with detailed reports for further analysis and record-keeping.

## Technologies Used

### Frontend
- React
- Axios
- Chart.js

### Backend
- Flask
- Python
- BERT (Hugging Face Transformers)

### Data Handling
- Pandas
- Spacy

### Visualization
- WordCloud
- Matplotlib

### Deployment
- Vercel (for frontend)
- Backend server

### Training the Model
- PyTorch
- Transformers
- TensorFlow

## Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/Kanishk3813/Intel_Sentiment_Analysis.git
    ```

2. **Backend Setup**:
    - Create a virtual environment and activate it:
        ```bash
        python -m venv venv
        source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
        ```
    - Install the required Python packages:
        ```bash
        pip install -r api/shared/requirements.txt
        ```
    - **Download the BERT model**:
        - Download the BERT model from [this Google Drive link](https://drive.google.com/file/d/14QfV6USLLzlzb13_T8kFuGi6OmZppft2/view?amp;usp=embed_facebook) and place it inside the `backend/bert_model` folder.

    - **Create a .env file** in the `backend` folder with the following content:
        ```plaintext
        SCRAPER_API_KEY='ccceef77d6a524862c0c12aa202ff659'
        ```

3. **Frontend Setup**:
    - Navigate to the root directory and install the necessary packages:
        ```bash
        npm install
        ```

## Usage

### Running Locally

1. **Start the application**:
    ```bash
    npm start
    ```

## Future Enhancements

- **Enhanced Sentiment Analysis**: Support for multi-language and emotion detection.
- **Real-Time Analysis**: Real-time review fetching and sentiment tracking.
- **User Feedback Integration**: Feedback loop for improved accuracy.
- **Advanced Visualization Tools**: Interactive and dynamic visualizations.
- **Social Media Integration**: Track sentiments from social media platforms.
- **Aspect-Based Sentiment Analysis**: Detailed aspect-based sentiment reports.
- **Predictive Analysis**: Predict future trends based on historical data.

## Contributing

Contributions are welcome! Please read the [contribution guidelines](CONTRIBUTING.md) first.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

