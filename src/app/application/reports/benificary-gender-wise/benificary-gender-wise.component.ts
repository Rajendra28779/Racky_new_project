import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderService } from '../../header.service';
import { YearwiseGenderserviceService } from '../../Services/yearwise-genderservice.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { TableUtil } from '../../util/TableUtil';
import jsPDF from 'jspdf';
import { DatePipe } from '@angular/common';
import autoTable from 'jspdf-autotable';
import { Console } from 'console';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-benificary-gender-wise',
  templateUrl: './benificary-gender-wise.component.html',
  styleUrls: ['./benificary-gender-wise.component.scss']
})
export class BenificaryGenderWiseComponent implements OnInit {
  showPegi: boolean;
  txtsearchDate: any;
  listData: any = [];
  user: any;
  getAllYearwiseData: any = [];
  record: any;
  sum: number;
  sum1: number;
  sum2: number;
  sum3: number;
  constructor(public headerService: HeaderService,
    private yearwiseGenderserviceService: YearwiseGenderserviceService, private route: Router,private sessionService: SessionStorageService) { }
  ngOnInit(): void {
    this.headerService.setTitle('Beneficiary Gender Wise Report');
    this.headerService.isIndicate(true);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.headerService.isBack(false);
    // this.user = JSON.parse(sessionStorage.getItem("user"));
    this.user = this.sessionService.decryptSessionData("user");
    this.search();
    this.getagedropdown();
  }
  search() {
    let userId = this.user.userId;
    let age = this.agevalue;
    let ageconditions = this.condition;
    if (age == null || age == undefined || age == '') {
      age = 0;
    }
    if (ageconditions == null || ageconditions == undefined || ageconditions == '') {
      ageconditions = 0;
    }
    if (ageconditions != 0 && age == 0) {
      this.swal('', 'Please Choose Age', 'error');
      return;
    }
    if (age != 0 && ageconditions == 0) {
      this.swal('', 'Please Choose Age Condition', 'error');
      return;
    }
    this.yearwiseGenderserviceService.benificaryGenderWise(age, ageconditions).subscribe(
      (result) => {
        this.getAllYearwiseData = [];
        this.getAllYearwiseData = result;
        this.record = this.getAllYearwiseData.length;
        if (this.record > 0) {
          let sum = 0;
          let sum1 = 0;
          let sum2 = 0;
          let sum3 = 0;
          for (let i = 0; i < this.getAllYearwiseData.length; i++) {
            sum += parseInt(this.getAllYearwiseData[i].benificiary);
            sum1 += parseInt(this.getAllYearwiseData[i].male);
            sum2 += parseInt(this.getAllYearwiseData[i].female);
            sum3 += parseInt(this.getAllYearwiseData[i].other);
          }
          this.sum = sum;
          this.sum1 = sum1;
          this.sum2 = sum2;
          this.sum3 = sum3;
          this.showPegi = true;
        } else {
          this.showPegi = false;
        }
      },
      (error) => console.log(error)
    )
  }
  view(districtId: any, districtName: any, rationcardno: any) {
    localStorage.setItem("districtId", districtId)
    localStorage.setItem("districtName", districtName)
    localStorage.setItem("rationcardno", rationcardno)
    this.route.navigate([]).then(result => {
      window.open(environment.routingUrl + '/blockwisegenderdetails');
    });
  }
  report: any = [];
  genderWiseGenderList: any = {
    slNo: "",
    districtName: "",
    benificiary: "",
    male: "",
    female: "",
    other: ""
  };
  heading = [['Sl No.', 'District Name', 'No. Of Beneficiary Issued', 'Male', 'Female', 'Other']];
  downloadReport(type) {
    if (this.getAllYearwiseData == null || this.getAllYearwiseData.length == 0) {
      this.swal("Info", "No Record Found", "info");
      return;
    }
    this.report = [];
    let item: any;
    for (var i = 0; i < this.getAllYearwiseData.length; i++) {
      item = this.getAllYearwiseData[i];
      this.genderWiseGenderList = [];
      this.genderWiseGenderList.slNo = i + 1;
      this.genderWiseGenderList.districtName = item.districtName;
      this.genderWiseGenderList.benificiary = item.benificiary;
      this.genderWiseGenderList.male = item.male;
      this.genderWiseGenderList.female = item.female;
      this.genderWiseGenderList.other = item.other;
      this.report.push(this.genderWiseGenderList);
    }
    this.genderWiseGenderList = [];
    this.genderWiseGenderList.districtName = "Total";
    this.genderWiseGenderList.benificiary = this.sum;
    this.genderWiseGenderList.male = this.sum1;
    this.genderWiseGenderList.female = this.sum2;
    this.genderWiseGenderList.other = this.sum3;
    this.report.push(this.genderWiseGenderList);
    if (type == 1) {
      let filter = [];
      if (this.agevalue != null && this.agevalue != undefined && this.agevalue != '') {
        filter.push([['Age:-', this.agevalue]]);
      } else {
        filter.push([['Age:-', "All"]]);
      }
      if (this.condition == 1) {
        filter.push([['Age Condition:-', "<(Less Then)"]]);
      } else if (this.condition == 2) {
        filter.push([['Age Condition:-', ">(Greater Then)"]]);
      } else if (this.condition == 3) {
        filter.push([['Age Condition:-', "<=(Less Then Equal)"]]);
      } else if (this.condition == 4) {
        filter.push([['Age Condition:-', ">=(Greater Then Equal)"]]);
      } else if (this.condition == 5) {
        filter.push([['Age Condition:-', "=(Equal)"]]);
      } else {
        filter.push([['Age Condition:-', "All"]])
      }
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
      if (this.agevalue != null && this.agevalue != undefined && this.agevalue != '') {
        doc.text("Age: " + this.agevalue, 15, 20);
      } else {
        doc.text("Age: " + "All", 15, 20);
      }
      if (this.condition == 1) {
        doc.text("Age Condition: " + "<(Less Then)", 145, 20);
      } else if (this.condition == 2) {
        doc.text("Age Condition: " + ">(Greater Then)", 145, 20);
      } else if (this.condition == 3) {
        doc.text("Age Condition: " + "<=(Less Then Equal)", 145, 20);
      } else if (this.condition == 4) {
        doc.text("Age Condition: " + ">=(Greater Then Equal)", 145, 20);
      } else if (this.condition == 5) {
        doc.text("Age Condition: " + "=(Equal)", 145, 20);
      } else {
        doc.text("Age Condition: " + "All", 145, 20);
      }
      doc.text("Generated On: " + this.convertDate(new Date()), 15, 25);
      doc.text("Generated By: " + this.sessionService.decryptSessionData("user").fullName, 145, 25);
      var rows = [];
      for (var i = 0; i < this.report.length; i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.slNo;
        pdf[1] = clm.districtName;
        pdf[2] = clm.benificiary;
        pdf[3] = clm.male;
        pdf[4] = clm.female;
        pdf[5] = clm.other;
        rows.push(pdf);
      }
      autoTable(doc, {
        head: this.heading,
        body: rows,
        theme: 'grid',
        startY: 35,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 55 },
          2: { cellWidth: 30 },
          3: { cellWidth: 30 },
          4: { cellWidth: 30 },
          5: { cellWidth: 30 },
        }
      });
      doc.save('Bsky_Beneficiary Gender Wise Report.pdf');
    }
  }
  convertDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy hh:mm:ss a', 'en-US');
    return date;
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  ages: any = [];
  getagedropdown() {
    // Assume you want an age range from 1 to 150
    for (let i = 1; i <= 150; i++) {
      this.ages.push(i);
    }
  }
  getRestdata() {
    window.location.reload();
  }
  agevalue: any
  getage(item: any) {
    this.agevalue = item;
  }
  condition: any;
  getagecondition(condition: any) {
    this.condition = condition;
  }
}

