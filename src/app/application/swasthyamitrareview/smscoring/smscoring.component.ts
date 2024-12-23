import { formatDate } from '@angular/common';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
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
  selector: 'app-smscoring',
  templateUrl: './smscoring.component.html',
  styleUrls: ['./smscoring.component.scss']
})
export class SmscoringComponent implements OnInit {
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
  smdetails:any;
  smhosplist:any=[];
  maxChars:any=500;

  constructor(public swastyaMitraHospitalService: SwastyaMitraHospitalService,
     public route: Router,
    public headerService: HeaderService,
    private snoService: SnocreateserviceService,
    private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle("SwasthyaMitra Scoring");
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

    for (let no = 1; no <=50; no++) {
      this.scorelist.push(no);
    }
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

  keyPress(event: KeyboardEvent) {
    const pattern = /^[A-Za-z0-9.,-_ \\s]+$/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  search() {
    let year=new Date().getFullYear();
    let month=new Date().getMonth();
    if(this.selectedYear>year){
      this.swal("Warning", 'You Cannot Search For Current Month Or Future Month !!', "info");
      return;
    }else if(this.selectedYear==year){
      if(this.month>month){
        this.swal("Warning", 'You Cannot Search For Current Month Or Future Month !!', "info");
        return;
      }
    }
    this.state=$('#stateId').val();
    this.dist=$('#districtId').val();
    this.swastyaMitraHospitalService.getsmlistforscoring(this.selectedYear,this.month,this.state,this.dist,
      this.hospitalCode,this.smaid,this.user.userId).subscribe(
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

  onaction(item: any) {
    this.swastyaMitraHospitalService.getsmdetailsforscoring(item,this.selectedYear,this.month).subscribe((data: any) => {
      if(data.status==200){
        this.smdetails = data;
        this.smhosplist = this.smdetails.hospital;
        $('#swasmodal').show();
      }else {
        this.swal("Error", "Something went Wrong", "error")
      }
    }, (error) => console.log(error)
    );
  }

  closemodal() {
    $('#swasmodal').hide();
  }

  monthNames:any = ["",
  "January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December"
];
  report: any = [];
  sno: any = [];
  heading = [["Sl#", "SM Name", "Contact No", "Email Id", "Registration Date"]];
  downloadList(no:any){
    this.report=[];
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy =  this.user.fullName;
    for (let i = 0; i < this.list.length; i++) {
      let sna = this.list[i];
      this.sno = [];
      this.sno.push(i + 1);
      this.sno.push(sna.fullname);
      this.sno.push(sna.phoneNO);
      this.sno.push(sna.email);
      this.sno.push(sna.dateofjoin);
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
        'SwasthyaMitra Scoring',
        this.heading, filter
      );
    } else {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      let doc = new jsPDF('p', 'mm', [297, 210]);
      doc.setFontSize(24);
      doc.text("SwasthyaMitra Scoring", 60, 15);
      doc.setFontSize(16);
      doc.text('Year :- ' + this.selectedYear +" Month :- "+this.monthNames[this.month], 15, 25);
      doc.text('State Name :- ' + statename, 15, 33);
      doc.text('District Name :- ' + distname, 290, 41);
      doc.text('Hospital Name :- ' + this.hospname, 15, 49);
      doc.text('SwasthyaMitra Name :- ' + this.smname, 290, 57);
      doc.text('GeneratedOn :- ' + generatedOn, 290, 65);
      doc.text('GeneratedBy :- ' + generatedBy, 15, 73);
      autoTable(doc, {
        head: this.heading,
        body: this.report,
        theme: 'grid',
        startY: 80,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 10 },
        }
      });
      doc.save('SwasthyaMitra_Scoring.pdf');
    }
  }

  submit(userid:any){
    let remark =$('#remark').val().trim();
    let score =$('#score').val();
    if(remark ==""||remark==null||remark==undefined){
      this.swal("Error", "Please Enter Remark", "error");
      return;
    }
    if(score==null||score==undefined||score==""){
      this.swal("Error", "Please Enter Score", "error");
      return;
    }
    this.swastyaMitraHospitalService.submitsmscore(this.selectedYear,this.month,userid,remark,score,this.user.userId).subscribe((data: any) => {
        if(data.status==200){
          this.swal("Success", data.message, "success");
          $('#remark').val('')
           $('#score').val('');
           this.closemodal();
           this.search();
        }else if(data.status==201){
          this.swal("Warning", data.message, "warning");
          $('#remark').val('')
           $('#score').val('');
           this.closemodal();
           this.search();
        }else{
          this.swal("Error", "Something Went Wrong!!", "error");
        }
    });
  }
}
