'use client'

import Image from "next/image"

import registerImg from "@/Register-photo.png"

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"

import Link from "next/link"

import { useRouter } from "next/navigation"

import { useState } from "react"

import apiRequest from "../utils/api"

export default function LoginPage(){

    const router = useRouter()

    const [login, setLogin] = useState("")

    const [password, setPassword] = useState("")

    const handleSubmit = async (event) => {
        event.preventDefault()

        const data = {
            login: login,
            password: password
        }

        const response = await apiRequest(
            'http://localhost:8000/login',
            'POST',
            data
        )
        
        router.push('/dashboard')
        console.log(response)
    }

    return (
        <form 
            onSubmit={handleSubmit}>
           {/* main container */}
            <div className="flex h-screen overflow-hidden w-full" >      
                {/* left container */}
                <div className="flex h-screen flex-col items-baseline justify-center w-1/2 ml-43.75 gap-7.5">
                    <h1 className="mb-10 text-[24px]">Sign in</h1>
                    {/* Username */}
                    <div className="w-101"
                    
                    >
                    <p className="ml-2 text-[14px]">Login ID</p>
                    <Input
                        className="w-full"
                        type="text"
                        placeholder="Enter Username or Email"
                        onChange={(event) => {
                            setLogin(event.target.value)
                        }}
                    />
                    </div>
                        {/* email */}
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
                        <Button type="submit" variant="outline" className="w-102 bg-green-800 transition-colors duration-300 ease-in-out hover:bg-green-900 hover:text-white text-amber-50 h-9">Login</Button>
                    </div>

                    <div className="flex justify-center items-center align-middle">
                        <p>Don't have an account? <Link href="/" className="text-blue-600">Sign up</Link></p>
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