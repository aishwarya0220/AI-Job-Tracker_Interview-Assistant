'use client'

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
                className="display: block align-content: bg-center"
                >
            <input 
                className="border border-gray-400 rounded-md p-2"
                placeholder="Enter Username"
                value={username}
                onChange={(event) => {
                    setUsername(event.target.value)
                }}
            />
            </section>

            <input
                className="border border-gray-400 rounded-md p-2"
                placeholder="Enter Email"
                value={email}
                onChange={(event) => {
                    setEmail(event.target.value)
                }}
            />

            <input
                className="border border-gray-400 rounded-md p-2"
                placeholder="Enter Password"
                value={password}
                onChange={(event) => {
                    setPassword(event.target.value)
                }}
            />

            <button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 ease-in-out shadow-sm"
            >Register</button>

        </form>
    )
    
}