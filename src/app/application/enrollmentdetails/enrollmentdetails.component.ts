import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../header.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DcClaimService } from '../Services/dc-claim.service';
import { SnoCLaimDetailsService } from '../Services/sno-claim-details.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-enrollmentdetails',
  templateUrl: './enrollmentdetails.component.html',
  styleUrls: ['./enrollmentdetails.component.scss']
})
export class EnrollmentdetailsComponent implements OnInit {
  childmessage: any;
  enrollmentdata: any
  detailsdata: any = [];
  details: any = [];
  enrollmentdetials: any = [];
  description: string = '';
  maxChars = 1000;
  allremarks: any;
  actionRemarkId: any;
  keyword = 'remarks';
  actiontakenhidestatus: boolean;
  title: string;
  isApproved: boolean = false;
  isQuery: boolean = false;
  isReject: boolean = false;
  viewonly: boolean = true;
  constructor(private headerService: HeaderService, public router: Router, private http: HttpClient, private dsService: DcClaimService, public snoService: SnoCLaimDetailsService,) { }
  ngOnInit(): void {
    this.enrollmentdata = JSON.parse(localStorage.getItem("enrollmnent"));
    this.headerService.setTitle('Hospital Enrollment List');
    this.headerService.isIndicate(true);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.headerService.isBack(false);
    if(this.enrollmentdata.flag=='viewonly'){
      this.viewonly=false;
    }else{
      this.viewonly=true;
    }
    this.getRemarks();
    this.getdetailslist();
  }
  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }
  getRemarks() {
    this.snoService.getEnrollmentRemarks().subscribe(
      (data1: any) => {
        let remarkData = data1;
        this.allremarks = remarkData;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  getId(item) {
    let id = item.id;
    this.actionRemarkId = id;
    if (id == 1) {
      this.isApproved = false;
      this.isQuery = true;
      this.isReject = true;
    } else if (id == 5) {
      this.isApproved = true;
      this.isQuery = true;
      this.isReject = false;
    } else if (id == 2 ||id == 3 ||id == 4) {
      this.isApproved = true;
      this.isQuery = false;
      this.isReject = true;
    } else {
      this.isApproved = false;
      this.isQuery = false;
      this.isReject = false;
    }
    if (this.description.length === 0) {
      this.description = this.toProperCase(item.remarks);
    } else {
      this.description = this.description + ', ' + this.toProperCase(item.remarks);
    }
  }
  toProperCase(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  };
  clearEvent() {
    this.actionRemarkId = '';
  }
  getdetailslist() {
    let fromdate = this.enrollmentdata.fromdate;
    let todate = this.enrollmentdata.todate;
    let userid = this.enrollmentdata.userid;
    let depregid = this.enrollmentdata.depregid;
    let acknowledgementnumber = this.enrollmentdata.acknowledgementnumber;
    this.dsService.getdetailslist(fromdate, todate, userid, depregid, acknowledgementnumber).subscribe((data: any) => {
      let response = data;
      this.details = JSON.parse(response.details);
      if (response.status == 'success') {
        this.enrollmentdetials = this.details
        console.log(this.enrollmentdetials)
        if (this.enrollmentdata.flag != undefined && this.enrollmentdata.flag != null && this.enrollmentdata.flag != '') {
          this.actiontakenhidestatus = true;
        } else {
          this.actiontakenhidestatus = false;
        }
        this.getactiontakenhistory();
        fromdate = '';
        todate = '';
        userid = '';
        depregid = '';
        acknowledgementnumber = '';
        localStorage.removeItem("enrollmnent");
      } else {
        this.enrollmentdetials = [];
        this.enrollmentdata = '';
        fromdate = '';
        todate = '';
        userid = '';
        depregid = '';
        acknowledgementnumber = '';
        localStorage.removeItem("enrollmnent");
      }
    }
    );
  }
  dateconvert(date: any) {
    var datePipe = new DatePipe('en-US');
    return datePipe.transform(date, 'dd-MMM-yyyy');
  }
  getdate: any;
  downloadactionforenrollment(event: any, fileName: any, hCode: any, regddate: any, statecode: any, districtcode: any, blockcode: any) {
    console.log("hi" + fileName)
    console.log("hcode" + hCode)
    console.log("year" + regddate)
    console.log("statecode" + statecode)
    console.log("districtcode" + districtcode)
    console.log("blockcode" + blockcode)
    let target = event.target;
    if (
      target.nodeName == 'A' ||
      target.nodeName == 'a' ||
      target.nodeName == 'IMG' ||
      target.nodeName == 'img' ||
      target.nodeName == 'I' ||
      target.nodeName == 'i'
    ) {
      target = $(target);
      let anchor = target.parent();
      anchor = anchor.get(0);

      if (fileName != null) {
        this.snoService.downloadFilesenrollment(fileName, hCode, regddate, statecode, districtcode, blockcode).subscribe(
          (response: any) => {
            var result = response;
            let blob = new Blob([result], { type: result.type });
            let url = window.URL.createObjectURL(blob);
            window.open(url);
          },
          (error) => {
            console.log(error);
          }
        );
      }
    }
  }

  keyPress(event: KeyboardEvent) {
    const pattern = /'/;
    const inputChar = String.fromCharCode(event.charCode);
    if (pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
  remarks: any
  getapproval(acknowledgementno: any, enrregid: any, type: any) {
    let depregid = this.enrollmentdata.depregid;
    let userid = this.enrollmentdata.userid;
    this.remarks = $('#remarks').val();
    if (this.actionRemarkId == 0 || this.actionRemarkId == null || this.actionRemarkId == '' || this.actionRemarkId == undefined) {
      this.swal('Error', ' Please Select Remark', 'error');
      return;
    } else if (this.remarks == null || this.remarks == '' || this.remarks == undefined) {
      this.swal('Error', 'Description should not be left blank', 'error');
      return;
    }
    let data = {
      "acknowledgementno": acknowledgementno,
      "enrregid": enrregid,
      "depregid": depregid,
      "userid": userid,
      "type": type,
      "remarks": this.remarks,
      "actionRemarkId": this.actionRemarkId
    }
    if (type == 'A') {
      this.title = "Are You Sure Want To Approve?";
    } else if (type == 'B') {
      this.title = "Are You Sure Want To Reject?";
    } else if (type == 'C') {
      this.title = "Are You Sure Want To Query?";
    }
    Swal.fire({
      title: this.title,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        this.dsService.getAction(data).subscribe((data: any) => {
          let response = data;
          console.log(response);
          if (response.status == 'Success') {
            if (this.enrollmentdata.flag != undefined && this.enrollmentdata.flag != null && this.enrollmentdata.flag != '') {
              if (this.enrollmentdata.flag == 'recomply') {
                if (type == 'A') {
                  this.swal('success', 'Record Approved Successfully', 'success');
                  this.router.navigate(['/application/recomplyenrollmentlist']);
                  this.enrollmentdata.flag = '';
                } else if (type == 'B') {
                  this.swal('Info', 'Record Rejected Successfully', 'info');
                  this.router.navigate(['/application/recomplyenrollmentlist']);
                  this.enrollmentdata.flag = '';
                } else if (type == 'C') {
                  this.swal('Info', 'Record Queried Successfully', 'info');
                  this.router.navigate(['/application/recomplyenrollmentlist']);
                  this.enrollmentdata.flag = '';
                }
              } else {
                this.swal('Error', 'Smothing Went Wrong', 'error');
              }
            } else {
              if (type == 'A') {
                this.swal('Success', 'Record Approved Successfully', 'success');
                this.router.navigate(['/application/hospitalenrollmentlist']);
              } else if (type == 'B') {
                this.swal('Info', 'Record Rejected Successfully', 'info');
                this.router.navigate(['/application/hospitalenrollmentlist']);
              } else if (type == 'C') {
                this.swal('Info', 'Record Queried Successfully', 'info');
                this.router.navigate(['/application/hospitalenrollmentlist']);
              }
            }
          }
          else {
            this.swal('Error', 'Smothing Went Wrong', 'error');
          }
        }
        );
      }
    }
    );
  }
  actiontaken: any = [];
  recorrdata: any;
  getactiontakenhistory() {
    let enggid = this.enrollmentdetials[0].enrregid;
    let acknowledgementno = this.enrollmentdetials[0].acknowledgementno;
    this.dsService.getactiontakenhistory(enggid, acknowledgementno).subscribe((data: any) => {
      let response = data;
      this.actiontaken = response
      console.log(this.actiontaken)
      this.recorrdata = this.actiontaken.length;
    }
    );
  }
}
