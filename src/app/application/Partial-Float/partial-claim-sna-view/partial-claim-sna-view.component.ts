import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EncryptionService } from 'src/app/services/encryption.service';
import { HeaderService } from '../../header.service';
import { PackageDetailsMasterService } from '../../Services/package-details-master.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { ClaimRaiseServiceService } from '../../Services/claim-raise-service.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { TableUtil } from '../../util/TableUtil';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SnoCLaimDetailsService } from '../../Services/sno-claim-details.service';
declare let $: any;

@Component({
  selector: 'app-partial-claim-sna-view',
  templateUrl: './partial-claim-sna-view.component.html',
  styleUrls: ['./partial-claim-sna-view.component.scss']
})
export class PartialClaimSnaViewComponent implements OnInit {
  panelOptionState = false;
  datemodelFrom: any;
  datemodelTo: any;
  record: any=0;
  AddForm: FormGroup;
  currentPage: any;
  pageElement: any;
  claimlist: any = [];
  public serachdata: any = [];
  public empData: Object;
  public temp: Object = false;
  showPegi: boolean;
  user: any;
  txtsearchDate: any;
  check: boolean = false;
  packageName: any;
  packageId: any;
  datepicker4: any;
  packagenamedata: any;
  query: boolean = false;
  packgaeNAme: any;
  currentPagenNum: any;
  doc: any;
  Packagecode: any;
  packageCodedata: any;
  preauthdocs: any;
  claimdocs: any;
  schemeidvalue: any;
  schemeName: any;
  packageheadecode: any;

  constructor(
    private encryptionService: EncryptionService,
    private headerService: HeaderService,
    public packageDetailsMasterService: PackageDetailsMasterService,
    private sessionService: SessionStorageService,
    private claimRaise: ClaimRaiseServiceService,
    public route: Router,
    public snoService: SnoCLaimDetailsService,
  ) {}

