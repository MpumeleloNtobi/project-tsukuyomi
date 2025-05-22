import StoreTable from "@/components/store-table";

export default function StoresPage() {
  return (
    <div className="w-full p-8 py-4 space-y-16">
      <h1 className="text-2xl font-bold mb-6">Admin Store Management</h1>
      <StoreTable />
    </div>
  );
}
