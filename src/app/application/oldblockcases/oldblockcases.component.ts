import { Component, OnInit, ViewChild } from '@angular/core';
import { FloatgenerationserviceService } from '../Services/floatgenerationservice.service';
import { HeaderService } from '../header.service';
import { SnamasterserviceService } from '../Services/snamasterservice.service';
import { Router } from '@angular/router';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { PackageDetailsMasterService } from '../Services/package-details-master.service';
import Swal from 'sweetalert2';
import { TableUtil } from '../util/TableUtil';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { formatDate } from '@angular/common';
import autoTable from 'jspdf-autotable';
import { JwtService } from 'src/app/services/jwt.service';
import { environment } from 'src/environments/environment';
declare let $: any;

@Component({
  selector: 'app-oldblockcases',
  templateUrl: './oldblockcases.component.html',
  styleUrls: ['./oldblockcases.component.scss']
})
export class OldblockcasesComponent implements OnInit {
  childmessage: any;
  months: any;
  months2: any;
  year: any;
  secoundDay: any;
  frstDay: any;
  user: any;
  txtsearchDate: any;
  pageElement: any;
  currentPage: any;
  record: any;
  showPegi: boolean;
  public stateList: any = [];
  public districtList: any = [];
  public hospitalList: any = [];
  oldblocknewdischarge: any = [];
  oldblocknewdischargecount: any = [];
  summary: any;
  fromDate: any;
  toDate: any;
  hospitalId: any = '';
  districtId: any = '';
  stateId: any = '';
  mortality: any;
  search: any;
  keyword: any = "hospitalName";
  keyword1: any = "districtname";
  keyword2: any = "stateName";
  searchtype: any;
  showCount: any = false;
  @ViewChild('auto') auto;
  @ViewChild('auto1') auto1;
  @ViewChild('auto2') auto2;
  constructor(private floatgenerationService: FloatgenerationserviceService, public headerService: HeaderService,
    private snamasterService: SnamasterserviceService, public route: Router,
    private sessionService: SessionStorageService,
    private encryptionService: EncryptionService, public packageDetailsMasterService: PackageDetailsMasterService, private jwtService: JwtService) { }

