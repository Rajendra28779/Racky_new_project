import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { JwtService } from 'src/app/services/jwt.service';
import { HeaderService } from '../../header.service';
import { environment } from 'src/environments/environment';
import { FunctionmasterserviceService } from '../../Services/functionmasterservice.service';
import { CurrencyPipe, formatDate } from '@angular/common';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';
import { TableUtil } from '../../util/TableUtil';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-floate-details',
  templateUrl: './floate-details.component.html',
  styleUrls: ['./floate-details.component.scss']
})
export class FloateDetailsComponent implements OnInit {

user1:any;
  floatedetails: any;
  countflotedetails: any;
  showPegi:any;
  pageElement:any;
  currentPage:any;
  childmessage: any;
  txtsearchDate:any;
  floateno:any;
  formdate: any;
  user:any;
  constructor(private sessionService: SessionStorageService,private route:Router,public headerService:HeaderService,private jwtService: JwtService,public fnmservice:FunctionmasterserviceService) {
    this.user1 = this.route.getCurrentNavigation().extras.state;
  }

  ngOnInit(): void {
    this.headerService.setTitle('Float Details');
    this.user = this.sessionService.decryptSessionData("user");
    this.headerService.isBack(false);
    this.showPegi=false;
    // console.log(this.user1.user);
    this.floateno=this.user1.user;
    this.fnmservice.getfloatedetailsbyid(this.user1.user).subscribe(data=>{
    //  console.log(data);
        this.floatedetails=data;
        this.countflotedetails=this.floatedetails.length;
        if(this.countflotedetails>0){
          this.currentPage = 1;
          this.pageElement = 100;
          this.showPegi=true;
        }
    });

  }

  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }

  view(item:any){
    localStorage.setItem("claimid", item)
    localStorage.setItem("token", this.jwtService.getJwtToken())
    this.route.navigate([]).then(result => { window.open(environment.routingUrl + '/trackingdetails'); });
  }

  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
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
    urn: "",
    claim: "",
    pname: "",
    hospname: "",
    admission: "",
    discharge: "",
    pkgid: "",
    pkgcode: "",
    clmraiseon: "",
    amount: "",
  };
  heading = [['Sl#','URN',
  'Claim No',
  'Patient Name',
  'Hospital Name',
  'Actual Date of Admission',
  'Actual Date of Discharge',
  'Package ID',
  'Claim Raised On',
  'Amount']];

  downloadList(no:any){
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy = this.user.fullName;
    this.report = [];
    let sna: any;
    for (var i = 0; i < this.floatedetails.length; i++) {
      sna=this.floatedetails[i];
      this.sno=[];
      this.sno.Slno=i+1;
      this.sno.urn=sna.urnno;
      this.sno.claim=sna.claimno;
      this.sno.pname=sna.patentname     ;
      this.sno.hospname=sna.hospitalname;
      this.sno.admission=sna.actualdateofAdmission;
      this.sno.discharge=sna.actualdateofDischarge;
      this.sno.pkgid=sna.packageid;
      this.sno.pkgcode=sna.packagename;
      this.sno.clmraiseon=sna.claimRaisedon;
      this.sno.amount=this.convertCurrency(sna.amount);
      this.report.push(this.sno);
    }
    if(this.floateno == "" || this.floateno == null || this.floateno == undefined){
      this.floateno="N/A";
    }

    if(no==1){
      let filter =[];
        filter.push([['Floate No', this.floateno]]);
        TableUtil.exportListToExcelWithFilter(
          this.report,
          this.floateno +'_Floate Details',
          this.heading,filter
        );
    }else{
      if(this.report==null || this.report.length==0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('l', 'mm',[297,210 ]);
      doc.setFontSize(20);
      doc.text("Admin Floate Report", 120, 15);
      doc.setFontSize(12);
      doc.text('Floate No :- '+ this.floateno,15,22);
      doc.text('GeneratedOn :- '+generatedOn,180,29);
      doc.text('GeneratedBy :- '+generatedBy,15,29);
            var rows = [];
            for(var i=0;i<this.report.length;i++) {
              var clm = this.report[i];
              var pdf = [];
              pdf[0] = clm.Slno;
              pdf[1] = clm.urn;
              pdf[2] = clm.claim;
              pdf[3] = clm.pname;
              pdf[4] = clm.hospname;
              pdf[5] = clm.admission;
              pdf[6] = clm.discharge;
              pdf[7] = clm.pkgid;
              pdf[8] = clm.pkgcode;
              pdf[9] = clm.clmraiseon;
              pdf[10] = clm.amount;
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
                0: {cellWidth: 10},
                // 1: {cellWidth: 42},
                2: {cellWidth: 30},
                // 3: {cellWidth: 42},
                // 4: {cellWidth: 42},

              }
            });
            doc.save(this.floateno+'_Floate_Details.pdf');
  }
}

convertCurrency(amount: any){
  var formatter = new CurrencyPipe('en-IN');
  amount = formatter.transform(amount, '', '');
  return amount;
}
}
