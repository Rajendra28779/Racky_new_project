import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { RejectRequestService } from '../../Services/reject-request.service';
import { SnamasterserviceService } from '../../Services/snamasterservice.service';
import { SnoCLaimDetailsService } from '../../Services/sno-claim-details.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-snasysrejbtn-enable',
  templateUrl: './snasysrejbtn-enable.component.html',
  styleUrls: ['./snasysrejbtn-enable.component.scss']
})
export class SnasysrejbtnEnableComponent implements OnInit {
  childmessage: any;
  user: any;
  txtsearchDate: any;
  stateCode: any;
  userId: any;
  distList: any;
  distCode: any;
  snoclaimlist: any = [];
  record: any;
  showPegi: boolean;
  currentPage: any;
  pageElement: any;
  totalClaimCount: any;
  dataRequest: any;
  fromDate: any;
  toDate: any;
  stateCode1: any;
  distCode1: any;
  hospitalCode: any;
  currentPagenNum: any;
  month:any;
  year:any;
  unprocessedclaimlist:any =[];
  responseData: any;
  constructor(
    public headerService: HeaderService,
    public snoService: SnoCLaimDetailsService,
    public route: Router,
    public rejectedrequest:RejectRequestService,
    private snamasterService: SnamasterserviceService,
    private sessionService: SessionStorageService
  ) {}
  hospitalId: any;
  districtId: any;
  stateId: any;
  keyword: any = "hospitalName";
  keyword1: any = "districtname";
  keyword2: any = "stateName";

  @ViewChild('auto') auto;
  @ViewChild('auto1') auto1;
  @ViewChild('auto2') auto2;

  public stateList: any = [];
  public districtList: any = [];
  public hospitalList: any = [];
  ngOnInit(): void {
    // dynamic title
    this.user = this.sessionService.decryptSessionData("user");
    this.headerService.setTitle('Hospital Visibility');
    this.headerService.isIndicate(true);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.headerService.isBack(false);

    this.getStateList();
    this.currentPage = 1;
    this.pageElement = 10;
    this.getSnoClaimDetails();
  }

  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }
  rejectRequestList:any =[];
  totalCount:any;
  getSnoClaimDetails() {
    let userId = this.user.userId;
    let stateId = this.stateId;
    let districtId = this.districtId;
    let hospitalId = this.hospitalId;
    // alert(stateId);
    // alert(districtId);
    // alert(hospitalId);
    let requestData = {
      userId: userId,
      stateId: stateId,
      districtId: districtId,
      hospitalId: hospitalId
    };
    if (Date.parse(this.fromDate) > Date.parse(this.toDate)) {
      this.swal('', 'From Date should be less than To Date', 'error');
      return;
    }
    this.rejectedrequest.getSysRejectedClaimListToSNA(requestData).subscribe(data => {
    this.rejectRequestList = data;
    this.totalCount = this.rejectRequestList.length;
      this.record=this.rejectRequestList.length;
    if(this.record>0){
      this.showPegi=true;
    }
    else{
      this.showPegi=false;
    }
    },
    (error) => {
      console.log(error);
      this.swal('', 'Something went wrong.', 'error');
    });

  }

TakeAction(hosUserId:any,hospitalName:any,hospitalCode:any,nonUploadingFlag:any,nonComplianceFlag:any){
 let state={
    hosUserId:hosUserId,
    hospitalName:hospitalName,
    hospitalCode:hospitalCode,
    nonUploadingFlag:nonUploadingFlag,
    nonComplianceFlag:nonComplianceFlag
 }
 localStorage.setItem("actionTakenData",JSON.stringify(state));
 this.route.navigate(['/application/sysrejectedbtnenable/action']);
}
  ResetField() {
    window.location.reload();
    // $('#statecode1').val('');
    // $('#distcode1').val('');
    // $('#hospitalcode').val('');
  }
  getStateList() {
    this.snamasterService.getStateList(this.user.userId).subscribe(
      (response) => {
        this.stateList = response;
      },
      (error) => console.log(error)
    )
  }

  OnChangeState(id) {
    this.auto1.clear();
    this.auto.clear();
    this.districtId = '';
    this.hospitalId = '';
    this.auto.clear();
    this.hospitalList = [];
    localStorage.setItem("stateCode", id);
    this.snamasterService.getDistrictListByStateId(this.user.userId, id).subscribe(
      (response) => {
        this.districtList = response;
      },
      (error) => console.log(error)
    )
  }

  OnChangeDistrict(id) {
    this.hospitalId = '';
    this.auto.clear();
    var stateCode = localStorage.getItem("stateCode");
    this.snamasterService.getHospitalbyDistrictId(this.user.userId, id, stateCode).subscribe(
      (response) => {
        this.hospitalList = response;
      },
      (error) => console.log(error)
    )
  }
  selectEvent(item) {
    // do something with selected item
    this.hospitalId = item.hospitalCode;
  }

  clearEvent() {
    this.hospitalId = '';
  }

  selectEvent1(item) {
    // do something with selected item
    this.districtId = item.districtcode;
    this.OnChangeDistrict(this.districtId);
  }

  clearEvent1() {
    this.districtId = '';
    this.OnChangeDistrict(this.districtId);
  }

  selectEvent2(item) {
    // do something with selected item
    this.stateId = item.stateCode;
    this.OnChangeState(this.stateId);
  }

  clearEvent2() {
    this.stateId = '';
    this.OnChangeState(this.stateId);
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }

}
