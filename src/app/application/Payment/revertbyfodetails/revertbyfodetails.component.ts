import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';
import { PaymentfreezeserviceService } from '../../Services/paymentfreezeservice.service';
import { TableUtil } from '../../util/TableUtil';
import { HeaderService } from '../../header.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { JwtService } from 'src/app/services/jwt.service';
import { ForemarkService } from '../../Services/foremark.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-revertbyfodetails',
  templateUrl: './revertbyfodetails.component.html',
  styleUrls: ['./revertbyfodetails.component.scss'],
})
export class RevertbyfodetailsComponent implements OnInit {
  revertdata: any;
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
  pendingAt: any;
  floatNumber: any;
  isJCFR: boolean = false;
  isFR: boolean = false;
  isJCFRRC: boolean = false;
  isNR: boolean = false;
  isNORAM: boolean = false;
  isJCRVA: boolean = false;
  isFFR: boolean = false;
  isIAR: boolean = false;
  isDCFR: boolean = false;
  isFJCR: boolean = false;
  isIARRC: boolean = false;
  isEdit: boolean = false;
  isReverted: any;
  isCEORRC: boolean = false;
  isSNARRC: boolean = false;
  isCEOR: boolean = false;
  isSNAFR: boolean = false;
  iscolor: any;
  localData:any;
  constructor(
    private paymentService: PaymentfreezeserviceService,
    public datepipe: DatePipe,
    public headerService: HeaderService,
    public route: Router,
    private jwtService: JwtService,
    private foRemarkService: ForemarkService, private sessionService: SessionStorageService
  ) { }

