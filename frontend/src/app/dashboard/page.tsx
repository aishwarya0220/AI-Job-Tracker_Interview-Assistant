'use client'

import { useEffect, useState } from "react"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"

import apiRequest from "@/utils/api"

import { Button } from "@/components/ui/button"

import { useRouter } from "next/navigation"

export default function Dashboard(){
    const router = useRouter()

    const handleLogout = async () => {
        try{
            await apiRequest('http://localhost:8000/logout', 'POST')

            router.push('/login')
        } catch(err){
            console.error('Logout failed', err)
        }
    }

    const [username, setUsername] = useState('')

    useEffect(() => {

        const getUser = async () => {

            try{
                const data = await apiRequest('http://localhost:8000/user/me')
                setUsername(data.username)
            } catch(err){
                console.log('Failed to get user')
            }
        }
        getUser()

    },[])
    return (
        <nav className="flex mt-4 justify-end gap-3 mr-4">
            <div>
            <Avatar>
            <AvatarImage
                src="https://github.com/shadcn.png"
                alt="user-svg-img"
                className="grayscale"
            />
            <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            </div>

            <p className="text-[19px]">{username}</p>

            <div>
                <Button type="button" onClick={handleLogout}>Logout</Button>
            </div>


        </nav>
    )
}