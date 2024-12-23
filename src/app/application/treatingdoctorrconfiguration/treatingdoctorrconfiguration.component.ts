import { Component, OnInit } from '@angular/core';
import { SnocreateserviceService } from '../Services/snocreateservice.service';
import { HeaderService } from '../header.service';
import { HospitalService } from '../Services/hospital.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { TableUtil } from '../util/TableUtil';
import { DatePipe, formatDate } from '@angular/common';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-treatingdoctorrconfiguration',
  templateUrl: './treatingdoctorrconfiguration.component.html',
  styleUrls: ['./treatingdoctorrconfiguration.component.scss']
})
export class TreatingdoctorrconfigurationComponent implements OnInit {
  user: any;
  currentPage: any;
  pageElement: any;
  txtsearchDate: any;
  stateList: any = [];
  districtList: any = [];
  list: any = [];
  list1: any = [];
  checkall: any;
  totalcount: any = 0
  showPegi: boolean;
  hospObj: any;
  hospList: any = [];
  showsubmitbutton: any = false;
  statename: any = "All";
  distname: any = "All";
  txtsearchmodal: any;
  data: any;
  result: any;
  logdata: any;
  logdetails: any = [];
  logdetailstotal: any = 0;
  hospitalname: any;
  constructor(private snoService: SnocreateserviceService,
    public headerService: HeaderService, private hospitaService: HospitalService,
    public route: Router, private sessionService: SessionStorageService) { }
  ngOnInit(): void {
    this.headerService.setTitle("Treating Doctor Configuration");
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
    );
  }
  OnChangeState(id) {
    this.snoService.getDistrictListByStateId(id).subscribe(
      (response) => {
        this.districtList = response;
      },
      (error) => console.log(error)
    )
  }
  state: any;
  dist: any;
  type: any;
  Search() {
    this.state = $('#stateId').val();
    this.dist = $('#districtId').val();
    this.type = $('#type').val();
    this.hospitaService.getTreatingdoctorlist(this.state, this.dist, this.type, this.user.userId).subscribe((data: any) => {
      console.log(data);
      this.list = data.data;
      this.list1 = this.list;
      this.checkall = data.check;
      this.totalcount = this.list.length;
      if (this.totalcount > 0) {
        this.showPegi = true
        this.currentPage = 1
        this.pageElement = 100
      } else {
        this.showPegi = true
      }
    },
      (error) => console.log(error)
    );
  }
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }
  selectitem(item: any) {
    this.hospObj = {
      hospitalCode: "",
      hospitalid: "",
      status: "",
      createby: this.user.userId
    }
    this.hospObj.hospitalCode = item.hospitalCode
    this.hospObj.hospitalid = item.hospitalId
    this.hospObj.status = item.tratingdoctorrequired == 0 ? 1 : 0
    var stat: boolean = false;
    for (const i of this.hospList) {
      if (i.hospitalCode == this.hospObj.hospitalCode) {
        stat = true;
      }
    }
    if (stat == false) {
      this.hospList.push(this.hospObj);
    } else {
      for (var i = 0; i < this.hospList.length; i++) {
        if (item.hospitalCode == this.hospList[i].hospitalCode) {
          var index = this.hospList.indexOf(this.hospList[i]);
          if (index !== -1) {
            this.hospList.splice(index, 1);
          }
        }
      }
    }
    if (this.hospList.length == 0) {
      this.showsubmitbutton = false;
    } else {
      this.showsubmitbutton = true;
    }
  }

  allselectitem() {
    this.checkall = !this.checkall;
    let status = this.checkall ? 0 : 1;
    for (let i = 0; i < this.list.length; i++) {
      if (this.list[i].tratingdoctorrequired != status) {
        this.selectitem(this.list[i]);
        this.list[i].tratingdoctorrequired = status;
      }
    }
    console.log(this.hospList);
  }
  Submit() {
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      text: 'You want to Update!',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Update it!'
    }).then((result) => {
      if (result.isConfirmed) {
        let object = {
          hospdetailbean: this.hospList
        }
        console.log(object);
        this.hospitaService.submitTreatingdoctorlist(object).subscribe((data: any) => {
          console.log(data);
          if (data.status == 200) {
            Swal.fire({
              title: data.message,
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'ok',
              allowOutsideClick: false
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.reload();
                this.hospList = [];
                this.showsubmitbutton = false
                this.Search();
              } else {
                window.location.reload();
              }
            }
            )
          } else {
            this.swal("Error", data.message, 'error');
          }
        },
          (error) => console.log(error)
        );
      }
    });
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
  report: any = [];
  sno: any = {
    Slno: "",
    statename: "",
    district: "",
    hospcode: "",
    hospname: "",
    mobileno: "",
    emailid: "",
    potpreq: "",
  };
  heading = [['Sl#', 'State Name', 'District Name', 'Hospital Name', 'Hospital Code', 'Hospital MobileNo', 'Hospital emailId', 'Treating Doctor Required']];
  downloadList(no: any) {
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy = this.sessionService.decryptSessionData("user").fullName;
    this.report = [];
    let sna: any;
    for (var i = 0; i < this.list1.length; i++) {
      sna = this.list1[i];
      this.sno = [];
      this.sno.Slno = i + 1;
      this.sno.statename = sna.stateName;
      this.sno.district = sna.distName;
      this.sno.hospname = sna.hospitalName;
      this.sno.hospcode = sna.hospitalCode;
      this.sno.mobileno = sna.mobilenumber;
      this.sno.emailid = sna.emailid;
      this.sno.potpreq = sna.tratingdoctorrequired == 0 ? 'Yes' : 'No';
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
    if (no == 1) {
      let filter = [];
      filter.push([['State Name', this.statename]]);
      filter.push([['District Name', this.distname]]);
      if (this.type == null || this.type == undefined || this.type == '') {
        filter.push([['Type', "All"]]);
      } else {
        if (this.type == 1) {
          filter.push([['Type', "Optional"]]);
        } else {
          filter.push([['Type', "Mandatory"]]);
        }
      }
      TableUtil.exportListToExcelWithFilter(
        this.report, 'Treating Doctor Configuration', this.heading, filter);
    } else {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('p', 'mm', [297, 210]);
      doc.setFontSize(20);
      doc.text("Treating Doctor Configuration", 60, 15);
      doc.setFontSize(12);
      doc.text('State Name :-' + this.statename, 8, 25);
      doc.text('District Name :-' + this.distname, 60, 25);
      if (this.type == null || this.type == undefined || this.type == '') {
        doc.text('Type :-' + "All", 150, 25);
      } else {
        if (this.type == 1) {
          doc.text('Type :-' + "Optional", 150, 25);
        } else {
          doc.text('Type :-' + "Mandatory", 150, 25);
        }
      }
      doc.text('GeneratedOn :-' + generatedOn, 8, 33);
      doc.text('GeneratedBy :-' + generatedBy, 110, 33);
      var rows = [];
      for (var i = 0; i < this.report.length; i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.Slno;
        pdf[1] = clm.statename;
        pdf[2] = clm.district;
        pdf[3] = clm.hospname;
        pdf[4] = clm.hospcode;
        pdf[5] = clm.mobileno;
        pdf[6] = clm.emailid;
        pdf[7] = clm.potpreq;
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
          1: { cellWidth: 25 },
          2: { cellWidth: 25 },
          3: { cellWidth: 25 },
          4: { cellWidth: 25 },
          5: { cellWidth: 25 },
          6: { cellWidth: 25 },
          7: { cellWidth: 25 },
        }
      });
      doc.save('Treating Doctor Configuration.pdf');
    }
  }
  reset() {
    window.location.reload()
  }
  getlogdata(item) {
    this.hospitaService.getbyhId(item.hospitalId).subscribe(
      (result: any) => {
        console.log(result);
        this.data = result;
        this.result = this.data.hospital
      },
      (err: any) => {
        console.log(err);
      }
    );
    this.hospitaService.getlogdata(item.hospitalId).subscribe(
      (result: any) => {
        console.log(result);
        this.logdata = result;
        if (this.logdata.status == 200) {
          this.logdetails = this.logdata.hospitallog;
          this.logdetailstotal = this.logdetails.length;
          if (this.logdetailstotal > 0) {
            this.showPegi = true;
            this.currentPage = 1;
            this.pageElement = 20
          } else {
            this.showPegi = false;
          }
        }
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
  report1: any = [];
  hosp: any = {
    slNo: "",
    otpreq: "",
    updateby: "",
    updateon: ""
  };
  heading1 = [['Sl No', 'Patient OTP Required','Updated By','Updated On']];

  convertDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy, hh:mm:ss a');
    return date;
  }
  download1(no: any) {
    this.report1 = [];
    let item: any;
    for (var i = 0; i < this.logdetails.length; i++) {
      item = this.logdetails[i];
      this.hosp = [];
      this.hosp.slNo = i + 1;
      this.hosp.otpreq = item.patientOtpRequired != 1 ? "Yes" : "No";
      this.hosp.updateby = item.createname
      this.hosp.updateon = this.convertDate(item.createdOn);
      this.report1.push(this.hosp);
    }
    if (no == 1) {
      let filter = [];
      filter.push([['Name :- ', this.result?.hospitalName + " (" + this.result?.hospitalCode + ")"]]);
      filter.push([['Catagory :- ', this.data?.categoryName]]);
      filter.push([['Email :- ', this.result?.emailId]]);
      filter.push([['Mobile :- ', this.result?.mobile]]);
      TableUtil.exportListToExcelWithFilter(this.report1, this.result?.hospitalName + ' Log Details', this.heading1, filter);
    } else {
      if (this.report1.length == 0) {
        Swal.fire("Info", "No data found", 'info');
        return;
      }
      let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
      let generatedBy = this.sessionService.decryptSessionData("user").fullName;
      var doc = new jsPDF('p', 'mm', [297, 210]);
      doc.setFontSize(16);
      doc.text("Hospital Log Details", 80, 10);
      doc.setFontSize(12);
      doc.text('Name :- ' + this.result?.hospitalName + " (" + this.result?.hospitalCode + ")", 10, 18);
      doc.text('Catagory :- ' + this.data?.categoryName, 130, 18);
      doc.text('Email :- ' + this.result?.emailId, 10, 26);
      doc.text('Mobile :- ' + this.result?.mobile, 130, 26);
      doc.text('GeneratedOn :- ' + generatedOn, 120, 34);
      doc.text('GeneratedBy :- ' + generatedBy, 10, 34);
      var rows = [];
      for (var i = 0; i < this.report1.length; i++) {
        var clm = this.report1[i];
        var pdf = [];
        pdf[0] = clm.slNo;
        pdf[1] = clm.otpreq;
        pdf[2] = clm.updateby;
        pdf[3] = clm.updateon;
        rows.push(pdf);
      }
      autoTable(doc, {
        head: this.heading1,
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
      doc.save('GJAY_' + this.result?.hospitalName + '_Log_Details.pdf');
    }
  }
}
