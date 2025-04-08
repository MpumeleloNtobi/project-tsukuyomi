import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
    <div className="bg-white p-6 rounded-md shadow-md">
    <SignIn></SignIn>
    </div>
  </div>
    
  );
    
 
}