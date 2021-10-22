import { SubscriptionLike } from 'rxjs';
import { UserAuthService } from './auth-service/user-auth.service';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ViewChildren, OnDestroy } from '@angular/core';
import { NavigationStart, Router, RouterState } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  loginStatus: boolean = false;
  private unsubcribeRouterEvents: SubscriptionLike;
  currentRoute: string;

  title = 'admin-website';

  constructor(private router: Router, private authCheck: UserAuthService) {
    this.unsubcribeRouterEvents = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (event.url != '/login' && event.url != '/') {
          console.log('Navigation Start')
          this.authCheck.checkToken().subscribe(data => {
            if (data.success) {
              sessionStorage.setItem("token", data.token != null ? data.token : '')
              this.loginStatus = true
              this.currentRoute = this.router.routerState.snapshot.url
            }
            else {
              this.loginStatus = false
              this.router.navigateByUrl('/login')
            }
          })
        }
      }
    })
  }

  checkRoute(onRoute: string) {
    const reg: RegExp = new RegExp("/" + onRoute)
    return reg.test(this.currentRoute)
  }

  ngOnDestroy() {
    if (this.unsubcribeRouterEvents != undefined) {
      this.unsubcribeRouterEvents.unsubscribe()
    }
  }

  clearAll() {
    sessionStorage.clear()
  }

  ngOnInit() {

  }

  ngAfterViewInit() {

  }
}
