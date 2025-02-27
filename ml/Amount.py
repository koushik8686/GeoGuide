import pandas as pd
import numpy as np
import re
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.base import BaseEstimator, TransformerMixin

class MessageFeatureExtractor(BaseEstimator, TransformerMixin):
    def __init__(self):
        pass
    
    def fit(self, X, y=None):
        return self
    
    def transform(self, X):
        """
        Transform messages into feature matrix
        
        Args:
            X (pd.Series or list): Input messages
        
        Returns:
            np.array: Extracted features
        """
        # Ensure input is a Series or list
        if not isinstance(X, (pd.Series, list)):
            X = pd.Series(X)
        
        # Feature extraction
        features = []
        for message in X:
            # Extract amount
            amount_match = re.search(r'by\s*(\d+(?:\.\d{1,2})?)', str(message))
            amount = float(amount_match.group(1)) if amount_match else 0
            
            # Extract bank/sender
            bank_match = re.search(r'-([\w\s]+)$', str(message))
            sender = bank_match.group(1).strip() if bank_match else 'Unknown'
            
            # Extract account number
            account_match = re.search(r'A/C\s*([X\d]+)', str(message))
            account = account_match.group(1) if account_match else 'Unknown'
            
            features.append([amount, sender, account])
        
        return np.array(features)

