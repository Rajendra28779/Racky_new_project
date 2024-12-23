import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SnaactiontakenlogserviceService } from '../../Services/snaactiontakenlogservice.service';
import { JwtService } from 'src/app/services/jwt.service';
import { environment } from 'src/environments/environment';
import { TableUtil } from 'src/app/application/util/TableUtil';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-snaactiontakenlogdetailsrprt',
  templateUrl: './snaactiontakenlogdetailsrprt.component.html',
  styleUrls: ['./snaactiontakenlogdetailsrprt.component.scss'],
})
export class SnaactiontakenlogdetailsrprtComponent implements OnInit {
  user: any;
  date: any;
  type: any;
  claimlist: any;
  countclaimlist: any;
  userId: any;
  constructor(
    private snaactionlog: SnaactiontakenlogserviceService,
    private route: Router,
    private jwtService: JwtService
  ) {}
  ngOnInit(): void {
    //this.user = JSON.parse(sessionStorage.getItem('user'));
    // this.userId = this.user.userId;
    this.user = localStorage.getItem('Snauserid');
    this.date = localStorage.getItem('Snaactiondate');
    this.type = localStorage.getItem('Snaactiontype');
    console.log(this.user);
    this.snaactionlog
      .snaActiontakendetails(this.user, this.date, this.type)
      .subscribe((data: any) => {
        this.claimlist = data;
        console.log(this.claimlist);
        this.countclaimlist = this.claimlist.length;
      });
  }
  details(claim: any, urn: any) {
    //this.username = this.user.fullName;
    //this.timespan = new Date();
    localStorage.setItem('claimid', claim);
    let state = {
      Urn: urn,
    };
    localStorage.setItem('trackingdetails', JSON.stringify(state));
    localStorage.setItem('token', this.jwtService.getJwtToken());
    this.route.navigate([]).then((result) => {
      window.open(environment.routingUrl + '/trackingdetails');
    });
  }

  report: any = [];
  claimlistreport: any = {
    slno: '',
    claimNo: '',
    URN: '',
    Patientname: '',
    hospitalname: '',
    hospitalcode: '',
    packagename: '',
    packagecode: '',
    dateofdischarge: '',
    claimamount: '',
    approvedamount: '',
  };
heading = [
    [
      'Sl#',
      'Claim No',
      'URN',
      'Patient Name',
      'Hospital Name ',
      'Hospital Code ',
      'Package Code ',
      'Package name',
      'Date Of Discharge',
      'Claim amount',
      'Approved amount',
    ],
  ];
  downloadReport(type) {
    this.report = [];
    let sna: any;
    for (var i = 0; i < this.claimlist.length; i++) {
      sna = this.claimlist[i];
      this.claimlistreport = [];
      this.claimlistreport.slno = i + 1;
      this.claimlistreport.claimNo = sna.claimNo;
      this.claimlistreport.URN = sna.urn;
      this.claimlistreport.Patientname = sna.patentname;
      this.claimlistreport.hospitalname = sna.hospitalName;
      this.claimlistreport.hospitalcode = sna.hospitalCode;
      this.claimlistreport.packagecode = sna.packagecode;
      this.claimlistreport.packagename = sna.packageName;
      this.claimlistreport.dateofdischarge = sna.actDateOfDschrg;
      this.claimlistreport.claimamount = sna.claimamount;
      this.claimlistreport.approvedamount = sna.approvedamount;
      this.report.push(this.claimlistreport);
    }
    if (type == 'xcl') {
      let filter = [];
      filter.push([['Date', this.date]]);
      if (this.type == 1) {
        filter.push([['Action', 'Approved']]);
      } else if (this.type == 2) {
        filter.push([['Action', 'Reject']]);
      } else if (this.type == 4) {
        filter.push([['Action', 'Query']]);
      } else if (this.type == 6) {
        filter.push([['Action', 'Investigate']]);
      } else if (this.type == 8) {
        filter.push([['Action', 'Revert']]);
      }
      TableUtil.exportListToExcelWithFilter(
        this.report,
        'SNA Action Claim Report',
        this.heading,
        filter
      );
    } else if (type == 'pdf') {
      if (this.report == null || this.report.length == 0) {
        this.swal('Info', 'No Record Found', 'info');
        return;
      }
      var doc = new jsPDF('l', 'mm', [360, 260]);
      doc.text('Date : ' + this.date, 10, 30);
      if (this.type == 1) {
        doc.text('Action :' + 'Approved', 10, 40);
      }
      if (this.type == 2) {
        doc.text('Action :' + 'Reject', 10, 40);
      }
      if (this.type == 4) {
        doc.text('Action :' + 'Query', 10, 40);
      }
      if (this.type == 6) {
        doc.text('Action :' + 'Investigate', 10, 40);
      }
      if (this.type == 8) {
        doc.text('Action :' + 'Revert', 10, 40);
      }
      //doc.text('Generated  By :' + this.username, 10, 50);
      // doc.text('Generated On :' + this.convertStringToDate1(this.timespan),10,60);
      doc.setFont('helvetica', 'bold');
      doc.text('SNA Action Claim Report', 160, 10);
      doc.setFontSize(30);
      var rows = [];
      for (var i = 0; i < this.report.length; i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.slno;
        pdf[1] = clm.claimNo;
        pdf[2] = clm.URN;
        pdf[3] = clm.Patientname;
        pdf[4] = clm.hospitalname;
        pdf[5] = clm.hospitalcode;
        pdf[6] = clm.packagecode;
        pdf[7] = clm.packagename;
        pdf[8] = clm.dateofdischarge;
        pdf[9] = clm.claimamount;
        pdf[10] = clm.approvedamount;
        rows.push(pdf);
      }
      console.log(rows);
      autoTable(doc, {
        head: this.heading,
        body: rows,
        theme: 'grid',
        startY: 50,
        headStyles: {
          fillColor: [26, 99, 54],
        },
        columnStyles: {
          0: { cellWidth: 20 },
          1: { cellWidth: 30 },
          2: { cellWidth: 30 },
          3: { cellWidth: 30 },
          4: { cellWidth: 30 },
          5: { cellWidth: 30 },
          6: { cellWidth: 30 },
          7: { cellWidth: 30 },
          8: { cellWidth: 30 },
          9: { cellWidth: 30 },
          10: { cellWidth: 30 },
        },
      });
      doc.save('SNA Action Taken Report.pdf');
    }
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
  convertStringToDate1(date) {
    var datePipe = new DatePipe('en-US');
    date = datePipe.transform(date, 'dd-MMM-yyyy HH:mm:ss');
    return date;
  }
}
