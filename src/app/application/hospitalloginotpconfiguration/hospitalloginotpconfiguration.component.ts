import { Component, OnInit } from '@angular/core';
import { SnocreateserviceService } from '../Services/snocreateservice.service';
import { HeaderService } from '../header.service';
import { Router } from '@angular/router';
import { HospitalService } from '../Services/hospital.service';
import Swal from 'sweetalert2';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { TableUtil } from '../util/TableUtil';
import { DatePipe, formatDate } from '@angular/common';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { SessionStorageService } from 'src/app/services/session-storage.service';


@Component({
  selector: 'app-hospitalloginotpconfiguration',
  templateUrl: './hospitalloginotpconfiguration.component.html',
  styleUrls: ['./hospitalloginotpconfiguration.component.scss']
})
export class HospitalloginotpconfigurationComponent implements OnInit {
  user: any;
  stateList: any=[];
  districtList: any=[];
  txtsearchDate:any;
  txtsearchmodal:any;
  list:any=[];
  showPegi: boolean;
  currentPage: any;
  pageElement: any;
  state:any="";
  dist:any="";
  totalcount:any=0
  statename: any="All";
  distname: any="All";
  checkall: any;
  hospObj:any;
  hospList:any=[];
  showsubmitbutton:any=false;
  list1: any=[];
  logdata: any;
  logdetails: any=[];
  logdetailstotal: any=0;
  hospitalname: any;
  data: any;
  result: any;
  otpreq: any;

  constructor(private snoService: SnocreateserviceService,
    public headerService:HeaderService,private hospitaService: HospitalService,
    public route: Router,private sessionService: SessionStorageService
    ) { }

  ngOnInit(): void {
    this.headerService.setTitle("Hospital Login OTP Configuration");
    this.user = this.sessionService.decryptSessionData("user");
    this.getStateList();
    this.Search();
  }

  getStateList() {
  this.snoService.getStateList().subscribe(
    (response) => {
      this.stateList = response;
    },
    (error) => console.log(error)
  );
  }
  OnChangeState(id) {
    this.snoService.getDistrictListByStateId(id).subscribe(
      (response) => {
        this.districtList = response;
      },
      (error) => console.log(error)
    )
  }

  Search(){
    this.state = $('#stateId').val();
    this.dist = $('#districtId').val();
    this.otpreq=$('#otpreq').val();
    this.hospitaService.hospitallistforloginotpconfigure(this.state, this.dist,this.user.userId,this.otpreq).subscribe((data:any)=>{
      //console.log(data);
      this.list=data.data;
      this.list1=this.list;
      this.checkall=data.checkall;      ;
      this.totalcount=this.list.length;
      if(this.totalcount>0){
        this.showPegi=true
        this.currentPage=1
        this.pageElement=100
      }else{
        this.showPegi=true
      }
    },
    (error) => console.log(error)
    );
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }

  getcurrentdata(item:any){
    this.hospitaService.getbyhId(item).subscribe(
      (result: any) => {
        //console.log(result);
        this.data=result;
        this.result=this.data.hospital
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  getlogdata(item){
    // this.hospitalname=item.hospitalName +"("+item.hospitalCode+")";
    this.hospitaService.getbyhId(item.hospitalId).subscribe(
      (result: any) => {
        //console.log(result);
        this.data=result;
        this.result=this.data.hospital
      },
      (err: any) => {
        console.log(err);
      }
    );
    this.hospitaService.getlogdata(item.hospitalId).subscribe(
      (result: any) => {
        //console.log(result);
        this.logdata=result;
        if(this.logdata.status==200){
          this.logdetails=this.logdata.hospitallog;
          this.logdetailstotal=this.logdetails.length;
          if(this.logdetailstotal>0){
            this.showPegi=true;
            this.currentPage=1;
            this.pageElement=20
          }else{
            this.showPegi=false;
          }
        }
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  selectitem(item:any){
    this.hospObj = {
      hospitalCode: "",
      hospitalid: "",
      status: "",
      createby:this.user.userId
    }
    this.hospObj.hospitalCode=item.hospitalCode
    this.hospObj.hospitalid=item.hospitalId
    this.hospObj.status=item.status==0?1:0
    var stat: boolean = false;
    for (const i of this.hospList) {
      if (i.hospitalCode == this.hospObj.hospitalCode) {
        stat = true;
      }
    }
    if (stat == false) {
      this.hospList.push(this.hospObj);
    }else{
      for (var i = 0; i < this.hospList.length; i++) {
        if (item.hospitalCode == this.hospList[i].hospitalCode) {
          var index = this.hospList.indexOf(this.hospList[i]);
          if (index !== -1) {
            this.hospList.splice(index, 1);
          }
        }
      }
    }
    // console.log(this.hospList);
    if(this.hospList.length==0){
      this.showsubmitbutton=false;
    }else{
      this.showsubmitbutton=true;
    }
    // if(this.hospList.length==this.list.length){
    //   this.checkall=!this.checkall
    // }
  }

  Submit(){
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      text: 'You want to Update!',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Update it!'
    }).then((result) => {
      if (result.isConfirmed) {
          let object={
            hospdetailbean:this.hospList,
          }
          this.hospitaService.submithospitallistforloginotpconfigure(object).subscribe((data:any)=>{
            //console.log(data);
            if(data.status==200){
              this.swal("Success", data.message, 'success');
              this.hospList=[];
              this.showsubmitbutton=false
             this.Search();
            }else{
              this.swal("Error", data.message, 'error');
              $("#reson").focus();
            }
          },
          (error) => console.log(error)
          );
        }
    });
  }

  report: any = [];
  sno: any = {
    Slno: "",
    hospcode: "",
    hospname: "",
    mobileno: "",
    emailid: "",
    potpreq: "",
  };
  heading = [['Sl#', 'Hospital Code','Hospital Name','Hospital MobileNo', 'Hospital emailId','Login OTP Required']];


  downloadList(no:any){
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy = this.user.fullName;
    this.report = [];
    let sna: any;
    for (var i = 0; i < this.list1.length; i++) {
      sna=this.list1[i];
      this.sno=[];
      this.sno.Slno=i+1;
      this.sno.hospcode=sna.hospitalCode;
      this.sno.hospname=sna.hospitalName;
      this.sno.mobileno=sna.mobileNo;
      this.sno.emailid=sna.emailId;
      this.sno.potpreq=sna.status==0?'Yes':'No';
      this.report.push(this.sno);
    }

    for(let j=0; j < this.stateList.length;j++){
      if(this.stateList[j].stateCode==this.state){
        this.statename=this.stateList[j].stateName;
      }
    }
    for(let j=0; j < this.districtList.length;j++){
      if(this.districtList[j].districtcode==this.dist){
        this.distname=this.districtList[j].districtname;
      }
    }

    if(no==1){
      let filter =[];
      filter.push([['State Name', this.statename]]);
        filter.push([['District Name', this.distname]]);
        TableUtil.exportListToExcelWithFilter(
          this.report,
          'Hospital Login OTP Configuration',
          this.heading,filter
        );
    }else{
      if(this.report==null || this.report.length==0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('p', 'mm',[297,210 ]);
      doc.setFontSize(20);
      // doc.text(" ", 5, 5);
      doc.text("Hospital Login OTP Configuration", 60, 15);
      doc.setFontSize(12);
      doc.text('State Name :- '+ this.statename,8,25);
      doc.text('District Name :- '+ this.distname,110,25);
      doc.text('GeneratedOn :- '+generatedOn,8,33);
      doc.text('GeneratedBy :- '+generatedBy,110,33);
            var rows = [];
            for(var i=0;i<this.report.length;i++) {
              var clm = this.report[i];
              var pdf = [];
              pdf[0] = clm.Slno;
              pdf[1] = clm.hospcode;
              pdf[2] = clm.hospname;
              pdf[3] = clm.mobileno;
              pdf[4] = clm.emailid;
              pdf[5] = clm.potpreq;
              rows.push(pdf);
            }
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
                1: {cellWidth: 25},
                2: {cellWidth: 47},
                3: {cellWidth: 30},
                4: {cellWidth: 47},
                5: {cellWidth: 25},
              }
            });
            doc.save('Hospital Login OTP Configuration.pdf');
    }
  }
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }

  allselectitem(){
    this.checkall=!this.checkall;
    let status=this.checkall?0:1;
    for(let i=0;i<this.list.length;i++){
      if(this.list[i].status!=status){
        this.selectitem(this.list[i]);
        this.list[i].status=status;
      }
    }
    //console.log(this.hospList);
  }

  report1: any = [];
  hosp: any = {
    slNo: "",
    otpreq: "",
    updateby: "",
    updateon: ""
  };
  heading1 = [['Sl No', 'Login OTP Required','Updated By','Updated On']];

  convertDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy, hh:mm:ss a');
    return date;
  }

  downloadList1(no:any){
    this.report1 = [];
    let item: any;
    for(var i=0;i<this.logdetails.length;i++) {
      item = this.logdetails[i];
      this.hosp = [];
      this.hosp.slNo = i+1;
      this.hosp.otpreq = item.patientOtpRequired!=1?"Yes":"No";
      this.hosp.updateby=item.createname
      this.hosp.updateon=this.convertDate(item.createdOn);
      this.report1.push(this.hosp);
    }
    if(no==1){
      let filter =[];
      filter.push([['Name :- ',this.result?.hospitalName +" ("+this.result?.hospitalCode+")"]]);
      filter.push([['Catagory :- ',this.data?.categoryName]]);
      filter.push([['Email :- ',this.result?.emailId]]);
      filter.push([['Mobile :- ',this.result?.mobile]]);
      TableUtil.exportListToExcelWithFilter(this.report,this.result?.hospitalName+ ' Log Details', this.heading, filter);
    }else{
      if(this.report1.length==0){
        Swal.fire("Info", "No data found", 'info');
        return;
      }
      let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
      let generatedBy = this.user.fullName;
      var doc = new jsPDF('p', 'mm', [297, 210]);
      doc.setFontSize(16);
      doc.text("Hospital Log Details", 80, 10);
      doc.setFontSize(12);
      doc.text('Name :- '+this.result?.hospitalName +" ("+this.result?.hospitalCode+")",10,18);
      doc.text('Catagory :- '+this.data?.categoryName,130,18);
      doc.text('Email :- '+this.result?.emailId,10,26);
      doc.text('Mobile :- '+this.result?.mobile,130,26);
      doc.text('GeneratedOn :- '+generatedOn,120,34);
      doc.text('GeneratedBy :- '+generatedBy,10,34);
      var rows = [];
      for(var i=0;i<this.report1.length;i++) {
        var clm = this.report1[i];
        var pdf = [];
        pdf[0] = clm.slNo;
        pdf[1] = clm.otpreq;
        pdf[2] = clm.updateby;
        pdf[3] = clm.updateon;
        rows.push(pdf);
      }
      autoTable(doc, {
        head: this.heading1,
        body: rows,
        theme: 'grid',
        startY: 40,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: {cellWidth: 10},
        }
      });
      doc.save('GJAY_'+this.result?.hospitalName+ '_Log_Details.pdf');
    }
  }
}