class UPIMessageExtractor:
    def __init__(self):
        # Initialize encoders
        self.bank_encoder = LabelEncoder()
        self.account_encoder = LabelEncoder()
        self.recipient_encoder = LabelEncoder()  # New encoder for recipients
        
        # Feature extraction methods
        self.feature_extractor = MessageFeatureExtractor()
        
        # Text vectorization
        self.text_vectorizer = TfidfVectorizer(
            stop_words='english', 
            max_features=5000, 
            ngram_range=(1, 2)
        )
        
        # Preprocessing pipeline
        self.preprocessor = ColumnTransformer(
            transformers=[
                ('text', self.text_vectorizer, 'processed_message'),  # Text vectorization
                ('bank', 'passthrough', ['bank_encoded']),  # Bank encoding
                ('account', 'passthrough', ['account_encoded']),  # Account encoding
                ('recipient', 'passthrough', ['recipient_encoded'])  # Recipient encoding
            ])
    
    def preprocess_text(self, text):
        """Clean text for better vectorization"""
        text = str(text).lower()
        text = re.sub(r'[^a-zA-Z\s]', '', text)
        text = re.sub(r'\s+', ' ', text).strip()
        return text
    
    def extract_bank(self, message):
        """Extract bank from the message"""
        bank_match = re.search(r'-([\w\s]+)$', str(message))
        return bank_match.group(1).strip() if bank_match else 'Unknown'
    
    def _extract_recipient(self, message):
        """
        Extract recipient from the message with improved pattern matching
        
        Args:
            message (str): Input UPI message
        
        Returns:
            str: Extracted recipient name
        """
        # Comprehensive recipient extraction patterns
        recipient_patterns = [
            # Pattern for "trf to" or "transfer to" followed by a name
            r'(?:trf\s+to|transfer\s+to|payment\s+to)\s*([A-Za-z\s]+)(?=\s*Refno|\s*Ref|\s*Call|-)',
            
            # Pattern for names after "to" with potential multi-word names
            r'to\s*([A-Za-z\s]+)(?=\s*Refno|\s*Ref|\s*Call|-)',
            
            # VPA extraction as a fallback
            r'VPA\s*([a-zA-Z0-9@.]+)'
        ]
        
        # Try each pattern
        for pattern in recipient_patterns:
            recipient_match = re.search(pattern, str(message), re.IGNORECASE)
            if recipient_match:
                # Clean and return the recipient name
                recipient = recipient_match.group(1).strip()
                
                # Remove any trailing punctuation or reference numbers
                recipient = re.sub(r'\s*(?:Refno|Ref).*$', '', recipient, flags=re.IGNORECASE)
                
                # Ensure the recipient is not too short or just a single letter
                if len(recipient) > 1:
                    return recipient
        
        # Fallback if no recipient found
        return 'Unknown'
    
    def _extract_amount(self, message):
        """Extract amount from message"""
        amount_patterns = [
            r'by\s*(\d+(?:\.\d{1,2})?)',  # Matches "by 50.0" or "by 5000"
            r'\₹\s?(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?)',  # Indian Rupee ₹
            r'INR\s?(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?)',  # INR format
        ]
        
        for pattern in amount_patterns:
            match = re.search(pattern, str(message))
            if match:
                # Remove commas and convert to float
                amount_str = match.group(1).replace(',', '')
                try:
                    return float(amount_str)
                except ValueError:
                    continue
        
        return 0.0  # Default amount if no match
    
    def _extract_account(self, message):
        """Extract account number from message"""
        account_match = re.search(r'A/C\s*([X\d]+)', str(message))
        return account_match.group(1) if account_match else 'Unknown'
    
    def prepare_dataset(self, messages=None, dataset_path=None):
        """
        Prepare dataset for training
        
        Args:
            messages (list, optional): List of messages
            dataset_path (str, optional): Path to CSV dataset
        
        Returns:
            pd.DataFrame: Prepared dataset
        """
        if messages is not None:
            # Create DataFrame from messages
            df = pd.DataFrame({
                'message': messages,
                'amount': [self._extract_amount(msg) for msg in messages],
                'bank': [self.extract_bank(msg) for msg in messages],
                'account': [self._extract_account(msg) for msg in messages],
                'recipient': [self._extract_recipient(msg) for msg in messages]  # New recipient extraction
            })
        elif dataset_path is not None:
            # Load from CSV
            df = pd.read_csv(dataset_path)
        else:
            raise ValueError("Either messages or dataset_path must be provided")
        
        # Preprocess messages
        df['processed_message'] = df['message'].apply(self.preprocess_text)
        
        # Encode categorical features
        df['bank_encoded'] = self.bank_encoder.fit_transform(df['bank'])
        df['account_encoded'] = self.account_encoder.fit_transform(df['account'])
        df['recipient_encoded'] = self.recipient_encoder.fit_transform(df['recipient'])
        
        return df
    
    def train_extraction_models(self, messages=None, dataset_path=None):
        """
        Train models for extracting UPI message details
        
        Args:
            messages (list, optional): List of messages
            dataset_path (str, optional): Path to CSV dataset
        
        Returns:
            tuple: Trained models for bank, account, recipient, and amount
        """
        # Prepare dataset
        df = self.prepare_dataset(messages, dataset_path)
        
        # Ensure all required columns are present
        if 'processed_message' not in df.columns:
            df['processed_message'] = df['message'].apply(self.preprocess_text)
        
        # Encode categorical features
        df['bank_encoded'] = self.bank_encoder.fit_transform(df['bank'])
        df['account_encoded'] = self.account_encoder.fit_transform(df['account'])
        df['recipient_encoded'] = self.recipient_encoder.fit_transform(df['recipient'])
        
        # Prepare features and labels
        X = df[['processed_message', 'bank_encoded', 'account_encoded', 'recipient_encoded']]
        y_bank = df['bank_encoded']
        y_account = df['account_encoded']
        y_recipient = df['recipient_encoded']
        y_amount = df['amount']
        
        # Function to safely perform stratified split
        def safe_stratified_split(X, y, test_size=0.2, random_state=42):
            # If not enough samples for stratification, fall back to random split
            unique_classes = np.unique(y)
            class_counts = [np.sum(y == cls) for cls in unique_classes]
            
            if len(unique_classes) == 0 or any(count < 2 for count in class_counts):
                return train_test_split(X, y, test_size=test_size, random_state=random_state)
            else:
                return train_test_split(X, y, test_size=test_size, random_state=random_state, stratify=y)
        
        # Split data with safe stratification
        X_train_bank, X_test_bank, y_train_bank, y_test_bank = safe_stratified_split(
            X, y_bank, test_size=0.2, random_state=42
        )
        X_train_account, X_test_account, y_train_account, y_test_account = safe_stratified_split(
            X, y_account, test_size=0.2, random_state=42
        )
        X_train_recipient, X_test_recipient, y_train_recipient, y_test_recipient = safe_stratified_split(
            X, y_recipient, test_size=0.2, random_state=42
        )
        X_train_amount, X_test_amount, y_train_amount, y_test_amount = train_test_split(
            X, y_amount, test_size=0.2, random_state=42
        )
        
        # Create pipelines for each prediction task with more robust configurations
        bank_pipeline = Pipeline([
            ('preprocessor', self.preprocessor),
            ('classifier', RandomForestClassifier(
                n_estimators=200, 
                max_depth=10, 
                min_samples_split=2, 
                min_samples_leaf=1
            ))
        ])
        
        account_pipeline = Pipeline([
            ('preprocessor', self.preprocessor),
            ('classifier', RandomForestClassifier(
                n_estimators=200, 
                max_depth=10, 
                min_samples_split=2, 
                min_samples_leaf=1
            ))
        ])
        
        recipient_pipeline = Pipeline([
            ('preprocessor', self.preprocessor),
            ('classifier', RandomForestClassifier(
                n_estimators=200, 
                max_depth=10, 
                min_samples_split=2, 
                min_samples_leaf=1
            ))
        ])
        
        amount_pipeline = Pipeline([
            ('preprocessor', self.preprocessor),
            ('regressor', RandomForestRegressor(
                n_estimators=200, 
                max_depth=10, 
                min_samples_split=2, 
                min_samples_leaf=1
            ))
        ])
        
        # Train models
        bank_pipeline.fit(X_train_bank, y_train_bank)
        account_pipeline.fit(X_train_account, y_train_account)
        recipient_pipeline.fit(X_train_recipient, y_train_recipient)
        amount_pipeline.fit(X_train_amount, y_train_amount)
        
        # Evaluate models
        print("Bank Model Accuracy:", bank_pipeline.score(X_test_bank, y_test_bank))
        print("Account Model Accuracy:", account_pipeline.score(X_test_account, y_test_account))
        print("Recipient Model Accuracy:", recipient_pipeline.score(X_test_recipient, y_test_recipient))
        print("Amount Model R² Score:", amount_pipeline.score(X_test_amount, y_test_amount))
        
        # Save models and encoders
        joblib.dump({
            'bank_model': bank_pipeline,
            'account_model': account_pipeline,
            'recipient_model': recipient_pipeline,
            'amount_model': amount_pipeline,
            'bank_encoder': self.bank_encoder,
            'account_encoder': self.account_encoder,
            'recipient_encoder': self.recipient_encoder
        }, 'upi_extraction_models.pkl')
        
        print("Models and encoders saved successfully!")
        
        return bank_pipeline, account_pipeline, recipient_pipeline, amount_pipeline
    
    def predict_details(self, message):
        """
        Predict details from a UPI message
        
        Args:
            message (str): Input message
        
        Returns:
            dict: Predicted bank, account, recipient, and amount
        """
        try:
            # Load saved models
            models_path = 'upi_extraction_models.pkl'
            models = joblib.load(models_path)
            
            # Extract bank, account, and recipient
            bank = self.extract_bank(message)
            recipient = self._extract_recipient(message)
            account = self._extract_account(message)
            amount = self._extract_amount(message)
            
            # Preprocess message
            processed_msg = self.preprocess_text(message)
            
            # Handle unseen banks, accounts, and recipients by using a default encoding
            try:
                bank_encoded = models['bank_encoder'].transform([bank])[0]
            except ValueError:
                bank_encoded = -1  # Default value for unseen bank
            
            try:
                account_encoded = models['account_encoder'].transform([account])[0]
            except ValueError:
                account_encoded = -1  # Default value for unseen account
            
            try:
                recipient_encoded = models['recipient_encoder'].transform([recipient])[0]
            except ValueError:
                recipient_encoded = -1  # Default value for unseen recipient
            
            # Prepare input data
            input_data = pd.DataFrame({
                'processed_message': [processed_msg],
                'bank_encoded': [bank_encoded],
                'account_encoded': [account_encoded],
                'recipient_encoded': [recipient_encoded]
            })
            
            # Predict bank, account, recipient, and amount
            bank_pred = models['bank_model'].predict(input_data)[0]
            account_pred = models['account_model'].predict(input_data)[0]
            recipient_pred = models['recipient_model'].predict(input_data)[0]
            amount_pred = models['amount_model'].predict(input_data)[0]
            
            # Decode predictions
            decoded_bank = models['bank_encoder'].inverse_transform([bank_pred])[0]
            decoded_account = models['account_encoder'].inverse_transform([account_pred])[0]
            decoded_recipient = models['recipient_encoder'].inverse_transform([recipient_pred])[0]
            
            return {
                'bank': decoded_bank,
                'account': decoded_account,
                'recipient': decoded_recipient if decoded_recipient != 'Unknown' else recipient,
                'amount': round(amount_pred if amount_pred > 0 else amount, 2)
            }
        except FileNotFoundError:
            # Train models if not found
            self.train_extraction_models(messages=[
                "Dear UPI user A/C X7854 debited by 60.0 on date 08Feb25 trf to Bobie Refno 503940628440. If not u? call 1800111109. -SBI",
                "UPI Alert: A/C X1234 credited ₹5000.00 on 15Feb25 trf to John Smith. Ref 789456. Call 18001234. -HDFC",
                "Transaction Alert: A/C X9876 debited ₹350.50 on 20Jan25 trf to Sarah Johnson. Ref No: 456123. -Axis"
            ])
            # Retry prediction
            return self.predict_details(message)
        except Exception as e:
            # Handle any other unexpected errors
            return {
                'error': str(e),
                'bank': bank,
                'account': account,
                'recipient': recipient,
                'amount': amount
            }

