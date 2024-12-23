import { Component, OnInit } from '@angular/core';
import { SnocreateserviceService } from '../Services/snocreateservice.service';
import { HeaderService } from '../header.service';
import Swal from 'sweetalert2';
import { UnprocessedclaimService } from '../Services/unprocessedclaim.service';
import { DatePipe } from '@angular/common';
import { TableUtil } from '../util/TableUtil';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;


@Component({
  selector: 'app-dischargereport',
  templateUrl: './dischargereport.component.html',
  styleUrls: ['./dischargereport.component.scss']
})
export class DischargereportComponent implements OnInit {
  keyword: any = 'fullName';
  stateList: any;
  districtList: any = []
  hospitalList: any = [];
  selectedItems: any = [];
  responseData: any;
  showPegi: boolean = false;
  record: any;
  pageElement: any;
  currentPage: any;
  txtsearchDate: any;
  user: any;
  statename: any = "ALL";
  districtName: any = "ALL";
  hospitalname: any = "ALL";
  days: number;
  List: any = [];
  pageIn: number;
  pageEnd: number;
  size: number;
  pgElement: any;
  pgList: any = [];
  newList: any = [];
  selectedIndex: number;
  first: number;
  last: number;
  detailData: any = [];
  state: any = "";
  dis: any = "";
  hospital: any = "";
  constructor(private snoService: SnocreateserviceService, public headerService: HeaderService,
    private unprocessedService: UnprocessedclaimService,private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.user =  this.sessionService.decryptSessionData("user");
    // $("#fromdatesnawise").hide();
    this.currentPage = 1;
    this.pageElement = 500;
    this.headerService.setTitle('Discharge Data Report');
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
    var frstDay = date1 + "-" + month + "-" + year;
    $('input[name="fromDate"]').val(frstDay);
    $('input[name="fromDate"]').attr("placeholder", "From Date *");
    $('input[name="toDate"]').attr("placeholder", "To Date *");
    this.getStateList();
    let datee = new Date();
    var today = new Date(datee.getFullYear(), datee.getMonth(), datee.getDate() + 1);
    $('.selectpicker').selectpicker();
    $('.datepickered').datetimepicker({
      format: 'DD-MMM-YYYY',
      // endDate: '0d',
      minDate: today,
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
    this.onClickSearch();
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
    this.snoService.getStateList().subscribe(
      (response) => {
        this.stateList = response;
      },
      (error) => console.log(error)
    )
  }
  OnChangeState(id) {
    $("#districtId").val("");
    this.selectedItems = [];
    localStorage.setItem("stateCode", id);
    this.snoService.getDistrictListByStateId(id).subscribe(
      (response) => {
        this.districtList = response;
      },
      (error) => console.log(error)
    )
  }
  OnChangeDistrict(id) {
    this.selectedItems = [];
    var stateCode = localStorage.getItem("stateCode");
    this.snoService.getHospitalbyDistrictId(id, stateCode).subscribe(
      (response) => {
        this.hospitalList = response;
      },
      (error) => console.log(error)
    )
  }
  onClickSearch() {
    this.pageElement = 500;
    $('#pageItem').val(this.pageElement);
    this.pageIn = 1;
    this.pageEnd = this.pageElement;
    this.selectedIndex = 1;
    this.first = 0;
    this.last = 10;
    this.Searchdischargereport();
  }
  formdate: any;
  toDate: any;
  from: any;
  to: any;
  sizevalue: number
  Searchdischargereport() {
    this.formdate = $('#datepicker1').val();
    this.toDate = $('#datepicker2').val();
    let state = $('#stateId').val();
    let dist = $('#districtId').val();
    let hospital = $('#hospital').val();
    let pageIn = this.pageIn;
    let pageEnd = this.pageEnd;
    this.from = this.Dateconvert(this.formdate);
    this.to = this.Dateconvert(this.toDate);
    const fromDate1 = this.GetDate(this.formdate);
    const todate1 = this.GetDate(this.toDate);
    let diffTime = Math.abs(todate1.getTime() - fromDate1.getTime());
    this.days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (this.formdate == '' || this.formdate == null || this.formdate == undefined) {
      this.swal('', 'Actual Date Of Discharge From should not be blank', 'error');
      return;
    }
    if (this.toDate == '' || this.toDate == null || this.toDate == undefined) {
      this.swal('', 'To Date should not be blank', 'error');
      return;
    }
    if (this.days > 30) {
      this.swal('', ' Maximum 30 days Allow', 'error');
      return;
    }
    if (Date.parse(this.formdate) > Date.parse(this.toDate)) {
      this.swal('', ' Actual Date Of Discharge From should be less than Actual Date Of Discharge To', 'error');
      return;
    }
    this.unprocessedService.getdischargereort(this.from, this.to, state, dist, hospital, pageIn, pageEnd).subscribe(
      (response: any) => {
        this.responseData = response;
        console.log(this.responseData);
        if (this.responseData.status == 'success') {
          this.List = this.responseData.data;
          this.sizevalue = this.responseData.size
          this.record = this.List.length;
          if (this.record > 0) {
            this.showPegi = true;
          } else {
            this.swal('info', 'No Record Found', 'info');
            this.showPegi = false;
          }
          let count: number;
          count = Math.ceil(this.sizevalue / this.pageElement);
          console.log('count: ' + count);
          this.pgList = [];
          for (var i = 0; i < count; i++) {
            this.pgElement = {
              id: "",
              init: "",
              end: "",
            }
            this.pgElement.id = i + 1;
            this.pgElement.init = (this.pgElement.id * this.pageElement) - this.pageElement + 1;
            this.pgElement.end = this.pgElement.id * this.pageElement;
            console.log(this.pgElement);
            this.pgList.push(this.pgElement);
          }
          this.newList = [];
          var fst = this.first ? this.first : 0;
          var lst = this.last ? this.last : 10;
          if (lst > this.pgList[this.pgList.length - 1].id) {
            lst = this.pgList[this.pgList.length - 1].id;
          }
          for (var j = fst; j < lst; j++) {
            var elem = this.pgList[j];
            this.newList.push(elem);
          }
        } else {
          console.log(this.responseData.msg);
          this.swal('', 'Something went wrong.', 'error');
        }
      },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      }
    )
  }

  GetDate(str) {
    var arr = str.split("-");
    var months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    var month = months.indexOf(arr[1].toLowerCase());
    return new Date(parseInt(arr[2]), month, parseInt(arr[0]));
  }
  ResetField() {
    window.location.reload();
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  Dateconvert(date) {
    var datePipe = new DatePipe('en-US');
    return datePipe.transform(date, 'dd-MM-YYYY');
  }
  pageItemChange() {
    // this.ngOnInit();
    this.pageElement = $('#pageItem').val();
    console.log(this.pageElement);
    this.pageIn = 1;
    this.pageEnd = this.pageElement;
    this.selectedIndex = 1;
    this.first = 0;
    this.last = 10;
    this.Searchdischargereport();
    // alert("Page Capcity Extended Upto " + this.pageElement);
  }

  paginate(element) {
    this.selectedIndex = element.id;
    this.pageIn = element.init;
    this.pageEnd = element.end;
    this.Searchdischargereport();
  }

  prev() {
    if (this.selectedIndex == this.newList[0].id) {
      var fst = this.newList[0].id - 1;
      this.first = fst - 10;
      this.last = fst;
    }
    this.selectedIndex = this.selectedIndex - 1;
    this.pageIn = this.pageIn - this.pageElement;
    this.pageEnd = this.pageEnd - this.pageElement;
    this.Searchdischargereport();
  }

  next() {
    if (this.selectedIndex == this.newList[this.newList.length - 1].id) {
      var lst = +this.newList[this.newList.length - 1].id;
      this.first = lst;
      this.last = lst + 10;
    }
    this.selectedIndex = this.selectedIndex + 1;
    this.pageIn = +this.pageIn + +this.pageElement;
    this.pageEnd = +this.pageEnd + +this.pageElement;
    this.Searchdischargereport();
  }

  prevlist() {
    var fst = this.newList[0].id - 1;
    this.first = fst - 10;
    this.last = fst;
    this.selectedIndex = fst - 10 + 1;
    this.pageIn = this.newList[0].init - this.pageElement * 10;
    this.pageEnd = this.newList[0].end - this.pageElement * 10;
    this.Searchdischargereport();
  }

  nextlist() {
    var lst = +this.newList[this.newList.length - 1].id;
    this.first = lst;
    this.last = lst + 10;
    this.selectedIndex = lst + 1;
    this.pageIn = +this.newList[this.newList.length - 1].init + +this.pageElement;
    this.pageEnd = +this.newList[this.newList.length - 1].end + +this.pageElement;
    this.Searchdischargereport();
  }
  viewData(item: any, claimID: any) {
    this.detailData = [];
    this.detailData.push(item);
  }


  report: any = [];
  sno: any = {
    Slno: "",
    URN: "",
    Invoice: "",
    HospitalDetails: "",
    Patientname: "",
    DateofAdmission: "",
    DateofDischarge: "",
    ActualDateofAdmission: "",
    ActualDateofDischarge: "",
    ClaimRaiseStatus: "",
    CpdApprovedAmount: "",
    SnaApprovedAmount: "",
    HospitalstateName: "",
    HospitalDistrictName: "",
    Patientphonenumber: "",
    Gender: "",
    Age: "",
    Familyheadname: "",
    Verifiername: "",
    Patientstatecode: "",
    Patientdistrictcode: "",
    Patientblockcode: "",
    Patientpanchayatcode: "",
    Patientvillagecode: "",
    Patientstatename: "",
    Patientdistrictname: "",
    Patientblockname: "",
    Patientpanchayatname: "",
    Villagename: "",
    Fpverifier: "",
    // ID	
    Fpverifiername: "",
    Transactiontype: "",
    Transactiondate: "",
    Transactiontime: "",
    PackagecodeFundavailablebalance: "",
    Noofdays: "",
    Mortality: "",
    Transactiondescription: "",
    Unblockamount: "",
    Policystartdate: "",
    Policyenddate: "",
    Procedurename: "",
    Packagename: "",
    Packagecategorycode: "",
    Packageid: "",
    Triggerflag: "",
    Referralcode: "",
    Hospitalcategoryaccreditation: "",
    Systemrejectedstatus: "",
    Rejectedstatus: "",
    Verificationmode: "",
    Ispatientotpverified: "",
    Referralauthstatus: "",
    Cpdclaimstatus: "",
    Cpdremarks: "",
    Snaclaimstatus: "",
    Snaremarks: "",
    Hospitalclaimedamount: "",

  };
  heading = [['Sl#', 'URN', '	Invoice Numbe', 'Hospital Details', 'Patientname', 'Date of Admission', 'Date of Discharge',
    'Actual Date of Admission', 'Actual Date of Discharge', 'Claim Raise Status',
    'Cpd Approved Amount', 'Sna Approved Amount', 'Hospital state Name', 'Hospital District Name', 'Patient phone Number', 'Gender', 'Age', 'Familyheadname', 'Verifiername', 'Patient statecode', 'Patient districtcode',
    'Patient blockcode', 'Patient panchayatcode', 'Patient villagecode',
    'Patient statename', 'Patient districtname', 'Patient blockname', 'Patient panchayatname', 'Villagename', 'Fpverifier', 'Fp_verifiername', 'Transactiontype', 'Transactiondate', 'Transactiontime', 'Packagecode',
    'Fund available balance (from_5lakh)', 'Noofdays', 'Mortality',
    'Transactiondescription', 'Unblockamount', 'Policystartdate', 'Policyenddate',
    'Procedurename', 'Packagename', 'Packagecategorycode', 'Packageid', 'Triggerflag', 'Referralcode', 'Hospital category /accreditation', 'System rejected status', 'Rejected status', 'Verificationmode', 'Ispatientotpverified', 'Referralauthstatus', 'Cpdclaimstatus', 'Cpdremarks', 'Snaclaimstatus', 'Snaremarks', 'Hospitalclaimedamount']];
  downloadReport() {
    this.report = [];
    let claim: any;
    for (var i = 0; i < this.List.length; i++) {
      claim = this.List[i];
      this.sno = [];
      this.sno.Slno = i+1;
      this.sno.URN = claim.urnNo;
      this.sno.Invoice = claim.invoiceno;
      this.sno.HospitalDetails = claim.hospitalname+'('+claim.hospitalcode+')';
      this.sno.Patientname = claim.patientname;
      this.sno.DateofAdmission = claim.dateofadmission;
      this.sno.DateofDischarge = claim.dateofdischarge;
      this.sno.ActualDateofAdmission = claim.actualdateofadmission;
      this.sno.ActualDateofDischarge = claim.actualdateofdischarge;
      this.sno.ClaimRaiseStatus = claim.claimraisestatus;
      this.sno.CpdApprovedAmount = claim.cpd_APPROVED_AMOUNT;
      this.sno.SnaApprovedAmount = claim.sna_APPROVED_AMOUNT;
      this.sno.HospitalstateName = claim.hospital_STATENAME;
      this.sno.HospitalDistrictName = claim.hospital_DISTRICTNAME;
      this.sno.Patientphonenumber = claim.Patientphonenumber;
      this.sno.Gender=claim.gender;
      this.sno.Age=claim.age;
      this.sno.Familyheadname=claim.familyheadname;
      this.sno.Verifiername=claim.verifiername;
      this.sno.Patientstatecode = claim.patient_STATECODE;
      this.sno.Patientdistrictcode = claim.patient_DISTRICTCODE;
      this.sno.Patientblockcode = claim.patient_BLOCKCODE;
      this.sno.Patientpanchayatcode = claim.patient_PANCHAYATCODE;

      this.sno.Patientvillagecode = claim.patient_VILLAGECODE;
      this.sno.PatientstateName = claim.patient_STATENAME;
      this.sno.PatientdistrictName = claim.patient_DISTRICTNAME;
      this.sno.PatientblockName = claim.patient_BLOCKNAME;
      this.sno.PatientpanchayatName = claim.patient_PANCHAYATNAME;
      this.sno.Villagename = claim.villagename;
      this.sno.Fpverifier = claim.Fpverifier;
      this.sno.Fpverifiername = claim.fp_VERIFIERNAME;
      this.sno.Transactiontype = claim.transactiontype;
      this.sno.Transactiondate = claim.transactiondate;
      this.sno.Transactiontime = claim.transactiontime;
      this.sno.Packagecode = claim.packagecode;
      this.sno.Fundavailablebalance = claim.fund_AVAILABLE_BALANCE_from_5lakh;
      this.sno.Noofdays = claim.noofdays;
      this.sno.Mortality = claim.mortality;
      this.sno.Transactiondescription = claim.transactiondescription;
      this.sno.Unblockamount = claim.unblockamount;
      this.sno.Policystartdate = claim.policystartdate;
      this.sno.Policyenddate = claim.policyenddate;
      this.sno.Procedurename = claim.procedurename;
      this.sno.Packagename = claim.packagename;
      this.sno.Packagecategorycode = claim.packagecategorycode;
      this.sno.Packageid = claim.packageid;
      this.sno.Triggerflag = claim.triggerflag;
      this.sno.Referralcode = claim.referralcode;
      this.sno.Hospitalcategoryaccreditation = claim.hospital_Category_Accreditation;
      this.sno.Systemrejectedstatus = claim.sys_REJ_STATUS;
      this.sno.Rejectedstatus = claim.rejected_STATUS;
      this.sno.Verificationmode = claim.verificationmode;
      this.sno.Ispatientotpverified = claim.ispatientotpverified;
      this.sno.Referralauthstatus = claim.referralauthstatus;
      this.sno.Cpdclaimstatus = claim.cpdclaimstatus;
      this.sno.Cpdremarks = claim.cpdremarks;
      this.sno.Snaclaimstatus = claim.snaclaimstatus;
      this.sno.Snaremarks = claim.snaremarks;
      this.sno.Hospitalclaimedamount = claim.hospitalclaimedamount;
      this.report.push(this.sno);
    }
    for (let i = 0; i < this.stateList.length; i++) {
      if (this.stateList[i].stateCode == this.state) {
        this.statename = this.stateList[i].stateName
      }
    }
    for (let i = 0; i < this.districtList.length; i++) {
      if (this.districtList[i].districtcode == this.dis) {
        this.districtName = this.districtList[i].districtname;
      }
    }
    for (let i = 0; i < this.hospitalList.length; i++) {
      if (this.hospital == this.hospitalList[i].hospitalCode) {
        this.hospitalname = this.hospitalList[i].hospitalName;
      }
    }
    let filter = [];
    filter.push([['Actual Date of Discharge From:-', this.formdate]]);
    filter.push([['To:-', this.toDate]]);
    filter.push([['State:- ', this.statename]]);
    filter.push([['District:- ', this.districtName]]);
    filter.push([['Hospital Name:- ', this.hospitalname]]);
    TableUtil.exportListToExcelWithFilterforadmin(this.report, "Discharge Data Report", this.heading, filter);
    }
  }
