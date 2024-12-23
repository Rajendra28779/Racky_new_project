import { JsonPipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderService } from '../header.service';
import { AdminconsoleService } from '../Services/adminconsole.service';
import { InternalGrivanceServiceService } from '../Services/internal-grivance-service.service';
import { UsercreateService } from '../Services/usercreate.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-internal-grivance',
  templateUrl: './internal-grivance.component.html',
  styleUrls: ['./internal-grivance.component.scss']
})
export class InternalGrivanceComponent implements OnInit {
  @ViewChild('auto') auto;
  @ViewChild('autocopy') autocopy;
  groupList: any;
  userList: any;
  maxChars = 500;
  documentName?: File;
  fileName: any;
  flag: boolean = false;
  username: any;
  userId: any;
  grievanceForm!: FormGroup;
  user: any;
  dataa: any;
  item: any;
  isvisiblesave: boolean;
  visibleupdate: boolean;
  checkGrievacnce: boolean;
  getbyid: any;
  documentType: any;
  statusFlag: number;
  mailformat = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
  phonenoFormat = /[6-9][0-9]{9}$/;
  castType: any;
  priority: any;
  taggedList: any[];
  keyword: any = 'fullname';
  type: any;
  getGrievanceList: any;
  groupId: any;
  grivanceid: any;
  grivance: any;
  phoneno: any;
  email: any;
  name: string;
  categoryType: any;
  fullname: any;
  email1: any;
  phone1: any;
  phoneno1: any;
selected: any;
  closingDate: any;

  constructor(private internalGrivanceServiceService: InternalGrivanceServiceService, private route: Router, private encryptionService: EncryptionService,
    public fb: FormBuilder, private headerService: HeaderService, private userService: UsercreateService,private sessionService: SessionStorageService) {
    this.item = this.route.getCurrentNavigation().extras.state;
  }
  grievanceUpdate = {
    userId: "",
    grievanceId: "",
    fullname: "",
    categoryType: "",
    priority: "",
    email: "",
    phoneno: "",
    description: "",
    statusFlag: "",
    documentName: "",
    groupId: "",
    grievanceSource: 1,
    moduleName: "",
    phoneno1: "",
    email1: "",
    typeId: "",
    expectedDate:"",
    actualDate:""
  };