  ngOnInit(): void {
    this.headerService.setTitle('Float Details');
    this.headerService.isIndicate(true);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.headerService.isBack(false);
    this.localData = JSON.parse(localStorage.getItem("floatclaimdetails"));
    if(this.localData != null || this.localData != undefined){
      this.searchTypeId = this.localData.searchTypeId;
    }else{
      this.searchTypeId = 1;
    }
    this.user = this.sessionService.decryptSessionData("user");
    this.currentPage = 1;
    this.pageElement = 50;
    this.revertdata = JSON.parse(localStorage.getItem('revertdata'));
    this.pendingAt = this.revertdata.pendingAt;
    this.floatNumber = this.revertdata.Action;
    this.getFloatDetails();
    this.getFoRemarkList();
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'remarkid',
      textField: 'remark',
      itemsShowLimit: 5,
      allowSearchFilter: true,
      selectAllText: 'Select All',
      unSelectAllText: "Un-Select All",
    };
  }
  colors: string[] = ['blue', 'red'];
  currentIndex: number = 0;
  totalApprovedAmount:any;
  getFloatDetails() {
    this.detailsData = [];
    this.totalApprovedAmount = 0;
    this.paymentService.getFloatClaimDetails(this.revertdata.Action).subscribe(
      (alldata) => {
        this.paymentDetails = alldata;
        console.log(this.paymentDetails);
        this.detailsData = this.paymentDetails;
        this.record = this.detailsData.length;
        if (this.record > 0) {
          this.showPegi = true;
        } else {
          this.showPegi = false;
        }
        this.detailsData.forEach((element, index) => {
          this.totalApprovedAmount = Number(this.totalApprovedAmount)+Number(element.snoApprovedAmount);
          if (Number(element.totalAmountClaimed) > Number(element.snoApprovedAmount) && element.pendingAt == 4 && element.foRemarks == null) {
            element.colorStatus = 0;
            // this.iscolor = 'GREEN';
          }
          else if (element.pendingAt == 4 && element.noRemarks != null) {
            element.colorStatus = 2;
            // this.iscolor = 'RED';
          }
          else if (element.pendingAt == 4 && element.foRemarks != null) {
            element.colorStatus = 1;
            // this.iscolor = 'RED';
          }
          if (element.isFloatGenerate == 1) {
            setInterval((timeout) => {
              $('#tags' + index).css({
                color: this.colors[this.currentIndex]
              });
              if (!this.colors[this.currentIndex]) {
                this.currentIndex = 0;
              } else {
                this.currentIndex++;
              }
            }, 200);
          }

        });
        this.totalApprovedAmount = Math.round(this.totalApprovedAmount);
        let pendingAt = this.paymentDetails[0].pendingAt;
        this.isReverted = this.paymentDetails[0].isReverted;
        if (pendingAt == 1) {
          this.isJCFR = true;
        } else if (pendingAt == 2) {
          this.isJCFR = true;
          this.isFR = true;
        } else if (pendingAt == 3) {
          this.isJCFR = true;
          this.isFR = true;
          this.isIARRC = true;
          // this.isJCFRRC = true;
        } else if (pendingAt == 0) {
          this.isJCFR = true;
          this.isFR = true;
          this.isIARRC = true;
          this.isJCFRRC = true;
        } else if (pendingAt == 4) {
          this.isJCFR = true;
          this.isFR = true;
          this.isJCFRRC = true;
          this.isNR = true;
          this.isNORAM = true;
          this.isIARRC = true;
        } else if (pendingAt == 5) {
          this.isJCFR = true;
          this.isFR = true;
          this.isJCFRRC = true;
          this.isNR = true;
          this.isNORAM = true;
          this.isJCRVA = true;
          this.isIARRC = true;
        } else if (pendingAt == 6) {
          this.isJCFR = true;
          this.isFR = true;
          this.isJCFRRC = true;
          this.isNR = true;
          this.isNORAM = true;
          this.isJCRVA = true;
          this.isFFR = true;
          this.isIARRC = true;
        } else if (pendingAt == 7) {
          this.isJCFR = true;
          this.isFR = true;
          this.isIAR = true;
          if (this.isReverted != 0) {
            this.isJCFRRC = true;
            this.isNR = true;
            this.isNORAM = true;
            this.isJCRVA = true;
            this.isFFR = true;
            this.isIARRC = true;
          }
        } else if (pendingAt == 8) {
          this.isJCFR = true;
          this.isFR = true;
          this.isIAR = true;
          this.isDCFR = true;
          if (this.isReverted != 0) {
            this.isJCFRRC = true;
            this.isNR = true;
            this.isNORAM = true;
            this.isJCRVA = true;
            this.isFFR = true;
            this.isIARRC = true;
          }
        } else if (pendingAt == 9) {
          this.isJCFR = true;
          this.isFR = true;
          this.isIAR = true;
          this.isDCFR = true;
          this.isFJCR = true;
          if (this.isReverted != 0) {
            this.isJCFRRC = true;
            this.isNR = true;
            this.isNORAM = true;
            this.isJCRVA = true;
            this.isFFR = true;
            this.isIARRC = true;
          }
        } else if (pendingAt == 10) {
          this.isJCFR = true;
          this.isFR = true;
          this.isIAR = true;
          this.isDCFR = true;
          this.isFJCR = true;
          this.isEdit = true;
          if (this.isReverted != 0) {
            this.isJCFRRC = true;
            this.isNR = true;
            this.isNORAM = true;
            this.isJCRVA = true;
            this.isFFR = true;
            this.isIARRC = true;
          }
        } else if (pendingAt <= 11) {
          this.isJCFR = true;
          this.isFR = true;
          this.isIAR = true;
          this.isDCFR = true;
          this.isFJCR = true;
          this.isCEORRC = true;
          this.isSNARRC = true;
          this.isCEOR = true;
          this.isSNAFR = true;
        } else if (pendingAt <= 13) {
          this.isJCFR = true;
          this.isFR = true;
          this.isIAR = true;
          this.isDCFR = true;
          this.isFJCR = true;
          this.isCEORRC = true;
          this.isSNARRC = true;
          this.isCEOR = true;
          this.isSNAFR = true;
        }
          this.selectEvent(this.searchTypeId);
      }
    );
  }
  formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  });
  reports: any = [];
  snos: any = {
    slNo: '',
    floatNo: '',
    urn: '',
    claimNo: '',
    invoicenumber: '',
    patientname: '',
    actualdateofadmission: '',
    actualdateofdischarge: '',
    claimamount: '',
    cpdapprovedamount: '',
    snaapprovedamount: '',
    foremarks: '',
  };
  headings = [
    [
      'Sl No',
      'Float No',
      'URN',
      'Claim No',
      'Invoice Number',
      'Patient Name',
      'Actual Date of Admission',
      'Actual Date of Discharge',
      'Claim Amount',
      'CPD Approved Amount',
      'SNA Approved Amount',
      'FO Remarks',
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
        this.snos.slNo = i + 1;
        this.snos.floatNo = this.floatNumber;
        this.snos.urn = item.urn;
        this.snos.claimNo = item.claimNo;
        this.snos.invoicenumber = item.invoiceNo;
        this.snos.patientname = item.patientName;
        this.snos.actualdateofadmission = this.datepipe.transform(
          item.actualDateOfAdmission,
          'dd-MMM-yyyy'
        );
        this.snos.actualdateofdischarge = this.datepipe.transform(
          item.actualDateOfDischarge,
          'dd-MMM-yyyy'
        );
        if (item.totalAmountClaimed) {
          this.snos.claimamount = this.formatter.format(
            item.totalAmountClaimed
          );
        } else {
          this.snos.claimamount = this.formatter.format(0);
        }
        if (item.cpdApprovedAmount) {
          this.snos.cpdapprovedamount = this.formatter.format(
            item.cpdApprovedAmount
          );
        } else {
          this.snos.cpdapprovedamount = this.formatter.format(0);
        }
        if (item.snoApprovedAmount) {
          this.snos.snoApprovedAmount = this.formatter.format(
            item.snoApprovedAmount
          );
        } else {
          this.snos.snoApprovedAmount = this.formatter.format(0);
        }
        this.snos.foremarks = item.foRemarks != null ? item.foRemarks : '-NA-';
        this.reports.push(this.snos);
      }
      let filter = [];
      TableUtil.exportListToExcelWithFilter(this.reports, this.floatNumber, this.headings, filter);
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
        rowDatavalue.push(SlNo++);
        rowDatavalue.push(element.floatNumber);
        rowDatavalue.push(element.urn);
        rowDatavalue.push(element.claimNo);
        rowDatavalue.push(element.invoiceNo);
        rowDatavalue.push(element.patientName);
        rowDatavalue.push(
          this.datepipe.transform(element.actualDateOfAdmission, 'dd-MMM-yyyy')
        );
        rowDatavalue.push(
          this.datepipe.transform(element.actualDateOfDischarge, 'dd-MMM-yyyy')
        );
        if (element.totalAmountClaimed) {
          rowDatavalue.push(element.totalAmountClaimed);
        } else {
          rowDatavalue.push(0);
        }
        if (element.cpdApprovedAmount) {
          rowDatavalue.push(element.cpdApprovedAmount);
        } else {
          rowDatavalue.push(0);
        }
        if (element.snoApprovedAmount) {
          rowDatavalue.push(element.snoApprovedAmount);
        } else {
          rowDatavalue.push(0);
        }
        rowDatavalue.push(
          element.foRemarks != null ? element.foRemarks : '-NA-'
        );
        this.reports.push(rowDatavalue);
      });
      let doc = new jsPDF('l', 'mm', [238, 270]);
      doc.setFontSize(10);
      doc.text('Generated By :-' + this.user.fullName, 5, 5);
      doc.text(' Generate On : ' + formatDate(new Date(), 'dd-MM-yyyy hh:mm:ss a', 'en-US', '+0530'), 5, 10);
      doc.text('Payment Freeze Details', 100, 25);
      doc.setLineWidth(0.7);
      doc.line(100, 26, 138, 26);
      autoTable(doc, {
        head: this.headings,
        body: this.reports,
        startY: 28,
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
          0: { cellWidth: 8 },
          1: { cellWidth: 40 },
          2: { cellWidth: 20 },
          3: { cellWidth: 20 },
          4: { cellWidth: 20 },
          5: { cellWidth: 20 },
          6: { cellWidth: 20 },
          7: { cellWidth: 20 },
          8: { cellWidth: 20 },
          9: { cellWidth: 20 },
          10: { cellWidth: 20 },
          11: { cellWidth: 20 },
        },
      });
      doc.save(this.floatNumber + '.pdf');
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

  getActionDetails(claimid, urn: any, floatNumber: any) {
    localStorage.setItem('claimid', claimid);
    let state = {
      Urn: urn,
      Claimid: claimid,
      Floatnumber: floatNumber,
      searchTypeId:this.searchTypeId
    }
    localStorage.setItem("floatclaimdetails", JSON.stringify(state));
    localStorage.setItem('token', this.jwtService.getJwtToken());
    this.route.navigate([]).then((result) => {
      window.open(environment.routingUrl + '/floatclaimdetails');
    });
  }

