"use client";

import { ReactElement } from "react";
import {
  UserCog,
  Store,
  PackageSearch,
  ChartBar,
  ShieldCheck,
} from "lucide-react";

export default function AdminHome(): ReactElement {

  return (
    <section className="w-full p-8 py-4 space-y-16">
      <div className="w-full rounded-2xl text-center space-y-4">
        <h1 className="text-5xl font-extrabold text-gray-800">
          Welcome to the Admin Dashboard
        </h1>
        <p className="text-lg text-gray-600">
          As an administrator, you
          are entrusted to manage users, oversee stores, and
          ensure the platform runs smoothly and securely.
        </p>
      </div>

  <div className="flex justify-center">
  <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
    <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
      <UserCog className="h-10 w-10 text-blue-500 mb-4" />
      <h3 className="text-xl font-semibold text-gray-800">
        User & Role Management
      </h3>
      <p className="mt-2 text-gray-600">
        Create, update, and assign roles to users, ensuring appropriate
        access control.
      </p>
    </div>

    <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
      <Store className="h-10 w-10 text-green-500 mb-4" />
      <h3 className="text-xl font-semibold text-gray-800">
        Store Oversight
      </h3>
      <p className="mt-2 text-gray-600">
        Approve, suspend, or review seller stores to maintain platform
        quality.
      </p>
    </div>
  </div>
</div>

    </section>
  );
}
