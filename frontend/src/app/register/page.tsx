'use client'

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

            <section 
                
            >
        <div className="text-2xl">
            <h1>Get Started</h1>
        </div>
        <div className="w-80 mx-45 mt-55">
            <div className=" flex flex-col items-center justify-center gap-5">
            <div className="relative">
                <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder=""
                    className="
                    peer
                    w-80
                    h-11
                    rounded-lg
                    border
                    border-gray-400
                    px-3
                    outline-none
                    "
                />

                <label
                    htmlFor="username"
                    className="
                    absolute
                    left-2
                    top-1/2
                    -translate-y-1/2
                    bg-white
                    px-1
                    text-gray-500
                    transition-all
                    duration-200
                    pointer-events-none

                    peer-placeholder-shown:top-1/2
                    peer-placeholder-shown:-translate-y-1/2
                    peer-placeholder-shown:text-base

                    peer-focus:-top-2
                    peer-focus:translate-y-0
                    peer-focus:text-xs
                    peer-focus:text-green-700

                    peer-not-placeholder-shown:-top-2
                    peer-not-placeholder-shown:translate-y-0
                    peer-not-placeholder-shown:text-xs
                    "
                >
                    Username
                </label>
            </div>

            <div className="relative">
                <input
                    id="email"
                    type="text"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder=""
                    className="
                    peer
                    w-80
                    h-11
                    rounded-lg
                    // border
                    border-gray-400
                    px-3
                    outline-none
                    
                    "
                />

                <label
                    htmlFor="email"
                    className="
                    absolute
                    left-2
                    top-1/2
                    -translate-y-1/2
                    bg-white
                    px-1
                    text-gray-500
                    transition-all
                    duration-200
                    pointer-events-none

                    peer-placeholder-shown:top-1/2
                    peer-placeholder-shown:-translate-y-1/2
                    peer-placeholder-shown:text-base

                    peer-focus:-top-2
                    peer-focus:translate-y-0
                    peer-focus:text-xs
                    peer-focus:text-green-700

                    peer-not-placeholder-shown:-top-2
                    peer-not-placeholder-shown:translate-y-0
                    peer-not-placeholder-shown:text-xs
                    "
                >
                    Email
                </label>
            </div>

            <div className="relative">
                <input
                    id="password"
                    type="text"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder=""
                    className="
                    peer
                    w-80
                    h-11
                    rounded-lg
                    // border
                    border-gray-400
                    px-3
                    outline-none
                    
                    "
                />

                <label
                    htmlFor="password"
                    className="
                    absolute
                    left-2
                    top-1/2
                    -translate-y-1/2
                    bg-white
                    px-1
                    text-gray-500
                    transition-all
                    duration-200
                    pointer-events-none

                    peer-placeholder-shown:top-1/2
                    peer-placeholder-shown:-translate-y-1/2
                    peer-placeholder-shown:text-base

                    peer-focus:-top-2
                    peer-focus:translate-y-0
                    peer-focus:text-xs
                    peer-focus:text-green-700

                    peer-not-placeholder-shown:-top-2
                    peer-not-placeholder-shown:translate-y-0
                    peer-not-placeholder-shown:text-xs
                    "
                >
                    Password
                </label>
            </div>

            <div className="flex">
                <input
                    type="checkbox"

                />
                <p>I agree to the <Link href="/terms" className="text-blue-600 text-blue-800 transition-colors">terms & policy</Link></p>
            </div>
                <div
                    className=""
                >
                <button 
                    type="submit"
                    className="bg-green-700 hover:bg-green-800 text-white font-medium py-2 px-4 rounded-2xl transition duration-200 ease-in-out shadow-sm w-80 "
                >Register</button>
                </div>
            </div>
            </div>
            </section>

        </form>
    )
    
}