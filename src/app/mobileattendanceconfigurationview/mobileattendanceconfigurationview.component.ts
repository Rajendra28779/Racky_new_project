import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';
import { HeaderService } from '../application/header.service';
import { AdminconsoleService } from '../application/Services/adminconsole.service';
import { DcCdmomappingService } from '../application/Services/dc-cdmomapping.service';
import { TableUtil } from '../application/util/TableUtil';
import { EncryptionService } from '../services/encryption.service';
import { SessionStorageService } from '../services/session-storage.service';

@Component({
  selector: 'app-mobileattendanceconfigurationview',
  templateUrl: './mobileattendanceconfigurationview.component.html',
  styleUrls: ['./mobileattendanceconfigurationview.component.scss']
})
export class MobileattendanceconfigurationviewComponent implements OnInit {
  user:any;
  groupList:any;
  userlist:any=[];
  userId:any='';
  fullname:any='All';
  keyword: any = 'fullName';
  txtsearchDate: any;
  list: any = [];
  showPegi: boolean;
  currentPage: any;
  pageElement: any;
  totalcount:any=0;

  constructor(private route: Router,
    public headerService: HeaderService,
    private adminService: AdminconsoleService,
    private encryptionService: EncryptionService,
    private sessionService: SessionStorageService,
    private dcService: DcCdmomappingService) { }

  ngOnInit(): void {
    this.user = this.sessionService.decryptSessionData("user");
    this.headerService.setTitle('User Mobile Attendance Configuration');
    this.getGroupList();
    this.search();
  }

  getGroupList() {
    this.adminService.getGroupList().subscribe(
      (response: any) => {
        response = this.encryptionService.getDecryptedData(response);
        this.groupList = response.data;
      },
      (error) => console.log(error)
    );
  }

  getuserDetailsbygroup(groupid:any) {
    this.clearEvent();
    this.dcService.getuserDetailsbygroup(groupid).subscribe(
      (response:any) => {
        this.userlist = response.data;
      },
      (error) => console.log(error)
    )
  }

  selectEvent(item) {
    this.userId = item.userId;
    this.fullname=item.fullName;
    this.search();
  }

  clearEvent() {
    this.userId = '';
    this.fullname='All';
    this.search();
  }

  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  search(){
    this.dcService.getusermobileconfiglist(this.userId).subscribe((data:any)=>{
      if(data.status==200){
        this.list = data.data;
        this.totalcount=this.list.length;
        if(this.totalcount>0){
          this.showPegi = true;
          this.currentPage=1;
          this.pageElement = 100;
        } else {
          this.showPegi = false;
        }
      }else{
        this.swal("Error","Something Went Wrong","error");
      }
    });
  }

  report: any = [];
  sno: any = [];
  heading = [['Sl#', 'Full Name', 'Group Name', 'Allow For Attendance', 'Tagged By', 'Tagged On']];
  downloadList(no: any) {
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy =  this.user.fullName;
    this.report = [];
    let sna: any;
    for (let i = 0; i < this.list.length; i++) {
      sna = this.list[i];
      this.sno = [];
      this.sno.push(i + 1);
      this.sno.push(sna.fullName);
      this.sno.push(sna.groupName);
      this.sno.push(sna.attendanceLocation);
      this.sno.push(sna.taggedBy);
      this.sno.push(sna.taggedOn);
      this.report.push(this.sno);
    }
    if (no == 1) {
      let filter = [];
      filter.push([['User Name', this.fullname]]);
      TableUtil.exportListToExcelWithFilter(
        this.report,
        'Mobile Attendance Configuration List',
        this.heading, filter
      );
    } else {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('p', 'mm', [297, 210]);
      doc.setFontSize(18);
      doc.text("Mobile Attendance Configuration List", 55, 15);
      doc.setFontSize(12);
      doc.text('UserName :- ' + this.fullname, 15, 22);
      doc.text('GeneratedOn :- ' + generatedOn, 15, 29);
      doc.text('GeneratedBy :- ' + generatedBy, 15, 36);
      autoTable(doc, {
        head: this.heading,
        body: this.report,
        theme: 'grid',
        startY: 41,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 10 },
        }
      });
      doc.save('Mobile_Attendance_configuration_List.pdf');
    }
  }

}
