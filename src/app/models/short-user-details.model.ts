export class ShortUserDetails {
    name: string
    department: string
    designation: string

    buildObject() {
        return {
            name: this.name,
            designation: this.designation,
            department: this.department,
        }
    }

    setData(name: string, department: string, designation: string) {
        this.name = name;
        this.department = department;
        this.designation = designation;
        return this
    }
}
