import { Component, OnInit } from '@angular/core';
import { HeaderService } from "../../../header.service";
import { SnoCLaimDetailsService } from "../../../Services/sno-claim-details.service";
import { OldBlockedClaimMonitoringService } from "../../../Services/old-blocked-claim-monitoring.service";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { TreatmenthistoryperurnService } from "../../../Services/treatmenthistoryperurn.service";
import { JwtService } from "../../../../services/jwt.service";
import { environment } from 'src/environments/environment';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-blocked-data-approval-details',
  templateUrl: './blocked-data-approval-details.component.html',
  styleUrls: ['./blocked-data-approval-details.component.scss']
})
export class BlockedDataApprovalDetailsComponent implements OnInit {

  receivedData: any = this.sessionService.decryptSessionData('requestData');
  pageStatus: any = this.receivedData.pageStatus;
  patientInfo: any;
  implantInfo: any;
  hedInfo: any;
  approvalInfo: any;
  urnInfoList: any;
  balanceInfo: any;
  actionRemarkId: any;
  description: any;
  queryCount: any;
  modalBody: any;
  modalTitle: any;
  maxChars = 500;
  keyword = 'remarks';
  actionRemarkList: any[] = [];
  treatmentHistoryList: any[] = [];
  oldTreatmentHistoryList: any[] = [];
  approvalDisabled: boolean = false;
  rejectDisabled: boolean = false;
  queryDisabled: boolean = false;
  isdetailshide: boolean = false;
  iscurrentpolicyhide: boolean;
  constructor(
    private headerService: HeaderService,
    private snoService: SnoCLaimDetailsService,
    private oldBlockedClaimService: OldBlockedClaimMonitoringService,
    private treatmentHistoryPerURNService: TreatmenthistoryperurnService,
    private jwtService: JwtService,
    private router: Router,
    private sessionService: SessionStorageService
  ) { }
  ngOnInit(): void {
    this.headerService.setTitle('Blocked Data Approval Details');
    this.getOldBlockedClaimDetails();
  }
  getOldBlockedClaimDetails() {
    this.oldBlockedClaimService.getOldBlockedClaimDetails(this.receivedData).subscribe((res: any) => {
      if (res.statusCode == 200 && res.status == 'success') {
        this.patientInfo = res.data.patientInfo;
        this.implantInfo = res.data.implantInfo;
        this.hedInfo = res.data.hedInfo;
        this.approvalInfo = res.data.approvalInfo;
        this.urnInfoList = res.data.urnInfoList;
        this.balanceInfo = res.data.balanceInfo;
        this.actionRemarkList = res.data.actionRemarkList;
        this.queryCount = this.approvalInfo.queryCount

        if (this.urnInfoList.length > 3)
          document.getElementById('urnInfo').classList.add('urnInfo-table-class', 'urnInfo-head-class');

        this.getTreatmentHistory(this.patientInfo.urn);
        this.getOldTreatmentHistory(this.patientInfo.urn);
      }
    });
  }

  getTreatmentHistory(urn: any) {
    this.treatmentHistoryPerURNService.searchbyUrn2(urn, this.jwtService.getJwtToken()).subscribe((data) => {
      this.treatmentHistoryList = data;
      console.log("hrusikesh");
      console.log(this.treatmentHistoryList);
      if (this.treatmentHistoryList.length > 3) {
        document.getElementById('treatmentTable').classList.add('urnInfo-table-class', 'urnInfo-head-class');
      }
    });
  }

  getOldTreatmentHistory(urn: any) {
    this.treatmentHistoryPerURNService.getOldTreatmentHistoryURNCPD(urn, this.jwtService.getJwtToken()).subscribe((data) => {
      if (data != null && data.status == 'success') {
        this.oldTreatmentHistoryList = data.data;
        if (this.oldTreatmentHistoryList.length > 3)
          document.getElementById('oldTreatmentTable').classList.add('urnInfo-table-class', 'urnInfo-head-class');
      }
    });
  }

  getId(item) {
    this.actionRemarkId = item.id;
    const idToActionMap = {
      1: { approval: false, reject: true, query: true },
      58: { approval: true, reject: false, query: true },
      default: { approval: false, reject: false, query: false }
    };
    const actions = idToActionMap[item.id] || idToActionMap.default;

    this.approvalDisabled = actions.approval;
    this.rejectDisabled = actions.reject;
    this.queryDisabled = actions.query;
  }

  clearActionRemarkId() {
    this.actionRemarkId = '';
  }

  validateDescription(event) {
    const pattern = /^[A-Za-z0-9.,#%<>()-_ \\s]+$/;
    const inputChar = event.key;
    if (!pattern.test(inputChar))
      event.preventDefault();
  }

  submitDetails(event: any, action: any) {
    let description = (document.querySelector('#description') as HTMLInputElement)?.value;
    (document.querySelector('#approvedAmount') as HTMLInputElement)?.value;

    if (this.actionRemarkId == undefined || this.actionRemarkId == '') {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please select Remark!',
      }).then(() => {
        (document.querySelector('#actionRemark') as HTMLInputElement)?.focus();
      });
    } else if (description == undefined || description == '') {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please enter Description!',
      }).then(() => {
        (document.querySelector('#description') as HTMLInputElement)?.focus();
      });
    }

    if (this.actionRemarkId != undefined && this.actionRemarkId != '' && description != undefined && description != '') {
      const data = {
        "action": action,
        "id": this.receivedData.id,
        "description": description,
        "userId": this.receivedData.userId,
        "actionRemarkId": this.actionRemarkId,
        "txnPackageDetailId": this.receivedData.txnPackageDetailId,
      }

      Swal.fire({
        icon: 'warning',
        title: 'Are you sure?',
        text: 'You want to submit this details!',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        confirmButtonColor: '#0c860c',
        cancelButtonText: 'No',
        cancelButtonColor: '#d33'
      }).then((result) => {
        if (result.isConfirmed) {
          this.oldBlockedClaimService.submitOldBlockedActionDetails(data).subscribe((res: any) => {
            if (res.statusCode == 200 && res.status == 'success') {
              Swal.fire({
                icon: 'success',
                title: 'Success',
                text: res.data.message
              }
              ).then(() => {
                this.router.navigate(['/application/blockedDataApproval']).then(r => {
                  console.log(r);
                });
              }
              );
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: res.data.message
              }).then(r => {
                console.log(r);
              });
            }
          });
        }
      })
    }
  }

  openModal(head: any, body: any) {
    this.modalBody = body;
    this.modalTitle = head;
    $("#modal").show();
    $(".claim-detail").css("filter", "blur(5px)");
  }
  closeModal() {
    $("#modal").hide();
    $(".claim-detail").css("filter", "blur(0px)");
  }

  downloadDocument(documentName: any, hospitalCode: any, year: any) {
    let img = this.oldBlockedClaimService.downloadOldBlockedDataFile(documentName, hospitalCode, year);
    window.open(img, '_blank');
  }
  getDetails(transactionId, claimId, urn, packagecode,caseNo:any) {
      let trnsId = transactionId;
      let clmId = claimId;
      if (clmId != null || clmId != undefined) {
        let state = {
          Urn: urn
        }
        localStorage.setItem("claimid", clmId);
        localStorage.setItem("caseno", caseNo);
        localStorage.setItem("trackingdetails", JSON.stringify(state));
        localStorage.setItem("token", this.jwtService.getJwtToken());
        this.router.navigate([]).then(result => { window.open(environment.routingUrl + '/trackingdetails'); });
      }
  }
}
