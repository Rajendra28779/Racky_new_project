import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SnafloatgenerationserviceService } from '../snafloatgenerationservice.service';
import Swal from 'sweetalert2';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-snafloataction',
  templateUrl: './snafloataction.component.html',
  styleUrls: ['./snafloataction.component.scss']
})
export class SnafloatactionComponent implements OnInit {

  actionData: any;
  //floatNo: String;
  details: any = [];
  childmessage: any;
  claimlist: any = [];
  userId: string;
  user: any;
  txtsearchDate: any;
  currentPage: any;
  pageElement: any;
  showPegi: boolean;
  record: any;
  query: boolean = false;
  dataIdArray: any = [];
  textBoxDisabled = true;
  isUpdate: any = false;
  userid: any;
  remarks: any;
  dataArray: any = [];
  maxChars = 500;
  ApprovedAmount: any;
  empp: any = [];
  Array: any = [];
  data: any;


  constructor(private snafloatgenerationservice: SnafloatgenerationserviceService, private sessionService: SessionStorageService) {

  }

  ngOnInit(): void {

    this.actionData = localStorage.getItem("details");
    console.log("this.message:" + this.actionData);
    this.actionData = JSON.parse(localStorage.getItem("details"));

    //let x = this.actionData.split(" ");
    //this.floatNo = x[0].split(":")[1];

    let id = this.actionData.floatNo;
    this.getIndividualClaimDetails(id);
  }

  myGroup = new FormGroup({
    finalRemarks: new FormControl()
  });

  getIndividualClaimDetails(floatNo: String) {

    this.snafloatgenerationservice.getIndividualClaimDetails(floatNo).subscribe(data => {

      this.claimlist = data;
      //  console.log(data)
      if (this.claimlist.length == 0) {
        this.query = true;
      }
      this.record = this.claimlist.length;
      if (this.record > 0) {
        this.showPegi = true;
      }
      else {
        this.showPegi = false;
      }

    });


  }


  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }

  selectAllCheck(event: any) {
    if (event.target.checked) {
      for (let i = 0; i < this.details.length; i++) {
        $("#tdCheck" + this.details[i].claimid).prop("checked", true);
        this.dataIdArray.push(this.details[i].claimid);
      }
    } else {
      for (let i = 0; i < this.details.length; i++) {
        $("#tdCheck" + this.details[i].claimid).prop("checked", false);
        this.dataIdArray = [];
      }
    }
    console.log(this.dataIdArray);
  }


  toggle(claimId: any) {
    this.textBoxDisabled = !this.textBoxDisabled;
    // $('#okk').hide();
    // $('#claimId').hide();
    this.isUpdate = true;
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  insertData(event: any) {
    this.isUpdate = true;
    // $('#contactChoice2').hide();
    if (this.dataArray.length == 0) {
      this.data = {
        'id': event.target.id,
        'amount': event.target.value
      }
      this.dataArray.push(this.data);
    } else {
      for (let i = 0; i < this.dataArray.length; i++) {
        if (this.dataArray[i].id == event.target.id) {
          this.dataArray[i].amount = event.target.value;
        } else {
          this.data = {
            'id': event.target.id,
            'amount': event.target.value
          }
          this.dataArray.push(this.data);
        }
      }
    }
    console.log(this.dataArray);
    //Remove duplicate object from array
    this.dataArray = this.dataArray.filter((thing, index, self) =>
      index === self.findIndex((t) => (
        t.id === thing.id
      ))
    )
    console.log("Fileterd Array");
    console.log(this.dataArray);
  }


  updateData() {
    this.userid =  this.sessionService.decryptSessionData("user");
    for (let i = 0; i < this.details.length; i++) {
      let amount = this.details[i].amount;
      this.empp.push(amount)
      console.log("all amount iin " + (this.empp));
    }
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
    this.snafloatgenerationservice.updateData(this.dataArray, this.empp, userid, this.remarks).subscribe(data => {
      console.log(data);
      this.empp = [];
      // this.swal('', 'Updated Successfully', 'success');
    })
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


}
