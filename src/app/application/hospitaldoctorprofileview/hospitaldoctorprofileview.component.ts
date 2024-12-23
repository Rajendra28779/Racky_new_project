import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../header.service';
import { SnocreateserviceService } from '../Services/snocreateservice.service';
import { UsermanualService } from '../Services/usermanual.service';
import Swal from 'sweetalert2';
import { NavigationExtras, Router } from '@angular/router';
import { TableUtil } from '../util/TableUtil';
import { formatDate } from '@angular/common';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { JwtService } from 'src/app/services/jwt.service';
import { environment } from 'src/environments/environment';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-hospitaldoctorprofileview',
  templateUrl: './hospitaldoctorprofileview.component.html',
  styleUrls: ['./hospitaldoctorprofileview.component.scss']
})
export class HospitaldoctorprofileviewComponent implements OnInit {
  user: any;
  currentPage: any;
  pageElement: any;
  showPegi: boolean;
  txtsearchDate: any;
  public dcList: any = [];
  public stateList: any = [];
  public districtList: any = [];
  public hospitalList: any = [];
  hidestatus: boolean = false;
  hiseestatusadmin: boolean = false;
  constructor(public headerService: HeaderService, private snoService: SnocreateserviceService, private usermanualService: UsermanualService, public router: Router, private jwtService: JwtService,private sessionService: SessionStorageService
    ) { }
  ngOnInit(): void {
    this.headerService.setTitle('Hospital Doctor Profile View');
    this.user = this.sessionService.decryptSessionData("user");
    this.currentPage = 1;
    this.pageElement = 50;
    this.getStateList();
    if (Number(this.user.groupId) == 5) {
      this.getHospitalByDistrict();
    } else if (Number(this.user.groupId) == 1 || Number(this.user.groupId) == 10) {
      this.hiseestatusadmin = true;
    }
    this.getviewdetails();
  }
  getStateList() {
    this.snoService.getStateList().subscribe(
      (response) => {
        this.stateList = response;
      },
    )
  }
  statecodedata: any;
  statecodedate: any;
  OnChangeState(id) {
    this.statecodedate = id
    this.snoService.getDistrictListByStateId(id).subscribe(
      (response) => {
        this.districtList = response;
      },
    )
  }
  OnChangeDistrict(id) {
    let stateCode = this.statecodedate;
    this.snoService.getHospitalbyDistrictId(id, stateCode).subscribe(
      (response) => {
        this.hospitalList = response;
      },
    )
  }
  data: any = []
  statecode: any;
  districtcode: any;
  hospitalcode: any;
  getHospitalByDistrict() {
    let hospitalCode = this.user.userName;
    this.usermanualService.gethospitalbystae(hospitalCode).subscribe(data => {
      this.data = data;
      this.statecode = data[0].statecode;
      this.districtcode = data[0].districtcode;
      this.hospitalcode = data[0].hospitalcode
      if (Number(this.user.groupId) == 5) {
        this.OnChangeState(this.statecode);
        this.OnChangeDistrict(this.districtcode);
        this.getviewdetails();
        this.hidestatus = true;
      } else {
        this.hiseestatusadmin = true;
      }
    })
  }

