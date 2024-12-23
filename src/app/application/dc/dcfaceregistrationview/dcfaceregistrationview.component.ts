import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { DcCdmomappingService } from '../../Services/dc-cdmomapping.service';
import { TableUtil } from '../../util/TableUtil';

@Component({
  selector: 'app-dcfaceregistrationview',
  templateUrl: './dcfaceregistrationview.component.html',
  styleUrls: ['./dcfaceregistrationview.component.scss']
})
export class DcfaceregistrationviewComponent implements OnInit {
  keyword: any = 'fullName';
  dcUserId:any="";
  user:any;
  dcList:any=[];
  listOfDcData:any=[];
  showPegi:any=false;
  pageElement:any;
  currentPage:any;
  count:any=0;
  txtsearchDate:any;
  dcUserName:any="All";

  constructor(private dcService: DcCdmomappingService,
    private sessionService: SessionStorageService,
    public headerService: HeaderService,
    private route:Router) { }

  ngOnInit(): void {
    this.headerService.setTitle('DC/ADC Face Re-Registration');
    this.user =  this.sessionService.decryptSessionData("user");
    this.onchangegroup(6);
  }

  group:any;
  onchangegroup(groupid:any){
    this.group=groupid;
    this.getuserDetailsbygroup(groupid);
    this.getfacelogdetails();
  }

  selectEvent(item) {
    this.dcUserId = item.userId;
    this.dcUserName = item.fullName;
    this.getfacelogdetails();
  }

  clearEvent() {
    this.dcUserId = '';
    this.dcUserName = 'All';
    this.getfacelogdetails();
  }

  getfacelogdetails(){
    this.dcService.getfacelogdetails(this.dcUserId,this.group).subscribe(
      (response:any) => {
        if(response.status == 200){
          this.listOfDcData=response.data;
          this.count=this.listOfDcData.length;
          this.showPegi=true;
          this.currentPage=1
          this.pageElement=100
        }else{
          this.swal("Error","Something went wrong","error")
        }
      },
      (error) => console.log(error)
    )
  }

  swal(title, text, icon) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  getuserDetailsbygroup(groupid:any) {
    this.dcService.getuserDetailsbygroup(groupid).subscribe(
      (response:any) => {
        this.dcList = response.data;
      },
      (error) => console.log(error)
    )
  }

  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }

  report: any = [];
  sno: any = [];
  heading = [['Sl#', 'DC Name', 'Mobile No', 'Face Registration Date','Allow For Re-Registration','Allowed By']];
  downloadList(no: any) {
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy =  this.user.fullName;
    this.report = [];
    let sna: any;
    for (let i = 0; i < this.listOfDcData.length; i++) {
      sna = this.listOfDcData[i];
      this.sno = [];
      this.sno.push(i + 1);
      this.sno.push(sna.fullname);
      this.sno.push(sna.mobileno);
      this.sno.push(sna.createdon);
      this.sno.push(sna.updatedon);
      this.sno.push(sna.updatedby);
      this.report.push(this.sno);
    }
    if (no == 1) {
      let filter = [];
      filter.push([['Group Type', this.group==6?'DC':'ADC']]);
      filter.push([['User Name', this.dcUserName]]);
      TableUtil.exportListToExcelWithFilter(
        this.report,
        'DC/ADC Face Re-Registration View',
        this.heading, filter
      );
    } else {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      let doc = new jsPDF('p', 'mm', [297, 210]);
      doc.setFontSize(20);
      doc.text("DC/ADC Face Re-Registration View", 50, 15);
      doc.setFontSize(13);
      doc.text('Group Type :- ' + (this.group==6?'DC':'ADC'), 15, 25);
      doc.text('User Name :- ' + this.dcUserName, 15, 33);
      doc.text('GeneratedOn :- ' + generatedOn, 15, 41);
      doc.text('GeneratedBy :- ' + generatedBy, 15, 49);
      autoTable(doc, {
        head: this.heading,
        body: this.report,
        theme: 'grid',
        startY: 54,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 10 },
        }
      });
      doc.save('DC/ADC Face Re-Registration View.pdf');
    }
  }

}
