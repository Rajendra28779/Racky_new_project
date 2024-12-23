import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../header.service';
import { CallCenterExecutiveService } from '../Services/call-center-executive.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-not-connected-add',
  templateUrl: './not-connected-add.component.html',
  styleUrls: ['./not-connected-add.component.scss']
})
export class NotConnectedAddComponent implements OnInit {

  callresponse: any;
  notConnectedForm: FormGroup;
  ccelist: any;
  txtsearchDate: any;
  showPegi: boolean= false
  record: any;
  currentPage: any;
  pageElement: any;
  mobilenoview: any;
  dataa: any;
  selected: any[];
  curruser: any;
  mStatus: any = true;
  user: any;
  htmlData: string;
  smfStatus: boolean;
  maxChars = 200;

  constructor(public headerService: HeaderService,
    public cceService: CallCenterExecutiveService,
    public fb: FormBuilder,
    public router: Router,
    private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle('Not Connected');
    this.user = this.sessionService.decryptSessionData("user");
    this.getMobileNoActiveStatusNotConnected();
    this.getMobileNoactive();
    this.addData();
    this.smfStatus = true;
  }

  getMobileNoactive() {
    this.cceService.getmobileNoActivatedata().subscribe((data: any) => {
      this.mobilenoview = data;
      console.log(this.mobilenoview);
    })
  }

  addData() {
    this.notConnectedForm = this.fb.group({
      status: new FormControl(''),
      categoryName: new FormControl(''),
      urn: new FormControl(''),
      transactionId: new FormControl(''),
      invoice: new FormControl(''),
      memberName: new FormControl(''),
      patientContactNumber: new FormControl(''),
      districtName: new FormControl(''),
      blockName: new FormControl(''),
      panchayatName: new FormControl(''),
      villageName: new FormControl(''),
      admissiondate: new FormControl(''),
      totalamoutclaimed: new FormControl(''),
      hospitaldistrict: new FormControl(''),
      hospitalname: new FormControl(''),
      memberid: new FormControl(''),
      // question1Response: new FormControl(''),
      // question2Response: new FormControl(''),
      // question3Response: new FormControl(''),
      // question4Response: new FormControl(''),
      // executiveRemarks: new FormControl(''),
      // alternatePhoneno: new FormControl(''),
      procedureCode: new FormControl(''),
      packageHeaderName: new FormControl(''),
      // ccelist: [],
      que1: new FormControl(''),
      que2: new FormControl(''),
      que3: new FormControl(''),
      que4: new FormControl(''),
      altNo: new FormControl(''),
      remk: new FormControl(''),
      attemptCount: new FormControl(''),
      ccelist: new FormControl(''),
    })
  }

  getMobileNoActiveStatusNotConnected() {
    this.cceService.getAllNotdata(this.user.userId).subscribe((data: any) => {
    // this.cceService.getmobileNoActiveStatus().subscribe((data: any) => {
      this.ccelist = data.data;
      console.log(this.ccelist);
      this.record = this.ccelist?.length;
      if (this.record > 0) {
        this.currentPage = 1;
        this.pageElement = 100;
        this.showPegi = true;
      }
      else {
        this.showPegi = false;
      }
    })
  }

  selectStatus(id, index) {
    if(id != 1){
      this.mStatus = false;
    } else {
      this.mStatus = true;
    }
    localStorage.setItem("statusId", id);
    this.cceService.getcallResponsedata(id).subscribe((data: any) => {
      this.callresponse = data;
      console.log(this.callresponse);
      this.htmlData = '<option hidden value="" hidden selected>----Select----</option>'
      for (let i = 0; i < data.length; i++) {
        this.htmlData += '<option value="'+data[i].categoryName+'">' +data[i].categoryName+ '</option>'
      }
      $("#categoryName" + index).html(this.htmlData)
    })
    // $('#que1').val("");
    // $('#que2').val("");
    // $('#que3').val("");
    // $('#que4').val("");
    // $('#altNo').val("");
    // $('#remk').val("");
    this.notConnectedForm.reset();
  }

