"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

 

import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react';
import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { Product } from "../product-column"



const formSchema = z.object({
  ProductName: z.string().min(4, {message: "Product name must have atleast 4 characters"}),
  Description: z.string().min(10, {message: "Description must have atleast 10 characters"}),
  Productprice: z.coerce.number().min(1, "Price must be at least 1"),
  Quantity : z.coerce.number().int("Must be an integer").min(1, "Quantity must be at least 1"),
  Category : z.string().min(3,{message :"we're still going to validate Category"})
})

// Function to simulate the API call
async function createProduct(data: z.infer<typeof formSchema>, storeId: string) {
  const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/products`;

  const productData = {
    storeId: storeId,
    name: data.ProductName,
    description: data.Description,
    price: data.Productprice,
    stockQuantity: data.Quantity,
    category: data.Category,
    image1url: `https://placehold.co/600x400?text=${data.ProductName.replace(/\s/g, '-')}`, // Ignoring imageUrl as requested
    image2url: `https://placehold.co/600x400?text=${data.ProductName.replace(/\s/g, '-')}`, // Ignoring imageUrl as requested
    image3url: `https://placehold.co/600x400?text=${data.ProductName.replace(/\s/g, '-')}`, // Ignoring imageUrl as requested
  };

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    const error = await response.json();
    console.trace("This is where the response Failed");
    console.log(response);
    throw new Error(error.message || 'Failed to add product');
  }

  return response.json();
}

//we create a function that updates the product 
async function updateProduct(data: z.infer<typeof formSchema>, storeId: string,productId : string | null) {
  const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/products/${productId}`;

  const productData = {
    storeId: storeId,
    name: data.ProductName,
    description: data.Description,
    price: data.Productprice,
    stockQuantity: data.Quantity,
    category: data.Category,
    image1url: `https://placehold.co/600x400?text=${data.ProductName.replace(/\s/g, '-')}`, // Ignoring imageUrl as requested
    image2url: `https://placehold.co/600x400?text=${data.ProductName.replace(/\s/g, '-')}`, // Ignoring imageUrl as requested
    image3url: `https://placehold.co/600x400?text=${data.ProductName.replace(/\s/g, '-')}`, // Ignoring imageUrl as requested
  };

  const response = await fetch(apiUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    const error = await response.json();
    console.trace("This is where the response Failed");
    console.log(response);
    throw new Error(error.message || 'Failed to UPDATE product');
  }

  return response.json();
}




type ProductFormprops={
  onSuccess:()=>void;
  isEditing: boolean;
  formData : Product | null;
  selectedProductId : string | null;
  
    
};

export default function ProductForm({ onSuccess,isEditing,formData,selectedProductId} : ProductFormprops) {
  const router = useRouter()
  const { user } = useUser()

  // Piece of state to hold the storeId
  const [storeId, setStoreId] = useState<string | undefined>(undefined);
  const [productId,setproductid]=useState<string | null>(null)
  
  

  //this is for when the productid changes
  useEffect(()=>{
    if(selectedProductId!==productId)
    setproductid(selectedProductId);
  },[selectedProductId,productId])
  



  useEffect(() => {
    if (user) {
      setStoreId(user?.publicMetadata?.storeId as string | undefined);
    }
  }, [user]);
//when form data has been passed use that one else use the default empty
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ProductName: formData?.product_name??"",
      Description: formData?.product_description??"",
      Productprice:formData?.price??1,
      Quantity : formData?.quantity??1,
      Category :formData?.category??""
    },
  })
    

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!storeId) {
      toast.error("Store ID not found. Please ensure you are logged in and have a store associated with your account.");
      return;
    }
   
    if (isEditing){

      toast.promise(updateProduct(values, storeId,productId), {
        loading: 'updating product...',
        success: (data) => {
          form.reset(); // Optionally reset the form after successful submission
          onSuccess();
          return `${values.ProductName} has been updated successfully!`;
        },
        error: (error) => {
          return `Error Updating product: ${error.message}`;
        },
  
      });
    }
    else{
      //this is an instance where You're creating the new product
      //run the function that creates a new product
      toast.promise(createProduct(values, storeId), {
        loading: 'Adding product...',
        success: (data) => {
          form.reset(); // Optionally reset the form after successful submission
          onSuccess();
          return `${values.ProductName} has been added successfully!`;
        },
        error: (error) => {
          return `Error adding product: ${error.message}`;
        },
  
      });

    }
/*
    toast.promise(createProduct(values, storeId), {
      loading: 'Adding product...',
      success: (data) => {
        form.reset(); // Optionally reset the form after successful submission
        onSuccess();
        return `${values.ProductName} has been added successfully!`;
      },
      error: (error) => {
        return `Error adding product: ${error.message}`;
      },

    });
    */
    //Phutheho edited here while building the add product Modal
    //I want to reset to the very same page after adding a new product
    const storeid=user?.publicMetadata.storeId;
    router.push(`/seller/${storeid}/products`);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-white p-8 rounded-xl shadow-md w-full max-w-md">
          {/* Field 1: Product Name */}
          <FormField
            control={form.control}
            name="ProductName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="Please enter name" {...field} />
                </FormControl>
                <FormDescription>
                  Give your product a clear and concise name that will help customers identify it.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Field 2: Description */}
          <FormField
            control={form.control}
            name="Description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Enter a detailed description" {...field} />
                </FormControl>
                <FormDescription>
                Provide a comprehensive overview of your products features, benefits, and any other relevant details.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Field 3: Product Price */}
          <FormField
            control={form.control}
            name="Productprice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number" placeholder="Please enter Price" {...field}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Field 4: Category */}
          <FormField
            control={form.control}
            name="Category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="furniture">Home furniture</SelectItem>
                    <SelectItem value="art">Art collection</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Your product should match selected category
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Field 5: Quantity */}
          <FormField
            control={form.control}
            name="Quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity in stock</FormLabel>
                <FormControl>
                  <Input
                    type="number" placeholder="Please enter Quantity" {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
          <Button type="submit" className="w-full">
  {isEditing ? "Update Product" : (
    <>
      <Plus className="mr-2" />
      Add Product
    </>
  )}
</Button>
          </div>

        </form>
      </Form>
    </div>
  );
}
