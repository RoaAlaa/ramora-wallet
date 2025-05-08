# Ramora Wallet API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Rate Limiting
- General API: 100 requests per 15 minutes
- Authentication: 5 requests per hour
- Transactions: 20 requests per hour

## Error Responses
All error responses follow this format:
```json
{
    "success": false,
    "error": "Error message"
}
```

## Endpoints

### Authentication

#### Register User
```http
POST /users/register
```

Request Body:
```json
{
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "phoneNumber": "+1234567890",
    "password": "password123"
}
```

Response:
```json
{
    "success": true,
    "message": "User registered successfully",
    "user": {
        "id": "user_id",
        "name": "John Doe",
        "username": "johndoe",
        "email": "john@example.com",
        "phoneNumber": "+1234567890"
    },
    "token": "jwt_token"
}
```

#### Login
```http
POST /users/login
```

Request Body:
```json
{
    "username": "johndoe",
    "password": "password123"
}
```

Response:
```json
{
    "success": true,
    "message": "user login successfully",
    "user": {
        "id": "user_id",
        "name": "John Doe",
        "username": "johndoe",
        "email": "john@example.com",
        "phoneNumber": "+1234567890"
    },
    "token": "jwt_token"
}
```

### User Profile

#### Get Profile
```http
GET /users/profile
```

Response:
```json
{
    "success": true,
    "user": {
        "id": "user_id",
        "name": "John Doe",
        "username": "johndoe",
        "email": "john@example.com",
        "phoneNumber": "+1234567890",
        "balance": 1000,
        "buckets": []
    }
}
```

#### Update Profile
```http
PUT /users/profile
```

Request Body:
```json
{
    "name": "John Updated",
    "phoneNumber": "+1987654321"
}
```

Response:
```json
{
    "success": true,
    "message": "Profile updated successfully",
    "user": {
        "id": "user_id",
        "name": "John Updated",
        "username": "johndoe",
        "email": "john@example.com",
        "phoneNumber": "+1987654321"
    }
}
```

#### Update Password
```http
PUT /users/password
```

Request Body:
```json
{
    "currentPassword": "oldpassword",
    "newPassword": "newpassword"
}
```

Response:
```json
{
    "success": true,
    "message": "Password updated successfully"
}
```

### Bucket Management

#### Get All Buckets
```http
GET /users/buckets
```

Response:
```json
{
    "success": true,
    "data": [
        {
            "id": "bucket_id",
            "name": "Savings",
            "amount": 500
        }
    ]
}
```

#### Add Bucket
```http
POST /users/buckets
```

Request Body:
```json
{
    "name": "Vacation Fund",
    "amount": 1000
}
```

Response:
```json
{
    "success": true,
    "message": "Bucket added successfully",
    "bucket": {
        "id": "bucket_id",
        "name": "Vacation Fund",
        "amount": 1000
    }
}
```

#### Update Bucket
```http
PUT /users/buckets/:bucketId
```

Request Body:
```json
{
    "name": "Updated Vacation Fund",
    "amount": 1500
}
```

Response:
```json
{
    "success": true,
    "message": "Bucket updated successfully",
    "bucket": {
        "id": "bucket_id",
        "name": "Updated Vacation Fund",
        "amount": 1500
    }
}
```

#### Delete Bucket
```http
DELETE /users/buckets/:bucketId
```

Response:
```json
{
    "success": true,
    "message": "Bucket deleted successfully"
}
```

### Balance Management

#### Get Balance History
```http
GET /users/balance/history
```

Response:
```json
{
    "success": true,
    "data": [
        {
            "date": "2024-01-20T10:00:00Z",
            "amount": 100,
            "type": "send",
            "status": "completed",
            "reference": "TRX-123456",
            "note": "Payment for services"
        }
    ]
}
```

#### Update Balance
```http
PUT /users/balance
```

Request Body:
```json
{
    "amount": 500
}
```

Response:
```json
{
    "success": true,
    "message": "Balance updated successfully",
    "balance": 1500
}
```

### User Statistics

#### Get User Stats
```http
GET /users/stats
```

Response:
```json
{
    "success": true,
    "data": {
        "balance": 1500,
        "transactionStats": {
            "totalSent": 500,
            "totalReceived": 1000,
            "transactionCount": 10
        },
        "bucketStats": {
            "totalBuckets": 2,
            "totalBucketAmount": 2000
        }
    }
}
```

### Transactions

#### Create Transaction
```http
POST /transactions
```

