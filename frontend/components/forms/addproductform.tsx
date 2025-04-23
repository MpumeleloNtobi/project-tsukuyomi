
"use client"
import { useRouter } from "next/navigation";
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
  

import { Button } from "@/components/ui/button"
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

//We define the form schema/model and then inside is simple the validation logic
const formSchema = z.object({
  ProductName: z.string().min(4, {
    message: "Product name must have atleast 4 characters",
  }),
  Productprice: z.coerce.number().min(1, "Price must be at least 1"),
  Quantity : z.coerce.number().int("Must be an integer").min(1, "Quantity must be at least 1"),
  Description : z.string().min(15,{message : "The description must be atleast 15  characters"}),
  Category : z.string().min(3,{message :"we're still going to validate Category"})


})

// ProfileForm component, where form logic is defined
export function ProfileForm() {
    const router=useRouter();
  // 1. Use the useForm hook to define the form and bind it with validation schema
  //set the default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ProductName: "",
      Productprice:0,
      Quantity : 0,
      Description :"",
      Category :""


    },
  })

  
  const onSubmit = (values: z.infer<typeof formSchema>) => {
  //submit everything to the API
  console.log("submitted", values);
  router.push("/seller/products");
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
                  This is the name we're gonna assign to the product
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
  
          {/* Field 2: Product Price */}
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
  
          {/* Field 3: Category */}
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
  
          {/* Field 4: Quantity */}
          <FormField
            control={form.control}
            name="Quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity of this product</FormLabel>
                <FormControl>
                  <Input
                    type="number" placeholder="Please enter Quantity" {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
  
          <Button type="submit" className="w-full">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
  