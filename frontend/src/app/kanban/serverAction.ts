'use server'

import { cookies } from "next/headers";

import apiRequest from "@/utils/api";

import { TaskStatus } from "@/types/task";

export async function handleReorderSave(
    reorderedItems: { _id: string; status: TaskStatus; position: number }[]
  ) {
    const cookieStore = await cookies();
    
    const token = cookieStore.get('token')?.value

    if (!token) {
        throw new Error('No authentication token found');
    }

    await apiRequest('http://localhost:8000/tasks/reorder', 'PATCH', 
        {
        items: reorderedItems,
        },
        {
            Cookie: `token=${token}`,
        }
    );
}