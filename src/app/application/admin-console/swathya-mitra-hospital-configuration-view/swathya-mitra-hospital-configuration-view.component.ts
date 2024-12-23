import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { SwastyaMitraHospitalService } from '../../Services/swastya-mitra-hospital.service';
import { HeaderService } from 'src/app/application/header.service';

import { TableUtil } from '../../util/TableUtil';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
@Component({
  selector: 'app-swathya-mitra-hospital-configuration-view',
  templateUrl: './swathya-mitra-hospital-configuration-view.component.html',
  styleUrls: ['./swathya-mitra-hospital-configuration-view.component.scss']
})
export class SwathyaMitraHospitalConfigurationViewComponent implements OnInit {
  txtsearchDate: any;
  record: any;
  currentPage: any;
  pageElement: any;
  showPegi: boolean;
  swathyaMitraList: any = [];
  deleteDetails: any;
  status: any;
  childmessage: any;
  header: string;


  constructor(public swastyaMitraHospitalService: SwastyaMitraHospitalService, public route: Router, public headerService: HeaderService) { }

  ngOnInit(): void {
    this.headerService.setTitle("View SwasthyaMitra Hospital Mapping");
    this.getSwasthyaList();
    this.currentPage = 1;
    this.pageElement = 10;
  }


  getSwasthyaList() {
    this.swastyaMitraHospitalService.getSwasthyaMitra().subscribe((alldata) => {
      this.swathyaMitraList = alldata;
      console.log(this.swathyaMitraList);
      this.record = this.swathyaMitraList.length;
      if (this.record > 0) {
        this.showPegi = true;
      }
      else {
        this.showPegi = false;
      }
    })
  }

  edit(item: any) {
    console.log(item);
    let navigateExtras: NavigationExtras = {
      state: {
        mapId: item.mappingId,
        hospCode: item.hospitalCode,
        useId: item.useId,
        distCode: item.distCode,
        staCode: item.statCode,
        stateFlg: item.stateFlg
      }
    };
    this.route.navigate(['application/swasthyamitrhospitalconfiguration'], navigateExtras)
  }

  edit1() {
    this.swal("Error", "You Can not Update", 'error');
  }

  report: any = [];
  swasthyaList: any = {
    slNo: "",
    fullName: "",
    hospitalName: "",
    hospitalCode: "",
    stateName: "",
    districtName: "",
    stateFlg: "",
  };
  heading = [['Sl No.', 'SwasthyaMitra Name', 'Hospital Name', 'Hospital Code', 'State Name', 'District Name', 'Status Flag']];

  downloadReport(type) {
    this.report = [];
    let item: any;
    for (var i = 0; i < this.swathyaMitraList.length; i++) {
      item = this.swathyaMitraList[i];
      this.swasthyaList = [];
      this.swasthyaList.slNo = i + 1;
      this.swasthyaList.fullName = item.fullName;
      this.swasthyaList.hospitalName = item.hospitalName;
      this.swasthyaList.hospitalCode = item.hospitalCode;
      this.swasthyaList.stateName = item.stateName;
      this.swasthyaList.districtName = item.districtName;
      if (item.stateFlg == '0') {
        this.swasthyaList.stateFlg = "Active";
      } else if (item.stateFlg == '1') {
        this.swasthyaList.stateFlg = "Inactive";
      }
      this.report.push(this.swasthyaList);
      console.log(this.report);
      console.log(this.swasthyaList);
    }
    if (type == 1) {
      let filter = [];
      // filter.push([['From Date :-', this.fDate]]);
      // filter.push([['To Date :-', this.tDate]]);
      // filter.push([['CPD Name :-', this.getFullCPDName]]);
      TableUtil.exportListToExcelWithFilter(this.report, "Swasthya Mitra Hospital Configuration List", this.heading, filter);
    } else if (type == 2) {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      TableUtil.exportListToExcel(this.report, this.header + " Swasthya Mitra Mapping Details", this.heading);
      var doc=new jsPDF('l','mm',[360,260]);
      doc.setFontSize(12);
      doc.text("Swasthya Mitra Hospital Configuration List",5,10);
      // doc.text("From Date :-"+this.fDate, 5,20);
      // doc.text("To Date :-"+this.tDate, 5,30);
      var rows = [];
      for(var i=0;i<this.report.length;i++){
        var clm=this.report[i];
        var pdf=[];
        pdf[0]=clm.slNo;
        pdf[1]=clm.fullName;
        pdf[2]=clm.hospitalName;
        pdf[3]=clm.hospitalCode;
        pdf[4]=clm.stateName;
        pdf[5]=clm.districtName;
        pdf[6]=clm.stateFlg;
        // pdf[7]=clm.fullname;
        rows.push(pdf);
      }
      console.log(rows);
      autoTable(doc,{
        head:this.heading,
        body:rows,
        theme:'grid',
        startY: 40,
        headStyles:{
          fillColor:[26,99,54]
        },
        columnStyles:{
          0:{cellWidth:30},
          1:{cellWidth:30},
          2:{cellWidth:30},
          3:{cellWidth:30},
          4:{cellWidth:50},
          5:{cellWidth:40},
          6:{cellWidth:40},
          7:{cellWidth:50},
          8:{cellWidth:20}
        }
      });
      doc.save('Bsky_Swasthya Mitra Hospital Configuration List.pdf');

    }
  
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
}
