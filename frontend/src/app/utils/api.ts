

const apiRequest = async (url: string, method = 'GET', data = null) => {
    
    const options: RequestInit = {
        method: method.toUpperCase(),
        credentials: 'include',
        headers: { 'Content-Type': 'application/json'}
    }

    if(method.toUpperCase() !== 'GET'){
        options.body = JSON.stringify(data)
    }

    const response = await fetch(url, options)

    if(!response.ok){                   // standard JavaScript fetch() promise only rejects on true network failures or blocked requests (e.g., DNS lookup failures or CORS issues). It does not reject if the server responds with an error code like a 404 Not Found or 500 Internal Server Error. You must use response.ok to handle these server-side errors manually
        throw new Error(`HTTP response error; Status: ${response.status}`)
    }

    const jsonResponse = await response.json()

    return jsonResponse
}

export default apiRequest