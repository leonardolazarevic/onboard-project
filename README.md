# Web Service Gin

A RESTful API built with **Go** and the **Gin** framework, backed by **PostgreSQL** and containerized with **Docker**. This project demonstrates API development, bearer token authentication, database integration, unit/integration testing, and API testing with Bruno.

---

## Prerequisites

Before running the project, install the following:

- Go 1.27+
- Docker Desktop
- Bruno API Client

### Authentication

All API endpoints require a bearer token.

The token can be found in:

```go
main.go
```

and must be included in the `Authorization` header of all requests:

```text
Authorization: Bearer <your-token>
```

---

## Running the Application

> **Important:** All `make` commands must be run from the `web-service-gin` directory.

### Start the Application

Build and start the API and PostgreSQL containers:

```bash
make start
```

### Run Tests

Execute all unit and integration tests:

```bash
make test
```

### View Logs

Display Docker container logs:

```bash
make logs
```

### Stop the Application

Shut down all running containers:

```bash
make down
```

---

### NOTE:

When restarting the application be sure to always run "make down" to reset to the basic starting state.

## API Endpoints

The following examples assume the authorization token is:

```text
123456789
```

Replace it with the token configured in your environment.

Make sure all API calls happen in a new terminal not hosting the containers.

### Get All Messages

Retrieves all messages stored in the API.

```bash
curl -H "Authorization: Bearer 123456789" http://localhost:8080/messages
```

### Get Message by ID

Retrieves a single message by its ID.

```bash
curl -H "Authorization: Bearer 123456789" http://localhost:8080/messages/10
```

### Create a Message

Creates a new message.

```bash
curl -X POST \
-H "Authorization: Bearer 123456789" \
-H "Content-Type: application/json" \
-d '{"id":"11","message":"Test Message","date":"2026-09-02T00:00:00Z","time":123}' \
http://localhost:8080/messages
```

### Update a Message

Updates an existing message by ID.

```bash
curl -X PATCH \
-H "Authorization: Bearer 123456789" \
-H "Content-Type: application/json" \
-d '{"message":"Updated Message"}' \
http://localhost:8080/messages/11
```

### Delete a Message

Deletes a message by ID.

```bash
curl -X DELETE \
-H "Authorization: Bearer 123456789" \
http://localhost:8080/messages/11
```

---

## Bruno

Bruno collections are included with this project.

### Using Bruno

1. Start the application:

   ```bash
   make start
   ```

2. Open Bruno.
3. Open the collection located in the project's `Bruno` folder.
4. Execute requests against the running API.

While automated tests are provided, Bruno offers an easy way to manually verify API functionality and connectivity.

---

## Troubleshooting

### PostgreSQL Container Fails to Start

Occasionally, the PostgreSQL container may not initialize correctly on the first startup.

If this occurs:

1. Stop the current process using `Ctrl + C`
2. Run:

```bash
make start
```

---

## Purpose

This project serves as a demonstration of:

- RESTful API development with Go and Gin
- PostgreSQL database integration
- Docker containerization
- Bearer token authentication
- Unit and integration testing
- Git and GitHub workflows
- API testing with Bruno

The application acts as a mock backend for a hypothetical Chick-fil-A messaging board that allows users to:

- Create messages
- Retrieve messages
- Update messages
- Delete messages

through standard REST API endpoints.

---

## Project Stack

- Go
- Gin
- PostgreSQL
- Docker
- Bruno
- Make
- Git / GitHub
- Bearer Token Authentication
