import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, CirclePlay } from "lucide-react";
import React from "react";

const Hero01 = () => {
  return (
    <div className="flex justify-center px-6">
      <div className="text-center max-w-2xl">
        <Badge className="bg-gradient-to-br via-70% from-primary via-muted/30 to-primary rounded-full py-1 border-none">
          Just released v1.0.0
        </Badge>
        <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl md:leading-[1.2] font-bold">
          Customized Shadcn UI Blocks & Components
        </h1>
        <p className="mt-6 text-[17px] md:text-lg">
          Explore a collection of Shadcn UI blocks and components, ready to
          preview and copy. Streamline your development workflow with
          easy-to-implement examples.
        </p>
      </div>
    </div>
  );
};

export default Hero01;
