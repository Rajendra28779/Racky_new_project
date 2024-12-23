import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import { SwastyaMitraHospitalService } from '../../Services/swastya-mitra-hospital.service';
import { TableUtil } from '../../util/TableUtil';

@Component({
  selector: 'app-smincentivereport',
  templateUrl: './smincentivereport.component.html',
  styleUrls: ['./smincentivereport.component.scss']
})
export class SmincentivereportComponent implements OnInit {
  user:any
  public districtList: any = [];
  public stateList: any = [];
  public hospitalList: any = [];
  public smList: any = [];
  hospitalCode:any="";
  hospname:any="All";
  placeHolder = "Select Hospital";
  keyword: any = "hospitalName";
  keyword1:any="fullname";
  smaid:any="";
  smname:any="All";
  state:any="";
  dist:any="";
  txtsearchDate: any;
  list: any = [];
  showPegi: boolean;
  currentPage: any;
  pageElement: any;
  totalcount: any = 0;
  selectedYear:any;
  scorelist:any=[];
  years:any=[];
  month:any;

  constructor(public swastyaMitraHospitalService: SwastyaMitraHospitalService,
    public route: Router,
   public headerService: HeaderService,
   private snoService: SnocreateserviceService,
   private sessionService: SessionStorageService) { }

 ngOnInit(): void {
   this.headerService.setTitle("SwasthyaMitra Final Incentive Report");
   this.user = this.sessionService.decryptSessionData("user");
   this.selectedYear = new Date().getFullYear();
   for (let year = this.selectedYear; year >= 2010; year--) {
     this.years.push(year);
   }
   this.month= new Date().getMonth();
   if(this.month==0){
     this.month=12;
     this.selectedYear=this.selectedYear-1;
   };
   this.getStateList();
   this.search();
 }

