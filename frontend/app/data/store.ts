// app/data/store.ts
// store.ts

export interface Store {
    id: string
    name: string
    description: string
    category: string
    imageUrl: string
    location: string
  }
  
  export const stores: Store[] = [
    {
      id: '69d45244-fa6d-4dec-9c0e-2a6374fc401a',
      name: 'Widget World',
      description: 'Your one-stop shop for all types of widgets and gadgets.',
      category: 'General Goods',
      imageUrl: 'https://placehold.co/600x400?text=Widget+World',
      location: 'Cape Town, South Africa'
    },
    {
      id: 'fd8c40fb-104f-46c4-bb8b-2c3f4bc2c69c',
      name: 'Tech Essentials',
      description: 'Latest in consumer electronics, gadgets, and peripherals.',
      category: 'Electronics',
      imageUrl: 'https://placehold.co/600x400?text=Tech+Essentials',
      location: 'Johannesburg, South Africa'
    },
    {
      id: '9ea613f1-5708-496c-9c2a-5aac3c9a1b66',
      name: 'Outdoor Adventures',
      description: 'Gear up for the wild with our camping and hiking essentials.',
      category: 'Outdoor & Camping',
      imageUrl: 'https://placehold.co/600x400?text=Outdoor+Adventures',
      location: 'Durban, South Africa'
    },
    {
      id: 'f3b45af4-11db-4db2-a9d4-299cd36c7a44',
      name: 'Kitchen Provisions',
      description: 'Top-quality cookware and utensils for every home chef.',
      category: 'Home & Kitchen',
      imageUrl: 'https://placehold.co/600x400?text=Kitchen+Provisions',
      location: 'Port Elizabeth, South Africa'
    },
    {
      id: 'd9a49a99-fc3f-4b9f-b59e-1de53668c17c',
      name: 'Fitness Hub',
      description: 'All your fitness needs from gear to nutrition.',
      category: 'Health & Fitness',
      imageUrl: 'https://placehold.co/600x400?text=Fitness+Hub',
      location: 'Pretoria, South Africa'
    },
    {
      id: 'c5ebd0e7-27a1-4f2c-985e-e7c7309647de',
      name: 'Style Street',
      description: 'Trendy fashion for men and women at affordable prices.',
      category: 'Fashion',
      imageUrl: 'https://placehold.co/600x400?text=Style+Street',
      location: 'Bloemfontein, South Africa'
    },
    {
      id: '3c471f7b-2ac4-42e2-b9d3-4b733e9b8c2a',
      name: 'Book Haven',
      description: 'A cozy place to discover books and stories from every genre.',
      category: 'Books',
      imageUrl: 'https://placehold.co/600x400?text=Book+Haven',
      location: 'East London, South Africa'
    },
    {
      id: 'b6f1eb08-7f48-4c7a-a759-3d5c4871779d',
      name: 'Pet Paradise',
      description: 'Toys, treats, and supplies for all your furry friends.',
      category: 'Pets',
      imageUrl: 'https://placehold.co/600x400?text=Pet+Paradise',
      location: 'Polokwane, South Africa'
    },
    {
      id: '842b353e-d226-4eb6-8a69-92a0ef5d2a77',
      name: 'HomeTech',
      description: 'Smart home devices and automation at your fingertips.',
      category: 'Smart Home',
      imageUrl: 'https://placehold.co/600x400?text=HomeTech',
      location: 'George, South Africa'
    },
    {
      id: '612b8586-7287-4d36-8b1d-4d87607b9587',
      name: 'Green Thumb',
      description: 'Garden tools, plants, and outdoor décor for enthusiasts.',
      category: 'Gardening',
      imageUrl: 'https://placehold.co/600x400?text=Green+Thumb',
      location: 'Nelspruit, South Africa'
    }
  ]
  
  