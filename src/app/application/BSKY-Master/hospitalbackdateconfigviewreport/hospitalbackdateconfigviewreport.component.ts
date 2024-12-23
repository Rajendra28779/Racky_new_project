import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { HospitalService } from '../../Services/hospital.service';
import { TableUtil } from '../../util/TableUtil';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-hospitalbackdateconfigviewreport',
  templateUrl: './hospitalbackdateconfigviewreport.component.html',
  styleUrls: ['./hospitalbackdateconfigviewreport.component.scss']
})
export class HospitalbackdateconfigviewreportComponent implements OnInit {
  count:any
  txtsearchDate:any;
  list:any=[];
  showPegi:any;
  pageElement:any;
  currentPage:any;

  constructor(public headerService: HeaderService,private hospitaService: HospitalService, private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle("Hospital Wise Report");
    this.hospitaService.getallhospitalbackdatelogdata().subscribe((data:any)=>{
      console.log(data);
      this.list=data;
      this.count=this.list.length;
      if(this.count>0){
        this.currentPage = 1;
    this.pageElement = 50;
    this.showPegi=true;
      }else{
        this.showPegi=false;
      }

    },
    (error) => {
      console.log(error);
      // this.swal('', 'Something went wrong.', 'error');
    }
  );
  }

  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }

  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
    console.log(this.pageElement);

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
    Slno: "",
    state: "",
    dist: "",
    hosp: "",
    hospc: "",
    hospcat: "",
    nsfrom: "",
    nefrom: "",
    mousdate: "",
    mouedate: "",
    bad:"",
    bdd:"",
  };
  heading = [['Sl#', 'State Name','District Name','Hospital Name','Hospital Code','Hospital Catagory',
  'NABH Date Start Form','NABH Date Start To','MOU Start Date','MOU End Date','BackDate Admission Days',' BackDate Discharge Days']];


   downloadList(no:any){
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy = this.sessionService.decryptSessionData("user").fullName;
    this.report = [];
    let sna: any;
    for (var i = 0; i < this.list.length; i++) {
      sna=this.list[i];
      this.sno=[];
      this.sno.Slno=i+1;
      this.sno.state=sna.stateName;
      this.sno.dist=sna.districtName;
      this.sno.hosp=sna.hospitalName;
      this.sno.hospc=sna.hospitalCode;
      this.sno.hospcat=sna.hospitalType;
      this.sno.nsfrom=sna.hcvalidform;
      this.sno.nefrom=sna.hcvalidto;
      this.sno.mousdate=sna.moustartdate;
      this.sno.mouedate=sna.mouenddate;
      this.sno.bad=sna.backadmissionday;
      this.sno.bdd=sna.backdischargeday;
      this.report.push(this.sno);
    }
    if(no==1){
      let filter =[];
        TableUtil.exportListToExcelWithFilter(
          this.report,
          'Hospital Wise Report',
          this.heading,filter
        );
    }else{
      if(this.report==null || this.report.length==0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('l', 'mm',[297,210 ]);
      doc.setFontSize(20);
      // doc.text(" ", 5, 5);
      doc.text("Hospital Wise Report", 110, 15);
      doc.setFontSize(14);
      doc.text('GeneratedOn :- '+generatedOn,180,23);
      doc.text('GeneratedBy :- '+generatedBy,15,23);
            var rows = [];
            for(var i=0;i<this.report.length;i++) {
              var clm = this.report[i];
              var pdf = [];
              pdf[0] = clm.Slno;
              pdf[1] = clm.state;
              pdf[2] = clm.dist;
              pdf[3] = clm.hosp;
              pdf[4] = clm.hospc;
              pdf[5] = clm.hospcat;
              pdf[6] = clm.nsfrom;
              pdf[7] = clm.nefrom;
              pdf[8] = clm.mousdate;
              pdf[9] = clm.mouedate;
              pdf[10] = clm.bad;
              pdf[11] = clm.bdd;
              rows.push(pdf);
            }
            autoTable(doc, {
              head: this.heading,
              body: rows,
              theme: 'grid',
              startY: 30,
              headStyles: {
                fillColor: [26, 99, 54]
              },
              columnStyles: {
                1: {cellWidth: 30},
                2: {cellWidth: 30},
                3: {cellWidth: 40},
              }
            });
            // alert("hi");
            doc.save('Hospital Wise Report');
    }

   }

}
