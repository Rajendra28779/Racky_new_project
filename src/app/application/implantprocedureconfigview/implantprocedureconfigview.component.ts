import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { HeaderService } from '../header.service';
import { HospitalPackageMappingService } from '../Services/hospital-package-mapping.service';
import { SnoCLaimDetailsService } from '../Services/sno-claim-details.service';
import Swal from 'sweetalert2';
import { ImplantMasterService } from '../Services/implant-master.service';
import { TableUtil } from '../util/TableUtil';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CurrencyPipe, formatDate } from '@angular/common';

@Component({
  selector: 'app-implantprocedureconfigview',
  templateUrl: './implantprocedureconfigview.component.html',
  styleUrls: ['./implantprocedureconfigview.component.scss']
})
export class ImplantprocedureconfigviewComponent implements OnInit {
  keyword: string = 'packageheadername';
  keyword1: string = 'procedureDescription';
  packageHeaderItem: any = [];
  packageList: any = [];
  packageheadercode: any="";
  packageheadername: any="All";
  procedure: any="";
  procedurename: any="All";
  user:any;
  txtsearchDate:any;
  @ViewChild('auto') auto;
  list:any=[];
  showPegi: boolean;
  currentPage: any;
  pageElement: any;
  totalcount:any=0;

  constructor(
    public headerService: HeaderService,
    public snoService: SnoCLaimDetailsService,
    public route: Router,
    private hospitalService: HospitalPackageMappingService,
    private sessionService: SessionStorageService,
    private implantmaster:ImplantMasterService) {}

  ngOnInit(): void {
    this.headerService.setTitle("Implant Procedure Mapping");
    this.user = this.sessionService.decryptSessionData("user");
    this.getPackageHeader();
    this.Search();
  }

  getPackageHeader() {
    this.hospitalService.getallPackageHeaders().subscribe((data: any) => {
      this.packageHeaderItem = data;
    });
  }

  selectEvent(item) {
    this.packageheadercode = item.packageheadercode;
    this.packageheadername = item.packageheadername;
    this.getPackageName();
  }

  clearEvent() {
    this.packageheadercode = "";
    this.packageheadername="All";
    this.packageList=[];
    this.clearEvent1();
    this.auto.clear();
  }

  getPackageName() {
    this.snoService.getPackageName(this.packageheadercode).subscribe((response:any) => {
        if (response.status == 'success') {
          let data = JSON.parse(response.data);
          this.packageList = data.packageArray;
        } else {
          this.swal('Error', 'Something went wrong.', 'error');
        }
      }
    );
  }

  selectEvent1(item) {
    this.procedure=item.procedureCode;
    this.procedurename=item.procedureDescription
  }

  clearEvent1() {
    this.procedure="";
    this.procedurename="All";
  }


  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }

  Search(){
  this.implantmaster.implantproceduremappeddata(this.procedure,this.packageheadercode).subscribe((data:any) => {
      if(data.status ==200){
        this.list=data.data;
        this.totalcount=this.list.length;
        if(this.totalcount>0){
          this.showPegi=true;
          this.currentPage=1;
          this.pageElement=100;
        }else{
          this.showPegi=false;
        }
      }else{
        this.swal("Error","Something Went Wrong","error");
      }
    });
  }

  report: any = [];
  sno: any = [];
  heading = [['Sl#', 'Speciality Name', 'Package Name', 'Implant', 'Maximum Unit', 'Unit Per Price','Price Editable','Unit Editable']];
  downloadList(no: any) {
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy =  this.user.fullName;
    this.report = [];
    let sna: any;
    for (var i = 0; i < this.list.length; i++) {
      sna = this.list[i];
      this.sno = [];
      this.sno.push(i + 1);
      this.sno.push(sna.speciality);
      this.sno.push(sna.package);
      this.sno.push(sna.implant);
      this.sno.push(sna.maximumunit);
      this.sno.push(this.convertCurrency(sna.unitprice));
      this.sno.push(sna.priceeditble);
      this.sno.push(sna.uniteditble);
      this.report.push(this.sno);
    }
    if (no == 1) {
      let filter = [];
      filter.push([['Speciality', this.packageheadername]]);
      filter.push([['Package Code', this.procedurename]]);
      TableUtil.exportListToExcelWithFilter(
        this.report,
        'Implant Procedure Mapping Report',
        this.heading, filter
      );
    } else {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('p', 'mm', [297, 210]);
      doc.setFontSize(20);
      doc.text("Implant Procedure Mapping Report", 55, 15);
      doc.setFontSize(13);
      doc.text('GeneratedOn :- ' + generatedOn, 15, 25);
      doc.text('GeneratedBy :- ' + generatedBy, 15, 33);
      doc.text('Speciality :- ' + this.packageheadername, 15, 41);
      doc.text('Package Code :- ' + this.procedurename, 15, 49);
      autoTable(doc, {
        head: this.heading,
        body: this.report,
        theme: 'grid',
        startY: 56,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 10 },
        }
      });
      doc.save('Implant_Procedure_Mapping_Report.pdf');
    }
  }

  convertCurrency(amount: any){
    var formatter = new CurrencyPipe('en-IN');
    amount = formatter.transform(amount, '', '');
    return amount;
  }

}
