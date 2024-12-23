import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HeaderService } from '../../header.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { SnamasterserviceService } from '../../Services/snamasterservice.service';
import { PaymentfreezereportService } from '../../Services/paymentfreezereport.service';
import { environment } from '../../../../environments/environment';
import { TableUtil } from '../../util/TableUtil';
import { JwtService } from 'src/app/services/jwt.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DatePipe } from '@angular/common';
import { execFile } from 'child_process';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-paymentfrezzereport',
  templateUrl: './paymentfrezzereport.component.html',
  styleUrls: ['./paymentfrezzereport.component.scss']
})
export class PaymentfrezzereportComponent implements OnInit {
  childmessage: any;
  searchby: any = 2;
  user: any;
  record: any;
  claimCount: any;
  public stateList: any = [];
  public districtList: any = [];
  public hospitalList: any = [];
  hospitalId: any="";
  districtId: any="";
  stateId: any="";
  keyword: any = "hospitalName";
  keyword1: any = "districtname";
  keyword2: any = "stateName";
  freezereport:any=[]
  txtsearchDate:any
  length:any;
  showPegi:any=false;
  pageElement:any;
  currentPage:any;
  hospitalname1:any="--";

  @ViewChild('auto') auto;
  @ViewChild('auto1') auto1;
  formdate: any;
  todate: any;
  hosp: any;
  dist: any;
  state: any;

  constructor(public fb: FormBuilder, private snamasterService: SnamasterserviceService, private jwtService: JwtService,private sessionService: SessionStorageService,
     public headerService: HeaderService, public route: Router,public pfservice:PaymentfreezereportService) { }


