import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../header.service';
import { CallCenterExecutiveService } from '../Services/call-center-executive.service';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TableUtil } from '../util/TableUtil';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-not-connected-view',
  templateUrl: './not-connected-view.component.html',
  styleUrls: ['./not-connected-view.component.scss']
})
export class NotConnectedViewComponent implements OnInit {
  cceNotConnectedView: any;
  txtsearchDate: any;
  showPegi: boolean;
  record: any;
  currentPage: any;
  pageElement: any;
  cceelist: any;
  report: any[];
  allCceData: any = {
    slno: '',
    status:'',
    categoryName: '',
    urn: '',
    // transactionId: '',
    // invoice: '',
    patientName: '',
    patientContactNumber: '',
    attemptCount: '',
    districtName: '',
    blockName: '',
    // panchayatName: '',
    // villageName: '',
    admissionDate: '',
    // totalAmoutClaimed: '',
    hospitalDistrict: '',
    hospitalName: '',
    // procedureName: '',
    // packageName: '',
    allotedDate: '',
    // caseNo: '',
    question1Response: '',
    question2Response: '',
    question3Response: '',
    question4Response: '',
    executiveRemarks: '',
    alternatePhoneno: '',
  };
  heading = [
    [
      'Sl#',
      'MobileNo Active Status',
      'Call Response Category',
      'URN',
      // 'TransactionID',
      // 'InvoiceNo',
      'Patient Name',
      'Patient PhoneNo',
      'Not Connected Attempt Count',
      'District Name',
      'Block Name',
      // 'Panchayat Name',
      // 'Village Name',
      'DateOf Admission',
      // 'Total Amount Blocked',
      'Hospital District',
      'Hospital Name',
      // 'Procedure Name',
      // 'Package Name',
      'Allotted Date',
      // 'Case No',
      'Question 1',
      'Question 2',
      'Question 3',
      'Question 4',
      'Remarks',
      'Alternate Phone No',
    ],
  ];
  user: any;
  constructor(public headerService: HeaderService,
    public cceService: CallCenterExecutiveService,
    public fb: FormBuilder,
    public router: Router,
    private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle('Patient Not Connected complete Data');
    this.user = this.sessionService.decryptSessionData("user");
    this.getalldata();
  }
  getalldata() {
    this.cceService.getAllNotConnectedCompleteData(this.user.userId).subscribe((data: any) => {
      this.cceNotConnectedView = data.data;
      console.log(this.cceNotConnectedView);
      this.record = this.cceNotConnectedView?.length;
      if (this.record > 0) {
        this.currentPage = 1;
        this.pageElement = 100;
        this.showPegi = true;
      }
      else {
        this.showPegi = false;
      }

    })
  }

  downloadList(){
    this.report = [];
    let allCCE : any;
    for (var i = 0; i < this.cceNotConnectedView.length; i++) {
      allCCE = this.cceNotConnectedView[i];
      this.allCceData = [];
      this.allCceData.slno = i + 1;
      this.allCceData.status = allCCE.status;
      this.allCceData.categoryName = allCCE.categoryName;
      this.allCceData.urn = allCCE.urn;
      // this.allCceData.transactionId = allCCE.transactionId;
      // this.allCceData.invoice = allCCE.invoice;
      this.allCceData.patientName = allCCE.patientName;
      this.allCceData.patientContactNumber = allCCE.patientContactNumber;
      this.allCceData.attemptCount = allCCE.attemptCount;
      this.allCceData.districtName = allCCE.districtName;
      this.allCceData.blockName = allCCE.blockName;
      // this.allCceData.panchayatName = allCCE.panchayatName;
      // this.allCceData.villageName = allCCE.villageName;
      this.allCceData.admissionDate = allCCE.admissionDate;
      // this.allCceData.totalAmoutClaimed = allCCE.totalAmoutClaimed;
      this.allCceData.hospitalDistrict = allCCE.hospitalDistrict;
      this.allCceData.hospitalName = allCCE.hospitalName;
      // this.allCceData.procedureName = allCCE.procedureName;
      // this.allCceData.packageName = allCCE.packageName;
      this.allCceData.allottedDate = allCCE.allottedDate;
      // this.allCceData.caseNo = allCCE.caseNo;
      this.allCceData.question1Response = allCCE.question1Response;
      this.allCceData.question2Response = allCCE.question2Response;
      this.allCceData.question3Response = allCCE.question3Response;
      this.allCceData.question4Response = allCCE.question4Response;
      this.allCceData.executiveRemarks = allCCE.executiveRemarks;
      this.allCceData.alternatePhoneno = allCCE.alternatePhoneno;
      this.report.push(this.allCceData);
    }
    TableUtil.exportListToExcel(
      this.report, 'Patient Not Connected Data', this.heading
    );

  }

  // pageItemChange() {
  //   this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
  // }
  onPageBoundsCorrection(number: number) {

    this.currentPage = number;
  }


}
