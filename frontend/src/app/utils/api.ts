
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Error that also carries the HTTP status, so pages can react to 401s (expired login)
export class ApiError extends Error {
    status: number

    constructor(message: string, status: number) {
        super(message)
        this.name = 'ApiError'
        this.status = status
    }
}

let backendReady = false

const waitForBackend = async (): Promise<void> => {
    if(backendReady) return

    const maxAttempts = 20
    const retryDelay = 3000

    for(let attempt = 1; attempt <= maxAttempts; attempt++){
        try{
            const response = await fetch(`${API_URL}/health`, {
                method: 'GET',
                cache: 'no-store',
                signal: AbortSignal.timeout(10000)
            })

            if(response.ok){
                backendReady = true
                return
            }
        }catch{

        }

        if(attempt < maxAttempts){
            await new Promise(resolve => 
                setTimeout(resolve, retryDelay)
            )
        }
    }

    throw new ApiError(
        'Server is taking too long to start. Please try again.',
        503
    )
}

const apiRequest = async <T>(
    url: string,
    method = 'GET',
    data: unknown = null,
    headers: Record<string, string> = {}
): Promise<T> => {

    const options: RequestInit = {
        method: method.toUpperCase(),
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...headers
        },
        signal: AbortSignal.timeout(90000)
    }

    if (data !== null && method.toUpperCase() !== 'GET') {
        options.body = JSON.stringify(data)
    }

    // Allow short paths like '/jobs' as well as full URLs
    const fullUrl = url.startsWith('http') ? url : `${API_URL}${url}`

    try{
        await waitForBackend()
    }catch(error){
        if(error instanceof ApiError){
            throw error
        }

        throw new ApiError(
            'Cannot start the server. Please try again.',
            503
        )
    }

    let response: Response

    try {
        response = await fetch(fullUrl, options)
    } catch {
        // fetch only rejects on network failures (server down, CORS, DNS...)
        throw new ApiError('Cannot reach the server. Please try again.', 0)
    }

    const contentType = response.headers.get('content-type') || ''

    let responseData: any

    try {
        responseData = contentType.includes('application/json')
            ? await response.json()
            : await response.text()
    } catch {
        responseData = null
    }

    // fetch() does not reject on 4xx/5xx responses, so check response.ok manually
    if (!response.ok) {
        const errorMessage =
            typeof responseData === 'string' && responseData
                ? responseData
                : responseData?.error ||
                  responseData?.message ||
                  responseData?.detail ||
                  `Something went wrong (status ${response.status})`

        throw new ApiError(errorMessage, response.status)
    }

    return responseData as T
}

export default apiRequest
