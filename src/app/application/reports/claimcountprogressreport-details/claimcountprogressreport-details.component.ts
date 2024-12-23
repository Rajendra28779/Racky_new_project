import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ReportcountService } from '../../Services/reportcount.service';
import { TableUtil } from '../../util/TableUtil';
import { DatePipe, formatDate } from '@angular/common';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-claimcountprogressreport-details',
  templateUrl: './claimcountprogressreport-details.component.html',
  styleUrls: ['./claimcountprogressreport-details.component.scss']
})
export class ClaimcountprogressreportDetailsComponent implements OnInit {
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

  constructor(private reportCount: ReportcountService, public datepipe: DatePipe,private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    // this.user = JSON.parse(sessionStorage.getItem('user'));
    this.user = this.sessionService.decryptSessionData("user");
    this.fromDate= localStorage.getItem("fromDate");
    this.toDate= localStorage.getItem("toDate");
    this.eventName= localStorage.getItem("eventName");
    this.token=localStorage.getItem("token");
    this.userId=localStorage.getItem("userId");
    this.stateId=localStorage.getItem("stateId");
    this.districtId=localStorage.getItem("districtId");
    this.hospitalId=localStorage.getItem("hospitalId");
    this.groupid=localStorage.getItem("groupid");
    console.log(this.groupid);
    this.getHeading(this.eventName);
    this.getdetails();
  }

  getdetails() {
    this.reportCount.getalldetailsclaimcountprogress(this.userId,this.fromDate,this.toDate,this.eventName,this.stateId,this.districtId,this.hospitalId,this.groupid).subscribe((data:any)=>{
      console.log(data);
      this.countprogressreport=data;
      this.record=this.countprogressreport.length;
      localStorage.removeItem("searchBy");
      localStorage.removeItem("fromDate");
      localStorage.removeItem("toDate");
      localStorage.removeItem("userId");
      localStorage.removeItem("eventName");
      localStorage.removeItem("token");
      localStorage.removeItem("stateId");
      localStorage.removeItem("districtId");
      localStorage.removeItem("hospitalId");
      localStorage.removeItem("groupid");
    },(error) => {
      console.log(error);
      this.swal('', 'Something went wrong.', 'error');
    });
  }

