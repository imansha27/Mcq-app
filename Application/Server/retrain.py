import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
import joblib

# Load the original training data used to train the initial logistic regression model
try:
    original_data = pd.read_csv('path_to_training_data.csv')  # Update path
except FileNotFoundError:
    print("Error: Training data file not found.")

# Append the new data to the original training data
new_data = pd.DataFrame({
    "Student_ID": ["660e224f2577d04ccfbecc71"],
    "Round": [3],
    "Category": ["Organic"],
    "Difficulty_Level": ["Hard"],
    "Keywords": ["water"]
})

concatenated_data = pd.concat([original_data, new_data], ignore_index=True)

# Split concatenated data into features and labels
X = concatenated_data.drop('Target_Column_Name', axis=1)  # Update with your target column
y = concatenated_data['Target_Column_Name']  # Update with your target column

# Initialize LabelEncoder for categorical columns if necessary
label_encoder = LabelEncoder()

# Encode categorical columns
X['Category_encoded'] = label_encoder.fit_transform(X['Category'])
X['Difficulty_Level_encoded'] = label_encoder.fit_transform(X['Difficulty_Level'])

# Drop original categorical columns
X.drop(['Category', 'Difficulty_Level'], axis=1, inplace=True)

# Split data into train and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Initialize a new logistic regression classifier
logistic_model_new = LogisticRegression()  # You can adjust hyperparameters as needed

# Train the new logistic regression classifier on the concatenated data
logistic_model_new.fit(X_train, y_train)

# Save the trained model
joblib.dump(logistic_model_new, 'Application/Server/Logistic_model_updated.pkl')

print("Model retrained and saved successfully.")

