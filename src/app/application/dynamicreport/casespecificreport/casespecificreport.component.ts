import { CurrencyPipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { DynamicreportService } from '../../Services/dynamicreport.service';
import { TableUtil } from '../../util/TableUtil';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-casespecificreport',
  templateUrl: './casespecificreport.component.html',
  styleUrls: ['./casespecificreport.component.scss']
})
export class CasespecificreportComponent implements OnInit {
  user: any;
  list: any = [];
  showPegi: boolean;
  currentPage: any;
  pageElement: any;
  totalcount: any = 0;
  txtsearchDate: any;
  searchby: any = "";
  fieldvalue: any
  show: boolean = false;
  dataRequest: any;

  constructor(public headerService: HeaderService,
    public route: Router,
    private service: DynamicreportService, private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle("Case Specific Remark");
    this.user = this.sessionService.decryptSessionData("user");
  }
  ResetField() {
    $("#searchBy").val('');
    $("#field").val('');
    this.show = false;
  }
  getdetails() {
    let searchby = $("#searchBy").val();
    this.fieldvalue = $("#field").val();
    this.searchby = searchby;

    if (this.searchby == null || this.searchby == undefined || this.searchby == "") {
      this.swal('Info', 'Please Select Search By', 'info');
      $("#searchBy").focus();
      return;
    }

    if (this.fieldvalue == null || this.fieldvalue == undefined || this.fieldvalue == "") {
      this.swal('Info', 'Please Fill Field value', 'info');
      $("#field").focus();
      return;
    }
    this.show = true;
    this.service.getspecificcaseremark(this.searchby, this.fieldvalue, this.user.userId).subscribe((data: any) => {
      if (data.status == 200) {
        this.list = data.data
        this.totalcount = this.list.length;
        if (this.totalcount > 0) {
          this.showPegi = true
          this.currentPage = 1
          this.pageElement = 100
        } else {
          this.showPegi = false
        }
      } else {
        this.swal('Error', 'Something Went Wrong', 'error');
      }
    });
  }
  report1: any = [];
  sno: any = {
    Slno: "",
    URN: "",
    claimNo: "",
    caseNo: "",
    PatientName: "",
    phone: "",
    HospitalName: "",
    hospitalcode : "",
    hospitaldistrictname : "",
    Packagecode: "",
    Packagename: "",
    ActualDateofAdmission: "",
    ActualDateofDischarge: "",
    HospitalClaimAmount: "",
  };
  heading = [["Sl No", "URN", "Claim No", "Case No", "Patient Name", "Phone No", "Hospital Name","Hospital Code","Hospital District Name", "Package Code", "Package Name", "Actual Date of Admission", "Actual Date of Discharge", "Hospital Claim Amount"]];

  downloadList(no: any) {
    let search;
    if (this.searchby == 1) {
      search = "CLAIM NO."
    } else if (this.searchby == 2) {
      search = "CASE NO."
    } else if (this.searchby == 3) {
      search = "URN"
    } else {
      search = "All"
    }
    this.report1 = [];
    let claim: any;
    for (var i = 0; i < this.list.length; i++) {
      claim = this.list[i];
      this.sno = [];
      this.sno.Slno = (i + 1).toString();
      this.sno.URN = claim.urn;
      this.sno.claimNo = claim.claimno;
      this.sno.caseNo = claim.caseno;
      this.sno.PatientName = claim.patientname;
      this.sno.phone = claim.phoneno;
      this.sno.HospitalName = claim.hospitalname;
      this.sno.hospitalcode = claim.hospitalcode;
      this.sno.hospitaldistrictname = claim.hospitaldistrictname;
      this.sno.Packagecode = claim.packagecode;
      this.sno.Packagename = claim.packagename;
      this.sno.ActualDateofAdmission = claim.actualdateofadmission;
      this.sno.ActualDateofDischarge = claim.actualdateofdischarge;
      this.sno.HospitalClaimAmount = this.convertCurrency(claim.claimamount);
      this.report1.push(this.sno);
    }
    if (no == 1) {
      let filter = [];
      filter.push([['Search By ', search]]);
      filter.push([['Field value ', this.fieldvalue]]);
      TableUtil.exportListToExcelWithFilter(this.report1, 'Case Specific Remark', this.heading, filter);
    } else {
      let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
      let generatedBy = this.user.fullName;
      if (this.report1 == null || this.report1.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('l', 'mm', [330, 280]);
      doc.setFontSize(20);
      doc.text("Case Specific Remark", 125, 10);
      doc.setFontSize(14);
      doc.text('Search By :- ' + search, 10, 20);
      doc.text('Field value :- ' + this.fieldvalue, 210, 20);
      doc.text('GeneratedOn :- ' + generatedOn, 210, 30);
      doc.text('GeneratedBy :- ' + generatedBy, 10, 30);
      var rows = [];
      for (var i = 0; i < this.report1.length; i++) {
        var clm = this.report1[i];
        var pdf = [];
        pdf[0] = clm.Slno;
        pdf[1] = clm.URN;
        pdf[2] = clm.claimNo;
        pdf[3] = clm.caseNo;
        pdf[4] = clm.PatientName;
        pdf[5] = clm.phone;
        pdf[6] = clm.HospitalName;
        pdf[7] = clm.hospitalcode;
        pdf[8] = clm.hospitaldistrictname;
        pdf[9] = clm.Packagecode;
        pdf[10] = clm.Packagename;
        pdf[11] = clm.ActualDateofAdmission;
        pdf[12] = clm.ActualDateofDischarge;
        pdf[13] = clm.HospitalClaimAmount;
        rows.push(pdf);
      }
      autoTable(doc, {
        head: this.heading,
        body: rows,
        theme: 'grid',
        startY: 35,
        styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
        bodyStyles: { overflow: 'linebreak', cellWidth: 'wrap', lineWidth: 0.1, lineColor: 0, textColor: 20 },
        headStyles: { overflow: 'linebreak', cellWidth: 'wrap', lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255], fillColor: [26, 99, 54] },

        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 15 },
          2: { cellWidth: 15 },
          3: { cellWidth: 15 },
          4: { cellWidth: 20 },
          5: { cellWidth: 20 },
          6: { cellWidth: 20 },
          7: { cellWidth: 20 },
          8: { cellWidth: 20 },
          9: { cellWidth: 20 },
          10: { cellWidth: 20 },
          11: { cellWidth: 20 },
          12: { cellWidth: 20 },
          13: { cellWidth: 20 },
          
        },
      });
      doc.save('Case Specific Remark.pdf');
    }
  }

  onAction(id: any, urn: any, packageCode: any, txnpackagedetailid: any, claimid: any) {
    if (claimid != null || claimid != undefined) {
      let state = {
        transactionId: id,
        flag: '2',
        URN: urn,
        packageCode: packageCode,
        txnpackagedetailid: txnpackagedetailid,
        claimid: claimid
      };
      localStorage.setItem('actionData', JSON.stringify(state));
      this.route.navigate(['/application/mereportclaimdetails']);
    } else {
      let state = {
        txnid: id,
        flag: '2',
        urn: urn
      }
      localStorage.setItem("history", JSON.stringify(state));
      this.route.navigate(['/application/meclaimdetails']);

    }
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }

  convertCurrency(amount: any) {
    var formatter = new CurrencyPipe('en-US');
    amount = formatter.transform(amount, '', '');
    return amount;
  }
}
