

const apiRequest = async (url: string) => {
    
    const response = await fetch(url, {
        credentials: 'include'
    })

    if(!response.ok){                   // standard JavaScript fetch() promise only rejects on true network failures or blocked requests (e.g., DNS lookup failures or CORS issues). It does not reject if the server responds with an error code like a 404 Not Found or 500 Internal Server Error. You must use response.ok to handle these server-side errors manually
        throw new Error(`HTTP response error; Status: ${response.status}`)
    }

    const data = await response.json()

    return data
}

export default apiRequest