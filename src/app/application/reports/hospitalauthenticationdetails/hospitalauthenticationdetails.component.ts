import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';
import { MisreportService } from '../../Services/misreport.service';
import { TableUtil } from '../../util/TableUtil';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-hospitalauthenticationdetails',
  templateUrl: './hospitalauthenticationdetails.component.html',
  styleUrls: ['./hospitalauthenticationdetails.component.scss']
})
export class HospitalauthenticationdetailsComponent implements OnInit {
  user:any
  hospitalcode:any
  hospitalname:any
  fromdate:any
  todate:any
  flag:any
  flagtype:any
  list:any
  count:any=0;
  textserch:any
  type:any
  currentPage: any;
  pageElement: any;
  showPegi: boolean;
  authtype:any="All"

  constructor(private misservice:MisreportService,private sessionService: SessionStorageService,) { }

  ngOnInit(): void {
    // this.user = JSON.parse(sessionStorage.getItem("user"));
    this.user = this.sessionService.decryptSessionData("user");
    this.hospitalcode=localStorage.getItem("hospcode");
    this.hospitalname=localStorage.getItem("hospname");
    this.fromdate=localStorage.getItem("fromdate");
    this.todate=localStorage.getItem("todate");
    this.flag=localStorage.getItem("auth");
    this.flagtype=localStorage.getItem("authname");
this.type=localStorage.getItem("type");
if(this.type==1){
  this.authtype="POS"
}else if(this.type==2){
  this.authtype="IRIS"
}else if(this.type==3){
  this.authtype="OTP"
}else if(this.type==4){
  this.authtype="Override"
}else if(this.type==5){
  this.authtype="FACE"
} else{
  this.authtype="All"
}
    this.misservice.getauthdetails(this.hospitalcode,this.fromdate,this.todate,this.flag,this.type).subscribe((data:any)=>{
      console.log(data);
      this.list=data;
      this.count=this.list.length
      if(this.count>0){
        this.showPegi=true
        this.currentPage=1
        this.pageElement=50
      }else{
        this.showPegi=true
      }
    });
  }
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }

  report: any = [];
  sno: any = {
    Slno: "",
    urn: "",
    panme: "",
    vname: "",
    authtype: "",
    authtime: "",
    authstatus: "",
  };
  heading = [['Sl#', 'URN',	'Patient Name',	'Verifier Name',	'Authentication Type',	'Authentication Time',	'Authentication Status']];

  downloadList(no:any){
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy = this.sessionService.decryptSessionData("user").fullName;
    this.report = [];
    let sna: any;
    for (var i = 0; i < this.list.length; i++) {
      sna=this.list[i];
      this.sno=[];
      this.sno.Slno=i+1;
      this.sno.urn=sna.urn;
      this.sno.panme=sna.patient;
      this.sno.vname=sna.verifier;
      this.sno.authtype=sna.prps;
      this.sno.authtime=sna.createon;
      this.sno.authstatus=sna.verifystatus;
      this.report.push(this.sno);
    }
    if(no==1){
      let filter =[];
      filter.push([['Actual Date Of Discharge From', this.fromdate]]);
        filter.push([['Actual Date Of Discharge To', this.todate]]);
        filter.push([['Hospital Name', this.hospitalname+' ('+this.hospitalcode+')']]);
        filter.push([['Authentication For', this.flagtype]]);
        filter.push([['Authentication Tye', this.authtype]]);
        TableUtil.exportListToExcelWithFilter(
          this.report,
          'Hospital Authentication Report Details',
          this.heading,filter
        );
    }else{
      if(this.report==null || this.report.length==0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('p', 'mm',[297,210 ]);
      doc.setFontSize(20);
      // doc.text(" ", 5, 5);
      doc.text("Hospital Authentication Report Details", 55, 15);
      doc.setFontSize(12);
      doc.text('Actual Date Of Discharge From :- '+ this.fromdate,8,25);
      doc.text('Actual Date Of Discharge To :- '+ this.todate,110,25);
      doc.text('Hopital Name :- '+ this.hospitalname+' ('+this.hospitalcode+')',8,33);
      doc.text('Authentication For :- '+this.flagtype,8,41);
      doc.text('Authentication Type :- '+this.authtype,110,41);
      doc.text('GeneratedOn :- '+generatedOn,8,49);
      doc.text('GeneratedBy :- '+generatedBy,110,49);
            var rows = [];
            for(var i=0;i<this.report.length;i++) {
              var clm = this.report[i];
              var pdf = [];
              pdf[0] = clm.Slno;
              pdf[1] = clm.urn;
              pdf[2] = clm.panme;
              pdf[3] = clm.vname;
              pdf[4] = clm.authtype;
              pdf[5] = clm.authtime;
              pdf[6] = clm.authstatus;
              rows.push(pdf);
            }
            autoTable(doc, {
              head: this.heading,
              body: rows,
              theme: 'grid',
              startY: 55,
              headStyles: {
                fillColor: [26, 99, 54]
              },
              columnStyles: {
                0: {cellWidth: 10},
                // 1: {cellWidth: 30},
                // 2: {cellWidth: 30},
                // 3: {cellWidth: 45},
                // 4: {cellWidth: 15},
                // 5: {cellWidth: 15},
                // 6: {cellWidth: 15},
                // 7: {cellWidth: 22},

              }
            });
            // alert("hi");
            doc.save('Hospital Authentication Report Details');
    }
  }

  swal(title, text, icon) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

}
