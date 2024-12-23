import { Component, OnInit } from '@angular/core';
import { ReportcountService } from '../Services/reportcount.service';
import { DatePipe, formatDate } from '@angular/common';
import { TableUtil } from '../util/TableUtil';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/services/jwt.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-old-claim-progress-report-details',
  templateUrl: './old-claim-progress-report-details.component.html',
  styleUrls: ['./old-claim-progress-report-details.component.scss']
})
export class OldClaimProgressReportDetailsComponent implements OnInit {
  token: any;
  fromDate: any;
  toDate: any;
  urn: any;
  eventName: any;
  showPegi: boolean;
  record: any;
  countprogressreport: any=[];
  currentPage: any;
  pageElement: any;
  txtsearchDate: any;
  userId: any;
  hospitalId: any;
  districtId: any;
  stateId: any;
  groupid: any;
  pageHeading: any;
  user: any;

  constructor(private reportCount: ReportcountService, public datepipe: DatePipe, public route: Router,
    private jwtService: JwtService, private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.user = this.sessionService.decryptSessionData("user");
    this.fromDate= localStorage.getItem("fromDate");
    this.toDate= localStorage.getItem("toDate");
    this.eventName= localStorage.getItem("eventName");
    this.token=localStorage.getItem("token");
    this.userId=localStorage.getItem("userId");
    this.stateId=localStorage.getItem("stateId");
    this.districtId=localStorage.getItem("districtId");
    this.hospitalId=localStorage.getItem("hospitalId");
    this.getHeading(this.eventName);
    this.getdetails();
  }

  getdetails() {
    this.reportCount.getOlddetailsclaimProgress(this.userId,this.fromDate,this.toDate,this.eventName,this.stateId,this.districtId,this.hospitalId).subscribe((data:any)=>{
      console.log(data);
      this.countprogressreport=data;
      this.record=this.countprogressreport.length;
      localStorage.removeItem("fromDate");
      localStorage.removeItem("toDate");
      localStorage.removeItem("userId");
      localStorage.removeItem("eventName");
      localStorage.removeItem("token");
      localStorage.removeItem("stateId");
      localStorage.removeItem("districtId");
      localStorage.removeItem("hospitalId");
    },(error) => {
      console.log(error);
      this.swal('', 'Something went wrong.', 'error');
    });
  }

  getHeading(event) {
    switch (event) {
      case 'TRO':
        this.pageHeading = 'Total Case Re-Open';
        break;
      case 'TROA':
        this.pageHeading = 'Total Re-Open of Approved Case';
        break;
      case 'TROSR':
        this.pageHeading = 'Total Re-Open of SNA Rejected Case';
        break;
      case 'APSA':
        this.pageHeading = 'Total SNA Approved(Approved)';
        break;
      case 'ASSR':
        this.pageHeading = 'Total SNA Rejected(Approved)';
        break;
      case 'ASQPH':
        this.pageHeading = 'SNA Queried And Pending At Hospital(Approved)';
        break;
      case 'AHRPS':
        this.pageHeading = 'Hospital Reclaimed and Pending At SNA(Approved)';
        break;
      case 'SRSA':
        this.pageHeading = 'Total SNA Approved(SNA Rejected)';
        break;
      case 'SRSR':
        this.pageHeading = 'Total SNA Rejected(SNA Rejected)';
        break;
      case 'SRSQPH':
        this.pageHeading = 'SNA Queried And Pending At Hospital(SNA Rejected)';
        break;
      case 'SNHRPS':
        this.pageHeading = 'Hospital Reclaimed and Pending At SNA(SNA Rejected)';
        break;
      default:
        console.log('Invalid choice');
        break;
    }
  }
  
  report: any = [];
  sno: any = {
    Slno: "",
    claimNo: "",
    URN: "",
    invoiceNo: "",
    HospitalName: "",
    HospitalCode: "",
    ActualDateofAdmission: "",
    ActualDateofDischarge: "",
    oldClaimStatus: "",
    claimAmount: "",
    currentClaimStatus: "",
  };

