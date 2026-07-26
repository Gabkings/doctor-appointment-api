# Doctor Appointment API

This project is a RESTful API for a doctor appointment booking system. It was developed as part of a Masters Degree in Computer Science unit to demonstrate practical implementation of backend development concepts such as RESTful services, authentication, database design, API testing, and documentation.

## Project Aim

The aim of this project is to build a secure and functional backend system that allows:
- patients to register and log in,
- users to book appointments with doctors,
- doctors to apply for accounts,
- administrators to approve or reject doctor accounts,
- users and doctors to receive notifications related to appointment and account status.

This project showcases how a real-world healthcare appointment platform can be modeled using Node.js, Express, and MongoDB.

## Key Features

- User registration and login
- JWT-based authentication
- Doctor account application workflow
- Admin approval/rejection of doctor accounts
- Appointment booking and availability checking
- Notification handling for users and doctors
- Swagger API documentation
- Unit and endpoint testing with Mocha and Supertest

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcryptjs
- Swagger (swagger-jsdoc and swagger-ui-express)
- Mocha + Supertest for testing

## Project Structure

```bash
config/            # Database connection setup
middleware/        # Authentication middleware
models/           # MongoDB schemas/models
route/             # API route definitions
tests/             # Unit and endpoint tests
server.js          # Main application entry point
swagger.js         # Swagger configuration
```

## Prerequisites

Before running the project, ensure you have:
- Node.js installed
- npm installed
- A MongoDB database (local or MongoDB Atlas)

## Environment Configuration

Create a `.env` file in the project root with the following variables:

```env
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

Example:

```env
MONGO_URL=mongodb+srv://username:password@cluster0.mongodb.net/?appName=YourApp
JWT_SECRET=supersecretkey
PORT=5000
```

## Installation

Clone the repository:

```bash
git clone https://github.com/Gabkings/doctor-appointment-api
cd doctor-appointment-api
```

Install dependencies:

```bash
npm install
```

## Running the Application

Start the server:

```bash
npm start
```

The server will run on:

```bash
http://localhost:5000
```

## API Documentation

Swagger documentation is available in two environments:

### Local development

```bash
http://localhost:5000/api-docs
```

Local Swagger UI screenshot:

![Local Swagger UI](docs/images/local-swagger.png)

> Place your screenshot image in the docs/images folder and name it local-swagger.png.

Raw OpenAPI JSON:

```bash
http://localhost:5000/api-docs.json
```

### Deployed version

If the project is deployed on Vercel, the Swagger UI can be accessed at:

```bash
https://doctor-appointment-api-puce.vercel.app/api-docs
```

Raw OpenAPI JSON for the deployed version:

```bash
https://doctor-appointment-api-puce.vercel.app/api-docs.json
```

> Use the deployed URL when testing the live API, and the local URL during development.

## Main API Endpoints

### User Routes

- POST `/api/user/register` — register a new user
- POST `/api/user/login` — authenticate a user
- POST `/api/user/get-user-info-by-id` — fetch logged-in user details
- POST `/api/user/apply-doctor-account` — submit a doctor application
- POST `/api/user/book-appointment` — book an appointment
- POST `/api/user/check-booking-avilability` — check appointment availability

### Admin Routes

- GET `/api/admin/get-all-doctors` — fetch all doctors
- GET `/api/admin/get-all-users` — fetch all users
- POST `/api/admin/change-doctor-account-status` — approve or reject a doctor account

### Doctor Routes

- POST `/api/doctor/get-doctor-info-by-user-id` — fetch doctor profile by user ID
- POST `/api/doctor/update-doctor-profile` — update doctor profile
- GET `/api/doctor/get-appointments-by-doctor-id` — fetch doctor appointments
- POST `/api/doctor/change-appointment-status` — update appointment status

## Authentication

Protected routes require a JWT token in the `Authorization` header:

```http
Authorization: Bearer <token>
```

## Testing

Run the test suite with:

```bash
npm test
```

Or directly run the endpoint test file:

```bash
npx mocha tests/routes.test.js --timeout 100000
```

## Academic Relevance

This project demonstrates the following academic learning outcomes:
- backend API design using Express,
- database modeling and CRUD operations with MongoDB,
- user authentication and authorization,
- API testing and documentation,
- implementation of a realistic software solution relevant to modern web applications.

## Future Enhancements

Possible future improvements include:
- frontend integration,
- email notifications,
- payment gateway integration,
- role-based access control refinement,
- deployment to cloud platforms such as Vercel, Render, or Railway.

## License

This project is intended for academic and learning purposes.
