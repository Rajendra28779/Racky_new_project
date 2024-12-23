import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { HeaderService } from '../../header.service';
import { ReferralService } from '../../Services/referral.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-referral-hospitalview',
  templateUrl: './referral-hospitalview.component.html',
  styleUrls: ['./referral-hospitalview.component.scss']
})
export class ReferralHospitalviewComponent implements OnInit {
  user:any;
  list:any=[];
  count:any=0;
  textserch:any;
  currentPage: any;
  pageElement: any;
  showPegi: boolean;

  constructor(private userService: ReferralService,private route: Router, public headerService: HeaderService,private sessionService: SessionStorageService,) { }

  ngOnInit(): void {
    this.headerService.setTitle('View Referral Hospital');
    // this.user=JSON.parse(sessionStorage.getItem("user"))
    this.user = this.sessionService.decryptSessionData("user");
    this.getdoctorlist()
  }
  getdoctorlist() {
    this.userService.getreferalhospitallist().subscribe((data:any)=>{
        console.log(data);
      this.list=data;
      this.count=this.list.length
      if(this.count>0){
        this.showPegi=true
        this.currentPage=1
        this.pageElement=50
      }else{
        this.showPegi=true
      }
    });
  }

  edit(item:any){
    let navigationExtras: NavigationExtras = {
      state: {
        id: item.hospitalid
      }
    };
    this.route.navigate(['application/referalhospital'], navigationExtras);

}
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }

}
