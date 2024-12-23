import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderService } from '../header.service';
import { OnlinePostConfigurationServiceService } from '../Services/online-post-configuration-service.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
declare let $: any;

@Component({
  selector: 'app-online-post-configuration',
  templateUrl: './online-post-configuration.component.html',
  styleUrls: ['./online-post-configuration.component.scss']
})
export class OnlinePostConfigurationComponent implements OnInit {
  showupdate: boolean;
  postList:any=[];
  childmessage: any;
  user: any;
  showpost:any=false;
  searchby: any = 1;
  flag: any = false;
  keyword: any = 'postname';
  maxChars = 500;
  postid:any='';
  post:any;
  user1: any;
  update: any;
  status: any;
  getbyid = {
    postName: '',
    postdescription: '',
    currentjobdescription: '',
    onlineapplyfrom: '',
    onlineapplyto: '',
    advertisementnumber: '',
    advertisementdate: '',
    onlinepublish: '',
    noofvaccancy: '',
    uploaddoc: '',
    isactive: '',
    bitStatus:'',
  };
  constructor(
    private route: Router,
    public headerService: HeaderService,
    private onlinepostconfigurationservice: OnlinePostConfigurationServiceService,
    private sessionService: SessionStorageService
  ) {this.user1 = this.route.getCurrentNavigation().extras.state; }

