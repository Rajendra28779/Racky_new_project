import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { data } from 'jquery';
import { environment } from 'src/environments/environment';
import { HeaderService } from '../header.service';
import { SnadoctorserviceService } from '../Services/snadoctorservice.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-snadoctor-tag',
  templateUrl: './snadoctor-tag.component.html',
  styleUrls: ['./snadoctor-tag.component.scss']
})
export class SnadoctorTagComponent implements OnInit {
  SnaDetails: any = [];
  userId: any;
  user: any;
  showPegi: boolean;
  record: any;
  pageElement: any;
  currentPage: number;

  constructor(public headerService: HeaderService, public route: Router, private snadoc: SnadoctorserviceService, private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle('SNA Doctor Tag');
    this.user =  this.sessionService.decryptSessionData("user");
    if (this.user.groupId == 1 || this.user.groupId == 10) {
      this.userId = "";
    } else {
      this.userId = this.user.userId
    }
    this.snadoc.getsnadetailslist(this.userId).subscribe(data => {
      this.SnaDetails = data;
      this.record = this.SnaDetails.length;
      if (this.record > 0) {
        this.showPegi = true;
      }
      else {
        this.showPegi = false;
      }
    });
    this.currentPage = 1;
    this.pageElement = 10;
  }

  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
  }

  Details(v: any) {
    localStorage.setItem("userid", v.userid);
    let state = {
      name: v.snaname,
      email: v.email,
      phone: v.mobile,
    }
    localStorage.setItem("Snadetails", JSON.stringify(state));
    this.route.navigate([]).then(result => { window.open(environment.routingUrl + '/application/doctorstag'); });
  }
}
