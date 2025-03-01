from flask import Flask, request, jsonify
import joblib
import numpy as np
from Amount import UPIMessageExtractor
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
import random

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

# Define all possible tags for recommendations
all_possible_tags = {
    "restaurant", "cafe", "bakery", "bar", "shopping_mall", "supermarket", 
    "hospital", "gym", "spa", "park", "museum", "movie_theater", "hotel",
    "bank", "pharmacy", "school", "library", "zoo", "beach", "mountain"
}

# Define category relationships for better recommendations
category_relationships = {
    "food": ["restaurant", "cafe", "bakery", "bar"],
    "shopping": ["shopping_mall", "supermarket"],
    "health": ["hospital", "gym", "spa", "pharmacy"],
    "entertainment": ["park", "museum", "movie_theater", "zoo"],
    "education": ["school", "library"],
    "nature": ["beach", "mountain", "park"],
    "accommodation": ["hotel"]
}

# Create reverse mapping for categories
category_mapping = {}
for category, places in category_relationships.items():
    for place in places:
        category_mapping[place] = category

class RecommendationModel:
    def __init__(self):
        self.user_similarity = None
        self.user_tag_matrix = None
        self.df = None
        self.last_training_time = None
        self.category_weights = None
        
    def train(self, history_data):
        """
        Train the recommendation model with new history data
        
        Parameters:
            history_data (list): List of history entries with user, tag, and count
        """
        try:
            # Convert history data to DataFrame with timestamp
            self.df = pd.DataFrame(history_data)
            
            # Add time decay factor (more recent visits have higher weight)
            if 'timestamp' in self.df.columns:
                self.df['time_weight'] = self.df['timestamp'].apply(
                    lambda x: np.exp(-0.1 * (pd.Timestamp.now() - pd.Timestamp(x)).days)
                )
            else:
                self.df['time_weight'] = 1.0
            
            # Weighted count based on time
            self.df['weighted_count'] = self.df['count'] * self.df['time_weight']
            
            # Create user-tag matrix with weighted counts
            self.user_tag_matrix = self.df.pivot_table(
                index='user',
                columns='tag',
                values='weighted_count',
                aggfunc='sum',
                fill_value=0
            )
            
            # Calculate category weights for each user
            self.category_weights = {}
            for user in self.user_tag_matrix.index:
                user_tags = self.df[self.df['user'] == user]
                category_counts = {}
                for _, row in user_tags.iterrows():
                    tag = row['tag']
                    category = category_mapping.get(tag, 'other')
                    category_counts[category] = category_counts.get(category, 0) + row['weighted_count']
                self.category_weights[user] = category_counts
            
            # Compute user similarity matrix with category weights
            self.user_similarity = pd.DataFrame(
                cosine_similarity(self.user_tag_matrix),
                index=self.user_tag_matrix.index,
                columns=self.user_tag_matrix.index
            )
            
            self.last_training_time = pd.Timestamp.now()
            return True
            
        except Exception as e:
            print(f"Error training model: {str(e)}")
            return False
    
    def save_model(self, filepath='recommendation_model.pkl'):
        """Save the trained model to disk"""
        try:
            model_data = {
                'user_similarity': self.user_similarity,
                'user_tag_matrix': self.user_tag_matrix,
                'df': self.df,
                'last_training_time': self.last_training_time,
                'category_weights': self.category_weights
            }
            joblib.dump(model_data, filepath)
            return True
        except Exception as e:
            print(f"Error saving model: {str(e)}")
            return False
    
    def load_model(self, filepath='recommendation_model.pkl'):
        """Load the trained model from disk"""
        try:
            model_data = joblib.load(filepath)
            self.user_similarity = model_data['user_similarity']
            self.user_tag_matrix = model_data['user_tag_matrix']
            self.df = model_data['df']
            self.last_training_time = model_data['last_training_time']
            self.category_weights = model_data['category_weights']
            return True
        except Exception as e:
            print(f"Error loading model: {str(e)}")
            return False

# Initialize the recommendation model
recommendation_model = RecommendationModel()
try:
    recommendation_model.load_model()
except:
    print("No existing model found. Will train on first request.")

