import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { sysrejreports } from 'src/app/services/api-config';
import { HeaderService } from '../../header.service';
import { ReferralService } from '../../Services/referral.service';

@Component({
  selector: 'app-referal-doctor-configurationview',
  templateUrl: './referal-doctor-configurationview.component.html',
  styleUrls: ['./referal-doctor-configurationview.component.scss']
})
export class ReferalDoctorConfigurationviewComponent implements OnInit {
  user:any;
  list:any=[];
  count:any=0;
  textserch:any;
  currentPage: any;
  pageElement: any;
  showPegi: boolean;
  header:any;
  taggedhospitallist: any=[];

  constructor( public headerService: HeaderService, public route: Router,private userService: ReferralService) { }

  ngOnInit(): void {
    this.headerService.setTitle('Referral Doctor Configuration');
    this.getdoctortaglist();
  }
  getdoctortaglist() {
    this.userService.getdoctortaglist().subscribe((data:any)=>{
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

  view(item:any){
    this.header=item.fullname
    this.taggedhospitallist=[];
    this.userService.getdoctortaglistbydoctorid(item.Userid).subscribe((data:any)=>{
        this.taggedhospitallist=data;
        console.log(this.taggedhospitallist);

    });
  }

  edit(item:any){
    let navigationExtras: NavigationExtras = {
      state: {
        id: item.Userid,
        fullname:item.fullname
      }
    };
    this.route.navigate(['application/referaldoctormapping'], navigationExtras);

}

}
