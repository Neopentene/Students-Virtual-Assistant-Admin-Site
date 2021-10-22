import { UserDetails } from './../models/user-details.model';
import { ServerResponse } from './../models/server-response.model';
import { Routes, Router } from '@angular/router';
import { UserLoginObject } from './../models/user-login-object.model';
import { UserAuthService } from './../auth-service/user-auth.service';
import { PatternValidatorService } from './../validation-service/pattern-validator.service';
import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, Output, ViewChild, ViewChildren } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Observable, SubscriptionLike } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('alertUser') alertUser: ElementRef;
  loginForm: FormGroup;
  userNameHelp: string;
  emailHelp: string;
  passwordHelp: string;
  public loginStatus: boolean = false;
  private loginSubscription: SubscriptionLike;
  private loginCheckSubscription: SubscriptionLike;

  constructor(private formBuilder: FormBuilder, private loginValidation: PatternValidatorService, private userAuthService: UserAuthService, private loginOject: UserLoginObject, private router: Router) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnDestroy() {
    if (this.loginSubscription != undefined) {
      this.loginSubscription.unsubscribe()
    }
    if (this.loginCheckSubscription != undefined) {
      this.loginCheckSubscription.unsubscribe()
    }
  }

  ngAfterViewInit() {
    this.loginCheckSubscription = this.userAuthService.checkToken().subscribe(data => {
      if (data.success) {
        sessionStorage.setItem("token", data.token != null ? data.token : '')
        this.loginStatus = true
        this.router.navigateByUrl('/home')
      }
      else {
        if (data.error != "Invalid call to server" && data.error != "Invalid form details") {
          (<HTMLDivElement>this.alertUser.nativeElement).innerHTML = '<div class="alert alert-danger alert-dismissible mt-3 mx-3  border-3 fade show shadow" style="z-index: 99999" role="alert">\
                                                                        <strong>' + data.error + '</strong>\
                                                                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>\
                                                                      </div>'
        }
        this.loginStatus = false
        sessionStorage.clear()
      }
    },
      error => {
        (<HTMLDivElement>this.alertUser.nativeElement).innerHTML = '<div class="alert alert-danger alert-dismissible mt-3 mx-3 border-3 fade show shadow" style="z-index: 99999" role="alert">\
                                                                      <strong>' + "Server Down" + '</strong>\
                                                                      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>\
                                                                    </div>'
      })
  }

  userNameOrEmailRequired() {
    let userName = this.loginForm.value.identifyUser.userName;
    let email = this.loginForm.value.identifyUser.email;
    if (userName == '' && email == '') {
      this.userNameHelp = this.emailHelp = "Please enter Username or Email"
      return false
    }
    this.userNameHelp = this.emailHelp = ""
    return true
  }

  passwordValidation() {
    let password = this.loginForm.value.sensitivePasswordField.password
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

  testValidation() {
    let passwordCheck: boolean = this.passwordValidation();
    let identityCheck: boolean = this.userNameOrEmailRequired();
    if (passwordCheck && identityCheck) {
      this.loginOject.setData(this.loginForm.value.identifyUser.userName, this.loginForm.value.identifyUser.email, this.loginForm.value.sensitivePasswordField.password, '')
      this.loginSubscription = this.userAuthService.loginUser(this.loginOject).subscribe(data => {
        if (data.success) {
          sessionStorage.setItem("token", data.token != null ? data.token : '')
          this.loginStatus = true
          this.router.navigateByUrl('/home')
        }
        else {
          (<HTMLDivElement>this.alertUser.nativeElement).innerHTML = '<div class="alert alert-danger alert-dismissible mt-3 mx-3 border-3 fade show shadow" style="z-index: 99999" role="alert">\
                                                                        <strong>' + data.error + '</strong>\
                                                                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>\
                                                                      </div>'
          this.loginStatus = false
        }
      }, error => {
        (<HTMLDivElement>this.alertUser.nativeElement).innerHTML = '<div class="alert alert-danger alert-dismissible mt-3 mx-3 border-3 fade show shadow" style="z-index: 99999" role="alert">\
                                                                      <strong>' + "Server Down" + '</strong>\
                                                                      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>\
                                                                    </div>'
      })
    }
  }

  loginService() {
    this.userAuthService.loginUser(this.loginOject)
  }

  initializeForm() {
    this.loginForm = this.formBuilder.group({
      identifyUser: this.formBuilder.group({
        userName: '',
        email: ''
      }),
      sensitivePasswordField: this.formBuilder.group({
        password: ''
      })
    });
  }

}
