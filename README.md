# Mcq-web application




































```
.
└── MCQ-App
    |
    ├── .github
    |   └── work
    |       ├── docker-compose-image.yml   // Docker Compose file for building Docker images
    |       └── testing.yml                // Testing workflow configuration file
    |
    ├── client                              // Frontend directory for the client-side application
    |   ├── cypress                         // Directory for end-to-end testing using Cypress
    |   ├── public                          // Public assets and static files
    |   ├── src 
    |   |    ├── components                 // Frontend components (e.g., Navbar, Footer)
    |   |    ├── images                     // Images used in the frontend
    |   |    └── pages                      // Frontend pages
    |   ├── cypress.config.js               // Cypress configuration file
    |   ├── Dockerfile                      // Docker configuration file for building the client image
    |   ├── jest.config.js                  // Jest configuration file for frontend testing
    |   ├── package-lock.json
    |   ├── package.json
    |   └── .gitignore                      // Gitignore file to specify files and directories to be ignored by Git
    |
    ├── dashboard                           // Admin dashboard directory
    |   ├── public
    |   ├── src
    |   |    ├── components                 // Components for the admin dashboard
    |   |    └── pages                      // Admin dashboard pages
    |   ├── Dockerfile                      // Docker configuration file for building the dashboard image
    |   ├── .gitignore                      // Gitignore file for the dashboard
    |   ├── package-lock.json
    |   └── package.json
    |    
    ├── server                              // Backend server directory
    |   ├── models                          // Database models
    |   ├── routes                          // API routes
    |   ├── test                            // Test files for server testing
    |   ├── .dockerignore                   // Dockerignore file for excluding files from Docker build
    |   ├── .gitignore                      // Gitignore file for the server
    |   ├── app.js                          // Main application file
    |   ├── Dockerfile                      // Docker configuration file for building the server image
    |   ├── server.js                       // Server entry point
    |   ├── package-lock.json
    |   └── package.json
    |   
    ├── docker-compose.yml                  // Docker Compose file for defining services, networks, and volumes
    └── README.md                            // Readme file providing information about the MCQ application

```