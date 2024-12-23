import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { HeaderService } from '../../header.service';
import { ReferralService } from '../../Services/referral.service';
import { UsercreateService } from '../../Services/usercreate.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-viewreferaldoctoruser',
  templateUrl: './viewreferaldoctoruser.component.html',
  styleUrls: ['./viewreferaldoctoruser.component.scss']
})
export class ViewreferaldoctoruserComponent implements OnInit {
  user:any;
  list:any=[];
  count:any=0;
  textserch:any;
  currentPage: any;
  pageElement: any;
  showPegi: boolean;

  constructor(private userService: ReferralService,private route: Router, public headerService: HeaderService,private sessionService: SessionStorageService,) { }

  ngOnInit(): void {
    this.headerService.setTitle('View Referral Doctor');
    // this.user=JSON.parse(sessionStorage.getItem("user"))
    this.user = this.sessionService.decryptSessionData("user");
    this.getdoctorlist()
  }
  getdoctorlist() {
    this.userService.getreferaldoctorlist().subscribe((data:any)=>{
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
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }
  edit(item:any){
      let navigationExtras: NavigationExtras = {
        state: {
          id: item.doctorid,
          fullname:item.fullname,
          username:item.username,
          mobileno:item.mobileno,
          email:item.emailid,
          license:item.licenseno,
          stsus:item.status
        }
      };
      this.route.navigate(['application/referaldoctorcreate'], navigationExtras);

  }

}
