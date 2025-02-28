import pandas as pd
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib
import numpy as np

# Load dataset
df = pd.read_csv("updated_places_data.csv")

# Handle missing values
df.dropna(inplace=True)

# Encode categorical features
le_location = LabelEncoder()
le_place_to_go = LabelEncoder()

df["Location"] = le_location.fit_transform(df["Location"])  # Encode Location
df["Place_to_Go"] = le_place_to_go.fit_transform(df["Place_to_Go"])  # Encode Target

# Scale temperature values
scaler = StandardScaler()
df["Temperature"] = scaler.fit_transform(df[["Temperature"]])

# Features (X) and Target (y)
X = df[["Temperature", "Location"]]
y = df["Place_to_Go"]

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Hyperparameter tuning using GridSearchCV
param_grid = {
    "n_estimators": [100, 200, 300],  # Number of trees in the forest
    "max_depth": [None, 10, 20]  # Depth of each tree
}
grid_search = GridSearchCV(RandomForestClassifier(random_state=42), param_grid, cv=5, n_jobs=-1)
grid_search.fit(X_train, y_train)

# Train model with best parameters
model = grid_search.best_estimator_

# Evaluate model
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print("Model Accuracy:", accuracy)

# Save trained model
joblib.dump(model, "place_prediction_model.pkl")
joblib.dump(le_location, "location_encoder.pkl")
joblib.dump(le_place_to_go, "place_to_go_encoder.pkl")
joblib.dump(scaler, "temperature_scaler.pkl")

# Predict a new sample
new_temp = 30.0
new_location = "Mumbai"

try:
    # Check if the location exists in the trained encoder
    if new_location not in le_location.classes_:
        raise ValueError(f"Error: '{new_location}' not found in training data locations.")
    
    # Transform new data
    transformed_temp = scaler.transform(np.array([[new_temp]]))[0][0]
    transformed_location = le_location.transform([new_location])[0]

    new_data = pd.DataFrame([[transformed_temp, transformed_location]], 
                             columns=["Temperature", "Location"])

    # Predict place to go
    predicted_place = le_place_to_go.inverse_transform(model.predict(new_data))

    print(f"Predicted Place to Go for {new_temp}°C in {new_location}: {predicted_place[0]}")

except ValueError as e:
    print(e)
