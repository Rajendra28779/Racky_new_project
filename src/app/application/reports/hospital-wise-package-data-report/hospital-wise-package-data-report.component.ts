import { Component, OnInit } from '@angular/core';
import { data } from 'jquery';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { HospitalwisepackageService } from '../../Services/hospitalwisepackage.service';
declare let $: any;
import { TableUtil } from '../../util/TableUtil';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-hospital-wise-package-data-report',
  templateUrl: './hospital-wise-package-data-report.component.html',
  styleUrls: ['./hospital-wise-package-data-report.component.scss']
})
export class HospitalWisePackageDataReportComponent implements OnInit {
  hospitalWisePackage: any = [];
  record:any=0;
  txtsearchDate:any;
  user: any;
  fromdate: any;
  todate: any;
  showPegi: boolean;
  pageElement:any;
  currentPage:any;
  sum: number;
  sum1: number;


  constructor(public headerService:HeaderService, private hospitalwisepackageService: HospitalwisepackageService,private sessionService: SessionStorageService,) { }

  ngOnInit(): void {
    this.headerService.setTitle('Hospital Wise Package List Report');
    this.headerService.isIndicate(true);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.currentPage = 1;
    this.pageElement = 10;
    this.headerService.isBack(false);
    // this.user = JSON.parse(sessionStorage.getItem("user"));
    this.user = this.sessionService.decryptSessionData("user");
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
      format: 'DD-MMM-YYYY LT',
      daysOfWeekDisabled: ['', 7],
    });
  }

  search(){
    let userId = this.user.userId;
    let fromDate=$('#date1').val();
    let toDate=$('#date2').val();
   
    if (fromDate == null || fromDate == "" || fromDate == undefined) {
      this.swal("Info", "Please Select Actual Date of Discharge From", 'info');
      return;
    }
    if (toDate == null || toDate == "" || toDate == undefined) {
      this.swal("Info", "Please Select Actual Date of Discharge To", 'info');
      return;
    }
    if (Date.parse(fromDate) > Date.parse(toDate)) {
      this.swal('Info', ' From Date should be less than To Date', 'info');
      return;
    }

    this.fromdate=fromDate;
    this.todate=toDate;
    this.hospitalwisepackageService.hospitalwisepackagedata(userId,this.fromdate,this.todate).subscribe(
      (result) =>{
        let list: any= [];
        list = result;
        for (var i = 0; i < list.length; i++) {
          var h = list[i];
          h.hospitalName = h.hospitalName + ' (' + h.hospitalCode + ')';
          this.hospitalWisePackage.push(h);
        }
        this.hospitalWisePackage = result;
        this.record = this.hospitalWisePackage.length;
        if (this.record > 0) {
          let sum=0;
          let sum1=0;
          for(let i = 0; i < this.hospitalWisePackage.length; i++){
            sum+=parseInt(this.hospitalWisePackage[i].totalpackageClaimed);
            sum1+=parseInt(this.hospitalWisePackage[i].totalamountBlocked);
           
          }
        this.sum=sum;
        this.sum1=sum1;
        this.currentPage = 1;
        this.pageElement = 100;
        this.showPegi=true;
        }
        else {
          this.showPegi = false;
        }
      },
      (error) => console.log(error)
    )
  }
  Reset(){
    window.location.reload();
  }
  report: any = [];
  hospitalWisePackageData: any = {
    slNo: "",
    stateName: "",
    districtName: "",
    hospitalName:"",
    packageCode: "",
    packageName: "",
    totalpackageClaimed: "",
    totalamountBlocked:""
  };
  heading = [['Sl No.', 'StateName', 'DistrictName','HospitalName', 'PackageName',  'PackageCode','TotalPackageClaimed',  'TotalAmountBlocked']];
  downloadReport(type){
    if (this.hospitalWisePackage == null || this.hospitalWisePackage.length == 0) {
      this.swal("Info", "No Record Found", "info");
      return;
    }
    this.report = [];
    let item: any;
    for (var i = 0; i < this.hospitalWisePackage.length; i++) {
      item = this.hospitalWisePackage[i];
      this.hospitalWisePackageData = [];
      this.hospitalWisePackageData.slNo = i + 1;
      this.hospitalWisePackageData.stateName = item.stateName;
      this.hospitalWisePackageData.districtName = item.districtName;
      this.hospitalWisePackageData.hospitalName=item.hospitalName;
      this.hospitalWisePackageData.packageName = item.packageName;
      this.hospitalWisePackageData.packageCode = item.packageCode;
      this.hospitalWisePackageData.totalpackageClaimed = this.convertCurrency1(item.totalpackageClaimed);
      this.hospitalWisePackageData.totalamountBlocked = this.convertCurrency(item.totalamountBlocked);
      this.report.push(this.hospitalWisePackageData);
    }
    this.hospitalWisePackageData = [];
    this.hospitalWisePackageData.packageCode="Total";
    this.hospitalWisePackageData.totalpackageClaimed=this.convertCurrency( this.sum);
     this.hospitalWisePackageData.totalamountBlocked=this.convertCurrency(this.sum1);
     this.report.push(this.hospitalWisePackageData);

    if (type == 1) {
      let filter = [];
      filter.push([['Date Of Discharge From :-', this.fromdate]]);
      filter.push([['Date Of Discharge To :-', this.todate]]);
      TableUtil.exportListToExcelWithFilter(this.report, "Hospital Wise Package List Report", this.heading, filter);
    } else if (type == 2) {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('l', 'mm', [320, 260]);
      doc.setFontSize(12);
      doc.text("Hospital Wise Package List Report", 5, 10);
      doc.text("Date Of Discharge From :-"+  this.fromdate, 5, 15);
      doc.text("Date Of Discharge To :-"+   this.todate, 5, 20);
      doc.text("Generated On: " + this.convertDate(new Date()), 5, 25);
      doc.text("Generated By: " + this.sessionService.decryptSessionData("user").fullName, 5, 30);
      var rows = [];
      for (var i = 0; i < this.report.length; i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.slNo;
        pdf[1] = clm.stateName;
        pdf[2] = clm.districtName;
        pdf[3] = clm.hospitalName;
        pdf[4] = clm.packageName;
        pdf[5] = clm.packageCode;
        pdf[6] = clm.totalpackageClaimed;
        pdf[7] = clm.totalamountBlocked;
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
          0: { cellWidth: 10 },
          1: { cellWidth: 30 },
          2: { cellWidth: 35 },
          3: { cellWidth: 70 },
          4: { cellWidth: 30 },
          5: { cellWidth: 45 },
          6: { cellWidth: 35 },
          7: { cellWidth: 35 },
          
        }
      });
      doc.save('Bsky_Hospital Wise Package List Report.pdf');
    }
  }

  convertCurrency(totalamountBlocked: any): any {
    var formatter = new CurrencyPipe('en-US');
    totalamountBlocked = formatter.transform(totalamountBlocked, '', '');
    return totalamountBlocked;
  }
  convertCurrency1(totalpackageClaimed: any): any {
    var formatter = new CurrencyPipe('en-US');
    totalpackageClaimed = formatter.transform(totalpackageClaimed, '', '');
    return totalpackageClaimed;
  }
  convertDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy');
    return date;
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

}
