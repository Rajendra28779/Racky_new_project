import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../application/header.service';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtService } from '../services/jwt.service';
import { UsermanualService } from '../application/Services/usermanual.service';
import { SessionStorageService } from '../services/session-storage.service';

@Component({
  selector: 'app-doctorprofiledetails',
  templateUrl: './doctorprofiledetails.component.html',
  styleUrls: ['./doctorprofiledetails.component.scss']
})
export class DoctorprofiledetailsComponent implements OnInit {
  user: any;
  data: any;
  constructor(public headerService: HeaderService, private route: Router, public activeroute: ActivatedRoute,
    private usermanualService: UsermanualService, private jwtService: JwtService,
    private sessionService: SessionStorageService ) { }
  ngOnInit(): void {
    this.user = this.sessionService.decryptSessionData("user");
    this.data = JSON.parse(localStorage.getItem("data"));
    this.getdetails();
  }
  detailsdata:any=[];
  getdetails() {
    this.detailsdata=[];
    let profilid = this.data.profileid;
    this.usermanualService.getdetailshistory(profilid).subscribe((data: any) => {
      this.detailsdata = data;
      this.getdetailslist();
    }
    );
  }
  datalist: any = [];
  getdetailslist() {
    let profilid = this.data.profileid;
    this.usermanualService.detailsdata(profilid).subscribe(data => {
      this.datalist = data;
    })
  }
}
