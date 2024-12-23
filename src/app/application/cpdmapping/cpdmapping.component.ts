import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CpdmappingserviceService } from '../Services/cpdmappingservice.service';
import { SnocreateserviceService } from '../Services/snocreateservice.service';
import { TableUtil } from '../util/TableUtil';
import { HeaderService } from '../header.service';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import { CurrencyPipe, formatDate } from '@angular/common';
import autoTable from 'jspdf-autotable';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-cpdmapping',
  templateUrl: './cpdmapping.component.html',
  styleUrls: ['./cpdmapping.component.scss']
})
export class CpdmappingComponent implements OnInit {

  stateList: any;
  stateId: any;
  hospitalList: any;
  snareport: any;
  restrictedHospital: any;
  keyword = 'hospitalName';
  hospitalCode: any = "";
  stateCode: any;
  fullname: any;

  countlist: any;
  showPegi: any;
  pageElement: any;
  currentPage: any;
  txtsearchDate: any;
  stateAndhospitalcpdlist: any;
  user: any;

  constructor(private snoService: SnocreateserviceService, private cpdmappingser: CpdmappingserviceService, public headerService: HeaderService,private sessionService: SessionStorageService,) { }

  ngOnInit(): void {
    this.headerService.setTitle("CPD Mapping");
    // this.user = JSON.parse(sessionStorage.getItem('user'));
    this.user = this.sessionService.decryptSessionData("user");
    this.getStateList();

  }

  SearchForm = new FormGroup({
    stateCode: new FormControl(''),
    hospitalCode: new FormControl(''),
    hospitalName: new FormControl(''),
    userName: new FormControl(''),
    fullname: new FormControl(''),
    // stateName:new FormControl(''),
  });

  getStateList() {
    this.snoService.getStateList().subscribe(
      (response) => {
        this.stateList = response;
        this.getAllData();
      },
      (error) => console.log(error)
    )
  }

  OnChangeState(id) {
    localStorage.setItem("stateCode", id);
    this.cpdmappingser.getHospitalByStateCode(id).subscribe(
      (response) => {
        this.restrictedHospital = response;
      },
      (error) => console.log(error)
    )
  }

  onReset() {
    this.hospitalCode = "";
    this.fullname = "";
  }

  onResetmethode() {
    window.location.reload();
  }


  drlist: any = [];
  hoscode: any;

  hosName: any = "ALL";
  selectEvent(item) {
    this.hospitalCode = item.hospitalCode;
    this.fullname = item.fullname;
    this.hosName = item.hospitalName;
  }

  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
  }

  getAllData() {
    let stateCode = $('#stateCode').val();

    if (stateCode == undefined) {
      this.stateCode = ""
    } else {
      this.stateCode = stateCode;
    }

    this.cpdmappingser.searchCpdmappingHospitalrepo(this.stateCode, this.hospitalCode).subscribe(
      (response) => {
        this.stateAndhospitalcpdlist = response;
        this.countlist = this.stateAndhospitalcpdlist.length;
        if (this.countlist > 0) {
          this.currentPage = 1;
          this.pageElement = 10;
          this.showPegi = true;
        }

        if (this.stateAndhospitalcpdlist.length > 0) {
          this.snareport = false;
        } else {
          this.snareport = true;
        }
      },
      (error) => console.log(error)
    )

  }



  Search() {
    let stateCode = $('#stateCode').val();
    if (stateCode == undefined) {
      this.stateCode = ""
    } else {
      this.stateCode = stateCode;
    }
    this.cpdmappingser.searchCpdmappingHospitalrepo(this.stateCode, this.hospitalCode).subscribe(
      (response) => {
        this.stateAndhospitalcpdlist = response;
        this.countlist = this.stateAndhospitalcpdlist.length;
        if (this.countlist > 0) {
          this.currentPage = 1;
          this.pageElement = 10;
          this.showPegi = true;
        }
        if (this.stateAndhospitalcpdlist.length > 0) {
          this.snareport = false;
        } else {
          this.snareport = true;
        }
      },
      (error) => console.log(error)
    )
  }


  report: any = [];
  cpdmappinglist: any = {
    slNo: "",
    fullname: "",
    userName: "",
    hospitalCode: "",
    hospitalName: "",
  };
  heading = [['Sl No.', 'FullName', 'UserName', 'Hospital Code', 'Hospital Name']];
  stateName: any = "ALL";
  downloadReport(type: any) {
    if (this.stateAndhospitalcpdlist.length == 0) {
      this.swal('', 'No Data Found', 'info');
      return;
    }
    this.report = [];
    let item: any;
    for (var i = 0; i < this.stateAndhospitalcpdlist.length; i++) {
      item = this.stateAndhospitalcpdlist[i];
      this.cpdmappinglist = [];
      this.cpdmappinglist.slNo = i + 1;
      this.cpdmappinglist.fullname = item.fullname;
      this.cpdmappinglist.userName = item.userName;
      this.cpdmappinglist.hospitalCode = item.hospitalCode;
      this.cpdmappinglist.hospitalName = item.hospitalName;
      this.report.push(this.cpdmappinglist);
    }
    for (let j = 0; j < this.stateList.length; j++) {
      if (this.stateList[j].stateCode == this.stateCode) {
        this.stateName = this.stateList[j].stateName;
      }
    }
    if (type == 'excel') {
      let filter = [];
      filter.push([['State Name :-', this.stateName]]);
      filter.push([['Restricted Hospital Name:-', this.hosName]]);
      TableUtil.exportListToExcelWithFilter(this.report, "CPD Mapping List Report", this.heading, filter);
    } else if (type == 'pdf') {
      if (this.stateAndhospitalcpdlist.length == 0) {
        this.swal('', 'No Data Found', 'info');
        return;
      }
      const doc = new jsPDF('p', 'mm', [240, 272]);
      doc.setFontSize(12);
      doc.text("CPD Mapping List Report", 14, 10);
      doc.text("State:- " + this.stateName, 14, 20);
      doc.text("Restricted Hospital Name:- " + this.hosName, 14, 30);
      doc.text("Generated By: " + this.user.fullName + "\tGenerated On: " + formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString(), 14, 40);
      let pdfRpt = [];
      for (var x = 0; x < this.stateAndhospitalcpdlist.length; x++) {
        var flt = this.stateAndhospitalcpdlist[x];
        var pdf = [];
        pdf[0] = x + 1;
        pdf[1] = flt.fullname;
        pdf[2] = flt.userName;
        pdf[3] = flt.hospitalCode;
        pdf[4] = flt.hospitalName;
        pdfRpt.push(pdf);
      }
      autoTable(doc, {
        head: this.heading,
        body: pdfRpt,
        theme: 'grid',
        startY: 50,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 40 },
          2: { cellWidth: 80 },
          3: { cellWidth: 40 },
          4: { cellWidth: 40 },
        }
      });
      doc.save('CPD Mapping List Report_' + '.pdf');
    }
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }

}
