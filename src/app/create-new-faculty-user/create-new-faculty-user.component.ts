import { SubscriptionLike } from 'rxjs';
import { NewUser } from './../models/new-user.model';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PatternValidatorService } from './../validation-service/pattern-validator.service';
import { Component, ElementRef, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FetchService } from '../utility-service/fetch.service';

@Component({
  selector: 'app-create-new-faculty-user',
  templateUrl: './create-new-faculty-user.component.html',
  styleUrls: ['./create-new-faculty-user.component.css']
})
export class CreateNewFacultyUserComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('alertUser') alertUser: ElementRef;

  createNewUserForm: FormGroup

  closeResult: string;

  passwordHelp: string = ''

  imageData: string = ''

  fileExtension: string = ''

  private unSubscribeFetch: SubscriptionLike;

  constructor(private router: Router, private loginValidation: PatternValidatorService, private formBuilder: FormBuilder, private fetchService: FetchService, private modalService: NgbModal) { }

  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  setPreview(event: any) {
    if (event.target.files && event.target.files[0]) {
      const fileReader: FileReader = new FileReader()
      this.fileExtension = <string>(<string>event.target.files[0].name).split('.').pop()
      fileReader.onload = (e: any) => {
        this.imageData = e.target.result
      }
      fileReader.readAsDataURL(event.target.files[0])
    }
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  ngOnInit(): void {
    this.formIntialize()
  }

  passwordValidation() {
    let password = this.createNewUserForm.value.password
    if (password == '') {
      this.passwordHelp = "Please enter a password"
      return false
    }
    if (!this.loginValidation.atleastOneCharacter(password) && !this.loginValidation.atleastTwoNumbers(password) && !this.loginValidation.atleastOneUppercaseLetter(password)) {
      this.passwordHelp = "Please use atleast one character, atleast two numbers and atleast one uppercase letter"
      return false
    }
    else if (!this.loginValidation.atleastOneCharacter(password) && !this.loginValidation.atleastTwoNumbers(password) && !this.loginValidation.atleastOneLowercaseLetter(password)) {
      this.passwordHelp = "Please use atleast one character, atleast two numbers and atleast one lowercase letter"
      return false
    }
    else if (!this.loginValidation.atleastOneCharacter(password) && !this.loginValidation.atleastTwoNumbers(password)) {
      this.passwordHelp = "Please use atleast one special character and atleast two numbers"
      return false
    }
    if (!this.loginValidation.atleastOneLowercaseLetter(password)) {
      this.passwordHelp = "Please use atleast one lowercase letter"
      return false
    }
    if (!this.loginValidation.atleastOneUppercaseLetter(password)) {
      this.passwordHelp = "Please use atleast one uppercase letter"
      return false
    }
    if (!this.loginValidation.atleastOneCharacter(password)) {
      this.passwordHelp = "Please use atleast one characters"
      return false
    }
    if (!this.loginValidation.atleastTwoNumbers(password)) {
      this.passwordHelp = "Please use atleast two numbers"
      return false
    }
    if (password.length < 8 || password.length > 15) {
      this.passwordHelp = "Please keep the password between 8 and 15 characters"
      return false
    }
    this.passwordHelp = ""
    return true
  }

  formIntialize() {
    this.createNewUserForm = this.formBuilder.group({
      userName: '',
      email: '',
      password: '',
      name: this.formBuilder.group({
        firstName: '',
        lastName: ''
      }),
      address: '',
      department: '',
      designation: '',
      imageCaption: '',
      confirmPassword: ''
    })
  }

  ngAfterViewInit() {

  }

  newUserBuild() {
    let newUserModel: NewUser = new NewUser()
    let imageDataOnly: string | boolean = this.loginValidation.removeHeadersFromImg(this.imageData)
    newUserModel.setData(
      this.createNewUserForm.value.userName.trim(),
      this.createNewUserForm.value.email.trim(),
      this.createNewUserForm.value.password.trim(),
      this.createNewUserForm.value.name.firstName.trim(),
      this.createNewUserForm.value.name.lastName.trim(),
      this.createNewUserForm.value.department.trim(),
      this.createNewUserForm.value.designation.trim(),
      this.createNewUserForm.value.address.trim(),
      imageDataOnly ? <string>imageDataOnly : '',
      this.fileExtension,
    )
    return newUserModel
  }

  setErrorMessage(error: string) {
    (<HTMLDivElement>this.alertUser.nativeElement).innerHTML = '<div class="alert alert-danger alert-dismissible mt-3 mx-3 border-3 fade show shadow" style="z-index: 99999" role="alert">\
                                                                  <strong>' + error + '</strong>\
                                                                  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>\
                                                                </div>'
    window.scrollTo(0, 0)
  }

  createNewUser() {
    let userBuild = this.newUserBuild()
    console.log(userBuild.constructFormData())

    if (userBuild.userName == '') {
      this.setErrorMessage("Please add Username")
    }
    else if (userBuild.email == '') {
      this.setErrorMessage("Please add Username")
    }
    else if (userBuild.password == '') {
      this.setErrorMessage("Please set a password")
    }
    else if (this.createNewUserForm.value.confirmPassword == '') {
      this.setErrorMessage("Confirmation password is empty")
    }
    else if (userBuild.designation == '' || userBuild.department == '' || userBuild.firstName == '' || userBuild.lastName == '') {
      this.setErrorMessage("Some important fields not filled")
    }
    else if (userBuild.password != this.createNewUserForm.value.confirmPassword) {
      this.setErrorMessage("Passwords don't match")
    }
    else {
      this.unSubscribeFetch = this.fetchService.createNewUser(userBuild).subscribe(data => {
        if (data.success) {
          sessionStorage.setItem("token", data.token != null ? data.token : '')
          this.router.navigateByUrl('/home')
        }
        else {
          if (data.error == "Token is invalid" || data.error == "Token was not found" || data.error == "Token has expired") {
            this.router.navigateByUrl('/login')
          }
          else {
            this.setErrorMessage(data.error)
          }
        }
      },
        error => {
          this.setErrorMessage("Server Down")
        }
      )
    }
  }

  ngOnDestroy() {
    if (this.unSubscribeFetch != null || this.unSubscribeFetch != undefined) {
      this.unSubscribeFetch.unsubscribe()
    }
  }
}

