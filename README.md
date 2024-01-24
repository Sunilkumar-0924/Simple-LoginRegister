Simple-LoginRegister
This project is built using Node.js for the backend and Express for routing. It also incorporates HTML and CSS for the frontend, demonstrating a simple and clean user interface. MongoDB is used for database along with make automation services to connect to the database for querying

Getting Started
Prerequisites
Make sure you have the following installed on your machine:

Node.js
npm (Node Package Manager)

Installation

Clone the repository:
git clone https://github.com/your-username/Simple-LoginRegister.git

Navigate to the project directory:
cd Simple-LoginRegister

Install the required packages:
npm install nodejs, express, mongoose, ejs, nodemailer

Usage
Open a terminal and run the following command to start the local server:
node app.js

Open your web browser and go to http://localhost:3000.
The application should be up and running. You can now register a new account, log in, and explore the authentication features.

Frontend and Styling
The front end is built using HTML and styled with CSS. The views are rendered using the EJS templating engine. To customize the frontend or styles:
Navigate to the public directory for static assets such as CSS.
The views directory contains EJS templates. Feel free to modify these files to enhance the user interface.

Sending Emails
This project uses Nodemailer to send emails through the SMTP protocol. To test the email functionality:

Open the config.js file and update the email configuration with your SMTP server details.

After updating the configuration, restart the application using:
node app.js
Register a new account, and the application will send a confirmation email to the provided email address.

Packages Used
express: Fast, unopinionated, minimalist web framework for Node.js.
nodemailer: Send e-mails from Node.js – easy as cake!
body-parser: Node.js body parsing middleware.
ejs: Embedded JavaScript templates for Node.js.
mongoose: MongoDB object modeling tool designed to work in an asynchronous environment.
bcryptjs: Optimized bcrypt in JavaScript with zero dependencies.
