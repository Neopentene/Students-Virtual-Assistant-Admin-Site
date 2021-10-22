import { UserDetails } from './models/user-details.model';
import { UserLoginObject } from './models/user-login-object.model';
import { ServerResponse } from './models/server-response.model';
import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { CreateNewFacultyUserComponent } from './create-new-faculty-user/create-new-faculty-user.component';
import { HomeComponent } from './home/home.component';
import { TimeTableComponent } from './time-table/time-table.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { CommonModule } from '@angular/common';
import { DisplayUsersComponent } from './display-users/display-users.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ClassComponent } from './class/class.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    CreateNewFacultyUserComponent,
    HomeComponent,
    TimeTableComponent,
    EditUserComponent,
    DisplayUsersComponent,
    ClassComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    CommonModule,
  ],
  providers: [HttpClientModule, HttpClient, ServerResponse, UserLoginObject, UserDetails],
  bootstrap: [AppComponent]
})
export class AppModule { }
