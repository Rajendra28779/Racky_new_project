import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../header.service';
import { SnoCLaimDetailsService } from '../../Services/sno-claim-details.service';
import { UrnwiseactionReportserviceService } from '../../Services/urnwiseaction-reportservice.service';
import { DatePipe } from '@angular/common';
import { PreauthService } from '../../Services/preauth.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-urnwiseactionreport-details',
  templateUrl: './urnwiseactionreport-details.component.html',
  styleUrls: ['./urnwiseactionreport-details.component.scss']
})
export class UrnwiseactionreportDetailsComponent implements OnInit {
  currentPage: any;
  pageElement: any;
  user: any;
  check: boolean = false;
  claimDetails: any;
  highEndDrugList: any = [];
  implantDataList: any = [];
  wardDataList: any = [];
  dishounrList: any = [];
  noncomplianceHistory:any= [];
  trtData: any = [];
  multiFlag: boolean = false;
  claimLog: Array<any> = [];
  urnNo: any;
  transId: any;
  record: any;
  showPegi: boolean;
  v: any;
  hospitalCode: string;
  actualDateAdmission: string;
  dateOfAddmission: any;
  response: any;
  result: any;
  clmId: any;
  actionTakenHistory: any = [];
  multiplePackageBlocking: any = [];
  preAuthLog: any = [];
  treatmentHistory: any = [];
  show: boolean;
  basicinformationObj: any;
  dateAdmission: any;
  constructor(public headerService: HeaderService, public snoService: SnoCLaimDetailsService,private sessionService: SessionStorageService,
    private urnwiseactionReportserviceService: UrnwiseactionReportserviceService, public preauthService: PreauthService) { }

  ngOnInit(): void {
    this.headerService.setTitle('URN History Report Details');
    this.headerService.isIndicate(true);
    this.urnNo = localStorage.getItem("urn");
    this.transId = localStorage.getItem("transactionId");
    this.hospitalCode = localStorage.getItem("hospitalCode");
    this.actualDateAdmission = localStorage.getItem("actualDateAdmission");
    this.clmId = localStorage.getItem("claimId");
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.currentPage = 1;
    this.pageElement = 100;
    this.headerService.isBack(false);
    // this.user = JSON.parse(sessionStorage.getItem('user'));
    this.user = this.sessionService.decryptSessionData("user");
    this.urnwiseactionReportserviceService.getDetailsUrn(this.urnNo, this.transId).subscribe(
      (data: any) => {
        console.log(data);
        this.response = data;
        this.show = true;
        this.basicinformationObj = this.response.basicinformationObj
        this.actionTakenHistory = this.response.actionTakenHistory
        this.multiplePackageBlocking = this.response.multiplePackageBlocking
        this.preAuthLog = this.response.preAuthLog
        this.treatmentHistory = this.response.treatmentHistory
        this.noncomplianceHistory = this.response.noncomplianceHistory

      }, (err: any) => {
        console.log(err);
      }
    )
    this.getDishonrDetails();
    this.getWardData();
    this.getHighEndDrugs();
    this.getImplantData();
    // this.noncomplianceHistory();
  }

  files: any = [];
  viewAllDocument(dischargeDoc, additDocs, additDocs1
    , additionalDocs2, preSurgery, postSurgery, patientPhoto, intSurPhoto, specimanPhoto) {
      // console.log("Inside View All Document");

    this.files = [];
    if (dischargeDoc != null || dischargeDoc != undefined) {
      let jsonObj = {
        'f': dischargeDoc,
        'h': this.basicinformationObj.hospitalCode,
        'd': this.basicinformationObj.actualDateAdm
      }
      this.files.push(jsonObj);
    }
    if (additDocs != null || additDocs != undefined) {
      let jsonObj = {
        'f': additDocs,
        'h': this.basicinformationObj.hospitalCode,
        'd': this.basicinformationObj.actualDateAdm
      }
      this.files.push(jsonObj);
    }
    if (additDocs1
      != null || additDocs1
      != undefined) {
      let jsonObj = {
        'f': additDocs1
        ,
        'h': this.basicinformationObj.hospitalCode,
        'd': this.basicinformationObj.actualDateAdm
      }
      this.files.push(jsonObj);
    }
    if (additionalDocs2 != null || additionalDocs2 != undefined) {
      let jsonObj = {
        'f': additionalDocs2,
        'h': this.basicinformationObj.hospitalCode,
        'd': this.basicinformationObj.actualDateAdm
      }
      this.files.push(jsonObj);
    }
    if (preSurgery != null || preSurgery != undefined) {
      let jsonObj = {
        'f': preSurgery,
        'h': this.basicinformationObj.hospitalCode,
        'd': this.basicinformationObj.actualDateAdm
      }
      this.files.push(jsonObj);
    }
    if (postSurgery != null || postSurgery != undefined) {
      let jsonObj = {
        'f': postSurgery,
        'h': this.basicinformationObj.hospitalCode,
        'd': this.basicinformationObj.actualDateAdm
      }
      this.files.push(jsonObj);
    }
    if (patientPhoto != null || patientPhoto != undefined) {
      let jsonObj = {
        'f': patientPhoto,
        'h': this.basicinformationObj.hospitalCode,
        'd': this.basicinformationObj.actualDateAdm
      }
      this.files.push(jsonObj);
      if (intSurPhoto != null || intSurPhoto != undefined) {
        let jsonObj = {
          'f': intSurPhoto,
          'h': this.basicinformationObj.hospitalCode,
          'd': this.basicinformationObj.actualDateAdm
        }
        this.files.push(jsonObj);
      }
    }
    if (specimanPhoto != null || specimanPhoto != undefined) {
      let jsonObj = {
        'f': specimanPhoto,
        'h': this.basicinformationObj.hospitalCode,
        'd': this.basicinformationObj.actualDateAdm
      }
      this.files.push(jsonObj);
    }
    this.snoService.downloadAllDocuments(this.files).subscribe(data => {
      var result = data;
      let blob = new Blob([result], { type: result.type });
      let url = window.URL.createObjectURL(blob);
      window.open(url);
    });
  }

