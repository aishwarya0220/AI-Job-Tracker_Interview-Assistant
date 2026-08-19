'use client'

import Image from "next/image"

import registerImg from "@/Register-photo.png"

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"

import Link from "next/link"

import { useState } from "react"

import { useRouter } from "next/navigation"

import apiRequest from "@/utils/api"

export default function RegisterPage(){

    const router = useRouter()

    const [username, setUsername] = useState("")

    const [email, setEmail] = useState("")

    const [password, setPassword] = useState("")

    const [error, setError] = useState<string | null>("")

    const [loading, setLoading] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault()

        const data = {
            username: username,
            email: email,
            password: password
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
          }
      
        setLoading(true)

        try{

          const response = await apiRequest(
              'http://localhost:8000/register',
              'POST',
              data
          )
  
          console.log(response)

          router.push('/dashboard')
        } catch (err: any) {
          setError(err.message || 'Failed to register account');
        } finally {
            setLoading(false)
        }
    }

    return (
        
        <form 
            
            onSubmit={handleSubmit}>
           {/* main container */}
        <div className="flex h-screen overflow-hidden w-full" >  
                {/* left container */}
                <div className="flex h-screen flex-col items-baseline justify-center w-1/2 ml-43.75 gap-7.5">
                    <h1 className="mb-10 text-[24px]">Get Started Now</h1>
                    {/* Username */}
                    <div className="w-101"
                    
                    >
                    <p className="ml-2 text-[14px]">Username</p>
                    <Input
                        className="w-full"
                        type="text"
                        placeholder="Enter Username"
                        onChange={(event) => {
                            setUsername(event.target.value)
                        }}
                    />
                    </div>
                        {/* email */}
                    <div className="w-101"
                    
                    >
                    <p className="ml-2 text-[14px]">Email</p>
                    <Input
                        className="w-full"
                        type="text"
                        placeholder="Enter Email"
                        onChange={(event) => {
                            setEmail(event.target.value)
                        }}
                    />
                    </div>

                    <div className="w-101"
                    
                    >
                    <p className="ml-2 text-[14px]">Password</p>
                    <Input
                        className="w-full"
                        type="password"
                        placeholder="Enter Password"
                        onChange={(event) => {
                            setPassword(event.target.value)
                        }}
                    />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 md:flex-row">
                        <Button type="submit" variant="outline" disabled={loading} 
                        className="w-102 bg-green-800 transition-colors duration-300 ease-in-out hover:bg-green-900 hover:text-white text-amber-50 h-9">
                        {loading ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Creating Account...
                        </span>
                        ) : (
                        'Sign Up'
                        )}    
                            </Button>
                    </div>

                    <div className="flex justify-center items-center align-middle">
                        <p>Have an account? <Link href="/login" className="text-blue-600">Sign in</Link></p>
                    </div>
                </div>
                    {/* right container */}
                <div className="h-screen relative w-1/2">
                        <Image
                            src={registerImg}
                            className="object-cover"
                            alt="scenery"
                            fill
                        />
                </div>
           </div>
           </form>
           
    )
    
}