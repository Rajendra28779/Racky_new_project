import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { YearwiseGenderserviceService } from '../../Services/yearwise-genderservice.service';
import { TableUtil } from '../../util/TableUtil';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-benificiary-village-dtls',
  templateUrl: './benificiary-village-dtls.component.html',
  styleUrls: ['./benificiary-village-dtls.component.scss']
})
export class BenificiaryVillageDtlsComponent implements OnInit {
  txtsearchDate: any;
  getvillagedata: any = [];
  // distrcitid: any;
  record: any;
  sum: any;
  sum1: any;
  currentPage: any;
  pageElement: any;
  sum2: any;
  showPegi: boolean;
  districtId: any;
  blockId: any;
  gramId: any;
  dist: any;
  block: any;
  gram: any;
  rationcardno: any
  sum3:any;
  constructor(public headerService: HeaderService,private sessionService: SessionStorageService,
    private yearwiseGenderserviceService: YearwiseGenderserviceService, private route: Router) { }

  ngOnInit(): void {
    this.districtId = localStorage.getItem('districtId');
    this.blockId = localStorage.getItem('blockId');
    this.gramId = localStorage.getItem('gramId');
    this.dist = localStorage.getItem('districtName');
    this.block = localStorage.getItem('blockName');
    this.gram = localStorage.getItem('gramName');
    this.rationcardno = localStorage.getItem('rationcardno');
    this.gramwisedetails();
  }

  gramwisedetails() {
    this.yearwiseGenderserviceService.benificaryVillage(this.districtId, this.blockId, this.gramId).subscribe(
      (result) => {
        console.log(result);
        this.getvillagedata = [];
        this.getvillagedata = result;
        this.record = this.getvillagedata.length;
        if (this.record > 0) {
          let sum = 0;
          let sum1 = 0;
          let sum2 = 0;
          let sum3=0;
          for (let i = 0; i < this.getvillagedata.length; i++) {
            sum += parseInt(this.getvillagedata[i].benificiary);
            sum1 += parseInt(this.getvillagedata[i].male);
            sum2+= parseInt(this.getvillagedata[i].female);
            sum3+= parseInt(this.getvillagedata[i].other);
          }
          this.sum = sum;
          this.sum1 = sum1;
          this.sum2 = sum2;
          this.sum3= sum3;
          this.currentPage = 1;
          this.pageElement = 100;
          this.showPegi = true;
        } else {
          this.showPegi = false;
        }
      },
      (error) => console.log(error)
    )
  }

  report: any = [];
  genderWiseGenderList: any = {
    slNo: "",
    villageName: "",
    benificiary: "",
    male: "",
    female: "",
    other: ""
  };

  heading = [['Sl No.', 'Village Name','No. Of RationCard Issued', 'Male', 'Female', 'Other']];
  downloadReport(type) {
    if (this.getvillagedata == null || this.getvillagedata.length == 0) {
      this.swal("Info", "No Record Found", "info");
      return;
    }
    this.report = [];
    let item: any;
    for (var i = 0; i < this.getvillagedata.length; i++) {
      item = this.getvillagedata[i];
      this.genderWiseGenderList = [];
      this.genderWiseGenderList.slNo = i + 1;
      this.genderWiseGenderList.villageName = item.villageName;
      this.genderWiseGenderList.benificiary = item.benificiary;
      this.genderWiseGenderList.male = item.male;
      this.genderWiseGenderList.female = item.female;
      this.genderWiseGenderList.other = item.other;
      this.report.push(this.genderWiseGenderList);
      console.log(this.report);
    }
    this.genderWiseGenderList = [];
    this.genderWiseGenderList.villageName = "Total";
    this.genderWiseGenderList.benificiary = this.sum;
    this.genderWiseGenderList.male = this.sum1;
    this.genderWiseGenderList.female = this.sum2;
    this.genderWiseGenderList.other = this.sum3;
    this.report.push(this.genderWiseGenderList);
    if (type == 1) {
      let filter = [];
      filter.push([['District :-', this.dist]]);
      filter.push([['Block :-', this.block]]);
      filter.push([['Gram Panchayat :-', this.gram]]);
      TableUtil.exportListToExcelWithFilter(this.report, "Beneficiary Gender Wise Report", this.heading, filter);
    } else if (type == 2) {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('p', 'mm', [300, 240]);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text("Beneficiary Gender Wise Report", 80, 10);
      doc.setFontSize(12);
      doc.text("Generated On: " + this.convertDate(new Date()), 15, 20);
      doc.text("Generated By: " + this.sessionService.decryptSessionData("user").fullName, 145, 20);
      doc.text("District :-" + this.dist, 15, 30);
      doc.text("Block :-" + this.block, 85, 30);
      doc.text("Gram Panchayat :-" + this.gram, 165, 30);
      var rows = [];
      for (var i = 0; i < this.report.length; i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.slNo;
        pdf[1] = clm.villageName;
        pdf[2] = clm.benificiary;
        pdf[3] = clm.male;
        pdf[4] = clm.female;
        pdf[5] = clm.other;
        rows.push(pdf);
      }
      console.log(rows);
      autoTable(doc, {
        head: this.heading,
        body: rows,
        theme: 'grid',
        startY: 45,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 55 },
          2: { cellWidth: 35 },
          3: { cellWidth: 35 },
          4: { cellWidth: 35 },

        }
      });
      doc.save('Bsky_Beneficiary Gender Wise Report.pdf');
    }
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  convertDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy hh:mm:ss a', 'en-US');
    return date;
  }
  view(districtId: any, blockId: any, gramId: any, villageId: any, districtName: any, blockName: any, gramName: any, villageName: any) {
    localStorage.setItem("districtId", districtId)
    localStorage.setItem("blockId", blockId)
    localStorage.setItem("gramId", gramId)
    localStorage.setItem("villageId", villageId)
    localStorage.setItem("districtName", districtName)
    localStorage.setItem("blockName", blockName)
    localStorage.setItem("gramName", gramName)
    localStorage.setItem("villageName", villageName)
    localStorage.setItem('rationcardno', this.rationcardno);
    this.route.navigate([]).then(result => {
      window.open(environment.routingUrl + '/benificarydetails');
    });
  }

}