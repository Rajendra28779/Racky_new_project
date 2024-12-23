import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { HospitalspecialityreportserviceService } from '../../Services/hospitalspecialityreportservice.service';
import { TableUtil } from '../../util/TableUtil';

@Component({
  selector: 'app-mdrprodeduremappingview',
  templateUrl: './mdrprodeduremappingview.component.html',
  styleUrls: ['./mdrprodeduremappingview.component.scss']
})
export class MdrprodeduremappingviewComponent implements OnInit {

  txtsearchDate:any
  list:any=[];
  showPegi:boolean;
  pageElement:any;
  currentPage:any;
  headerCode:any="";
  headerCodeList:any=[];
  keyword="headerName";
  user:any;
  record:any=0;

  constructor(public headerService: HeaderService,
    public hospitalspecialityreportservice: HospitalspecialityreportserviceService,
    private sessionService: SessionStorageService
    ) { }

  ngOnInit(): void {
    this.headerService.setTitle('MDR Document Mapping');
    this.user = this.sessionService.decryptSessionData("user");
    this.getPackageHeaderCodeList();
    this.gettaggedlist();
  }

  getPackageHeaderCodeList() {
    this.hospitalspecialityreportservice
      .getPackageHeaderCodeList()
      .subscribe((data: any) => {
        this.headerCodeList = data;
      });
  }

  selectEvent(item:any){
    this.headerCode=item.headerCode;
    this.gettaggedlist();
  }

  clearEvent(){
    this.headerCode="";
    this.gettaggedlist();
  }

  gettaggedlist(){
    this.hospitalspecialityreportservice.getdocproctaggedlist(this.headerCode).subscribe((data: any) => {
      if(data.status==200){
        this.list = data.data;
        this.record=this.list.length;
        if(this.record>0){
          this.showPegi=true;
          this.currentPage=1;
          this.pageElement=100;
        }
      }else{
        this.swal("Error","No record found","error")
      }
    });
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }

  showPreDoc1(text, index) {
    $('#proceduredescription' + index).text(text);
    $('#showMoreId6' + index).empty()
    $('#showMoreId7' + index).append('<div style="cursor: pointer; color: #1d89c9">Show Less</div>');
  }

  hidePreDoc1(text, index) {
    if (text.length > 30) {
      $('#proceduredescription' + index).text(text.substring(0, 30) + '...');
      $('#showMoreId7' + index).empty()
      $('#showMoreId6' + index).empty();
      $('#showMoreId6' + index).append('<span style="cursor: pointer; color: #1d89c9">Show More</span>');
    }
  }

  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }


  report: any = [];
  sno: any = [];
  heading = [['Sl#', 'Header Name', 'Sub-Package Name', 'Procedure Code', 'Description', 'Pre-Auth Document','Claim Document']];
  downloadList(no: any) {
    this.hospitalspecialityreportservice.getdocproctaggedlistforexcel(this.headerCode).subscribe((data: any) => {
      if(data.status==200){
        let list=[];
        list=data.data;
        if (list.length == 0) {
          this.swal("Info", "No Record Found", "info");
          return;
        }
          let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
          let generatedBy =  this.user.fullName;
          this.report = [];
          let sna: any;
          for (let i = 0; i < list.length; i++) {
            sna = list[i];
            this.sno = [];
            this.sno.push(i + 1);
            this.sno.push(sna.packageHeaderName);
            this.sno.push(sna.subPackageName);
            this.sno.push(sna.procedureCode);
            this.sno.push(sna.procedureDescription);
            this.sno.push(sna.preauthDoc);
            this.sno.push(sna.claimDoc);
            this.report.push(this.sno);
          }
          if (no == 1) {
            let filter = [];
            TableUtil.exportListToExcelWithFilter(
              this.report,
              'MDR Document Mapping Report',
              this.heading, filter
            );
          } else {
            if (this.report == null || this.report.length == 0) {
              this.swal("Info", "No Record Found", "info");
              return;
            }
            let doc = new jsPDF('l', 'mm', [297, 210]);
            doc.setFontSize(20);
            doc.text("MDR Document Mapping Report", 110, 15);
            doc.setFontSize(13);
            doc.text('GeneratedOn :- ' + generatedOn, 180, 25);
            doc.text('GeneratedBy :- ' + generatedBy, 15, 25);
            autoTable(doc, {
              head: this.heading,
              body: this.report,
              theme: 'grid',
              startY: 32,
              headStyles: {
                fillColor: [26, 99, 54]
              },
              columnStyles: {
                0: { cellWidth: 10 },
              }
            });
            doc.save('MDR_Document_Mapping_Report.pdf');
          }
      }else{
        this.swal("Error","No record found","error")
      }
    });
  }

}
