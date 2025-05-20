
"use client"

import { Column, ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"
import { format, isToday, isYesterday, isThisWeek, parseISO } from "date-fns"
import { orderAlertDialog } from "./order-dialogue"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Check, ChevronsUpDown } from "lucide-react"
 
import { cn } from "@/lib/utils"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from "react"
import React from "react"

const orderStatuses = [
  {
    value: "Shipped",
    label: "Shipped",
  },
  {
    value: "Pending",
    label: "Pending",
  },
  {
    value: "Completed",
    label: "Completed",
  },
  {
    value: "Processing",
    label: "Processing",
  },
]

//Define the shape of an order
export type Order = {
  buyerName : string 
  city : string
  created_at : string
  deliveryMethod :"pickup" | "delivery"
  order_id :string
  paymentId : string
  paymentStatus : "payed" | "unpaid"
  phoneNumber : string
  postalCode :number
  status : "Shipped" | "Pending" | "Processing" | "Completed"
  storeId : string
  streetName :string
  streetNumber :number
  town : string
  total_price : number
  last_updated: string
}
export function getOrderColumns(
  onUpdateClick: (order: Order) => void

):  ColumnDef<Order>[] { 
 
     return [
  {
    accessorKey: "order_id",
    header: ({ column }: { column: Column<Order, unknown> }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Order#
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    }
  }
    ,
  {
    accessorKey: "buyerName",
    header: "Client Name",
  },
  {
  accessorKey: "status",
  header: ({ column }) => {
    return (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    );
}
  }



    
    ,{

    accessorKey:"total_price",
    header: () => <div className="text-right">Total price</div>,
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("total_price"))
      const formatted = new Intl.NumberFormat("en-ZA", {
        style: "currency",
        currency: "ZAR",
      }).format(price)
 
      return <div className="text-right font-medium">{formatted}</div>
  }},
  {
    accessorKey: "created_at",
    header: ()=><div className="text-right">Created At</div>,
    cell :({row})=>{
        const date=new Date(row.getValue("created_at"))
        const formatted=new Intl.DateTimeFormat("en-GB",{
            day : "2-digit",
            month :"long",
            year: "numeric"
        }).format(date)

        return <div className="text-right font-medium">{formatted}</div>
    }
  },

  //We need to get today's date so that we can use Terms like Today and last week
  {
      accessorKey: "last_updated",
  header: () => <div className="text-right">Last updated</div>,
  cell: ({ row }) => {
    const rawDate = row.getValue("last_updated") as string
    const date = parseISO(rawDate) // ensure rawDate is ISO (e.g. "2025-05-14T10:44:37.970Z")

    let formatted
    if (isToday(date)) {
      formatted = "Today"
    } else if (isYesterday(date)) {
      formatted = "Yesterday"
    } else if (isThisWeek(date, { weekStartsOn: 1 })) {
      formatted = format(date, "EEEE") // "Monday"
    } else {
      formatted = format(date, "d MMMM yyyy") //  "12 May 2025"
    }

    return <div className="text-right font-medium">{formatted}</div>
  }
  },
  {
      id: "actions",
      cell: ({ row }) => {
        const order = row.original;
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onUpdateClick(order)}>
                Update
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }
]
}