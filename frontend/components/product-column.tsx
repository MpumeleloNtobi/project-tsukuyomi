
/* eslint-disable react-hooks/rules-of-hooks */
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import {useUser} from "@clerk/nextjs"
import { MoreHorizontal } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import React, { useState } from "react"
import { Trash2 } from "lucide-react";


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Product = {
  id: string
  product_name: string
  product_description: string
  price : number
  quantity: number 
  category : string
}

//We define a function that deletes the product in the database and pas

export const getColumns = ({ onDeleteSuccess,onEdit }: {onEdit :(product :Product)=>void; onDeleteSuccess: () => void }): ColumnDef<Product>[] => [
  {
    id : "name",
    accessorKey: "name",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
  },
  {
    id : "description",
    accessorKey: "description",
    header: "Description",
  },
  {
    id : "price",
    accessorKey: "price",
    header: () => <div className="text-right">Price</div>,
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"))
      const formatted = new Intl.NumberFormat("en-ZA", {
        style: "currency",
        currency: "ZAR",
      }).format(price)
 
      return <div className="text-right font-medium">{formatted}</div>
  },
  },
  {
    id : "category",
    accessorKey: "category",
    header: "Category",
  },
  {
    id : "stockQuantity",
    accessorKey: "stockQuantity",
    header: "Quantity",
  },

  //an actions column
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original

      //functions related to action
      const [open,setOpen]=React.useState(false);
      const user=useUser();
      const [error, setError] = useState<string | null>(null);
      const [selectedProductId,setproductid]=useState<string | undefined>(undefined);
      setproductid(product.id)
      //from here I should pass the selected productid to the page.tsx
       
      const ApiURL=`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/${product.id}`
      
      const HandleDelete=async ()=>{

        try {
          
          const response=await fetch(ApiURL,{
            method :'DELETE',
            headers :{
              'Content-type': 'application/json'
            }
  
          });
          if (response.ok){
            onDeleteSuccess();
            toast.success(`The product  has been deleted successfully!!`);
          }
          else{
            const errordata=await response.json();
            setError(`Message : ${errordata.error}`)
          }

          
        } catch (error: any) {
          setError(error.message);
          
        }
        

      }

 
      return (
        <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            
            <DropdownMenuItem onClick={() => setOpen(true)}>
  <Trash2 className="mr-2 h-4 w-4 text-red-500" />
  Remove Product
</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Product in detail</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={()=> onEdit(product)}>Edit product</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
    {/*Since we have set out component to open when an onclick on remove product happens then we don't need an alert trigger button */}
        <AlertDialog open={open} onOpenChange={setOpen} >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.This will permanently delete the product from all Your store products
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={()=>setOpen(false)}>Cancel</AlertDialogCancel>
          {/*We want to add an onclick that will trigger a button to delete the component when You click continue */}
          <AlertDialogAction onClick={HandleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
        </>
      )
    },
  },
]

