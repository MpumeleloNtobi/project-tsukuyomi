export interface Product {
    id: number
    storeId: string
    name: string
    description: string
    price: number
    stockQuantity: number
    //originalPrice: number
    //discount: number
    //rating: number
    category: string
    imageUrl: string
    //brand: string
  }
  
  export const products: Product[] = [
    {
        "id": 3,
        "storeId": "69d45244-fa6d-4dec-9c0e-2a6374fc401a",
        "name": "Super Widget Deluxe",
        "description": "An amazing widget that does things.",
        "price": 34.99,
        "stockQuantity": 45,
        "category": "Widgets",
        "imageUrl": "https://placehold.co/300x300?text=Smartphone+Z"
    },
    {
        "id": 4,
        "storeId": "fd8c40fb-104f-46c4-bb8b-2c3f4bc2c69c",
        "name": "Smartphone Z",
        "description": "Latest generation smartphone with AI camera.",
        "price": 799.99,
        "stockQuantity": 50,
        "category": "Electronics",
        "imageUrl": "https://placehold.co/300x300?text=Smartphone+Z"
    },
    {
        "id": 5,
        "storeId": "fd8c40fb-104f-46c4-bb8b-2c3f4bc2c69c",
        "name": "Noise-Cancelling Headphones",
        "description": "Immersive sound experience, perfect for travel.",
        "price": 149.5,
        "stockQuantity": 75,
        "category": "Audio",
        "imageUrl": "https://placehold.co/300x300?text=Headphones"
    },
    {
        "id": 6,
        "storeId": "fd8c40fb-104f-46c4-bb8b-2c3f4bc2c69c",
        "name": "Wireless Charger Pad",
        "description": "Fast charging for compatible devices.",
        "price": 39.99,
        "stockQuantity": 120,
        "category": "Accessories",
        "imageUrl": "https://placehold.co/300x300?text=Wireless+Charger"
    },
    {
        "id": 7,
        "storeId": "fd8c40fb-104f-46c4-bb8b-2c3f4bc2c69c",
        "name": "Smartwatch Series 5",
        "description": "Track fitness, notifications, and more.",
        "price": 249,
        "stockQuantity": 40,
        "category": "Wearables",
        "imageUrl": "https://placehold.co/300x300?text=Smartwatch+5"
    },
    {
        "id": 8,
        "storeId": "fd8c40fb-104f-46c4-bb8b-2c3f4bc2c69c",
        "name": "Portable Power Bank 10000mAh",
        "description": "Charge your devices on the go.",
        "price": 25.99,
        "stockQuantity": 150,
        "category": "Accessories",
        "imageUrl": "https://placehold.co/300x300?text=Power+Bank"
    },
    {
        "id": 9,
        "storeId": "fd8c40fb-104f-46c4-bb8b-2c3f4bc2c69c",
        "name": "Bluetooth Speaker Mini",
        "description": "Compact speaker with rich sound.",
        "price": 45,
        "stockQuantity": 90,
        "category": "Audio",
        "imageUrl": "https://placehold.co/300x300?text=BT+Speaker+Mini"
    },
    {
        "id": 10,
        "storeId": "fd8c40fb-104f-46c4-bb8b-2c3f4bc2c69c",
        "name": "Gaming Mouse RGB",
        "description": "High precision mouse for gaming enthusiasts.",
        "price": 59.99,
        "stockQuantity": 65,
        "category": "Peripherals",
        "imageUrl": "https://placehold.co/300x300?text=Gaming+Mouse"
    },
    {
        "id": 11,
        "storeId": "fd8c40fb-104f-46c4-bb8b-2c3f4bc2c69c",
        "name": "Mechanical Keyboard",
        "description": "Tactile keyboard for typing and gaming.",
        "price": 89.99,
        "stockQuantity": 55,
        "category": "Peripherals",
        "imageUrl": "https://placehold.co/300x300?text=Mech+Keyboard"
    },
    {
        "id": 12,
        "storeId": "fd8c40fb-104f-46c4-bb8b-2c3f4bc2c69c",
        "name": "Webcam HD 1080p",
        "description": "Clear video for calls and streaming.",
        "price": 49.95,
        "stockQuantity": 80,
        "category": "Peripherals",
        "imageUrl": "https://placehold.co/300x300?text=Webcam+HD"
    },
    {
        "id": 13,
        "storeId": "fd8c40fb-104f-46c4-bb8b-2c3f4bc2c69c",
        "name": "Tablet Pro 11-inch",
        "description": "Powerful tablet for work and play.",
        "price": 499,
        "stockQuantity": 30,
        "category": "Electronics",
        "imageUrl": "https://placehold.co/300x300?text=Tablet+Pro"
    },
    {
        "id": 14,
        "storeId": "fd8c40fb-104f-46c4-bb8b-2c3f4bc2c69c",
        "name": "E-Reader Glo",
        "description": "Read books comfortably day or night.",
        "price": 129.99,
        "stockQuantity": 70,
        "category": "Electronics",
        "imageUrl": "https://placehold.co/300x300?text=E-Reader"
    },
    {
        "id": 15,
        "storeId": "fd8c40fb-104f-46c4-bb8b-2c3f4bc2c69c",
        "name": "Smart Light Bulb Color",
        "description": "Control lighting with your voice or app.",
        "price": 19.99,
        "stockQuantity": 200,
        "category": "Smart Home",
        "imageUrl": "https://placehold.co/300x300?text=Smart+Bulb"
    },
    {
        "id": 16,
        "storeId": "fd8c40fb-104f-46c4-bb8b-2c3f4bc2c69c",
        "name": "Drone Mini Explorer",
        "description": "Easy-to-fly drone with camera.",
        "price": 99,
        "stockQuantity": 25,
        "category": "Gadgets",
        "imageUrl": "https://placehold.co/300x300?text=Drone+Mini"
    },
    {
        "id": 17,
        "storeId": "fd8c40fb-104f-46c4-bb8b-2c3f4bc2c69c",
        "name": "USB-C Hub Multiport",
        "description": "Expand connectivity for your laptop.",
        "price": 34.5,
        "stockQuantity": 110,
        "category": "Accessories",
        "imageUrl": "https://placehold.co/300x300?text=USB-C+Hub"
    },
    {
        "id": 18,
        "storeId": "fd8c40fb-104f-46c4-bb8b-2c3f4bc2c69c",
        "name": "Screen Protector Glass",
        "description": "Protect your Smartphone Z screen.",
        "price": 9.99,
        "stockQuantity": 300,
        "category": "Accessories",
        "imageUrl": "https://placehold.co/300x300?text=Screen+Protector"
    },
    {
        "id": 19,
        "storeId": "fd8c40fb-104f-46c4-bb8b-2c3f4bc2c69c",
        "name": "Laptop Stand Adjustable",
        "description": "Ergonomic stand for comfortable work.",
        "price": 22.99,
        "stockQuantity": 85,
        "category": "Accessories",
        "imageUrl": "https://placehold.co/300x300?text=Laptop+Stand"
    },
    {
        "id": 20,
        "storeId": "fd8c40fb-104f-46c4-bb8b-2c3f4bc2c69c",
        "name": "VR Headset Vision",
        "description": "Immersive virtual reality experience.",
        "price": 299,
        "stockQuantity": 15,
        "category": "Gadgets",
        "imageUrl": "https://placehold.co/300x300?text=VR+Headset"
    },
    {
        "id": 21,
        "storeId": "fd8c40fb-104f-46c4-bb8b-2c3f4bc2c69c",
        "name": "Smart Plug Wi-Fi",
        "description": "Control appliances remotely.",
        "price": 12.99,
        "stockQuantity": 180,
        "category": "Smart Home",
        "imageUrl": "https://placehold.co/300x300?text=Smart+Plug"
    },
    {
        "id": 22,
        "storeId": "fd8c40fb-104f-46c4-bb8b-2c3f4bc2c69c",
        "name": "Wireless Earbuds Air",
        "description": "True wireless freedom with great sound.",
        "price": 79.99,
        "stockQuantity": 95,
        "category": "Audio",
        "imageUrl": "https://placehold.co/300x300?text=Earbuds+Air"
    },
    {
        "id": 23,
        "storeId": "fd8c40fb-104f-46c4-bb8b-2c3f4bc2c69c",
        "name": "Gaming Headset Surround",
        "description": "Hear every detail in your games.",
        "price": 69.95,
        "stockQuantity": 45,
        "category": "Audio",
        "imageUrl": "https://placehold.co/300x300?text=Gaming+Headset"
    },
    {
        "id": 24,
        "storeId": "9ea613f1-5708-496c-9c2a-5aac3c9a1b66",
        "name": "Camping Tent 4-Person",
        "description": "Waterproof dome tent, easy setup.",
        "price": 129.99,
        "stockQuantity": 30,
        "category": "Camping Gear",
        "imageUrl": "https://placehold.co/300x300?text=4P+Tent"
    },
    {
        "id": 25,
        "storeId": "9ea613f1-5708-496c-9c2a-5aac3c9a1b66",
        "name": "Hiking Backpack 50L",
        "description": "Durable backpack with rain cover.",
        "price": 89.5,
        "stockQuantity": 50,
        "category": "Backpacks",
        "imageUrl": "https://placehold.co/300x300?text=Hiking+Backpack"
    },
    {
        "id": 26,
        "storeId": "9ea613f1-5708-496c-9c2a-5aac3c9a1b66",
        "name": "Sleeping Bag 3-Season",
        "description": "Comfortable sleeping bag for moderate temps.",
        "price": 65,
        "stockQuantity": 70,
        "category": "Camping Gear",
        "imageUrl": "https://placehold.co/300x300?text=Sleeping+Bag"
    },
    {
        "id": 27,
        "storeId": "9ea613f1-5708-496c-9c2a-5aac3c9a1b66",
        "name": "Camping Chair Folding",
        "description": "Lightweight and portable chair.",
        "price": 29.99,
        "stockQuantity": 100,
        "category": "Camping Furniture",
        "imageUrl": "https://placehold.co/300x300?text=Camping+Chair"
    },
    {
        "id": 28,
        "storeId": "9ea613f1-5708-496c-9c2a-5aac3c9a1b66",
        "name": "Insulated Water Bottle 32oz",
        "description": "Keeps drinks cold or hot for hours.",
        "price": 24.95,
        "stockQuantity": 150,
        "category": "Drinkware",
        "imageUrl": "https://placehold.co/300x300?text=Water+Bottle"
    },
    {
        "id": 29,
        "storeId": "9ea613f1-5708-496c-9c2a-5aac3c9a1b66",
        "name": "Headlamp LED Rechargeable",
        "description": "Bright hands-free lighting for trails.",
        "price": 19.99,
        "stockQuantity": 120,
        "category": "Lighting",
        "imageUrl": "https://placehold.co/300x300?text=Headlamp"
    },
    {
        "id": 30,
        "storeId": "9ea613f1-5708-496c-9c2a-5aac3c9a1b66",
        "name": "Hiking Boots Waterproof Men",
        "description": "Supportive boots for tough terrain (Size 10).",
        "price": 119,
        "stockQuantity": 40,
        "category": "Footwear",
        "imageUrl": "https://placehold.co/300x300?text=Hiking+Boots+M"
    },
    {
        "id": 31,
        "storeId": "9ea613f1-5708-496c-9c2a-5aac3c9a1b66",
        "name": "Hiking Boots Waterproof Women",
        "description": "Comfortable boots for trails (Size 8).",
        "price": 115,
        "stockQuantity": 45,
        "category": "Footwear",
        "imageUrl": "https://placehold.co/300x300?text=Hiking+Boots+W"
    },
    {
        "id": 32,
        "storeId": "9ea613f1-5708-496c-9c2a-5aac3c9a1b66",
        "name": "Camping Stove Portable Propane",
        "description": "Single burner stove for cooking outdoors.",
        "price": 45.99,
        "stockQuantity": 55,
        "category": "Cooking Gear",
        "imageUrl": "https://placehold.co/300x300?text=Camping+Stove"
    },
    {
        "id": 33,
        "storeId": "9ea613f1-5708-496c-9c2a-5aac3c9a1b66",
        "name": "Cooler Box 48-Quart",
        "description": "Keeps food and drinks cold for days.",
        "price": 59.95,
        "stockQuantity": 25,
        "category": "Coolers",
        "imageUrl": "https://placehold.co/300x300?text=Cooler+Box"
    },
    {
        "id": 34,
        "storeId": "9ea613f1-5708-496c-9c2a-5aac3c9a1b66",
        "name": "Trekking Poles Carbon Fiber",
        "description": "Lightweight poles for stability.",
        "price": 75,
        "stockQuantity": 60,
        "category": "Hiking Gear",
        "imageUrl": "https://placehold.co/300x300?text=Trekking+Poles"
    },
    {
        "id": 35,
        "storeId": "9ea613f1-5708-496c-9c2a-5aac3c9a1b66",
        "name": "Hammock Double Nylon",
        "description": "Relaxing hammock for two.",
        "price": 39.99,
        "stockQuantity": 80,
        "category": "Camping Furniture",
        "imageUrl": "https://placehold.co/300x300?text=Hammock"
    },
    {
        "id": 36,
        "storeId": "9ea613f1-5708-496c-9c2a-5aac3c9a1b66",
        "name": "First Aid Kit Outdoor",
        "description": "Comprehensive kit for minor injuries.",
        "price": 28.5,
        "stockQuantity": 90,
        "category": "Safety",
        "imageUrl": "https://placehold.co/300x300?text=First+Aid+Kit"
    },
    {
        "id": 37,
        "storeId": "9ea613f1-5708-496c-9c2a-5aac3c9a1b66",
        "name": "Binoculars Compact 8x42",
        "description": "Clear viewing for birdwatching or scenery.",
        "price": 99,
        "stockQuantity": 35,
        "category": "Optics",
        "imageUrl": "https://placehold.co/300x300?text=Binoculars"
    },
    {
        "id": 38,
        "storeId": "9ea613f1-5708-496c-9c2a-5aac3c9a1b66",
        "name": "Campfire Roasting Sticks (Set of 4)",
        "description": "Extendable sticks for marshmallows.",
        "price": 14.99,
        "stockQuantity": 110,
        "category": "Cooking Gear",
        "imageUrl": "https://placehold.co/300x300?text=Roasting+Sticks"
    },
    {
        "id": 39,
        "storeId": "9ea613f1-5708-496c-9c2a-5aac3c9a1b66",
        "name": "Solar Charger Panel 10W",
        "description": "Charge devices using solar power.",
        "price": 49.99,
        "stockQuantity": 40,
        "category": "Electronics",
        "imageUrl": "https://placehold.co/300x300?text=Solar+Panel"
    },
    {
        "id": 40,
        "storeId": "9ea613f1-5708-496c-9c2a-5aac3c9a1b66",
        "name": "Water Filter Straw Personal",
        "description": "Filter water directly from sources.",
        "price": 21.95,
        "stockQuantity": 130,
        "category": "Water Treatment",
        "imageUrl": "https://placehold.co/300x300?text=Water+Filter+Straw"
    },
    {
        "id": 41,
        "storeId": "9ea613f1-5708-496c-9c2a-5aac3c9a1b66",
        "name": "Dry Bag Waterproof 20L",
        "description": "Keep gear dry during water activities.",
        "price": 18.99,
        "stockQuantity": 85,
        "category": "Bags",
        "imageUrl": "https://placehold.co/300x300?text=Dry+Bag"
    },
    {
        "id": 42,
        "storeId": "9ea613f1-5708-496c-9c2a-5aac3c9a1b66",
        "name": "Camping Lantern LED",
        "description": "Bright area lighting for campsite.",
        "price": 26.99,
        "stockQuantity": 75,
        "category": "Lighting",
        "imageUrl": "https://placehold.co/300x300?text=Camping+Lantern"
    },
    {
        "id": 43,
        "storeId": "9ea613f1-5708-496c-9c2a-5aac3c9a1b66",
        "name": "Multi-Tool Pocket Knife",
        "description": "Versatile tool for various tasks.",
        "price": 32.95,
        "stockQuantity": 100,
        "category": "Tools",
        "imageUrl": "https://placehold.co/300x300?text=Multi-Tool"
    },
    {
        "id": 44,
        "storeId": "22247c9f-5eed-4030-b14b-957233143c74",
        "name": "Ceramic Vase Abstract",
        "description": "Modern design vase for flowers or decor.",
        "price": 35.5,
        "stockQuantity": 60,
        "category": "Decor",
        "imageUrl": "https://placehold.co/300x300?text=Ceramic+Vase"
    },
    {
        "id": 45,
        "storeId": "22247c9f-5eed-4030-b14b-957233143c74",
        "name": "Throw Pillow Velvet",
        "description": "Soft and luxurious cushion for sofa or bed.",
        "price": 24.99,
        "stockQuantity": 100,
        "category": "Textiles",
        "imageUrl": "https://placehold.co/300x300?text=Velvet+Pillow"
    },
    {
        "id": 46,
        "storeId": "22247c9f-5eed-4030-b14b-957233143c74",
        "name": "Wooden Cutting Board",
        "description": "Durable acacia wood board for kitchen prep.",
        "price": 29.95,
        "stockQuantity": 80,
        "category": "Kitchenware",
        "imageUrl": "https://placehold.co/300x300?text=Cutting+Board"
    },
    {
        "id": 47,
        "storeId": "22247c9f-5eed-4030-b14b-957233143c74",
        "name": "LED Floor Lamp",
        "description": "Adjustable brightness floor lamp.",
        "price": 79,
        "stockQuantity": 40,
        "category": "Lighting",
        "imageUrl": "https://placehold.co/300x300?text=Floor+Lamp"
    },
    {
        "id": 48,
        "storeId": "22247c9f-5eed-4030-b14b-957233143c74",
        "name": "Storage Basket Woven",
        "description": "Natural seagrass basket for organization.",
        "price": 19.99,
        "stockQuantity": 120,
        "category": "Storage",
        "imageUrl": "https://placehold.co/300x300?text=Woven+Basket"
    },
    {
        "id": 49,
        "storeId": "22247c9f-5eed-4030-b14b-957233143c74",
        "name": "Wall Mirror Round Gold",
        "description": "Elegant round mirror with gold frame.",
        "price": 55,
        "stockQuantity": 50,
        "category": "Decor",
        "imageUrl": "https://placehold.co/300x300?text=Round+Mirror"
    },
    {
        "id": 50,
        "storeId": "22247c9f-5eed-4030-b14b-957233143c74",
        "name": "Dinnerware Set (16pc)",
        "description": "Service for 4, durable stoneware.",
        "price": 89.99,
        "stockQuantity": 35,
        "category": "Kitchenware",
        "imageUrl": "https://placehold.co/300x300?text=Dinnerware+Set"
    },
    {
        "id": 51,
        "storeId": "22247c9f-5eed-4030-b14b-957233143c74",
        "name": "Duvet Cover Set Queen",
        "description": "Soft cotton duvet cover and pillow shams.",
        "price": 65,
        "stockQuantity": 70,
        "category": "Bedding",
        "imageUrl": "https://placehold.co/300x300?text=Duvet+Cover"
    },
    {
        "id": 52,
        "storeId": "22247c9f-5eed-4030-b14b-957233143c74",
        "name": "Bookshelf 5-Tier",
        "description": "Industrial style bookshelf for display.",
        "price": 119.99,
        "stockQuantity": 25,
        "category": "Furniture",
        "imageUrl": "https://placehold.co/300x300?text=Bookshelf"
    },
    {
        "id": 53,
        "storeId": "22247c9f-5eed-4030-b14b-957233143c74",
        "name": "Scented Candle Lavender",
        "description": "Relaxing lavender scent, long burn time.",
        "price": 15.95,
        "stockQuantity": 150,
        "category": "Decor",
        "imageUrl": "https://placehold.co/300x300?text=Scented+Candle"
    },
    {
        "id": 54,
        "storeId": "22247c9f-5eed-4030-b14b-957233143c74",
        "name": "Kitchen Utensil Set Silicone",
        "description": "Non-stick utensils with holder.",
        "price": 32.99,
        "stockQuantity": 90,
        "category": "Kitchenware",
        "imageUrl": "https://placehold.co/300x300?text=Utensil+Set"
    },
    {
        "id": 55,
        "storeId": "22247c9f-5eed-4030-b14b-957233143c74",
        "name": "Bath Towel Set Cotton",
        "description": "Absorbent and soft bath towels (Set of 4).",
        "price": 42,
        "stockQuantity": 110,
        "category": "Bath",
        "imageUrl": "https://placehold.co/300x300?text=Towel+Set"
    },
    {
        "id": 56,
        "storeId": "22247c9f-5eed-4030-b14b-957233143c74",
        "name": "Desk Lamp LED Modern",
        "description": "Minimalist desk lamp with USB port.",
        "price": 38.5,
        "stockQuantity": 75,
        "category": "Lighting",
        "imageUrl": "https://placehold.co/300x300?text=Desk+Lamp"
    },
    {
        "id": 57,
        "storeId": "22247c9f-5eed-4030-b14b-957233143c74",
        "name": "Picture Frame Set (7pc)",
        "description": "Various sizes for creating a gallery wall.",
        "price": 45.99,
        "stockQuantity": 65,
        "category": "Decor",
        "imageUrl": "https://placehold.co/300x300?text=Picture+Frames"
    },
    {
        "id": 58,
        "storeId": "22247c9f-5eed-4030-b14b-957233143c74",
        "name": "Area Rug Geometric 5x7",
        "description": "Stylish rug to define living spaces.",
        "price": 139,
        "stockQuantity": 20,
        "category": "Rugs",
        "imageUrl": "https://placehold.co/300x300?text=Area+Rug"
    },
    {
        "id": 59,
        "storeId": "22247c9f-5eed-4030-b14b-957233143c74",
        "name": "Coffee Maker Drip 12-Cup",
        "description": "Programmable coffee maker.",
        "price": 55.99,
        "stockQuantity": 55,
        "category": "Appliances",
        "imageUrl": "https://placehold.co/300x300?text=Coffee+Maker"
    },
    {
        "id": 60,
        "storeId": "22247c9f-5eed-4030-b14b-957233143c74",
        "name": "Knife Block Set Stainless",
        "description": "Sharp knives with wooden block.",
        "price": 99.95,
        "stockQuantity": 30,
        "category": "Kitchenware",
        "imageUrl": "https://placehold.co/300x300?text=Knife+Set"
    },
    {
        "id": 61,
        "storeId": "22247c9f-5eed-4030-b14b-957233143c74",
        "name": "Wall Clock Minimalist",
        "description": "Silent non-ticking wall clock.",
        "price": 28,
        "stockQuantity": 95,
        "category": "Decor",
        "imageUrl": "https://placehold.co/300x300?text=Wall+Clock"
    },
    {
        "id": 62,
        "storeId": "22247c9f-5eed-4030-b14b-957233143c74",
        "name": "Placemat Set Woven (Set of 4)",
        "description": "Protect your table in style.",
        "price": 18.99,
        "stockQuantity": 130,
        "category": "Tableware",
        "imageUrl": "https://placehold.co/300x300?text=Placemats"
    },
    {
        "id": 63,
        "storeId": "22247c9f-5eed-4030-b14b-957233143c74",
        "name": "Artificial Plant Fiddle Leaf",
        "description": "Low maintenance greenery for any room.",
        "price": 49.99,
        "stockQuantity": 60,
        "category": "Decor",
        "imageUrl": "https://placehold.co/300x300?text=Artificial+Plant"
    }
]