import { TimeTableComponent } from './time-table/time-table.component';
import { ClassComponent } from './class/class.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { HomeComponent } from './home/home.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateNewFacultyUserComponent } from './create-new-faculty-user/create-new-faculty-user.component';
import { DisplayUsersComponent } from './display-users/display-users.component';

const routes: Routes = [{
  path: '', redirectTo: '/login', pathMatch: 'full'
},
{
  path: 'login', component: LoginFormComponent
},
{
  path: 'home', component: HomeComponent
},
{
  path: 'create/user', component: CreateNewFacultyUserComponent
},
{
  path: 'edit/user', component: EditUserComponent
},
{
  path: 'user', redirectTo: '/home', pathMatch: 'full'
},
{
  path: 'faculties', component: DisplayUsersComponent
},
{
  path: 'classes', component: ClassComponent
},
{
  path: 'classes/timetable', component: TimeTableComponent
},
{
  path: '**', component: LoginFormComponent
},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