// newAmt: any;
// maxChars = 500;
// text:any='';
// edit1(item: any) {
//   let claimId = item.claimId;
//   let newEditAmount = Math.round(item.noApprovedAmount ? item.noApprovedAmount : item.snoApprovedAmount) || 0;
//   let hospitalClaimAmount = Math.round(item.totalAmountClaimed) || 0;
//   let remarks = item.noRemarks == null ? '' : item.noRemarks;

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
//       '</div><div style="width: 250pt;"><textarea id="swal-input2" class="form-control" style=" height: 70pt;"' +
//       'placeholder="Enter Remarks" maxlength=' + this.maxChars + '>' + remarks + '</textarea></div>' +
//       '<span class="text-danger small"> Maximum Characters Allowed: ' + this.maxChars + '</span>' +
//       '</div>',
//     preConfirm: () => {
//       return [
//         (document.getElementById('swal-input1') as HTMLInputElement).value,
//         (document.getElementById('swal-input2') as HTMLInputElement).value
//       ];
//     },
//     showCancelButton: true,
//     confirmButtonColor: '#3085d6',
//     cancelButtonColor: '#d33',
//     confirmButtonText: 'Submit',
//     // showDenyButton: true,
//     // denyButtonText: 'Hold',
//     // denyButtonColor: '#ffc107'
//   }).then((result) => {
//     if (result.isConfirmed || result.isDenied) {
//       let snaNewAmount = (document.getElementById('swal-input1') as HTMLInputElement).value;
//       let remark1 = (document.getElementById('swal-input2') as HTMLInputElement).value;

