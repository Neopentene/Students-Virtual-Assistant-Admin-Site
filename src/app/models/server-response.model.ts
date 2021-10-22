import { UserDetails } from './user-details.model';
export class ServerResponse {
    success: boolean
    error: string
    token: string | null
    data: UserDetails

    constructor() {

    }

    buildObject() {
        return {
            success: this.success,
            errorMessage: this.error,
            token: this.token,
            data: this.data
        }
    }

    setData(success: boolean, errorMessage: string, token: string | null, data: UserDetails) {
        this.success = success
        this.error = errorMessage
        this.token = token
        this.data = data
        return this
    }
}
