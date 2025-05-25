API Documentation

Stores
    • GET /stores
Retrieve all stores.
Response: Array of store objects.
Status Codes: 200 OK, 500 Internal Server Error.

    • GET /stores/:store_id
Retrieve a specific store by ID.
Response: Store object.
Status Codes: 200 OK, 404 Not Found, 500 Internal Server Error.

    • POST /stores
Create a new store.
Request Body:
json
CopyEdit
  {
    "clerkId": "string",
    "storeName": "string",
    "storeDescription": "string",
    "stitchClientKey": "string",
    "stitchClientSecret": "string",
    "town": "string",
    "postalCode": "string",
    "streetName": "string",
    "streetNumber": "string"
  }
Response: Created store object.
Status Codes: 201 Created, 400 Bad Request, 500 Internal Server Error.
Update a store's name or status.
Request Body:
json
CopyEdit
  {
    "name": "string",
    "status": "string" // Allowed values: "awaiting approval", "approved", "watchlist", "banned"
  }
Response: Updated store object.
Status Codes: 200 OK, 400 Bad Request, 404 Not Found, 500 Internal Server Error.

    • DELETE /stores/:store_id
Delete a store by ID.
Response: No content.
Status Codes: 204 No Content, 404 Not Found, 500 Internal Server Error.



Products
    • GET /products
Retrieve all products.
Response: Array of product objects.
Status Codes: 200 OK, 500 Internal Server Error.

    • GET /products/:product_id
Retrieve a specific product by ID.
Response: Product object.
Status Codes: 200 OK, 404 Not Found, 500 Internal Server Error.

    • POST /products
Create a new product.
Request Body:
json
CopyEdit
  {
    "storeId": "UUID",
    "name": "string",
    "description": "string",
    "price": "number",
    "stockQuantity": "integer"
  }
Response: Created product object.
Status Codes: 201 Created, 400 Bad Request, 500 Internal Server Error.

    • PUT /products/:product_id
Update a product's details.
Request Body: Partial or full product object.
Response: Updated product object.
Status Codes: 200 OK, 400 Bad Request, 404 Not Found, 500 Internal Server Error.

    • DELETE /products/:product_id
Delete a product by ID.
Response: No content.
Status Codes: 204 No Content, 404 Not Found, 500 Internal Server Error.




Orders
    • GET /orders
Retrieve all orders.
Response: Array of order objects.
Status Codes: 200 OK, 500 Internal Server Error.

    • GET /orders/:order_id
Retrieve a specific order by ID.
Response: Order object.
Status Codes: 200 OK, 404 Not Found, 500 Internal Server Error.

    • POST /orders
Create a new order.
Request Body:
json
CopyEdit
  {
    "storeId": "UUID",
    "products": [
      {
        "productId": "UUID",
        "quantity": "integer"
      }
    ],
    "total_price": "number",
    "paymentStatus": "string" // e.g., "paid", "unpaid"
  }
Response: Created order object.
Status Codes: 201 Created, 400 Bad Request, 500 Internal Server 

    • PUT /orders/:order_id
Update an order's details.
Request Body: Partial or full order object.
Response: Updated order object.
Status Codes: 200 OK, 400 Bad Request, 404 Not Found, 500 Internal Server Error

    • DELETE /orders/:order_id
Delete an order by ID.
Response: No content.
Status Codes: 204 No Content, 404 Not Found, 500 Internal Server Error.

    • POST /payments
Process a payment.
Request Body:
json
CopyEdit
  {
    "orderId": "UUID",
    "paymentMethod": "string",
    "amount": "number"
  }
Response: Payment confirmation object.
Status Codes: 200 OK, 400 Bad Request, 500 Internal Server Error.


 

Images

    • POST /images/upload
Upload an image.
Request: Multipart/form-data with image file.
Response: Uploaded image URL.
Status Codes: 201 Created, 400 Bad Request, 500 Internal Server Error.

    • GET /images/:image_id
Retrieve an image by ID.
Response: Image file.
Status Codes: 200 OK, 404 Not Found, 500 Internal Server Error.



 Reporting

    • GET /reporting/inventory/:storeId
Retrieve inventory report for a store in CSV format.
Response: CSV file with product details.
Status Codes: 200 OK, 400 Bad Request, 500 Internal Server Error.

    • GET /reporting/:storeId/daily-sales.csv
Retrieve daily sales report for the past 30 days in CSV format.
Response: CSV file with daily sales data.
Status Codes: 200 OK, 400 Bad Request, 500 Internal Server Error.

    • GET /reporting/:storeId/daily-sales
Retrieve daily sales report for the past 30 days in JSON format.
Response: Array of daily sales data.
Status Codes: 200 OK, 400 Bad Request, 500 Internal Server Error.

    • GET /reporting/:storeId/metrics
Retrieve key metrics for a store.
Status Codes: 200 OK, 400 Bad Request, 500 Internal Server Error


