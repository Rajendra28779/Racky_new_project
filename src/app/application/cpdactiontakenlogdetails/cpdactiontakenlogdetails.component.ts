import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/services/jwt.service';
import { environment } from 'src/environments/environment';
import { idText } from 'typescript';
import { CpdreceivecountreportserviceService } from '../Services/cpdreceivecountreportservice.service';
import { TableUtil } from '../util/TableUtil';
import jsPDF from 'jspdf';
import Swal from 'sweetalert2';
import autoTable from 'jspdf-autotable';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-cpdactiontakenlogdetails',
  templateUrl: './cpdactiontakenlogdetails.component.html',
  styleUrls: ['./cpdactiontakenlogdetails.component.scss']
})
export class CpdactiontakenlogdetailsComponent implements OnInit {
  claimlist:any;
  countclaimlist:any;
  user: any;
  date: any;
  type:any;
  group:any;
  username:any;
  txtsearchDate:any;
  currentPage: any;
  pageElement: any;
  showPegi: boolean;

  constructor(private route:Router,private cpdcountservice:CpdreceivecountreportserviceService,private jwtService: JwtService) { }

  ngOnInit(): void {
    this.user=localStorage.getItem('cpduserid');
    this.date=localStorage.getItem('date');
    this.type=localStorage.getItem('actiontype');
    this.group=localStorage.getItem('group');
    this.username=localStorage.getItem('username');
// alert(this.type)
    this.cpdcountservice.cpdActiontakendetails(this.user,this.date,this.type).subscribe((data:any)=>{
      this.claimlist=data;
      console.log(this.claimlist);
      this.countclaimlist=this.claimlist.length
      if(this.countclaimlist>0){
        this.currentPage = 1;
              this.pageElement = 10;
              this.showPegi=true;
                }else{
                  this.showPegi=false;
                }

  });
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


  details(claim:any,urn:any){
    localStorage.setItem("claimid", claim)
    let state = {
      Urn:urn
    }
    localStorage.setItem("trackingdetails",JSON.stringify(state));
    localStorage.setItem("token", this.jwtService.getJwtToken())
    if(this.group==3){
      this.route.navigate([]).then(result => { window.open(environment.routingUrl + '/trackingdetails'); });

    }else{
    this.route.navigate([]).then(result => { window.open(environment.routingUrl + '/trackingdetails'); });
    }
  }

  report: any = [];
  sno: any = {
    Slno: '',
    claim:'',
    invoice:'',
    urn:'',
    hospital:'',
    package:'',
    patientL:'',
    addminssion:'',
    discharge:'',
    amount:'',
    alloteddate:'',
    actiontype:''

  };
  sno1: any = {
    Slno: '',
    claim:'',
    invoice:'',
    urn:'',
    package:'',
    patientL:'',
    addminssion:'',
    discharge:'',
    amount:'',
    alloteddate:'',
    actiontype:''

  };
  heading = [
    [
      'Sl#',
      'Claim No',
      'InVoice No',
      'URN',
      'Hospital Details',
      'Patient name',
      'Package Details',
      'Actual Date of Addmission ',
      'Actual Date Of Discharge',
      'Claim Amount',
      'Alloted Date',
      'Action type'


    ],
  ];
  heading1 = [
    [
      'Sl#',
      'Claim No',
      'InVoice No',
      'URN',
      'Hospital Details',
      'Patient name',
      'Package Details',
      'Actual Date of Addmission ',
      'Actual Date Of Discharge',
      'Claim Amount',
      'Alloted Date',



    ],
  ];
  heading2 = [
    [
      'Sl#',
      'Claim No',
      'InVoice No',
      'URN',
      'Patient name',
      'Package Details',
      'Actual Date of Addmission ',
      'Actual Date Of Discharge',
      'Claim Amount',
      'Alloted Date',
      'Action type'


    ],
  ];
  heading3 = [
    [
      'Sl#',
      'Claim No',
      'InVoice No',
      'URN',
      'Patient name',
      'Package Details',
      'Actual Date of Addmission ',
      'Actual Date Of Discharge',
      'Claim Amount',
      'Alloted Date',




    ],
  ];
  tempheading:any
  downloadReport(arg0: string){
    this.tempheading=[]
    this.report = [];
    if(this.group!=3){


                let claim: any;
                for (var i = 0; i < this.claimlist.length; i++) {
                  claim = this.claimlist[i];
                  console.log(claim);
                  this.sno = [];
                  this.sno.Slno = i + 1;
                  this.sno.claim=claim.claimNo;
                  this.sno.invoice=claim.invoiceno
                  this.sno.urn=claim.urn
                  this.sno.hospital=claim.hospitalName+"("+claim.hospitalCode+")"
                  this.sno.patientL=claim.patentname
                  this.sno.package=claim.packageName+"("+claim.packagecode+")"
                  this.sno.addminssion=this.convertStringToDate(claim.actDateOfAdm)
                  this.sno.discharge=this.convertStringToDate(claim.actDateOfDschrg)
                  this.sno.amount=claim.claimamount
                  this.sno.alloteddate=claim.alloteddate
                  if(this.type==2){
                  this.sno.actiontype=claim.actiontype
                  }
                  this.report.push(this.sno);
                }
                if(arg0=='xcl') {
                  let filter =[];
                  filter.push([["CPD Name :-",this.username]]);
                  filter.push([['Date', this.date]]);
                    if(this.type==3){
                      filter.push([['Assigned Claims']]);
                    }else{
                      filter.push([['Action Taken Claims']]);
                    }

                  if(this.type==2){
                  TableUtil.exportListToExcelWithFilter(
                    this.report,
                    'CPD Alloted Claim Details',
                    this.heading,filter
                  );
                  }else if(this.type==3){
                    TableUtil.exportListToExcelWithFilter(
                      this.report,
                      'CPD Alloted Claim Details',
                      this.heading1,filter
                    );
                  }
                }else{
                  if(this.report==null || this.report.length==0) {
                    this.swal("Info", "No Record Found", "info");
                    return;
                  }
                  var doc = new jsPDF('l', 'mm',[210,327 ]);
                  doc.setFontSize(12);
                  doc.text("CPD Alloted Claim Details", 5, 10);
                  doc.text("Date :-"+this.date,5,15)
                  doc.text("CPD Name :-"+this.username,5,20)
                  // doc.text("Date: "+date, 8, 15);
                  doc.line(100,26,148,26);
                  var rows = [];
                  for(var i=0;i<this.report.length;i++) {
                    var clm = this.report[i];
                    var pdf = [];
                    pdf[0] = clm.Slno;
                    pdf[1] = clm.claim;
                    pdf[2] = clm.invoice;
                    pdf[3] = clm.urn;
                    pdf[4] =clm.hospital;
                    pdf[5] =clm.patientL;
                    pdf[6] =clm.package;
                    pdf[7] =clm.addminssion;
                    pdf[8] =clm.discharge;
                    pdf[9] =clm.amount;
                    pdf[10] =clm.alloteddate;
                    if(this.type==2){
                      pdf[11] =clm.actiontype;
                      }

                    rows.push(pdf);
                  }
                  if(this.type==2){
                    this.tempheading=this.heading
                  }else if(this.type==3){
                    this.tempheading=this.heading1
                  }
                  autoTable(doc, {
                    head: this.tempheading,
                    body: rows,
                    theme: 'grid',
                    startY: 25,
                    headStyles: {
                      fillColor: [26, 99, 54]
                    },
                    columnStyles: {
                      0: {cellWidth: 10},
                      1: {cellWidth: 20},
                      2: {cellWidth: 20},
                      3: {cellWidth: 20},
                      4: {cellWidth: 50},
                      5: {cellWidth: 20},
                      6: {cellWidth: 40},
                      7: {cellWidth: 20},
                      8: {cellWidth: 20},
                      9: {cellWidth: 20},
                      10: {cellWidth: 20},
                    11:{cellWidth: 20},


                    }
                  });
                  doc.save('CPD Alloted Claim Details');
                }
    }else{
      this.tempheading=[]
    this.report = [];
    let claim: any;
    for (var i = 0; i < this.claimlist.length; i++) {
      claim = this.claimlist[i];
      console.log(claim);
      this.sno1 = [];
      this.sno1.Slno = i + 1;
      this.sno1.claim=claim.claimNo;
      this.sno1.invoice=claim.invoiceno
      this.sno1.urn=claim.urn
      // this.sno.hospital=claim.hospitalName+"("+claim.hospitalCode+")"
      this.sno1.patientL=claim.patentname
      this.sno1.package=claim.packageName+"("+claim.packagecode+")"
      this.sno1.addminssion=this.convertStringToDate(claim.actDateOfAdm)
      this.sno1.discharge=this.convertStringToDate(claim.actDateOfDschrg)
      this.sno1.amount=claim.claimamount
      this.sno1.alloteddate=claim.alloteddate
      if(this.type==2){
      this.sno1.actiontype=claim.actiontype
      }
      this.report.push(this.sno1);
    }
    if(arg0=='xcl') {
      if(this.type==2){
      TableUtil.exportListToExcel(
        this.report,
        'CPD Alloted Claim Details',
        this.heading2
      );
      }else if(this.type==3){
        TableUtil.exportListToExcel(
          this.report,
          'CPD Alloted Claim Details',
          this.heading3
        );
      }
    }else{
      this.tempheading=[]
      if(this.report==null || this.report.length==0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('l', 'mm',[210,297 ]);
      doc.setFontSize(12);
      doc.text("CPD Alloted Claim Details", 5, 10);
      doc.text("Date :-"+this.date,5,10)
      doc.text("CPD Name :-"+this.username,5,20)
      // doc.text("Date: "+date, 8, 15);
      doc.line(100,26,148,26);
      var rows = [];
      for(var i=0;i<this.report.length;i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.Slno;
        pdf[1] = clm.claim;
        pdf[2] = clm.invoice;
        pdf[3] = clm.urn;
        // pdf[4] =clm.hospital;
        pdf[4] =clm.patientL;
        pdf[5] =clm.package;
        pdf[6] =clm.addminssion;
        pdf[7] =clm.discharge;
        pdf[8] =clm.amount;
        pdf[9] =clm.alloteddate;
        if(this.type==2){
          pdf[10] =clm.actiontype;
          }

        rows.push(pdf);
      }
      if(this.type==2){
        this.tempheading=this.heading2
      }else if(this.type==3){
        this.tempheading=this.heading3
      }
      autoTable(doc, {
        head: this.tempheading,
        body: rows,
        theme: 'grid',
        startY: 25,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: {cellWidth: 10},
          1: {cellWidth: 20},
          2: {cellWidth: 20},
          3: {cellWidth: 20},
          // 4: {cellWidth: 50},
          4: {cellWidth: 20},
          5: {cellWidth: 40},
          6: {cellWidth: 20},
          7: {cellWidth: 20},
          8: {cellWidth: 20},
          9: {cellWidth: 20},
         10:{cellWidth: 20},


        }
      });
      doc.save('CPD Alloted Claim Details');
    }

    }
  }
  convertStringToDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy');
    return date;
    }
}
