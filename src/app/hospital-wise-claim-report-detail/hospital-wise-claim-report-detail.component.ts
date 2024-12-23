import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { HeaderService } from '../application/header.service';
// import { HeaderService } from '../header.service';


import { HospitalWiseClaimReportServiceService } from '../application/Services/hospital-wise-claim-report-service.service';
import { TableUtil } from '../application/util/TableUtil';

@Component({
  selector: 'app-hospital-wise-claim-report-detail',
  templateUrl: './hospital-wise-claim-report-detail.component.html',
  styleUrls: ['./hospital-wise-claim-report-detail.component.scss']
})
export class HospitalWiseClaimReportDetailComponent implements OnInit {

  fromDate: any;
  toDate: any;
  eventName: any;
  hospitalId: any;
  userId: any;
  currentPage:any;
  pageElement:any;
  showPegi:any;
  snareport:any;
  public list: any = [];

  constructor(public headerService:HeaderService,public hospitalwiseclaimreportserv: HospitalWiseClaimReportServiceService) { }

  ngOnInit(): void {

    this.headerService.setTitle('Hospital Wise Claim and Discharge Details');
    this.fromDate= localStorage.getItem("fromDate");
    this.toDate= localStorage.getItem("toDate");
    this.eventName= localStorage.getItem("eventName");
    this.hospitalId= localStorage.getItem("hospitalId");
    this.userId= localStorage.getItem("userId");
    this.getCountDetails();
    
  }
  getCountDetails(){
    this.hospitalwiseclaimreportserv.searchhospitalwiseclaimreportdetails(this.userId,this.fromDate,this.toDate,this.hospitalId,this.eventName).subscribe(
          (response) =>{
            console.log(response)
            this.list = response;
            localStorage.removeItem("fromDate");
            localStorage.removeItem("toDate");
            localStorage.removeItem("eventName");
            localStorage.removeItem("hospitalId");
            localStorage.removeItem("userId");
          },
          (error) => {
            console.log(error);
            this.swal('', 'Something went wrong.', 'error');
          }
        )

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
    urn: "",
    claimNo: "",
    invoiceno: "",
    packagecode: "",
    hospitalName: "",
    authorizedCode: "",
    actualDateOfadmission: "",
    actualDateOfDischarge: "",
    claimsubmitted: "",
    claimstatus: ""
    
    // hospitalCode: ""
  };
  heading = [['Sl#','URN', 'Claim No.', 'Invoice No.' , 'Package Code', 'Hospital Name' ,'AuthorizedCode','Actual Date Of Admission', 'Actual Date Of Discharge', 'Claim Submitted','Claim Status']];

  downloadReport(){
    this.report = [];
    let claim: any;
    console.log(this.list);
    for(var i=0;i<this.list.length;i++) {
      claim = this.list[i];
      console.log(claim);
      this.sno = [];
      this.sno.Slno = i+1;
      this.sno.urn = claim.urn!=null?claim.urn:'N/A';
      this.sno.claimNo = claim.claimNo!=null?claim.claimNo:'N/A';
      this.sno.invoiceno = claim.invoiceno!=null?claim.invoiceno:'N/A';
      this.sno.packagecode =  claim.packagecode!=null?claim.packagecode:'N/A';
      // this.sno.hospitalName =claim.hospitalName!=null?claim.hospitalName:'N/A';
      this.sno.HospitalName =claim.HospitalName!=null?claim.HospitalName:'N/A'+'('+claim.hospitalCode+')'!=null?claim.hospitalName+ '('+claim.hospitalCode+')':'N/A';
      this.sno.authorizedCode =  claim.authorizedCode!=null?claim.authorizedCode:'N/A';
      this.sno.actualDateOfadmission = claim.actualDateOfadmission!=null?claim.actualDateOfadmission:'N/A';
      this.sno.actualDateOfDischarge =  claim.actualDateOfDischarge!=null?claim.actualDateOfDischarge:'N/A';
      //this.sno.dateOfAdmission =  claim.dateOfAdmission!=null?claim.dateOfAdmission:'N/A';
      //this.sno.dateOfDischarge =  claim.dateOfDischarge!=null?claim.dateOfDischarge:'N/A';
      this.sno.claimsubmitted =  claim.claimsubmitted!=null?claim.claimsubmitted:'N/A';
      this.sno.claimstatus =  claim.claimstatus!=null?claim.claimstatus:'N/A';
      
      // this.sno.hospitalCode =  claim.hospitalCode!=null?claim.hospitalCode:'N/A';
      this.report.push(this.sno);
    }
    TableUtil.exportListToExcel(this.report, "Hospital Wise Claim and Discharge Report Details", this.heading);
  }

}
