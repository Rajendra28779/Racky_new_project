import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../header.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CallCenterExecutiveService } from '../Services/call-center-executive.service';
import Swal from 'sweetalert2';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-call-center-executive-add',
  templateUrl: './call-center-executive-add.component.html',
  styleUrls: ['./call-center-executive-add.component.scss'],
})
export class CallCenterExecutiveAddComponent implements OnInit {
  ccelist: any;
  submitted: boolean = false;
  cceForm: FormGroup;
  txtsearchDate: any;
  showPegi: boolean;
  hidestatus: boolean = true;
  record: any;
  currentPage: any;
  pageElement: any;
  dataa: any;
  mobilenoview: any;
  callresponse: any;
  catid: any;

  selected: any[];
  item: string;
  listB: any[];
  maxChars = 200;
  curruser: any;
  mStatus: any = true;
  user: any;
  htmlData: any;
  smfStatus: any = true;
  dataarray:any=[];

  constructor(
    public headerService: HeaderService,
    public cceService: CallCenterExecutiveService,
    public fb: FormBuilder,
    public router: Router,
    private activeroute: ActivatedRoute,
    private sessionService: SessionStorageService
  ) {}

  ngOnInit(): void {
    this.headerService.setTitle('Patient Blocked Data Feedback');
    // this.user = JSON.parse(sessionStorage.getItem('user'));
    this.user=this.sessionService.decryptSessionData("user");
    console.log(this.user);
    this.getallData();
    this.getMobileNoactive();
    this.cceForm = new FormGroup({
      question1Response: new FormControl(''),
      question2Response: new FormControl(''),
      question3Response: new FormControl(''),
      question4Response: new FormControl(''),
      executiveRemarks: new FormControl(''),
      createdBy: new FormControl(''),
      alternatePhoneno: new FormControl(''),
      attemptCount: new FormControl(''),
      ccelist: new FormControl(''),
    });
  }

  getallData() {
    this.cceService.getalldata(this.user.userId).subscribe((data: any) => {
      this.ccelist = data.data;
      console.log(this.ccelist);
      this.record = this.ccelist?.length;
      if (this.record > 0) {
        this.currentPage = 1;
        this.pageElement = 100;
        this.showPegi = true;
      } else {
        this.showPegi = false;
      }
    });
  }

  getMobileNoactive() {
    this.cceService.getmobileNoActivatedata().subscribe((data: any) => {
      this.mobilenoview = data;
      console.log(this.mobilenoview);
    });
  }

