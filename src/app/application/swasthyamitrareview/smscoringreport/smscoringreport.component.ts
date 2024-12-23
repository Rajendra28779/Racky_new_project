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
declare let $: any;


@Component({
  selector: 'app-smscoringreport',
  templateUrl: './smscoringreport.component.html',
  styleUrls: ['./smscoringreport.component.scss']
})
export class SmscoringreportComponent implements OnInit {
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
   this.headerService.setTitle("SwasthyaMitra Scoring Report");
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
  this.swastyaMitraHospitalService.getsmscoringreport(this.selectedYear,this.month,this.user.userId,
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
heading = [["Sl#", "SM Name", "Contact No", "No Of Duty Days", "No Of Present Days",
"Score of Concerned District Coordinator (Out of 50)", "Score of Concerned Nodal Officer (Out of 50)",
"SNA Ranking Out of 10", "DC Ranking Out of 10", "Overall Score out of 20", "Rank DC and Nodal officer"]];
downloadList(no:any){
  this.report=[];
  let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
  let generatedBy =  this.user.fullName;
  for (let i = 0; i < this.list.length; i++) {
    let sna = this.list[i];
    this.sno = [];
    this.sno.push(i + 1);
    this.sno.push(sna.smname);
    this.sno.push(sna.cnctno);
    this.sno.push(sna.noofdutydays);
    this.sno.push(sna.noofpresentdays);
    this.sno.push(sna.snascore);
    this.sno.push(sna.dcscore);
    this.sno.push(sna.snarank);
    this.sno.push(sna.dcrank);
    this.sno.push(sna.overalscore);
    this.sno.push(sna.finalrank);
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
      'SwasthyaMitra Scoring Report',
      this.heading, filter
    );
  } else {
    if (this.report == null || this.report.length == 0) {
      this.swal("Info", "No Record Found", "info");
      return;
    }
    let doc = new jsPDF('l', 'mm', [297, 210]);
    doc.setFontSize(20);
    doc.text("SwasthyaMitra Scoring Report", 80, 15);
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
    doc.save('SwasthyaMitra_Scoring_Report.pdf');
  }
}
}

