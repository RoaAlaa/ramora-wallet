# Ramora Wallet - API Documentation

## Base URL
```
http://localhost:5001/api
```

## Authentication
The API uses JWT (JSON Web Token) for authentication. Protected routes require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Response Format
All responses follow this general format:
```json
{
    "success": true/false,
    "data": {}, // Response data (if successful)
    "error": "" // Error message (if unsuccessful)
}
```

## API Endpoints

### User Management

#### Register User
```http
POST /users/register
```
**Request Body:**
```json
{
    "username": "string",
    "email": "string",
    "password": "string"
}
```
**Response:**
```json
{
    "success": true,
    "data": {
        "token": "jwt_token",
        "user": {
            "id": "string",
            "username": "string",
            "email": "string"
        }
    }
}
```

#### Login
```http
POST /users/login
```
**Request Body:**
```json
{
    "email": "string",
    "password": "string"
}
```
**Response:**
```json
{
    "success": true,
    "data": {
        "token": "jwt_token",
        "user": {
            "id": "string",
            "username": "string",
            "email": "string"
        }
    }
}
```

#### Get Current User
```http
GET /users/me
```
**Headers Required:** Authorization Bearer Token
**Response:**
```json
{
    "success": true,
    "data": {
        "user": {
            "id": "string",
            "username": "string",
            "email": "string"
        }
    }
}
```

#### Get User by ID
```http
GET /users/:userId
```
**Headers Required:** Authorization Bearer Token
**Response:**
```json
{
    "success": true,
    "data": {
        "user": {
            "id": "string",
            "username": "string",
            "email": "string"
        }
    }
}
```

#### Update User
```http
PUT /users/:userId
```
**Headers Required:** Authorization Bearer Token
**Request Body:**
```json
{
    "username": "string",
    "email": "string"
}
```
**Response:**
```json
{
    "success": true,
    "data": {
        "user": {
            "id": "string",
            "username": "string",
            "email": "string"
        }
    }
}
```

### Wallet Operations

#### Add Balance
```http
POST /wallet/:userId/add-balance
```
**Headers Required:** Authorization Bearer Token
**Request Body:**
```json
{
    "amount": "number"
}
```
**Response:**
```json
{
    "success": true,
    "data": {
        "balance": "number",
        "transaction": {
            "id": "string",
            "amount": "number",
            "type": "DEPOSIT",
            "timestamp": "date"
        }
    }
}
```

#### Send Money
```http
POST /wallet/:userId/send/:receiverUsername
```
**Headers Required:** Authorization Bearer Token
**Request Body:**
```json
{
    "amount": "number",
    "note": "string"
}
```
**Response:**
```json
{
    "success": true,
    "data": {
        "transaction": {
            "id": "string",
            "amount": "number",
            "sender": "string",
            "receiver": "string",
            "note": "string",
            "timestamp": "date"
        }
    }
}
```

#### Request Money
```http
POST /wallet/:userId/request/:receiverUsername
```
**Headers Required:** Authorization Bearer Token
**Request Body:**
```json
{
    "amount": "number",
    "note": "string"
}
```
**Response:**
```json
{
    "success": true,
    "data": {
        "request": {
            "id": "string",
            "amount": "number",
            "requester": "string",
            "requestee": "string",
            "note": "string",
            "status": "PENDING",
            "timestamp": "date"
        }
    }
}
```

#### Respond to Money Request
```http
PUT /wallet/:userId/requests/:transactionId
```
**Headers Required:** Authorization Bearer Token
**Request Body:**
```json
{
    "status": "ACCEPTED" | "REJECTED"
}
```
**Response:**
```json
{
    "success": true,
    "data": {
        "request": {
            "id": "string",
            "status": "string",
            "transaction": {} // If accepted
        }
    }
}
```

#### View Money Requests
```http
GET /wallet/:userId/requests
```
**Headers Required:** Authorization Bearer Token
**Response:**
```json
{
    "success": true,
    "data": {
        "requests": [
            {
                "id": "string",
                "amount": "number",
                "requester": "string",
                "requestee": "string",
                "note": "string",
                "status": "string",
                "timestamp": "date"
            }
        ]
    }
}
```

#### Get Transaction History
```http
GET /wallet/:userId/transactions
```
**Headers Required:** Authorization Bearer Token
**Response:**
```json
{
    "success": true,
    "data": {
        "transactions": [
            {
                "id": "string",
                "type": "string",
                "amount": "number",
                "sender": "string",
                "receiver": "string",
                "note": "string",
                "timestamp": "date"
            }
        ]
    }
}
```

### Bucket Management

#### Create Bucket
```http
POST /buckets/:userId/buckets
```
**Headers Required:** Authorization Bearer Token
**Request Body:**
```json
{
    "name": "string",
    "targetAmount": "number",
    "category": "string"
}
```
**Response:**
```json
{
    "success": true,
    "data": {
        "bucket": {
            "id": "string",
            "name": "string",
            "targetAmount": "number",
            "currentAmount": "number",
            "category": "string"
        }
    }
}
```

#### Update Bucket
```http
PUT /buckets/:userId/buckets/:bucketId
```
**Headers Required:** Authorization Bearer Token
**Request Body:**
```json
{
    "name": "string",
    "targetAmount": "number",
    "category": "string"
}
```
**Response:**
```json
{
    "success": true,
    "data": {
        "bucket": {
            "id": "string",
            "name": "string",
            "targetAmount": "number",
            "currentAmount": "number",
            "category": "string"
        }
    }
}
```

#### Reset All Buckets
```http
POST /buckets/:userId/buckets/reset
```
**Headers Required:** Authorization Bearer Token
**Response:**
```json
{
    "success": true,
    "message": "All buckets have been reset"
}
```

#### Get User Buckets
```http
GET /buckets/:userId/buckets
```
**Headers Required:** Authorization Bearer Token
**Response:**
```json
{
    "success": true,
    "data": {
        "buckets": [
            {
                "id": "string",
                "name": "string",
                "targetAmount": "number",
                "currentAmount": "number",
                "category": "string"
            }
        ]
    }
}
```

## Error Responses

### Common Error Codes
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

**Error Response Format:**
```json
{
    "success": false,
    "error": {
        "code": "number",
        "message": "string"
    }
}
```

## Rate Limiting
The API implements rate limiting to prevent abuse. Limits are as follows:
- 100 requests per minute per IP address
- 1000 requests per hour per user

## Versioning
The current API version is v1. The version is included in the base URL:
```
http://localhost:5001/api/v1
``` 