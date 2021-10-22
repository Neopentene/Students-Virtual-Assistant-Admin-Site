import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ShortUserDetails } from './../models/short-user-details.model';
import { FetchService } from './../utility-service/fetch.service';
import { Component, NgModule, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { PortMultipleUsers } from '../models/port-multiple-users.model';
import { SubscriptionLike } from 'rxjs';

@Component({
  selector: 'app-display-users',
  templateUrl: './display-users.component.html',
  styleUrls: ['./display-users.component.css']
})
export class DisplayUsersComponent implements OnInit, OnDestroy, AfterViewInit {
  users = new Array<ShortUserDetails>()
  private unsubcribeFetchService: SubscriptionLike

  constructor(private fetchService: FetchService, private router: Router) { }

  ngOnInit(): void {
    this.unsubcribeFetchService = this.fetchService.getAllFacultyUsers().subscribe(data => {
      if (data.success) {
        for (let i in data.data)
          this.users.push(data.data[i])
      }
      else {
        this.router.navigateByUrl('/login')
      }
    })
  }

  createNewUser() {
    this.router.navigateByUrl('/create/user')
  }

  ngAfterViewInit() {

  }

  ngOnDestroy() {
    if (this.unsubcribeFetchService != undefined) {
      this.unsubcribeFetchService.unsubscribe()
    }
  }

}
