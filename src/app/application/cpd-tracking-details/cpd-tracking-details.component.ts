import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/services/jwt.service';
import { environment } from 'src/environments/environment';
import { HeaderService } from '../header.service';
import { CreatecpdserviceService } from '../Services/createcpdservice.service';
import { SnoCLaimDetailsService } from '../Services/sno-claim-details.service';
import { TrackingTransistServiceService } from '../Services/tracking-transist-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { ICDSharedServices } from 'src/app/services/ICDSharedServices';

@Component({
  selector: 'app-cpd-tracking-details',
  templateUrl: './cpd-tracking-details.component.html',
  styleUrls: ['./cpd-tracking-details.component.scss']
})
export class CpdTrackingDetailsComponent implements OnInit {
  dataDisplay: any;
  claimid: any;
  authorizedcode: any;
  hospitalcode: any;
  trtData: any = [];
  token: any;
  recordhistory: any = [];
  preAuth: any;
  preAuthdata: any;
  check: boolean = false;
  ispreAuthLength: boolean = true;
  tableData: any = [];
  item: any = [];
  isTableData: boolean;
  desc: any;
  URN: any;
  AUTHORIZEDCODE: any;
  HOSPITALCODE: any;
  actiontable: any = [];
  isactiontable: boolean = false;
  urn: any
  claimlist1: any;
  actualdate: any;
  txnid: any;
  urnNUmber: any
  hospitalCodenumber: any
  authorizedcodenumber: any
  actiontable2: any = [];
  tableDatalength: any;
  tracking: any;
  // ----------------------------------------------------------------------------------------------
  treatmentHistoryList: any = [];
  oldTreatmentHistoryList: any = [];
  highEndDrugList: any = [];
  implantDataList: any = [];
  wardDataList: any = [];
  highEndDrugTotalPrice: any;
  implantTotalPrice: any;
  implantTotalUnitPrice: any;
  implantTotalUnit: any;
  actionTimeObject: any;
  iCDSubscription: Subscription;
  icdTableData: any = [];

  constructor(public headerService: HeaderService, private trackingtransistReport: TrackingTransistServiceService, 
    public snoservice: SnoCLaimDetailsService, private jwtService: JwtService, private route: Router, 
    private cpdService: CreatecpdserviceService,private msgService: ICDSharedServices
  ) { }

