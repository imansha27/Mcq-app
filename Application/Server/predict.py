import sys
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import LabelEncoder
import joblib
import io
import json 

# Function to make predictions
def make_predictions(new_data):
    # Load the LR model from the joblib file
    try:
        LR_model = joblib.load('LR_model.pkl')
        if not isinstance(LR_model, LogisticRegression):
            raise ValueError("Error: The loaded model is not an instance of LogisticRegression.")
    except FileNotFoundError:
        print("Error: Model file not found.")
        return None

    # One-hot encode 'Category' and 'Difficulty_Level' columns
    label_encoder = LabelEncoder()
    new_data['Category_encoded'] = label_encoder.fit_transform(new_data['Category'])
    new_data['Difficulty_Level_encoded'] = label_encoder.fit_transform(new_data['Difficulty_Level'])

    # Label encode 'Student_ID' column
    new_data['Student_ID_encoded'] = label_encoder.fit_transform(new_data['Student_ID'])

    # Create new columns for each keyword and assign 1 if present, 0 otherwise
    keywords = new_data['Keywords'].str.get_dummies(sep=', ')

    # Load training keywords from joblib file
    try:
        training_keywords = joblib.load('encoded_keywords.pkl')
    except FileNotFoundError:
        print("Error: Training keywords file not found.")
        return None

    # Create a list to hold the DataFrames of keyword columns
    keyword_dfs = []
    for keyword in training_keywords:
        if keyword and keyword in keywords.columns:
            keyword_dfs.append(pd.DataFrame({keyword: keywords[keyword].fillna(0)}))
        else:
            keyword_dfs.append(pd.DataFrame({keyword: 0}, index=keywords.index))

    # Concatenate all keyword DataFrames along axis 1 (columns)
    new_data = pd.concat([new_data] + keyword_dfs, axis=1)

    # Drop the original 'Category', 'Difficulty_Level', 'Keywords', and 'Student_ID' columns
    new_data.drop(['Category', 'Difficulty_Level', 'Keywords', 'Student_ID'], axis=1, inplace=True)

    # Make predictions using the LR model
    try:
        # Get the feature names from the training data
        feature_names = new_data.columns.tolist()

        # Reorder the DataFrame columns to match the order of features used during training
        new_data = new_data[feature_names]

        # Make predictions
        predictions = LR_model.predict(new_data)
        return predictions.tolist()  # Convert predictions to list for serialization
    except AttributeError as e:
        print("Error: Unable to make predictions using the loaded model. Details:", str(e))
        return None
    except Exception as e:
        print("An unexpected error occurred:", str(e))
        return None

# Read input data from stdin
input_data = sys.stdin.read()
input_data = io.StringIO(input_data)  # Create a file-like object from the JSON string
input_data = pd.read_json(input_data)

# Make predictions
predictions = make_predictions(input_data)

# Serialize predictions to JSON
predictions_json = json.dumps(predictions)  # Serialize predictions to JSON format

# Write predictions to stdout
if predictions is not None:
    print(predictions_json)  # Print JSON-formatted predictions
    
