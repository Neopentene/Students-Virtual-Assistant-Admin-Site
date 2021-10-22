import { UserDetails } from './../models/user-details.model';
import { ServerResponse } from './../models/server-response.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PortMultipleUsers } from '../models/port-multiple-users.model';
import { NewUser } from '../models/new-user.model';
import { HttpParameterCodec } from "@angular/common/http";

class HttpUrlEncodingCodec implements HttpParameterCodec {
  encodeKey(k: string): string { return standardEncoding(k); }
  encodeValue(v: string): string { return standardEncoding(v); }
  decodeKey(k: string): string { return decodeURIComponent(k); }
  decodeValue(v: string) { return decodeURIComponent(v); }
}

function standardEncoding(v: string): string {
  return encodeURIComponent(v);
}

const httpOptions = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
};

@Injectable({
  providedIn: 'root'
})
export class FetchService {

  url: string = "http://192.168.0.102:3200/"

  constructor(private http: HttpClient) { }

  getUserData() {
    return this.http.get<ServerResponse>(this.url + "faculty/details?token=" + sessionStorage.getItem('token'), httpOptions)
  }

  getAllFacultyUsers() {
    return this.http.get<PortMultipleUsers>(this.url + "faculty/all?token=" + sessionStorage.getItem('token'), httpOptions)
  }

  createNewUser(userDetails: NewUser) {
    const params = new HttpParams({ encoder: new HttpUrlEncodingCodec() })
    params.appendAll(userDetails.buildObject())
    console.log(params)
    return this.http.put<ServerResponse>(this.url + "/faculty/create?token=" + sessionStorage.getItem('token'), userDetails.constructFormData(), httpOptions)
  }

  updateNewUser(userDetails: UserDetails) {
    return this.http.put<ServerResponse>(this.url + "/faculty/update?token=" + sessionStorage.getItem("token"), userDetails.constructFormData(), httpOptions)
  }
}
