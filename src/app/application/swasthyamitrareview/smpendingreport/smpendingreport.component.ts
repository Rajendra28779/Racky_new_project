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
  selector: 'app-smpendingreport',
  templateUrl: './smpendingreport.component.html',
  styleUrls: ['./smpendingreport.component.scss']
})
export class SmpendingreportComponent implements OnInit {
  user:any
  public districtList: any = [];
  public stateList: any = [];
  public hospitalList: any = [];
  hospitalCode:any="";
  hospname:any="All";
  placeHolder = "Select Hospital";
  keyword: any = "hospitalName";
  formdate:any;
  todate:any;
  state:any="";
  dist:any="";
  txtsearchDate: any;
  list: any = [];
  showPegi: boolean;
  currentPage: any;
  pageElement: any;
  totalcount: any = 0;
  sum: any = 0;
  sum1: any = 0;
  sum2: any = 0;

  constructor(public swastyaMitraHospitalService: SwastyaMitraHospitalService,
    public route: Router,
   public headerService: HeaderService,
   private snoService: SnocreateserviceService,
   private sessionService: SessionStorageService) { }

 ngOnInit(): void {
   this.headerService.setTitle("SwasthyaMitra Pending Report");
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
    this.hospitalList=[]
    this.onReset();
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
    this.hospitalList=[]
    this.onReset();
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
 }

 onReset() {
   this.hospitalCode = "";
   this.hospname="All"
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
  this.swastyaMitraHospitalService.getsmpendingreport(this.formdate,this.todate,this.state,this.dist,
    this.hospitalCode,this.user.userId).subscribe(
    (response:any) => {
      console.log(response);
      if (response.status == 200) {
        this.list = response.data;
        this.totalcount = this.list.length;
        if (this.totalcount > 0) {
          let sum = 0,sum1 = 0,sum2 = 0;
          for (let i = 0; i < this.list.length; i++) {
            sum += parseInt(this.list[i].totalblock);
            sum1 += parseInt(this.list[i].actiontaken);
            sum2 += parseInt(this.list[i].pending);
          }
          this.sum = sum;
          this.sum1 = sum1;
          this.sum2 = sum2;
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

report: any = [];
  sno: any = [];
  heading = [["Sl#", "State Name", "District Name", "Hospital Name", "Total Blocking", "SM Action Taken","Pending"]];
  downloadList(no:any){
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy =  this.user.fullName;
    for (let i = 0; i < this.list.length; i++) {
      let sna = this.list[i];
      this.sno = [];
      this.sno.push(i + 1);
      this.sno.push(sna.statename);
      this.sno.push(sna.district);
      this.sno.push(sna.hospital);
      this.sno.push(sna.totalblock);
      this.sno.push(sna.actiontaken);
      this.sno.push(sna.pending);
      this.report.push(this.sno);
    }
    this.sno = [];
    this.sno.push("");
      this.sno.push("");
      this.sno.push("");
      this.sno.push("Total");
      this.sno.push(this.sum);
      this.sno.push(this.sum1);
      this.sno.push(this.sum2);
      this.report.push(this.sno);

    let statename="All";
    let distname="All";
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
      filter.push([['State Name', statename]]);
      filter.push([['District Name', statename]]);
      filter.push([['Hospital Name', this.hospname]]);
      TableUtil.exportListToExcelWithFilter(
        this.report,
        'SwasthyaMitra Pending Report',
        this.heading, filter
      );
    } else {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      let doc = new jsPDF('p', 'mm', [297, 210]);
      doc.setFontSize(20);
      doc.text("SwasthyaMitra Pending Report", 60, 15);
      doc.setFontSize(13);
      doc.text('Blocking Date From :- ' + this.formdate +" To :- "+this.todate, 15, 25);
      doc.text('State Name :- ' + statename, 15, 33);
      doc.text('District Name :- ' + distname, 15, 41);
      doc.text('Hospital Name :- ' + this.hospname, 15, 49);
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
      doc.save('SwasthyaMitra_Pending_Report.pdf');
    }
  }
}


