import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';
import { HeaderService } from '../header.service';
import { ConfigurationService } from '../Services/configuration.service';
import { SnocreateserviceService } from '../Services/snocreateservice.service';
import { TableUtil } from '../util/TableUtil';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-hospitalinclusionapprove',
  templateUrl: './hospitalinclusionapprove.component.html',
  styleUrls: ['./hospitalinclusionapprove.component.scss']
})
export class HospitalinclusionapproveComponent implements OnInit {
  user:any;
  list:any=[];
  list1:any=[];
  txtsearchDate:any;
  showPegi: boolean;
  currentPage: any;
  pageElement: any;
  totalcount:any=0;
  totalcount1:any=0;
  showPegi1: boolean;
  currentPage1: any;
  pageElement1: any;
  name:any;
  txtsearch:any

  constructor(public headerService: HeaderService,public config:ConfigurationService,private snoService: SnocreateserviceService,private sessionService: SessionStorageService
    ) { }

  ngOnInit(): void {
    this.headerService.setTitle("CPD Configuration Approve");
    this.user = this.sessionService.decryptSessionData("user");
    this.getappliedlist();
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  getappliedlist(){
    if(this.user.groupId==4){
      this.config.getappliedinclusionlistsna(this.user.userId).subscribe((data:any)=>{
        this.list=data;
        this.totalcount=this.list.length;
        if(this.totalcount>0){
          this.showPegi=true;
          this.currentPage=1;
          this.pageElement=20;
        }else{
          this.showPegi=false;
        }
      } ,
      (error) => console.log(error)
      );
    }else {
      this.config.getappliedinclusionlistadmin().subscribe((data:any)=>{
          this.list=data;
          this.totalcount=this.list.length;
          if(this.totalcount>0){
            this.showPegi=true;
            this.currentPage=1;
            this.pageElement=20;
          }else{
            this.showPegi=false;
          }
      } ,
      (error) => console.log(error)
      );
    }
  }

  getIpAddress() {
    let ip;
    this.snoService.getIpAddress().subscribe((res:any)=>{
      ip = res.ip;
    });
    return ip;
  }

  onaction(item:any){
    let ip=this.getIpAddress();
    Swal.fire({
      title: 'Are you sure?',
      text: "You Want to Approve !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Save it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.config.approveofinclusion(item.hospital?.hospitalCode,item.bskyuserid,this.user.userId,ip).subscribe((data:any)=>{
          if(data.status==200){
            this.swal("Success", data.message, "success");
            this.getappliedlist();
          }else{
            this.swal("Error", data.message, "error");
          }
        },
          (error) => console.log(error)
          );      }
    });
  }

  viewlog(item:any){
    this.list1=[];
    this.name=item.name;
    this.config.getcpdtagginglog(item.bskyuserid).subscribe((data:any)=>{
      this.list1=data;
      this.totalcount1=this.list1.length;
          if(this.totalcount1>0){
            this.showPegi1=true;
            this.currentPage1=1;
            this.pageElement1=10;
          }else{
            this.showPegi1=false;
          }
    } ,
    (error) => console.log(error)
    );
  }

  report: any = [];
  sno: any = {
    Slno: "",
    cpd: "",
    hospname: "",
    hospcode: "",
    state: "",
    dist: "",
    apply:""
  };
  heading = [['Sl#','CPD Name' ,'Hospital Name','Hospital Code','State Name', 'District Name' ,'Applied On']];

  downloadList(no:any){
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy =this.user.fullName;
    this.report = [];
    let sna: any;
    for (var i = 0; i < this.list.length; i++) {
      sna=this.list[i];
      this.sno=[];
      this.sno.Slno=i+1;
      this.sno.cpd=sna.name;
      this.sno.hospname=sna.hospital.hospitalName;
      this.sno.hospcode=sna.hospital.hospitalCode;
      this.sno.state=sna.hospital.districtcode.statecode.stateName;
      this.sno.dist=sna.hospital.districtcode.districtname;
      this.sno.apply=this.convertDate(sna.applieddate);
      this.report.push(this.sno);
    }
    if(no==1){
      let filter =[];
        TableUtil.exportListToExcelWithFilter(
          this.report,
          'Approval for Restriction',
          this.heading,filter
        );
    }else{
      if(this.report==null || this.report.length==0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('l', 'mm',[297,210 ]);
      doc.setFontSize(20);
      // doc.text(" ", 5, 5);
      doc.text("Approval for Restriction", 100, 15);
      doc.setFontSize(13);
      doc.text('GeneratedOn :- '+generatedOn,180,25);
      doc.text('GeneratedBy :- '+generatedBy,15,25);
            var rows = [];
            for(var i=0;i<this.report.length;i++) {
              var clm = this.report[i];
              var pdf = [];
              pdf[0] = clm.Slno;
              pdf[1] = clm.cpd;
              pdf[2] = clm.hospname;
              pdf[3] = clm.hospcode;
              pdf[4] = clm.state;
              pdf[5] = clm.dist;
              pdf[6] =  clm.apply;
              rows.push(pdf);
            }
            autoTable(doc, {
              head: this.heading,
              body: rows,
              theme: 'grid',
              startY: 30,
              headStyles: {
                fillColor: [26, 99, 54]
              },
              columnStyles: {
                0: {cellWidth: 10},
                2: {cellWidth: 80},
              }
            });
            doc.save('Approval for Restriction.pdf');

    }
  }

  convertDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy hh:mm:ss a');
    return date;
  }
   convertDate1(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy');
    return date;
  }


}
