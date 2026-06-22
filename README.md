# Mini E-Commerce Management System

A complete local microservices demo built with Node.js, Express.js, Next.js App Router, Tailwind CSS, and Axios.

The frontend calls only the API Gateway. The gateway forwards requests to the inventory, order, and payment microservices.

## Architecture Diagram

```text
Frontend: Next.js on port 3005
        |
        v
API Gateway: Express on port 3000
        |
        +--> Inventory Service: Express on port 3001
        +--> Order Service: Express on port 3002
        +--> Payment Service: Express on port 3003
```

## Folder Structure

```text
microservices-app/
  gateway/
    src/
      controllers/
      middlewares/
      routes/
      services/
      utils/
      server.js
  services/
    inventory-service/
    order-service/
    payment-service/
  frontend/
    app/
      products/
      orders/
      payments/
    components/
    services/
    utils/
```

## Installation

From the project root:

```bash
cd microservices-app
npm install
```

The root `postinstall` script installs dependencies for the gateway, every microservice, and the frontend.

## Run Commands

Start the full application:

```bash
npm run dev
```

Start only the backend services and gateway:

```bash
npm run dev:backend
```

Start only the frontend:

```bash
npm run dev:frontend
```

Open the app at:

```text
http://localhost:3005
```

## Environment Variables

Each app includes a `.env.example`.

Gateway:

```env
PORT=3000
INVENTORY_SERVICE_URL=http://localhost:3001
ORDER_SERVICE_URL=http://localhost:3002
PAYMENT_SERVICE_URL=http://localhost:3003
```

Inventory Service:

```env
PORT=3001
```

Order Service:

```env
PORT=3002
```

Payment Service:

```env
PORT=3003
```

Frontend:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

The defaults are already coded for local development, so copying `.env.example` files is optional.

## API Documentation

All frontend requests should use the gateway base URL:

```text
http://localhost:3000/api
```

### Products

Gateway route: `/api/products`

Service route: `/products`

Product schema:

```json
{
  "id": "string",
  "name": "string",
  "price": 25.5,
  "quantity": 10,
  "createdAt": "string"
}
```

Endpoints:

```text
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

Create or update body:

```json
{
  "name": "Wireless Mouse",
  "price": 29.99,
  "quantity": 15
}
```

### Orders

Gateway route: `/api/orders`

Service route: `/orders`

Order schema:

```json
{
  "id": "string",
  "productId": "string",
  "quantity": 2,
  "totalAmount": 59.98,
  "status": "PENDING",
  "createdAt": "string"
}
```

Allowed statuses:

```text
PENDING
CONFIRMED
CANCELLED
```

Endpoints:

```text
GET    /api/orders
GET    /api/orders/:id
POST   /api/orders
PUT    /api/orders/:id
DELETE /api/orders/:id
```

Create or update body:

```json
{
  "productId": "product-id",
  "quantity": 2,
  "totalAmount": 59.98,
  "status": "PENDING"
}
```

### Payments

Gateway route: `/api/payments`

Service route: `/payments`

Payment schema:

```json
{
  "id": "string",
  "orderId": "string",
  "amount": 59.98,
  "status": "SUCCESS",
  "transactionId": "TXN-12345678",
  "createdAt": "string"
}
```

Allowed statuses:

```text
SUCCESS
FAILED
PENDING
```

Endpoints:

```text
GET    /api/payments
GET    /api/payments/:id
POST   /api/payments
PUT    /api/payments/:id
DELETE /api/payments/:id
```

Create or update body:

```json
{
  "orderId": "order-id",
  "amount": 59.98,
  "status": "SUCCESS",
  "transactionId": "TXN-12345678"
}
```

## Response Format

Success:

```json
{
  "success": true,
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Error message"
}
```

## Notes

This project intentionally uses in-memory arrays. Data resets whenever a service restarts.

No Docker, Kubernetes, CI/CD, deployment configuration, authentication, authorization, or database integration is included.
