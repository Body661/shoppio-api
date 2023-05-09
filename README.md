# SHOPPIO API - Nodejs e-commerce API

This project's API is a comprehensive e-commerce solution built with Node.js, Express, MongoDB, and various other powerful technologies to provide a secure, robust, and scalable platform. The API enables the handling of users, products, orders, and various other e-commerce functionalities to create a seamless and user-friendly experience.

## Technologies Used
- Node.js
- Express
- AWS
- MongoDB
- Mongoose
- JWT (JSON Web Tokens)
- Helmet.js
- Stripe
- HPP (HTTP Parameter Pollution Protection)
- Multer
- Nodemailer
- Nodemailer-Express-Handlebars
- XSS-clean
- Bcrypt.js
- Sharp
- CORS (Cross-Origin Resource Sharing)
- Express-rate-limit

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

1- Clone the project

```bash
  git clone https://github.com/Body661/shoppio-api.git
```

2- Go to the project directory

```bash
  cd shoppio-api
```

3- Install dependencies

```bash
  npm install
```

4- Set up environment variables

To configure the API with the necessary environment variables, follow these steps:

- Locate the example.env file in the root directory of the project.
- Make a copy of the example.env file and rename it to config.env.
- Open the config.env file and populate it with the required variables.

5- Start the development server:

```bash
  npm run dev
```

6- Access the API at:

```bash
  http://localhost:8000/api/
```
## API Reference

For detailed information on API endpoints, request/response formats, and available features, please refer to the API documentation, available [here](https://documenter.getpostman.com/view/24970774/2s93eR5vuu#2cda6e05-3dad-4adb-b96e-4b8bf94e0e16).
## Authors

- [@Abdolrahman Saleh El Hagrasy](https://www.github.com/body661)


## Feedback

If you have any feedback, please reach out to us at elhagrasy@codenetinc.com

