import { Component, OnInit } from '@angular/core';
import { UnprocessedclaimService } from '../Services/unprocessedclaim.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/services/jwt.service';
import { environment } from 'src/environments/environment';
import jsPDF from 'jspdf';
import { TableUtil } from '../util/TableUtil';
import { DatePipe, formatDate } from '@angular/common';
import autoTable from 'jspdf-autotable';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-cpdwishospitalwisedetailspage',
  templateUrl: './cpdwishospitalwisedetailspage.component.html',
  styleUrls: ['./cpdwishospitalwisedetailspage.component.scss']
})
export class CpdwishospitalwisedetailspageComponent implements OnInit {
  user1: any
  fromdate: any
  todate: any;
  state: any;
  dist: any;
  hospital: any;
  snoid: any;
  action: any;
  list: any = [];
  data: any;
  listlen: any;
  txtsearchDate: any;
  showPegi: any;
  pageElement: any;
  currentPage: any;
  staten: any
  distn: any
  hospn: any
  snon: any
  userid: any;
  hospitalcode: any
  cpduserid: any
  user: any
  constructor(private unprocessedService: UnprocessedclaimService, public route: Router, private jwtService: JwtService,private sessionService: SessionStorageService,) { }

  ngOnInit(): void {
    this.user1 = JSON.parse(localStorage.getItem("cpdhospitaleise"));
    // this.user = JSON.parse(sessionStorage.getItem("user"));
    this.user = this.sessionService.decryptSessionData("user");
    console.log(this.user1);
    this.fromdate = this.user1.fdate
    this.todate = this.user1.tdate
    this.state = this.user1.state
    this.dist = this.user1.dist
    this.hospital = this.user1.hospital
    this.action = this.user1.action
    this.staten = this.user1.staten
    this.distn = this.user1.distn
    this.hospn = this.user1.hospitaln
    this.hospitalcode = this.user1.hospitalcode
    this.cpduserid = this.user1.cpduserid
    this.data = {
      "fromDate": this.fromdate,
      "toDate": this.todate,
      "stateCode": this.state,
      "districtCode": this.dist,
      "hospitalCode": this.hospital,
      "actionId": this.action,
      "hospitalcodesearch": this.hospitalcode,
      "cpduserId": this.cpduserid,
      "groupid": this.user.groupId
    }
    this.unprocessedService.getcpdwisehospitalwisedetails(this.data).subscribe(
      (response: any) => {
        console.log(response);
        this.list = response;
        this.listlen = this.list.length;
        if (this.listlen > 0) {
          this.currentPage = 1;
          this.pageElement = 100;
          this.showPegi = true;
        } else {
          this.showPegi = false;
          this.swal("Info", "No Record Found", "info");
        }
      });
  }
  report: any = [];
  sno: any = {
    Slno: "",
    cpdName: "",
    alloteddate:"",
    claimNo: "",
    Invoiceno:"",
    URN: "",
    pname:"",
    HospitalName: "",
    ActualDateofAdmission: "",
    ActualDateofDischarge: "",
    PackageCode:"",
    PackageName: "",
  };
  heading = [['Sl#','CPD Name','Alloted Date', 'Claim No.','Invoiceno' , 'URN','Patient Name','Hospital Name', 'Actual Date Of Admission', 'Actual Date Of Discharge', 'Package Code',"Package Name"]];

