import { UserDetails } from './../models/user-details.model';
import { Router } from '@angular/router';
import { FetchService } from './../utility-service/fetch.service';
import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, OnChanges, SecurityContext } from '@angular/core';
import { SubscriptionLike } from 'rxjs';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('contact') contactP: ElementRef;
  name: string;
  department: string;
  designation: string;
  address: string;
  image: SafeUrl;
  contacts: string;
  private checkServiceSubcription: SubscriptionLike;

  constructor(private fetchService: FetchService, private router: Router, private DOMsanitiser: DomSanitizer) {
    if (sessionStorage.getItem("userData") != null || sessionStorage.getItem("userData") != undefined) {
      this.retriveAndDisplayFromStorage()
    }
  }

  ngOnDestroy() {
    if (this.checkServiceSubcription != undefined) {
      this.checkServiceSubcription.unsubscribe()
    }
  }

  ngOnInit(): void {

  }

  retriveAndDisplayFromStorage() {
    let localString = sessionStorage.getItem("userData") ? sessionStorage.getItem("userData") : ""
    let data: UserDetails = <UserDetails>JSON.parse((<string>localString))
    this.name = data.name;
    this.department = data.department
    this.designation = data.designation
    this.address = data.address != '' ? data.address : 'No Address'
    this.image = this.sanitizeImage(data.image)
    this.contacts = ''
    for (let i in data.contacts) {
      this.contacts += data.contacts[i] + "<br/>"
    }
    if (this.contacts == '') {
      this.contacts = 'No Contacts'
    }
  }

  ngAfterViewInit() {
    if (sessionStorage.getItem("userData") != null || sessionStorage.getItem("userData") != undefined) {
      this.retriveAndDisplayFromStorage()
    }
    else {
      this.checkServiceSubcription = this.fetchService.getUserData().subscribe(data => {

        if (data.success) {
          this.name = data.data.name;
          this.department = data.data.department
          this.designation = data.data.designation
          this.address = data.data.address != '' ? data.data.address : 'No Address'
          this.image = this.sanitizeImage(data.data.image)
          this.contacts = ''
          for (let i in data.data.contacts) {
            this.contacts += data.data.contacts[i] + "<br/>"
          }
          (<HTMLParagraphElement>this.contactP.nativeElement).innerHTML = this.contacts
          sessionStorage.setItem("token", data.token != null ? data.token : '')
          sessionStorage.setItem("userData", JSON.stringify(data.data))
        }
        else {
          this.router.navigateByUrl('/login')
        }
      })
    }
    (<HTMLParagraphElement>this.contactP.nativeElement).innerHTML = this.contacts
  }

  redirectEditUser() {
    this.router.navigateByUrl('/edit/user')
  }

  sanitizeImage(image: string) {
    return this.DOMsanitiser.bypassSecurityTrustUrl('data:image/jpg;base64,' + image);
  }

}
