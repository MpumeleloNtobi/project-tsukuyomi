"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, RefreshCw, Download, Filter } from "lucide-react";
import { useState } from "react";

export function OrdersHeader() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between md-2">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground mt-1">
          Manage and track your customer orders
        </p>
      </div>
    </div>
  );
}
