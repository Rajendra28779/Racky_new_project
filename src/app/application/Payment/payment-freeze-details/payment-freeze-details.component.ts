import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { JwtService } from 'src/app/services/jwt.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { PaymentfreezeserviceService } from '../../Services/paymentfreezeservice.service';
import { HeaderService } from '../../header.service';
import { TableUtil } from '../../util/TableUtil';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-payment-freeze-details',
  templateUrl: './payment-freeze-details.component.html',
  styleUrls: ['./payment-freeze-details.component.scss'],
})
export class PaymentFreezeDetailsComponent implements OnInit {
  freezedata: any;
  paymentDetails: any = [];
  detailsData: any = [];
  txtsearchDate: any;
  modaldata: any = [];
  user: any;
  currentPage: any;
  pageElement: any;
  showPegi: boolean;
  record: any;
  records: any;
  modaldata1: any;
  header: any;
  childmessage: any;
  constructor(
    private paymentService: PaymentfreezeserviceService,
    public datepipe: DatePipe,
    public headerService: HeaderService,
    public route: Router,
    private jwtService: JwtService,private sessionService: SessionStorageService
  ) { }

  ngOnInit(): void {
    this.headerService.setTitle('Payment Freeze Details');
    this.headerService.isIndicate(true);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.headerService.isBack(false);
    this.user = this.sessionService.decryptSessionData("user");
    this.currentPage = 1;
    this.pageElement = 50;
    this.freezedata = JSON.parse(localStorage.getItem('freezedata'));
    this.getFloatDetails();
  }

