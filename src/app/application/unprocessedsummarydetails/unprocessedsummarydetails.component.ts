import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';
import { UnprocessedclaimService } from '../Services/unprocessedclaim.service';
import { TableUtil } from '../util/TableUtil';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-unprocessedsummarydetails',
  templateUrl: './unprocessedsummarydetails.component.html',
  styleUrls: ['./unprocessedsummarydetails.component.scss']
})
export class UnprocessedsummarydetailsComponent implements OnInit {
  user: any;
  unprocessed: any;
  list:any=[];
  showPegi: boolean;
currentPage: any;
pageElement: any;
totalcount:any=0;
txtsearchDate:any;

  constructor(public route: Router,private unprocessedService: UnprocessedclaimService, private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.unprocessed = JSON.parse(localStorage.getItem("unprocessed"));
    console.log(this.unprocessed);
    if(this.unprocessed!=undefined){
      this.unprocessedService.getunprocessedsummarydetails(this.unprocessed).subscribe((response:any) => {
        this.list = response;
        this.totalcount=this.list.length;
        if(this.totalcount>0){
          this.showPegi=true
          this.currentPage=1
          this.pageElement=100
        }else{
          this.showPegi=false
        }
      },(error) => console.log(error)
      );
    }else{
      this.swal("Error", "Something Went Wrong", "error");
    }

  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  report: any = [];
  claimlistreport: any = {
    slno: '',
    URN: '',
    caseno: '',
    Patientname: '',
    hospitalname: '',
    hospitalcode: '',
    packagename: '',
    packagecode: '',
    dateofadmission: '',
    dateofdischarge: '',
    claimamount: '',
  };
heading = [
    [
      'Sl#',
      'URN',
      'Case No',
      'Patient Name',
      'Hospital Name ',
      'Hospital Code ',
      'Package Code ',
      'Package name',
      'Actual Date Of Admission',
      'Actual Date Of Discharge',
      'Claim amount',
    ],
  ];
  downloadList(type) {
    this.report = [];
    let sna: any;
    for (var i = 0; i < this.list.length; i++) {
      sna = this.list[i];
      this.claimlistreport = [];
      this.claimlistreport.slno = i + 1;
      this.claimlistreport.URN = sna.urn;
      this.claimlistreport.caseno = sna.caseno;
      this.claimlistreport.Patientname = sna.patient;
      this.claimlistreport.hospitalname = sna.hname;
      this.claimlistreport.hospitalcode = sna.hcode;
      this.claimlistreport.packagecode = sna.phcode;
      this.claimlistreport.packagename = sna.phname;
      this.claimlistreport.dateofadmission = sna.adateadd;
      this.claimlistreport.dateofdischarge = sna.adatedis;
      this.claimlistreport.claimamount = sna.claimedamount;
      this.report.push(this.claimlistreport);
    }
    if (type == 1) {
      let filter = [];
      filter.push([['Actual Date Of Discharge From :- ',this.unprocessed.fromDate]]);
      filter.push([['Actual Date Of Discharge To :- ', this.unprocessed.toDate]]);
      filter.push([['State Name :-',this.unprocessed.statename]]);
      filter.push([['District Name :-',this.unprocessed.distname]]);
      filter.push([['Hospital Name :-',this.unprocessed.hospname]]);
      TableUtil.exportListToExcelWithFilter(
        this.report,
        'Unprocessed Summary Details',
        this.heading,
        filter
      );
    } else if (type == 2) {
      if (this.report == null || this.report.length == 0) {
        this.swal('Info', 'No Record Found', 'info');
        return;
      }
      var doc = new jsPDF('l', 'mm', [320, 210]);
      let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
      let generatedBy = this.sessionService.decryptSessionData("user").fullName;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.text('Unprocessed Summary Details Report', 110, 15);
      doc.setFontSize(14);
      doc.text('Actual Date Of Discharge From :- ' + this.unprocessed.fromDate+ 'To :- '+this.unprocessed.toDate, 15, 23);
      doc.text('State Name :-'+this.unprocessed.statename,220,23);
      doc.text('District Name :-'+this.unprocessed.distname,220,31);
      doc.text('Hospital Name :-'+this.unprocessed.hospname,15,31);
      doc.text('GeneratedOn :- '+generatedOn,210,39);
      doc.text('GeneratedBy :- '+generatedBy,15,39);
      var rows = [];
      for (var i = 0; i < this.report.length; i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.slno;
        pdf[1] = clm.URN;
        pdf[2] = clm.caseno;
        pdf[3] = clm.Patientname;
        pdf[4] = clm.hospitalname;
        pdf[5] = clm.hospitalcode;
        pdf[6] = clm.packagecode;
        pdf[7] = clm.packagename;
        pdf[8] = clm.dateofadmission;
        pdf[9] = clm.dateofdischarge;
        pdf[10] = clm.claimamount;
        rows.push(pdf);
      }
      console.log(rows);
      autoTable(doc, {
        head: this.heading,
        body: rows,
        theme: 'grid',
        startY: 45,
        headStyles: {
          fillColor: [26, 99, 54],
        },
        columnStyles: {
          0: { cellWidth:10},
          4: { cellWidth:40},
        },
      });
      doc.save('GJAY_Unprocessed Summary Details Report.pdf');
    }
  }

}
