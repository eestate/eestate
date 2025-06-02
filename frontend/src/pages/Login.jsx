import React, { useState } from 'react'
import { User } from 'lucide-react';
import { Briefcase } from 'lucide-react';

const Login = () => {
  const [role, setRole] = useState("user")
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')



  



  console.log(role);
  
  return (
    <div className='flex min-h-screen'>
        <div className=' w-1/2 flex flex-col justify-center pl-28'>
            
                <h2 className='text-3xl font-semibold'>Register Here</h2>
                <h4 className='text-gray-500 mt-2'>Please select your account type to create</h4>

                <div className="flex items-center gap-4 my-5">
                  <button className={`flex items-center gap-2 mx-5 text-lg border rounded-md py-2 px-4 text-lg font-normal ${role === 'user' ? 'text-blue-600' : "text-gray-600"}`}
                  onClick={() => setRole("user")}
                  >
                    <User/>
                    User
                  </button>
                  <button className={`flex items-center gap-2 mx-5 text-lg border rounded-[7px] py-2 px-4 font-normal ${role === 'agent' ? 'text-blue-600' : "text-gray-600"}`}
                  onClick={() => setRole("agent")}
                  >
                    <Briefcase/>
                    Agent
                  </button>

                </div>
            <form className='flex flex-col  mt-6'>
              <label for='name' className='block mb-1'>Username</label><br />
              <input type="text" id='name' className='border' onChange={(e) => setName(e.target.value)}  placeholder='Enter your username'/><br />

              <label for="email" className='block mb-1'>Email address</label><br />
              <input type="email" id='email' className='border' onChange={(e) => setEmail(e.target.value)} placeholder='Enter your email'/><br />

              <label for="password" className='block mb-1'>Password</label><br />
              <input type="password" id='password' className='border rounded-md' onChange={(e) => setPassword(e.target.value)} placeholder='Enter your password'/><br />

              <button className="bg-blue-600 text-white py-2 px-4 rounded mt-2">Sign Up</button>
              <h5 className="text-gray-500 mt-4 text-sm text-center">Or continue with</h5>

              <button className="flex items-center justify-center gap-2 bg-gray-100 py-2 px-4 rounded">
                <svg className='size-5' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"> <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/></svg>
                Google
              </button>
              <h4 className="mt-4 text-center text-blue-600 text-sm cursor-pointer hover:underline">You already have an account? Log in</h4>
            </form>
        </div>

<div className='w-1/2 bg-blue-100 flex flex-col justify-center items-center text-center p-10'>
  <img src="" alt="Logo" className="mb-5 w-40 h-40 object-contain" />
  <h2 className='text-2xl font-semibold'>Join Us</h2>
  <h3 className='text-gray-600 mt-2'>Buy, sell, or list properties. Join us to explore top real estate opportunities.</h3>
</div>

    </div>
  )
}

export default Login