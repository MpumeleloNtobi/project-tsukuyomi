"use client";
import { useEffect, useState } from "react";
import {useUser} from "@clerk/nextjs"
import { Skeleton } from "@/components/ui/skeleton"
import { Order, getOrderColumns } from "./order-column"
import { DataTable } from "./order-table"
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PackageCheck, Clock,Truck,PackageSearch } from "lucide-react"
import { toast } from "sonner";






function SellerOrders() {
    const [allOrders,setAllOrders]=useState([])//we use it to manage our orders 
    const [error,setError]=useState<string | null>(null);
    const [loading,setLoading]=useState(false);//we want to use the loading state to render something while it fetch
    const {user}=useUser();
    const [status,setStatus]=useState("all")
    const [displayed,setdisplayedOrders]=useState([])
    //const [newOrderstatus,setNewOrderStatus]=useState<Order | null>(null)
   // const [updating,setUpdating]=useState(false);


    //Count all categories locally
    const [allOrdersCount,setAllordersCount]=useState(0);
    const [pendingCount,setpendingCount]=useState(0);
    const [shippedCount,setShippedCount]=useState(0);
    const [processingCount,setProcessingCount]=useState(0);
    const [completedCount,setCompletedCount]=useState(0);

  const columns = getOrderColumns(/*setNewOrderStatus, setUpdating*/);
  

    const storeId=user?.publicMetadata?.storeId;
    //We define a function that fetches all the orders and includes them in array orders
    const fetchOrders=async ()=>{
        if (!storeId)return;
        //While the fetch occurs we set the loading state to true and al
        setLoading(true);
        //REMEMBER ERROR DOES NOT HAVe a default
        setError(null);

        try {
            const response=await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/${storeId}`)//fetch from the enviroment file the link to the backend port
           if (!response.ok){
            throw new Error(`Failed to fetch orders : ${response.json()}`)
           }
            const data=await response.json();
            setAllOrders(data);  
        } catch (error :any) {
            setError(error.message)
            setAllOrders([]);
        }finally{
            setLoading(false)
        }
 }

 /*
const Api_url=`${process.env.NEXT_PUBLIC_BACKEND_URL}/order/${newOrderstatus?.order_id}`
 //Define a function that updates the status
const updateOrder=async()=>{
  //while it is updating toast updating
 
 
 try {
    const response=await fetch(Api_url,{
    method : 'PUT',
    headers: {
        'Content-type': 'application/json'
      },
    body :JSON.stringify(newOrderstatus)
  });

  if (!response.ok){
    throw new Error(`There was an error updating the Order : ${response.json()}`)
  }

  const responseData=await response.json();
  
  
 } catch (error : any) {
          setError(error.message)
 } finally{
  setUpdating(false)
 }
 

 
 
}
*/







 const filter=()=>{
    setAllordersCount(allOrders.length);

    //Filtered pending
    const filteredpending = status
    ? allOrders.filter((item : Order) => item.status === "Pending")
    : allOrders;
    setpendingCount(filteredpending.length);

    //filter shipped
    const filteredshipped = status
    ? allOrders.filter((item : Order) => item.status === "Shipped")
    : allOrders;
    setShippedCount(filteredshipped.length);

    //filtered processing
    const filteredprocessing= status
    ? allOrders.filter((item : Order) => item.status === "Processing")
    : allOrders;
    setProcessingCount(filteredprocessing.length);

    //filtered completed
    const filteredcompleted= status
    ? allOrders.filter((item : Order) => item.status === "Completed")
    : allOrders;
    setCompletedCount(filteredcompleted.length);

    //This is where we set the displayed orders
    const filteredOrders= status
    ? allOrders.filter((item : Order) => item.status ===status)
    : allOrders;
    if (status==="all"){
      setdisplayedOrders(allOrders)
    }
    else{
      setdisplayedOrders(filteredOrders);
    }

console.log(displayed);
 }
useEffect(() => {
  if (allOrders.length > 0) {
    filter(); 
  }
}, [allOrders]);


 useEffect(()=>{
  if (status){
    filter();
  }
 },[status])

 useEffect(()=>{
    if(user){
        fetchOrders();
    }
 },[user])

//Implement a function that takes in all orders and splits all of them according to category








//This is the skeleton being rendered when loading
if (loading)
  return (
    <div className="flex flex-col h-screen w-screen p-4 space-y-4 bg-white">
      <Skeleton className="h-[25%] w-full rounded-xl" />
      
      <div className="flex flex-col justify-between flex-grow space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
  else{
    return (
      <div>
        {/*The div below will contain different divs horizontal to each other that will show different categories */}
      <Tabs value={status} onValueChange={setStatus} defaultValue="all" className="w-full">
  {/* Tabs row: Wrapped and slightly overlaps 50% width */}
  <TabsList className="flex gap-2 justify-start max-w-[60%]">

    <TabsTrigger value="all" className="flex items-center gap-2 whitespace-nowrap px-3 py-1">
      <PackageCheck className="w-4 h-4" />
      All orders
      <span className="ml-auto text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
        {allOrdersCount}
      </span>
    </TabsTrigger>

    <TabsTrigger value="Pending" className="flex items-center gap-2 whitespace-nowrap px-3 py-1">
      <Clock className="w-4 h-4" />
      Pending
      <span className="ml-auto text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
        {pendingCount}
      </span>
    </TabsTrigger>

    <TabsTrigger value="Shipped" className="flex items-center gap-2 whitespace-nowrap px-3 py-1">
      <Truck className="w-4 h-4" />
      Shipped
      <span className="ml-auto text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
        {shippedCount}
      </span>
    </TabsTrigger>

    <TabsTrigger value="Processing" className="flex items-center gap-2 whitespace-nowrap px-3 py-1">
      <PackageSearch className="w-4 h-4" />
      Processing
      <span className="ml-auto text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
        {processingCount}
      </span>
    </TabsTrigger>

    <TabsTrigger value="Completed" className="flex items-center gap-2 whitespace-nowrap px-3 py-1">
      <PackageSearch className="w-4 h-4" />
      Completed
      <span className="ml-auto text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
        {completedCount}
      </span>
    </TabsTrigger>

  </TabsList>


  {/* Tab content: Full width layout */}
  <TabsContent value={status}>
    <div className="w-full min-h-screen px-4 py-1">
      <DataTable columns={columns} data={displayed} />
    </div>
  </TabsContent>
</Tabs>

    </div>
    )

  }


  
}

export default SellerOrders;