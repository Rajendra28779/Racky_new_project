import { CurrencyPipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { EncryptionService} from 'src/app/services/encryption.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { PackageDetailsMasterService } from '../../Services/package-details-master.service';
import { PartiallfloatserviceService } from '../../Services/partiallfloatservice.service';
import { TableUtil } from '../../util/TableUtil';
declare let $:any;

@Component({
  selector: 'app-partial-claim-quereid',
  templateUrl: './partial-claim-quereid.component.html',
  styleUrls: ['./partial-claim-quereid.component.scss']
})
export class PartialClaimQuereidComponent implements OnInit {

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
    private route:Router,
    private encryptionService: EncryptionService,
    public packageDetailsMasterService: PackageDetailsMasterService,) { }

  ngOnInit(): void {
    this.headerService.setTitle("Partial Claim Query By SNA");
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
    let date = new Date();

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
    let frstDay = date1 + '-' + month + '-' + year;
    $('input[name="fromDate"]').val(frstDay);
    $('input[name="fromDate"]').attr('placeholder', 'From Date *');
    $('input[name="toDate"]').attr('placeholder', 'To Date *');

      this.formdate = localStorage.getItem("fromdate2");
      this.todate = localStorage.getItem("todate2");
      if(this.formdate){
        $('input[name="fromDate"]').val(this.formdate);
        $('input[name="toDate"]').val(this.todate);
      }

    this.getClaimDetails();
  }

  getRestdata(){
    window.location.reload();
  }

  getClaimDetails(){
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
    // getlistofpartialclaimview // getlistofpartialclaimquery
    this.partialclaimserv.getlistofpartialclaimquery(this.formdate, this.todate, this.user.userName,this.schemeidvalue,this.schemecategoryidvalue).subscribe((data: any) => {
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

  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }

  action(item:any){
    localStorage.setItem("fromdate2", this.formdate);
    localStorage.setItem("todate2", this.todate);
    let navigationExtras: NavigationExtras = {
      state: {
        claimId: item.claimId,
        transactionId: item.transactionid,
        urn:item.urn,
        status:3
      },
    };
    this.route.navigate(['application/partialClaimRaise/action'], navigationExtras);
  }

  heading = [
    ['Sl#', 'URN', 'Patient Name', 'Case Number', 'Claim Number', 'Package Code','Package Name',
     'Actual Date Of Admission', 'Actual Date Of Discharge', 'Difference Amount','PartialClaim Amount',
    'SNA Query Date']
  ];
  report:any=[];
  sno:any=[];

  downloadList(no: any) {
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy = this.user.fullName;
    this.report = [];

    for (let i = 0; i < this.list.length; i++) {
      let v = this.list[i];
      this.sno = [];
      this.sno.push(i + 1); // Sl#
      this.sno.push(v.urn); // URN
      this.sno.push(v.patientName); // Patient Name
      this.sno.push(v.caseNo); // Case Number
      this.sno.push(v.claimNo); // Claim Number
      this.sno.push(v.packageaCode); // Package Code
      this.sno.push(v.packageName); // Package Code
      this.sno.push(v.actualDateofAddmision); // Actual Date Of Admission
      this.sno.push(v.actualDateofDischarge); // Actual Date Of Discharge
      // this.sno.push(v.totalAmountClaim); // Total Amount Claimed(₹)
      // this.sno.push(v.cpdApprovedAmount); // CPD Approved Amount(₹)
      // this.sno.push(v.snaApprovedAmount); // SNA Approved Amount(₹)
      this.sno.push(this.convertCurrency(v.differenceAmount)); // Difference Amount(₹)
      this.sno.push(this.convertCurrency(v.partialclaimAmount)); // Partial Amount(₹)
      this.sno.push(v.snaQueryDate); // Difference Amount(₹)

      this.report.push(this.sno);
    }

    if (no == 1) {
      let filter = [];
      filter.push([['From Date', this.formdate]]);
      filter.push([['To Date', this.todate]]);
      TableUtil.exportListToExcelWithFilter(
        this.report,
        'Partial Claim Query By SNA',
        this.heading, filter
      );
    } else {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      let doc = new jsPDF('l', 'mm', [297, 210]);
      doc.setFontSize(20);
      doc.text("Partial Claim Query By SNA", 110, 15);
      doc.setFontSize(13);
      doc.text('Actual Date of Discharge From :- ' + this.formdate, 15, 25);
      doc.text('Actual Date of Discharge To :- ' + this.todate, 190, 25);
      doc.text('GeneratedOn :- ' + generatedOn, 190, 32);
      doc.text('GeneratedBy :- ' + generatedBy, 15, 32);
      autoTable(doc, {
        head: this.heading,
        body: this.report,
        theme: 'grid',
        startY: 37,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 10 },
        }
      });
      doc.save('Partial Claim Query By SNA.pdf');
    }
  }

  convertCurrency(amount: any) {
    let formatter = new CurrencyPipe('en-IN');
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

}
