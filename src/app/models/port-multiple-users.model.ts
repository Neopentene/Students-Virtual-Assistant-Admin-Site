import { ShortUserDetails } from './short-user-details.model';
export class PortMultipleUsers {
    success: boolean
    error: string
    token: string | null
    data: ShortUserDetails[]

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

    setData(success: boolean, errorMessage: string, token: string | null, data: ShortUserDetails[]) {
        this.success = success
        this.error = errorMessage
        this.token = token
        this.data = data
        return this
    }
}
