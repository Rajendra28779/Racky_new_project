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
  selector: 'app-dcfaceregistration',
  templateUrl: './dcfaceregistration.component.html',
  styleUrls: ['./dcfaceregistration.component.scss']
})
export class DcfaceregistrationComponent implements OnInit {
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
  hosplist: any=[];
  cdmolist: any=[];
  refhosplist: any=[];
  dcname: any;
  loglist:any=[];
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
    this.getdcfacelist();
  }

  selectEvent(item) {
    this.dcUserId = item.userId;
    this.dcUserName = item.fullName;
    this.getdcfacelist();
  }

  clearEvent() {
    this.dcUserId = '';
    this.dcUserName = 'All';
    this.getdcfacelist();
  }

  getdcfacelist(){
    this.dcService.getdcfacelist(this.dcUserId,this.group).subscribe(
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

  details(item:any){
    this.dcname=item.fullname;
    this.dcService.getdctaggeddetails(item.dcId).subscribe((data:any)=>{
      if(data.status==200){
        this.hosplist=data.hosplist;
        this.cdmolist=data.cdmolist;
        this.refhosplist=data.refhosplist;
      }else{
        this.swal("Error", "Something Went Wrong", 'error');
      }
    });
  }

  log(item:any){
    this.dcname=item.fullname;
    this.dcService.getfacelogdetails(item.dcId,this.group).subscribe((data:any)=>{
      if(data.status==200){
        this.loglist=data.data;
      }else{
        this.swal("Error", "Something Went Wrong", 'error');
      }
    });
  }

  onaction(item:any){
    Swal.fire({
      title: 'Are You Sure?',
      text: "You Want to Allow This User To Re-Register Their Face Again !",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Allow It!'
    }).then((result) => {
      if (result.isConfirmed) {
          this.dcService.removefacedataofdc(item.faceid,this.user.userId).subscribe((data:any)=>{
            if(data.status==200){
              this.swal("Success", "Successfully Allowed For Re-Registration", 'success');
              this.getdcfacelist();
            }else{
              this.swal("Error", "Something Went Wrong", 'error');
            }
          });
      }
    });
  }

  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }

  report: any = [];
  sno: any = [];
  heading = [['Sl#', 'DC Name', 'Mobile No', 'Face Registration Date']];
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
      this.sno.push(sna.rgistration);
      this.report.push(this.sno);
    }
    if (no == 1) {
      let filter = [];
      filter.push([['Group Type', this.group==6?'DC':'ADC']]);
      filter.push([['User Name', this.dcUserName]]);
      TableUtil.exportListToExcelWithFilter(
        this.report,
        'DC/ADC Face Re-Registration',
        this.heading, filter
      );
    } else {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      let doc = new jsPDF('p', 'mm', [297, 210]);
      doc.setFontSize(20);
      doc.text("DC/ADC Face Re-Registration", 50, 15);
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
      doc.save('DC/ADC Face Re-Registration.pdf');
    }
  }

}