  SubmitCreate() {
    this.selected = [];
    var list = this.ccelist;
    var l = list.filter((opt: any) => opt.statusFlag).map((opt: any) => opt);
    for (var j = 0; j < l.length; j++) {
      console.log(l[j]);
      this.selected.push(l[j]);

      // if (this.selected != null && this.selected[j].status == null) {
      //   this.swal("Info", "Please Select Mobile No Active Status", 'info');
      //   return;
      // }

      // if (this.selected != null && this.selected[j].categoryName == null) {
      //   this.swal("Info", "Please Select Call Response CategoryName", 'info');
      //   return;
      // }

      if (this.selected != null && this.selected[j].actStat == null) {
        // $("#actStat").focus();
        this.swal("Info", "Please Select Mobile No Active Status", 'info');
        return;
      }

      if (this.selected != null && this.selected[j].catg == null) {
        // $("#categoryName").focus();
        this.swal("Info", "Please Select Call Response CategoryName", 'info');
        return;
      }

      if (this.selected != null && this.selected[j].actStat == 1) {
        if (this.selected != null && this.selected[j].catg == null) {
          this.swal("Info", "Please Select Call Response CategoryName", 'info');
          return;
        }
    if(this.mStatus){
        if (this.notConnectedForm.value.que1 == null || this.notConnectedForm.value.que1 == "" || this.notConnectedForm.value.que1 == undefined) {
          $("#que1").focus();
          this.swal("Info", "Please Select Are you receiving cashless treatment under GJAY?", 'info');
          return;
        }
        if (this.notConnectedForm.value.que2 == null || this.notConnectedForm.value.que2 == "" || this.notConnectedForm.value.que2 == undefined) {
          $("#que2").focus();
          this.swal("Info", "Please Select Are you satisfied with service?", 'info');
          return;
        }
        if (this.notConnectedForm.value.que3 == null || this.notConnectedForm.value.que3 == "" || this.notConnectedForm.value.que3 == undefined) {
          $("#que3").focus();
          this.swal("Info", "Please Select Whether you have paid any extra money for treatment under GJAY?", 'info');
          return;
        }
        if(this.smfStatus == true) {
          if (this.notConnectedForm.value.que4 == null || this.notConnectedForm.value.que4 == "" || this.notConnectedForm.value.que4 == undefined) {
            $("#que4").focus();
            this.swal("Info", "Please Select Did Swasthya Mitra facilitate your care?", 'info');
            return;
          }
        }
    }
        // if (this.notConnectedForm.value.altNo == null || this.notConnectedForm.value.altNo == "" || this.notConnectedForm.value.altNo == undefined) {
        //   $("#que4").focus();
        //   this.swal("Info", "Please Enter Alternate Phone Number", 'info');
        //   return;
        // }
        if (this.notConnectedForm.value.remk == null || this.notConnectedForm.value.remk == "" || this.notConnectedForm.value.remk == undefined) {
          $("#remk").focus();
          this.swal("Info", "Please Enter Remarks", 'info');
          return;
        }
      }

      if (this.selected != null && (this.selected[j].actStat == 2 || this.selected[j].actStat == 3) ) {
        if (this.selected != null && this.selected[j].catg == null) {
          this.swal("Info", "Please Select Call Response CategoryName", 'info');
          return;
        }
        // if (this.notConnectedForm.value.altNo == null || this.notConnectedForm.value.altNo == "" || this.notConnectedForm.value.altNo == undefined) {
        //   $("#que4").focus();
        //   this.swal("Info", "Please Enter Alternate Phone Number", 'info');
        //   return;
        // }
        if (this.notConnectedForm.value.remk == null || this.notConnectedForm.value.remk == "" || this.notConnectedForm.value.remk == undefined) {
          $("#remk").focus();
          this.swal("Info", "Please Enter Remarks", 'info');
          return;
        }
      }
      if (this.notConnectedForm.value.altNo != null) {
        if (this.notConnectedForm.value.altNo?.length != 10) {
          $("#altNo").focus();
          this.swal("Info", "Please Enter Valid Alternate Phoneno", 'info');
          return;
        }
      }
    }

    console.log(this.selected)
    if (this.selected == null || this.selected.length == 0 || this.selected == undefined) {
      this.swal("Error", "Please select one row", 'error');
      return;
    }

    Swal.fire({
      title: 'Are you sure to save?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Save it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.notConnectedForm.value.ccelist = this.selected;

        this.curruser = this.sessionService.decryptSessionData("user");
        var createby = this.curruser.userId;

        this.notConnectedForm.value.createdBy = createby

        console.log(this.notConnectedForm.value)
        this.cceService.saveNot(this.notConnectedForm.value).subscribe((data: any) => {
          this.notConnectedForm = data;
          if (data.status == "Success") {
            this.swal("Success", data.message, "success");
            // this.router.navigate(['/application/notConnectedview']);
            this.ResetForm();
          }
          else if (data.status == "Failed") {
            this.swal("Error", this.dataa.message, "error");
          }
        })
      }
    })
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });

  }

  // pageItemChange() {
  //   this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
  // }

  ResetForm() {
    window.location.reload();
  }
  data:any
  Selectedvalue(data) {
    let id;
    for(let i=0;i<this.callresponse.length;i++){
      if(data==this.callresponse[i].categoryName){
        id=this.callresponse[i].id;
      }
    }
    if (id == 2) {
      this.mStatus = false;
    } else if(id== 1){
      this.mStatus=false;
    }else if(id == 3){
      this.mStatus=true;
    }
  }
  numericOnly(event) {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }

  selectCheck(ntcntd, index) {
    this.ccelist.map((opt: any) => opt.statusFlag= false);
    ntcntd.statusFlag = !ntcntd.statusFlag
    this.mStatus = true;
    if (ntcntd.stateName == "ODISHA") {
      this.smfStatus = true;
    } else {
      this.smfStatus = false;
    }
    $('#actStat'+index).val("");
    $('#categoryName'+index).val("");
    // $('#que1').val("");
    // $('#que2').val("");
    // $('#que3').val("");
    // $('#que4').val("");
    // $('#altNo').val("");
    // $('#remk').val("");
    this.notConnectedForm.reset();
  }
  onPageBoundsCorrection(number: number) {

    this.currentPage = number;
  }

// pageItemChange1() {

//   this.pageElement = (<HTMLInputElement>document.getElementById("pageItem1")).value;

//   console.log(this.pageElement);
// }
}