  downloadReport(no:any){
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    // let generatedBy = JSON.parse(sessionStorage.getItem('user')).fullName;
    let generatedBy = this.sessionService.decryptSessionData("user").fullName;
    this.report = [];
    let claim: any;
    for(var i=0;i<this.list.length;i++) {
      claim = this.list[i];
      this.sno = [];
      this.sno.Slno = i+1;
      this.sno.cpdName =  claim.cpdName!=null?claim.cpdName:'N/A';
      this.sno.alloteddate=this.convertStringToDate(claim.alloteddate);
      this.sno.claimNo = claim.claimNo!=null?claim.claimNo:'N/A';
      this.sno.Invoiceno=claim.invoiceno;
      this.sno.URN = claim.urn!=null?claim.urn:'N/A';
      this.sno.pname=claim.patentname;
      this.sno.HospitalName =claim.hospitalName +' ('+claim.hospitalCode+')';
      this.sno.ActualDateofAdmission = claim.actDateOfAdm!=null?this.convertStringToDate(claim.actDateOfAdm):'N/A';
      this.sno.ActualDateofDischarge =  claim.actDateOfDschrg!=null?claim.actDateOfDschrg:'N/A';
      this.sno.PackageCode =  claim.packagecode;
      this.sno.PackageName =  claim.packageName;
      this.report.push(this.sno);
    }
    if(no==1){
      let filter =[];
    filter.push([['Actual Date Of Discharge From', this.fromdate]]);
      filter.push([['Actual Date Of Discharge To', this.todate]]);
      filter.push([['State', this.staten]]);
      filter.push([['District', this.distn]]);
      filter.push([['Hospital', this.hospn]]);
      filter.push([['CPD Doctor Name', this.sno.cpdName]]);
      if(this.action=='B'){
          filter.push([['Search Type', "Approved"]]);
      }else if(this.action=='D'){
        filter.push([['Search Type', "Queried)"]]);
    }else if(this.action=='C'){
      filter.push([['Search Type', "Rejected)"]]);
    }
      TableUtil.exportListToExcelWithFilter(
        this.report,
        'CPD_Wise_Hospital_Wise_Action_Details',
        this.heading,filter
      );
    }else{
      if(this.report==null || this.report.length==0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('l', 'mm',[325,210 ]);
      doc.text("CPD Wise Hospital Wise Action Details", 130, 10);
      doc.text('Actual Date Of Discharge From :- '+ this.fromdate,8,20);
      doc.text('Actual Date Of Discharge To :- '+ this.todate,180,20);
      doc.text('State Name:- '+ this.staten,8,30);
      doc.text('District name:- '+ this.distn,180,30)
      doc.text('CPD Doctor Name :- '+ this.sno.cpdName,8,40);
      if(this.action=='B'){
        doc.text('Search Type :- '+ "Approved",8,50);
      }else if(this.action=='D'){
        doc.text('Search Type :- '+ "Queried",8,50);
      }else if(this.action=='C'){
        doc.text('Search Type :- '+ "Rejected",8,50);
      }
      doc.text('GeneratedOn :- '+generatedOn,180,40)
      doc.text('GeneratedBy :- '+generatedBy,180,50)
      var rows = [];
          for(var i=0;i<this.report.length;i++) {
            var clm = this.report[i];
            var pdf = [];
            pdf[0] = clm.Slno;
            pdf[1] = clm.cpdName;
            pdf[2] = clm.alloteddate;
            pdf[3] = clm.claimNo;
            pdf[4] = clm.Invoiceno;
            pdf[5] = clm.URN;
            pdf[6] = clm.pname;
            pdf[7] = clm.HospitalName;
            pdf[8] = clm.ActualDateofAdmission;
            pdf[9] = clm.ActualDateofDischarge;
            pdf[10] = clm.PackageCode;
            pdf[11] = clm.PackageName;
            rows.push(pdf);
          }
          autoTable(doc, {
            head: this.heading,
            body: rows,
            theme: 'grid',
            startY: 60,
            headStyles: {
              fillColor: [26, 99, 54]
            },
            columnStyles: {
              0: {cellWidth: 10},
              1: {cellWidth: 20},
              2: {cellWidth: 25},
              3: {cellWidth: 25},
              4: {cellWidth: 20},
              5: {cellWidth: 25},
              6: {cellWidth: 20},
              7: {cellWidth: 40},
              8: {cellWidth: 25},
              9: {cellWidth: 25},
              10: {cellWidth: 25},
              11: {cellWidth: 40},
            }
          });
          doc.save('CPD_Wise_Hospital_Wise_Action_Details.pdf');
    }
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  convertStringToDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy');
    return date;
    }
  details(claim: any, urn: any) {
    localStorage.setItem("claimid", claim)
    let state = {
      Urn: urn
    }
    localStorage.setItem("trackingdetails", JSON.stringify(state));
    localStorage.setItem("token", this.jwtService.getJwtToken())
    this.route.navigate([]).then(result => { window.open(environment.routingUrl + '/trackingdetails'); });
  }
}
