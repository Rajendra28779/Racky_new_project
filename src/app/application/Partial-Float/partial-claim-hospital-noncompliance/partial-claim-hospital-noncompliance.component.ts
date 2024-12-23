import { CurrencyPipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { EncryptionService } from 'src/app/services/encryption.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { PackageDetailsMasterService } from '../../Services/package-details-master.service';
import { PartiallfloatserviceService } from '../../Services/partiallfloatservice.service';
import { TableUtil } from '../../util/TableUtil';
declare let $:any;

@Component({
  selector: 'app-partial-claim-hospital-noncompliance',
  templateUrl: './partial-claim-hospital-noncompliance.component.html',
  styleUrls: ['./partial-claim-hospital-noncompliance.component.scss']
})
export class PartialClaimHospitalNoncomplianceComponent implements OnInit {

  txtsearchDate:any;
  list:any=[];
  totalcount:any=0;
  showPegi:any=false;
  pageElement:any;
  currentPage:any;
  user:any;
  formdate: any;
  todate: any;

  constructor(private sessionService: SessionStorageService,
    public headerService: HeaderService,
    public partialclaimserv:PartiallfloatserviceService,
    private encryptionService: EncryptionService,
    public packageDetailsMasterService: PackageDetailsMasterService,
    private route:Router) { }

  ngOnInit(): void {
    this.headerService.setTitle("Partial Claim NonCompliance By Hospital");
    this.user = this.sessionService.decryptSessionData("user");

    this.getSchemeData();
    this.getSchemeDetails();

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
    var frstDay = date1 + '-' + month + '-' + year;
    $('input[name="fromDate"]').val(frstDay);
    $('input[name="fromDate"]').attr('placeholder', 'From Date *');
    $('input[name="toDate"]').attr('placeholder', 'To Date *');

    this.formdate = localStorage.getItem("fromdate");
      this.todate = localStorage.getItem("todate");
      if(this.formdate){
        $('input[name="fromDate"]').val(this.formdate);
        $('input[name="toDate"]').val(this.todate);
      }


    this.Search();
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }

  Search(){
    this.formdate = $('#formdate').val();
    this.todate = $('#todate').val();
    if (this.formdate == null || this.formdate == "" || this.formdate == undefined) {
      this.swal("Warning", "Please Fill From Date", 'info');
      return;
    }
    if (this.todate == null || this.todate == "" || this.todate == undefined) {
      this.swal("Warning", "Please Fill To Date", 'info');
      return;
    }
    if (Date.parse(this.formdate) > Date.parse(this.todate)) {
      this.swal('Warning', ' From Date should be less Than To Date', 'error');
      return;
    }
    this.partialclaimserv.getpartialclaimhospnoncomp(this.formdate, this.todate, this.user.userId,this.schemeidvalue,this.schemecategoryidvalue).subscribe((data: any) => {
      if(data.status==200){
        this.list = data.details;
        this.totalcount = this.list.length;
        if (this.totalcount > 0) {
          this.showPegi = true
          this.currentPage = 1
          this.pageElement = 100
        } else {
          this.showPegi = false
        }
      }else{
        this.swal('Error', 'Something Went Wrong', 'error');
      }
    },
      (error) => console.log(error)
    );
  }

  reset(){
window.location.reload();
  }

  report: any = [];
sno: any = [];
heading = [
  ['Sl#', 'URN','Patient Name', 'Case No','Claim No', 'Hospital Name', 'Package Code','Package Name','Actual Date Of Admission',
   'Actual Date Of Discharge', 'Difference Amount ', 'Partial Claim Amount','SNA Query On']
];

downloadList(no: any) {
  let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
  let generatedBy = this.user.fullName;
  this.report = [];

  for (let i = 0; i < this.list.length; i++) {
    let sna = this.list[i];
    this.sno = [];

    this.sno.push(i + 1); // Sl#
    this.sno.push(sna.urn); // URN
    this.sno.push(sna.patientName); // patient
    this.sno.push(sna.caseNo); // Case No
    this.sno.push(sna.claimNo); // Claim No
    this.sno.push(sna.hospitalName); // Hospital name
    this.sno.push(sna.packageaCode); // package Code
    this.sno.push(sna.packageName); // package name
    this.sno.push(sna.actualDateofAddmision); // Actual Date Of Admission
    this.sno.push(sna.actualDateofDischarge); // Actual Date Of Discharge
    this.sno.push(this.convertCurrency(sna.differenceAmount)); // Claimed Amount (₹)
    // this.sno.push(this.convertCurrency(sna.snaApprovedAmount)); // SNA Approved Amount (₹)
    this.sno.push(this.convertCurrency(sna.partialClaimAmount)); // Partial Claim Amount (₹)
    this.report.push(this.sno);
  }

  if (no == 1) {
    let filter = [];
    filter.push([['Actual Date Of Discharge From Date', this.formdate]]);
    filter.push([['Actual Date Of Discharge To Date', this.todate]]);
    TableUtil.exportListToExcelWithFilter(
      this.report,
      'DC Partial Claim',
      this.heading, filter
    );
  } else {
    if (this.report == null || this.report.length == 0) {
      this.swal("Info", "No Record Found", "info");
      return;
    }
    let doc = new jsPDF('l', 'mm', [297, 210]);
    doc.setFontSize(20);
    doc.text("DC Partial Claim", 120, 15);
    doc.setFontSize(13);
    doc.text('Actual Date of Discharge From :- ' + this.formdate, 15, 25);
      doc.text('Actual Date of Discharge To :- ' + this.todate, 190, 25);
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
    doc.save('DC_Partial_Claim.pdf');
  }
}
onPageBoundsCorrection(number: number) {
  this.currentPage = number;
}

convertCurrency(amount: any) {
  var formatter = new CurrencyPipe('en-IN');
  amount = formatter.transform(amount, '', '');
  return amount;
}

scheme: any;
  schemeidvalue: any=1;
  schemeName: any;
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
          for (const element of this.scheme) {
            this.schemeidvalue = element.schemeId;
            this.schemeName = element.schemeName;
          }
        } else {
          this.swal('', 'Something went wrong.', 'error');
        }
      },
      (error) => {
        this.swal('', 'Something went wrong.', 'error');
      }
    );
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

  schemecategoryidvalue: any=0;
  schemecategoryName: any;
  getschemacategoryid(event: any) {
    if (event != null && event != undefined && event != '' && event != "") {
      for (const element of this.schemeList) {
        if (event == element.schemeCategoryId)
          this.schemecategoryidvalue = element.schemeCategoryId;
        this.schemecategoryName = element.categoryName;
      }
    } else {
      this.schemecategoryidvalue = 0;
      this.schemecategoryName = "All"
    }
  }

  action(item:any){
    localStorage.setItem("fromdate", this.formdate);
    localStorage.setItem("todate", this.todate);
    let state = {
      transactionId: item.transactionid,
      URN: item.urn,
      status:2
    };
    localStorage.setItem('actionData', JSON.stringify(state));
    this.route.navigate(['/application/partialclaimsnodetails/forward']);
  }
}