def recommend_tags_for_user(history_data, user_id, top_n=6):
    """
    Recommend tags based on user history and similar users' preferences.
    Returns recommendations with confidence scores and diversity.
    Default to 6 recommendations for better variety.
    """
    try:
        # Use the trained model if available
        if recommendation_model.user_similarity is not None:
            user_similarity = recommendation_model.user_similarity
            df = recommendation_model.df
            category_weights = recommendation_model.category_weights
        else:
            # Train model if not available
            recommendation_model.train(history_data)
            user_similarity = recommendation_model.user_similarity
            df = recommendation_model.df
            category_weights = recommendation_model.category_weights
        
        tags_in_history = set(df["tag"].unique())
        
        if user_id not in user_similarity.index:
            # Enhanced cold-start handling
            popular_tags = df.groupby('tag')['weighted_count'].sum().sort_values(ascending=False)
            
            # Ensure category diversity
            recommendations = []
            used_categories = set()
            
            for tag in popular_tags.index:
                category = category_mapping.get(tag, 'other')
                if category not in used_categories and len(recommendations) < top_n:
                    recommendations.append({
                        'tag': tag,
                        'confidence': float(popular_tags[tag] / popular_tags.max()),
                        'reason': 'Popular choice in this category'
                    })
                    used_categories.add(category)
            
            # Fill remaining slots with unexplored tags
            remaining_slots = top_n - len(recommendations)
            if remaining_slots > 0:
                unvisited_tags = list(all_possible_tags - tags_in_history)
                random.shuffle(unvisited_tags)
                for tag in unvisited_tags[:remaining_slots]:
                    recommendations.append({
                        'tag': tag,
                        'confidence': 0.3,  # Lower confidence for unexplored tags
                        'reason': 'New experience suggestion'
                    })
            
            return recommendations
        
        # Get user's preferred categories
        user_categories = category_weights.get(user_id, {})
        total_weight = sum(user_categories.values()) if user_categories else 1
        normalized_category_weights = {k: v/total_weight for k, v in user_categories.items()}
        
        # Calculate recommendations with category boost
        similar_users = user_similarity[user_id].drop(user_id).sort_values(ascending=False)
        user_tags = set(df[df['user'] == user_id]['tag'])
        
        recommendations = {tag: {'score': 0, 'similar_users': 0} for tag in all_possible_tags}
        
        for similar_user in similar_users.index:
            similar_user_tags = set(df[df['user'] == similar_user]['tag'])
            similarity_score = user_similarity[user_id][similar_user]
            
            for tag in all_possible_tags:
                if tag not in user_tags:
                    category = category_mapping.get(tag, 'other')
                    category_boost = normalized_category_weights.get(category, 0.1)
                    
                    if tag in similar_user_tags:
                        recommendations[tag]['score'] += similarity_score * (1 + category_boost)
                        recommendations[tag]['similar_users'] += 1
        
        # Calculate confidence scores and add diversity
        scored_recommendations = []
        used_categories = set()
        
        for tag, data in recommendations.items():
            if data['similar_users'] > 0:
                category = category_mapping.get(tag, 'other')
                confidence = min(1.0, (data['score'] / data['similar_users']) * 
                               (1 + normalized_category_weights.get(category, 0.1)))
                
                scored_recommendations.append({
                    'tag': tag,
                    'confidence': float(confidence),
                    'category': category,
                    'raw_score': data['score']
                })
        
        # Sort by score but ensure category diversity
        scored_recommendations.sort(key=lambda x: x['raw_score'], reverse=True)
        diverse_recommendations = []
        
        # First pass: select highest scoring items from different categories
        for rec in scored_recommendations:
            if len(diverse_recommendations) >= top_n:
                break
            if rec['category'] not in used_categories:
                diverse_recommendations.append({
                    'tag': rec['tag'],
                    'confidence': rec['confidence'],
                    'reason': f"Based on similar users' preferences in {rec['category']}"
                })
                used_categories.add(rec['category'])
        
        # Second pass: fill remaining slots with highest scoring items
        remaining_slots = top_n - len(diverse_recommendations)
        if remaining_slots > 0:
            for rec in scored_recommendations:
                if len(diverse_recommendations) >= top_n:
                    break
                if not any(d['tag'] == rec['tag'] for d in diverse_recommendations):
                    diverse_recommendations.append({
                        'tag': rec['tag'],
                        'confidence': rec['confidence'],
                        'reason': f"Highly recommended place in {rec['category']}"
                    })
        
        return diverse_recommendations
        
    except Exception as e:
        print(f"Error in recommendation engine: {str(e)}")
        # Fallback recommendations with low confidence
        return [{'tag': tag, 'confidence': 0.2, 'reason': 'Fallback recommendation'} 
                for tag in list(all_possible_tags)[:top_n]]

@app.route('/', methods=['GET'])
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

@app.route('/recommend_tags', methods=['POST'])
def get_tag_recommendations():
    """
    Endpoint to get tag recommendations based on user history
    Expects a JSON payload with:
    {
        "user_id": "string",
        "history": [
            {
                "user": "string",
                "tag": "string",
                "count": number
            }
        ],
        "top_n": number (optional, defaults to 6)
    }
    """
    try:
        data = request.get_json(force=True)
        user_id = data.get('user_id')
        history = data.get('history', [])
        top_n = data.get('top_n', 6)  # Changed default to 6
        
        if not user_id:
            return jsonify({'error': 'No user_id provided'}), 400
            
        if not history:
            return jsonify({'error': 'No history data provided'}), 400
            
        recommendations = recommend_tags_for_user(history, user_id, top_n)
        
        return jsonify({
            'user_id': user_id,
            'recommendations': recommendations
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/retrain_model', methods=['POST'])
def retrain_model():
    """
    Endpoint to retrain the recommendation model with new history data
    Expects a JSON payload with:
    {
        "history": [
            {
                "user": "string",
                "tag": "string",
                "count": number
            }
        ],
        "save_model": boolean (optional)
    }
    """
    try:
        data = request.get_json(force=True)
        history = data.get('history', [])
        save_model = data.get('save_model', True)
        
        if not history:
            return jsonify({'error': 'No history data provided'}), 400
        
        # Train the model with new data
        success = recommendation_model.train(history)
        
        if success and save_model:
            recommendation_model.save_model()
        
        return jsonify({
            'status': 'success' if success else 'error',
            'message': 'Model retrained successfully' if success else 'Error retraining model',
            'last_training_time': str(recommendation_model.last_training_time)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)