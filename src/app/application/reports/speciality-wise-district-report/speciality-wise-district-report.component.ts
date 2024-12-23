import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { ClaimRaiseServiceService } from '../../Services/claim-raise-service.service';
import { DistrictwisePackageService } from '../../Services/districtwise-package.service';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
declare let $: any;
import { TableUtil } from '../../util/TableUtil';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-speciality-wise-district-report',
  templateUrl: './speciality-wise-district-report.component.html',
  styleUrls: ['./speciality-wise-district-report.component.scss']
})
export class SpecialityWiseDistrictReportComponent implements OnInit {
  txtsearchDate: any;
  user: any;
  fromdate: any;
  todate: any;
  getAllDistrictData: any = [];
  pageElement: any;
  currentPage: any;
  record: any = 0;
  showPegi: boolean;
  hospitalpackage: boolean;
  sum: any = 0;
  sum1: any = 0;
  stateList: any = [];
  districtList: any = [];
  state: any = "";
  dist: any = "";
  statename: any = "All";
  distname: any = "All";
  searchData: any = 1;
  serachdata: any = [];
  // districtName: any;
  packagenamedata: any;
  packageName: any;
  package: any;
  pack: any = 'All';
  constructor(private LoginServ: ClaimRaiseServiceService,private sessionService: SessionStorageService,
    private snoService: SnocreateserviceService, public headerService: HeaderService,
    public districtwisePackageService: DistrictwisePackageService) { }

  ngOnInit(): void {
    this.headerService.setTitle('District Wise Unavailability of Specility Report');
    this.headerService.isIndicate(true);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.currentPage = 1;
    this.pageElement = 10;
    this.headerService.isBack(false);
    // this.user = JSON.parse(sessionStorage.getItem("user"));
    this.user = this.sessionService.decryptSessionData("user");
    this.getstatelist();
    this.Inclusionofsearchingforpackagedetails();
  }
  Inclusionofsearchingforpackagedetails() {
    this.LoginServ.getsearcdetails().subscribe(data => {
      this.serachdata = data;
    });
  }

  getstatelist() {
    $("#districtId").val("");
    this.snoService.getStateList().subscribe(
      (response) => {
        this.stateList = response;
      },
      (error) => console.log(error)
    );
  }

  OnChangeState(id) {
    $("#districtId").val("");
    $("#Package").val("");
    localStorage.setItem("stateCode", id);
    this.snoService.getDistrictListByStateId(id).subscribe(
      (response) => {
        this.districtList = response;
      },
      (error) => console.log(error)
    )

  }

  getPackageName(event: any) {
    for (let i = 0; i < this.serachdata.length; i++) {
      if (this.serachdata[i].id == event) {
        this.packageName = this.serachdata[i].procedurecode;
        this.LoginServ.getdatapackgaename(this.packageName).subscribe(data => {
          this.packagenamedata = data;
        });
      }
    }
  }

  search() {
    // let userId = this.user.userId;

    let state = $('#stateId').val();
    let dist = $('#districtId').val();
    let Package = $('#Package').val();

    if (state == undefined || state == null || state == "") {
      this.swal("Info", "Please Select State", 'info');
      return;
    }

    if (Package == undefined || Package == null) {
      Package = "";
    }
    this.pack = Package;
    this.state = state;
    this.dist = dist;
    this.districtwisePackageService.specialityWiseDistrictdatareport(this.state, this.dist, this.pack).subscribe(
      (result) => {
        this.getAllDistrictData = [];
        this.getAllDistrictData = result;
        this.record = this.getAllDistrictData.length;
        if (this.record > 0) {
          this.currentPage = 1;
          this.pageElement = 100;
          this.showPegi = true;
        } else {
          this.showPegi = false;
        }
      },
      (error: any) => {
        console.log(error);
      }
    )


  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  report: any = [];
  snaPendingClaimList: any = {
    slNo: "",
    stateName: "",
    districtName: "",
    specialityCode: "",
    specialityName: "",
    hospitalName: "",
    hospitalCode: "",

  };

  heading = [['Sl No.', 'State Name', 'District Name', 'Speciality Code', 'Speciality Name']];

  districtName: any = "ALL";
  hospitalname: any = "ALL";

  downloadReport(type) {
    if (this.getAllDistrictData == null || this.getAllDistrictData.length == 0) {
      this.swal("Info", "No Record Found", "info");
      return;
    }
    this.report = [];
    let item: any;
    for (var i = 0; i < this.getAllDistrictData.length; i++) {
      item = this.getAllDistrictData[i];
      this.snaPendingClaimList = [];
      this.snaPendingClaimList.slNo = i + 1;
      this.snaPendingClaimList.stateName = item.stateName;
      this.snaPendingClaimList.districtName = item.districtName;
      this.snaPendingClaimList.specialityCode = item.specialityCode;
      this.snaPendingClaimList.specialityName = item.specialityName;
      // if (item.hospitalName != null) {
      //   this.snaPendingClaimList.hospitalName = item.hospitalName;
      // } else {
      //   this.snaPendingClaimList.hospitalName = "N/A";
      // }
      // if (item.hospitalCode != null) {
      //   this.snaPendingClaimList.hospitalCode = item.hospitalCode;
      // } else {
      //   this.snaPendingClaimList.hospitalCode = "N/A";
      // }

      this.report.push(this.snaPendingClaimList);
    }
    for (let i = 0; i < this.stateList.length; i++) {
      if (this.stateList[i].stateCode == this.state) {
        this.statename = this.stateList[i].stateName
      }
    }
    for (let i = 0; i < this.districtList.length; i++) {
      if (this.districtList[i].districtcode == this.dist) {
        this.districtName = this.districtList[i].districtname;
      }
    }
    if (type == 1) {
      let filter = [];

      filter.push([['State Name:-', this.statename]]);
      filter.push([['District Name:-', this.districtName]]);
      filter.push([['Speciality Name :-', this.pack]]);
      TableUtil.exportListToExcelWithFilter(this.report, "District Wise Unavailability of Specility Report", this.heading, filter);
    } else if (type == 2) {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('l', 'mm', [240, 230]);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text("District Wise Unavailability  of Specility Report", 80, 10);
      doc.setFontSize(13);

      doc.text("State Name :-" + this.statename, 20, 25);
      doc.text("District Name:-" + this.districtName, 140, 33);
      doc.text("Speciality Name:-" + this.pack, 20, 33);
      doc.text("Generated On:-" + this.convertDate(new Date()), 140, 25);
      doc.text("Generated By:-" + this.sessionService.decryptSessionData("user").fullName, 20, 40);
      // JSON.parse(sessionStorage.getItem('user')).fullName, 40, 49
      var rows = [];
      for (var i = 0; i < this.report.length; i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.slNo;
        pdf[1] = clm.stateName;
        pdf[2] = clm.districtName;
        pdf[3] = clm.specialityCode;
        pdf[4] = clm.specialityName;
        rows.push(pdf);
      }
      autoTable(doc, {
        head: this.heading,
        body: rows,
        theme: 'grid',
        startY: 60,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 40 },
          2: { cellWidth: 45 },
          3: { cellWidth: 40 },
          4: { cellWidth: 50 },
          // 5: { cellWidth: 40 },
          // 6: { cellWidth: 20 },

        }
      });
      doc.save('GJAY_District Wise Unavailability of Specility Report.pdf');

    }


  }
  convertDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy hh:mm:ss a');
    return date;
  }

  Reset() {
    window.location.reload();
  }


}
