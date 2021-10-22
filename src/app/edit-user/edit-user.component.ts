import { PatternValidatorService } from './../validation-service/pattern-validator.service';
import { Contact } from './../models/contact.model';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { SubscriptionLike } from 'rxjs';
import { UserDetails } from '../models/user-details.model';
import { FetchService } from '../utility-service/fetch.service';
import { PatternValidator } from '@angular/forms';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  @ViewChild('contactP') contactP: ElementRef;
  @ViewChild('departmentP') departmentP: ElementRef;
  @ViewChild('designationP') designationP: ElementRef;
  @ViewChild('addressP') addressP: ElementRef;
  @ViewChild('nameP') nameP: ElementRef;
  @ViewChild('profileP') img: ElementRef;

  name: string;
  department: string;
  designation: string;
  address: string;
  imageCaption: string;
  image: SafeUrl;
  imageString: string;
  contacts: string;
  contactArray = Array<string>()
  fileExtension: string;
  private checkServiceSubcription: SubscriptionLike;
  private uncheckServiceSubcription: SubscriptionLike;

  constructor(private fetchService: FetchService, private router: Router, private DOMsanitiser: DomSanitizer, private patternMatcher: PatternValidatorService) {
    if (sessionStorage.getItem("userData") != null || sessionStorage.getItem("userData") != undefined) {
      this.retriveAndDisplayFromStorage()
    }
  }

  ngOnDestroy() {
    if (this.checkServiceSubcription != undefined) {
      this.checkServiceSubcription.unsubscribe()
    }
    if (this.uncheckServiceSubcription != undefined) {
      this.uncheckServiceSubcription.unsubscribe()
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
    this.imageCaption = this.name + "'s image"
    this.address = data.address != '' ? data.address : 'No Address'
    this.image = this.sanitizeImage(data.image)
    this.contacts = ''
    for (let i in data.contacts) {
      this.contacts += "<div>" + data.contacts[i] + "</div>"
      this.contactArray.push(<string>data.contacts[i])
    }
  }

  setPreview(event: any) {
    if (event.target.files && event.target.files[0]) {
      const fileReader: FileReader = new FileReader()
      this.fileExtension = <string>(<string>event.target.files[0].name).split('.').pop()
      fileReader.onload = (e: any) => {
        this.image = e.target.result
        this.imageString = e.target.result
      }
      fileReader.readAsDataURL(event.target.files[0])
      this.imageCaption = <string>event.target.files[0].name
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
          this.imageCaption = this.name + "'s image"
          this.address = data.data.address != '' ? data.data.address : 'No Address'
          this.image = this.sanitizeImage(data.data.image)
          this.contacts = ''
          for (let i in data.data.contacts) {
            this.contacts += "<div>" + data.data.contacts[i] + "</div>"
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

  onSaveHit() {
    this.name = (<HTMLParagraphElement>this.nameP.nativeElement).innerHTML
    this.department = (<HTMLParagraphElement>this.departmentP.nativeElement).innerHTML
    this.designation = (<HTMLParagraphElement>this.designationP.nativeElement).innerHTML
    this.address = (<HTMLParagraphElement>this.addressP.nativeElement).innerHTML
    this.contacts = (<HTMLParagraphElement>this.contactP.nativeElement).innerHTML
    let updateDetails: UserDetails = new UserDetails()
    updateDetails.setData(this.name, this.department, this.designation, this.address, this.imageString ? <string>this.patternMatcher.removeHeadersFromImg(this.imageString) : "")
    let contacts = Array<Contact>()
    let string: RegExpMatchArray = <RegExpMatchArray>this.patternMatcher.getNumbersfromDiv(this.contacts)
    for (let data in string) {
      contacts.push(string[data])
    }
    updateDetails.contacts = contacts
    updateDetails.imageExtension = this.fileExtension ? this.fileExtension : ''
    updateDetails.firstName = this.name
    updateDetails.lastName = ''
    console.log(updateDetails.constructFormData())
    this.uncheckServiceSubcription = this.fetchService.updateNewUser(updateDetails).subscribe(data => {
      if (data.success) {
        sessionStorage.clear()
        sessionStorage.setItem("token", data.token ? data.token : '')
        window.scroll(0, 0)
        let i = 0;
        (function repeat(router: Router) {
          if (++i > 1) return;
          setTimeout(function () {
            router.navigateByUrl('/home')
            repeat(router);
          }, 1000);
        })(this.router);
      }
      else {
        console.log(data)
      }
    }, error => {
      console.log(error)
    })
  }

  routeLater(route: Router) {
    route.navigateByUrl("/home")
  }

  redirectEditUser() {
    this.router.navigateByUrl('/edit/user')
  }

  sanitizeImage(image: string) {
    return this.DOMsanitiser.bypassSecurityTrustUrl('data:image/jpg;base64,' + image);
  }

}
