from flask import Flask, request, jsonify
import joblib
import numpy as np
from Amount import UPIMessageExtractor

# Initialize Flask app
app = Flask(__name__)

# Load pre-trained model and label encoder
try:
    model = joblib.load('upi_classifier_model.pkl')
    label_encoder = joblib.load('sender_label_encoder.pkl')
except FileNotFoundError:
    from model import train_upi_classifier
    model, label_encoder = train_upi_classifier()

# Initialize the message extractor
message_extractor = UPIMessageExtractor()

@app.route('/' , methods=['GET'])
def home():
    """
    Home page
    """
    return "Welcome to the UPI classification model!"

@app.route('/predict', methods=['POST'])
def predict():
    """
    Endpoint to predict if a message is a UPI message
    Expects a JSON payload with a 'message' key
    Returns the prediction, confidence, and sender details
    """
    try:
        # Get the message from the request
        data = request.get_json(force=True)
        message = data.get('message', '')
        if not message:
            return jsonify({'error': 'No message provided'}), 400

        # Use the predict_upi_message function from model.py
        from model import predict_upi_message
        prediction_result = predict_upi_message(model, label_encoder, message)

        return jsonify({
            'is_upi': prediction_result['is_upi'],
            'confidence': str(prediction_result['upi_probability']),
            'sender': prediction_result['sender'],
            'details': prediction_result['details']
        })
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 400

@app.route('/extract_details', methods=['POST'])
def extract_details():
    """
    Endpoint to extract sender, merchant, and amount details from a UPI message
    Expects a JSON payload with a 'message' key
    Returns the extracted details including recipient
    """
    try:
        # Get the message from the request
        data = request.get_json(force=True)
        message = data.get('message', '')
        
        if not message:
            return jsonify({'error': 'No message provided'}), 400

        # Extract details using the UPIMessageExtractor
        details = message_extractor.predict_details(message)
        
        return jsonify(details)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)