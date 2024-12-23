import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { HeaderService } from '../../header.service';
import { HospitalService } from '../../Services/hospital.service';
import { SnoCLaimDetailsService } from '../../Services/sno-claim-details.service';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import { TableUtil } from 'src/app/application/util/TableUtil';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-hoispitalinfo-report',
  templateUrl: './hoispitalinfo-report.component.html',
  styleUrls: ['./hoispitalinfo-report.component.scss'],
})
export class HoispitalinfoReportComponent implements OnInit {
  txtsearchDate: any;
  showPegi: any;
  pageElement: any;
  currentPage: any;
  user: any;
  stateData: any = [];
  public stateList: any = [];
  public districtList: any = [];
  stateCode: any;
  userId: any;

  distCode: any;
  hospitallist: any;
  counthospitallist: any;
  childmessage: any;
  constructor(
    public headerService: HeaderService,
    public snoService: SnocreateserviceService,
    private hospitaService: HospitalService,
    private sessionService: SessionStorageService
  ) {}

  ngOnInit(): void {
    this.headerService.setTitle('Hospital Info Report');
    this.headerService.isIndicate(true);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(false);
    this.headerService.isBack(true);
    this.user = this.sessionService.decryptSessionData('user');
    this.getStateList();
    // this.getlist();
    this.search();
  }
  getStateList() {
    this.snoService.getStateList().subscribe(
      (response) => {
        this.stateList = response;
      },
      (error) => console.log(error)
    );
  }
  getResponseFromUtil(parentData: any) {}

  OnChangeState(id) {
    $('#districtId').val('');
    localStorage.setItem('stateCode', id);
    this.snoService.getDistrictListByStateId(id).subscribe(
      (response) => {
        this.districtList = response;
      },
      (error) => console.log(error)
    );
  }

  getlist() {
    this.snoService.hospitalreport().subscribe(
      (response) => {
        this.hospitallist = response;
        this.counthospitallist = this.hospitallist.length;
        if (this.counthospitallist > 0) {
          this.currentPage = 1;
          this.pageElement = 10;
          this.showPegi = true;
        } else {
          this.showPegi = false;
        }
      },
      (error) => console.log(error)
    );
  }

  search() {
    let stateid = $('#stateId').val();
    let distid = $('#districtId').val();
    let sna = $('#sna').val();
    let dc = $('#dc').val();
    {
      this.hospitaService.hospitalreport(stateid, distid, sna, dc).subscribe(
        (data) => {
          this.hospitallist = data;
          this.counthospitallist = this.hospitallist.length;
          if (this.counthospitallist > 0) {
            this.currentPage = 1;
            this.pageElement = 100;
            this.showPegi = true;
          } else {
            this.showPegi = false;
          }
        },
        (error) => console.log(error)
      );
    }
  }
  reset() {
    window.location.reload();
  }
  report: any = [];
  hospital: any = {
    slno: '',
    hospitalname: '',
    hospitalcode: '',
    state: '',
    district: '',
    AssignedSNA: '',
    AssignedDC: '',
  };

  heading = [
    [
      'Sl#',
      'State',
      'District',
      'Hospital Name',
      'Hospital Code',
      'Assigned SNA',
      'Assigned DC ',
    ],
  ];

  // downloadReport(){
  //   this.report = [];
  //   let hospital: any;
  //   for (var i = 0; i < this.hospitallist.length; i++) {
  //     hospital=this.hospitallist[i];
  //     this.hospital=[];
  //     this.hospital.slno=i+1;
  //     this.hospital.state=hospital.stateName;
  //     this.hospital.district=hospital.districtName;
  //     this.hospital.hospitalname=hospital.hospitalName;
  //     this.hospital.hospitalcode=hospital.hospitalCode;

  //     this.hospital.AssignedSNA=hospital.snaname;

  //     this.hospital.AssignedDC=hospital.dcname;

  // this.report.push(this.hospital);

