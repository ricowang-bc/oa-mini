import { RequestTask } from "uni-app"

class RequestInterceptor {
    private interceptors: uni.Interceptor[]

    constructor() {
        this.interceptors = []
    }

    public use(onFulfilled?: (config: uni.RequestOptions) => uni.RequestOptions | Promise<uni.RequestOptions>, onRejected?: (error: any) => any): number {
        this.interceptors.push({ onFulfilled, onRejected })
        return this.interceptors.length - 1
    }

    public eject(interceptorId: number): void {
        if (this.interceptors[interceptorId]) {
            this.interceptors[interceptorId] = null!
        }
    }

    public async execute(config: uni.RequestOptions): Promise<any> {
        let chain: Promise<any> = Promise.resolve(config)

        for (const interceptor of this.interceptors) {
            if (interceptor && interceptor.onFulfilled) {
                chain = chain.then(interceptor.onFulfilled)
            }
        }

        return chain
    }
}

export default RequestInterceptor
