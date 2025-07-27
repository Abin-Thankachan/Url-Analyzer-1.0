interface AuthResponse {
    access_token: string
    token_type: string
    user: {
        id: string
        username: string
        email: string
    }
}

interface RegisterResponse {
    username: string
    email: string
    id: number
    created_at: string
}

interface RegisterRequest {
    username: string
    email: string
    password: string
}

interface LoginRequest {
    username: string
    password: string
}

interface AnalyzeRequest {
    url: string
}

interface AnalyzeResponse {
    id: string
    url: string
    top_words: Array<{
        word: string
        count: number
    }>
    analyzed_at: string
}

interface HistoryResponse {
    items: AnalyzeResponse[]
    total: number
    page: number
    size: number
    pages: number
}

class ApiError extends Error {
    constructor(
        message: string,
        public status: number,
        public response?: any
    ) {
        super(message)
        this.name = 'ApiError'
    }
}

export { ApiError }
export type {
    AuthResponse,
    RegisterResponse,
    RegisterRequest,
    LoginRequest,
    AnalyzeRequest,
    AnalyzeResponse,
    HistoryResponse
}