  ngOnInit(): void {
    this.getSchemeData();
    this.headerService.setTitle('Float Generation');
    this.headerService.isIndicate(false);
    this.headerService.isBack(true);
    this.user = this.sessionService.decryptSessionData("user");
    this.currentPage = 1;
    this.pageElement = 100;

    $('.selectpicker').selectpicker();

    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
      // endDate: '0d',
      maxDate: new Date(),
      daysOfWeekDisabled: ['', 7],
    });
    $('.timepicker').datetimepicker({
      format: 'LT',
      daysOfWeekDisabled: ['', 7],
    });
    $('.datetimepicker').datetimepicker({
      format: 'YYYY-MM-DD LT',
      daysOfWeekDisabled: ['', 7],
    });
    var date = new Date();

    let year = date.getFullYear();
    let date1 = '01';
    let month: any = date.getMonth();

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
    let date2 = date.getDate();
    this.months2 = this.getMonthFrom(date.getMonth())
    this.frstDay = date1 + '-' + 'Jan' + '-' + 2018;
    this.secoundDay = date2 + "-" + this.months2 + "-" + year;
    $('input[name="fromDate"]').val(this.frstDay).attr('placeholder', 'From Date *');
    $('input[name="toDate"]').attr('placeholder', 'To Date *');
    this.getStateList();
  }

  getMonthFrom(month) {
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
    return month;
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
    this.hospitalId = item.hospitalCode;
  }

  clearEvent() {
    this.hospitalId = '';
  }

  selectEvent1(item) {
    this.districtId = item.districtcode;
    this.OnChangeDistrict(this.districtId);
  }

  clearEvent1() {
    this.districtId = '';
    this.OnChangeDistrict(this.districtId);
  }

  selectEvent2(item) {
    this.stateId = item.stateCode;
    this.OnChangeState(this.stateId);
  }

  clearEvent2() {
    this.stateId = '';
    this.OnChangeState(this.stateId);
  }

  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
  }
  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;

  }
  getoldblockdata() {
    this.txtsearchDate = '';
    this.summary = '';
    let userId = this.user.userId;
    let fromDate = $('#formdate').val();
    let toDate = $('#todate').val();
    let stateId = this.stateId;
    let districtId = this.districtId;
    let hospitalId = this.hospitalId;
    let mortality = $('#mortality').val();
    let schemecategoryid = this.schemecategoryidvalue;
    if (schemecategoryid == null || schemecategoryid == undefined || schemecategoryid == '') {
      schemecategoryid = "";
    } else {
      schemecategoryid = schemecategoryid;
    }
    if (fromDate == null || fromDate == "" || fromDate == undefined) {
      this.swal("Info", "Please Select Actual Date of Discharge From", 'info');
      return;
    }
    if (toDate == null || toDate == "" || toDate == undefined) {
      this.swal("Info", "Please Select Actual Date of Discharge To", 'info');
      return;
    }
    if (Date.parse(fromDate) > Date.parse(toDate)) {
      this.swal('Info', ' From Date should be less than To Date', 'info');
      return;
    }
    if (Date.parse(fromDate) < Date.parse('01-Jan-2018')) {
      if (Date.parse(toDate) >= Date.parse('01-Jan-2018')) {
        this.swal('Info', 'Please select Actual Date of Discharge From before 01-Jan-2018', 'info');
        return;
      }
    }
    this.fromDate = fromDate;
    this.toDate = toDate;
    this.mortality = mortality;
    this.oldblocknewdischarge = [];
    this.currentPage = 1;
    this.pageElement = 100;
    let requestData = {
      userId: userId,
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),
      stateId: stateId,
      districtId: districtId,
      hospitalId: hospitalId,
      mortality: mortality,
      schemecategoryid: schemecategoryid
    };
    this.floatgenerationService.getoldblocknewdischarge(requestData).subscribe(
      (data: any) => {
        this.oldblocknewdischarge = data.oldnewList;
        this.oldblocknewdischargecount = data.oldnewList1;
        if (this.oldblocknewdischarge.length > 0) {
          this.record = this.oldblocknewdischarge.length;
          if (this.record > 0) {
            this.showPegi = true;
          } else {
            this.showPegi = false;
          }
        } else {
          this.swal('Info', 'No Data Found', 'info');
        }
      },
      (error) => {
        console.log(error);
        this.swal('Error', 'Something went wrong.', 'error');
      }
    );
  }
  reset() {

  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
  ///scheme
  scheme: any = [];
  schemeidvalue: any = 1;
  schemeName: any = ''
  getSchemeData() {
    let data = {
      action: 'A',
      schemeId: 1,
      schemeCategoryId: '',
    };
    let encData = this.encryptionService.encryptRequest(data);
    this.packageDetailsMasterService.getSchemeDetails(encData).subscribe((res: any) => {
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
      });
  }

  schemeList: any = [];
  getSchemeDetails() {
    let data = {
      action: 'B',
      schemeId: 1,
      schemeCategoryId: '',
    };
    let encData = this.encryptionService.encryptRequest(data);
    this.packageDetailsMasterService.getSchemeDetails(encData).subscribe((res: any) => {
      let resData = this.encryptionService.getDecryptedData(res);
      if (resData.status == 'success') {
        this.schemeList = resData.data;
      } else {
        this.swal('', 'Something went wrong.', 'error');

      }
    },
      (error) => {
        this.swal('', 'Something went wrong.', 'error');
      });
  }
  schemecategoryidvalue: any
  schemecategoryName: any;
  getschemacategoryid(event: any) {
    if (event != null && event != undefined && event != '' && event != "") {
      for (let i = 0; i < this.schemeList.length; i++) {
        if (event == this.schemeList[i].schemeCategoryId)
          this.schemecategoryidvalue = this.schemeList[i].schemeCategoryId;
        this.schemecategoryName = this.schemeList[i].categoryName;
      }
    } else {
      this.schemecategoryidvalue = '';
      this.schemecategoryName = "All"
    }
  }
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }
  headers: [
    'Sl No', 'Hospital Code', 'Hospital Name', 'District', 'URN', 'Invoice No', 'Claim No',
    'Case No', 'Patient Name', 'Gender', 'Procedure Code', 'Procedure Name', 'Speciality Code', 'Speciality Name', 'Package Cost (₹)',
    'Actual Date Of Admission', 'Actual Date Of Discharge', 'Mortality (Hospital)',
    'Mortality (CPD)', 'Mortality (SNA)', 'Hospital Claimed Amount (₹)', 'Implant Data', 'CPD Claim Status',
    'CPD Remarks', 'CPD Approved Amount (₹)', 'Claim Status', 'SNA Claim Status', 'SNA Remarks',
    'SNA Approved Amount(SNA/CPD) (₹)'
  ];
  formattedData = [];
  downloadReportforexcel(type: any) {
    if (type === 'xcl') {
      this.formattedData = [];
      this.oldblocknewdischarge.forEach((row, index) => {
        let snaApprovedAmount = '';
        if (row[33] === 'CLAIM RAISED') {
          snaApprovedAmount = row[29] === '-NA-' ? (row[26] !== '-NA-' ? '₹' + row[26] : '-NA-') : '₹' + row[29];
        } else if (row[33] === 'Non Uploading Initial Document') {
          snaApprovedAmount = '₹' + row[29];
        } else {
          snaApprovedAmount = '₹' + row[29];
        }
        let record = {
          Slno: index + 1,
          HospitalCode: row[3],
          HospitalName: row[2],
          District: row[1],
          URN: row[4],
          InvoiceNo: row[5],
          ClaimNo: row[6],
          CaseNo: row[7],
          PatientName: row[8],
          Gender: row[9],
          PackageCode: row[12],
          PackageName: row[13],
          Specialitycode: row[10],
          Specialityname: row[11],
          PackageCost: '₹' + row[14],
          ActualDateOfAdmission: row[16],
          ActualDateOfDischarge: row[17],
          MortalityHospital: row[20],
          MortalityCPD: row[21],
          MortalitySNA: row[34],
          HospitalClaimedAmount: '₹' + row[22],
          ImplantData: row[23],
          CPDClaimStatus: row[24],
          CPDRemarks: row[25],
          CPDApprovedAmount: '₹' + row[26],
          ClaimStatus: row[33],
          SNAClaimStatus: row[27],
          SNARemarks: row[28],
          SNAApprovedAmount: snaApprovedAmount
        };

        this.formattedData.push(record);
      });

      if (this.search != null && this.search !== '' && this.search !== undefined) {
        if (this.search == 1) {
          this.searchtype = "Normal";
        } else if (this.search == 2) {
          this.searchtype = "1.0 Block Data";
        }
      }

      let stateName = 'All', districtName = 'All', hospitalName = 'All';
      let stateId = this.stateId;
      let districtId = this.districtId;
      let hospitalId = this.hospitalId;
      let fromDate = $('#formdate').val();
      let toDate = $('#todate').val();
      let mortality = $('#mortality').val();

      for (let state of this.stateList) {
        if (stateId === state.stateCode) {
          stateName = state.stateName;
          break;
        }
      }

      for (let district of this.districtList) {
        if (districtId === district.districtcode) {
          districtName = district.districtname;
          break;
        }
      }

      for (let hospital of this.hospitalList) {
        if (hospitalId === hospital.hospitalCode) {
          hospitalName = hospital.hospitalName;
          break;
        }
      }

      let filter1 = [];
      filter1.push(['Actual Date of Discharge From:-', fromDate]);
      filter1.push(['Actual Date of Discharge To:-', toDate]);
      if (mortality === "Y") {
        filter1.push(['Mortality (CPD):-', "Yes"]);
      } else if (mortality === "N") {
        filter1.push(['Mortality (CPD):-', "No"]);
      } else {
        filter1.push(['Mortality (CPD):-', "All"]);
      }

      if (this.schemecategoryidvalue === '1') {
        filter1.push(['Scheme Category Name', "NFSA/SFSS"]);
      } else if (this.schemecategoryidvalue === '2') {
        filter1.push(['Scheme Category Name', "GJAY-1"]);
      } else {
        filter1.push(['Scheme Category Name', "All"]);
      }

      filter1.push(['State Name:-', stateName]);
      filter1.push(['District Name:-', districtName]);
      filter1.push(['Hospital Name:-', hospitalName]);

      // filter1.push(['Total Claim Raised:-', this.oldblocknewdischargecount[0]?.[0]]);
      filter1.push(['Total Cpd Approved:-', this.oldblocknewdischargecount[0]?.[1]]);
      filter1.push(['Total SNA Approved:-', this.oldblocknewdischargecount[0]?.[2]]);
      filter1.push(['Percent:-', this.oldblocknewdischargecount[0]?.[3]]);

      // Ensure headers are defined
      if (!this.headers || !Array.isArray(this.headers)) {
        this.headers = [
          'Sl No', 'Hospital Code', 'Hospital Name', 'District', 'URN', 'Invoice No', 'Claim No', 'Case No',
          'Patient Name', 'Gender', 'Procedure Code', 'Procedure Name', 'Speciality Code', 'Speciality Name', 'Package Cost (₹)', 'Actual Date Of Admission',
          'Actual Date Of Discharge', 'Mortality (Hospital)', 'Mortality (CPD)', 'Mortality (SNA)', 'Hospital Claimed Amount (₹)',
          'Implant Data', 'CPD Claim Status', 'CPD Remarks', 'CPD Approved Amount (₹)', 'Claim Status', 'SNA Claim Status',
          'SNA Remarks', 'SNA Approved Amount(SNA/CPD) (₹)'
        ];
      }

      TableUtil.exportListToExcelWithFilterforadmin2(this.formattedData, "1.0 Admission And 2.0 Discharge List", this.headers, filter1);
    }
  }

  // formattedDatapdf=[];
  // downloadReportforpdf(type: any) {
  //   if (type === 'pdf') {
  //     this.formattedDatapdf = [];
  //     this.oldblocknewdischarge.forEach((row, index) => {
  //       let record = {
  //         Slno: index + 1,
  //         HospitalCode: row[3],
  //         HospitalName: row[2],
  //         District: row[1],
  //         URN: row[4],
  //         InvoiceNo: row[5],
  //         ClaimNo: row[6],
  //         CaseNo: row[7],
  //         PatientName: row[8],
  //         Gender: row[9],
  //         PackageCode: row[12],
  //         PackageName: row[13],
  //         PackageCost: '₹' + row[14],
  //         ActualDateOfAdmission: row[16],
  //         ActualDateOfDischarge: row[17],
  //         MortalityHospital: row[20],
  //         MortalityCPD: row[21],
  //         HospitalClaimedAmount: '₹' + row[22],
  //         ImplantData: row[23],
  //         CPDClaimStatus: row[24],
  //         CPDRemarks: row[25],
  //         CPDApprovedAmount: '₹' + row[26],
  //         SNAClaimStatus: row[27],
  //         SNARemarks: row[28],
  //         SNAApprovedAmount: '₹' + row[29]
  //       };
  //       this.formattedDatapdf.push(record);
  //     });

  //     if (this.formattedDatapdf.length === 0) {
  //       Swal.fire("Info", "No data found", 'info');
  //       return;
  //     }

  //     let stateName = 'All', districtName = 'All', hospitalName = 'All';
  //     let stateId = this.stateId; // Assuming stateId, districtId, hospitalId are defined in your component
  //     let districtId = this.districtId;
  //     let hospitalId = this.hospitalId;
  //     let fromDate = $('#formdate').val(); // Use Angular FormControl or ngModel for date inputs
  //     let toDate = $('#todate').val();
  //     let mortality = $('#mortality').val();

  //     // Resolve stateName, districtName, hospitalName based on IDs
  //     // Assuming this.stateList, this.districtList, this.hospitalList are populated somewhere
  //     for (let state of this.stateList) {
  //       if (stateId === state.stateCode) {
  //         stateName = state.stateName;
  //         break;
  //       }
  //     }

  //     for (let district of this.districtList) {
  //       if (districtId === district.districtcode) {
  //         districtName = district.districtname;
  //         break;
  //       }
  //     }

  //     for (let hospital of this.hospitalList) {
  //       if (hospitalId === hospital.hospitalCode) {
  //         hospitalName = hospital.hospitalName;
  //         break;
  //       }
  //     }
  //     let header = [[
  //       'Sl No', 'Hospital Code', 'Hospital Name', 'District', 'URN', 'Invoice No', 'Claim No', 'Case No',
  //       'Patient Name', 'Gender', 'Package Code', 'Package Name', 'Package Cost (₹)', 'Actual Date Of Admission',
  //       'Actual Date Of Discharge', 'Mortality (Hospital)', 'Mortality (CPD)', 'Hospital Claimed Amount (₹)',
  //       'Implant Data', 'CPD Claim Status', 'CPD Remarks', 'CPD Approved Amount (₹)', 'SNA Claim Status',
  //       'SNA Remarks', 'SNA Approved Amount(SNA/CPD) (₹)'
  //     ]];
  //     let doc = new jsPDF('l', 'mm', [238, 270]);
  //     doc.setFontSize(10);
  //     doc.text('Hospital Name :-' + this.user.fullName + '(' + (this.user.userName) + ')', 5, 5);

  //     doc.text('Document Generate Date :-' + formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en').toString(), 5, 50);
  //     doc.text('Claims to Raise', 100, 52);
  //     doc.setLineWidth(0.7);
  //     doc.line(100, 53, 124, 53);
  //     autoTable(doc, {
  //       head: header, body: this.formattedDatapdf, startY: 55, theme: 'grid',
  //       styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
  //       bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 20 },
  //       headStyles: { lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255], fillColor: [26, 99, 54] },
  //       columnStyles: {
  //         0: { cellWidth: 8 },
  //         1: { cellWidth: 20 },
  //         2: { cellWidth: 20 },
  //         3: { cellWidth: 30 },
  //         4: { cellWidth: 13 },
  //         5: { cellWidth: 13 },
  //         6: { cellWidth: 15 },
  //         7: { cellWidth: 15 },
  //         8: { cellWidth: 15 },
  //         9: { cellWidth: 18 },
  //         10: { cellWidth: 15 },
  //         11: { cellWidth: 18 },
  //         12: { cellWidth: 18 },
  //         13: { cellWidth: 18 },

  //       }
  //     })
  //     doc.save('Claims_to_Raise_List.pdf');
  //   }
  // }


  getDetails(transactionId, claimId, claimRaiseStatus, urn) {
    console.log(transactionId + "transactionDetaisid");
    console.log(claimId + "claimid");
    console.log(claimRaiseStatus + "claimRaiseId");
    console.log(urn + "urn");
    if (claimRaiseStatus == 1) {
      let trnsId = transactionId;
      let clmId = claimId;
      if (clmId != null || clmId != undefined) {
        let state = {
          Urn: urn
        }
        localStorage.setItem("claimid", clmId);
        localStorage.setItem("trackingdetails", JSON.stringify(state));
        localStorage.setItem("token", this.jwtService.getJwtToken());
        this.route.navigate([]).then(result => { window.open(environment.routingUrl + '/trackingdetails'); });
      } else {
        localStorage.setItem("trnsId", trnsId);
        this.route.navigate(['/treatmentinfo']);
      }
    }
    if (claimRaiseStatus == 0) {
      let state = {
        txnid: transactionId,
        urn: urn
      }
      localStorage.setItem("history", JSON.stringify(state));
      localStorage.setItem("token", this.jwtService.getJwtToken())
      this.route.navigate([]).then(result => { window.open(environment.routingUrl + '/dischargelistHistoryHospital'); });
    }
  }
  getCountDetails() {
    this.showCount = true;
  }
}
