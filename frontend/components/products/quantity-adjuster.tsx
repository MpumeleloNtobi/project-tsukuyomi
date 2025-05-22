"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface QuantityAdjusterProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function QuantityAdjuster({
  value,
  onChange,
  min = 0,
  max = Number.POSITIVE_INFINITY,
}: QuantityAdjusterProps) {
  const [quantity, setQuantity] = useState(value);

  useEffect(() => {
    setQuantity(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number.parseInt(e.target.value) || min;
    setQuantity(newValue);
  };

  const handleBlur = () => {
    let newValue = quantity;
    if (newValue < min) newValue = min;
    if (newValue > max) newValue = max;
    setQuantity(newValue);
    onChange(newValue);
  };

  const decrement = () => {
    if (quantity > min) {
      const newValue = quantity - 1;
      setQuantity(newValue);
      onChange(newValue);
    }
  };

  const increment = () => {
    if (quantity < max) {
      const newValue = quantity + 1;
      setQuantity(newValue);
      onChange(newValue);
    }
  };

  return (
    <div className="flex items-center">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-r-none"
        onClick={decrement}
        disabled={quantity <= min}
      >
        <Minus className="h-3 w-3" />
        <span className="sr-only">Decrease</span>
      </Button>
      <Input
        type="number"
        value={quantity}
        onChange={handleChange}
        onBlur={handleBlur}
        className="h-8 w-14 rounded-none border-x-0 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        min={min}
        max={max}
      />
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-l-none"
        onClick={increment}
        disabled={quantity >= max}
      >
        <Plus className="h-3 w-3" />
        <span className="sr-only">Increase</span>
      </Button>
    </div>
  );
}
