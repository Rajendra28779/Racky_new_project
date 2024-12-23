import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderService } from '../header.service';
import { OngoingTreatmentReportServiceService } from '../Services/ongoing-treatment-report-service.service';
import { SnocreateserviceService } from '../Services/snocreateservice.service';
import { TableUtil } from '../util/TableUtil';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DatePipe } from '@angular/common';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-ongoingtreatment-hospitalwise-report',
  templateUrl: './ongoingtreatment-hospitalwise-report.component.html',
  styleUrls: ['./ongoingtreatment-hospitalwise-report.component.scss']
})
export class OngoingtreatmentHospitalwiseReportComponent implements OnInit {
  user: any;
  txtsearchDate:any;
  showPegi: boolean;
  record: any;
  currentPage: any;
  pageElement: any;
  stateList:any;
  districtList:any
  selectedItems: any = [];
  List:any=[];
  statecode:any="";
  districtcode:any="";
  totalClaimCount: any;
  username:any;
  constructor(public ongoingtreatmentReportservice: OngoingTreatmentReportServiceService,private snoService: SnocreateserviceService,private route: Router, public formBuilder: FormBuilder,public headerService: HeaderService, private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.currentPage = 1;
    this.pageElement = 10;
    this.headerService.setTitle("Ongoing Treatment Report");
    this.user = this.sessionService.decryptSessionData("user");
    this.getStateList();
    this.timespan=new Date()
this.gethospitalwisereport();
  }
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
}
pageItemChange() {
  this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
}
getStateList() {

  this.snoService.getStateList().subscribe(
    (response) => {
      this.stateList = response;
      console.log(this.stateList);
    },
    (error) => console.log(error)
  )}
  OnChangeState(id) {
    $("#districtId").val("");
    this.selectedItems = [];
    localStorage.setItem("stateCode", id);
    this.snoService.getDistrictListByStateId(id).subscribe(
      (response) => {
        this.districtList = response;
        console.log(response);
      },
      (error) => console.log(error)
    )
  }
  gethospitalwisereport(){
    let userId = this.user.userName;
    // let username = this.username;

 //this.username = $('#').val();
 this.statecode=$('#stateId').val();
 this.districtcode=$('#districtId').val();



    let requestData = {
      userId: this.user.userName,
      username:userId,
      p_statecode:this.statecode,
      p_districtcode:this.districtcode,

    };
    this.sessionService.encryptSessionData('requestData', requestData);
 this.ongoingtreatmentReportservice.getHospitalList(requestData).subscribe(
    (data) => {
      console.log(data);
      this.List = data;
      this.totalClaimCount = this.List.length;
      this.record = this.List.length;
      if (this.record > 0) {
        this.showPegi = true;
      } else {
        this.showPegi = false;
        this.swal('', 'No record found.', 'error');
      }
    },
    (error) => {
      console.log(error);
      this.swal('', 'Something went wrong.', 'error');
    }
  );
}
ResetField() {
  window.location.reload();
}


timespan:any;

report: any = [];
sno: any = {
  Slno: '',
  Hospitalname: '',
  TotalPatient:''

};
heading = [
  [
    'Sl#',
    'Hospital Name',
    'Total No Of Patient'

  ],
];

downloadReport(type) {
  this.report = [];
  let claim: any;
  for (var i = 0; i < this.List.length; i++) {
    claim = this.List[i];
    console.log(claim);
    this.sno = [];
    this.sno.Slno = i + 1;
    this.sno.Hospitalname = claim.totalhospitalname;
    this.sno.TotalPatient=claim.totalpatient;


    this.report.push(this.sno);
    console.log(this.report);
    console.log(this.sno);
  }
  if(type=='xcl') {
    let filter =[];
    // filter.push([['URN Number:- ',this.urn]]);
    filter.push([['State:- ', this.statecode]]);
    filter.push([['District:- ',this.districtcode]]);
    console.log(this.report);

      TableUtil.exportListToExcelWithFilter(
    this.report,

    'Ongoing Treatment Hospital Wise Report',
    this.heading,filter
  );
}
else if(type=='pdf') {
  if(this.report==null || this.report.length==0) {
    this.swal("Info", "No Record Found", "info");
    return;
  }

  var doc = new jsPDF('l', 'mm',[360, 260]);



  //  doc.text('State Name : '+this.statecode,240,10);
  //  doc.text('District Name : '+this.districtcode,10,10);

  doc.text('Generated  By :'+this.user.fullName,10,20);
  doc.text('Generated On :'+this.convertStringToDate1(this.timespan),240,20);
  doc.text("Ongoing Treatment Hospital Wise Report", 160, 30);
  doc.setFontSize(12);
  var rows = [];

  for(var i=0;i<this.report.length;i++) {
    var clm = this.report[i];
    var pdf = [];
    pdf[0] = clm.Slno;
    pdf[1] = clm.Hospitalname;
    pdf[2] = clm.TotalPatient;


    rows.push(pdf);
  }
  console.log(rows);
      autoTable(doc, {
        head: this.heading,
        body: rows,
        theme: 'grid',
        startY: 40,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: {cellWidth: 10},
          1: {cellWidth: 53},
          2: {cellWidth: 53},

        }
      });
      doc.save('Bsky_Ongoing Treatment Hospital Wise Report.pdf');
    }
  }
  convertStringToDate1(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy HH:mm:ss');
    return date;
    }







swal(title: any, text: any, icon: any) {
  Swal.fire({
    icon: icon,
    title: title,
    text: text,
  });
}
}