  getHeading(event) {
    switch(event) {
      case 'DIS':
        this.pageHeading = 'Total Discharged';
        break;
      case 'NON':
        this.pageHeading = 'Document Upload Pending (Within 7 days of discharge)';
        break;
      case 'NID':
        this.pageHeading = 'Non Uploading Initial Document (After 7 days of discharge)';
        break;
      case 'C':
        this.pageHeading = 'Total Claim Raised';
        break;
      case 'CQW':
        this.pageHeading = 'Pending At Hospital (CPD Query within 7 days)';
        break;
      case 'CQA':
        this.pageHeading = 'System Rejected - Non  compliance of CPD Query';
        break;
      case 'SQW':
        this.pageHeading = 'Pending At Hospital (SNA Query within 7 days)';
        break;
      case 'SQA':
        this.pageHeading = 'System Rejected - Non  compliance of SNA Query';
        break;
      case 'CPD':
        this.pageHeading = 'Pending At CPD (Fresh Claim)';
        break;
      case 'CRS':
        this.pageHeading = 'Pending At CPD (Resettlement)';
        break;
      case 'CRV':
        this.pageHeading = 'Pending At CPD (SNA Reverted)';
        break;
      case 'DC':
        this.pageHeading = 'Pending At DC';
        break;
      case 'CPA':
        this.pageHeading = 'Pending At SNA (CPD Approved)';
        break;
      case 'CPR':
        this.pageHeading = 'Pending At SNA (CPD Rejected)';
        break;
      case 'SN':
        this.pageHeading = 'Pending At SNA (SNA Resettlement)';
        break;
      case 'UNC':
        this.pageHeading = 'Pending At SNA (Unprocessed Claim)';
        break;
      case 'DCC':
        this.pageHeading = 'Pending At SNA (DC Compliance)';
        break;
      case 'TCPDAPP':
        this.pageHeading = 'Total CPD Approved';
        break;
      case 'SNAACTIONAPPNR':
        this.pageHeading = 'SNA Action (Approved & Rejected) Of Total CPD Approved';
        break;
      case 'TCA':
        this.pageHeading = 'SNA Approved Of Total CPD Approved';
        break;
      case 'AOAS':
        this.pageHeading = 'SNA Rejected Of Total CPD Approved';
        break;
      case 'AOA':
        this.pageHeading = 'SNA Query Of Total CPD Approved';
        break;
      case 'SNAI':
        this.pageHeading = 'SNA Investigated Of Total CPD Approved';
        break;
      case 'SNAR':
        this.pageHeading = 'SNA Reverted Of Total CPD Approved';
        break;
      case 'TSNAT':
        this.pageHeading = 'Total SNA Action Taken Of Total CPD Approved';
        break;
      case 'TCRR':
        this.pageHeading = 'Total CPD Rejected';
        break;
      case 'SAAR':
        this.pageHeading = 'SNA Action (Approved & Rejected) Of Total CPD Rejected';
        break;
      case 'SNAP':
        this.pageHeading = 'SNA Approved Of Total CPD Rejected';
        break;
      case 'SNARE':
        this.pageHeading = 'SNA Rejected Of Total CPD Rejected';
        break;
      case 'SNQU':
        this.pageHeading = 'SNA Query Of Total CPD Rejected';
        break;
      case 'SNAINV':
        this.pageHeading = 'SNA Investigated Of Total CPD Rejected';
        break;
      case 'SNARVT':
        this.pageHeading = 'SNA Reverted Of Total CPD Rejected';
        break;
      case 'TSATRS':
        this.pageHeading = 'Total SNA Action Taken Of Total CPD Rejected';
        break;
      case 'TSRYU':
        this.pageHeading = 'Total System Rejected';
        break;
      case 'SNAACTION':
        this.pageHeading = 'SNA Action (Approved & Rejected) Of Total System Rejected';
        break;
      case 'SNAAPROVED':
        this.pageHeading = 'SNA Approved Of Total System Rejected';
        break;
      case 'SNAREJECT':
        this.pageHeading = 'SNA Rejected Of Total System Rejected';
        break;
      case 'SNAQUERYH':
        this.pageHeading = 'SNA Query Of Total System Rejected';
        break;
      case 'SNAINVESTIGATION':
        this.pageHeading = 'SNA Investigated Of Total System Rejected';
        break;
      case 'SNAREVERTF':
        this.pageHeading = 'SNA Reverted Of Total System Rejected';
        break;
      case 'TOTALSANACTION':
        this.pageHeading = 'Total SNA Action Taken Of Total System Rejected';
        break;
      case 'SNA':
        this.pageHeading = 'Total SNA Approved';
        break;
      case 'SNR':
        this.pageHeading = 'Total SNA Rejected';
        break;
      case 'F':
        this.pageHeading = 'Payment Freezed Claims';
        break;
      case 'PC':
        this.pageHeading = 'Paid Claims';
        break;
      case 'NF':
        this.pageHeading = 'Claims Not Freezed';
        break;
      case 'OHC':
        this.pageHeading = 'Pending At SNA (On Hold)';
        break;
      case 'SAR':
        this.pageHeading = 'System Admin SNA Rejected';
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
    caseno: "",
    URN: "",
    HospitalName: "",
    PackageCode: "",
    PackageName: "",
    ActualDateofAdmission: "",
    ActualDateofDischarge: "",
    cpdName: "",
    claimRaisedBy: "",
    queryDate: "",
    cpdAllotedDate: ""
  };

  heading: any;
  downloadReport(type) {
    if (this.eventName=='SQW' || this.eventName=='SQA') {
      this.heading = [
        ['Sl No', 'Claim No.', 'Case No.', 'URN', 'Hospital Name', 'Package Code', 'Package Name', 'Actual Date Of Admission', 'Actual Date Of Discharge', 'Query Date']
      ];
    } else if (this.eventName=='CQW' || this.eventName=='CQA') {
      this.heading = [
        ['Sl No', 'Claim No.', 'Case No.', 'URN', 'Hospital Name', 'Package Code', 'Package Name', 'Actual Date Of Admission', 'Actual Date Of Discharge', 'Query Date', 'CPD Name']
      ];
    } else if(this.eventName=='NID' || this.eventName=='NON') {
      this.heading = [
        ['Sl No', 'Claim No.', 'Case No.', 'URN', 'Hospital Name', 'Package Code', 'Package Name', 'Actual Date Of Admission', 'Actual Date Of Discharge', 'Claim Raise By', 'CPD Name']
      ];
    } else if(this.eventName=='CPD' || this.eventName=='CRS' || this.eventName=='CRV') {
      this.heading = [
        ['Sl No', 'Claim No.', 'Case No.', 'URN', 'Hospital Name', 'Package Code', 'Package Name', 'Actual Date Of Admission', 'Actual Date Of Discharge', 'CPD Alloted Date', 'CPD Name']
      ];
    } else {
      this.heading = [
        ['Sl No', 'Claim No.', 'Case No.', 'URN', 'Hospital Name', 'Package Code', 'Package Name', 'Actual Date Of Admission', 'Actual Date Of Discharge', 'CPD Name']
      ];
    }
    this.report = [];
    let claim: any;
    console.log(this.countprogressreport);
    if (type=='xcl') {
      for(var i=0;i<this.countprogressreport.length;i++) {
        claim = this.countprogressreport[i];
        console.log(claim);
        this.sno = [];
        this.sno.Slno = (i+1).toString();
        this.sno.claimNo = claim.claimNo!=null?claim.claimNo:'N/A';
        this.sno.caseno = claim.caseno!=null?claim.caseno:'N/A';
        this.sno.URN = claim.urn!=null?claim.urn:'N/A';
        this.sno.HospitalName =claim.HospitalName!=null?claim.HospitalName:'N/A'+'('+claim.hospitalCode+')'!=null?claim.hospitalName+ '('+claim.hospitalCode+')':'N/A';
        this.sno.PackageCode = claim.packagecode!=null?claim.packagecode:'N/A';
        this.sno.PackageName = claim.packageName!=null?claim.packageName:'N/A';
        this.sno.ActualDateofAdmission = claim.actDateOfAdm!=null?claim.actDateOfAdm:'N/A';
        this.sno.ActualDateofDischarge =  claim.actDateOfDschrg!=null?claim.actDateOfDschrg:'N/A';
        if (this.eventName=='SQW' || this.eventName=='SQA' || this.eventName=='CQW' || this.eventName=='CQA') {
          this.sno.queryDate = claim.queryDate!=null?this.datepipe.transform(claim.queryDate, 'dd-MMM-yyyy'):'N/A'
        }
        if (this.eventName=='NID' || this.eventName=='NON') {
          this.sno.claimRaisedBy = claim.claimRaisedBy!=null?this.datepipe.transform(claim.claimRaisedBy, 'dd-MMM-yyyy'):'N/A';
        }
        if (this.eventName=='CPD' || this.eventName=='CRS' || this.eventName=='CRV') {
          this.sno.cpdAllotedDate = claim.cpdAllotedDate!=null?this.datepipe.transform(claim.cpdAllotedDate, 'dd-MMM-yyyy'):'N/A';
        }
        if (this.eventName!='SQW' && this.eventName!='SQA') {
          this.sno.cpdName =  claim.cpdName!=null?claim.cpdName:'N/A';
        }
        this.report.push(this.sno);
      }
      let filter = [];
      filter.push([[this.pageHeading]]);
      filter.push(['']);
      TableUtil.exportListToExcelWithFilter(this.report, "Claim Count Progress Report Details", this.heading, filter);
    } else if (type=='pdf') {
      const doc = new jsPDF('l', 'mm', [280, 455] );
      doc.text("Claim Count Progress Report Details", 14, 20);
      doc.setFontSize(10);

      doc.text(this.pageHeading, 14, 30);
      doc.text("Generated By: "+this.user.fullName+"\tGenerated On: " + formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString(), 14, 40);
            
      doc.setFontSize(12);
      for(var i=0;i<this.countprogressreport.length;i++) {
        claim = this.countprogressreport[i];
        console.log(claim);
        this.sno = [];
        this.sno[0] = (i+1).toString();
        this.sno[1] = claim.claimNo!=null?claim.claimNo:'N/A';
        this.sno[2] = claim.caseno!=null?claim.caseno:'N/A';
        this.sno[3] = claim.urn!=null?claim.urn:'N/A';
        this.sno[4] =claim.HospitalName!=null?claim.HospitalName:'N/A'+'('+claim.hospitalCode+')'!=null?claim.hospitalName+ '('+claim.hospitalCode+')':'N/A';
        this.sno[5] = claim.packagecode!=null?claim.packagecode:'N/A';
        this.sno[6] = claim.packageName!=null?claim.packageName:'N/A';
        this.sno[7] = claim.actDateOfAdm!=null?claim.actDateOfAdm:'N/A';
        this.sno[8] =  claim.actDateOfDschrg!=null?claim.actDateOfDschrg:'N/A';
        if (this.eventName=='SQW' || this.eventName=='SQA') {
          this.sno[9] = claim.queryDate!=null?this.datepipe.transform(claim.queryDate, 'dd-MMM-yyyy'):'N/A'
        } else if (this.eventName=='CQW' || this.eventName=='CQA') {
          this.sno[9] = claim.queryDate!=null?this.datepipe.transform(claim.queryDate, 'dd-MMM-yyyy'):'N/A'
          this.sno[10] =  claim.cpdName!=null?claim.cpdName:'N/A';
        } else if (this.eventName=='NID' || this.eventName=='NON') {
          this.sno[9] = claim.claimRaisedBy!=null?this.datepipe.transform(claim.claimRaisedBy, 'dd-MMM-yyyy'):'N/A';
          this.sno[10] =  claim.cpdName!=null?claim.cpdName:'N/A';
        } else if (this.eventName=='CPD' || this.eventName=='CRS' || this.eventName=='CRV') {
          this.sno[9] = claim.cpdAllotedDate!=null?this.datepipe.transform(claim.cpdAllotedDate, 'dd-MMM-yyyy'):'N/A';
          this.sno[10] =  claim.cpdName!=null?claim.cpdName:'N/A';
        } else {
          this.sno[9] =  claim.cpdName!=null?claim.cpdName:'N/A';
        }
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
      doc.save('Claim Count Progress Report Details');
    }
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
}
