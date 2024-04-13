# Startoon Labs Web Application

Welcome to the Startoon Labs Web Application repository! This repository contains the backend code for the Startoon Labs Web Application, built using Node.js, Express, and MongoDB.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Setup](#setup)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Overview

The Startoon Labs Web Application is a full-stack web application that provides various functionalities for users, admins, and authentication. It includes features such as user signup, login, password change, admin access to user data, user statistics, and more.

## Features

- User authentication (signup, login, password change)
- Admin functionalities (access to user data, login activity, user statistics)
- MongoDB database integration with Mongoose
- JWT-based authentication
- CORS support
- Error handling and validation

## Setup

To set up the Startoon Labs Web Application locally, follow these steps:

1. Clone this repository to your local machine.
2. Install the dependencies using npm:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:

   ```plaintext
   PORT=4500
   MONGO_URI=<your MongoDB connection URI>
   JWT_SECRET=<your JWT secret key>
   ```

4. Run the application using the following command:

   ```bash
   npm start
   ```

5. Access the application at `http://localhost:4500`.

## API Documentation

For detailed documentation of the APIs provided by the Startoon Labs Web Application, refer to the [Postman API Documentation](https://documenter.getpostman.com/view/28858691/2sA3Bhfuvq).

## Deployment

The Startoon Labs Web Application is deployed on [Render.com](https://startoon-labs-web-be.onrender.com). You can access the deployed backend at [https://startoon-labs-web-be.onrender.com](https://startoon-labs-web-be.onrender.com).

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
