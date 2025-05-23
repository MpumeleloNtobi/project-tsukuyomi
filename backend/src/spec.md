# 📦 Stores API

| Method | Path                | Description                           |
| :----: | :------------------ | :------------------------------------ |
|  GET   | `/stores`           | Fetch all stores                      |
|  GET   | `/stores/:store_id` | Fetch one store by ID                 |
|  POST  | `/stores`           | Create a new store                    |
|  PUT   | `/stores/:store_id` | Update store name or status (partial) |
| DELETE | `/stores/:store_id` | Delete a store by ID                  |

> 🔒 **Required**: `clerkId` and `name` are required to create a store.  
> ✅ **Validation**: `status` must be one of the allowed states (`approved`, `banned`, etc.).  
> ⚠️ **Note**: Store ID must be a **UUID** for GET/PUT/DELETE operations.

---

# 🛍️ Products API

| Method | Path                    | Description                                  |
| :----: | :---------------------- | :------------------------------------------- |
|  POST  | `/products`             | Create a new product for a store             |
|  GET   | `/products`             | Fetch all products (filterable by `storeId`) |
|  GET   | `/products/:product_id` | Get one product by ID                        |
|  PUT   | `/products/:product_id` | Update one or more product fields            |
| DELETE | `/products/:product_id` | Delete a product by ID                       |

> 🔒 **Required**:  
> For `POST /products`, fields `storeId`, `name`, `description`, `price`, `stockQuantity`, `category`, and `imageUrl` are required.

> ✅ **Validation**:  
> `productId` must be a **positive integer**.

> 🛠️ **Partial Updates**:  
> Supports partial updates like changing only the `stockQuantity`.
