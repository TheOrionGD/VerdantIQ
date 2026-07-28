# EcoSphere (VerdantIQ) Deployment Guide

This document outlines deployment procedures for Spring Boot backend, FastAPI ML service, and MongoDB Atlas database.

## 1. Environment Variables Matrix

### Spring Boot Backend (`./backend`)
| Variable | Description | Example |
|---|---|---|
| `PORT` | Web server port | `8080` |
| `MONGODB_URI` | MongoDB Atlas cluster connection string | `mongodb+srv://admin:pass@cluster.mongodb.net/ecosphere` |
| `JWT_SECRET` | 256-bit secret key for HMAC SHA256 signing | `404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970` |
| `JWT_EXPIRATION_MS` | Access token lifespan in milliseconds | `86400000` (24h) |

### FastAPI ML Microservice (`./ml-service`)
| Variable | Description | Example |
|---|---|---|
| `PORT` | ASGI server port | `8000` |
| `HOST` | Host binding address | `0.0.0.0` |
| `MONGODB_URI` | MongoDB Atlas cluster connection string | `mongodb+srv://admin:pass@cluster.mongodb.net/ecosphere` |
| `SPRING_BOOT_API_URL` | Core REST API backend URL | `http://localhost:8080/api/v1` |
| `GROQ_API_KEY` | Groq LLM API Key | `gsk_...` |

---

## 2. Deployment Steps on Railway / Render

### Step A: MongoDB Atlas Setup
1. Create a MongoDB Atlas cluster (M0 or higher).
2. Create database user `admin` with ReadWrite permissions on `ecosphere` database.
3. Whitelist Network Access IP `0.0.0.0/0` (or Railway/Render egress IPs).
4. Copy connection string to `MONGODB_URI`.

### Step B: Deploy Spring Boot Backend (Docker / Gradle)
1. In Railway / Render, connect repository and specify `./backend` directory.
2. Build Command: `./gradlew build -x test`
3. Start Command: `java -jar build/libs/backend-0.0.1-SNAPSHOT.jar`
4. Set Environment Variables: `MONGODB_URI`, `JWT_SECRET`, `PORT`.
5. Access Swagger API docs at `https://<your-backend-domain>/swagger-ui.html`.

### Step C: Deploy FastAPI ML Service (Python 3.11)
1. Create secondary service pointing to `./ml-service`.
2. Build Command: `pip install -r requirements.txt`
3. Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Set Environment Variables: `MONGODB_URI`, `GROQ_API_KEY`, `SPRING_BOOT_API_URL`.
5. Interactive OpenAPI docs at `https://<your-ml-domain>/docs`.

---

## 3. Automated Verification & Health Checks
* Spring Boot Health Endpoint: `GET /actuator/health` or `GET /api/v1/auth/register`
* FastAPI Health Endpoint: `GET /health`