  ngOnInit(): void {
    // let =new Date();
    var date = new Date();
    // // var actualDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    $('.selectpicker').selectpicker();

    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
      // minDate: this.closingDate,
      daysOfWeekDisabled: ['', 7],
    });
    $('.datepicker1').datetimepicker({
      format: 'DD-MMM-YYYY',
      // minDate: actualDate,
      daysOfWeekDisabled: ['', 7],
    });
    $('.timepicker').datetimepicker({
      format: 'LT',
      daysOfWeekDisabled: ['', 7],
    });
    $('.datetimepicker').datetimepicker({
      format: 'DD-MMM-YYYY LT',
      daysOfWeekDisabled: ['', 7],
    });

    let year = date.getFullYear();
    let date1 = '01';
    let month:any = date.getMonth();
    if(month == 0){
      month = 'Jan';
    }else if(month == 1){
      month = 'Feb';
    }else if(month == 2){
      month = 'Mar';
    }else if(month == 3){
      month = 'Apr';
    }else if(month == 4){
      month = 'May';
    }else if(month == 5){
      month = 'Jun';
    }else if(month == 6){
      month = 'Jul';
    }else if(month == 7){
      month = 'Aug';
    }else if(month == 8){
      month = 'Sep';
    }else if(month == 9){
      month = 'Oct';
    }else if(month == 10){
      month = 'Nov';
    }else if(month == 11){
      month = 'Dec';
    }
    var frstDay = date1+"-"+month+"-"+year;
    //Date input placeholder
    $('input[name="fromDate"]').val(frstDay);
    $('input[name="fromDate"]').attr("placeholder","From Date *");
    // $('input[name="toDate"]').val('');
    $('input[name="toDate"]').attr("placeholder","To Date *");
    this.headerService.setTitle("Add Internal Grievance");
    this.user = this.sessionService.decryptSessionData("user");

    $('#details').hide();
    $('#details1').hide();
    $('#assinged').hide();
    $('#saveExpectedDate').show();
    $('#UpdateExpectedDate').hide();
    // $('#date1').hide();
    this.userId = this.user.userId
    this.username = this.user.fullName
    this.isvisiblesave = true;
    this.visibleupdate = false;
    if (this.item) {
      this.internalGrivanceServiceService.getbyid(this.item.item).subscribe(
        (result: any) => {
          this.getbyid = result;
          this.isvisiblesave = false;
          this.visibleupdate = true;
          this.grievanceUpdate.grievanceId = this.getbyid.grievanceId;
          this.grievanceUpdate.groupId = this.getbyid.groupId;
          this.grievanceUpdate.groupId = this.getbyid.groupId.typeId;
          this.grievanceUpdate.typeId = this.getbyid.typeId;
          this.getGrievanceByData(this.grievanceUpdate.groupId);
          // this.grievanceUpdate.fullname=this.getbyid.fullname;
          this.fullname = this.getbyid.fullname;
          this.email = this.getbyid.email;
          this.phoneno = this.getbyid.phoneno;
          this.grievanceUpdate.moduleName = this.getbyid.moduleName;
          this.grievanceUpdate.grievanceSource = this.getbyid.grievanceSource;
          this.grievanceUpdate.categoryType = this.getbyid.categoryType;
          this.priority = this.getbyid.priority;
          this.grievanceUpdate.description = this.getbyid.description;
          // this.grievanceUpdate.statusFlag = this.getbyid.statusFlag;
          this.statusFlag = this.getbyid.statusFlag;
          this.grievanceUpdate.documentName = this.getbyid.documentName;
          this.grievanceUpdate.expectedDate=this.getbyid.expectedDate;
          $('#assinged').show();
           $('#closeingdate').show();
           $('#saveExpectedDate').hide();
           $('#UpdateExpectedDate').show();
          // $('#closeingdate').hide();
        },
        (err: any) => {
          console.log(err);
        }
      );
    }

    this.getGroupList();
  }
  keyPress(event: KeyboardEvent) {
    const pattern = /^[A-Za-z0-9.,-_ \\s]+$/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  onReset1(){

  }
  getGroupList() {
    let groups;
    this.userService.getGroupList().subscribe(
      (response : any) => {
        response = this.encryptionService.getDecryptedData(response);
        groups = response.data
        this.groupList = response;
      },
      (error) => console.log(error)
    )
  }
  getGrievanceByData(typeId) {
    let name = $('#groupId').val();
    if (this.visibleupdate) {
      name = typeId;
    }
    if (name == 9) {
      if (this.visibleupdate) {
        name = typeId;
      }
      $('#fullname').val();
      $('#phoneno').val('');
      $('#email').val('');
      $('#details1').show();
      $('#details').hide();
    } else {
      // $('#fullname').val();
      this.auto.clear();
      $('#phoneno').val('');
      $('#email').val('');
      $('#details').show();
      $('#details1').hide();
    }
    this.internalGrivanceServiceService.getGrievanceByDetails(name).subscribe(
      (response) => {
        this.getGrievanceList = response;
      },
      (error) => console.log(error)
    )
    if (name == 1) {
      this.type = "Admin";
    } else if (name == 3) {
      this.type = "CPD"
    } else if (name == 4) {
      this.type = "SNA"
    } else if (name == 5) {
      this.type = "Hospital"
    } else if (name == 6) {
      this.type = "DC"
    } else {
      this.type = ""
    }
  }
  selectEvent(item) {
    this.grivance = item.fullname;
    this.phoneno = item.phoneno;
    this.email = item.email;
    $('#email').val('');
    $('#phoneno').val('');
  }
  OnChangeDate(){
    // this.formdate = $('#formdate').val().toString();
    let closingDate = $('#closingDate').val().toString();
    if (this.closingDate == null || this.closingDate == "" || this.closingDate == undefined) {
      this.swal('', ' Please Fill To Date', 'error');
      return;
  }
}
  handleFileInput(event: any) {
    this.documentName = event.target.files[0]; 
    if (Math.round(this.documentName.size / 1024) >= 3100) {
      this.swal('Warning', ' Please Provide Bank PassBook Size Less than 3MB', 'warning');
      $('#bannkpass').val('');
      this.documentName = null;
      this.fileName = '';
      this.flag = false;
    } else {
      this.fileName = event.target.files[0];
      this.flag = true;
    }
  }


  saveGrievance() {
    let groupId = $('#groupId').val();
    let grivance = this.grivance;
    let categoryType = $('#categoryType').val();
    let priority = this.priority;
    let phoneno = $('#phoneno').val();
    let email = $('#email').val();
    // let email = this.email = 'null' ? null : $('#email').val();
    let fullname;
    if (groupId == 9) {
      fullname = $('#fullname').val();
      phoneno = $('#phoneno').val();
      email=$('#email').val();
    } else {
      fullname = this.grivance;
      phoneno = $('#phoneno').val();
      email=$('#email').val();
    }
    let grievanceSource = $('#grievanceSource').val();
    let moduleName = $('#moduleName').val();
    let description = $('#description').val();
    let expectedDate=  $('#expectedDate').val();
    let createdBy = this.user.userId;
    if (groupId == null || groupId == "" || groupId == undefined) {
      this.swal("Info", "Please Select Grievance By", 'info');
      return;
    }
    if (fullname == null || fullname == "" || fullname == undefined) {
      this.swal("Info", "Please Provide Name", 'info');
      return;
    }
    if (phoneno == null || phoneno == "" || phoneno == undefined) {
      this.swal("Info", "Please Provide Contact Number", 'info');
      return;
    }
    if (grievanceSource == null || grievanceSource == "" || grievanceSource == undefined) {
      this.swal("Info", "Please Choose Grievance Source", 'info');
      return;
    }
    if (moduleName == null || moduleName == "" || moduleName == undefined) {
      this.swal("Info", "Please Choose Module Name", 'info');
      return;
    }
    if (categoryType == null || categoryType == "" || categoryType == undefined) {
      this.swal("Info", "Please Choose Category Type", 'info');
      return;
    }
    if (priority == null || priority == "" || priority == undefined) {
      this.swal("Info", "Please Choose Priority", 'info');
      return;
    }
    if (description == null || description == "" || description == undefined) {
      this.swal("Info", "Please Enter Description", 'info');
      return;
    }
    if (expectedDate == null || expectedDate == "" || expectedDate == undefined) {
      this.swal("Info", "Please Choose Expected Date", 'info');
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      // text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Save it!'
    }).then((result) => {
      if (result.isConfirmed) {
        let object = {
          groupId: groupId,
          grivance: grivance,
          fullname: fullname,
          phoneno: phoneno,
          email: email,
          grievanceSource: grievanceSource,
          moduleName: moduleName,
          categoryType: categoryType,
          priority: priority,
          description: description,
          expectedDate:expectedDate,
          createdBy: this.user.userId
          //  file:this.documentName
        }
        this.internalGrivanceServiceService.saveGrievanceInternal(object, this.fileName).subscribe((data) => {
          this.dataa = data;
          if (this.dataa.status == "Success") {
            this.swal("Success", this.dataa.message, "success");
            this.route.navigate(['application/internalgrivanceview']);
          } else if (this.dataa.status == "Failed") {
            this.swal("Error", this.dataa.message, "error");
          } else {
            this.swal("Error", "Something went wrong", 'error');
          }
        }
        );
      }
    })
  }

  update() {
    let groupId = $('#groupId').val();
    let grivance = this.grivance;
    let categoryType = $('#categoryType').val();
    let priority = this.priority;
    let phoneno = this.phoneno;
    let email = this.email == 'null' ? null : this.email;
    let assignedName=$('#assinedTo').val();
    let closingDate=$('#closingDate').val();
    // let actualDate=$('#actualDate').val();

    let expectedDate=  $('#expectedDate').val();
    let fullname;

    if (groupId == 9) {
      fullname = this.fullname;
      phoneno = this.phoneno;
      email = this.email;
    } else {
      fullname = this.fullname;
      phoneno = this.phoneno;
      email = this.email;
    }
    let grievanceSource = $('#grievanceSource').val();
    let moduleName = $('#moduleName').val();
    let description = $('#description').val();
    if (groupId == null || groupId == "" || groupId == undefined) {
      this.swal("Info", "Please Select Grievance By", 'info');
      return;
    }
    if (fullname == null || fullname == "" || fullname == undefined) {
      this.swal("Info", "Please Provide Name", 'info');
      return;
    }
    if (phoneno == null || phoneno == "" || phoneno == undefined) {
      this.swal("Info", "Please Provide Contact Number", 'info');
      return;
    }
    if (grievanceSource == null || grievanceSource == "" || grievanceSource == undefined) {
      this.swal("Info", "Please Choose Grievance Source", 'info');
      return;
    }
    if (moduleName == null || moduleName == "" || moduleName == undefined) {
      this.swal("Info", "Please Choose Module Name", 'info');
      return;
    }
    if (categoryType == null || categoryType == "" || categoryType == undefined) {
      this.swal("Info", "Please Choose Category Type", 'info');
      return;
    }
    if (priority == null || priority == "" || priority == undefined) {
      this.swal("Info", "Please Choose Priority", 'info');
      return;
    }

    if (description == null || description == "" || description == undefined) {
      this.swal("Info", "Please Enter Description", 'info');
      return;
    }
    if (assignedName == null || assignedName == "" || assignedName == undefined) {
      this.swal("Info", "Please Enter Assigned Name", 'info');
      return;
    }

    if (closingDate == null || closingDate == "" || closingDate == undefined) {
      this.swal("Info", "Please choose Closing Date", 'info');
      return;
    }

    if(this.statusFlag==1){
      // closingDate=$('#closingDate').val();
    }else{
      closingDate="";
    }
    Swal.fire({
      title: 'Are you sure?',
      // text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Update it!'
    }).then((result) => {
      if (result.isConfirmed) {
        let object = {
          grievanceId: this.grievanceUpdate.grievanceId,
          groupId: groupId,
          grivance: grivance,
          fullname: fullname,
          phoneno: phoneno,
          email: email,
          grievanceSource: grievanceSource,
          moduleName: moduleName,
          categoryType: categoryType,
          priority: priority,
          description: description,
          statusFlag: this.statusFlag,
          assignedName:assignedName,
          closingDate:closingDate,
          // actualDate:actualDate,
          updatedBy: this.user.userId
          // this.updateUnprocessed.updatedBy = this.user1.userId;
        }
        this.internalGrivanceServiceService.Update(object, this.documentName).subscribe((data) => {
          this.dataa = data;
          if (this.dataa.status == "Success") {
            this.swal("Success", this.dataa.message, "success");
            this.route.navigate(['application/internalgrivanceview']);
          } else if (this.dataa.status == "Failed") {
            this.swal("Error", this.dataa.message, "error");
          }
        }
        );
      }
    })
  }
  OnChangedate(){
    this.closingDate = $('#closingDate').val().toString();
    if (this.closingDate == null || this.closingDate == "" || this.closingDate == undefined) {
      this.swal('', ' Please Fill Closing Date', 'error');
      return;
    }
  }

  yes($event: any) {
    this.statusFlag = 0;
  }
  no($event: any) {
    this.statusFlag = 1;
    // $('#closeingdate').show();
  }
  Reset() {
    window.location.reload();
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  downloadfiletreatmentbill(event: any, fileName: any) {
    if (this.flag == false) {
      if (this.user) {
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
          if (fileName != null && fileName != '' && fileName != undefined) {
            let img = this.internalGrivanceServiceService.downloadFile(fileName);
            window.open(img, '_blank');
          } else {
            this.swal('Info', 'Please Select File', 'info');
          }
        }
      } else {
        this.swal('Info', 'Please Select File', 'info');
      }
    } else {
      if (this.fileName) {
        const file: File | null = this.fileName;
        if (file) {
          this.documentType = file.type;
          const blob = new Blob([file], { type: this.documentType });
          const url = window.URL.createObjectURL(blob);
          window.open(url);
        }
      } else {
        this.swal('Info', 'Please Select File', 'info');
      }
    }
  }
  cancelData() {
    this.route.navigate(['/application/internalgrivanceview']);
  }
  keyfunction1(e) {

    if (e.value[0] == " ") {
      $('#email').val('');
    }
  }
  validateEmail() {
    let email = $("#email").val().toString();
    if (!email.match(this.mailformat)) {
      $("#email").focus();
      this.swal("Info", "Please Provide Valid Email Id", 'info');
      return;
    }
  }
  validateEmail1() {
    let email = $("#email1").val().toString();
    if (!email.match(this.mailformat)) {
      $("#email1").focus();
      this.swal("Info", "Please Provide Valid Email Id", 'info');
      return;
    }
  }
  validatePhoneNo() {
    let phoneno = $("#phoneno").val().toString();
    if (!phoneno.match(this.phonenoFormat)) {
      $("#phoneno").focus();
      this.swal("Info", "Please Enter Valid Mobile Number", 'info');
      return;
    }
  }
  validatePhoneNo1() {
    let phoneno = $("#phoneno1").val().toString();
    if (!phoneno.match(this.phonenoFormat)) {
      $("#phoneno1").focus();
      this.swal("Info", "Please Enter Valid Mobile Number", 'info');
      return;
    }
  }
  no1(event: any) {
    this.castType = event;
  }
  no2(event: any) {
    this.priority = event;
  }
}
