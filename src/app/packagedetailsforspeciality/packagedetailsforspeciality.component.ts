import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../application/header.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PackageDetailsMasterService } from '../application/Services/package-details-master.service';
import { JwtService } from '../services/jwt.service';
import { SessionStorageService } from '../services/session-storage.service';

@Component({
  selector: 'app-packagedetailsforspeciality',
  templateUrl: './packagedetailsforspeciality.component.html',
  styleUrls: ['./packagedetailsforspeciality.component.scss']
})
export class PackagedetailsforspecialityComponent implements OnInit {
  user: any;
  tracking: any;
  constructor(public headerService: HeaderService, private route: Router, public activeroute: ActivatedRoute,
    public packageDetailsMasterService: PackageDetailsMasterService, private jwtService: JwtService,
    private sessionService: SessionStorageService) { }
  ngOnInit(): void {
    this.user = this.sessionService.decryptSessionData("user");
    this.tracking = JSON.parse(localStorage.getItem("speciality"));
    this.getdetailsdata();
  }
  detailsdata: any = [];
  getdetailsdata() {
    let procedurecode = this.tracking.Procedurecode;
    console.log(procedurecode);
    this.packageDetailsMasterService.getAlldetails(procedurecode).subscribe((data: any) => {
      this.detailsdata = data;
    }
    );
    localStorage.removeItem("speciality");
  }
}
