import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { HeaderService } from '../header.service';
import { MskgrivanceService } from '../Services/mskgrivance.service';
import { SnocreateserviceService } from '../Services/snocreateservice.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-grievance-msk',
  templateUrl: './grievance-msk.component.html',
  styleUrls: ['./grievance-msk.component.scss']
})
export class GrievanceMskComponent implements OnInit {
  mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  mobileformat=/^[6-9]\d{9}$/;
  minlengthforName = /^[a-zA-Z0-9 ]{6,}$/;
  districtList: any=[];
  blocklist: any=[];
  user:any;
  stateList: any=[];
  districtListforhosp: any=[];
  hospitalList: any=[];
  maxChars:any=250;
  flag:any=false;
  flag1:any=false;
  fileToUpload:any;
  fileToUpload1:any;
  filelist:any=[];
  count:any=0;
grievancetypelist:any=[];
grievanceMediumId:any='';
addmorebtn:boolean=false
grievanceMediumlist:any=[];

  constructor(private snoService: SnocreateserviceService,public headerService: HeaderService,
    private mskservice: MskgrivanceService,
    private snoCreateService: SnocreateserviceService,private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle("Mo Sarkar Grievance");
    this.user = this.sessionService.decryptSessionData("user");

    $('.selectpicker').selectpicker();

    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
      maxDate: new Date(),
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
    this.getGrievanceMedium();
    this.getdistlist();
    this.getStateList();
    this.grivancetype();
  }
  getGrievanceMedium(){
    this.mskservice.getGrievanceMediumData().subscribe((data:any)=>{
      console.log(data);
      this.grievanceMediumlist=data;
    });
  }
  checkMoSarkar:boolean = false;
  checkNewsPaper:boolean = false;
  checkMandatory:boolean=false;
  changeGrievanceMedium(value: any) {
    $('#hospstate').val("");
    $('#hospdist').val("");
    this.districtListforhosp=[];
    $("#hospital").val("");
    this.hospitalList=[];
    $("#dcId").val("");
    this.dcList=[];
    $("#servicedate").val('');
    this.cfeedback='';
    $("#feedback1"). prop('checked', false);
    $("#feedback2"). prop('checked', false);
    $("#feedback3"). prop('checked', false);
    $("#feedback4"). prop('checked', false);
    $("#feedback5"). prop('checked', false);
    if (value == 10) {
      this.checkMoSarkar = true;
      this.checkNewsPaper = false;
      this.checkMandatory=false;
    } else if (value == 2) {
      this.checkNewsPaper = true;
      this.checkMoSarkar = false;
      this.checkMandatory=true;
    } else {
      this.checkNewsPaper = false;
      this.checkMoSarkar = false;
      this.checkMandatory=false;
    }
  }
  grivancetype(){
    this.mskservice.getactivegrivancetype().subscribe((data:any)=>{
      this.grievancetypelist=data;
    });
  }

  group=new FormGroup({
    dob:new FormControl(''),
    servicedate:new FormControl(''),
  });
  showDuration:boolean=false;
  validatePhoneNo() {
    let mobileNo=$('#mobile').val().toString();
    if (mobileNo != null && mobileNo != "" && mobileNo != undefined) {
      this.showDuration=true;
    }
    else {
      this.showDuration=false;
    }
  }

  validateEmail() {
    let emailId=$('#email').val().toString();
    if (!emailId.match(this.mailformat)) {
      $("#email").focus();
      this.swal("Info", "Please Provide Valid Email Id", 'info');
      return false;
    }
    else return true;
  }

  validateName() {
    let fullName=$("#fullname").val().toString();
    if (fullName.length<=4) {
      $("#fullname").focus();
      this.swal("Info", "Full Name must be more than 5 character", 'info');
      return false;
    }
    else return true;
  }

  keyPress(event: KeyboardEvent) {
    const pattern = /^[A-Za-z0-9.,_ -\s]+$/;
    const inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
        event.preventDefault();
    }
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  getdistlist() {
    this.snoService.getDistrictListByStateId(21).subscribe(
      (response) => {
        this.districtList = response;
        console.log(response);
      },
      (error) => console.log(error)
    )
  }


  OnChangeDistrict(id) {
    this.snoService.getBlockbyDistrictId(id, 21).subscribe(
      (response) => {
        console.log(response);
        this.blocklist = response;
      },
      (error) => console.log(error)
    )
  }

