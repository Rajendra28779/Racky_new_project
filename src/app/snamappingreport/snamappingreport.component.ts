import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';
import { HeaderService } from '../application/header.service';
import { CpdmappingserviceService } from '../application/Services/cpdmappingservice.service';
import { SnamasterserviceService } from '../application/Services/snamasterservice.service';
import { SnocreateserviceService } from '../application/Services/snocreateservice.service';
import { TableUtil } from '../application/util/TableUtil';
import { SessionStorageService } from '../services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-snamappingreport',
  templateUrl: './snamappingreport.component.html',
  styleUrls: ['./snamappingreport.component.scss']
})
export class SnamappingreportComponent implements OnInit {
  user: any;
  stateList: any = [];
  districtList: any = [];
  hospitalList: any = [];
  state: any = "";
  dist: any = "";
  hospital: any = "";
  list: any = [];
  showPegi: boolean;
  currentPage: any;
  pageElement: any;
  totalcount: any = 0;
  txtsearchDate: any;
  hospname: any = "ALL";
  distname: any = "ALL";
  statename: any = "ALL";
  tagged:any=0;

  constructor(private snoService: SnocreateserviceService,
    public headerService: HeaderService,
    private snamasterService: SnamasterserviceService,
    private cpdmappingser: CpdmappingserviceService, private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle("SNA Mapping Report");
    this.user = this.sessionService.decryptSessionData("user");
    this.getStateList();
    this.sabmit();
  }

  getStateList() {
    this.snamasterService.getStateList(this.user.userId).subscribe(
      (response) => {
        this.stateList = response;
      })
  }
  OnChangeState(id) {
    $("#districtId").val("");
    this.hospital = $('#hospital').val('');
    localStorage.setItem("stateCode", id);
    this.snoService.getDistrictListByStateId(id).subscribe(
      (response) => {
        this.districtList = response;
      },
      (error) => console.log(error)
    )
  }
  OnChangeDistrict(id) {
    this.hospital = $('#hospital').val('');
    let stateCode = localStorage.getItem("stateCode");
    this.snoService.getHospitalbyDistrictId(id, stateCode).subscribe(
      (response) => {

        this.hospitalList = response;
      },
      (error) => console.log(error)
    )
  }

  sabmit() {
    this.state = $('#stateId').val();
    this.dist = $('#districtId').val();
    this.hospital = $('#hospital').val();
    this.cpdmappingser.getsnamappingreport(this.state, this.dist, this.hospital,this.tagged).subscribe((response: any) => {
      this.list = response.data;
      this.totalcount = this.list.length;
      if (this.totalcount > 0) {
        this.showPegi = true;
        this.currentPage = 1;
        this.pageElement = 100;
      }
    });
  }

  ResetField() {
    this.state = $('#stateId').val('');
    this.dist = $('#districtId').val('');
    this.hospital = $('#hospital').val('');
    this.tagged=0
    this.sabmit();
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }

  report: any = [];
  sno: any = [];
  heading = [['Sl#','State Name','District Name','Hospital Name', 'Hospital Code', 'SNA Name']];
  downloadList(no: any) {
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy = this.user.fullName;
    this.report = [];
    let sna: any;
    for (let i = 0; i < this.list.length; i++) {
      sna = this.list[i];
      this.sno = [];
      this.sno.push(i + 1);
      this.sno.push(sna.stateName);
      this.sno.push(sna.distName);
      this.sno.push(sna.hospitalName);
      this.sno.push(sna.hospitalCode);
      this.sno.push(sna.snaName);
      this.report.push(this.sno);
    }
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
    for (let j = 0; j < this.hospitalList.length; j++) {
      if (this.hospitalList[j].hospitalCode == this.hospital) {
        this.hospname = this.hospitalList[j].hospName;
      }
    }
    let sntats=this.tagged==1?"Tagged":this.tagged==2?"Not Tagged":"ALL";
    if (no == 1) {
      let filter = [];
      filter.push([['StateName', this.statename]]);
      filter.push([['District Name', this.distname]]);
      filter.push([['Hospital Name', this.hospname]]);
      filter.push([['SNA Tagged Status', sntats]]);
      TableUtil.exportListToExcelWithFilter(
        this.report,
        'Hospital SNA Mapping Report',
        this.heading, filter
      );
    } else {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      let doc = new jsPDF('p', 'mm', [297, 210]);
      doc.setFontSize(20);
      doc.text("Hospital SNA Mapping Report", 65, 15);
      doc.setFontSize(13);
      doc.text('State Name :- ' + this.statename, 15, 25);
      doc.text('District Name :- ' + this.distname, 125, 25);
      doc.text('Hospital Name :- ' + this.hospname, 15, 33);
      doc.text('SNA Tagged Status :- ' + sntats, 125, 41);
      doc.text('GeneratedOn :- ' + generatedOn, 15, 41);
      doc.text('GeneratedBy :- ' + generatedBy, 15, 48);
      autoTable(doc, {
        head: this.heading,
        body: this.report,
        theme: 'grid',
        startY: 55,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 10 },
        }
      });
      doc.save('Hospital_SNA_Mapping_Report.pdf');
    }
  }
}
