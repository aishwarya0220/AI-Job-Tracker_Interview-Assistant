// Base URL of the Express API.
// Local dev: falls back to http://localhost:8000
// Production: set NEXT_PUBLIC_API_URL (see README)
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
        }
    }

    if (data !== null && method.toUpperCase() !== 'GET') {
        options.body = JSON.stringify(data)
    }

    // Allow short paths like '/jobs' as well as full URLs
    const fullUrl = url.startsWith('http') ? url : `${API_URL}${url}`

    let response: Response

    try {
        response = await fetch(fullUrl, options)
    } catch {
        // fetch only rejects on network failures (server down, CORS, DNS...)
        throw new ApiError('Cannot reach the server. Please check your connection and try again.', 0)
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
