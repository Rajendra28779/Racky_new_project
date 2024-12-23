import { Component, OnInit } from '@angular/core';
import { ReferalService } from '../application/Services/referal.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { SessionStorageService } from '../services/session-storage.service';

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.scss']
})
export class PatientDetailsComponent implements OnInit {
  approveForm: FormGroup;
  maxChars = 500;
  patientDtls: any;
  referralCode: string;
  item: any = [];
  vitalValue: any;
  isTextVisible: boolean;
  isButtonVisible: boolean;
  user: any;
  showVital:boolean;
  dataNotAvailable:any;
  viewStatus:boolean;
  constructor(private referalService: ReferalService, public fb: FormBuilder, public route: Router,
    private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.patientDtls = JSON.parse(localStorage.getItem("patientdetails"));
    this.user = this.sessionService.decryptSessionData("user");
    console.log("data about trackingg" + JSON.stringify(this.patientDtls));
    console.log(this.patientDtls);
    this.getPatientDataByID();
    this.approveForm = this.fb.group({
      refId: new FormControl(''),
      remarks: new FormControl(''),
      action: new FormControl(''),
      userId: new FormControl('')
    })

  }
  getPatientDataByID() {
    var id = this.patientDtls.id;
    this.referalService.getPatientDataByID(id).subscribe((data: any) => {
      this.item = data[0];
      console.log(data)
      console.log(this.item)
      this.vitalValue = data[0].vitalParam
      for(var i=0;i<data[0].vitalParam.length;i++){
        if(data[0].vitalParam[i].value==null){
          this.showVital=false
          this.dataNotAvailable='No data found'
        }
        else{
          this.showVital=true
        }
      }
      if (data[0].referredThrough == 'AD') {
        this.isButtonVisible = false;
        this.isTextVisible = false;
      }
       if (data[0].referredThrough == 'NE') {
        this.isButtonVisible = true;
        this.isTextVisible = true;
      }
      if(data[0].authStatus!=null){
        this.isButtonVisible = false;
        this.isTextVisible = false;
        this.viewStatus=true;
      }
      console.log(this.item)
    })
  }
  keyPress(event: any) {

  }
  downloadAction(pdfName,hCode,dateOfAdm){
    let img = this.referalService.downloadFileForReferral(pdfName, hCode, dateOfAdm);
    window.open(img, '_blank');
  }
  Submit(event: any) {
    if (event == 1) {
      console.log(this.approveForm.value);
      Swal.fire({
        title: 'Are you sure to authenticate?',
        text: '',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes!!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.approveForm.value.refId = this.patientDtls.id;
          this.approveForm.value.action = event;
          this.approveForm.value.userId = this.user.userId;
          this.referalService.updatePatientDetails(this.approveForm.value).subscribe((data: any) => {
            console.log(data)
            if (data.status == "Success") {
              this.swal("Success", data.message, "success");
              this.route.navigate(['/application/patientformview']);
            } else if (data.status == "Failed") {
              this.swal("Error", data.message, "error");
            }
          })
        }
      })
    }
    if (event == 2) {
      if (this.approveForm.value.remarks == null || this.approveForm.value.remarks == undefined || this.approveForm.value.remarks == '') {
        this.swal("Error", "Remark should not be left blank", 'error');
        return;
      }
      console.log(this.approveForm.value);
      Swal.fire({
        title: 'Are you sure to not authenticate?',
        text: '',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes!!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.approveForm.value.refId = this.patientDtls.id;
          this.approveForm.value.action = event;
          this.approveForm.value.userId = this.user.userId;
          this.referalService.updatePatientDetails(this.approveForm.value).subscribe((data: any) => {
            console.log(data)
            if (data.status == "Success") {
              this.swal("Success", data.message, "success");
              this.route.navigate(['/application/patientformview']);
            } else if (data.status == "Failed") {
              this.swal("Error", data.message, "error");
            }
          })
        }
      })
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
