import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
  <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
    <div className="p-6 bg-gray-800 rounded-xl shadow-md w-full max-w-md">
      <SignUp />
    </div>
  </div>
);
}