  //   }
  //   TableUtil.exportListToExcel(
  //     this.report,
  //     'Hospital Info Report',
  //     this.heading
  //   );
  // }

  // downloadReport(no:any){
  //   this.report = [];
  //   let hospital: any;
  //   for (var i = 0; i < this.hospitallist.length; i++) {
  //     hospital=this.hospitallist[i];
  //     this.hospital=[];
  //     this.hospital.slno=i+1;
  //     this.hospital.state=hospital.stateName;
  //     this.hospital.district=hospital.districtName;
  //     this.hospital.hospitalname=hospital.hospitalName;
  //     this.hospital.hospitalcode=hospital.hospitalCode;

  //     this.hospital.AssignedSNA=hospital.snaname;

  //     this.hospital.AssignedDC=hospital.dcname;

  //     this.report.push(this.hospital);

  //   }
  //   TableUtil.exportListToExcel(
  //     this.report,
  //     'Hospital Info Report',
  //     this.heading
  //   );
  // }

  downloadReport(no: any) {
    let generatedOn = formatDate(
      new Date(),
      'dd-MMM-yyyy hh:mm:ss a',
      'en-US'
    ).toString();
    // let generatedBy = this.sessionService.decryptSessionData("user");
    let generatedBy = this.user.fullName;
    this.report = [];
    let hospital: any;
    for (var i = 0; i < this.hospitallist.length; i++) {
      hospital = this.hospitallist[i];
      this.hospital = [];
      this.hospital.slno = i + 1;
      this.hospital.state = hospital.stateName;
      this.hospital.district = hospital.districtName;
      this.hospital.hospitalname = hospital.hospitalName;
      this.hospital.hospitalcode = hospital.hospitalCode;
      this.hospital.AssignedSNA =
        hospital.snaname != null ? hospital.snaname : 'N/A';
      this.hospital.AssignedDC =
        hospital.dcname != null ? hospital.dcname : 'N/A';
      this.report.push(this.hospital);
    }
    if (no == 1) {
      let filter = [];
      // filter.push([['Actual Date Of Admission From', this.fromdate]]);
      // filter.push([['Actual Date Of Admission To', this.todate]]);
      // filter.push([['Hospital Name', this.result.hospitalName]]);
      // filter.push([['Hospital Code', this.result.hospitalCode]]);
      TableUtil.exportListToExcelWithFilter(
        this.report,
        'Hospital Info Report',
        this.heading,
        filter
      );
    } else {
      if (this.report == null || this.report.length == 0) {
        this.swal('Info', 'No Record Found', 'info');
        return;
      }
      var doc = new jsPDF('l', 'mm', [297, 400]);
      doc.setFontSize(22);
      // doc.text(" ", 5, 5);
      doc.text('Hospital Info Report Details', 145, 15);
      doc.setFontSize(15);
      // doc.text('Actual Date Of Admission From :- '+ this.fromdate+' To :- '+this.todate,8,24);
      // doc.text('Hospital Name :- '+this.result.hospitalName+' ('+this.result.hospitalCode+')',8,32);
      doc.text('GeneratedOn :- ' + generatedOn, 260, 40);
      doc.text('GeneratedBy :- ' + generatedBy, 16, 40);

      var rows = [];
      for (var i = 0; i < this.report.length; i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.slno;
        pdf[1] = clm.state;
        pdf[2] = clm.district;
        pdf[3] = clm.hospitalname;
        pdf[4] = clm.hospitalcode;
        pdf[5] = clm.AssignedSNA != null ? clm.AssignedSNA : 'N/A';
        pdf[6] = clm.AssignedDC != null ? clm.AssignedDC : 'N/A';
        rows.push(pdf);
      }
      autoTable(doc, {
        head: this.heading,
        body: rows,
        theme: 'grid',
        startY: 45,
        headStyles: {
          fillColor: [26, 99, 54],
        },
        columnStyles: {
          0: { cellWidth: 10 },
        },
      });
      doc.save('Hospital Info Report.pdf');
    }
  }

  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
}
