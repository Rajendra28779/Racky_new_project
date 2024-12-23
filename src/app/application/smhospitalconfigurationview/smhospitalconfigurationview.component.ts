import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';
import { HeaderService } from '../header.service';
import { SnoconfigpipePipe } from '../pipes/snoconfigpipe.pipe';
import { SnocreateserviceService } from '../Services/snocreateservice.service';
import { SwastyaMitraHospitalService } from '../Services/swastya-mitra-hospital.service';
import { TableUtil } from '../util/TableUtil';
import { SessionStorageService } from 'src/app/services/session-storage.service';


@Component({
  selector: 'app-smhospitalconfigurationview',
  templateUrl: './smhospitalconfigurationview.component.html',
  styleUrls: ['./smhospitalconfigurationview.component.scss']
})
export class SmhospitalconfigurationviewComponent implements OnInit {
  user: any
  userList: any = [];
  keyword1: any = 'fullname';
  // list:any;
  list: any = [];
  currentPage: any;
  pageElement: any;
  count: any
  showPegi: boolean;
  txtsearchDate: any;
  header: any
  txtsearch: any;
  detailData: any = [];
  listl: any;
  txtsearchD: any;
  Filtered: any;
  userIId: any;
  record: any;
  listSwas: any;
  stateId: any = '';
  districtId: any = '';
  SearchForm1: FormGroup;
  public stateList: any = [];
  public districtList: any = [];

  @ViewChild('auto') auto;
  Filtered1: any;
  list2: any;
  constructor(public swastyaMitraHospitalService: SwastyaMitraHospitalService, public route: Router,
    public headerService: HeaderService,
    private snoconfigpipePipe: SnoconfigpipePipe, private snoService: SnocreateserviceService, private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle(" SwasthyaMitra Hospital Mapping");
    this.user = this.sessionService.decryptSessionData("user");
    this.getSwasthyaMitraList();
    this.getSwasthyaMitraMappingList();

    this.SearchForm1 = new FormGroup({
      'stateId': new FormControl(null, (Validators.required)),
      'districtId': new FormControl(null, (Validators.required))
    });
  }

  getSwasthyaMitraList() {
    this.swastyaMitraHospitalService.getSwasthyaList().subscribe(
      (response) => {
        this.userList = response;
        console.log(this.userList);
      },
      (error) => console.log(error)
    );
  }
  selectEvent(item) {
    console.log(item);
    this.userIId = item.userId;
    // this.txtsearchDate=item.fullname
  }

  getSwasthyaMitraMappingList() {
    this.swastyaMitraHospitalService.getSwasthyamappingList().subscribe(
      (response) => {
        console.log(response);
        this.list = response;
        this.listl = this.list.length;
        this.record = this.list.length;
        if (this.list.length > 0) {
          this.currentPage = 1;
          this.pageElement = 100;
          this.showPegi = true;
        } else {
          this.showPegi = false
        }
      },
      (error) => console.log(error)
    );
  }
  onChange() {
    if (this.userIId == null || this.userIId == "" || this.userIId == undefined) {
      this.swal('Info', "Please select Swasthya Mitra Name", "info");
      return;
    }
    this.list = [];
    this.currentPage = 1;
    this.pageElement = 100;
    // alert( this.userIId);
    this.swastyaMitraHospitalService.getswasthyaConfigList(this.userIId).subscribe(
      (data: any) => {
        // this.list = data.swaslist;
        this.list = data;
        console.log(data);
        console.log(this.list);
      }
    );
  }



  clearEvent() {
    this.userIId = '';
  }
  view(item) {
    this.user = item.userid
    this.header = item.fullname
    this.swastyaMitraHospitalService.getsmtaggedhospital(this.user).subscribe(
      (response) => {
        console.log(response);
        this.detailData = response;
        this.count = this.detailData.length;
      },
      (error) => console.log(error)
    );
  }



  OnChangeState(id) {
    this.SearchForm1.controls['districtId'].reset();
    localStorage.setItem("stateCode", id);
    this.snoService.getDistrictListByStateId(id).subscribe(
      (response) => {
        this.districtList = response;
        console.log(response);
      },
      (error) => console.log(error)
    )
  }

  resetTable() {
    this.currentPage = 1;
    this.pageElement = 100;
    this.auto.clear();
    this.userIId = '';
    this.getSwasthyaMitraMappingList();

  }