  ngOnInit(): void {
    this.headerService.setTitle('Payment Freeze Report');
    this.headerService.isIndicate(false);
    this.headerService.isBack(true);
    // this.user = JSON.parse(sessionStorage.getItem('user'));
    this.user = this.sessionService.decryptSessionData("user");
    // this.length=this.countprogressreport.length

    $('.selectpicker').selectpicker();

    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
      // endDate: '0d',
      maxDate: new Date(),
      daysOfWeekDisabled: ['', 7],
    });
    $('.timepicker').datetimepicker({
      format: 'LT',
      daysOfWeekDisabled: ['', 7],
    });
    $('.datetimepicker').datetimepicker({
      format: 'YYYY-MM-DD LT',
      daysOfWeekDisabled: ['', 7],
    });
    var date = new Date();

    let year = date.getFullYear();
    let date1 = '01';
    let month: any = date.getMonth();

    if (month == 0) {
      month = 'Jan';
    } else if (month == 1) {
      month = 'Feb';
    } else if (month == 2) {
      month = 'Mar';
    } else if (month == 3) {
      month = 'Apr';
    } else if (month == 4) {
      month = 'May';
    } else if (month == 5) {
      month = 'Jun';
    } else if (month == 6) {
      month = 'Jul';
    } else if (month == 7) {
      month = 'Aug';
    } else if (month == 8) {
      month = 'Sep';
    } else if (month == 9) {
      month = 'Oct';
    } else if (month == 10) {
      month = 'Nov';
    } else if (month == 11) {
      month = 'Dec';
    }
    var frstDay = date1 + '-' + month + '-' + year;
    $('input[name="fromDate"]').val(frstDay);
    $('input[name="fromDate"]').attr('placeholder', 'From Date *');

    // $('input[name="toDate"]').val('');
    $('input[name="toDate"]').attr('placeholder', 'To Date *');
    this.getStateList();
    this.getDetails()
  }
  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }

  getStateList() {
    this.snamasterService.getStateList(this.user.userId).subscribe(
      (response) => {
        this.stateList = response;
        console.log(this.stateList);
      },
      (error) => console.log(error)
    )
  }

  OnChangeState(id) {
    this.auto1.clear();
    this.auto.clear();
    this.districtId = '';
    this.hospitalId = '';
    this.auto.clear();
    this.hospitalList = [];
    localStorage.setItem("stateCode", id);
    this.snamasterService.getDistrictListByStateId(this.user.userId, id).subscribe(
      (response) => {
        this.districtList = response;
        console.log(response);
      },
      (error) => console.log(error)
    )
  }

  OnChangeDistrict(id) {
    this.hospitalId = '';
    this.auto.clear();
    var stateCode = localStorage.getItem("stateCode");
    this.snamasterService.getHospitalbyDistrictId(this.user.userId, id, stateCode).subscribe(
      (response) => {
        this.hospitalList = response;
        console.log(response);
      },
      (error) => console.log(error)
    )
  }

  selectEvent(item) {
    // do something with selected item
    this.hospitalId = item.hospitalCode;
    this.hospitalname1 =item.hospitalName;

  }

  clearEvent() {
    this.hospitalId = '';
  }

  districtname:any="--";
  selectEvent1(item) {
    // do something with selected item
    this.districtId = item.districtcode;
    this.districtname=item.districtname;
    this.OnChangeDistrict(this.districtId);
  }

  clearEvent1() {
    this.districtId = '';
    this.OnChangeDistrict(this.districtId);
  }

  statename:any="--"
  selectEvent2(item) {
    // do something with selected item
    this.stateId = item.stateCode;
    this.statename=item.stateName;
    this.OnChangeState(this.stateId);
  }

  clearEvent2() {
    this.stateId = '';
    this.OnChangeState(this.stateId);
  }

  resetTable() {
    window.location.reload();
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }

  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }
  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
    console.log(this.pageElement);

   }

  freezerptlength:any;
  getDetails(){
      this.formdate=$('#formdate').val();
      this.todate=$('#todate').val();
      let userId=this.user.userId
    this.pfservice.getpaymentfrezzedetails(userId,this.formdate,this.todate,this.stateId,this.districtId,this.hospitalId).subscribe((data:any)=>{
        console.log(data);
        this.freezereport=data
        this.freezerptlength=this.freezereport.length;
      if(this.freezerptlength>0){
        this.currentPage = 1;
        this.pageElement = 100;
        this.showPegi=true;
      }else{
        this.showPegi=false;
      }

    });
  }

  details(claim:any,urn:any){
    localStorage.setItem("claimid", claim)
    let state = {
      Urn:urn
    }
    localStorage.setItem("trackingdetails",JSON.stringify(state));
    localStorage.setItem("token", this.jwtService.getJwtToken())
    this.route.navigate([]).then(result => { window.open(environment.routingUrl + '/trackingdetails'); });
  }

  report: any = [];
  claimlistreport: any = {
    slno:"",
    claimNo:"",
    invoiceNo:"",
    URN:"",
    Patientname:"",
    hospitalname:"",
    packagecode:"",
    packagename:"",
    dateofaddm:"",
    dateofdischarge:"",
    claimamount:""
  };

  heading = [
    [
      'Sl#',
      'Claim No',
      'Invoice No',
      'URN',
      'Patient Name',
      'Hospital Details',
      'Package Code ',
      'Package name',
      'Date Of Addmission',
      'Date Of Discharge',
      'Claim amount'
    ],
  ];

  downloadReport(no:any){
    this.report = [];
    let sna: any;
    for (var i = 0; i < this.freezereport.length; i++) {
      sna=this.freezereport[i];
      this.claimlistreport=[];
      this.claimlistreport.slno=i+1;
      this.claimlistreport.claimNo=sna.claimNo
      this.claimlistreport.invoiceNo=sna.invoiceno
      this.claimlistreport.URN=sna.urn
      this.claimlistreport.Patientname=sna.patentname
      this.claimlistreport.hospitalname=sna.hospitalName+" ("+sna.hospitalCode+")";
      // this.claimlistreport.hospitalcode=sna.hospitalCode
      this.claimlistreport.packagecode=sna.packagecode
      this.claimlistreport.packagename=sna.packageName
      this.claimlistreport.dateofaddm=sna.actDateOfAdm
      this.claimlistreport.dateofdischarge=sna.actDateOfDschrg
      this.claimlistreport.claimamount=sna.claimamount

  this.report.push(this.claimlistreport);

    }
        if(no==1){
        TableUtil.exportListToExcel(this.report,'Payment Freeze Report',this.heading);
      }else if(no==2){
        if(this.report==null || this.report.length==0) {
          this.swal("Info", "No Record Found", "info");
          return;
        }
        var doc = new jsPDF('l', 'mm',[270,350 ]);
        doc.setFontSize(12);
        doc.text("Payment Freeze Report ", 5, 10);
        doc.text('Actual Date of Discharge :- '+this.formdate +' To '+this.todate, 5, 15);
        doc.text("State :- "+this.statename, 5, 20);
        doc.text("District :- "+this.districtname, 5, 25);
        doc.text("Hospital Details :- "+this.hospitalname1, 5, 30);
        var rows = [];
          for(var i=0;i<this.report.length;i++) {
            var clm = this.report[i];
            var pdf = [];
            pdf[0] = clm.slno;
            pdf[1] = clm.claimNo;
            pdf[2] = clm.invoiceNo;
            pdf[3] = clm.URN;
            pdf[4] = clm.Patientname;
            pdf[5] = clm.hospitalname;
            pdf[6] = clm.packagecode;
            pdf[7] = clm.packagename;
            pdf[8] = clm.dateofaddm;
            pdf[9] = clm.dateofdischarge;
            pdf[10] = clm.claimamount;
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
              0: {cellWidth: 10},
              1: {cellWidth: 30},
              2: {cellWidth: 30},
              3: {cellWidth: 30},
              4: {cellWidth: 30},
              5: {cellWidth: 60},
              6: {cellWidth: 30},
              7: {cellWidth: 20},
              8: {cellWidth: 30},
              9: {cellWidth: 30},
              10: {cellWidth: 20},
            }
          });
          // alert("hi");
          doc.save('Payment Freeze Report.pdf');
      }else{
        this.swal("Warning", "Something Went Wrong", "error");
          return;
      }
  }

}
