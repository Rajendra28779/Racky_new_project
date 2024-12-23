import { Component, OnInit } from '@angular/core';
import { HeaderService } from './../header.service';
import { SnocreateserviceService } from '../Services/snocreateservice.service';
import { SwastyaMitraHospitalService } from '../Services/swastya-mitra-hospital.service';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { TableUtil } from '../util/TableUtil';
import { formatDate } from '@angular/common';
import Swal from 'sweetalert2';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-smfaceregistrationview',
  templateUrl: './smfaceregistrationview.component.html',
  styleUrls: ['./smfaceregistrationview.component.scss']
})
export class SmfaceregistrationviewComponent implements OnInit {
  user: any;
  public stateList: any = [];
  public districtList: any = [];
  public hospitalList: any = [];
  public smList: any = [];
  public list: any = [];
  keyword1: any = 'hospitalName';
  keyword: any = "fullname";
  txtsearchDate: any;
  showPegi: boolean;
  currentPage: any;
  pageElement: any;
  todate: any;
  formdate: any;
  statecode: any = "";
  distcode: any = "";
  smname: any;
  smid: any = "";
  statename: any = "All";
  distname: any = "All";
  hospcode: any = "";
  hospname: any = "All";
  totalcount: any = 0


  constructor(public headerService: HeaderService, public swastyaMitraHospitalService: SwastyaMitraHospitalService, private snoService: SnocreateserviceService, private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle("Swasthya Mitra Face Re-registration");
    this.user = this.sessionService.decryptSessionData("user");
    this.OnChangeState(21);
    this.getSwasthyaMitraList();

    this.Search();
  }

  OnChangeState(id) {
    $("#districtId1").val("");
    localStorage.setItem("stateCode", id);
    this.snoService.getDistrictListByStateId(id).subscribe(
      (response) => {
        this.districtList = response;
      },
      (error) => console.log(error)
    )
  }

  OnChangeDistrict(id) {
    var stateCode = localStorage.getItem("stateCode");
    this.snoService.getHospitalbyDistrictId(id, stateCode).subscribe(
      (response) => {
        this.hospitalList = response;
      },
      (error) => console.log(error)
    );
  }
  getSwasthyaMitraList() {
    this.swastyaMitraHospitalService.getSwasthyaList().subscribe(
      (response) => {
        this.smList = response;
      },
      (error) => console.log(error)
    );
  }

  selectEvent1(item) {
    this.hospcode = item.hospitalCode;
    this.hospname = item.hospitalName;
  }
  onReset2() {
    this.hospcode = "";

  }
  selectEvent(item) {
    this.smid = item.userId;
    this.smname = item.fullname;

  }
  onReset() {
    this.smid = "";
  }
  reset() {
    window.location.reload();
  }

  Search() {
    this.statecode = $('#stateId1').val();
    this.distcode = $('#districtId1').val();
    this.swastyaMitraHospitalService.getapprovesmlistforregistaration(this.statecode, this.distcode, this.hospcode, this.smid).subscribe((data: any) => {
      this.list = data;
      this.totalcount = this.list.length
      if (this.totalcount > 0) {
        this.showPegi = true;
        this.currentPage = 1
        this.pageElement = 100
      } else {
        this.showPegi = false;
      }
    }, (error) => console.log(error)
    );
  }

  swal(title, text, icon) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }


  report: any = [];
  sno: any = {
    Slno: "",
    smid: "",
    name: "",
    mobile: "",
    email: "",
    date: "",
  };
  heading = [['Sl#', 'District Code', 'SwasthyMitra Name', 'Contact No', 'EmailId', 'Allow For Re-Registration']];
  downloadList(no: any) {
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy = this.user.fullName;
    this.report = [];
    let sna: any;
    for (var i = 0; i < this.list.length; i++) {
      sna = this.list[i];
      this.sno = [];
      this.sno.Slno = i + 1;
      this.sno.smid = sna.username;
      this.sno.name = sna.fullname;
      this.sno.mobile = sna.mobile;
      this.sno.email = sna.emailid;
      this.sno.date = sna.regdate;
      this.report.push(this.sno);
    }
    let distname = "All";
    // for(let i=0;i<this.districtList.length;i++){
    //   if(this.districtList[i].districtcode==this.dist){
    //     distname = this.districtList[i].districtname;
    //   }
    // }
    if (no == 1) {
      let filter = [];
      filter.push([['State Name', "Odisha"]]);
      filter.push([['District Name', distname]]);
      TableUtil.exportListToExcelWithFilter(
        this.report,
        'Swasthya Mitra Face Re-registration',
        this.heading, filter
      );
    } else {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('p', 'mm', [297, 210]);
      doc.setFontSize(20);
      // doc.text(" ", 5, 5);
      doc.text("Swasthya Mitra Face Re-registration", 50, 15);
      doc.setFontSize(12);
      doc.text('State Name :- ' + "Odisha", 8, 25);
      doc.text('District Name :- ' + distname, 110, 25);
      doc.text('GeneratedOn :- ' + generatedOn, 8, 33);
      doc.text('GeneratedBy :- ' + generatedBy, 110, 33);
      var rows = [];
      for (var i = 0; i < this.report.length; i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.Slno;
        pdf[1] = clm.smid;
        pdf[2] = clm.name;
        pdf[3] = clm.mobile;
        pdf[4] = clm.email;
        pdf[5] = clm.date;
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
      doc.save('Swasthya Mitra Face Re-registration.pdf');
    }
  }
  closemodal() {
    $('#swasmodal').hide();
  }
  smdetails: any;
  smhosplist: any[];
  smloglist: any[];
  onaction(item: any) {
    this.swastyaMitraHospitalService.getsmdetailsforregister(item).subscribe((data: any) => {
      this.smdetails = data;
      if (this.smdetails.status == 200) {
        this.smhosplist = this.smdetails.hospital;
        this.smloglist = this.smdetails.logdetails;
        $('#swasmodal').show();
      } else {
        this.swal("Error", "Something went Wrong", "error")
      }
    }, (error) => console.log(error)
    );
  }

}
