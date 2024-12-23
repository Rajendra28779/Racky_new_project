import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../application/header.service';
import { PreauthService } from '../application/Services/preauth.service';
import Swal from 'sweetalert2';
import { SessionStorageService } from '../services/session-storage.service';

@Component({
  selector: 'app-preauth-case-details',
  templateUrl: './preauth-case-details.component.html',
  styleUrls: ['./preauth-case-details.component.scss']
})
export class PreauthCaseDetailsComponent implements OnInit {
  pkgdetailsid: any;
  user: any;
  constructor(public headerService: HeaderService,
    public preauthService: PreauthService, private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle('Pre-auth Case Details');
    this.pkgdetailsid = JSON.parse(localStorage.getItem('pkgdetailsid'));
    this.user = this.sessionService.decryptSessionData("user");
    this.getPreAuthCaseDetails();
  }
  packageDetails:any;
  implantInfoArray:any=[];
  hedInfoArray:any=[];
  wardInfoArray:any=[];
  vitalInfoArray:any=[];
  getPreAuthCaseDetails(){
    this.preauthService
    .getPreAuthCaseDetails(this.pkgdetailsid)
    .subscribe(
      (data: any) => {
        let resData = data;
        if (resData.status == 'success') {
          console.log(JSON.parse(resData.data));
          let responseData = JSON.parse(resData.data);
          this.packageDetails = responseData.packageDetailsArray[0];
          this.implantInfoArray = responseData.implantInfoArray;
          this.hedInfoArray = responseData.hedInfoArray
          this.wardInfoArray = responseData.wardInfoArray
          this.vitalInfoArray = responseData.vitalInfoArray
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
  download(pdfName, dateOfAdm) {
    let hCode = this.packageDetails.hospitalCode;
    let img = this.preauthService.downloadFileBySNA(pdfName, hCode, dateOfAdm);
    window.open(img, '_blank');
  }
}