  edit(item: any) {
    let navigationExtras: NavigationExtras = {
      state: {
        user: item.userid,
        name: item.fullname
      }
    };
    this.route.navigate(['application/smconfiguration'], navigationExtras);
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  report: any = [];
  sno: any = {
    Slno: '',
    smaname: '',
    username: '',
    Tth: '',

  };
  heading = [
    [
      'Sl#',
      'Swasthya Mitra Name',
      'User Name',
      'Total No of Tagged hospital',

    ],
  ];

  downloadList(no: any) {
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy = this.user.fullName;
    this.report = [];
    let claim: any;
    for (var i = 0; i < this.list.length; i++) {
      claim = this.list[i];
      console.log(claim);
      this.sno = [];
      this.sno.Slno = i + 1;
      this.sno.smaname = claim.fullname;
      this.sno.username = claim.username;
      this.sno.Tth = claim.count;
      this.report.push(this.sno);
    }
    if (no == 1) {
      let filter = [];
      TableUtil.exportListToExcelWithFilter(
        this.report,
        'SwathyMitra Configuration Report',
        this.heading, filter
      );
    } else {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('p', 'mm', [210, 297]);
      doc.setFontSize(12);
      doc.text("SwasthyMitra Configuration Report", 75, 15);
      doc.line(75, 17, 139, 17);
      doc.text("Generated By " + " :- " + generatedBy, 10, 25);
      doc.text("Generated On " + " :- " + generatedOn, 120, 25);
      // doc.line(100,26,148,26);

      var rows = [];
      for (var i = 0; i < this.report.length; i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.Slno;
        pdf[1] = clm.smaname;
        pdf[2] = clm.username;
        pdf[3] = clm.Tth;
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
          0: { cellWidth: 10 },
          1: { cellWidth: 80 },
          2: { cellWidth: 40 },
          3: { cellWidth: 50 },
        }
      });
      doc.save('Bsky_SwathyMitra Configuration Report.pdf');
    }
  }

  report1: any = [];
  sno1: any = {
    slNo: "",
    hospname: "",
    hospcode: "",
    state: "",
    district: "",
  };
  heading1 = [['Sl No', 'Hospital Name', 'Hospital Code', 'District', 'State']];

  downloadReport(no: any) {
    //console.log(this.listOfCpdData);
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy = this.user.fullName;
    this.report1 = [];
    let item: any;
    for (var i = 0; i < this.detailData.length; i++) {
      item = this.detailData[i];
      console.log(item);
      this.sno1 = [];
      this.sno1.slNo = i + 1;
      this.sno1.hospname = item.hospitalName;
      this.sno1.hospcode = item.hospitalCode;
      this.sno1.state = item.state;
      this.sno1.district = item.dist;
      this.report1.push(this.sno1);
      console.log(this.report1);
      console.log(this.sno1);
    }
    if (no == 1) {
      let filter = [];
      filter.push([['SwasthyaMitra Name', this.header]])
      TableUtil.exportListToExcelWithFilter(this.report1, this.header + " Tagged Hospital", this.heading1, filter);
    } else {
      if (this.report1 == null || this.report1.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('p', 'mm', [210, 297]);
      doc.setFontSize(12);
      doc.text("SwasthyMitra Tagged Hospital", 75, 15);
      doc.line(75, 17, 134, 17);
      doc.text('SwasthyaMitra Name :- ' + this.header, 10, 25);
      doc.text("Generated By " + " :- " + generatedBy, 10, 35);
      doc.text("Generated On " + " :- " + generatedOn, 120, 35);
      // doc.line(100,26,148,26);

      var rows = [];
      for (var i = 0; i < this.report1.length; i++) {
        var clm = this.report1[i];
        var pdf = [];
        pdf[0] = clm.slNo;
        pdf[1] = clm.hospname;
        pdf[2] = clm.hospcode;
        pdf[3] = clm.state;
        pdf[4] = clm.district;
        rows.push(pdf);
      }
      autoTable(doc, {
        head: this.heading1,
        body: rows,
        theme: 'grid',
        startY: 45,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 70 },
          2: { cellWidth: 30 },
          3: { cellWidth: 35 },
          4: { cellWidth: 35 },
        }
      });
      doc.save('GJAY' + this.header + ' Tagged Hospital.pdf');
    }
  }

}
