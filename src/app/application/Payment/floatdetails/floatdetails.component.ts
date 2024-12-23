import { Component, OnInit, ViewChild } from '@angular/core';
import { HeaderService } from '../../header.service';
import { PaymentfreezeserviceService } from '../../Services/paymentfreezeservice.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { TableUtil } from '../../util/TableUtil';
import { DatePipe, formatDate } from '@angular/common';
import { environment } from 'src/environments/environment';
import { JwtService } from 'src/app/services/jwt.service';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { ForemarkService } from '../../Services/foremark.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FormControl, FormGroup } from '@angular/forms';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-floatdetails',
  templateUrl: './floatdetails.component.html',
  styleUrls: ['./floatdetails.component.scss'],
})
export class FloatdetailsComponent implements OnInit {
  pageElement: any;
  currentPage: any;
  txtsearchDate: any;
  showPegi: boolean;
  floatDetails: any = [];
  resData: any;
  user: any;
  record: any;
  floatNumber: any;
  maxChars = 1000;
  hideStatus: boolean = true;
  hideOption: boolean = true;
  hideBtn: boolean = true;
  RemarkhideStatus: boolean = true;
  childmessage: any;
  searchType: any;
  searchTypeValue: any;
  statusvalue: any;
  searchTypeinView: any;
  showRemark: boolean = false;
  iscolor: any;
  constructor(
    public headerService: HeaderService,
    public paymentfreezeService: PaymentfreezeserviceService,
    public route: Router,
    private jwtService: JwtService,
    private foRemarkService: ForemarkService,private sessionService: SessionStorageService
  ) { }

