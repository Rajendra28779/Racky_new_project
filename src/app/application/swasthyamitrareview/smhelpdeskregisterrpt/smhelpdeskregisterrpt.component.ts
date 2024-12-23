import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { log } from 'console';
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
  selector: 'app-smhelpdeskregisterrpt',
  templateUrl: './smhelpdeskregisterrpt.component.html',
  styleUrls: ['./smhelpdeskregisterrpt.component.scss']
})
export class SmhelpdeskregisterrptComponent implements OnInit {
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
  formdate:any;
  todate:any;
  state:any="";
  dist:any="";
  status: any=0;
  txtsearchDate: any;
  list: any = [];
  showPegi: boolean;
  currentPage: any;
  pageElement: any;
  totalcount: any = 0;

  constructor(public swastyaMitraHospitalService: SwastyaMitraHospitalService,
     public route: Router,
    public headerService: HeaderService,
    private snoService: SnocreateserviceService,
    private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle("SwasthyaMitra Helpdesk Registration");
    this.user = this.sessionService.decryptSessionData("user");
    $('.selectpicker').selectpicker();
    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
      maxDate: new Date(),
      daysOfWeekDisabled: ['', 7],
    });
    $('.timepicker').datetimepicker({
      format: 'LT',
      daysOfWeekDisabled: ['', 7],
    });
    $('.datetimepicker').datetimepicker({
      format: 'DD-MMM-YYYY LT',
      daysOfWeekDisabled: ['', 7],
    });
    $('input[name="fromDate"]').attr("placeholder", "From Date *");

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
    this.smList=[];
    this.hospitalList=[]
    this.onReset();
    this.onReset1();
    $("#districtId").val("");
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
    this.formdate=$('#datepicker1').val();
    this.todate=$('#datepicker2').val();
    this.state=$('#stateId').val();
    this.dist=$('#districtId').val();
    if (Date.parse(this.formdate) > Date.parse(this.todate)) {
      this.swal('', ' From Date should be less than To Date', 'error');
      return;
    }
    this.swastyaMitraHospitalService.getsmhelpdeskregister(this.formdate,this.todate,this.state,this.dist,
      this.hospitalCode,this.smaid,this.status,this.user.userId).subscribe(
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

  downloaddocument(docpath:any,hospitalcode:any){
    if (docpath != null && docpath != '' && docpath != undefined) {
      let img = this.swastyaMitraHospitalService.downloadsmreviewdoc(docpath,hospitalcode);
      window.open(img, '_blank');
    } else {
      this.swal('Info', 'There Is No File', 'info');
    }
  }

  report: any = [];
  sno: any = [];
  heading1 = [["Sl#", "Entry By", "Status", "URN", "Patient Name", "Date Of Action",
  "Blocking Date", "Hospital Name", "Patient Address", "Phone No", "Whether referred or not",
  "OOPE at preblock", "OOPE after block","Admission Review Remark"]];

  heading2 = [["Sl#", "Entry By", "Status", "URN", "Patient Name", "Date Of Action",
  "Blocking Date", "Hospital Name", "Patient Address", "Phone No", "Whether referred or not",
  "OOPE at preblock", "OOPE after block","Admission Review Remark","Date of discharge", "Receive Transaction Slip or Not",
  "Death", "OOPE During Treatment", "OOPE During Discharged", "Other Grievance","Discharge Review Remark"]];

  heading:any=[];
  downloadList(no:any){
    this.report=[];
    this.heading=[];
    if(this.status==0){
      this.heading=this.heading1;
    }else{
      this.heading=this.heading2;
    }
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy =  this.user.fullName;
    for (let i = 0; i < this.list.length; i++) {
      let sna = this.list[i];
      this.sno = [];
      this.sno.push(i + 1);
      this.sno.push(sna.enterBy);
      this.sno.push(sna.status);
      this.sno.push(sna.urn);
      this.sno.push(sna.patientName);
      this.sno.push(sna.actionon);
      this.sno.push(sna.blockingDate);
      this.sno.push(sna.hospitalName);
      this.sno.push(sna.address);
      this.sno.push(sna.phoneNo);
      this.sno.push(sna.refferornot);
      this.sno.push(sna.oopeatpreblock);
      this.sno.push(sna.oopeatblock);
      this.sno.push(sna.admissionremark);
      if(this.status==1){
      this.sno.push(sna.dischargedate);
      this.sno.push(sna.sliprecieved);
      this.sno.push(sna.death);
      this.sno.push(sna.oopeduringtreatment);
      this.sno.push(sna.oopeduringdischarge);
      this.sno.push(sna.othergrievance);
      this.sno.push(sna.dischargeremark);
      }
      this.report.push(this.sno);
    }
    let statename="All";
    let distname="All";
    let status=this.status==0?"On Going":"Discharged";
    for (let j = 0; j < this.stateList.length; j++) {
      if (this.stateList[j].stateCode == this.state) {
        statename = this.stateList[j].stateName;
      }
    }
    for (let j = 0; j < this.districtList.length; j++) {
      if (this.districtList[j].districtcode == this.dist) {
        distname = this.districtList[j].districtname;
      }
    }
    if (no == 1) {
      let filter = [];
      filter.push([['Blocking Date From', this.formdate]]);
      filter.push([['Blocking Date To', this.todate]]);
      filter.push([['Status', status]]);
      filter.push([['State Name', statename]]);
      filter.push([['District Name', statename]]);
      filter.push([['Hospital Name', this.hospname]]);
      filter.push([['SwasthyaMitra Name', this.smname]]);
      TableUtil.exportListToExcelWithFilter(
        this.report,
        'SwasthyaMitra Helpdesk Registration',
        this.heading, filter
      );
    } else {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      let doc = new jsPDF('l', 'mm', [495, 350]);
      doc.setFontSize(24);
      doc.text("SwasthyaMitra Helpdesk Registration", 170, 15);
      doc.setFontSize(16);
      doc.text('Blocking Date From :- ' + this.formdate +" To :- "+this.todate, 15, 25);
      doc.text('Status :- ' + status, 290, 25);
      doc.text('State Name :- ' + statename, 15, 33);
      doc.text('District Name :- ' + distname, 290, 33);
      doc.text('Hospital Name :- ' + this.hospname, 15, 41);
      doc.text('SwasthyaMitra Name :- ' + this.smname, 290, 41);
      doc.text('GeneratedOn :- ' + generatedOn, 290, 49);
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
      doc.save('SwasthyaMitra_Helpdesk_Registration.pdf');
    }
  }
}
