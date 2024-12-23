import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { HeaderService } from '../header.service';
import { HospitalService } from '../Services/hospital.service';
import { SnocreateserviceService } from '../Services/snocreateservice.service';
import { TableUtil } from '../util/TableUtil';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-hospitalincentivereport',
  templateUrl: './hospitalincentivereport.component.html',
  styleUrls: ['./hospitalincentivereport.component.scss']
})
export class HospitalincentivereportComponent implements OnInit {
  public stateList: any = [];
  public districtList: any = [];
  public List: any = [];
  user: any;
  txtsearchDate: any;
  length: any = 0;
  currentPage: any;
  pageElement: any;
  showPegi: boolean = false;
  state: any = "";
  dist: any = "";
  statename: any = "ALL";
  distname: any = "ALL";

  constructor(public route: Router, public headerService: HeaderService, private snoService: SnocreateserviceService, private hospitaService: HospitalService,private sessionService: SessionStorageService
    ) { }

  ngOnInit(): void {
    this.headerService.setTitle('Hospital Incentive Report');
    this.user = this.sessionService.decryptSessionData("user");
    this.getStateList();
    this.Search();
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
    localStorage.setItem("stateCode", id);
    this.snoService.getDistrictListByStateId(id).subscribe(
      (response) => {
        this.districtList = response;
      },
      (error) => console.log(error)
    )
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
  }
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }

  reset() {
    $("#stateId1").val("");
    $("#districtId1").val("");
    this.Search();
  }
  sum: any = 0;
  Search() {
    this.state = $("#stateId1").val();
    this.dist = $("#districtId1").val();
    this.hospitaService.getincentive(this.state, this.dist).subscribe(data => {
      this.List = data;
      this.length = this.List.length;
      let sum = 0;
      for (let i = 0; i < this.List.length; i++) {
        sum += parseInt(this.List[i].count);
      }
      this.sum = sum;
      if (this.length > 0) {
        this.pageElement = 10;
        this.currentPage = 1;
        this.showPegi = true;
      } else {
        this.showPegi = false;
      }
    },
      (error) => console.log(error)
    );
  }

  details(item: any) {
    for (let j = 0; j < this.stateList.length; j++) {
      if (this.stateList[j].stateCode == this.state) {
        this.statename = this.stateList[j].stateName;
      }
    }
    for (let j = 0; j < this.districtList.length; j++) {
      if (this.districtList[j].districtcode == this.dist) {
        this.distname = this.districtList[j].districtname;
      }
    }
    localStorage.setItem("statecode", this.state)
    localStorage.setItem("statename", this.statename)
    localStorage.setItem("distcode", this.dist)
    localStorage.setItem("distname", this.distname)
    localStorage.setItem("catgorycode", item.hospitalId)
    localStorage.setItem("catgoryname", item.hospitalType)
    this.route.navigate([]).then(result => { window.open(environment.routingUrl + '/hospincentivedtls'); });
  }

  report: any = [];
  sno: any = {
    Slno: "",
    distname: "",
    count: "",
  };
  heading = [['Sl#', 'Hospital Category name', 'No Of Hospital']];

  downloadReport(no: any) {
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy =  this.user.fullName;
    for (let j = 0; j < this.stateList.length; j++) {
      if (this.stateList[j].stateCode == this.state) {
        this.statename = this.stateList[j].stateName;
      }
    }
    for (let j = 0; j < this.districtList.length; j++) {
      if (this.districtList[j].districtcode == this.dist) {
        this.distname = this.districtList[j].districtname;
      }
    }

    this.report = [];
    let sna: any;
    for (var i = 0; i < this.List.length; i++) {
      sna = this.List[i];
      this.sno = [];
      this.sno.Slno = i + 1;
      this.sno.distname = sna.hospitalType;
      this.sno.count = sna.count
      this.report.push(this.sno);
    }
    this.sno = [];
    this.sno.distname = "Total";
    this.sno.count = this.sum;
    this.report.push(this.sno);
    if (no == 1) {
      let filter = [];
      filter.push([['State Name', this.statename]]);
      filter.push([['District Name', this.distname]]);
      TableUtil.exportListToExcelWithFilter(
        this.report,
        'Hospital Incentive Report',
        this.heading, filter
      );
    } else {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('p', 'mm', [297, 210]);
      doc.setFontSize(20);
      doc.text("Hospital Incentive Report", 70, 15);
      doc.setFontSize(12);
      doc.text('State Name :- ' + this.statename, 8, 25);
      doc.text('District Name :- ' + this.distname, 95, 25);
      doc.text('GeneratedOn :- ' + generatedOn, 8, 33);
      doc.text('GeneratedBy :- ' + generatedBy, 95, 33);
      var rows = [];
      for (var i = 0; i < this.report.length; i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.Slno;
        pdf[1] = clm.distname;
        pdf[2] = clm.count;
        rows.push(pdf);
      }
      autoTable(doc, {
        head: this.heading,
        body: rows,
        theme: 'grid',
        startY: 40,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 10 },
        }
      });
      doc.save('Hospital Incentive Report.pdf');
    }
  }
}
