import { Component, OnInit } from '@angular/core';
import { QcadminServicesService } from '../../Services/qcadmin-services.service';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-hospital-civil-infra-view-details',
  templateUrl: './hospital-civil-infra-view-details.component.html',
  styleUrls: ['./hospital-civil-infra-view-details.component.scss']
})
export class HospitalCivilInfraViewDetailsComponent implements OnInit {
  // sessionToken: any;
  userRole: any;
  userId: any;
  data:any;
  civilInfraId:any;
  childmessage: any;
  constructor(
    public headerService: HeaderService,
    public qcadminserv: QcadminServicesService,
    private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    let SectionParsed = this.sessionService.decryptSessionData("user");
    this.userRole = SectionParsed.groupId;
    this.userId = SectionParsed.userId;
    this.data = JSON.parse(localStorage.getItem('civilInfraData'));
    this.civilInfraId = this.data.civilInfraId;
    // this.headerService.setTitle('');
    this.headerService.isIndicate(true);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.headerService.isBack(false);
    this.getCivilInfraDetails();
  }
  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }
  civilInfraDetails:any;
  getCivilInfraDetails(){
    let civilInfraId=this.civilInfraId;
    this.qcadminserv.getCivilInfraDetails(civilInfraId).subscribe(
      (data: any) => {
        let resData = data;
        if (resData.status == 'success') {
          let details = JSON.parse(resData.details);
          this.civilInfraDetails=details.actionData;
          console.log(details);
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
      text: text
    });
  }
}