  downloadAction(event: any, fileName: any, hospitalCode: any, dateAdmission: any) {

    //dateAdmission = this.actualDateAdmission;

    // dateAdmission = this.actualDateAdmission;
    // alert(fileName+hospitalCode+dateAdmission);
    let target = event.target;
    if (
      target.nodeName == 'A' ||
      target.nodeName == 'a' ||
      target.nodeName == 'IMG' ||
      target.nodeName == 'img' ||
      target.nodeName == 'I' ||
      target.nodeName == 'i' ||
      target.nodeName == 'SPAN' ||
      target.nodeName == 'span'
    ) {
      target = $(target);
      let anchor = target.parent();
      anchor = anchor.get(0);
      if (fileName != null) {
        // alert(fileName+ hospitalCode+ dateAdmission);
        this.snoService.downloadFiles(fileName, hospitalCode, dateAdmission).subscribe(
          (response: any) => {
            var result = response;
            let blob = new Blob([result], { type: result.type });
            let url = window.URL.createObjectURL(blob);
            window.open(url);
          },
          (error) => {
            console.log(error);
          }
        );
      }
    }
  }

  getDishonrDetails() {
    let urn = $('#urn').val();
    this.urnwiseactionReportserviceService.getDishonrData(this.urnNo, this.clmId).subscribe(
      (data: any) => {
        this.dishounrList = data;
        console.log(this.dishounrList);
        this.record = this.dishounrList.length;
        if (this.record > 0) {
          this.showPegi = true;
        }
        else {
          this.showPegi = false;
        }
      }, (err: any) => {
        console.log(err);
      }
    )
  }

  getWardData() {
    let urn = $('#urn').val();
    this.urnwiseactionReportserviceService.getWardDetail(this.urnNo, this.transId).subscribe(
      (data: any) => {
        this.response = data;
        // console.log("Response For Ward Details.")
        console.log(this.response);
        this.wardDataList = this.response;

      }, (err: any) => {
        console.log(err);
      }
    )
  }

  getHighEndDrugs() {
    let urn = $('#urn').val();
    this.urnwiseactionReportserviceService.getHighEndDrug(this.urnNo, this.transId).subscribe(
      (data: any) => {
        this.response = data;
        this.highEndDrugList = data;
        // console.log("High End Drug List");
        console.log(this.highEndDrugList);
      }, (err: any) => {
        console.log(err);
      }
    )
  }

  getImplantData() {
    let urn = $('#urn').val();
    this.urnwiseactionReportserviceService.getImplantData(this.urnNo, this.transId).subscribe(
      (data: any) => {
        console.log(data);
        this.response = data;
        this.implantDataList = data;
        // console.log( this.implantDataList);
        console.log(this.implantDataList);
      }, (err: any) => {
        console.log(err);
      }
    )
  }

  download(pdfName, basicinformationObj, dateAdmission) {
    let hCode = this.basicinformationObj.hospitalCode;
    let img = this.preauthService.downloadFileBySNA(pdfName, hCode, dateAdmission);
    window.open(img, '_blank');
  }

  dtls: any;
  viewDescription(description) {
    this.dtls = description;
    $('#viewDescription').show();
  }
  modalClose() {
    $('#viewDescription').hide();
  }
  fileArray: any = [];
  downloadAllFile(dischargeDoc , additionaldoc, additionaldoc1, additionaldoc2) {
    this.fileArray = [];
    if (dischargeDoc
      != null || dischargeDoc != undefined) {
      let jsonObj = {
        'f': dischargeDoc,
        'h': this.basicinformationObj.hospitalCode,
        'd': this.basicinformationObj.dateAdmission
      }
      this.fileArray.push(jsonObj);
    }
    if (additionaldoc != null || additionaldoc != undefined) {
      let jsonObj = {
        'f': additionaldoc,
        'h': this.claimDetails.HOSPITALCODE,
        'd': this.claimDetails.ACTUALDATEOFADMISSION
      }
      this.fileArray.push(jsonObj);
    }
    if (additionaldoc1 != null || additionaldoc1 != undefined) {
      let jsonObj = {
        'f': additionaldoc1,
        'h': this.claimDetails.HOSPITALCODE,
        'd': this.claimDetails.ACTUALDATEOFADMISSION
      }
      this.fileArray.push(jsonObj);
    }
    if (additionaldoc2 != null || additionaldoc2 != undefined) {
      let jsonObj = {
        'f': additionaldoc2,
        'h': this.claimDetails.HOSPITALCODE,
        'd': this.claimDetails.ACTUALDATEOFADMISSION
      }
      this.fileArray.push(jsonObj);
    }
    this.snoService.downloadAllFiles(this.fileArray).subscribe(
      (response: any) => {
        var result = response;
        let blob = new Blob([result], { type: result.type });
        let url = window.URL.createObjectURL(blob);
        window.open(url);
      },
      (error) => {
        console.log(error);
      }
    );
  }

}
