import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/services/jwt.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { ReportcountService } from '../../Services/reportcount.service';
import { TableUtil } from '../../util/TableUtil';

@Component({
  selector: 'app-claimactioncountdetails',
  templateUrl: './claimactioncountdetails.component.html',
  styleUrls: ['./claimactioncountdetails.component.scss']
})
export class ClaimactioncountdetailsComponent implements OnInit {
  token: any;
  searchBy:any;
  fromDate:any;
  toDate:any;
  urn:any;
  eventName:any;
  claimCountDetails:any=[];
  showPegi:boolean;
  record:any;
  currentPage:any;
  pageElement:any;
  txtsearchDate:any;
  userId: any;
  hospitalId: any;
  districtId: any;
  stateId: any;
  constructor(private reportcount:ReportcountService,private jwtService: JwtService,private route:Router) { }

  ngOnInit(): void {
   this.searchBy=localStorage.getItem("searchBy");
   this.fromDate= localStorage.getItem("fromDate");
   this.toDate= localStorage.getItem("toDate");
   this.urn= localStorage.getItem("urnNumber");
   this.eventName= localStorage.getItem("eventName");
   this.token=localStorage.getItem("token");
   this.userId=localStorage.getItem("userId");
   this.stateId=localStorage.getItem("stateId");
   this.districtId=localStorage.getItem("districtId");
   this.hospitalId=localStorage.getItem("hospitalId");
   //console.log(this.searchBy,this.fromDate,this.toDate,this.eventName,this.urn);
   this.getDetails();
  //  this.currentPage = 1;
  //  this.pageElement = 10;
  }
  getDetails(){
    this.reportcount.getReportsCountDetails(this.userId,this.fromDate,this.toDate,this.eventName,this.stateId,this.districtId,this.hospitalId).subscribe((data:any)=>{
      //console.log(data[0].length);
      console.log(data);
      this.claimCountDetails=data;
      this.record=this.claimCountDetails.length;
      localStorage.removeItem("searchBy");
      localStorage.removeItem("fromDate");
      localStorage.removeItem("toDate");
      localStorage.removeItem("urnNumber");
      localStorage.removeItem("eventName");
      localStorage.removeItem("token");
      localStorage.removeItem("stateId");
      localStorage.removeItem("districtId");
      localStorage.removeItem("hospitalId");
     
    },(error) => {
      console.log(error);
      this.swal('', 'Something went wrong.', 'error');
    })
  }
  getActionDetails(claimId,actualdateofdischarge,authorizedcode,hospitalCode,urn){
  localStorage.setItem("claimid", claimId);
  authorizedcode=authorizedcode.substring(2);
  let  state={
    actualdate: actualdateofdischarge,
    authorizedcode: authorizedcode,
    Hospitalcode: hospitalCode,
    Urn:urn
  }
  localStorage.setItem("trackingdetails",JSON.stringify(state));
  localStorage.setItem("token", this.jwtService.getJwtToken())
  this.route.navigate([]).then(result => { window.open(environment.routingUrl+'/trackingdetails'); });
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  report: any = [];
  sno: any = {
    Slno: "",
    claimNo: "",
    URN: "",
    HospitalName: "",
    PackageName: "",
    ActualDateofAdmission: "",
    ActualDateofDischarge: "",
    cpdName: ""
  };
  heading = [
    ['Sl No', 'Claim No.', 'URN', 'Hospital Name', 'Package Name', 'Actual Date Of Admission', 'Actual Date Of Discharge']
  ];

  downloadReport(){
    this.report = [];
    let claim: any;
    console.log(this.claimCountDetails);
    for(var i=0;i<this.claimCountDetails.length;i++) {
      claim = this.claimCountDetails[i];
      console.log(claim);
      this.sno = [];
      this.sno.Slno = i+1;
      this.sno.claimNo = claim.claimNo;
      this.sno.URN = claim.urn;
      this.sno.HospitalName =claim.hospitalName;
      this.sno.PackageName =  claim.packageName;
      this.sno.ActualDateofAdmission = claim.actDateOfAdm;
      this.sno.ActualDateofDischarge =  claim.actDateOfDschrg;
      // this.sno.cpdName =  claim.cpdName;
      this.report.push(this.sno);
    }
    TableUtil.exportListToExcel(this.report, "Claim Action Count Details", this.heading);


  }
}
