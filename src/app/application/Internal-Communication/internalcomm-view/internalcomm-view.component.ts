import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { InternalcommServiceService } from '../../Services/internalcomm-service.service';
import { TableUtil } from '../../util/TableUtil';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-internalcomm-view',
  templateUrl: './internalcomm-view.component.html',
  styleUrls: ['./internalcomm-view.component.scss']
})
export class InternalcommViewComponent implements OnInit {
  user:any
  intcommlist:any=[]
  totalcount:any=0
  txtsearchDate:any
  list:any=[];
showPegi: boolean;
currentPage: any;
pageElement: any;
reqfor:any;
description:any;
token:any;

  constructor(public headerService: HeaderService,private route:Router,public intservice:InternalcommServiceService,private sessionService: SessionStorageService
    ) { }

  ngOnInit(): void {
    this.user =  this.sessionService.decryptSessionData("user");
    this.headerService.setTitle("Internal Communication");
    this.getlist();
  }
  getlist(){
    this.intservice.getintcommlist(this.user.userId).subscribe((data:any)=>{
      console.log(data);
      this.list=data;
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

  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }

  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
    console.log(this.pageElement);

   }

  viewData(item:any){
    this.description=item.description;
    this.token=item.taken;
    this.reqfor=item.reqfor;
  }

  downlordintcommn(docpath:any){
    console.log('file: '+docpath);

        if (docpath != null && docpath != '' && docpath != undefined) {
          let img = this.intservice.downloadFile(docpath);
          window.open(img, '_blank');
        } else {
          // this.swal('Info', 'There Is No File', 'info');
        }

    }

    report: any = [];
  sno: any = {
    Slno: "",
    reqtoken: "",
    reqby: "",
    reqfor: "",
    pendint: "",
    reqrdby: "",
    priority: "",
    create: "",
    prosress: "",
    remars: "",
  };
  heading = [['Sl#', 'Requested Token','Requested By','Requested For','Pending At','Required By','Priority' ,'Create On', 'Progress Status','Remarks']];


  downloadList(no:any){
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy = this.user.fullName;
    this.report = [];
    let sna: any;
    for (var i = 0; i < this.list.length; i++) {
      sna=this.list[i];
      this.sno=[];
      this.sno.Slno=i+1;
      this.sno.reqtoken=sna.taken;
      this.sno.reqby=sna.reqbyname;
      this.sno.reqfor=sna.reqfor;
      this.sno.pendint=sna.towhomename;
      this.sno.reqrdby=sna.reqbydate;
      this.sno.priority=sna.priority;
      this.sno.create=sna.createon;
      this.sno.prosress=sna.progstatus;
      this.sno.remars=sna.remarks;
      this.report.push(this.sno);
    }
    if(no==1){
      let filter =[];
        TableUtil.exportListToExcelWithFilter(
          this.report,
          'Internal Communication Report',
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
      doc.text("Internal Communication Report", 100, 15);
      doc.setFontSize(12);
      doc.text('GeneratedOn :- '+generatedOn,10,23);
      doc.text('GeneratedBy :- '+generatedBy,200,23);
      var rows = [];
            for(var i=0;i<this.report.length;i++) {
              var clm = this.report[i]
              var pdf = [];
              pdf[0] = clm.Slno;
              pdf[1] = clm.reqtoken;
              pdf[2] = clm.reqby;
              pdf[3] = clm.reqfor;
              pdf[4] = clm.pendint;
              pdf[5] = clm.reqrdby;
              pdf[6] = clm.priority;
              pdf[7] = clm.create;
              pdf[8] = clm.prosress;
              pdf[9] = clm.remars;
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
                1: {cellWidth: 30},
                2: {cellWidth: 30},
                3: {cellWidth: 30},
                4: {cellWidth: 30},
                5: {cellWidth: 30},
                6: {cellWidth: 20},
                7: {cellWidth: 30},
                8: {cellWidth: 30},
                9: {cellWidth: 30},
              }
            });
            // alert("hi");
            doc.save('Internal Communication Report.pdf');
    }
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }

}