  getFloatDetails() {
    this.detailsData = [];
    this.paymentService
      .getFloatClaimDetails(this.freezedata.Action)
      .subscribe((alldata) => {
        this.paymentDetails = alldata;
        console.log(this.paymentDetails);
        this.detailsData = this.paymentDetails;
        this.record = this.detailsData.length;
        if (this.record > 0) {
          this.showPegi = true;
        } else {
          this.showPegi = false;
        }
      });
  }
  formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  });
  reports: any = [];
  snos: any = {
    SlNo: '',
    HospitalDetails: '',
    District: '',
    // GJAYIncentiveStatus: '',
    URN: '',
    InvoiceNo: '',
    ClaimNo: '',
    FloatNo: '',
    PatientName: '',
    Gender: '',
    PackageCode: '',
    PackageCost: '',
    PackageProcedure: '',
    ActualDateOfAdmission: '',
    ActualDateOfDischarge: '',
    mortality: '',
    mMortality: '',
    HospitalClaimedAmount: '',
    ImplantData: '',
    CPDClaimStatus: '',
    CPDRemarks: '',
    CPDApprovedAmount: '',
    SNAClaimStatus: '',
    SNARemarks: '',
    SNAApprovedAmount: '',
    JointCEOFinanceRemarks: '',
    FORemarks: '',
    JointCEOFinanceRemarksrevertcase: '',
    NodalOfficerRemark: '',
    Nodalofficer: '',
    RevisedApprovedAmount: '',
    JointCEOFinanceRemarksFOVerification: '',
    FinalFORemarks: '',
    InternalAuditorRemarks: '',
    DYCEOFinanceRemarks: '',
    FinalJointCEORemarks: '',
    CEORemarkRevertCase: '',
    SNARemarkRevertCase: '',
    CEORemark: '',
    SNAFinalRemark: '',
  };
  headings = [
    [
      'Sl No',
      'Hospital Details',
      'District',
      'GJAY Incentive Status',
      'URN',
      'Invoice No',
      'Claim No',
      'Float No',
      'Patient Name',
      'Gender',
      'Package Code',
      'Package Procedure',
      'Actual Date Of Admission	',
      'Actual Date Of Discharge',
      'Mortality (Hospital)',
      'Mortality (CPD)',
      'Hospital Claimed Amount',
      'Implant Data',
      'CPD Claim Status',
      'CPD Remarks',
      'CPD Approved Amount ',
      'SNA Claim Status',
      'SNA Remarks',
      'SNA Approved Amount(SNA/CPD)',
      'Joint CEO Finance Remarks',
      'FO Remarks',
      'Joint CEO Finance Remarks(Revert Case)',
      'Nodal Officer Remark	',
      'Revised Approved Amount',
      'Joint CEO Finance Remarks(FO Verification)',
      'Final FO Remarks',
      'Internal Auditor Remarks',
      'DY. CEO Finance Remarks',
      'Final Joint CEO Remarks',
      'CEO Remark Revert Case',
      'SNA Remark Revert Case',
      'CEO Remark',
      'SNA Final Remark',
    ],
  ];
  downloadReport(type: any) {
    this.reports = [];
    if (type == 'excel') {
      let item: any;
      for (var i = 0; i < this.detailsData.length; i++) {
        item = this.detailsData[i];
        console.log(item);
        this.snos = [];
        this.snos.SlNo = i + 1;
        this.snos.HospitalDetails =
          item.hospitalName + '(' + item.hospitalCode + ')';
        this.snos.District =
          item.districtName != null ? item.districtName : 'N/A';
        this.snos.BSKYIncentiveStatus =
          item.incenticeStatus != null ? item.incenticeStatus : 'N/A';
        this.snos.URN = item.urn != null ? item.urn : 'N/A';
        this.snos.InvoiceNo = item.invoiceNo != null ? item.invoiceNo : 'N/A';
        this.snos.ClaimNo = item.claimNo != null ? item.claimNo : 'N/A';
        this.snos.FloatNo = this.freezedata.Action ;
        this.snos.PatientName =item.patientName ;
        this.snos.Gender = item.gender != null ? item.gender : 'N/A';
        this.snos.PackageCode =
          item.packageCode != null ? item.packageCode : 'N/A';
        this.snos.PackageProcedure =
          item.procedureName != null ? item.procedureName : 'N/A';
        this.snos.ActualDateOfAdmission =item.actualDateOfAdmission != null? item.actualDateOfAdmission: 'N/A';
        this.snos.ActualDateOfDischarge =item.actualDateOfDischarge;
        this.snos.mortality =item.mortality;
        this.snos.mMortality =item.cpdMortality;
        this.snos.ImplantData =
          item.implantData != null ? item.implantData : 'N/A';
        this.snos.CPDClaimStatus =
          item.cpdClaimStatus != null ? item.cpdClaimStatus : 'N/A';
        this.snos.CPDRemarks = item.cpdRemarks ;
        this.snos.CPDApprovedAmount =
          item.cpdApprovedAmount != null ? item.cpdApprovedAmount : 'N/A';
        this.snos.SNAClaimStatus =
          item.snaClaimStatus != null ? item.snaClaimStatus : 'N/A';
        this.snos.SNARemarks =item.snaRemarks ;
        this.snos.SNAApprovedAmount =item.snaApprovedAmount;
        this.snos.JointCEOFinanceRemarks =item.jointCeoRemarks ;
        this.snos.FORemarks = item.foRemarks ;
        this.snos.JointCEOFinanceRemarksrevertcase =item.jointCeoRemarksRevert;
        this.snos.NodalOfficerRemark =item.noRemarks;
        this.snos.RevisedApprovedAmount =
          item.noApprovedAmount != null ? item.noApprovedAmount : 'N/A';
        this.snos.JointCEOFinanceRemarksFOVerification =item.jointCeoRemarksVerify;
        this.snos.FinalFORemarks =item.finalFoRemarks ;
        this.snos.InternalAuditorRemarks =
          item.audRemarks;
        this.snos.DYCEOFinanceRemarks =
          item.dyceoRemarks ;
        this.snos.FinalJointCEORemarks =
          item.jointCeoRemarksFinal;
        this.snos.CEORemarkRevertCase =
          item.ceoremarkrevertcase ;
        this.snos.SNARemarkRevertCase =
          item.snaremarkrevertcase ;
        this.snos.CEORemark = item.ceoremark ;
        this.snos.SNAFinalRemark =
          item.snafinalremark;
        this.reports.push(Object.assign({}, this.snos));
      }
      let filter = [];
      filter.push([['Float Number:-', this.freezedata.Action]]);
      TableUtil.exportListToExcelWithFilter(
        this.reports, "Payment Freeze Details", this.headings, filter
      );
    } else if (type == 'pdf') {
      if (this.detailsData.length == 0) {
        this.swal('', 'No Data Found', 'info');
        return;
      }
      let months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];
      let SlNo = 1;
      this.detailsData.forEach((element) => {
        let rowDatavalue = [];
        rowDatavalue.push(SlNo);
        rowDatavalue.push(
          element.hospitalName + '(' + element.hospitalCode + ')'
        );
        rowDatavalue.push(element.districtName);
        rowDatavalue.push(element.incenticeStatus);
        rowDatavalue.push(element.urn);
        rowDatavalue.push(element.invoiceNo);
        rowDatavalue.push(element.claimNo);
        rowDatavalue.push(this.freezedata.Action);
        rowDatavalue.push(element.patientName);
        rowDatavalue.push(element.gender);
        rowDatavalue.push(element.packageCode);
        rowDatavalue.push(element.procedureName);
        rowDatavalue.push(element.actualDateOfAdmission);
        rowDatavalue.push(element.actualDateOfDischarge);
        rowDatavalue.push(element.mortality);
        rowDatavalue.push(element.mMortality);
        rowDatavalue.push(element.totalAmountClaimed);
        rowDatavalue.push(element.implantData);
        rowDatavalue.push(element.cpdClaimStatus);
        rowDatavalue.push(element.cpdRemarks);
        rowDatavalue.push(element.cpdApprovedAmount);
        rowDatavalue.push(element.snaClaimStatus);
        rowDatavalue.push(element.snaRemarks);
        rowDatavalue.push(element.snaApprovedAmount!=null?element.snaApprovedAmount:"N/A");
        rowDatavalue.push(element.jointCeoRemarks !=null?element.jointCeoRemarks:"N/A");
        rowDatavalue.push(element.foRemarks !=null?element.foRemarks  :"N/A");
        rowDatavalue.push(element.jointCeoRemarksRevert!=null?element.jointCeoRemarksRevert  :"N/A");
        rowDatavalue.push(element.noRemarks !=null?element.noRemarks  :"N/A");
        // rowDatavalue.push(element.noApprovedAmount);
        rowDatavalue.push(element.jointCeoRemarksVerify !=null?element.jointCeoRemarksVerify  :"N/A");
        rowDatavalue.push(element.finalFoRemarks !=null?element.finalFoRemarks  :"N/A");
        rowDatavalue.push(element.audRemarks !=null?element.audRemarks  :"N/A");
        rowDatavalue.push(element.dyceoRemarks!=null?element.dyceoRemarks  :"N/A");
        rowDatavalue.push(element.jointCeoRemarksFinal!=null?element.jointCeoRemarksFinal  :"N/A");
        rowDatavalue.push(element.ceoremarkrevertcase !=null?element.ceoremarkrevertcase  :"N/A");
        rowDatavalue.push(element.snaremarkrevertcase !=null?element.snaremarkrevertcase  :"N/A");
        rowDatavalue.push(element.ceoremark !=null?element.ceoremark  :"N/A");
        rowDatavalue.push(element.snafinalremark !=null?element.snafinalremark  :"N/A");
        this.reports.push(rowDatavalue);
        SlNo++;
      });
      let doc = new jsPDF('l', 'mm', [238, 270]);
      doc.setFontSize(10);
      doc.text('Float Number:-' + this.freezedata.Action, 5, 5);
      doc.text('Generated By :-' + this.user.fullName, 5, 10);
      doc.text(
        ' Generate On : ' +
        formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString(), 5, 15
      );
      doc.text('Payment Freeze Details', 100, 20);
      doc.setLineWidth(0.7);
      autoTable(doc, {
        head: this.headings,
        body: this.reports,
        startY: 22,
        theme: 'grid',
        styles: {
          overflow: 'linebreak',
          halign: 'center',
          valign: 'middle',
          fontSize: 8,
          cellPadding: 1,
          lineWidth: 0.1,
          lineColor: 0,
          textColor: 20,
        },
        bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 20 },
        headStyles: {
          lineWidth: 0.1,
          lineColor: 0,
          textColor: [255, 255, 255],
          fillColor: [26, 99, 54],
        },
        columnStyles: {
          // 0: { cellWidth: 12 },
          // 1: { cellWidth: 12 },
          // 2: { cellWidth: 12 },
          // 3: { cellWidth: 12 },
          // 4: { cellWidth: 12 },
          // 5: { cellWidth: 12 },
          // 6: { cellWidth: 12 },
          // 7: { cellWidth: 12 },
          // 8: { cellWidth: 12 },
          // 9: { cellWidth: 12 },
          // 10: { cellWidth: 12 },
          // 11: { cellWidth: 12 },
          // 12: { cellWidth: 12 },
          // 13: { cellWidth: 12 },
          // 14: { cellWidth: 12 },
          // 15: { cellWidth: 12 },
          // 16: { cellWidth: 12 },
          // 17: { cellWidth: 12 },
        },
      });
      doc.save('Payment Freeze Details.pdf');
    }
  }
  showpagae: any;
  viewDescription(claimid: any) {
    this.paymentService.modalvalue(claimid).subscribe((alldata) => {
      this.modaldata = alldata;
      if (this.modaldata.length != 0) {
        $('#vlaue').hide();
      } else if (this.modaldata.length > 0) {
        $('#vlaue').show();
      }
    });
  }

  // editfordetails(item: any) {
  //   let claimId = item.claimId;
  //   this.newAmt = $('#' + claimId).val();
  //   if (this.newAmt == null || this.newAmt == '' || this.newAmt == undefined) {
  //     this.swal('Info', 'Please enter Amount', 'info');
  //     return;
  //   }
  //   // alert(newamount);
  //   let formattedAmt = this.formatter.format(this.newAmt);
  //   console.log(formattedAmt);
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: 'You want to update ' + 'amount to ' + formattedAmt + ' !!',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes, Update it!',
  //   }).then((res) => {
  //     if (res.isConfirmed) {
  //       this.paymentService
  //         .updateSnaApprvdAmnt(claimId, this.newAmt, this.user.userId)
  //         .subscribe((data) => {
  //           console.log(data);
  //           if (data.status == 'Success') {
  //             let snaAmount = data.message;
  //             let fsnaAmount = this.formatter.format(snaAmount);
  //             this.swal(
  //               'Info',
  //               'Amount has been updated to ' + fsnaAmount,
  //               'info'
  //             );
  //           } else if (data.status == 'Failed') {
  //             this.swal('Error', data.message, 'error');
  //           }
  //         });
  //     }
  //   });
  // }

  getActionDetails(claimid, urn: any,floatNumber) {
    localStorage.setItem('claimid', claimid);
    let state = {
      Urn: urn,
      Claimid: claimid,
      Floatnumber:floatNumber
    };
    localStorage.setItem('floatclaimdetails', JSON.stringify(state));
    localStorage.setItem('token', this.jwtService.getJwtToken());
    this.route.navigate([]).then((result) => {
      window.open(environment.routingUrl + '/floatclaimdetails');
    });
  }

  newAmt: any;
  // edit1(item: any) {
  //   let claimId = item.claimId;
  //   let newEditAmount = Math.round(item.snaApprovedAmount) || 0;
  //   let hospitalClaimAmount = Math.round(item.totalAmountClaimed) || 0;
  //   Swal.fire({
  //     title: 'Enter New Amount',
  //     icon: 'warning',
  //     html:
  //       '<div align="center"><div class="input-group mb-3" style="width: 200pt;">' +
  //       '<span class="input-group-text" id="basic-addon1"><i class="bi bi-currency-rupee"></i></span>' +
  //       '<input type="text" id="swal-input1" class="form-control" ' +
  //       'value="' +
  //       newEditAmount +
  //       '" onkeyup="this.value=this.value.replace(/[^0-9.]/g,\'\');" maxlength="8">' +
  //       '</div></div>',
  //     preConfirm: () => {
  //       return $('#swal-input1').val();
  //     },
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Submit',
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       let snaNewAmount = result.value;
  //       if (Number(snaNewAmount) > Number(hospitalClaimAmount)) {
  //         this.swal(
  //           '',
  //           'SNA Approved Amount should be less than Claim Amount',
  //           'info'
  //         );
  //         return;
  //       } else {
  //         if (snaNewAmount == '' || snaNewAmount == undefined || snaNewAmount == null) {
  //           this.newAmt = 0;
  //         } else {
  //           this.newAmt = snaNewAmount;
  //         }
  //       }
  //       let formattedAmt = this.formatter.format(this.newAmt);
  //       console.log(formattedAmt);
  //       Swal.fire({
  //         text:
  //           'Are you sure you want to update ' +
  //           'amount to ' +
  //           formattedAmt +
  //           ' ?',
  //         icon: 'question',
  //         showCancelButton: true,
  //         confirmButtonColor: '#3085d6',
  //         cancelButtonColor: '#d33',
  //         confirmButtonText: 'Yes, Update it!',
  //       }).then((res) => {
  //         if (res.isConfirmed) {
  //           this.paymentService
  //             .updateSnaApprvdAmnt(claimId, this.newAmt, this.user.userId)
  //             .subscribe((data) => {
  //               console.log(data);
  //               if (data.status == 'Success') {
  //                 let snaAmount = data.message;
  //                 let fsnaAmount = this.formatter.format(snaAmount);
  //                 Swal.fire({
  //                   icon: 'success',
  //                   title: 'Sucess',
  //                   text: 'Amount has been updated to ' + fsnaAmount,
  //                 }).then(() => {
  //                   // window.location.reload();
  //                   this.getFloatDetails();
  //                 });
  //               } else if (data.status == 'Failed') {
  //                 this.swal('Error', data.message, 'error');
  //               }
  //             });
  //         }
  //       });
  //     }
  //   });
  // }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
  pageItemChange() {
    this.pageElement = (<HTMLInputElement>(
      document.getElementById('pageItem')
    )).value;
    console.log(this.pageElement);
  }
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }

  paymentFreeze() {
    Swal.fire({
      title: this.freezedata.Action,
      text: 'Are you sure you want to freeze this payment?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Freeze it!',
    }).then((res) => {
      if (res.isConfirmed) {
        this.paymentService
          .paymentFreeze(this.freezedata.Action, this.user.userId)
          .subscribe((data) => {
            console.log(data);
            if (data.status == 'Success') {
              this.swal('Info', data.message, 'info');
              this.route.navigate(['/application/paymentFreezeList']);
            } else if (data.status == 'Failed') {
              this.swal('Error', data.message, 'error');
            }
          });
      }
    });
  }

  selectEvent(event) {
    let selectId = event.target.value;
    this.detailsData = [];
    if (selectId == '1') {
      this.detailsData = this.paymentDetails;
    } else {
      this.paymentDetails.forEach((element) => {
        if (element.foRemarks != undefined) {
          this.detailsData.push(element);
        }
      });
    }
    console.log(this.detailsData);
    this.record = this.detailsData.length;
    if (this.record > 0) {
      this.showPegi = true;
    } else {
      this.showPegi = false;
    }
  }
  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }
}
