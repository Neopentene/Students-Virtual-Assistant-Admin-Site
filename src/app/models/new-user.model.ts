export class NewUser {
    userName: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    department: string;
    designation: string;
    address: string;
    imageData: string;
    imageExtension: string;

    constructor() { }

    buildObject() {
        return {
            userName: this.userName,
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName,
            password: this.password,
            designation: this.designation,
            department: this.department,
            address: this.address,
            imageData: this.imageData,
            imageExtension: this.imageExtension
        }
    }
    setData(
        userName: string,
        email: string,
        password: string,
        firstName: string,
        lastName: string,
        department: string,
        designation: string,
        address: string,
        image: string,
        imageExtenstion: string
    ) {
        this.userName = userName
        this.email = email
        this.firstName = firstName
        this.lastName = lastName
        this.password = password
        this.designation = designation
        this.department = department
        this.address = address
        this.imageData = image
        this.imageExtension = imageExtenstion
    }

    constructFormData() {
        let result: string = ""
        for (let keys in this) {
            result += keys + "=" + this[keys] + "&"
        }
        result = result.slice(0, result.length - 1)
        return result
    }
}