  ngOnInit(): void {
    this.headerService.setTitle('Float Details');
    this.headerService.isIndicate(true);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.headerService.isBack(false);
    this.user = this.sessionService.decryptSessionData("user");
    this.currentPage = 1;
    this.pageElement = 50;
    this.floatNumber =this.sessionService.decryptSessionData('floatNumber');
    this.statusvalue = this.sessionService.decryptSessionData('Status');
    this.searchType = this.sessionService.decryptSessionData('Searchtype');
    this.searchTypeinView = this.sessionService.decryptSessionData('Searchtypeinview');
    if (this.searchType == 1) {
      this.searchTypeValue = 'Fresh';
      this.hideStatus = false;
    } else if (this.searchType == 5) {
      this.searchTypeValue = 'Compliance By SNA';
      this.hideStatus = false;
    } else if (this.searchType == 6) {
      this.searchTypeValue = 'Compliance By Joint CEO';
    } else if (this.searchType == 2) {
      this.searchTypeValue = 'Fresh';
    } else if (this.searchType == 3) {
      this.searchTypeValue = 'Reverted By FO';
      this.hideStatus = false;
    } else if (this.searchType == 7) {
      this.searchTypeValue = 'Verified By FO';
      this.hideStatus = false;
    } else if (this.searchType == 8) {
      this.searchTypeValue = 'Forwarded By Internal Auditor';
      this.hideStatus = false;
    } else if (this.searchType == 9) {
      this.searchTypeValue = 'Verified By Deputy CEO';
      this.hideStatus = false;
    } else if (this.searchType == 11) {
      this.searchTypeValue = 'Verified By SNA';
      this.hideStatus = false;
    } else if (this.searchType == 13) {
      this.searchTypeValue = 'Observed By SNA';
      this.hideStatus = false;
    } else if (this.searchType == 0) {
      this.searchTypeValue = 'Observation From FO';
      this.hideStatus = false;
    } else if (this.searchType == 15) {
      this.searchTypeValue = 'Observation From Auditor';
      this.hideStatus = false;
    }
    this.getDetails();
    this.getFoRemarkList();
    if (this.user.groupId == 8 || this.user.groupId == 40) {
      this.showRemark = true;
    }
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
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }
  pageItemChange() {
    // this.ngOnInit();
    this.pageElement = (<HTMLInputElement>(
      document.getElementById('pageItem')
    )).value;
    console.log(this.pageElement);
    // alert("Page Capcity Extended Upto " + this.pageElement);
  }
  snoName: any;
  createdByName: any;
  backUpData: any = [];

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
  pendingAt: any;
  isReverted: any;
  isCEORRC: boolean = false;
  isSNARRC: boolean = false;
  isCEOR: boolean = false;
  isSNAFR: boolean = false;
  colors: string[] = ['blue', 'red'];
  currentIndex: number = 0;
  totalpackagecost:any=0;
  totalamountclaimed:any=0;
  totalcpdApprovedAmount:any=0;
  totalApprovedAmount:any=0;
  totalnoapprovedamount:any=0;
  getDetails() {
    this.totalpackagecost = 0;
    this.totalamountclaimed = 0;
    this.totalcpdApprovedAmount = 0;
    this.totalApprovedAmount = 0;
    this.totalnoapprovedamount = 0;
    this.paymentfreezeService.getFloatClaimDetails(this.floatNumber).subscribe(
      (data) => {
        this.resData = data;
        console.log(data);
        // if (this.resData.status == 'success') {
        this.floatDetails = this.resData;
        console.log(this.floatDetails);
        this.backUpData = this.floatDetails;
        this.floatDetails.forEach((element, index) => {
          this.totalpackagecost = Number(this.totalpackagecost)+Number(element.packageCost);
          this.totalamountclaimed = Number(this.totalamountclaimed)+Number(element.totalAmountClaimed?element.totalAmountClaimed:0);
          this.totalcpdApprovedAmount = Number(this.totalcpdApprovedAmount)+Number(element.cpdApprovedAmount?element.cpdApprovedAmount:0);
          this.totalApprovedAmount = Number(this.totalApprovedAmount)+Number(element.snoApprovedAmount);
          this.totalnoapprovedamount = Number(this.totalnoapprovedamount)+Number(element.noApprovedAmount?element.noApprovedAmount:0);
          if (Number(element.totalAmountClaimed) > Number(element.snoApprovedAmount) && element.pendingAt == 3 && element.foRemarks == null) {
            element.colorStatus = true;
            this.iscolor = 'GREEN';
          }
          else if (element.pendingAt == 3 && element.foRemarks != null) {
            element.colorStatus = false;
            this.iscolor = 'RED';
          } else if (element.pendingAt == 0 && element.foRemarks != null) {
            element.colorStatus = false;
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
        this.totalpackagecost = Math.round(this.totalpackagecost);
        this.totalamountclaimed = Math.round(this.totalamountclaimed);
        this.totalcpdApprovedAmount = Math.round(this.totalcpdApprovedAmount);
        this.totalApprovedAmount = Math.round(this.totalApprovedAmount);
        this.totalnoapprovedamount = Math.round(this.totalnoapprovedamount);
        this.float = this.floatNumber;
        this.createdByName = this.floatDetails[0]?.createdBy;
        this.snoName = this.floatDetails[0]?.snaName;
        this.record = this.floatDetails.length;
        if (
          this.statusvalue != undefined &&
          this.statusvalue != null &&
          this.statusvalue != '' &&
          this.statusvalue == 'B'
        ) {
          $('#action').hide();
          this.hideStatus = false;
          this.hideBtn = false;
        }
        // if (this.statusvalue != undefined && this.statusvalue != null && this.statusvalue != '' && this.statusvalue == "A") {
        //   $('#remarkstatus').hide();
        // }
        if (this.record > 0) {
          this.showPegi = true;
        } else {
          this.showPegi = false;
        }
        // } else {
        //   this.swal('', 'Something went wrong.', 'error');
        // }
        this.pendingAt = this.floatDetails[0]?.pendingAt;
        this.isReverted = this.floatDetails[0]?.isReverted;
        if (this.pendingAt == 1) {
          this.isJCFR = true;
        } else if (this.pendingAt == 2) {
          this.isJCFR = true;
          this.isFR = true;
        } else if (this.pendingAt == 3) {
          this.isJCFR = true;
          this.isFR = true;
          this.isIARRC = true;
          // this.isJCFRRC = true;
        } else if (this.pendingAt == 0) {
          this.isJCFR = true;
          this.isFR = true;
          this.isIARRC = true;
          this.isJCFRRC = true;
        } else if (this.pendingAt == 4) {
          this.isJCFR = true;
          this.isFR = true;
          this.isJCFRRC = true;
          this.isNR = true;
          this.isNORAM = true;
          this.isIARRC = true;
        } else if (this.pendingAt == 5) {
          this.isJCFR = true;
          this.isFR = true;
          this.isJCFRRC = true;
          this.isNR = true;
          this.isNORAM = true;
          this.isJCRVA = true;
          this.isIARRC = true;
        } else if (this.pendingAt == 6) {
          this.isJCFR = true;
          this.isFR = true;
          this.isJCFRRC = true;
          this.isNR = true;
          this.isNORAM = true;
          this.isJCRVA = true;
          this.isFFR = true;
          this.isIARRC = true;
        } else if (this.pendingAt == 7) {
          this.isJCFR = true;
          this.isFR = true;
          this.isIAR = true;
          this.hideStatus = true;
          this.hideOption = false;
          if (this.isReverted != 0) {
            this.isJCFRRC = true;
            this.isNR = true;
            this.isNORAM = true;
            this.isJCRVA = true;
            this.isFFR = true;
            this.isIARRC = true;
          }
        } else if (this.pendingAt == 8) {
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
        } else if (this.pendingAt == 9) {
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
        } else if (this.pendingAt == 10) {
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
        } else if (this.pendingAt <= 11) {
          this.isJCFR = true;
          this.isFR = true;
          this.isIAR = true;
          this.isDCFR = true;
          this.isFJCR = true;
          this.isCEORRC = true;
          this.isSNARRC = true;
          this.isCEOR = true;
          this.isSNAFR = true;
        } else if (this.pendingAt <= 13) {
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
      text: text,
    });
  }
  submit() {
    let remark = $('#remarks').val();
    let remarkSelect = $('#remarkSelect').val();
    // if (this.user.groupId == 8) {
    //   if (remarkSelect == '' || remarkSelect == undefined || remarkSelect == null) {
    //     this.swal('', 'Please Select Remark.', 'info');
    //     return;
    //   }
    // }

    // if (remark == '' || remark == undefined) {
    //   this.swal('', 'Remarks should not be left blank.', 'info');
    //   return;
    // }
    Swal.fire({
      title: 'Are You Sure?',
      text: 'You want to Update the Remark!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        $('#exampleOtpModal').hide();
        let data = {
          claimId: this.claimId,
          remarks: remark,
          userId: this.user.userId,
          remarkSelect: remarkSelect,
        };
        console.log(data);
        this.paymentfreezeService.updateRemark(data).subscribe(
          (data) => {
            this.resData = data;
            console.log(data);
            if (this.resData.status == 'success') {
              this.getDetails();
              $('#remarks').val('');
              this.floatDetails = this.resData.data;
              if (this.floatDetails.status == 'success') {
                this.swal('', this.floatDetails.message, 'success');
              } else {
                this.swal('', this.floatDetails.message, 'success');
              }
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
    });
  }
  snaAprvAmount: any;
  claimnumber: any;
  patientName: any;
  urnnumber: any;
  hospitalName: any;
  hospitalcode: any;
  cpdapprovedamount: any;
  claimId: any;
  float: any;
  updateRemarks(data) {
    console.log(data);
    $('#exampleOtpModal').show();
    $('#remarkSelect').val('');
    $('#remarks').val('');
    this.snaAprvAmount = data.snoApprovedAmount;
    this.claimnumber = data.claimNo;
    this.patientName = data.patientName;
    this.urnnumber = data.urn;
    this.hospitalName = data.hospitalName;
    this.hospitalcode = data.hospitalCode;
    this.cpdapprovedamount = data.cpdApprovedAmount;
    this.claimId = data.claimId;
    this.float = this.floatNumber;
    if (data.pendingAt === 1) {
      $('#remarks').val(data.jointCeoRemarks);
    } else if (data.pendingAt === 2) {
      $('#remarks').val(data.foRemarks);
    } else if (data.pendingAt === 3) {
      $('#remarks').val(data.jointCeoRemarksRevert);
    } else if (data.pendingAt === 4) {
      $('#remarks').val(data.noRemarks);
    } else if (data.pendingAt === 5) {
      $('#remarks').val(data.jointCeoRemarksVerify);
    } else if (data.pendingAt === 6) {
      $('#remarks').val(data.finalFoRemarks);
    } else if (data.pendingAt === 7) {
      $('#remarks').val(data.audRemarks);
    } else if (data.pendingAt === 8) {
      $('#remarks').val(data.dyceoRemarks);
    } else if (data.pendingAt === 9) {
      $('#remarks').val(data.jointCeoRemarksFinal);
    }
  }
  floatRemark: any;
  forwardToSna() {
    this.floatRemark = $('#floatRemark').val();
    const formData = new FormData();
    formData.append('floatNumber', this.float);
    formData.append('remark', this.floatRemark);
    formData.append('actionBy', this.user.userId);
    formData.append('floatFile', this.floatFile);
    Swal.fire({
      title: 'Are You Sure? You want to Clarify this float!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      // html:
      //   '<div align="center">You want to Clarify this float!<br><br>' +
      //   '<div class="input-group mb-3" style="width: 300pt; height: 80pt;">' +
      //   '<textarea id="swal-input1" class="form-control" placeholder="Enter Remarks"></textarea>' +
      //   '</div><div class="input-group mb-3"'+
      //   '<input class="form-control" id="swal-input2" accept=".pdf,.xls" (change)="changeFloatFile($event)"><br/>'+
      //   '<span class="text-danger small">Please upload the document(Execl/PDF) below 10 MB</span>'+
      //   '</div></div>',
      // preConfirm: () => {
      //   return $('#swal-input1').val();
      // },
    }).then((result) => {
      if (result.isConfirmed) {
        // let remarks = result.value;
        this.paymentfreezeService
          .forwardToSNA(formData)
          .subscribe(
            (data) => {
              this.resData = data;
              console.log(data);
              if (this.resData.status == 'success') {
                $('#floatForwardModal').hide();
                this.closebutton.nativeElement.click();
                $('#remarks').val('');
                this.floatDetails = this.resData.data;
                if (this.floatDetails.status == 'success') {
                  this.swal('', this.floatDetails.message, 'success');
                  this.route.navigate(['/application/floatlist']);
                } else {
                  this.swal('', this.floatDetails.message, 'success');
                }
              } else {
                $('#floatForwardModal').hide();
                this.closebutton.nativeElement.click();
                this.swal('', 'Something went wrong.', 'error');
              }
            },
            (error) => {
              console.log(error);
              this.swal('', 'Something went wrong.', 'error');
            }
          );
      }
    });
  }
  iaForwardToSna() {
    this.floatRemark = $('#floatRemark').val();
    const formData = new FormData();
    formData.append('floatNumber', this.float);
    formData.append('remark', this.floatRemark);
    formData.append('actionBy', this.user.userId);
    formData.append('floatFile', this.floatFile);
    Swal.fire({
      title: 'Are You Sure? You want to Clarify this float!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        // let remarks = result.value;
        this.paymentfreezeService
          .iaForwardToSna(formData)
          .subscribe(
            (data) => {
              this.resData = data;
              console.log(data);
              if (this.resData.status == 'success') {
                $('#floatForwardModal').hide();
                this.closebutton.nativeElement.click();
                $('#remarks').val('');
                this.floatDetails = this.resData.data;
                if (this.floatDetails.status == 'success') {
                  this.swal('', this.floatDetails.message, 'success');
                  this.route.navigate(['/application/floatverifiedlist']);
                } else {
                  this.swal('', this.floatDetails.message, 'success');
                }
              } else {
                $('#floatForwardModal').hide();
                this.closebutton.nativeElement.click();
                this.swal('', 'Something went wrong.', 'error');
              }
            },
            (error) => {
              console.log(error);
              this.swal('', 'Something went wrong.', 'error');
            }
          );
      }
    });
  }
  verify() {
    this.floatRemark = $('#floatRemark').val();
    const formData = new FormData();
    formData.append('floatNumber', this.float);
    formData.append('remark', this.floatRemark);
    formData.append('actionBy', this.user.userId);
    formData.append('floatFile', this.floatFile);
    Swal.fire({
      title: 'Are You Sure? You want to Verify this float!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      // html:
      //   '<div align="center">You want to Verify this float!<br><br>' +
      //   '<div class="input-group mb-3" style="width: 300pt; height: 80pt;">' +
      //   '<textarea id="swal-input1" class="form-control" placeholder="Enter Remarks"></textarea>' +
      //   '</div></div>',
      // preConfirm: () => {
      //   return $('#swal-input1').val();
      // },
    }).then((result) => {
      if (result.isConfirmed) {
        // let remarks = result.value;
        this.paymentfreezeService
          .verifyFloat(formData)
          .subscribe(
            (data) => {
              this.resData = data;
              console.log(data);
              if (this.resData.status == 'success') {
                $('#remarks').val('');
                $('#floatForwardModal').hide();
                this.closebutton.nativeElement.click();
                this.floatDetails = this.resData.data;
                if (this.floatDetails.status == 'success') {
                  this.swal('', this.floatDetails.message, 'success');
                  this.route.navigate(['/application/floatlist']);
                } else {
                  this.swal('', this.floatDetails.message, 'warning');
                }
              } else {
                $('#floatForwardModal').hide();
                this.closebutton.nativeElement.click();
                this.swal('', 'Something went wrong.', 'error');
              }
            },
            (error) => {
              console.log(error);
              this.swal('', 'Something went wrong.', 'error');
            }
          );
      }
    });
  }
  cancel() {
    $('#exampleOtpModal').hide();
    $('#floatForwardModal').hide();
  }
  @ViewChild('closebutton') closebutton;
  submitByFo() {
    let verifyFlag = $('#verifySelect').val();
    $('#floatRemark').val('');
    // $('#floatForwardModal').show();
    if (verifyFlag == '1') {
      // this.verify();
    } else if (verifyFlag == '2' || verifyFlag == '3') {
      // this.forwardToSna();
    } else {
      this.swal('', 'Please Select', 'info');
      return;
    }
  }
  // floatRemark: any;
  myGroups = new FormGroup({
    remarks: new FormControl(),
  });
  submitByFoModal() {
    let verifyFlag = $('#verifySelect').val();
    if (verifyFlag == '1') {
      this.verify();
    } else if (verifyFlag == '2') {
      this.forwardToSna();
    } else if (verifyFlag == '3') {
      this.iaForwardToSna();
    }
  }

  remarktype: any = [];
  report: any = [];
  sno: any = {
    Slno: '',
    URN: '',
    claimno: '',
    hospitalCode: '',
    hospitalname: '',
    InvoiceNumber: '',
    PatientName: '',
    ActualDateOfAdmission: '',
    ActualDateOfDischarge: '',
    hospitalclaimedamount: '',
    cpdapprovedAmount: '',
    snoApprovedAmount: '',
    foremarks: '',
    district: '',
    bskyincentivestatus: '',
    gender: '',
    packagecode: '',
    packagename: '',
    packagecost: '',
    packageprocedure: '',
    actualdateofadmission: '',
    actualdateofdischarge: '',
    hospitalmortality: '',
    cpdmoratlity: '',
    impalntdata: '',
    cpdclaimstatus: '',
    cpdremarks: '',
    cpdapprovedamount: '',
    snaclaimstatus: '',
    snaremarks: '',
    meremarks: '',
    snaapprovedamountsnacod: '',
    jointceofinaceremarks: '',
    audRemarks: '',
  };

  heading = [
    // [
    //   'Sl#',
    //   'Hospital Code',
    //   'Hospital Name',
    //   'District',
    //   'GJAY Incentive Status',
    //   'URN',
    //   'Invoice No',
    //   'Claim Number',
    //   'Patient Name',
    //   'Gender',
    //   'Package Code',
    //   'Package Name',
    //   'Package Cost (₹)',
    //   'Package Procedure',
    //   'Actual Date Of Admission',
    //   'Actual Date Of Discharge',
    //   'Mortality (Hospital)',
    //   'Mortality (CPD)',
    //   'Hospital Claimed Amount (₹)',
    //   'Implant Data',
    //   'CPD Claim Status',
    //   'CPD Remarks',
    //   'CPD Approved Amount (₹)',
    //   'SNA Claim Status',
    //   'SNA Remarks',
    //   'M And E Remarks',
    //   'SNA Approved Amount(SNA/CPD) (₹)',
    //   'Joint CEO Finance Remarks',
    //   'FO Remarks',
    //   'Internal Auditor Remarks',
    // ],
  ];
  downloadReport(type: any) {
    this.heading=[];
    let heading =[
      'Sl#',
      'Hospital Code',
      'Hospital Name',
      'District',
      'Incentive Status Blocking',
      'GJAY Incentive Status',
      'URN',
      'Invoice No',
      'Claim Number',
      'Patient Name',
      'Gender',
      'Package Code',
      'Package Name',
      'Package Cost (₹)',
      'Package Procedure',
      'Actual Date Of Admission',
      'Actual Date Of Discharge',
      'Mortality (Hospital)',
      'Mortality (CPD)',
      'Hospital Claimed Amount (₹)',
      'Implant Data',
      'CPD Claim Status',
      'CPD Remarks',
      'CPD Approved Amount (₹)',
      'SNA Claim Status',
      'SNA Remarks',
      'M And E Remarks',
      'SNA Approved Amount(SNA/CPD) (₹)',
    ];
    if(this.isJCFR){heading.push('Joint CEO Finance Remarks')}
    if(this.isFR){heading.push('FO Remarks')}
    if(this.isIARRC){heading.push('Internal Auditor Remarks (Revert Case)')}
    if(this.isJCFRRC){heading.push('Joint CEO Finance Remarks (Revert Case)')}
    if(this.isNR){heading.push('Nodal Officer Remark')}
    if(this.isNORAM){heading.push('Nodal officer Revised Approved Amount')}
    if(this.isJCRVA){heading.push('Joint CEO Remarks (Verification again)')}
    if(this.isFFR){heading.push('Final FO Remarks')}
    if(this.isIAR){heading.push('Internal Auditor Remarks')}
    if(this.isDCFR){heading.push('DY. CEO Finance Remarks')}
    if(this.isFJCR){heading.push('Final Joint CEO Remarks')}
    if(this.isCEORRC){heading.push('CEO Remark Revert Case')}
    if(this.isSNARRC){heading.push('SNA Remark Revert Case')}
    if(this.isCEOR){heading.push('CEO Remark')}
this.heading.push(heading);

    this.report = [];
    if (type == 'excel') {
      this.remarktype = [];
      let claim: any;
      for (var i = 0; i < this.floatDetails.length; i++) {
        claim = this.floatDetails[i];
        // this.sno = [];
        // this.sno.Slno = i + 1;
        // this.sno.hospitalCode = claim.hospitalCode!=null ? claim.hospitalCode:"N/A";
        // this.sno.hospitalname = claim.hospitalName!=null ? claim.hospitalName:"N/A";
        // this.sno.district = claim.districtName !=null ? claim.districtName:"N/A";
        // this.sno.bskyincentivestatus = claim.incenticeStatus !=null ? claim.incenticeStatus:"N/A";
        // this.sno.URN = claim.urn !=null ? claim.urn:"N/A";
        // this.sno.InvoiceNumber = claim.invoiceNo!=null ? claim.invoiceNo:"N/A";
        // this.sno.claimno = claim.claimNo!=null ? claim.claimNo:"N/A";
        // this.sno.PatientName = claim.patientName!=null ? claim.patientName:"N/A";
        // this.sno.gender = claim.gender!=null ? claim.gender:"N/A";
        // this.sno.packagecode = claim.packageCode!=null ? claim.packageCode:"N/A";
        // this.sno.packagename = claim.packageName!=null ? claim.packageName:"N/A";
        // this.sno.packagecost = claim.packageCost!=null ? claim.packageCost:"N/A";
        // this.sno.packageprocedure = claim.procedureName!=null ? claim.procedureName:"N/A";
        // this.sno.ActualDateOfAdmission = this.convertdatetostring(claim.actualDateOfAdmission);
        // this.sno.ActualDateOfDischarge = this.convertdatetostring(claim.actualDateOfDischarge);
        // this.sno.hospitalmortality = claim.mortality!=null ? claim.mortality:"N/A";
        // this.sno.cpdmoratlity = claim.cpdMortality!=null ? claim.cpdMortality:"N/A";
        // this.sno.hospitalclaimedamount = claim.totalAmountClaimed!=null ? claim.totalAmountClaimed:"N/A";
        // this.sno.impalntdata = claim.implantData!=null ? claim.implantData:"N/A";
        // this.sno.cpdclaimstatus = claim.cpdClaimStatus!=null ? claim.cpdClaimStatus:"N/A";
        // this.sno.cpdremarks = claim.cpdRemarks!=null ? claim.cpdRemarks:"N/A";
        // this.sno.cpdapprovedamount = claim.cpdApprovedAmount!=null ? claim.cpdApprovedAmount:"N/A";
        // this.sno.snaclaimstatus = claim.snaClaimStatus!=null ? claim.snaClaimStatus:"N/A";
        // this.sno.snaremarks = claim.snaRemarks!=null ? claim.snaRemarks:"N/A";
        // this.sno.meremarks = claim.meremark;
        // this.sno.snaapprovedamountsnacod = claim.snoApprovedAmount!=null ? claim.snoApprovedAmount:"N/A";
        // this.sno.jointceofinaceremarks = claim.jointCeoRemarks!=null ? claim.jointCeoRemarks:"N/A";
        // this.sno.foremarks = claim.foRemarks != null ? claim.foRemarks : 'N/A';
        // this.sno.audRemarks = claim.audRemarks != null ? claim.audRemarks : 'N/A';

        let sno = [];
        sno.push(i + 1);
        sno.push(claim.hospitalCode!=null ? claim.hospitalCode:"N/A");
        sno.push(claim.hospitalName!=null ? claim.hospitalName:"N/A");
        sno.push(claim.districtName !=null ? claim.districtName:"N/A");
        sno.push(claim.incenticeStatusBlocking !=null ? claim.incenticeStatusBlocking:"N/A");
        sno.push(claim.incenticeStatus !=null ? claim.incenticeStatus:"N/A");
        sno.push(claim.urn !=null ? claim.urn:"N/A");
        sno.push(claim.invoiceNo!=null ? claim.invoiceNo:"N/A");
        sno.push(claim.claimNo!=null ? claim.claimNo:"N/A");
        sno.push(claim.patientName!=null ? claim.patientName:"N/A");
        sno.push(claim.gender!=null ? claim.gender:"N/A");
        sno.push(claim.packageCode!=null ? claim.packageCode:"N/A");
        sno.push(claim.packageName!=null ? claim.packageName:"N/A");
        sno.push(claim.packageCost!=null ? claim.packageCost:"N/A");
        sno.push(claim.procedureName!=null ? claim.procedureName:"N/A");
        sno.push(this.convertdatetostring(claim.actualDateOfAdmission));
        sno.push(this.convertdatetostring(claim.actualDateOfDischarge));
        sno.push(claim.mortality!=null ? claim.mortality:"N/A");
        sno.push(claim.cpdMortality!=null ? claim.cpdMortality:"N/A");
        sno.push(claim.totalAmountClaimed!=null ? claim.totalAmountClaimed:"N/A");
        sno.push(claim.implantData!=null ? claim.implantData:"N/A");
        sno.push(claim.cpdClaimStatus!=null ? claim.cpdClaimStatus:"N/A");
        sno.push(claim.cpdRemarks!=null ? claim.cpdRemarks:"N/A");
        sno.push(claim.cpdApprovedAmount!=null ? claim.cpdApprovedAmount:"N/A");
        sno.push(claim.snaClaimStatus!=null ? claim.snaClaimStatus:"N/A");
        sno.push(claim.snaRemarks!=null ? claim.snaRemarks:"N/A");
        sno.push(claim.meremark);
        sno.push(claim.snoApprovedAmount!=null ? claim.snoApprovedAmount:"N/A");
        if(this.isJCFR){sno.push(claim.jointCeoRemarks!=null ? claim.jointCeoRemarks:"N/A");}
        if(this.isFR){sno.push(claim.foRemarks!=null ? claim.foRemarks:"N/A");}
        if(this.isIARRC){sno.push(claim.iarRevertCase!=null ? claim.iarRevertCase:"N/A");}
        if(this.isJCFRRC){sno.push(claim.jointCeoRemarksRevert!=null ? claim.jointCeoRemarksRevert:"N/A");}
        if(this.isNR){sno.push(claim.noRemarks!=null ? claim.noRemarks:"N/A");}
        if(this.isNORAM){sno.push(claim.noApprovedAmount!=null ? claim.noApprovedAmount:"N/A");}
        if(this.isJCRVA){sno.push(claim.jointCeoRemarksVerify!=null ? claim.jointCeoRemarksVerify:"N/A");}
        if(this.isFFR){sno.push(claim.finalFoRemarks!=null ? claim.finalFoRemarks:"N/A");}
        if(this.isIAR){sno.push(claim.audRemarks!=null ? claim.audRemarks:"N/A");}
        if(this.isDCFR){sno.push(claim.dyceoRemarks!=null ? claim.dyceoRemarks:"N/A");}
        if(this.isFJCR){sno.push(claim.jointCeoRemarksFinal!=null ? claim.jointCeoRemarksFinal:"N/A");}
        if(this.isCEORRC){sno.push(claim.ceoremarkrevertcase!=null ? claim.ceoremarkrevertcase:"N/A");}
        if(this.isSNARRC){sno.push(claim.snaremarkrevertcase!=null ? claim.snaremarkrevertcase:"N/A");}
        if(this.isCEOR){sno.push(claim.ceoremark!=null ? claim.ceoremark:"N/A");}
        this.report.push(sno);
      }

      let filter = [];
      filter.push([['Float Number', this.floatDetails[0].floatNumber]]);
      filter.push([['Float Generated By', this.floatDetails[0].createdBy]]);
      if (this.searchvalue == 1) {
        filter.push([['Search Type', "All"]]);
      } else if (this.searchvalue == null || this.searchvalue == undefined || this.searchvalue == '') {
        filter.push([['Search Type', "All"]]);
      } else if (this.searchvalue == 2) {
        filter.push([['Search Type', "Less Approved Amount"]]);
      } else if (this.searchvalue == 3) {
        filter.push([['Search Type', "Remark By FO"]]);
      } else if (this.searchvalue == 4) {
        filter.push([['Search Type', "Bulk Approved"]]);
      } else if (this.searchvalue == 5) {
        filter.push([['Search Type', "CPD Approved cases"]]);
      } else if (this.searchvalue == 6) {
        filter.push([['Search Type', "CPD Rejected cases"]]);
      } else if (this.searchvalue == 7) {
        filter.push([['Search Type', "CPD Un-processed Cases"]]);
      } else if (this.searchvalue == 8) {
        filter.push([['Search Type', "Query by CPD"]]);
      } else if (this.searchvalue == 9) {
        filter.push([['Search Type', "Reclaimed cases"]]);
      } else if (this.searchvalue == 10) {
        filter.push([['Search Type', "Query by SNA"]]);
      } else if (this.searchvalue == 11) {
        filter.push([['Search Type', "Remark by Joint CEO"]]);
      } else if (this.searchvalue == 12) {
        filter.push([['Search Type', "Remark by Internal Auditor"]]);
      } else if (this.searchvalue == 13) {
        filter.push([['Search Type', "Remark by DY CEO"]]);
      } else if (this.searchvalue == 14) {
        filter.push([['Search Type', "Remark by CEO"]]);
      }
      filter.push([['Search By Remark', this.remarkLists]]);
      TableUtil.exportListToExcelWithFilter(
        this.report,
        this.floatDetails[0]?.floatNumber,
        this.heading,
        filter
      );
    } else if (type == 'pdf') {
      if (this.floatDetails.length == 0) {
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
      let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
      let SlNo = 1;
      this.floatDetails.forEach((element) => {
        let rowData = [];
        rowData.push(SlNo++);
        rowData.push(element.urn);
        rowData.push(element.claimNo);
        rowData.push(element.hospitalCode);
        rowData.push(element.hospitalName);
        // rowData.push(element.caseno != null ? element.caseno : 'N/A');
        rowData.push(element.invoiceNo);
        rowData.push(element.patientName);
        rowData.push(this.convertdatetostring(element.actualDateOfAdmission));
        rowData.push(this.convertdatetostring(element.actualDateOfDischarge));
        rowData.push(
          element.totalAmountClaimed != null
            ? element.totalAmountClaimed
            : 'N/A'
        );
        rowData.push(
          element.cpdApprovedAmount != null ? element.cpdApprovedAmount : 'N/A'
        );
        rowData.push(
          element.snoApprovedAmount != null ? element.snoApprovedAmount : 'N/A'
        );
        rowData.push(element.foRemarks != null ? element.foRemarks : 'N/A');
        this.report.push(rowData);
      });
      let doc = new jsPDF('l', 'mm', [238, 270]);
      doc.setFontSize(10);
      doc.text('Generated By :-' + this.user.fullName, 5, 5);
      doc.text(
        'Generated On :' + generatedOn, 5, 10);
      doc.text('Float Number : ' + this.floatDetails[0]?.floatNumber, 5, 15);
      doc.text(
        'Float Generated By : ' + this.floatDetails[0]?.createdBy,
        5,
        20
      );
      doc.text(this.floatDetails[0].floatNumber, 100, 25);
      doc.setLineWidth(0.7);
      doc.line(100, 26, 128, 26);
      autoTable(doc, {
        head: this.heading,
        body: this.report,
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
          0: { cellWidth: 6 },
          1: { cellWidth: 18 },
          2: { cellWidth: 18 },
          3: { cellWidth: 30 },
          4: { cellWidth: 18 },
          5: { cellWidth: 15 },
          6: { cellWidth: 20 },
          7: { cellWidth: 10 },
          8: { cellWidth: 20 },
          9: { cellWidth: 20 },
          10: { cellWidth: 20 },
          11: { cellWidth: 18 },
          12: { cellWidth: 18 },
          13: { cellWidth: 18 },
          14: { cellWidth: 18 },
          15: { cellWidth: 18 },
        },
      });
      doc.save(this.floatDetails[0].floatNumber+'.pdf');
    }
  }
  convertdatetostring(date: any) {
    var datePipe = new DatePipe('en-US');
    date = datePipe.transform(date, 'dd-MMM-yyyy');
    return date;
  }
  getActionDetails(claimid, urn: any, floatNumber: any) {
    localStorage.setItem('claimid', claimid);
    let state = {
      Urn: urn,
      Claimid: claimid,
      Floatnumber: floatNumber
    };
    localStorage.setItem('floatclaimdetails', JSON.stringify(state));
    localStorage.setItem('token', this.jwtService.getJwtToken());
    this.route.navigate([]).then((result) => {
      window.open(environment.routingUrl + '/floatclaimdetails');
    });
  }
  keyPress(event: KeyboardEvent) {
    const pattern = /^[A-Za-z0-9 ' ',@,#,*,%,,,.',",{,},_,+,=,:,?,/,<,>,(,),&,-]+$/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }
  searchvalue: any;
  seacrchvalue(event: any) {
    this.searchvalue = event.target.value;
    this.floatDetails = [];
    console.log(this.floatDetails);
    if (this.searchvalue == 2) {
      this.backUpData.forEach((element) => {
        if (
          element.totalAmountClaimed != null &&
          element.snoApprovedAmount != null
        ) {
          if (element.totalAmountClaimed > element.snoApprovedAmount) {
            this.floatDetails.push(element);
            // element.colorStatus = true;
          }
          else {
            // element.colorStatus = false;
          }
        }
      });
    } else if (this.searchvalue == 1) {
      this.floatDetails = this.backUpData;
    } else if (this.searchvalue == 3) {
      this.backUpData.forEach((element) => {
        if (element.foRemarks != undefined || element.finalFoRemarks != undefined) {
          this.floatDetails.push(element);
        }
      });
    } else if (this.searchvalue == 4) {
      this.backUpData.forEach((element) => {
        if (element.isBulkApproved == 'Yes') {
          this.floatDetails.push(element);
        }
      });
    } else if (this.searchvalue == 5) {
      this.backUpData.forEach((element) => {
        if (element.isApproved != 0) {
          this.floatDetails.push(element);
        }
      });
    } else if (this.searchvalue == 6) {
      this.backUpData.forEach((element) => {
        if (element.isRejected != 0) {
          this.floatDetails.push(element);
        }
      });
    } else if (this.searchvalue == 7) {
      this.backUpData.forEach((element) => {
        if (element.isUnprocessed != 0) {
          this.floatDetails.push(element);
        }
      });
    } else if (this.searchvalue == 8) {
      this.backUpData.forEach((element) => {
        if (element.isQueryByCpd != 0) {
          this.floatDetails.push(element);
        }
      });
    } else if (this.searchvalue == 9) {
      this.backUpData.forEach((element) => {
        if (element.isReclaim != 0) {
          this.floatDetails.push(element);
        }
      });
    } else if (this.searchvalue == 10) {
      this.backUpData.forEach((element) => {
        if (element.isQueryBySna != 0) {
          this.floatDetails.push(element);
        }
      });
    } else if (this.searchvalue == 11) {
      this.backUpData.forEach(element => {
        if (element.jointCeoRemarks != undefined) {
          this.floatDetails.push(element);
        }
      });
    } else if (this.searchvalue == 12) {
      this.backUpData.forEach(element => {
        if (element.audRemarks != undefined || element.iarRevertCase != undefined) {
          this.floatDetails.push(element);
        }
      });
    } else if (this.searchvalue == 13) {
      this.backUpData.forEach(element => {
        if (element.dyceoRemarks != undefined) {
          this.floatDetails.push(element);
        }
      });
    } else if (this.searchvalue == 14) {
      this.backUpData.forEach(element => {
        if (element.ceoremark != undefined) {
          this.floatDetails.push(element);
        }
      });
    }
    else if (this.searchvalue == 15) {
      this.backUpData.forEach((element) => {
        if (element.foRemarks == null && element.jointCeoRemarks == null && element.audRemarks == null && element.noRemarks != null ) {
          this.floatDetails.push(element);
        }
      });
    }
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
    );
  }
  filterFloatDetails(event) {
    let remarkId = event.target.value;
    this.floatDetails = [];
    console.log(this.floatDetails);
    this.backUpData.forEach((element) => {
      if (element.remarkId == remarkId) {
        this.floatDetails.push(element);
      } else if (remarkId == 1) {
        this.floatDetails = this.backUpData;
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
    this.floatDetails = [];
    // this.backUpData.forEach((element) => {
    //   this.remarkLists.forEach((element1) => {
    //     if (element.remarkId == element1.remarkid) {
    //       this.floatDetails.push(element);
    //     }
    //   });
    // });
    if(this.userBy == 2){
      this.backUpData.forEach((element) => {
        this.remarkLists.forEach((element1) => {
          if (element.remarkId == element1.remarkid) {
            this.floatDetails.push(element);
          }
        });
      });
    }else if (this.userBy == 3){
      this.backUpData.forEach((element) => {
        this.remarkLists.forEach((element1) => {
          if (element.audRemarkId == element1.remarkid) {
            this.floatDetails.push(element);
          }
        });
      });
    }
  }
    console.log(this.floatDetails);
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
    this.floatDetails = [];
    if(this.userBy == 2){
    this.backUpData.forEach((element) => {
      this.remarkLists.forEach((element1) => {
        if (element.remarkId == element1.remarkid) {
          this.floatDetails.push(element);
        }
      });
    });
  }else if (this.userBy == 3){
    this.backUpData.forEach((element) => {
      this.remarkLists.forEach((element1) => {
        if (element.audRemarkId == element1.remarkid) {
          this.floatDetails.push(element);
        }
      });
    });
  }
    if (this.remarkLists.length == 0) {
      this.floatDetails = this.backUpData;
    }
    console.log(this.floatDetails);
  }
  onSelectAll(list) {
    this.remarkLists = list;
    console.log(this.remarkLists);
    this.floatDetails = [];
    if(this.userBy ==1){
      this.swal("","Please Select User Type","info");
      return;
    }else{
    this.backUpData.forEach((element) => {
      this.remarkLists.forEach((element1) => {
        if (element.remarkId == element1.remarkid) {
          this.floatDetails.push(element);
        }
      });
    });
  }
    console.log(this.floatDetails);
  }
  onDeSelectAll(list) {
    this.remarkLists = list;
    console.log(this.remarkLists);
    this.floatDetails = this.backUpData;
  }
  floatFile: any;
  floafilename: any
  floatfiledata: any;
  floatFileName: any;
  traetmentvalue: any;
  changeFloatFile(files: any) {
    // this.floatFile = event.item(0);
    this.floatfiledata = files.target.files;
    for (var i = 0; i < this.floatfiledata.length; i++) {
      var filename = files.target.files[0];
      var extension = filename.name.split('.').pop();
      this.floatFileName = filename.name.split('.').shift();
    }
    var allowedExtensions = /(\xls|\xlsx|pdf|jpeg|jpg)$/i;
    if (!allowedExtensions.exec(extension)) {
      this.swal('Warning', 'Only Excel/PDF/JPG are Allowed!', 'warning');
      $('#floatfile').val('');
      this.floatFile = '';
      return;
    } else
      this.floatFile = files.target.files[0];
    this.traetmentvalue = this.floatFile.name;
    if (Math.round(this.floatFile.size / 1024) >= 10192) {
      this.swal('Warning', 'Please provide Document with Limited Size', 'warning');
      $('#floatfile').val('');
      this.floatFile = '';
    }
  }
  showSubmit: any = false;
  seacrchVerifySelect(event) {
    let value = event.target.value;
    if (value) {
      this.showSubmit = true;
    } else {
      this.showSubmit = false;
    }
  }
  userBy:any = 1;
  selectUserEvent(event){
    this.userBy = event.target.value;
  }
}
