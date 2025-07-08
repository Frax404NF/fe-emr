# API Documentation

## Overview
Dokumentasi API untuk aplikasi EMR Frontend. Aplikasi ini berkomunikasi dengan backend melalui RESTful API endpoints.

## Base URL
```
Base URL: ${VITE_API_BASE_URL}
```

## Authentication
Aplikasi menggunakan JWT (JSON Web Token) untuk autentikasi. Token harus disertakan dalam header Authorization untuk endpoint yang memerlukan autentikasi.

```
Authorization: Bearer <access_token>
```

## Endpoints

### Authentication Endpoints

#### POST /api/auth/login
Login user ke sistem.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "name": "string",
      "email": "string",
      "role": "ADMIN|DOCTOR|NURSE|PATIENT"
    },
    "access_token": "string",
    "refresh_token": "string"
  }
}
```

#### POST /api/auth/register
Registrasi user baru.

**Request Body:**
```json
{
  "name": "string",
  "email": "string", 
  "password": "string",
  "role": "ADMIN|DOCTOR|NURSE|PATIENT"
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "name": "string", 
      "email": "string",
      "role": "string"
    }
  }
}
```

#### POST /api/auth/signout
Logout user dari sistem.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

## Error Responses

Semua endpoint dapat mengembalikan error response dengan format:

```json
{
  "success": false,
  "message": "Error message",
  "errors": {}
}
```

### Common HTTP Status Codes
- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error