  getStateList() {
        this.snoService.getStateList().subscribe(
          (response) => {
            this.stateList = response;
          },
          (error) => console.log(error)
        );
  }
  OnChangeState(id) {
    $("#hospdist").val("");
    $("#hospital").val("");
    localStorage.setItem("stateCode", id);
    this.snoService.getDistrictListByStateId(id).subscribe(
      (response) => {
        this.districtListforhosp = response;
      },
      (error) => console.log(error)
    )
  }
  dcList:any=[];
  OnChangeDistricthosp(id) {
    $("#hospital").val("");
    $("#dcId").val("");
    let grievanceMedium=$("#grivmdm").val();
    let stateCode = localStorage.getItem("stateCode");
    this.snoService.getHospitalbyDistrictId(id, stateCode).subscribe(
      (response) => {
        this.hospitalList = response;
        console.log(response);
      },
      (error) => console.log(error)
    );
    if(grievanceMedium==2){
      this.checkNewsPaper=true;
      this.snoCreateService.getDCDetailsByStateAndDist(stateCode, id).subscribe(
        (response) => {
          this.dcList = response;
          console.log(response);
        },
        (error) => console.log(error)
      );
    }else{
      this.checkNewsPaper=false;
    }
  }
  onChangeHospital(value: any) {
    if (value != null && value !== undefined && value != '') {
      this.checkNewsPaper = false;
    }else{
      this.checkNewsPaper = true;
    }
  }
  handleFileInput(event:any){
    this.flag = false;
    this.fileToUpload = event.target.files[0];
    let extension = this.fileToUpload.name.split('.').pop();
    let allowedExtensions = /(\jpg|\jpeg|pdf|docx|png)$/i;
    if (!allowedExtensions.exec(extension)){
      this.swal('Warning', 'Only JPG/JPEG/PDF/DOCX/PNG Are Allowed!', 'warning');
      this.fileToUpload ="";
      return;
    }
    if (this.fileToUpload!=null || this.fileToUpload!=undefined){
        if(Math.round(this.fileToUpload.size / 1024) >=5120){
          this.swal('Warning', ' Please Provide Document Size Less than 5MB', 'warning');
          $('#grivdoc').val('');
          this.flag = false;
          this.fileToUpload ="";
          return;
        }else{
          this.flag = true;
        }
    }
  }

  handleFileInput1(event:any){
    this.flag1 = false;
    this.fileToUpload1 = event.target.files[0];
    let extension = this.fileToUpload1.name.split('.').pop();
    let allowedExtensions = /(\mp4|\mp3)$/i;
    if (!allowedExtensions.exec(extension)){
      this.swal('Warning', 'Only MP4/MP3 Are Allowed!', 'warning');
      this.fileToUpload1 ="";
      return;
    }
    if (this.fileToUpload1!=null || this.fileToUpload1!=undefined){
        if(Math.round(this.fileToUpload1.size / 1024) >=30720){
          this.swal('Warning', ' Please Provide Document Size Less than 30MB', 'warning');
          $('#vdodoc').val('');
          this.flag1 = false;
          this.fileToUpload1 ="";
          return;
        }else{
          this.flag1= true;
        }
    }
  }
  addmoredoc(){
    let obj={
      count:"",
      docfile:"",
      docname:"",
      vdofile:"",
      vdoname:""
    }
    console.log(this.fileToUpload);
    console.log(this.fileToUpload1);

    if (this.fileToUpload!=null && this.fileToUpload!=undefined && this.fileToUpload!=""){
      obj.docfile=this.fileToUpload;
      obj.docname=this.fileToUpload.name;
    }else{
      this.swal('Error', ' Please Upload Supporting Document', 'error');
      return;
    }
    if (this.fileToUpload1!=null && this.fileToUpload1!=undefined && this.fileToUpload1!=""){
      obj.vdofile=this.fileToUpload1;
      obj.vdoname=this.fileToUpload1.name;
    }
    this.count=this.count+1;
    obj.count=this.count;
  this.filelist.push(obj);
  if(this.filelist.length>=3){
    this.addmorebtn=true;
  }else{
    this.addmorebtn=false;
  }
          this.flag1 = false;
          this.fileToUpload1 ="";
          this.flag = false;
          this.fileToUpload ="";
  }

  ResetField(){
    window.location.reload();
  }

