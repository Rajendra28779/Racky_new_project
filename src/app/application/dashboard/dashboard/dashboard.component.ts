import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { CreatecpdserviceService } from '../../Services/createcpdservice.service';
import { HospitalService } from '../../Services/hospital.service';
import { NotificationService } from '../../Services/notification.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  user:any;
  message: any;
  mobileformat=/[6-9][0-9]{9}$/;
  userName: string;
  list: any = [];
  listcount: any;
  flag:any=false;
  documentType: any;
  fileToUpload?: File;

  constructor(
    public headerService: HeaderService,
    private encryptionService: EncryptionService,
    public router: Router,
    private notificationservice: NotificationService,
    private sessionService: SessionStorageService) { }

  ngOnInit() {
    this.headerService.setTitle('Dashboard');
    this.user = this.sessionService.decryptSessionData("user");
    console.log(this.user);
    let Mobile=this.user.phone;
    this.notification();

    if (this.user.groupId==5) {
      this.router.navigateByUrl('/application/hospital-dashboard');
    } else if (this.user.groupId==4) {
      this.router.navigateByUrl('/application/sna-dashboard');
    } else if (this.user.groupId==3) {
      this.router.navigateByUrl('/application/cpd-dashboard');
    } else if (this.user.groupId==6) {
      this.router.navigateByUrl('/application/dc-dashboard');
    } else if (this.user.groupId==99) {
      this.router.navigateByUrl('/application/go-dashboard');
    } else if (this.user.groupId==23) {
      this.router.navigateByUrl('/application/shasqc-dashboard');
    } else if (this.user.groupId==30) {
      this.router.navigateByUrl('/application/dgo-dashboard');
    } else if (this.user.groupId==14 || this.user.groupId==16) {
      if(this.user.uidRefNumber == null || this.user.uidRefNumber == undefined ||this.user.uidRefNumber=='') {
        this.profile();
      }else{
        this.router.navigateByUrl('/application/dashboard');
      }
    } else {
      if (Mobile==null || Mobile== "" || Mobile==undefined || !(Mobile.toString()).match(this.mobileformat)){
        Swal.fire({
          title: 'Kindly Add/Correct Your Mobile Number',
          text: "",
          icon: 'warning',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.isConfirmed) {
            this.profile();
          }
        });
      }
    }
  }

  profile() {
    this.router.navigateByUrl('/application/userprofile');
  }

  getResponseFromUtil(parentData: any) {
    this.message = parentData;
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  notification() {
    let groupid=this.user.groupId;
    this.notificationservice.getnotification(groupid).subscribe((respnse: any)=>{
      respnse = this.encryptionService.getDecryptedData(respnse);
      if(respnse.status == "success")
        this.list = respnse.data;
    })
  }

  downlordnotification(event: any,docpath:any) {
    // console.log('file: '+docpath);
    if (docpath != null && docpath != '' && docpath != undefined) {
      let img = this.notificationservice.downloadFile(docpath);
      window.open(img, '_blank');
    } else {
      this.swal('Info', 'There Is No File', 'info');
    }
  }

}