Request Body:
```json
{
    "receiverId": "receiver_user_id",
    "amount": 100,
    "type": "send",
    "note": "Payment for services"
}
```

Response:
```json
{
    "success": true,
    "message": "Transaction created successfully",
    "transaction": {
        "id": "transaction_id",
        "sender": {
            "id": "sender_id",
            "name": "John Doe"
        },
        "receiver": {
            "id": "receiver_id",
            "name": "Jane Doe"
        },
        "amount": 100,
        "type": "send",
        "status": "completed",
        "note": "Payment for services",
        "reference": "TRX-123456"
    }
}
```

#### Get User Transactions
```http
GET /transactions
```

Response:
```json
{
    "success": true,
    "transactions": {
        "transactions": [
            {
                "id": "transaction_id",
                "sender": {
                    "id": "sender_id",
                    "name": "John Doe"
                },
                "receiver": {
                    "id": "receiver_id",
                    "name": "Jane Doe"
                },
                "amount": 100,
                "type": "send",
                "status": "completed",
                "note": "Payment for services",
                "reference": "TRX-123456"
            }
        ],
        "stats": {
            "totalSent": 500,
            "totalReceived": 1000,
            "transactionCount": 10
        }
    }
}
```

#### Get Transaction by ID
```http
GET /transactions/:transactionId
```

Response:
```json
{
    "success": true,
    "transaction": {
        "id": "transaction_id",
        "sender": {
            "id": "sender_id",
            "name": "John Doe"
        },
        "receiver": {
            "id": "receiver_id",
            "name": "Jane Doe"
        },
        "amount": 100,
        "type": "send",
        "status": "completed",
        "note": "Payment for services",
        "reference": "TRX-123456"
    }
}
```

#### Update Transaction Status
```http
PATCH /transactions/:transactionId/status
```

Request Body:
```json
{
    "status": "completed"
}
```

Response:
```json
{
    "success": true,
    "message": "Transaction status updated successfully",
    "transaction": {
        "id": "transaction_id",
        "status": "completed"
    }
}
```

#### Get Pending Transactions
```http
GET /transactions/status/pending
```

Response:
```json
{
    "success": true,
    "data": [
        {
            "id": "transaction_id",
            "sender": {
                "id": "sender_id",
                "name": "John Doe"
            },
            "receiver": {
                "id": "receiver_id",
                "name": "Jane Doe"
            },
            "amount": 100,
            "type": "request",
            "status": "pending",
            "note": "Payment request",
            "reference": "TRX-123456"
        }
    ]
}
```

#### Get Completed Transactions
```http
GET /transactions/status/completed
```

Response: Same format as pending transactions, but with status "completed"

#### Search Transactions
```http
GET /transactions/search
```

Query Parameters:
- `query`: Search in notes (optional)
- `startDate`: Start date for filtering (optional)
- `endDate`: End date for filtering (optional)
- `minAmount`: Minimum amount (optional)
- `maxAmount`: Maximum amount (optional)
- `type`: Transaction type (send/request) (optional)
- `status`: Transaction status (optional)

Response:
```json
{
    "success": true,
    "data": [
        {
            "id": "transaction_id",
            "sender": {
                "id": "sender_id",
                "name": "John Doe"
            },
            "receiver": {
                "id": "receiver_id",
                "name": "Jane Doe"
            },
            "amount": 100,
            "type": "send",
            "status": "completed",
            "note": "Payment for services",
            "reference": "TRX-123456"
        }
    ]
}
```

#### Get Transaction Statistics
```http
GET /transactions/stats
```

Response:
```json
{
    "success": true,
    "data": {
        "totalSent": 500,
        "totalReceived": 1000,
        "transactionCount": 10
    }
}
```

## Validation Rules

### User Registration
- Name: 2-50 characters
- Username: 3-30 characters, unique
- Email: Valid email format, unique
- Phone Number: E.164 format
- Password: Minimum 6 characters

### Transaction Creation
- Amount: Minimum 0.01
- Type: Must be 'send' or 'request'
- Note: Maximum 200 characters

### Bucket Management
- Name: 2-50 characters
- Amount: Minimum 0

### Profile Updates
- Name: 2-50 characters
- Phone Number: E.164 format

## Error Codes
- 400: Bad Request (Invalid input)
- 401: Unauthorized (Invalid/missing token)
- 403: Forbidden (Insufficient permissions)
- 404: Not Found
- 429: Too Many Requests (Rate limit exceeded)
- 500: Internal Server Error