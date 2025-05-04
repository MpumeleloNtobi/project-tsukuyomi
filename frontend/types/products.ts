export type Product = {
    id: number;
    storeId: string;
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
    category: string;
    image1url?: string | null;
    image2url?: string | null;
    image3url?: string | null;
  };

