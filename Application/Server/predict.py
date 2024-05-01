import pandas as pd
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import LabelEncoder
import joblib

def make_predictions(new_data):
    # Load the KNN model from the joblib file
    try:
        knn_model = joblib.load('Application/Server/KNN_model.pkl')   
        if not isinstance(knn_model, KNeighborsClassifier):
            raise ValueError("Error: The loaded model is not an instance of KNeighborsClassifier.")
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
        training_keywords = joblib.load('Application/Server/encoded_keywords.pkl')
    except FileNotFoundError:
        print("Error: Training keywords file not found.")
        return None

    for keyword in training_keywords:
        if keyword in keywords.columns:
            new_data[keyword] = 1
        else:
            new_data[keyword] = 0

    # Drop the original 'Category', 'Difficulty_Level', 'Keywords', and 'Student_ID' columns
    new_data.drop(['Category', 'Difficulty_Level', 'Keywords', 'Student_ID'], axis=1, inplace=True)

    # Make predictions using the KNN model
    try:
        # Get the feature names from the training data
        feature_names = new_data.columns.tolist()

        # Reorder the DataFrame columns to match the order of features used during training
        new_data = new_data[feature_names]

        # Make predictions
        predictions = knn_model.predict(new_data)
        return predictions
    except AttributeError as e:
        print("Error: Unable to make predictions using the loaded model. Details:", str(e))
        return None
    except Exception as e:
        print("An unexpected error occurred:", str(e))
        return None

# New data
new_data = pd.DataFrame({
    'Student_ID': ['661e3da01741a36959ce1630'],
    'Round': [3],
    'Category': ['Organic'],
    'Difficulty_Level': ['Easy'],
    'Keywords': ['increasing,acid']
})

# Make predictions
predictions = make_predictions(new_data)
print(new_data)
if predictions is not None:
    print("Predictions:", predictions)
