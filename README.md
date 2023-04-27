
# SHOPPIO API - Nodejs e-commerce API

This project's API is a comprehensive e-commerce solution built with Node.js, Express, MongoDB, and various other powerful technologies to provide a secure, robust, and scalable platform. The API enables the handling of users, products, orders, and various other e-commerce functionalities to create a seamless and user-friendly experience.

## Features
- User authentication and authorization with JWT
- Secure password hashing with Bcrypt.js
- Image uploading and processing with Multer and Sharp
- Email notifications using Nodemailer and Nodemailer-Express-Handlebars
- Payment processing with Stripe
- Protection against XSS and HTTP Parameter Pollution attacks
- Rate limiting for API requests
- CORS support for cross-origin requests
- Robust error handling and validation

## Directory Structure
The API follows a clear and organized directory structure to ensure maintainability and ease of understanding. The structure is as follows:

- `Config`: Contains the database configuration file and other necessary configurations.
- `Controllers`: Houses the controllers responsible for handling HTTP requests and business logic.
- `Middlewares`: Contains custom middleware functions for error handling, image uploading, and validation purposes.
- `Models`: Consists of the models used for interacting with the database and defining data structures.
- `Routes`: Contains all the route definitions, which map URLs to specific controller functions.
- `Templates`: Houses all the email templates used by the Nodemailer-Express-Handlebars integration for sending emails.
- `Uploads`: Stores all the uploaded images, which are processed and saved by Multer and Sharp.
- `Utils`: Contains a set of utility functions that are used across multiple components, such as error handling and response formatting.
## Run Locally

Clone the project

```bash
  git clone https://github.com/Body661/nodejs-ecommerce-api.git
```

Go to the project directory

```bash
  cd nodejs-ecommerce-api
```

Install dependencies

```bash
  npm install
```

Set up environment variables

To configure the API with the necessary environment variables, follow these steps:

- Locate the example.env file in the root directory of the project.
- Make a copy of the example.env file and rename it to config.env.
- Open the config.env file and populate it with the required variables, as described below:

```bash
PORT=8000
NODE_ENV=development
BASE_URL=http://localhost:8000

# Database
DB_USER=YOUR_DB_USER
DB_PASSWORD=YOUR_DB_PASSWORD
DB_NAME=YOUR_DB_NAME
DB_URL=YOUR_DB_URL

# JWT
SECRET_KEY=YOUR_SECRET_KEY

# Email
EMAIL_HOST=YOUR_EMAIL_HOST
EMAIL_PORT=YOUR_EMAIL_PORT
EMAIL_SECURE=YOUR_EMAIL_SECURE
EMAIL_USER=YOUR_EMAIL_USER
EMAIL_PASSWORD=YOUR_EMAIL_PASSWORD

# Stripe
STRIPE_SECRET_KEY=YOUR_STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET=YOUR_STRIPE_WEBHOOK_SECRET

FRONTEND_URL=YOUR_FRONTEND_URL

```

Start the development server:

```bash
  npm run dev
```

Access the API at:

```bash
  http://localhost:8000/api/
```
## API Reference

For detailed information on API endpoints, request/response formats, and available features, please refer to the API documentation, available [here](https://documenter.getpostman.com/view/24970774/2s93eR5vuu#2cda6e05-3dad-4adb-b96e-4b8bf94e0e16).