# Example usage
if __name__ == "__main__":
    extractor = UPIMessageExtractor()
    
    # Train models with sample messages
    extractor.train_extraction_models(messages=[
        "Dear UPI user A/C X7854 debited by 60.0 on date 08Feb25 trf to Bobie Refno 503940628440. If not u? call 1800111109. -SBI",
        "UPI Alert: A/C X1234 credited ₹5000.00 on 15Feb25 trf to John Smith. Ref 789456. Call 18001234. -HDFC",
        "Transaction Alert: A/C X9876 debited ₹350.50 on 20Jan25 trf to Sarah Johnson. Ref No: 456123. -Axis",
        "Dear Customer: A/C X5432 credited by 2500.75 on 12Feb25 trf to Emily Davis. Ref 987654. Call 18009876. -Kotak",
        "UPI Transaction: A/C X2109 debited ₹750.25 on 05Apr25 trf to Michael Brown. Ref 456789. -PNB"
    ])
    
    # Test predictions
    test_messages = [
        "Dear UPI user A/C X7854 debited by 50.0 on date 20Feb25 trf to Bobie Refno 123456789. If not u? call 1800111109. -SBI",
        "UPI Alert: A/C X1234 credited ₹4500.00 on 25Feb25 trf to John Smith. Ref 654321. Call 18001234. -HDFC",
        "Transaction Alert: A/C X9876 debited ₹375.50 on 10Mar25 trf to Sarah Johnson. Ref No: 789012. -Axis"
    ]
    
    print("\nPrediction Results:")
    for msg in test_messages:
        prediction = extractor.predict_details(msg)
        print(f"\nMessage: {msg}")
        print("Prediction:", prediction)