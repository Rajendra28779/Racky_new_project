import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';
import { HeaderService } from '../header.service';
import { ConfigurationService } from '../Services/configuration.service';
import { TableUtil } from '../util/TableUtil';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-hospitalcpdtaggingreport',
  templateUrl: './hospitalcpdtaggingreport.component.html',
  styleUrls: ['./hospitalcpdtaggingreport.component.scss']
})
export class HospitalcpdtaggingreportComponent implements OnInit {
  type:any=0;
  user:any;
  list:any=[];
  txtsearchDate:any;
  showPegi: boolean;
  currentPage: any;
  pageElement: any;
  totalcount:any=0;

  constructor(public headerService: HeaderService,public config:ConfigurationService,private sessionService: SessionStorageService
    ) { }

  ngOnInit(): void {
    this.headerService.setTitle("Status Report");
    this.user = this.sessionService.decryptSessionData("user");
    this.sabmit();
  }

  sabmit(){
    this.type = $('#select').val();
    this.config.getcpdtaggedhospital(this.user.userId,this.type).subscribe((data:any)=>{
      console.log(data);
      this.list=data;
      this.totalcount=this.list.length;
      if(this.totalcount>0){
        this.showPegi=true;
        this.currentPage=1;
        this.pageElement=100;
      }else{
        this.showPegi=false;
      }
    },
    (error) => console.log(error));
  }

  onreset(){
    $('#select').val('1');
    this.sabmit();
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }

  report: any = [];
  sno: any = {
    Slno: "",
    hospname: "",
    hospcode: "",
    state: "",
    dist: "",
    prdfrom:"",
    prdto:""
  };
  heading = [['Sl#', 'Hospital Name','Hospital Code','State Name', 'District Name' ,'Period From','Period To']];
  heading2 = [['Sl#', 'Hospital Name','Hospital Code','State Name', 'District Name' ,'Applied On','Status']];
  heading1 = [['Sl#', 'Hospital Name','Hospital Code','State Name', 'District Name' ,'Period From']];
headings:any=[];
  downloadList(no:any){

    this.headings=[];
    if(this.type==1){
      this.headings=this.heading1
    }else if(this.type==3){
      this.headings=this.heading2
    }else {
      this.headings=this.heading
    }
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy =this.user.fullName;
    this.report = [];
    let sna: any;
    for (var i = 0; i < this.list.length; i++) {
      sna=this.list[i];
      this.sno=[];
      this.sno.Slno=i+1;
      this.sno.hospname=sna.hospitalName;
      this.sno.hospcode=sna.hospitalCode;
      this.sno.state=sna.stateName;
      this.sno.dist=sna.districtName;
      this.sno.prdfrom=sna.createon;
      if(this.type!=1){
        this.sno.prdto=sna.updateon;
      }
      this.report.push(this.sno);
    }
    if(no==1){
      let filter =[];
      if(this.type==1){
        filter.push([['Status', 'Tagged Hospital']]);
      }else if(this.type==2){
        filter.push([['Status', 'Un-Tagged Hospital']]);
      }else if(this.type==3){
        filter.push([['Status :- ','Apply / Removal list of Hospital']]);
      }else{
        filter.push([['Status', 'All']]);
      }
        TableUtil.exportListToExcelWithFilter(
          this.report,
          'CPD Status Report',
          this.headings,filter
        );
    }else{
      if(this.report==null || this.report.length==0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('p', 'mm',[297,210 ]);
      doc.setFontSize(20);
      // doc.text(" ", 5, 5);
      doc.text("CPD Status Report", 80, 15);
      doc.setFontSize(12);
      if(this.type==1){
        doc.text('Status :- '+'Tagged Hospital',8,23);
      }else if(this.type==2){
        doc.text('Status :- '+'Un-Tagged Hospital',8,23);
      }else if(this.type==3){
        doc.text('Status :- '+'Apply / Removal list of Hospital',8,23);
      }else{
        doc.text('Status :- '+'All',8,23);
      }
      doc.text('GeneratedOn :- '+generatedOn,8,33);
      doc.text('GeneratedBy :- '+generatedBy,110,33);
            var rows = [];
            for(var i=0;i<this.report.length;i++) {
              var clm = this.report[i];
              var pdf = [];
              pdf[0] = clm.Slno;
              pdf[1] = clm.hospname;
              pdf[2] = clm.hospcode;
              pdf[3] = clm.state;
              pdf[4] = clm.dist;
              pdf[5] = clm.prdfrom;
              if(this.type!=1){
              pdf[6] = clm.prdto;
              }
              rows.push(pdf);
            }
            autoTable(doc, {
              head: this.headings,
              body: rows,
              theme: 'grid',
              startY: 40,
              headStyles: {
                fillColor: [26, 99, 54]
              },
              columnStyles: {
                0: {cellWidth: 10},
                1: {cellWidth: 50},
                // 2: {cellWidth: 42},
                // 3: {cellWidth: 42},
                // 4: {cellWidth: 42},

              }
            });
            // alert("hi");
            doc.save('CPD Status Report.pdf');

    }
  }

  onaction(item:any){
    Swal.fire({
      title: 'Are you sure?',
      text: "You Want Apply For Exclusion !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Save it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.config.cancel(item.hospitalCode,this.user.userId).subscribe((data:any)=>{
          if(data.status==200){
            this.swal("Success", data.message, "success");
            this.sabmit();
          }else{
            this.swal("Error", data.message, "error");
          }
        },
          (error) => console.log(error)
          );      }
    });
  }

}