  ngOnInit(): void {
    this.headerService.setTitle('CPD Tracking Details');
    this.tracking = JSON.parse(localStorage.getItem("trackingdetails"));
    console.log("data about trackingg" + JSON.stringify(this.tracking));
    this.claimid = localStorage.getItem("claimid")
    this.authorizedcode = localStorage.getItem("authorizedcode")
    this.authorizedcodenumber = localStorage.getItem("authorizedCodenumber")
    this.token = localStorage.getItem("token");
    this.urn = localStorage.getItem("urn");
    this.urnNUmber = localStorage.getItem("urnnumber");
    this.actualdate = localStorage.getItem("actualdate");
    this.hospitalcode = localStorage.getItem("hospitalcode")
    this.hospitalCodenumber = localStorage.getItem("hospitalCodenumber")
    this.iCDSubscription = this.msgService.message$.subscribe((res) => {
      console.log(res);
      this.getIcdFilteredData(res);
    });
    this.trackingdetails();
    $("#appealDisposal").hide();
    this.getPreAuthdata();
  }
  getPreAuthdata() {
    var URNnumber = this.tracking.Urn;
    var Authroziedcode = this.tracking.authorizedcode;
    var Hospitalcode = this.tracking.Hospitalcode;
    this.cpdService.getPreAuthHistory(URNnumber, Authroziedcode, Hospitalcode).subscribe(data => {
      console.log("Pre Auth Log Data");
      console.log(data);
      this.claimlist1 = data;
      this.preAuth = this.claimlist1.preAuthLogList;
      console.log(this.preAuth);
      if (this.preAuth.length != 0) {
        this.check = true;
      }
    });
  }
  preauthLogDetails(urn: any, authCode: any, hosCode: any) {
    localStorage.setItem("urn", urn);
    localStorage.setItem("authorizedCode", authCode);
    localStorage.setItem("hospitalCode", hosCode);
    localStorage.setItem("token", this.jwtService.getJwtToken())
    this.route.navigate([]).then(result => { window.open(environment.routingUrl + '/preauthhistory'); });
  }
  trackingdetails() {
    this.trackingtransistReport.gettrackingdetails(this.claimid).subscribe((data) => {
      this.item = data[0];
      this.actiontable2 = data;
      this.tableDatalength = this.actiontable2.length;
      let i: any;
      for (i = 1; i < this.tableDatalength; i++) {
        this.actiontable.push(data[i]);
      }
      console.log(this.actiontable);
      if (this.actiontable.length != 0) {
        this.isactiontable = true;
      }
      this.cpdService.getPreAuthHistory(this.item.URN, this.item.AUTHORIZEDCODE, this.item.HOSPITALCODE).subscribe((data) => {
        this.tableData = data[0];
        if (this.tableData?.length != 0) {
          this.isTableData = true;
          this.getVitalParaMeterDetails(this.item.URN);
        }
      })
      this.getPackageDetailsInfoList(this.item.txnpackagedetailid);
    })
  }
  downloadAction(event: any, fileName: any, hCode: any, dateOfAdm: any) {
    console.log("hi" + fileName)
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

      if (fileName != null) {
        this.snoservice.downloadFiles(fileName, hCode, dateOfAdm).subscribe(
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

  dtls: any;
  viewDescription(descriptinDtls) {
    this.dtls = descriptinDtls;
    $("#appealDisposal").show();
  }
  modalClose() {
    $("#appealDisposal").hide();
  }

  getPackageDetailsInfoList(txnPackageDetailsId: any) {
    console.log("okk let it "+txnPackageDetailsId);
    this.cpdService.getPackageDetailsInfoList(txnPackageDetailsId).subscribe(data => {
      let result: any = data;
      if (result != null && result.statusCode == 200) {
        this.highEndDrugList = result.highEndDrugList;
        this.implantDataList = result.implantDataList;
        this.wardDataList = result.wardDataList;
        this.highEndDrugTotalPrice = result.highEndDrugTotalPrice;
        this.implantTotalPrice = result.implantTotalPrice;
        this.implantTotalUnit = result.implantTotalUnit;
        this.implantTotalUnitPrice = result.implantTotalUnitPrice;
      }
    })
  }

  showProcedureName() {
    $('#procedureNameId').text(this.item?.procedureName1);
    $('#showMoreId').empty()
    $('#showMoreId1').append('<div style="cursor: pointer; color: #1d89c9">Show Less</div>');
  }

  hideProcedureName() {
    let procedureName = this.item?.procedureName1;
    if (procedureName.length > 30) {
      $('#procedureNameId').text(procedureName.substring(0, 30) + '...');
      $('#showMoreId1').empty()
      $('#showMoreId').empty();
      $('#showMoreId').append('<span style="cursor: pointer; color: #1d89c9">Show More</span>');
    }
  }
  pkgDetailsData: any = [];
  overAllDetailsData: any = [];
  getPackageDetails(packageCode, subPackageCode, procedureCode) {
    this.snoservice.getPackageDetails(packageCode, subPackageCode, procedureCode, this.item.hospitalCode).subscribe(
      (data: any) => {
        let resData = data;
        if (resData.status == 'success') {
          let packgeInfo = resData.data;
          let overallInfo = resData.data1;
          this.pkgDetailsData = JSON.parse(packgeInfo);
          this.overAllDetailsData = JSON.parse(overallInfo);
        } else {
          this.swal('', 'Something went wrong.', 'error');
        }
      },
      (error) => {
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
  vitalArray:any=[];
  getVitalParaMeterDetails(urn:any){
    this.trackingtransistReport.getvitaldetails(urn).subscribe(data =>{
      let result: any = data;
      this.vitalArray = result.vitalArray;
    })
  }
  memberid: any
  overridedetails: any = []
  getOverridedetails(overridecode: any) {
    this.snoservice.getOverridecodedetails(overridecode, this.item.MEMBERID, this.item.URN, this.item.HOSPITALCODE).subscribe(
      (data: any) => {
        let resData = data;
        if (resData.status == 'success') {
          let results = resData.data;
          results = JSON.parse(results);
          this.overridedetails = results.overridecodedetails;
        } else {
          this.swal('', 'Something went wrong.', 'error');
        }
      },
      (error) => {
        this.swal('', 'Something went wrong.', 'error');
      }
    );
  }
  finalIcdObj: any;
  getIcdFilteredData(data) {
    let ictDetailsArray = data.ictDetailsArray;
    let ictSubDetailsArray = data.ictSubDetailsArray;
    ictDetailsArray.forEach((element) => {
      let detailsIcd = [];
      ictSubDetailsArray.forEach((element1) => {
        if (element.icdInfoId == element1.icdInfoId) {
          let data = {
            icdCode: element.icdCode,
            icdSubCode: element1.icdSubCode,
            icdSubName: element1.icdSubName,
            icdInfoId: element1.icdInfoId,
          };
          detailsIcd.push(data);
        }
      });
      let data = {
        icdCode: element.icdCode,
        icdName: element.icdName,
        icdMode: element.icdMode,
        subList: detailsIcd,
        icdInfoId: element.icdInfoId,
        isExpand: false,
        byGroupId: element.byGroupId,
      };
      this.icdTableData.push(data);
    });
    this.finalIcdObj = {
      flag: 0,
      icdFinalAry: this.icdTableData,
    };
    console.log(this.finalIcdObj);
    this.icdTableData = this.finalIcdObj.icdFinalAry;
    console.log( this.icdTableData.length()+"length");
    this.msgService.onFirstComponentButtonClick(this.finalIcdObj);
  }
}
