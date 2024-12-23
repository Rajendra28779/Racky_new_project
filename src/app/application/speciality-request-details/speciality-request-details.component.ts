import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../header.service';
import Swal from 'sweetalert2';
import { SnoCLaimDetailsService } from '../Services/sno-claim-details.service';
import { PreauthService } from '../Services/preauth.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-speciality-request-details',
  templateUrl: './speciality-request-details.component.html',
  styleUrls: ['./speciality-request-details.component.scss'],
})
export class SpecialityRequestDetailsComponent implements OnInit {
  constructor(
    public headerService: HeaderService,
    public snoService: SnoCLaimDetailsService,
    public preauthService: PreauthService,
    public route: Router,
    private previousLocation: Location
  ) {}

  ngOnInit(): void {
    this.headerService.setTitle('Specialty Details');
    let requestId = localStorage.getItem('actionData');
    this.getRemarks();
    this.getSpecialtyDetails(requestId);
  }
  requestDetails: any;
  patientHistory: any = [];
  onGoingPatntTrtmt: any = [];
  urnHistory: any = [];
  onGoingUrnTrtmt: any = [];
  actionTakenLog: any = [];
  getSpecialtyDetails(requestId) {
    this.preauthService.getSpecialityRequestDetails(requestId).subscribe(
      (data: any) => {
        let resData = data;
        if (resData.status == 'success') {
          console.log(JSON.parse(resData.data));
          let responseData = JSON.parse(resData.data);
          this.requestDetails = responseData.requestDetails;
          this.patientHistory = responseData.patientHistory;
          this.onGoingPatntTrtmt = responseData.onGoingPatntTrtmt;
          this.urnHistory = responseData.urnHistory;
          this.onGoingUrnTrtmt = responseData.onGoingUrnTrtmt;
          this.actionTakenLog = responseData.actionTakenLog;
        } else {
          this.swal('', 'Something went wrong.', 'error');
        }
      },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      }
    );
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
  allremarks: any = [];
  getRemarks() {
    this.snoService.getRemarks().subscribe(
      (data1: any) => {
        let remarkData = data1;
        this.allremarks = remarkData;
        console.log(this.allremarks);
      },
      (error) => {
        console.log(error);
      }
    );
  }
  maxChars = 500;
  remarks: any;
  myGroup = new FormGroup({
    remarks: new FormControl(),
  });
  isApproved: boolean = false;
  isReject: boolean = false;
  isQuery: boolean = false;
  actionType: any;
  submit(event) {
    this.description = $('#description').val();
    if (
      this.actionRemarkId == 0 ||
      this.actionRemarkId == null ||
      this.actionRemarkId == '' ||
      this.actionRemarkId == undefined
    ) {
      this.swal('', ' Please Select Remark', 'error');
      return;
    }
    if (this.actionRemarkId == 57) {
      if (this.description == '' || this.description == null) {
        this.swal('', 'Description should not be left blank', 'error');
        return;
      }
    }
    if (event.target.id == 'Approve') {
      this.actionType = 1;
    }
    if (event.target.id == 'Reject') {
      this.actionType = 2;
    }
    if (event.target.id == 'Query') {
      this.actionType = 3;
      let queryCount = Number(this.requestDetails.queryCount);
      if (queryCount == 1) {
        this.swal('', 'Query limit exist.', 'info');
        return;
      }
    }
    let requestData = {
      actionType: this.actionType,
      description: this.description,
      actionRemarksId: this.actionRemarkId,
      requestId: this.requestDetails.requestId,
    };
    Swal.fire({
      title: '',
      text: 'Are you sure To ' + event.target.id + '?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        this.preauthService.updateSpecialtyRequest(requestData).subscribe(
          (data: any) => {
            let resData = data;
            console.log(resData);
            if (resData.status == 'success') {
              if (event.target.id == 'Approve') {
                this.swal('Success', resData.data.message, 'success');
              } else if (event.target.id == 'Query') {
                this.swal('Success', resData.data.message, 'info');
              } else if (event.target.id == 'Reject') {
                this.swal('Success', resData.data.message, 'success');
              }
              this.route.navigate(['/application/hosspecialityrequest']);
              localStorage.removeItem('preauthData');
            } else {
              this.swal('', 'Something went wrong.', 'error');
            }
          },
          (error) => {
            console.log(error);
            this.swal('', 'Something went wrong.', 'error');
          }
        );
      }
    });
  }
  keyPress(event) {
    const pattern = /'/;
    const inputChar = String.fromCharCode(event.charCode);
    if (pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  keyword = 'remarks';
  description: any;
  clearEvent() {
    this.actionRemarkId = '';
    this.description = '';
  }
  actionRemarkId: any;
  getId(item) {
    let id = item.id;
    this.actionRemarkId = id;
    this.remarks = item.remarks;
    if (id == 1) {
      this.isQuery = true;
      this.isReject = true;
      this.isApproved = false;
    } else if (id == 58) {
      this.isQuery = true;
      this.isApproved = true;
      this.isReject = false;
    } else {
      this.isApproved = false;
      let queryCount = Number(this.requestDetails.queryCount);
      if (queryCount == 1) {
        this.isQuery = true;
      } else {
        this.isQuery = false;
      }
      this.isReject = false;
    }
  }
  download(pdfName, docDate) {
    let hosCode  = this.requestDetails.hospitalCode;
    let img = this.preauthService.downloadFileBySNA(pdfName, hosCode, docDate);
    window.open(img, '_blank');
  }
  backToPrevious() {
    this.previousLocation.back();
  }
}
