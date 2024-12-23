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
  selector: 'app-hospitalbackdateconfigview',
  templateUrl: './hospitalbackdateconfigview.component.html',
  styleUrls: ['./hospitalbackdateconfigview.component.scss']
})
export class HospitalbackdateconfigviewComponent implements OnInit {
  count:any
  txtsearchDate:any;
  list:any=[];
  showPegi:any;
  pageElement:any;
  currentPage:any;

  constructor(private hospitaService: HospitalService,public headerService: HeaderService,private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle("Hospital BackDate Config Log");
    this.hospitaService.getallhospitallogdata().subscribe((data:any)=>{
      console.log(data);
      this.list=data;
      this.count=this.list.length;
      if(this.count>0){
        this.currentPage = 1;
    this.pageElement = 100;
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
    prvbad: "",
    crtbad: "",
    prvbdd: "",
    crtbdd: "",
    updateon:"",
    updateby:"",
  };
  heading = [['Sl#', 'State Name','District Name','Hospital Name','Privious BackDate Admission Days','Current BackDate Admission Days',
  'Privious BackDate Discharge Days','Current BackDate Discharge Days','Updated By','Updated On']];


   downloadList(no:any){
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy = this.sessionService.decryptSessionData("user").fullName;
    this.report = [];
    let sna: any;
    for (var i = 0; i < this.list.length; i++) {
      sna=this.list[i];
      this.sno=[];
      this.sno.Slno=i+1;
      this.sno.state=sna.districtcode.statecode.stateName;
      this.sno.dist=sna.districtcode.districtname;
      this.sno.hosp=sna.hospital.hospitalName+" ("+sna.hospital.hospitalCode+")";
      this.sno.prvbad=sna.backdateadmissiondate;
      this.sno.crtbad=sna.hospital.backdateadmissiondate;
      this.sno.prvbdd=sna.backdatedischargedate;
      this.sno.crtbdd=sna.hospital.backdatedischargedate;
      this.sno.updateby=sna.createdby.fullname;
      this.sno.updateon=formatDate(sna.createon, 'dd-MMM-yyyy', 'en-US').toString();
      this.report.push(this.sno);
    }
    if(no==1){
      let filter =[];
        TableUtil.exportListToExcelWithFilter(
          this.report,
          'Hospital BackDate Log Report',
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
      doc.text("Hospital BackDate Log Report", 110, 15);
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
              pdf[4] = clm.prvbad;
              pdf[5] = clm.crtbad;
              pdf[6] = clm.prvbdd;
              pdf[7] = clm.crtbdd;
              pdf[8] = clm.updateby;
              pdf[9] = clm.updateon;
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
                3: {cellWidth: 40},
              }
            });
            // alert("hi");
            doc.save('Hospital BackDate Log Report.pdf');
    }

   }

}
