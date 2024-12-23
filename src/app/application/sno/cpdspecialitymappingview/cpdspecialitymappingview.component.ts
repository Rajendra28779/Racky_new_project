import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { ConfigurationService } from '../../Services/configuration.service';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import { TableUtil } from '../../util/TableUtil';

@Component({
  selector: 'app-cpdspecialitymappingview',
  templateUrl: './cpdspecialitymappingview.component.html',
  styleUrls: ['./cpdspecialitymappingview.component.scss']
})
export class CpdspecialitymappingviewComponent implements OnInit {
  user:any
  cpdId:any="";
  cpdname:any="All";
  cpduserid:any=0;
  cpdList:any=[];
  keyword: any = 'fullName';
  iscpd:boolean=false;
  txtsearchDate:any;
  list:any=[];
  showPegi: boolean;
  currentPage: any;
  pageElement: any;
  totalcount:any=0

  constructor(public headerService: HeaderService,
    public config:ConfigurationService,
    private snoService: SnocreateserviceService,
     public route: Router,
     private sesonservice:SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle('CPD Specialty Mapping');
    this.user = this.sesonservice.decryptSessionData("user");
    if(this.user.groupId==3){
      this.cpdname=this.user.fullName;
      this.cpduserid=this.user.userId;
      this.iscpd=true;
    }else{
      this.iscpd=false;
      this.getCPDList();
    }
    this.search();
  }

  getCPDList() {
    this.snoService.getCPDList().subscribe(
      (response) => {
        this.cpdList = response;
      })
  }

  selectEvent(item) {
    this.cpdId = item.bskyUserId;
    this.cpdname=item.fullName;
    this.cpduserid=item.userid;
  }


  clearEvent() {
    this.cpdId ='';
    this.cpdname="All";
    this.cpduserid=0;
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  search(){
    this.config.getcpdtaggedPackageList(this.cpduserid).subscribe((response:any) => {
      if(response.status==200){
         this.list=response.data;
         this.totalcount=this.list.length;
         if(this.totalcount>0){
          this.showPegi=true;
          this.currentPage=1;
          this.pageElement=100;
         }else{
          this.showPegi=false;
         }
      }else{
        this.swal("Error","Something Went Wrong","error")
      }
    });
  }

  report: any = [];
  sno: any = [];
  heading = [['Sl#', 'CPD Name','Mobile No','Speciality Code','Speciality Name','Submitted On']];
  downloadList(no:any){
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy = this.user.fullName;
    this.report = [];
    let sna: any;
    for (var i = 0; i < this.list.length; i++) {
      sna=this.list[i];
      this.sno=[];
      this.sno.push(i+1);
      this.sno.push(sna.cpdname);
      this.sno.push(sna.mobileNo);
      this.sno.push(sna.packagecode);
      this.sno.push(sna.packagename);
      this.sno.push(sna.createdon);
      this.report.push(this.sno);
    }
    if(no==1){
      let filter =[];
        TableUtil.exportListToExcelWithFilter(
          this.report,
          'CPD Speciality Mapping Report',
          this.heading,filter
        );
    }else{
      if(this.report==null || this.report.length==0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('p', 'mm',[297,210 ]);
      doc.setFontSize(20);
      doc.text("CPD Speciality Mapping Report", 60, 15);
      doc.setFontSize(13);
      doc.text('GeneratedOn :- '+generatedOn,15,25);
      doc.text('GeneratedBy :- '+generatedBy,15,33);
        autoTable(doc, {
          head: this.heading,
          body: this.report,
          theme: 'grid',
          startY: 40,
          headStyles: {
            fillColor: [26, 99, 54]
          },
          columnStyles: {
            0: {cellWidth: 10},
          }
        });
        doc.save('CPD_Speciality_Mapping_Report.pdf');
    }
  }

  downloaddocument(fileName:any,userid:any){
    if (fileName != null && fileName != '' && fileName != undefined) {
      let img = this.config.downloadcpdspecdoc(fileName,userid);
      window.open(img, '_blank');
    } else {
      this.swal('Info', 'Please Select File', 'info');
    }
  }

}
