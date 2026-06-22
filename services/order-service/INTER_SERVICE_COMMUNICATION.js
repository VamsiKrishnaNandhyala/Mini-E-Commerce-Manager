/* ============================================
   INTER-SERVICE COMMUNICATION FLOW GUIDE
   ============================================ */

/**
 * REQUEST FLOW: Create Order with Payment & Inventory
 * 
 * ┌─────────────────────────────────────────────────────────────┐
 * │ 1. CLIENT REQUEST                                           │
 * │ POST /api/orders                                            │
 * │ Body: {                                                     │
 * │   "productId": "product-123",                               │
 * │   "quantity": 2,                                            │
 * │   "totalAmount": 99.98                                      │
 * │ }                                                           │
 * └──────────────┬──────────────────────────────────────────────┘
 *                │
 * ┌──────────────▼──────────────────────────────────────────────┐
 * │ 2. API GATEWAY (Port 3000)                                  │
 * │ Routes to Order Service                                     │
 * └──────────────┬──────────────────────────────────────────────┘
 *                │
 * ┌──────────────▼──────────────────────────────────────────────┐
 * │ 3. ORDER SERVICE CONTROLLER                                 │
 * │ orderController.createOrder()                               │
 * │ - Calls orderService.createOrder(payload)                   │
 * └──────────────┬──────────────────────────────────────────────┘
 *                │
 * ┌──────────────▼──────────────────────────────────────────────┐
 * │ 4. ORDER SERVICE - STEP 1: Check Stock                      │
 * │ - Call inventoryClient.checkProductStock(productId)         │
 * │ - HTTP GET: http://localhost:3001/products/{productId}      │
 * │ - Inventory Service validates product exists & has stock    │
 * └──────────────┬──────────────────────────────────────────────┘
 *                │
 * ┌──────────────▼──────────────────────────────────────────────┐
 * │ 5. ORDER SERVICE - STEP 2: Create PENDING Order             │
 * │ - Create order record in-memory with PENDING status         │
 * │ - status: "PENDING"                                         │
 * │ - paymentId: null                                           │
 * └──────────────┬──────────────────────────────────────────────┘
 *                │
 * ┌──────────────▼──────────────────────────────────────────────┐
 * │ 6. ORDER SERVICE - STEP 3: Process Payment                  │
 * │ - Call paymentClient.processPayment(orderId, amount)        │
 * │ - HTTP POST: http://localhost:3003/payments                 │
 * │ - Create payment record with SUCCESS status                 │
 * └──────────────┬──────────────────────────────────────────────┘
 *                │
 * ┌──────────────▼──────────────────────────────────────────────┐
 * │ 7. ORDER SERVICE - STEP 4: Deduct Stock                     │
 * │ - Call inventoryClient.deductStock(productId, quantity)     │
 * │ - HTTP PUT: http://localhost:3001/products/{productId}      │
 * │ - Update product quantity -= quantity                       │
 * └──────────────┬──────────────────────────────────────────────┘
 *                │
 * ┌──────────────▼──────────────────────────────────────────────┐
 * │ 8. ORDER SERVICE - STEP 5: Confirm Order                    │
 * │ - Update order.status = "CONFIRMED"                         │
 * │ - Set order.paymentId = payment.id                          │
 * │ - Return updated order                                      │
 * └──────────────┬──────────────────────────────────────────────┘
 *                │
 * ┌──────────────▼──────────────────────────────────────────────┐
 * │ 9. RESPONSE - SUCCESS                                       │
 * │ Status: 201 Created                                         │
 * │ {                                                           │
 * │   "success": true,                                          │
 * │   "data": {                                                 │
 * │     "id": "order-uuid",                                     │
 * │     "productId": "product-123",                             │
 * │     "quantity": 2,                                          │
 * │     "totalAmount": 99.98,                                   │
 * │     "status": "CONFIRMED",                                  │
 * │     "paymentId": "payment-uuid",                            │
 * │     "createdAt": "2026-06-22T..."                           │
 * │   }                                                         │
 * │ }                                                           │
 * └─────────────────────────────────────────────────────────────┘
 */

/**
 * ERROR HANDLING WITH ROLLBACK
 * 
 * If any step fails (2, 3, 4):
 * ├─ Payment processing fails
 * │  └─ ROLLBACK: Order is removed from in-memory store
 * │  └─ Return error: "Failed to process payment"
 * │
 * ├─ Stock deduction fails
 * │  └─ ROLLBACK: Order is removed from in-memory store
 * │  └─ Return error: "Failed to deduct stock"
 * │
 * └─ If stock insufficient
 *    └─ ROLLBACK: Order is removed from in-memory store
 *    └─ Return error: "Insufficient stock"
 */

/**
 * FILES CREATED/MODIFIED:
 * 
 * ✅ NEW: services/order-service/src/clients/serviceClient.js
 *    └─ Axios HTTP client for inter-service calls
 * 
 * ✅ NEW: services/order-service/src/clients/inventoryClient.js
 *    ├─ checkProductStock(productId) - Verify product exists & has stock
 *    └─ deductStock(productId, quantity) - Reduce inventory
 * 
 * ✅ NEW: services/order-service/src/clients/paymentClient.js
 *    ├─ processPayment(orderId, amount) - Create payment record
 *    └─ getPaymentStatus(paymentId) - Check payment status
 * 
 * ✅ UPDATED: services/order-service/src/services/orderService.js
 *    └─ createOrder() now async with inter-service communication
 * 
 * ✅ UPDATED: services/order-service/src/controllers/orderController.js
 *    └─ createOrder() now async to handle promise from service
 */

/**
 * ENVIRONMENT VARIABLES REQUIRED:
 * 
 * In order-service/.env:
 * INVENTORY_SERVICE_URL=http://localhost:3001
 * PAYMENT_SERVICE_URL=http://localhost:3003
 * PORT=3002
 * 
 * These are already set as defaults in the clients if env vars not provided
 */

/**
 * EXAMPLE REQUEST FLOW:
 * 
 * 1. User clicks "Place Order" in frontend
 * 2. Frontend: POST http://localhost:3000/api/orders
 *    {
 *      "productId": "wireless-keyboard-id",
 *      "quantity": 1,
 *      "totalAmount": 49.99
 *    }
 * 
 * 3. Order Service validates & checks inventory
 *    - Calls: GET http://localhost:3001/products/{productId}
 *    - Response: { success: true, data: { quantity: 10, ... } }
 * 
 * 4. Order Service creates payment
 *    - Calls: POST http://localhost:3003/payments
 *    - Body: { orderId, amount, status: "SUCCESS" }
 *    - Response: { success: true, data: { id: "payment-123", ... } }
 * 
 * 5. Order Service deducts stock
 *    - Calls: PUT http://localhost:3001/products/{productId}
 *    - Body: { quantity: 9 }  (10 - 1)
 *    - Response: { success: true, data: { quantity: 9, ... } }
 * 
 * 6. Order Service confirms order
 *    - Updates order.status = "CONFIRMED"
 *    - Sets order.paymentId
 *    - Returns 201 Created response
 * 
 * 7. Frontend receives confirmed order with all details
 */