//       if (Number(snaNewAmount) > Number(hospitalClaimAmount)) {
//         this.swal('', 'SNA Approved Amount should be less than Claim Amount', 'info');
//         return;
//       } else {
//         if (snaNewAmount == '0' || snaNewAmount == '' || snaNewAmount == undefined || snaNewAmount == null) {
//           this.swal('', 'SNA approved amount should not be zero', 'info');
//           return;
//         } else {
//           this.newAmt = snaNewAmount;
//         }
//       }

//       let formattedAmt = this.formatter.format(this.newAmt);
//       let actionText = result.isConfirmed ? 'update' : 'hold';
//       if(actionText ==='update'){
//          this.text ='Are you sure you want to update' + ' amount to ' + formattedAmt + ' ?'
//       }else if(actionText ==='hold'){
//         if(Number(newEditAmount) ===Number(this.newAmt)){
//           this.text ='Are you sure you want to Hold'
//        }else{
//          this.swal('Info', "You Can Not Change The Amount", 'info');
//          return;
//        }
//       }
//       Swal.fire({
//         text: this.text,
//         icon: 'question',
//         showCancelButton: true,
//         confirmButtonColor: '#3085d6',
//         cancelButtonColor: '#d33',
//         confirmButtonText: 'Yes, ' + (result.isConfirmed ? 'Update it!' : 'Hold it!'),
//       }).then((res) => {
//         if (res.isConfirmed) {
//           let serviceCall;
//           if (result.isConfirmed) {
//             serviceCall = this.paymentService.updateSnaApprvdAmnt(claimId, this.newAmt, this.user.userId, remark1,'0');
//           } else if (result.isDenied) {
//             serviceCall = this.paymentService.updateSnaApprvdAmnt(claimId, this.newAmt, this.user.userId, remark1,'1');
//           }
//           serviceCall.subscribe((data) => {
//             console.log(data);
//             if (data.status == 'Success') {
//               let snaAmount = data.message;
//               let fsnaAmount = this.formatter.format(snaAmount);
//               Swal.fire({
//                 icon: 'success',
//                 title: result.isConfirmed ? 'Success' : 'Hold',
//                 text: result.isConfirmed ? 'Amount has been updated to ' + fsnaAmount : 'Claim has been put on hold.',
//               }).then(() => {
//                 this.getFloatDetails();
//               });
//             } else if (data.status == 'Failed') {
//               this.swal('Error', data.message, 'error');
//             }
//           });
//         }
//       });
//     }
//   });
// }
newAmt: any;
  maxChars = 500;
  edit1(item: any) {
    let claimId = item.claimId;
    let newEditAmount = Math.round(item.noApprovedAmount ? item.noApprovedAmount : item.snoApprovedAmount) || 0;
    let hospitalClaimAmount = Math.round(item.totalAmountClaimed) || 0;
    let remarks = item.noRemarks == null ? '' : item.noRemarks;
    Swal.fire({
      title: 'Enter New Amount',
      icon: 'warning',
      html:
        '<div align="center"><div class="input-group mb-3" style="width: 200pt;">' +
        '<span class="input-group-text" id="basic-addon1"><i class="bi bi-currency-rupee"></i></span>' +
        '<input type="text" id="swal-input1" class="form-control" ' +
        'value="' +
        newEditAmount +
        '" onkeyup="this.value=this.value.replace(/[^0-9.]/g,\'\');" maxlength="8">' +
        '</div><div style="width: 250pt;"><textarea id="swal-input2" class="form-control" style=" height: 70pt;"' +
        'placeholder="Enter Remarks" maxlength=' + this.maxChars + '>' + remarks + '</textarea></div>' +
        '<span class="text-danger small"> Maximum Characters Allowed: ' + this.maxChars + '</span>' +
        '</div>',
      preConfirm: () => {
        return [
          $('#swal-input1').val(),
          $('#swal-input2').val()
        ];
      },
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Submit',
    }).then((result) => {
      console.log(result);
      if (result.isConfirmed) {
        console.log("inside");
        let snaNewAmount = result.value[0];
        let remark1 = result.value[1];
        if (Number(snaNewAmount) > Number(hospitalClaimAmount)) {
          this.swal(
            '',
            'SNA Approved Amount should be less than Claim Amount',
            'info'
          );
          return;
        } else {
          if (snaNewAmount == '0' || snaNewAmount == 0 || snaNewAmount == '' || snaNewAmount == undefined || snaNewAmount == null) {
            this.swal(
              '',
              'SNA approved amount should not be zero',
              'info'
            );
            return;
          } else {
            this.newAmt = snaNewAmount;
          }
        }
        let formattedAmt = this.formatter.format(this.newAmt);
        console.log(formattedAmt);
        console.log(remark1);
        Swal.fire({
          text:
            'Are you sure you want to update ' +
            'amount to ' +
            formattedAmt +
            ' ?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, Update it!',
        }).then((res) => {
          if (res.isConfirmed) {
            this.paymentService.updateSnaApprvdAmnt(claimId, this.newAmt, this.user.userId, remark1).subscribe(
              (data) => {
                console.log(data);
                if (data.status == 'Success') {
                  let snaAmount = data.message;
                  let fsnaAmount = this.formatter.format(snaAmount);
                  Swal.fire({
                    icon: 'success',
                    title: 'Sucess',
                    text: 'Amount has been updated to ' + fsnaAmount,
                  }).then(() => {
                    this.getFloatDetails();
                  });
                } else if (data.status == 'Failed') {
                  this.swal('Error', data.message, 'error');
                }
              });
          }
        });
      }
    });
  }


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
forward() {
  // this.pendingAt=5;
  Swal.fire({
    title: this.revertdata.Action,
    text: 'Are you sure you want to Forward this Record?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes',
    html:
      '<div align="center"><strong>Are you sure you want to Forward this Record?</strong>' +
      '<div class="input-group mb-3" style="width: 300pt; height: 80pt;">' +
      '<textarea id="swal-input1" class="form-control" placeholder="Enter Remarks"></textarea>' +
      '</div></div>',
    preConfirm: () => {
      return $('#swal-input1').val();
    },
  }).then((res) => {
    if (res.isConfirmed) {
      let remarks = res.value;
      this.paymentService
        .paymentForward(this.revertdata.floatId, this.user.userId, remarks, this.pendingAt)
        .subscribe((data) => {
          console.log(data);
          if (data.status == 'success') {
            if (data.data.status == 'success') {
              this.swal('', 'Float Forward Successfully', 'success');//data.data.message
              this.route.navigate(['/application/paymentFreezeList']);
            } else {
              this.swal('Info', data.data.message, 'info');
            }
          } else if (data.status == 'fail') {
            this.swal('Error', data.message, 'error');
          }
        });
    }
  });
}
searchTypeId:any;
selectEvent(event) {
  let selectId = event;
  this.searchTypeId = selectId;
  this.detailsData = [];
  if (selectId == '1') {
    this.detailsData = this.paymentDetails;
  } if (selectId == 2) {
    this.paymentDetails.forEach((element) => {
      if (element.foRemarks != undefined || element.finalFoRemarks != undefined) {
        this.detailsData.push(element);
      }
    });
  } else if (selectId == 4) {
    this.paymentDetails.forEach(element => {
      if (element.isBulkApproved == 'Yes') {
        this.detailsData.push(element);
      }
    });
  } else if (selectId == 5) {
    this.paymentDetails.forEach(element => {
      if (element.isApproved != 0) {
        this.detailsData.push(element);
      }
    });
  } else if (selectId == 6) {
    this.paymentDetails.forEach(element => {
      if (element.isRejected != 0) {
        this.detailsData.push(element);
      }
    });
  } else if (selectId == 7) {
    this.paymentDetails.forEach(element => {
      if (element.isUnprocessed != 0) {
        this.detailsData.push(element);
      }
    });
  } else if (selectId == 8) {
    this.paymentDetails.forEach(element => {
      if (element.isQueryByCpd != 0) {
        this.detailsData.push(element);
      }
    });
  } else if (selectId == 9) {
    this.paymentDetails.forEach(element => {
      if (element.isReclaim != 0) {
        this.detailsData.push(element);
      }
    });
  } else if (selectId == 10) {
    this.paymentDetails.forEach(element => {
      if (element.isQueryBySna != 0) {
        this.detailsData.push(element);
      }
    });
  } else if (selectId == 11) {
    this.paymentDetails.forEach(element => {
      if (element.jointCeoRemarks != undefined) {
        this.detailsData.push(element);
      }
    });
  } else if (selectId == 12) {
    this.paymentDetails.forEach(element => {
      if (element.audRemarks != undefined || element.iarRevertCase != undefined) {
        this.detailsData.push(element);
      }
    });
  } else if (selectId == 13) {
    this.paymentDetails.forEach(element => {
      if (element.dyceoRemarks != undefined) {
        this.detailsData.push(element);
      }
    });
  } else if (selectId == 14) {
    this.paymentDetails.forEach(element => {
      if (element.ceoRemark != undefined) {
        this.detailsData.push(element);
      }
    });
  }else if (selectId == 15) {
    this.paymentDetails.forEach((element) => {
      if (element.foRemarks == null && element.noRemarks != null) {
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

  this.detailsData.forEach((element,index) => {
    if (element.isFloatGenerate == 1) {
      setInterval((timeout) => {
        $('#tags' + index).css({
          color: this.colors[this.currentIndex]
        });
        if (!this.colors[this.currentIndex]) {
          this.currentIndex = 0;
        } else {
          this.currentIndex++;
        }
      }, 200);
    }
  });
}
getResponseFromUtil(parentData: any) {
  this.childmessage = parentData;
}
foremarkList: any = [];
getFoRemarkList() {
  this.foRemarkService.getActivateData().subscribe(
    (response) => {
      this.foremarkList = response;
      console.log(this.foremarkList);
    },
    (error) => console.log(error)
  )
}
filterFloatDetails(event) {
  let remarkId = event.target.value;
  this.detailsData = [];
  console.log(this.detailsData);
  this.paymentDetails.forEach(element => {
    if (element.remarkId == remarkId) {
      this.detailsData.push(element);
    } else if (remarkId == 1) {
      this.detailsData = this.paymentDetails;
    }
  });
}
placeHolder = "Select Remark";
dropdownSettings: IDropdownSettings = {};
selectedItems: any = [];
remarkLists: any = [];
onItemSelect(item) {
  if(this.userBy ==1){
    this.swal("","Please Select User Type","info");
    return;
  }else{
    this.remarkLists.push(item);
    console.log(this.remarkLists);
    this.detailsData = [];
    if(this.userBy == 2){
      this.paymentDetails.forEach((element) => {
        this.remarkLists.forEach((element1) => {
          if (element.remarkId == element1.remarkid) {
            this.detailsData.push(element);
          }
        });
      });
    }else if (this.userBy == 3){
      this.paymentDetails.forEach((element) => {
        this.remarkLists.forEach((element1) => {
          if (element.audRemarkId == element1.remarkid) {
            this.detailsData.push(element);
          }
        });
      });
    }

    console.log(this.detailsData);
  }
}
onItemDeSelect(item) {
  console.log(this.remarkLists);
  for (var i = 0; i < this.remarkLists.length; i++) {
    if (item.remarkid == this.remarkLists[i].remarkid) {
      var index = this.remarkLists.indexOf(this.remarkLists[i]);
      if (index !== -1) {
        this.remarkLists.splice(index, 1);
      }
    }
  }
  this.detailsData = [];
  if(this.userBy == 2){
    this.paymentDetails.forEach((element) => {
      this.remarkLists.forEach((element1) => {
        if (element.remarkId == element1.remarkid) {
          this.detailsData.push(element);
        }
      });
    });
  }else if (this.userBy == 3){
    this.paymentDetails.forEach((element) => {
      this.remarkLists.forEach((element1) => {
        if (element.audRemarkId == element1.remarkid) {
          this.detailsData.push(element);
        }
      });
    });
  }
  if (this.remarkLists.length == 0) {
    this.detailsData = this.paymentDetails;
  }
  console.log(this.detailsData);
}
onSelectAll(list) {
  if(this.userBy ==1){
    this.swal("","Please Select User Type","info");
    return;
  }else{
    this.remarkLists = list;
    console.log(this.remarkLists);
    this.detailsData = this.paymentDetails;
  }
}
onDeSelectAll(list) {
  this.remarkLists = list;
  console.log(this.remarkLists);
  this.detailsData = this.paymentDetails;
}
userBy:any = 1;
selectUserEvent(event){
  this.userBy = event.target.value;
}
}
