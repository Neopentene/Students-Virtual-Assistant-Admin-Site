import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.css']
})
export class ClassComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  routeToTimeTable() {
    this.router.navigateByUrl('/classes/timetable')
  }

}
