# Mcq-web application

ChemX is an innovative system designed to boost students' chemistry performance. It offers features for students to answer questions, with results displayed through charts. The system prioritizes categories based on students' previous performance. It includes a forum for discussions and allows teachers to add questions, overseen by administrators who manage users and the question database.


# Install Dependencies and run the project

**For Backend** 

#open bash server
`cd Application ` 
`cd Server ` 
`npm i` 
`nodemon server.js`







# Technologies Used:
**Frontend**: HTML,css,javascript
**Backend**: Node.js, Express.js ,python
**Database**: MongoDB atlas




```
.
└── MCQ-App
    |
    ├── Application
    |   |
    |   ├── Admin_side
    |   |   ├── admin-images
    |   |   ├── components
    |   |   ├── js
    |   |   ├── style
    |   |   ├── alogin.html
    |   |   ├── dashboard.html
    |   |   └── questions.html
    |   |
    |   ├── Client_side
    |   |   ├── components
    |   |   ├── js
    |   |   ├── images
    |   |   ├── style
    |   |   ├── aboutus.html
    |   |   ├── chat.html
    |   |   ├── index.html
    |   |   ├── login.html
    |   |   ├── register.html
    |   |   ├── s-home.html
    |   |   ├── s-profile.html
    |   |   ├── t-home.html
    |   |   └── t-profile.html
    |   |
    |   └── Server
    |       ├── database
    |       |   └── connection.js
    |       ├── middlewares
    |       |   ├── authMiddleware.js
    |       |   └── fileUploadMiddleware.js

    |       ├── models
    |       |   ├── Questions.js
    |       |   ├── admin.js
    |       |   ├── comments.js
    |       |   ├── Discussion.js
    |       |   ├── results.js
    |       |   └── Users.js
    |       ├── routes
    |       |   ├── Questions.js
    |       |   ├── Q-bank.js
    |       |   ├── admin.js
    |       |   ├── results.js
    |       |   ├── comments.js
    |       |   ├── admin.js
    |       |   └── Users.js
    |       ├── .env
    |       ├── .gitignore
    |       ├── LR_model.pkl
    |       ├── keyword_extraction.py
    |       ├── predict.py
    |       ├── retrain.py
    |       ├── package.json
    |       ├── package-lock.json
    |       └── server.js
    |
    └── README.md
```