  remove(item) {
    console.log(item);
    for (const element of this.filelist) {
      if (item.count == element.count) {
        let index = this.filelist.indexOf(element);
        if (index !== -1) {
          this.filelist.splice(index, 1);
        }
      }
    }
    if(this.filelist.length>=3){
      this.addmorebtn=true;
    }else{
      this.addmorebtn=false;
    }
  }
  checkPriority:any="";
  checkPriorityData:any="";
  casetype:any="";
  casetypedata:any="";
  genderr:any="";
  cfeedback:any="";
  case(no:any,data:any){
    this.casetype=no;
    this.casetypedata=data
  }
  gender(type:any){
    this.genderr=type;
  }
  citizen(type:any){
    this.cfeedback=type;
  }
  declea:any=false;
  declear(event:any){
    this.declea=!this.declea;
  }
  priorityType(val:any,value:any){
    this.checkPriorityData=value;
  }
  sabmit(){
    let grievanceMedium=$('#grivmdm').val();
    let priorityType="";
    let forwardStatus="";
    if(grievanceMedium==10){
      priorityType='High';
    }else{
      priorityType=this.checkPriorityData;
    }
    let name=$("#fullname").val();
    let dob=$("#dob").val();
    let mobile=$("#mobile").val();
    let state=$("#stateId").val();
    let districtId=$("#districtId").val();
    let blockId=$("#blockId").val();
    let email=$("#email").val();
    let grivtype=$("#grivtype").val();
    let hospstate=$("#hospstate").val();
    let hospdist=$("#hospdist").val();
    let hospital=$("#hospital").val();
    let desc=$("#desc").val();
    let servicedate=$("#servicedate").val();
    let dcName=$("#dcId").val();
    this.verifystatus=0;
    if(hospital!="" && hospital !=undefined && hospital!=null){
      dcName = "";
    }
    if(grievanceMedium=="" || grievanceMedium==null || grievanceMedium==undefined){
      this.swal("Info", "Please Select Grievance Medium", 'info');
      return;
    }
    if(priorityType=="" || priorityType==null || priorityType==undefined){
      this.swal("Info", "Please Choose Priority", 'info');
      return;
    }
    if (name == null || name == "" || name == undefined) {
      this.swal("Info", "Please Enter Full Name", 'info');
      return;
    }
    if(mobile!=null && mobile!==undefined && mobile!="") {
      if(mobile.length<10){
        this.swal("Info", "Please provide valid Mobile No.", 'info');
        return;
      }else{
        this.verifystatus=1;
      }
    }
    if (districtId == null || districtId == "" || districtId == undefined) {
      this.swal("Info", "Please Select District Name", 'info');
      return;
    }
    if (grivtype == null || grivtype == "" || grivtype == undefined) {
      this.swal("Info", "Please Select Grivance Type", 'info');
      return;
    }
    if (hospstate == null || hospstate == "" || hospstate == undefined) {
      this.swal("Info", "Please Select Hospital State", 'info');
      return;
    }
    if (hospdist == null || hospdist == "" || hospdist == undefined) {
      this.swal("Info", "Please Select Hospital Dist", 'info');
      return;
    }
    if(grievanceMedium!=2){
      if (hospital == null || hospital == "" || hospital == undefined) {
        this.swal("Info", "Please Select Hospital Name", 'info');
        return;
      }
    }
    if(grievanceMedium==2){
      if((hospital == null || hospital == "" || hospital == undefined) && (dcName==null || dcName==undefined || dcName=="")){
        this.swal("Info", "Please Select Hospital Name or DC Name", 'info');
        return;
      }
    }
    if(grievanceMedium==10){
      if (this.cfeedback == null || this.cfeedback == "" || this.cfeedback == undefined) {
        this.swal("Info", "Please Select Citizen Feedback", 'info');
        return;
      }
      if (servicedate == null || servicedate == "" || servicedate == undefined) {
        this.swal("Info", "Please Choose Service Date", 'info');
        return;
      }
    }

    if (this.filelist.length==0 ) {
      this.swal("Info", "Please Upload Supporting Document", 'info');
      return;
    }
    if (!this.declea) {
      this.swal("Info", "Please Check Declaration", 'info');
      return;
    }
    
    let l=this.filelist.length;
    let docfile1="",docfile2="",docfile3="";
    let vdofile1="",vdofile2="",vdofile3="";
    docfile1=this.filelist[0].docfile
    vdofile1=this.filelist[0].vdofile
    if(l>1){
    docfile2=this.filelist[1].docfile
    vdofile2=this.filelist[1].vdofile
    }
    if(l>2){
    docfile3=this.filelist[2].docfile
    vdofile3=this.filelist[2].vdofile
    }
    let distname,blockname,hospitalname,grivtypename,hstatename,grvMediumName,stateName,hdistname ="";
    stateName='Odisha';
    for(const element of this.grievanceMediumlist){
      if(element.id==grievanceMedium){
        grvMediumName=element.grivancemediumname;
      }
    }
    for(const element of this.districtList){
      if(element.districtcode==districtId){
        distname=element.districtname;
      }
    }
    for(const element of this.blocklist){
      if(element.blockcode==blockId){
        blockname=element.blockname;
      }
    }
    for(const element of this.hospitalList){
      if(element.hospitalCode==hospital){
        hospitalname=element.hospitalName;
      }
    }
    for(const element of this.grievancetypelist){
      if(element.grievancetypeid==grivtype){
        grivtypename=element.grievancetypename;
      }
    }
    for(const element of this.stateList){
      if(element.stateCode==hospstate){
        hstatename=element.stateName;
      }
    }
    for(const element of this.districtListforhosp){
      if(element.districtcode==hospdist){
        hdistname=element.districtname;
      }
    }
    if(distname==undefined){distname=""};
    if(hospitalname==undefined){hospitalname=""};
    if(dcName==undefined){dcName=""};
    if(blockId==undefined){blockId=""};
    if(blockname==undefined){blockname=""};
    if(dcName!=null && dcName!=undefined && dcName!=""){
      hospital=0;
      forwardStatus='1';
    }
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Save it!'
    }).then((result) => {
      if (result.isConfirmed) {
        const formData: FormData = new FormData();
        formData.append('docfile1', docfile1);
        formData.append('vdofile1', vdofile1);
        formData.append('docfile2', docfile2);
        formData.append('vdofile2', vdofile2);
        formData.append('docfile3', docfile3);
        formData.append('vdofile3', vdofile3);
        formData.append('casetype', this.casetype)
        formData.append('name', name)
        formData.append('dob', dob)
        formData.append('mobile', mobile)
        formData.append('gender', this.genderr)
        formData.append('email', email)
        formData.append('districtId', districtId)
        formData.append('blockId', blockId)
        formData.append('grivtype', grivtype)
        formData.append('hospstate', hospstate)
        formData.append('hospdist', hospdist)
        formData.append('hospital', hospital)
        formData.append('desc', desc)
        formData.append('servicedate', servicedate)
        formData.append('citizenfeedback', this.cfeedback)
        formData.append('userid', this.user.userId)
        formData.append('distname', distname)
        formData.append('blockname', blockname)
        formData.append('hospname', hospitalname)
        formData.append('grivtypename', grivtypename)
        formData.append('casetypedata', this.casetypedata)
        formData.append('hstatename', hstatename)
        formData.append('hdistname', hdistname)
        formData.append('otpverifyStatus',this.verifystatus)
        formData.append('grvMedium', grievanceMedium);
        formData.append('dcName', dcName);
        formData.append('priorityType', priorityType);
        formData.append('state', state);
        formData.append('grvMediumName', grvMediumName);
        formData.append('stateName', stateName);
        formData.append('forwardStatus', forwardStatus);

        this.mskservice.savemskgriv(formData).subscribe((data:any)=>{
          if(data.status==200){
            this.swal("Success", data.message, 'success');
            $('#grivmdm').val('');
            $("#dcId").val('');
            $("#fullname").val('');
            $("#dob").val('');
            $("#mobile").val('');
            $("#districtId").val('');
            $("#blockId").val('');
            $("#email").val('');
            $("#grivtype").val('');
            $("#hospstate").val('');
            $("#hospdist").val('');
            $("#hospital").val('');
            $("#desc").val('');
            $("#servicedate").val('');
            $("#casetype1"). prop('checked', false);
            $("#casetype2"). prop('checked', false);
            $("#casetype3"). prop('checked', false);
            $("#casetype4"). prop('checked', false);
            $("#gender1"). prop('checked', false);
            $("#gender2"). prop('checked', false);
            $("#feedback1"). prop('checked', false);
            $("#feedback2"). prop('checked', false);
            $("#feedback3"). prop('checked', false);
            $("#feedback4"). prop('checked', false);
            $("#feedback5"). prop('checked', false);
            $("#priority"). prop('checked', false);
            this.declea=false;
            this.filelist=[];
            this.casetype="";
            this.genderr="";
            this.cfeedback="";
            this.verifystatus=0;
            this.showDuration=false;
            this.checkNewsPaper = false;
            this.checkMoSarkar = false;
            this.checkMandatory=false;
            window.scrollTo(0,0);
          }else{
            this.swal("Error", data.message, 'error');
          }
        });
    }
  });
  }
  documentType:any;
  downlorddoc(file:any){
    this.fileToUpload=file
    console.log(this.fileToUpload);
    if (this.fileToUpload) {
      const file: File | null = this.fileToUpload;
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
  closemodeal() {
    this.minutes = 0;
    this.seconds = 0;
    $('#exampleOtpModal').hide();
  }
  onResendOtp() {
    this.generateotp();
  }
  generateotp() {
    this.minutes = 0;
    this.seconds = 0;
    let mobile = $("#mobile").val().toString();
    if(mobile.length<10){
      $("#mobile").focus();
      this.swal("Info", "Please Enter 10 digit Mobile No", 'info');
      return;
    }
    if (!mobile.match(this.mobileformat)) {
      $("#mobile").focus();
      this.swal("Info", "Please Provide Valid Mobile No", 'info');
      return;
    }
    this.mskservice.generateotpforgrievance(mobile).subscribe((data: any) => {
      console.log(data);
      this.userDetails = data;
        if (this.userDetails.status == "success") {
        $('#exampleOtpModal').show();
        $('#sendId').show();
        $('#reSendId').hide();
        $('#timerdivId').show();
        $('#timeCounter').show();
        $('#mobileNoId').show();
        $('#phoneId').show();
        this.validateMobile=this.userDetails.rePhone;
        let phoneNo = this.userDetails.phone;
        this.minutes = 1;
        this.seconds = 0;
        this.timedata = setInterval(() => {
          if (this.minutes <= 0 && this.seconds <= 0) {
            clearInterval(this.timedata);
            // Hide elements
            $('#sendId').hide();
            $('#reSendId').show();
            $('#timeCounter').hide();
            $('#timerdivId').hide();
            $('#mobileNoId').hide();
            $('#phoneId').hide();
          } else {
            if (this.seconds === 0) {
              this.minutes--;
              this.seconds = 59;
            } else {
              this.seconds--;
            }
            // Update input values
            $('#timeCounter').val(this.getTime(this.minutes, this.seconds) + ' seconds remaining');
            $('#mobileNoId').val("OTP is sent to your " +phoneNo+ " mobile number");
          }
        }, 1000);
  
        }else{
        $('#exampleOtpModal').hide();
        this.minutes = 0;
        this.seconds = 0;
        this.swal('Warning',this.userDetails.message, 'error');
        }
    },
      (error: any) => console.log(error)
    );
  }
  showlabel: boolean = false;
  verifystatus: any = 0;
  otpvalidate: any;
  userDetails: any;
  timedata: any;
  minutes: number=0;
  seconds: number=0;
  validateMobile:any;
  getTime(minutes: number, seconds: number): string {
    return `${minutes}:${seconds < 1 ? '0' : ''}${seconds}`;
  }
  validateOtp() {
    let otp = $('#otpId').val();
    let mobile=this.validateMobile;
    if (otp == '' || otp == null || otp == undefined) {
      this.swal('', 'Please Provide OTP', 'error');
      return;
    }
    if (otp.toString().length < 6 ) {
      this.swal('', 'Please Provide valid OTP', 'error');
      return;
    }
    this.mskservice.validateOtpForGrv(otp, mobile).subscribe((data: any) => {
      this.otpvalidate = data;
      if (this.otpvalidate.status == 'success') {
        this.swal('Success', this.otpvalidate.message, 'success');
        $('#exampleOtpModal').hide();
        $('#butoon').hide();
        this.showlabel = true;
        $('#EnterMobileno label').html('<label>OTP Verified Sucessfully<span class="text-danger">*</span></label>');
        this.verifystatus = this.otpvalidate.statusFlag;
        console.log(this.otpvalidate);
      } else {
        this.swal('Error', this.otpvalidate.message, 'error')
      }
    },
      (error: any) => console.log(error)
    );
  }
  
}
