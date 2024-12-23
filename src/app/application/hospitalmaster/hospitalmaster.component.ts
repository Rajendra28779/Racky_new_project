import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderService } from '../header.service';
import { HospitalmasterService } from '../Services/hospitalmaster.service';
import { SnoCLaimDetailsService } from '../Services/sno-claim-details.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-hospitalmaster',
  templateUrl: './hospitalmaster.component.html',
  styleUrls: ['./hospitalmaster.component.scss']
})
export class HospitalmasterComponent implements OnInit {
  totalClaimCount:any;
  Hospitallist:any =[];
  detailData:any = [];
  txtsearchDate:any;
  currentPage:any;
  pageElement:any;
  showPegi:boolean;
  user: any;
  record:any;
  constructor(public headerService:HeaderService,public snoService: SnoCLaimDetailsService,public hospitalService: HospitalmasterService,public route:Router,private sessionService: SessionStorageService
    ) { }

  ngOnInit(): void {
    this.headerService.setTitle('SNA Tagged To Hospital');    
    this.headerService.isIndicate(true);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.headerService.isBack(false);
    this.user = this.sessionService.decryptSessionData("user");
    this.currentPage = 1;
    this.pageElement = 10;  
    this.getStateList();
    this.getHospitalDetails();
  }

  stateData: any = [];
  statelist: Array<any> = [];
  stateCode: any;
  userId: any;
  distList: any;
  distCode: any;
  hospitalList: any;
  getStateList() {
    this.snoService.getStateList().subscribe((data: any) => {
      this.stateData = data;
      this.stateData.sort((a, b) => a.stateName.localeCompare(b.stateName));
      for (let j = 0; j < this.stateData.length; j++) {
        if (this.stateData[j].stateCode == '21') {
          this.statelist.push(this.stateData[j]);
        }
      }
      for (let i = 0; i < this.stateData.length; i++) {
        if (this.stateData[i].stateCode != '21') {
          this.statelist.push(this.stateData[i]);
        }
      }
    })
  }
  OnChangeState(event) {
    this.stateCode = event.target.value;
    this.hospitalService.getDistrictListByStateCode(this.stateCode).subscribe((data) => {
      this.distList = data;
    })
  }
  getHospitalDetails(){
    let stateCode1 = $('#statecode1').val();
    let distCode1 = $('#distcode1').val();
    this.hospitalService.getHospitalList(stateCode1,distCode1).subscribe((data) => {
      this.Hospitallist=data;
      this.record=this.Hospitallist.length;
      if(this.record>0){
        this.showPegi=true;
      }
      else{
        this.showPegi=false;
      }
    },(error:any)=>{
       console.log(error);
       this.swal("Error", "Something went wrong", 'error');
    })
  }
  getReset(){
    window.location.reload();
  }
  viewData(item:any){
     this.detailData=[];
     this.detailData.push(item);    
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;

  }
}
