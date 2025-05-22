import { ProductsTable } from "@/components/products/products-table";
import { ProductsHeader } from "@/components/products/products-header";

export default function ProductsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <ProductsHeader />
      <ProductsTable />
    </div>
  );
}
