# STARBOOKS Monitoring Backend

Backend API for the STARBOOKS Monitoring system with user authentication.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the backend directory:

```env
MONGODB_URI=mongodb://localhost:27017/starbooks
PORT=5000
NODE_ENV=development
```

3. Make sure MongoDB is running on your system.

4. Start the server:

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

## API Endpoints

### Create User

**POST** `/api/users/register`

Request body:

```json
{
  "username": "john_doe",
  "password": "password123"
}
```

Response (201):

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "user_id",
    "username": "john_doe",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Get All Users

**GET** `/api/users`

### Get User by ID

**GET** `/api/users/:id`

## Features

- User registration with username and password
- Password hashing using bcrypt
- Input validation
- Duplicate username prevention
- Error handling
