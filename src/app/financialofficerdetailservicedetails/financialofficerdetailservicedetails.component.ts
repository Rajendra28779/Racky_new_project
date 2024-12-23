import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderService } from '../application/header.service';
import { TableUtil } from '../application/util/TableUtil';
import { FinancialofficerdetailserviceService } from '../financialofficerdetailservice.service';
import { SessionStorageService } from '../services/session-storage.service';

@Component({
  selector: 'app-financialofficerdetailservicedetails',
  templateUrl: './financialofficerdetailservicedetails.component.html',
  styleUrls: ['./financialofficerdetailservicedetails.component.scss']
})
export class FinancialofficerdetailservicedetailsComponent implements OnInit {
  id: any;
  details: any = [];
  maxChars = 500;
  childmessage: any;
  type: any;
  remarks: any;
  userid: any;
  sna: any;
  isUpdate: any = false;
  dataIdArray: any = [];
  dataArray: any = [];
  data: any;
  textBoxDisabled= true;
  dataaa: any;

  constructor(private route: Router, private finalcialservice: FinancialofficerdetailserviceService, private headerService: HeaderService
    , private sessionService: SessionStorageService) {
  }
  ngOnInit(): void {
    // this.userid=sessionStorage.getItem('user');

    this.headerService.setTitle('Financial details List Page');
    this.userid =this.sessionService.decryptSessionData("user");

    this.headerService.isIndicate(false);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.headerService.isBack(false);
    this.id = JSON.parse(localStorage.getItem("details"));
    console.log("okkk"+JSON.stringify(this.id));
    let id = this.id.Action;
    console.log(id)

    this.finalcialservice.getFinancialOfficerDetailsbyid(id).subscribe(data => {
      console.log(data);
      this.details = data;
      }
    )


  }
  keyPress(event: KeyboardEvent) {
    const pattern = /^[A-Za-z0-9.,-_ \\s]+$/;
    //var regex = new RegExp("^[A-Za-z0-9.,-\\s]+$");
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }
  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }
  report: any = [];
  sno: any = {
    SlNo: "",
    FLOAT_NO: "",
    AMOUNT: "",
    CREATED_BY: "",
    CREATED_ON: "",
    PAYMENT_STATUS: "",
  };
  heading = [['Sl No', 'FLOAT_NO', 'AMOUNT', 'CREATED_BY', 'CREATED_ON', 'PAYMENT_STATUS']];
  downloadfile() {
    this.report = [];
    let claim: any;
    for (var i = 0; i < this.details.length; i++) {
      claim = this.details[i];
      console.log(claim);
      this.sno = [];
      this.sno.SlNo = i + 1;
      this.sno.FLOAT_NO = claim.float_NO;
      this.sno.AMOUNT = claim.amount;
      this.sno.CREATED_BY = claim.created_BY;
      this.sno.CREATED_ON = claim.created_ON;
      this.sno.PAYMENT_STATUS = claim.payment_STATUS;
      this.report.push(this.sno);
      console.log(this.report);
      console.log(this.sno);
    }
    TableUtil.exportListToExcel(this.report, "SNA Report Details", this.heading);
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  myGroup = new FormGroup({
    finalRemarks: new FormControl()
  });
  onForward() {
    this.remarks = $('#finalRemarksId').val();
    let value = this.type;
    let userid = this.userid.userId;
    let amount = this.details[0].amount;
    let floatid = this.details[0].float_ID;
    let floatno = this.details[0].float_NO;
    let flag ="1";
    // let assignauthorty=
    if (this.remarks == '' || this.remarks == null || this.remarks == undefined) {
      this.swal('', 'Description should not be left blank', 'error');
      return;
    }
    if (this.remarks != '' && this.remarks != null && this.remarks != undefined) {
      let pattern = /^[a-z A-Z0-9&?,._-]+$/;
      if (!pattern.test(this.remarks)) {
        this.swal('', ' Special character is not allowed', 'error');
        return;
      }
      if (value == undefined || value == null || value == "") {
        this.swal('', 'Please select Authority you want to send ', 'error');
        return;
      }
    }
    Swal.fire({
      title: 'Are you sure?',
      text: "You Want to Forward this Details",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        this.finalcialservice.insertdata(this.remarks, value, userid, amount, floatid, floatno,flag).subscribe(data => {
          this.dataaa = data;
          if (this.dataaa.status == "Success") {
            this.swal("Success", this.dataaa.message, "success");
            // this.router.navigate(['/application/claimraise']);
          } else if (this.dataaa.status == "Failed") {
            this.swal("Error", this.dataaa.message, "error");
            // this.router.navigate(['/application/claimraise']);
          }
        })
      }
    })
  }
  rejeted() {
    this.remarks = $('#finalRemarksId').val();
    let value = this.type;
    let userid = this.userid.userId;
    let amount = this.details[0].amount;
    let floatid = this.details[0].float_ID;
    let floatno = this.details[0].float_NO;
    let flag ="2";
    if (this.remarks == '' || this.remarks == null || this.remarks == undefined) {
      this.swal('', 'Description should not be left blank', 'error');
      return;
    }
    if (this.remarks != '' && this.remarks != null && this.remarks != undefined) {
      let pattern = /^[a-z A-Z0-9&?,._-]+$/;
      if (!pattern.test(this.remarks)) {
        this.swal('', ' Special character is not allowed', 'error');
        return;
      }
      if (value == undefined || value == null || value == "") {
        this.swal('', 'Please select Authority you want to send ', 'error');
        return;
        // value = '';
      }
    }
    Swal.fire({
      title: 'Are you sure?',
      text: "You Want to Reject this Details",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        this.finalcialservice.insertdata(this.remarks, value, userid, amount, floatid, floatno,flag).subscribe(data => {
          this.dataaa = data;
          if (this.dataaa.status == "Success") {
            this.swal("Success", this.dataaa.message, "success");
            // this.router.navigate(['/application/claimraise']);
          } else if (this.dataaa.status == "Failed") {
            this.swal("Error", this.dataaa.message, "error");
            // this.router.navigate(['/application/claimraise']);
          }
        })
      }
    })
  }
  insertData(event: any) {
    this.isUpdate = true;
    if (this.dataArray.length == 0) {
      this.data = {
        'id': event.target.id.replace("amountClaimId", ""),
        'amount': event.target.value
      }
      this.dataArray.push(this.data);
    } else {
      for (let i = 0; i < this.dataArray.length; i++) {
        if (this.dataArray[i].id == event.target.id.replace("amountClaimId", "")) {
          this.dataArray[i].amount = event.target.value;
        } else {
          this.data = {
            'id': event.target.id.replace("amountClaimId", ""),
            'amount': event.target.value
          }
          this.dataArray.push(this.data);
        }
      }
    }
    console.log(this.dataArray);
    this.dataArray = this.dataArray.filter((thing, index, self) =>
      index === self.findIndex((t) => (
        t.id === thing.id
      ))
    )
    console.log("Filtered Array");
    console.log(this.dataArray);
  }
  onChange(e) {
    this.type = e.target.value;
    if (this.type == 1) {
      this.type = this.details[0].created_BY;
    }
    console.log(this.type);
  }
  selectAllCheck(event: any) {
    if (event.target.checked) {
      for (let i = 0; i < this.details.length; i++) {
        $("#" + this.details[i].claimid).prop("checked", true);
        this.dataIdArray.push(this.details[i].claimid);
        this.disableEnableAllTextBox(event);
      }
    } else {
      for (let i = 0; i < this.details.length; i++) {
        $("#" + this.details[i].claimid).prop("checked", false);
        this.dataIdArray = [];
        this.disableEnableAllTextBox(event);
      }
    }
    console.log(this.dataIdArray);
  }
  toggle(claimId : any) {
    this.textBoxDisabled = !this.textBoxDisabled;
    $('#okk').hide();
    $('#claimId').hide();
    this.isUpdate = true;
  }
  updateData(){
    let ApprovedAmount = this.details[0].amount;
    let userid = this.userid.userId;
    this.remarks = $('#finalRemarksId').val();
    if (this.remarks == '' || this.remarks == null || this.remarks == undefined) {
      this.swal('', 'Description should not be left blank', 'error');
      return;
    }
    if (this.remarks != '' && this.remarks != null && this.remarks != undefined) {
      let pattern = /^[a-z A-Z0-9&?,._-]+$/;
      if (!pattern.test(this.remarks)) {
        this.swal('', ' Special character is not allowed', 'error');
        return;
      }
    }
    Swal.fire({
      title: 'Are you sure?',
      text: "You Want to Reject this Details",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
    this.finalcialservice.updateData( this.dataArray,ApprovedAmount,userid,this.remarks).subscribe(data=>{
      console.log(data);
      // this.swal('', 'Updated Successfully', 'success');
    })
  })
  }

  tdCheck(event : any) {
    if (event.target.checked) {
      $('#amountClaimId' + event.target.id).prop("disabled", false);
    }else {
      $('#amountClaimId' + event.target.id).prop("disabled", true);
    }
  }

  disableEnableAllTextBox(event : any) {
    if (event.target.checked) {
      this.details.forEach(element => {
        $('#amountClaimId' + element.claimid).prop("disabled", false);
      })
    }else {
      this.details.forEach(element => {
        $('#amountClaimId' + element.claimid).prop("disabled", true);
      })
    }
  }
}

