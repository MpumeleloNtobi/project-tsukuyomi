'use client';

import { ReactElement } from 'react';
import {
  UserCog,
  Store,
  PackageSearch,
  ChartBar,
  ShieldCheck,
} from 'lucide-react';

export default function AdminHome(): ReactElement {
  const stats = [
    { 
        label: 'Users',    
        value: 1284,  
        Icon: UserCog,       
        bg: 'bg-blue-50',   
        color: 'text-blue-600' 
    },
    { 
        label: 'Stores',   
        value: 256,   
        Icon: Store,         
        bg: 'bg-green-50',  
        color: 'text-green-600' },
    { 
        label: 'Products', 
        value: 10240, 
        Icon: PackageSearch, 
        bg: 'bg-purple-50', 
        color: 'text-purple-600' 
    },
  ];

  return (
    <section className="w-full p-8 space-y-16">
      <div className="w-full rounded-2xl bg-gradient-to-r from-blue-100 to-blue-50 p-8 text-center space-y-4">
        <h1 className="text-5xl font-extrabold text-gray-800">
          Welcome to the Admin Dashboard
        </h1>
        <p className="text-lg text-gray-600">
          With great power comes great responsibility. As an administrator, you are entrusted to manage users, oversee stores, curate products, and ensure the platform runs smoothly and securely.
        </p>
      </div>

      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map(({ label, value, Icon, bg, color }) => (
          <div
            key={label}
            className={`${bg} flex items-center space-x-4 p-6 rounded-2xl shadow`}
          >
            <div className="p-3 rounded-full bg-white">
              <Icon className={`h-6 w-6 ${color}`} />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-800">
                {value.toLocaleString()}
              </p>
              <p className="text-gray-600">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
          <UserCog className="h-10 w-10 text-blue-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800">
            User & Role Management
          </h3>
          <p className="mt-2 text-gray-600">
            Create, update, and assign roles to users, ensuring appropriate access control.
          </p>
        </div>

        <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
          <Store className="h-10 w-10 text-green-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800">
            Store Oversight
          </h3>
          <p className="mt-2 text-gray-600">
            Approve, suspend, or review seller stores to maintain platform quality.
          </p>
        </div>

        <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
          <PackageSearch className="h-10 w-10 text-purple-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800">
            Product Oversight
          </h3>
          <p className="mt-2 text-gray-600">
            Review and approve product listings to ensure catalog consistency and quality.
          </p>
        </div>

        <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
          <ShieldCheck className="h-10 w-10 text-red-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800">
            Audit & Compliance
          </h3>
          <p className="mt-2 text-gray-600">
            Monitor audit logs and user activity to enforce security and compliance policies.
          </p>
        </div>
      </div>
    </section>
  );
}
