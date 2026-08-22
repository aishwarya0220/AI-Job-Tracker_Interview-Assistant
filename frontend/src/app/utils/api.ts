

const apiRequest = async <T>(url: string, method = 'GET', data = null):Promise<T> => {
    
    const options: RequestInit = {
        method: method.toUpperCase(),
        credentials: 'include',
        headers: { 'Content-Type': 'application/json'}
    }

    if(data !== null && method.toUpperCase() !== 'GET'){
        options.body = JSON.stringify(data)
    }

    const response = await fetch(url, options)

    
    const jsonResponse = await response.json()
    
    if(!response.ok){                   // standard JavaScript fetch() promise only rejects on true network failures or blocked requests (e.g., DNS lookup failures or CORS issues). It does not reject if the server responds with an error code like a 404 Not Found or 500 Internal Server Error. You must use response.ok to handle these server-side errors manually
        throw new Error(
            jsonResponse.error ||
            jsonResponse.message ||
            `HTTP response error; Status: ${response.status}`)
    }

    return jsonResponse
}

export default apiRequest