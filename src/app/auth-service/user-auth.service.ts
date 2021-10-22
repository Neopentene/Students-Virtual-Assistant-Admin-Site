import { UserLoginObject } from './../models/user-login-object.model';
import { ServerResponse } from './../models/server-response.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

const httpOptions = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
};

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  url = "http://192.168.0.102:3200/"

  constructor(private http: HttpClient, private serverResponse: ServerResponse, private route: Router, private userLoginObject: UserLoginObject) { }

  loginUser(loginObject: UserLoginObject) {
    return this.http.post<ServerResponse>(this.url + "faculty/login", loginObject.constructFormData(), httpOptions)
  }

  handleError(error: any): (err: any, caught: Observable<ServerResponse>) => import("rxjs").ObservableInput<any> {
    console.log(error);
    throw new Error(error);
  }

  checkToken() {
    let token = sessionStorage.getItem("token")
    let success: boolean = false;
    return this.http.post<ServerResponse>(this.url + "faculty/login", this.userLoginObject.setData('', '', '', token != null ? token : '').constructFormData(), httpOptions)
  }
}
