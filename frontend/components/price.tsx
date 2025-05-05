
// components/Price.tsx
"use client";

import { useEffect, useState } from "react";

export function Price({ amount }: { amount: number }) {
  const [formatted, setFormatted] = useState("");

  useEffect(() => {
    const formatter = new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
    });
    setFormatted(formatter.format(amount));
  }, [amount]);

  return <div className="text-right font-medium">{formatted}</div>;
}
