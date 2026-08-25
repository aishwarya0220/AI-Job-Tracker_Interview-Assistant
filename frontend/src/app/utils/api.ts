

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

    const contentType = response.headers.get('content-type') || ''

    let responseData: any

    if(contentType.includes('application/json')) {
        responseData = await response.json()
    } else {
        responseData = await response.text()
    }
    
    if(!response.ok){                   // standard JavaScript fetch() promise only rejects on true network failures or blocked requests (e.g., DNS lookup failures or CORS issues). It does not reject if the server responds with an error code like a 404 Not Found or 500 Internal Server Error. You must use response.ok to handle these server-side errors manually
        const errorMessage =
            typeof responseData == 'string'
            ? responseData
            : responseData?.error ||
            responseData?.message ||
            responseData?.detail ||
            `HTTP response error; Status: ${response.status}`

        throw new Error(errorMessage)
    }

    return responseData as T
}

export default apiRequest