  heading: any;
  downloadReport(type) {
      this.heading = [
        ['Sl No', 'Claim No.', 'URN', 'Invoice No.', 'Hospital Name', 'Hospital Code', 'Actual Date Of Admission', 'Actual Date Of Discharge', 'Old Claim Status', 'Claim Amount (₹)','Current Claim Status']
      ];
    this.report = [];
    let claim: any;
    console.log(this.countprogressreport);
    if (type=='xcl') {
      for(var i=0;i<this.countprogressreport.length;i++) {
        claim = this.countprogressreport[i];
        console.log(claim);
        this.sno = [];
        this.sno.Slno = (i+1).toString();
        this.sno.claimNo = claim.claimNo;
        this.sno.URN = claim.urn;
        this.sno.invoiceNo =claim.invoiceNo;
        this.sno.HospitalName = claim.hospitalName;
        this.sno.HospitalCode = claim.hospitalCode;
        this.sno.ActualDateofAdmission = claim.actualDateOfAdmission;
        this.sno.ActualDateofDischarge =  claim.actualDateOfDischarge;
        this.sno.oldClaimStatus = claim.oldClaimStatus;
        this.sno.claimAmount = claim.claimAmount!=null && claim.claimAmount!='' && claim.claimAmount!=undefined?claim.claimAmount:'';
        this.sno.currentClaimStatus = claim.currentStatus;
        this.report.push(this.sno);
      }
      let filter = [];
      filter.push([[this.pageHeading]]);
      filter.push(['']);
      TableUtil.exportListToExcelWithFilter(this.report, "Old Claim Progress Report Details", this.heading, filter);
    } else if (type=='pdf') {
      if(this.countprogressreport.length==0){
        Swal.fire("Info", "No data found", 'info');
        return;
      }
      const doc = new jsPDF('l', 'mm', [280, 455] );
      doc.text("Old Claim Progress Report Details", 14, 20);
      doc.setFontSize(10);

      doc.text(this.pageHeading, 14, 30);
      doc.text("Generated By: "+this.user.fullName+"\tGenerated On: " + formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString(), 14, 40);
            
      doc.setFontSize(12);
      for(var i=0;i<this.countprogressreport.length;i++) {
        claim = this.countprogressreport[i];
        console.log(claim);
        this.sno = [];
        this.sno[0]= (i+1).toString();
        this.sno[1] = claim.claimNo;
        this.sno[2] = claim.urn;
        this.sno[3] =claim.invoiceNo;
        this.sno[4] = claim.hospitalName;
        this.sno[5] = claim.hospitalCode;
        this.sno[6] = claim.actualDateOfAdmission;
        this.sno[7] =  claim.actualDateOfDischarge;
        this.sno[8] = claim.oldClaimStatus;
        this.sno[9] = claim.claimAmount!=null && claim.claimAmount!='' && claim.claimAmount!=undefined?claim.claimAmount:'';
        this.sno[10] = claim.currentStatus;
        this.report.push(this.sno);
      }

      autoTable(doc, {
        head: this.heading,
        body: this.report,
        theme: 'grid',
        startY: 50,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: {cellWidth: 15},
          1: {cellWidth: 40},
          2: {cellWidth: 60},
          3: {cellWidth: 30},
          4: {cellWidth: 50},
          5: {cellWidth: 30},
          6: {cellWidth: 60},
          7: {cellWidth: 30},
          8: {cellWidth: 30},
          9: {cellWidth: 40},
          10: {cellWidth: 40},
        }          
      });
      doc.save('Old Claim Progress Report Details');
    }
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  onAction(id: any, urn: any, transid: any) {
    let transId = transid;
          let state = {
            Urn:urn
          }
          localStorage.setItem("claimid", transId);
          localStorage.setItem("trackingdetails",JSON.stringify(state));
          localStorage.setItem("token",this.jwtService.getJwtToken());
          this.route.navigate([]).then(result => { window.open(environment.routingUrl+'/oldClaimtrackingdetails'); });
  }

}