 getStateList() {
  this.snoService.getStateList().subscribe(
    (response) => {
      this.stateList = response;
    },
    (error) => console.log(error)
  )
}

OnChangeState(id) {
  $("#districtId").val("");
  this.smList=[];
  this.hospitalList=[]
  this.onReset();
  this.onReset1();
  localStorage.setItem("stateCode", id);
  this.snoService.getDistrictListByStateId(id).subscribe(
    (response) => {
      this.districtList = response;
    },
    (error) => console.log(error)
  )
}

OnChangeDistrict(id) {
  this.smList=[];
  this.hospitalList=[]
  this.onReset();
  this.onReset1();
  let stateCode = localStorage.getItem("stateCode");
  this.snoService.getHospitalbyDistrictId(id, stateCode).subscribe(
    (response) => {
      this.hospitalList = response;
    },
    (error) => console.log(error)
  )
}

swal(title: any, text: any, icon: any) {
  Swal.fire({
    icon: icon,
    title: title,
    text: text
  });
}

selectEvent(item) {
  this.hospitalCode = item.hospitalCode;
  this.hospname=item.hospitalName;
  this.smList=[];
  this.onReset1();
  this.getsmlistbyhospital(this.hospitalCode);
}

onReset() {
  this.hospitalCode = "";
  this.hospname="All"
}
selectEvent1(item) {
this.smaid=item.userId;
this.smname=item.fullname;
}

onReset1() {
this.smaid="";
this.smname="All";
}

getsmlistbyhospital(item:any){
  this.swastyaMitraHospitalService.getsmlistbyhospital(item).subscribe(
    (response) => {
      this.smList = response;
    },
    (error) => console.log(error)
  )
}


search() {
  this.state=$('#stateId').val();
    this.dist=$('#districtId').val();
  this.swastyaMitraHospitalService.getsmfinalincenive(this.selectedYear,this.month,this.user.userId,
    this.state,this.dist,this.hospitalCode,this.smaid).subscribe(
    (response:any) => {
      console.log(response);
      if (response.status == 200) {
        this.list = response.data;
        this.totalcount = this.list.length;
        if (this.totalcount > 0) {
          this.showPegi = true
          this.currentPage = 1
          this.pageElement = 100
        } else {
          this.showPegi = false
        }
      } else {
        this.showPegi = false
        this.swal("Error", 'Something Went Wrong', "error");
      }
    });
}

reset(){
  window.location.reload();
}

monthNames:any = ["",
  "January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December"
];
report: any = [];
sno: any = [];
heading = [["Sl#","District Name",
              "Hospital Name",
              "Total Data Received (Footfall) - (104 Data)",
              "Rank Total Claim",
              "Patient Satisfactory Rate (104 Data)",
              "Rank Patient Satisfactory Rate",
              "Correct Phone No. Entry (104 Data)",
              "Rank Correct No. Entry",
              "SM Score Out of 20",
              "Rank DC and Nodal Officer",
              "Final Score",
              "Rate of Incentive Out of Base Remuneration"]];

downloadList(no:any){
  this.report=[];
  let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
  let generatedBy =  this.user.fullName;
  for (let i = 0; i < this.list.length; i++) {
    let sna = this.list[i];
    this.sno = [];
    this.sno.push(i + 1);
    this.sno.push(sna.districtname);
    this.sno.push(sna.hospitalname);
    this.sno.push(sna.datarecived);
    this.sno.push(sna.datarecivedrank);
    this.sno.push(sna.patientsatisfy);
    this.sno.push(sna.rankpatientsatisfy);
    this.sno.push(sna.successcall);
    this.sno.push(sna.ranksuccesscall);
    this.sno.push(sna.overalsmscore);
    this.sno.push(sna.finalsmrank);
    this.sno.push(sna.finalsmscore);
    this.sno.push(sna.finalincentive);
    this.report.push(this.sno);
  }
  let statename="All";
    let distname="All";
    for (const element of this.stateList) {
      if (element.stateCode == this.state) {
        statename = element.stateName;
      }
    }
    for (const element of this.districtList) {
      if (element.districtcode == this.dist) {
        distname = element.districtname;
      }
    }
  if (no == 1) {
    let filter = [];
    filter.push([['Year', this.selectedYear]]);
      filter.push([['Month', this.monthNames[this.month]]]);
      filter.push([['State Name', statename]]);
      filter.push([['District Name', statename]]);
      filter.push([['Hospital Name', this.hospname]]);
      filter.push([['SwasthyaMitra Name', this.smname]]);
    TableUtil.exportListToExcelWithFilter(
      this.report,
      'SwasthyaMitra Final Incentive Report',
      this.heading, filter
    );
  } else {
    if (this.report == null || this.report.length == 0) {
      this.swal("Info", "No Record Found", "info");
      return;
    }
    let doc = new jsPDF('l', 'mm', [297, 210]);
    doc.setFontSize(20);
    doc.text("SwasthyaMitra Final Incentive Report", 80, 15);
    doc.setFontSize(12);
    doc.text('Year :- ' + this.selectedYear , 15, 25);
    doc.text(" Month :- "+this.monthNames[this.month], 200, 25);
      doc.text('State Name :- ' + statename, 200, 33);
      doc.text('District Name :- ' + distname, 200, 41);
      doc.text('Hospital Name :- ' + this.hospname, 15, 33);
      doc.text('SwasthyaMitra Name :- ' + this.smname, 15, 41);
      doc.text('GeneratedOn :- ' + generatedOn, 200, 49);
      doc.text('GeneratedBy :- ' + generatedBy, 15, 49);
    autoTable(doc, {
      head: this.heading,
      body: this.report,
      theme: 'grid',
      startY: 55,
      headStyles: {
        fillColor: [26, 99, 54]
      },
      columnStyles: {
        0: { cellWidth: 10 },
      }
    });
    doc.save('SwasthyaMitra_Final_Incentive_Report.pdf');
  }
}
}

