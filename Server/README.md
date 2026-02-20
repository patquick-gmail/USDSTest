# Minimal Express REST API

A simple Express.js REST API with two endpoints.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

The server will run on `http://localhost:3000`

## Endpoints

### GET /status
Returns the API status.

**Example:**
```bash
curl http://localhost:3000/status
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-02-03T10:30:00.000Z",
  "uptime": 123.456
}
```

### POST /echo
Echoes back whatever JSON data you send.

**Example:**
```bash
curl -X POST http://localhost:3000/echo \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, World!"}'
```

**Response:**
```json
{
  "message": "Echo response",
  "receivedData": {
    "message": "Hello, World!"
  }
}
```

## Development

For auto-restart on file changes:
```bash
npm run dev
```