  ngOnInit(): void {
    this.currentPagenNum = JSON.parse(localStorage.getItem('currentPageNum'));
    this.headerService.setTitle('SNA Action Taken');
    this.currentPage = 1;
    this.pageElement = 50;
    this.getSchemeData();
    // this.Inclusionofsearchingforpackagedetails();
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
    let month: any;
    var date = new Date();
    let year = date.getFullYear();
    let date1 = '01';
    if (date.getMonth() == 0) {
      year = year - 1;
      month = 11;
    } else {
      month = date.getMonth() - 1;
    }
    if (month == 0) {
      month = 'Jan';
    } else if (month == 1) {
      month = 'Feb';
    } else if (month == 2) {
      month = 'Mar';
    } else if (month == 3) {
      month = 'Apr';
    } else if (month == 4) {
      month = 'May';
    } else if (month == 5) {
      month = 'Jun';
    } else if (month == 6) {
      month = 'Jul';
    } else if (month == 7) {
      month = 'Aug';
    } else if (month == 8) {
      month = 'Sep';
    } else if (month == 9) {
      month = 'Oct';
    } else if (month == 10) {
      month = 'Nov';
    } else if (month == 11) {
      month = 'Dec';
    }
    var frstDay = date1 + '-' + month + '-' + year;
    $('input[name="fromDate"]').val(frstDay);
    $('input[name="fromDate"]').attr('placeholder', 'From Date *');
    $('input[name="toDate"]').attr('placeholder', 'To Date *');
    this.getClaimDetails();

    this.fromDate = localStorage.getItem("fromdate");
      this.toDate = localStorage.getItem("todate");
      if(this.fromDate){
        $('input[name="fromDate"]').val(this.fromDate);
        $('input[name="toDate"]').val(this.toDate);
      }


  }
  schemecategoryidvalue: any;
  schemecategoryName: any;
  schemeList: any = [];
  getschemacategoryid(event: any) {
    if (event != null && event != undefined && event != '' && event != '') {
      for (let i = 0; i < this.schemeList.length; i++) {
        if (event == this.schemeList[i].schemeCategoryId)
          this.schemecategoryidvalue = this.schemeList[i].schemeCategoryId;
        this.schemecategoryName = this.schemeList[i].categoryName;
      }
    } else {
      this.schemecategoryidvalue = '';
      this.schemecategoryName = 'All';
    }
  }
  scheme: any = [];
  getSchemeData() {
    let data = {
      action: 'A',
      schemeId: 1,
      schemeCategoryId: '',
    };
    let encData = this.encryptionService.encryptRequest(data);
    this.packageDetailsMasterService.getSchemeDetails(encData).subscribe(
      (res: any) => {
        let resData = this.encryptionService.getDecryptedData(res);
        if (resData.status == 'success') {
          this.scheme = resData.data;
          for (let i = 0; i < this.scheme.length; i++) {
            this.schemeidvalue = this.scheme[i].schemeId;
            this.schemeName = this.scheme[i].schemeName;
          }
          this.getSchemeDetails();
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
  getSchemeDetails() {
    let data = {
      action: 'B',
      schemeId: 1,
      schemeCategoryId: '',
    };
    let encData = this.encryptionService.encryptRequest(data);
    this.packageDetailsMasterService.getSchemeDetails(encData).subscribe(
      (res: any) => {
        let resData = this.encryptionService.getDecryptedData(res);
        if (resData.status == 'success') {
          this.schemeList = resData.data;
        } else {
          this.swal('', 'Something went wrong.', 'error');
        }
      },
      (error) => {
        this.swal('', 'Something went wrong.', 'error');
      }
    );
  }
  getRestdata() {
    localStorage.removeItem('fromdate');
    localStorage.removeItem('todate');
    localStorage.removeItem('actionData');
    window.location.reload();
  }
  fromDate: any;
  toDate: any;
  getClaimDetails() {
    this.user = this.sessionService.decryptSessionData('user');
    let userId = this.user.userId;
    this.fromDate = $('#datepicker4').val();
    this.toDate = $('#datepicker3').val();
    let schemeid = this.schemeidvalue;
    let schemecategoryid = this.schemecategoryidvalue;
    if (
      schemecategoryid == null ||
      schemecategoryid == undefined ||
      schemecategoryid == ''
    ) {
      schemecategoryid = '';
    } else {
      schemecategoryid = schemecategoryid;
    }
    if (Date.parse(this.fromDate) > Date.parse(this.toDate)) {
      this.swal(
        '',
        'Actual Date of Discharge From Date should be Less Than To Date',
        'error'
      );
      return;
    }
    let requestData = {
      userId: userId,
      fromDate: new Date(this.fromDate),
      toDate: new Date(this.toDate),
      schemeid: schemeid,
      schemecategoryid: schemecategoryid,
    };
    this.snoService
      .getsnaviewpartialclaimlist(requestData)
      .subscribe(
        (data:any) => {
          if (data.status==200) {
            this.claimlist = data.details;
            this.record = this.claimlist?.length;
            console.log(this.claimlist);
          } else {
            this.swal('', 'No Data Found', 'info');
          }
          if (this.record > 0) {
            this.showPegi = true;
          } else {
            this.showPegi = false;
          }
        },
        (error) => {
          this.swal('', 'Something went wrong.', 'error');
        }
      );
  }
  onclaim(id: any, urn: any) {
    localStorage.setItem("fromdate", this.fromDate);
    localStorage.setItem("todate", this.toDate);
    let state = {
      transactionId: id,
      URN: urn,
    };
    localStorage.setItem('actionData', JSON.stringify(state));
    this.route.navigate(['/application/partialclaimsnaview/details']);
  }


  heading = [
    ['Sl No.', 'URN', 'Patient Name', 'Case Number', 'Claim Number',
     'Package Code','Package Name', 'Actual Date Of Admission',
     'Actual Date Of Discharge', 'Claim Amount', 'Approved Amount',
     'Partial Claim Amount','Action Type','SNA Action Taken On','SNA Approved Amount(₹)']
  ];
  report:any=[];
  downloadReport(no: any) {
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy = this.user.fullName;
    this.report = [];
    for (let i = 0; i < this.claimlist.length; i++) {
      let claim = this.claimlist[i];
      let sno = [];
      sno.push(i + 1); // Sl No.
      sno.push(claim.urn); // URN
      sno.push(claim.patientName); // Patient Name
      sno.push(claim.caseno); // Case Number
      sno.push(claim.claimNo); // Invoice Number
      sno.push(claim.packageCode); // Package Code
      sno.push(claim.packageName); // Package Code
      sno.push(claim.dateofadmission); // Admission Date
      sno.push(claim.dateOfDischarge); // Discharge Date
      sno.push(claim.currentTotalAmount); // Claim Amount(₹)
      sno.push(claim.snaApprovedAmount); // Approved Amount(₹)
      sno.push(claim.partialAmount); // Partial Claim Amount(₹)
      sno.push(claim.actiontype); // Action Type
      sno.push(claim.actionon); // SNA Action Taken On
      sno.push(claim.snaApprovedAmount); // SNA Approved Amount(₹)
      this.report.push(sno);
    }

    if (no == 1) {
      let filter = [];
      filter.push([['From Date', this.fromDate]]);
      filter.push([['To Date', this.toDate]]);
      TableUtil.exportListToExcelWithFilter(
        this.report,
        'Partial_Claims_SNA_Action_Taken',
        this.heading, filter
      );
    } else {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      let doc = new jsPDF('l', 'mm', [297, 210]);
      doc.setFontSize(20);
      doc.text("Partial Claims SNA Action Taken", 100, 15);
      doc.setFontSize(13);
      doc.text('Actual Date of Discharge From :- ' + this.fromDate, 15, 25);
      doc.text('Actual Date of Discharge To :- ' + this.toDate, 190, 25);
      doc.text('GeneratedOn :- ' + generatedOn, 190, 32);
      doc.text('GeneratedBy :- ' + generatedBy, 15, 32);
      autoTable(doc, {
        head: this.heading,
        body: this.report,
        theme: 'grid',
        startY: 36,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 10 },
        }
      });
      doc.save('Partial_Claims_SNA_Action_Taken.pdf');
    }
  }

}
