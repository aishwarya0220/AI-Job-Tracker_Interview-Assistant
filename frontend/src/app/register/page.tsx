'use client'

import Image from "next/image"

import registerImg from "@/Register-photo.png"

import { ArrowUpIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"


import Link from "next/link"

import { useState } from "react"

import apiRequest from "../utils/api"

export default function RegisterPage(){

    const [username, setUsername] = useState("")

    const [email, setEmail] = useState("")

    const [password, setPassword] = useState("")

    const handleSubmit = async (event) => {
        event.preventDefault()

        const data = {
            username: username,
            email: email,
            password: password
        }

        const response = await apiRequest(
            'http://localhost:8000/register',
            'POST',
            data
        )

        console.log(response)
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
                        <Button type="submit" variant="outline" className="w-102 bg-green-800 transition-colors duration-300 ease-in-out hover:bg-green-900 hover:text-white text-amber-50 h-9">Signup</Button>
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