  details: any = [];
  record: any;
  statecodeval: any;
  hospitalCodeval: any;
  userid: any;
  districtcodeval: any;
  hospitalcodedata: any;
  hospitalval: any;
  hospitaldata: any;
  stateval: any;
  districtval: any;
  getviewdetails() {
    if (Number(this.user.groupId) == 5) {
      this.hospitalCodeval = this.user.userName;
      this.userid = this.user.userId;
      this.statecodeval = this.statecode;
      this.districtcodeval = this.districtcode;
      this.hospitalcodedata = this.hospitalcode
      if (this.hospitalCodeval == null || this.hospitalCodeval == undefined || this.hospitalCodeval == '') {
        this.hospitalCodeval = '';
      } if (this.statecodeval == null || this.statecodeval == undefined || this.statecodeval == '') {
        this.statecodeval = ''
      } if (this.districtcodeval == null || this.districtcodeval == undefined || this.districtcodeval == '') {
        this.districtcodeval = ''
      } if (this.hospitalcodedata == null || this.hospitalcodedata == undefined || this.hospitalcodedata == '') {
        this.hospitalcodedata = ''
      }
      this.usermanualService.getviewdetailsfoprofile(this.statecodeval, this.districtcodeval, this.hospitalCodeval, this.hospitalcodedata, this.userid)
        .subscribe(data => {
          this.details = data
          this.record = this.details.length;
          if (this.record > 0) {
            this.showPegi = true;
          } else {
            this.showPegi = false;
          }
        })
    } else if (Number(this.user.groupId) == 1 || Number(this.user.groupId) == 10) {
      this.hospitalval = $('#hospitalc').val();
      this.userid = this.user.userId;
      this.stateval = $('#state').val();
      this.districtval = $('#district').val();
      this.hospitaldata = $('#hospitalc').val();
      if (this.hospitalval == null || this.hospitalval == undefined || this.hospitalval == '') {
        this.hospitalval = '';
      } if (this.stateval == null || this.stateval == undefined || this.stateval == '') {
        this.stateval = ''
      } if (this.districtval == null || this.districtval == undefined || this.districtval == '') {
        this.districtval = ''
      } if (this.hospitaldata == null || this.hospitaldata == undefined || this.hospitaldata == '') {
        this.hospitaldata = ''
      }
      this.usermanualService.getviewdetailsfoprofile(this.stateval, this.districtval, this.hospitalval, this.hospitaldata, this.userid)
        .subscribe(data => {
          this.details = data
          this.record = this.details.length;
          if (this.record > 0) {
            this.showPegi = true;
          } else {
            this.showPegi = false;
          }
        })
    }


  }
  onchanges() {
    window.location.reload();
  }
  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
  }
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }
  getRestdata() {
    window.location.reload();
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  edit(profileid, hospitalCodename, docname, contactnumber, regnumber, dateofjoining, statecode, districtcode, hospitalcode, speciality_code, speciality_name, speciality_id) {
    let navigationExtras: NavigationExtras = {
      state: {
        profileid: profileid,
        hospitalCodename: hospitalCodename,
        docname: docname,
        contactnumber: contactnumber,
        regnumber: regnumber,
        dateofjoining: dateofjoining,
        statecode: statecode,
        districtcode: districtcode,
        hospitalcode: hospitalcode,
        speciality_code: speciality_code,
        speciality_name: speciality_name,
        speciality_id: speciality_id,
        type: 'edit'
      }
    };
    this.router.navigate(['application/hospitaldoctorprofile'], navigationExtras);
  }
  report: any = [];
  sno: any = {
    Slno: "",
    doctorname: "",
    hospitaldetails: "",
    hospitalcode: "",
    statename: "",
    districtname: "",
    specialitycode: "",
    contactnumber: "",
    registrationnumber: "",
    dateofjoing: "",
  };
  heading = [['Sl#', 'Doctor Name', 'Hospital Name', 'Hospital Code', 'State Name', 'District Name', 'Speciality Code',
    'Contact Number', 'Registration Number', 'Date Of Joining']];
  stateName: any;
  districtname: any;
  hospitalName: any;
  downloadReport(type: any) {
    this.report = [];
    if (type == 'excel') {
      let claim: any;
      for (var i = 0; i < this.details.length; i++) {
        claim = this.details[i];
        this.sno = [];
        this.sno.Slno = i + 1;
        this.sno.doctorname = claim.docname;
        this.sno.hospitaldetails = claim.hospitalname
        this.sno.hospitalcode = claim.hospitalCodedata
        this.sno.statename = claim.statename;
        this.sno.districtname = claim.districtname;
        this.sno.specialitycode = claim.speciality_code;
        this.sno.contactnumber = claim.contactnumber;
        this.sno.registrationnumber = claim.regnumber;
        this.sno.dateofjoing = claim.dateofjoining;
        this.report.push(this.sno);
      }
      for (let i = 0; i < this.stateList.length; i++) {
        if (this.stateList[i].stateCode == this.statecode) {
          this.stateName = this.stateList[i].stateName
        }
      }
      for (let i = 0; i < this.districtList.length; i++) {
        if (this.districtList[i].districtcode == this.districtcode) {
          this.districtname = this.districtList[i].districtname
        }
      }
      for (let i = 0; i < this.hospitalList.length; i++) {
        if (this.hospitalList[i].hospitalCode == this.hospitalcode) {
          this.hospitalName = this.hospitalList[i].hospitalName
        }
      }
      let filter1 = [];
      if (this.stateName == null || this.stateName == undefined || this.stateName == '') {
        filter1.push([['State Name:-', "ALL"]]);
      } else {
        filter1.push([['State Name:-', this.stateName]]);
      }
      if (this.districtname == null || this.districtname == undefined || this.districtname == '') {
        filter1.push([['District Name:-', "ALL"]]);
      } else {
        filter1.push([['District Name:-', this.districtname]]);
      }
      if (this.hospitalName == null || this.hospitalName == undefined || this.hospitalName == '') {
        filter1.push([['Hospital Name:-', "ALL"]]);
      } else {
        filter1.push([['Hospital Name:-', this.hospitalName]]);
      }
      TableUtil.exportListToExcelWithFilterforhospitals(this.report, "Hospital Doctor Profile View", this.heading, filter1);
    } else if (type == 'pdf') {
      if (this.details.length == 0) {
        this.swal('', 'No Data Found', 'info');
        return;
      }
      for (let i = 0; i < this.stateList.length; i++) {
        if (this.stateList[i].stateCode == this.statecode) {
          this.stateName = this.stateList[i].stateName
        }
      }
      for (let i = 0; i < this.districtList.length; i++) {
        if (this.districtList[i].districtcode == this.districtcode) {
          this.districtname = this.districtList[i].districtname
        }
      }
      for (let i = 0; i < this.hospitalList.length; i++) {
        if (this.hospitalList[i].hospitalCode == this.hospitalcode) {
          this.hospitalName = this.hospitalList[i].hospitalName
        }
      }
      let SlNo = 1;
      this.details.forEach(element => {
        let rowData = [];
        rowData.push(SlNo++);
        rowData.push(element.docname)
        rowData.push(element.hospitalname)
        rowData.push(element.hospitalCodedata)
        rowData.push(element.statename)
        rowData.push(element.districtname)
        rowData.push(element.speciality_code)
        rowData.push(element.contactnumber)
        rowData.push(element.regnumber)
        rowData.push(element.dateofjoining)
        this.report.push(rowData);
      });
      let doc = new jsPDF('l', 'mm', [238, 270]);
      doc.setFontSize(10);
      if (this.stateName == null || this.stateName == undefined || this.stateName == '') {
        doc.text('State Name :-' + "ALL", 5, 10);
      } else {
        doc.text('State Name :-' + this.stateName, 5, 10);
      }
      if (this.districtname == null || this.districtname == undefined || this.districtname == '') {
        doc.text('District Name:-' + "ALL", 5, 15);
      } else {
        doc.text('Hospital Name :-' + this.districtname, 5, 15);
      }
      if (this.hospitalName == null || this.hospitalName == undefined || this.hospitalName == '') {
        doc.text('Hospital Name :-' + "ALL", 5, 20);
      } else {
        doc.text('Hospital Name :-' + this.hospitalName, 5, 20);
      }
      doc.text('Document Generate Date :-' + formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en').toString(), 5, 25);
      doc.text('Hospital Doctor Profile View', 100, 26);
      doc.setLineWidth(0.7);
      doc.line(100, 27, 144, 27);
      autoTable(doc, {
        head: this.heading, body: this.report, startY: 28, theme: 'grid',
        styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
        bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 20 },
        headStyles: { lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255], fillColor: [26, 99, 54] },
        columnStyles: {
          0: { cellWidth: 8 },
          1: { cellWidth: 20 },
          2: { cellWidth: 40 },
          3: { cellWidth: 18 },
          4: { cellWidth: 18 },
          5: { cellWidth: 30 },
          6: { cellWidth: 40 },
          7: { cellWidth: 30 },
          8: { cellWidth: 30 },
          9: { cellWidth: 18 },
        }
      })
      doc.save('Hospital_Doctor_Profile_View.pdf');
    }
  }
  getdetails(profileid: any) {
    let state = {
      profileid: profileid,
    }
    localStorage.setItem("data", JSON.stringify(state));
    localStorage.setItem("token", this.jwtService.getJwtToken())
    this.router.navigate([]).then(result => { window.open(environment.routingUrl + '/hospitaldoctorprofiledetails'); });
  }
}
