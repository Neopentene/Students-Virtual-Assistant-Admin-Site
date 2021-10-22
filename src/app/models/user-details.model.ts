import { Contact } from "./contact.model"

export class UserDetails {
    name: string
    firstName: string
    lastName: string
    department: string
    designation: string
    address: string
    image: string
    contacts: Contact[];
    imageExtension: string = ''

    constructor() { }

    buildObject() {
        return {
            name: this.name,
            designation: this.designation,
            department: this.department,
            address: this.address,
            image: this.image
        }
    }

    setData(name: string, department: string, designation: string, address: string, image: string) {
        this.name = name;
        this.department = department;
        this.designation = designation;
        this.address = address
        this.image = image
        return this
    }

    constructFormData() {
        let result: string = ""
        let contantString: string = '';
        for (let keys in this.contacts) {
            contantString += this.contacts[keys] + ";"
        }
        contantString = contantString.slice(0, contantString.length - 1)
        for (let keys in this) {
            if (keys != "contacts") {
                result += keys + "=" + this[keys] + "&"
            }
        }
        result += "contacts=" + contantString + "&"
        result = result.slice(0, result.length - 1)
        return result
    }
}