  ngOnInit(): void {
    this.headerService.setTitle('Online Post Configuration');
    this.user = this.sessionService.decryptSessionData('user');
    this.showupdate = false;
    this.getpostname();
    $('.selectpicker').selectpicker();
    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
      minDate: new Date(),
      daysOfWeekDisabled: ['', 7],
    });
    $('.datepicker1').datetimepicker({
      format: 'DD-MMM-YYYY',
      minDate: new Date(),
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
    $('input[name="fromDate"]').attr("placeholder", "From Date *");
    $('input[name="toDate"]').attr("placeholder", "To Date *");

    if (this.user1) {
      this.showupdate = true;
      this.onlinepostconfigurationservice.getbypostconfigid(this.user1.user).subscribe((data:any) => {
        this.update = data;
        this.postid=this.update.postid;
        this.getbyid.postName = this.update.postid;
        this.getbyid.postdescription = this.update.postdescription;
        this.getbyid.currentjobdescription = this.update.currentjobdescription;
        this.getbyid.onlineapplyfrom = this.update.applyform;
        $('input[name="fromDate"]').val(this.update.applyform);
        this.getbyid.onlineapplyto = this.update.applyto;
        $('input[name="toDate"]').val(this.update.applyto);
        this.getbyid.advertisementnumber = this.update.advertisementnumb;
        this.getbyid.advertisementdate = this.update.advertise;
        $('input[name="date3"]').val(this.update.advertise);
        this.getbyid.onlinepublish = this.update.onlinepublish;
        this.searchby = this.update.onlinepublish;
        this.getbyid.noofvaccancy = this.update.noofvaccancy;
        this.getbyid.uploaddoc = this.update.docupload;
        this.status = this.update.bitStatus;
       this.getbyid.bitStatus= this.update.bitStatus;
      });
    }
  }
  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }
  keyPress(event: KeyboardEvent) {
    const pattern = /^[A-Za-z0-9.,-_ ()\\s]+$/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  getpostname() {
    this.onlinepostconfigurationservice.getpostnamebypostid().subscribe(
      (response:any) => {
        this.postList = response.data;
        // if(this.dcid){
        //   for( let element of this.postList){
        //     if(element.userId==this.dcUserId){
        //       this.selectEvent(element);
        //     }
        //   }
        // }
      },
      (error) => console.log(error)
    )
  }

  selectEvent(item) {
    this.postid = item.postid;
    this.post=item;
    this.showpost=true;
    // this.dcService.getuserDetailsbygroup(12).subscribe(
    //   (response:any) => {
    //     this.cdmoList = response.data;
    //   },
    //   (error) => console.log(error)
    // )
    // this.getStateList();
  }

  clearEvent() {
    this.postid = '';
    this.showpost=false;
  }
  yes($event: any) {
    this.status = 0;
  }

  no($event: any) {
    this.status = 1;
  }
  fileToUpload:any="";
  handleFileInput(event: any){
    this.flag = false;
    this.fileToUpload = event.target.files[0];
    if (this.fileToUpload != null || this.fileToUpload != undefined) {
      if (Math.round(this.fileToUpload.size / 1024) >= 10240) {
        this.swal('Warning', ' Please Provide Document Size Less than 10MB', 'warning');
        $('#notficationdoc').val('');
        this.fileToUpload = "";
        this.flag = false;
      } else {
        this.fileToUpload = event.target.files[0];
        this.flag = true;
      }
    } else {
      this.swal('Warning', ' Please Select a Document', 'warning');
    }
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  submit(){
    if(this.postid==null || this.postid=="" || this.postid==undefined){
      this.swal("Info", "Please select Post Name", 'info');
      return;
    }
    let currentjobdesp= $('#description').val();;
    if(currentjobdesp==null || currentjobdesp==''|| currentjobdesp==undefined){
      this.swal("Info", "Please Select Current Job Description", 'info');
      return;
    }

    let fromdate = $('#date1').val();
    if(fromdate==null || fromdate==""|| fromdate==undefined){
      this.swal("Info", "Please select Online Apply From Date", 'info');
      return;
    }


    let todate = $('#date2').val();
    if(todate==null || todate==""|| todate==undefined){
      this.swal("Info", "Please select Online Apply To Date", 'info');
      return;
    }
    if (Date.parse(fromdate) > Date.parse(todate)) {
      this.swal('Warning', ' From Date should be less Than To Date', 'error');
      return;
    }
    let advertisementnum = $('#advertisementno').val();
    if(advertisementnum==null || advertisementnum==""|| advertisementnum==undefined){
      this.swal("Info", "Please select Advertisement Number", 'info');
      return;
    }
    let advertisedate = $('#date3').val();
    if(advertisedate==null || advertisedate==""|| advertisedate==undefined){
      this.swal("Info", "Please select Advertisement Number", 'info');
      return;
    }
    let onlinepublish = $('#searchby').val();
    if(onlinepublish==null || onlinepublish==""|| onlinepublish==undefined){
      this.swal("Info", "Please select Advertisement Number", 'info');
      return;

    }
    let noofvaccancy = $('#vaccancy').val();
    if(noofvaccancy==null || noofvaccancy==""|| noofvaccancy==undefined){
      this.swal("Info", "Please select No Of Vaccancy", 'info');
      return;

    }

    let document = $('#notficationdoc').val();
    if(document==null || document==""|| document==undefined){
      this.swal("Info", "Please Upload a Document", 'info');
      return;

    }

    Swal.fire({
      title: 'Are You Sure?',
      text: "You Want To Save This Data!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,Submit It!'
    }).then((result) => {
      if (result.isConfirmed) {
        const formData: FormData = new FormData();
        formData.append("postid",this.postid);
        formData.append('currentjobdescription', currentjobdesp)
        formData.append('onlineapplyfrom',fromdate)
        formData.append('onlineapplyto',todate)
        formData.append('advertisementnumb', advertisementnum)
        formData.append('advertisementdate', advertisedate)
        formData.append('onlinepublish',onlinepublish)
        formData.append('noofvaccancy', noofvaccancy)
        formData.append('createdBy', this.user.userId)
        formData.append('filename', this.fileToUpload)

        this.onlinepostconfigurationservice.saveonlinepostconfig(formData).subscribe(
          (response:any) => {
            if(response.status == 200) {
              this.swal("Successful", "Online Post Configuration Successfull", 'success');
              this.route.navigate(['/application/onlinepostconfigurationview']);
          }else if(response.status ==401){
          this.swal("Error", "Online Post Configuration already exist", 'error');
          }else{
            this.swal("Error", "Something Went Wrong.", 'error');
          }
        });
      }
    });

  }
  documentType: any;
  downloadfiletreatmentbill(event: any, fileName: any){
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

        // if (fileName != null && fileName != '' && fileName != undefined) {
        //   let img = this.notificationservice.downloadFile(fileName);
        //   window.open(img, '_blank');
        // } else {
        //   this.swal('Info', 'Please Select File', 'info');
        // }
      }
    } else {
      this.swal('Info', 'Please Select File', 'info');
    }
  } else {
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
  }

  downlordnotification(event: any, DOCUMENTUPLOAD: any) {
    if (DOCUMENTUPLOAD != null && DOCUMENTUPLOAD != '' && DOCUMENTUPLOAD != undefined) {
      let img = this.onlinepostconfigurationservice.downloadFile(DOCUMENTUPLOAD);
      window.open(img, '_blank');
    } else {
      this.swal('Info', 'There Is No File', 'info');
    }

  }

  updateDcDetails(){
    // let postid = $('#postid').val();
    if(this.postid==null || this.postid=="" || this.postid==undefined){
      this.swal("Info", "Please select Post Name", 'info');
      return;
    }
    let currentjobdesp= $('#description').val();;
    if(currentjobdesp==null || currentjobdesp==''|| currentjobdesp==undefined){
      this.swal("Info", "Please Select Current Job Description", 'info');
      return;
    }

    let fromdate = $('#date1').val();
    if(fromdate==null || fromdate==""|| fromdate==undefined){
      this.swal("Info", "Please select Online Apply From Date", 'info');
      return;
    }

    let todate = $('#date2').val();
    if(todate==null || todate==""|| todate==undefined){
      this.swal("Info", "Please select Online Apply To Date", 'info');
      return;
    }
    if (Date.parse(fromdate) > Date.parse(todate)) {
      this.swal('Warning', ' From Date should be less Than To Date', 'error');
      return;
    }

    let advertisementnum = $('#advertisementno').val();
    if(advertisementnum==null || advertisementnum==""|| advertisementnum==undefined){
      this.swal("Info", "Please select Advertisement Number", 'info');
      return;
    }
    let advertisedate = $('#date3').val();
    if(advertisedate==null || advertisedate==""|| advertisedate==undefined){
      this.swal("Info", "Please select Advertisement Number", 'info');
      return;
    }
    let onlinepublish = $('#searchby').val();
    if(onlinepublish==null || onlinepublish==""|| onlinepublish==undefined){
      this.swal("Info", "Please select Advertisement Number", 'info');
      return;

    }
    let noofvaccancy = $('#vaccancy').val();
    if(noofvaccancy==null || noofvaccancy==""|| noofvaccancy==undefined){
      this.swal("Info", "Please select No Of Vaccancy", 'info');
      return;

    }


    Swal.fire({
      title: 'Are You Sure?',
      text: "You Want To Save This Data!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,Submit It!'
    }).then((result) => {
      if (result.isConfirmed) {
        const formData: FormData = new FormData();
        formData.append("postid",this.getbyid.postName);
        formData.append("configid",this.user1.user);
        formData.append('currentjobdescription', currentjobdesp)
        formData.append('onlineapplyfrom',fromdate)
        formData.append('onlineapplyto',todate)
        formData.append('advertisementnumb', advertisementnum)
        formData.append('advertisementdate', advertisedate)
        formData.append('onlinepublish',onlinepublish)
        formData.append('noofvaccancy', noofvaccancy)
        formData.append('createdBy', this.user.userId)
        if(this.fileToUpload!=""){
          formData.append('filename', this.fileToUpload)
        }
        formData.append('filename1', this.getbyid.uploaddoc)
        formData.append('bitStatus', this.status)


        this.onlinepostconfigurationservice.updateonlinepostconfig(formData).subscribe(
          (response:any) => {
            if(response.status == 200) {
              this.swal("Successful", "Online Post Configuration Successfull", 'success');
              this.route.navigate(['/application/onlinepostconfigurationview']);
          }else if(response.status ==401){
          this.swal("Error", "Online Post Configuration already exist", 'error');
          }else{
            this.swal("Error", "Something Went Wrong.", 'error');
          }
        });
      }
    });

  }

}
