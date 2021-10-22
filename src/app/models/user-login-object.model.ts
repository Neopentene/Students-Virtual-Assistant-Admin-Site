export class UserLoginObject {
    userName: string;
    email: string;
    password: string;
    token: string;

    constructor() {

    }

    buildObject() {
        return {
            userName: this.userName,
            email: this.email,
            password: this.password,
            token: this.token
        }
    }

    setData(userName: string, email: string, password: string, token: string) {
        this.userName = userName
        this.email = email
        this.token = token
        this.password = password
        return this
    }

    constructFormData() {
        return "userName=" + this.userName + "&email=" + this.email + "&password=" + this.password + "&token=" + this.token
    }
}