  SubmitCreate() {
    this.submitted = true;
    this.selected = [];
    var list = this.ccelist;
    var l = list.filter((opt: any) => opt.statusFlag).map((opt: any) => opt);
    for (var j = 0; j < l.length; j++) {
      console.log(l[j]);
      this.selected.push(l[j]);
      console.log(this.selected[j].statusFlag);
      console.log(this.selected);
      console.log(this.selected.length);

      if (this.selected.length > 1) {
        this.swal('Error', 'Please select one row', 'error');
        return;
      }

      if (this.selected != null && this.selected[j].actStat == null) {
        // $("#actStat").focus();
        this.swal('Info', 'Please Select Mobile No Active Status', 'info');
        return;
      }

      if (this.selected != null && this.selected[j].catg == null) {
        // $("#categoryName").focus();
        this.swal('Info', 'Please Select Call Response CategoryName', 'info');
        return;
      }

      if (this.selected != null && this.selected[j].actStat == 1) {
        if (this.selected != null && this.selected[j].catg == null) {
          // $("#categoryName").focus();
          this.swal('Info', 'Please Select Call Response CategoryName', 'info');
          return;
        }
        if(this.mStatus){
        if (
          this.cceForm.value.question1Response == null ||
          this.cceForm.value.question1Response == '' ||
          this.cceForm.value.question1Response == undefined
        ) {
          $('#question1Response').focus();
          this.swal(
            'Info',
            'Please Select Are you receiving cashless treatment under GJAY?',
            'info'
          );
          return;
        }
        if (
          this.cceForm.value.question2Response == null ||
          this.cceForm.value.question2Response == '' ||
          this.cceForm.value.question2Response == undefined
        ) {
          $('#question2Response').focus();
          this.swal(
            'Info',
            'Please Select Are you satisfied with service?',
            'info'
          );
          return;
        }
        if (
          this.cceForm.value.question3Response == null ||
          this.cceForm.value.question3Response == '' ||
          this.cceForm.value.question3Response == undefined
        ) {
          $('#question3Response').focus();
          this.swal(
            'Info',
            'Please Select Whether you have paid any extra money for treatment under GJAY?',
            'info'
          );
          return;

        }

        if (this.smfStatus == true) {
          if (
            this.cceForm.value.question4Response == null ||
            this.cceForm.value.question4Response == '' ||
            this.cceForm.value.question4Response == undefined
          ) {
            $('#question4Response').focus();
            this.swal(
              'Info',
              'Please Select Did Swasthya Mitra facilitate your care?',
              'info'
            );
            return;
          }
        }
      }
        if (
          this.cceForm.value.executiveRemarks == null ||
          this.cceForm.value.executiveRemarks == '' ||
          this.cceForm.value.executiveRemarks == undefined
        ) {
          $('#executiveRemarks').focus();
          this.swal('Info', 'Please Enter Remarks', 'info');
          return;
        }
      }

      if (
        this.selected != null &&
        (this.selected[j].actStat == 2 || this.selected[j].actStat == 3)
      ) {
        if (this.selected != null && this.selected[j].catg == null) {
          // $("#categoryName").focus();
          this.swal('Info', 'Please Select Call Response CategoryName', 'info');
          return;
        }
        if (
          this.cceForm.value.executiveRemarks == null ||
          this.cceForm.value.executiveRemarks == '' ||
          this.cceForm.value.executiveRemarks == undefined
        ) {
          $('#executiveRemarks').focus();
          this.swal('Info', 'Please Enter Remarks', 'info');
          return;
        }
      }
      if (this.cceForm.value.alternatePhoneno != null) {
        if (this.cceForm.value.alternatePhoneno?.length != 10) {
          $('#alternatePhoneno').focus();
          this.swal('Info', 'Please Enter Valid Alternate Phoneno', 'info');
          return;
        }
      }
    }

    if (
      this.selected == null ||
      this.selected.length == 0 ||
      this.selected == undefined
    ) {
      this.swal('Error', 'Please select one row', 'error');
      return;
    }

    console.log(this.selected);
    console.log(this.cceForm.value);
    Swal.fire({
      title: 'Are you sure  to save?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Save it!',
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(this.ccelist);
        this.cceForm.value.ccelist = this.selected;

        // this.curruser = JSON.parse(sessionStorage.getItem('user'));
        this.curruser = this.sessionService.decryptSessionData("user");

        var createby = this.curruser.userId;

        this.cceForm.value.createdBy = createby;

        // const listB = this.selected.push(this.cceForm.value);
        // console.log(listB)
        // this.listB = this.selected.map((data) => {
        //   return {'SlNo': data.Id, 'CustomerName': data.Name};
        // });
        console.log(this.selected);
        // this.cceForm.value.attemptCount === 1;
        console.log(this.cceForm.value);
        // console.log(this.ccelist)

        this.cceService.save(this.cceForm.value).subscribe((data: any) => {
          this.dataa = data;
          this.cceForm = data;
          console.log(this.cceForm);
          if (this.dataa.status == 'Success') {
            this.swal('Success', this.dataa.message, 'success');
            // this.router.navigate(['/application/cceadd']);
            this.ResetForm();
          } else if (this.dataa.status == 'Failed') {
            this.swal('Error', this.dataa.message, 'error');
          }
        });
      }
    });
  }
  getdata:any=[];
  getvalue:any
  projectNames:any
  selectStatus(id, index) {
    let categoryName = id;
    console.log(categoryName);
    if (id != 1) {
      this.mStatus = false;
    } else {
      this.mStatus = true;
    }
    console.log(id);
    localStorage.setItem('statusId', id);
    this.cceService.getcallResponsedata(id).subscribe((data: any) => {
      this.callresponse = data;
      console.log(this.callresponse);
      this.projectNames = data.map(item => {
        return item;
    });
      this.htmlData =
        '<option hidden value="" hidden selected>----Select----</option>';
      for (let i = 0; i < data.length; i++) {
        this.htmlData +=
          '<option value="' +
          data[i].id +
          '">' +
          data[i].categoryName +
          '</option>';
      }
      this.dataarray.push(this.catid)
      $('#categoryName' + index).html(this.htmlData);
      console.log(this.htmlData);
      console.log($('#categoryName' + index).html(this.htmlData));
    });

    // $('#question1Response').val();
    // $('#question2Response').val("");
    // $('#question3Response').val("");
    // $('#question4Response').val("");
    // $('#alternatePhoneno').val("");
    // $('#executiveRemarks').val("");
    this.cceForm.reset();
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }

  pageItemChange() {
    this.pageElement = (<HTMLInputElement>(
      document.getElementById('pageItem')
    )).value;
  }

  ResetForm() {
    window.location.reload();
  }

  numericOnly(event) {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }
  catidvalue: any;
data:any
  Selectedvalue(data) {
    if (data == 2) {
      this.mStatus = false;
    } else if(data== 1){
      this.mStatus=false;
    }else if(data == 3){
      this.mStatus=true;
    }
  }
  selectCheck(cce, index) {
    this.ccelist.map((opt: any) => (opt.statusFlag = false));
    cce.statusFlag = !cce.statusFlag;
    console.log(this.ccelist);
    this.mStatus = true;
    if (cce.stateName == 'ODISHA') {
      this.smfStatus = true;
    } else {
      this.smfStatus = false;
    }
    $('#actStat' + index).val('');
    $('#categoryName' + index).val('');
    // this.Selectedvalue(cce, index);
    // $('#question1Response').val();
    // $('#question2Response').val("");
    // $('#question3Response').val("");
    // $('#question4Response').val("");
    // $('#alternatePhoneno').val("");
    // $('#executiveRemarks').val("");
    this.cceForm.reset();
  }
  onPageBoundsCorrection(number: number) {

    this.currentPage = number;
  }

pageItemChange1() {

  this.pageElement = (<HTMLInputElement>document.getElementById("pageItem1")).value;

  console.log(this.pageElement);
}
}
