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
  selector: 'app-cpdhosptaltaggingreport',
  templateUrl: './cpdhosptaltaggingreport.component.html',
  styleUrls: ['./cpdhosptaltaggingreport.component.scss']
})
export class CpdhosptaltaggingreportComponent implements OnInit {
  user:any
  cpdId:any="";
  cpdname:any="All";
  cpduserid:any="";
  cpdList:any=[];
  list:any=[];
  keyword: any = 'fullName';
  record:any=0;
  showPegi:boolean=false;
  currentPage:any;
  pageElement:any;
  status:any;
  txtsearchDate:any;

  constructor(public headerService: HeaderService,
    public config:ConfigurationService,
    private snoService: SnocreateserviceService,
     public route: Router,
     private sesonservice:SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle('CPD Hospital Tagging Report');
    this.user = this.sesonservice.decryptSessionData("user");
    this.getCPDList();
    this.search()
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
    this.cpduserid='';
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  search(){
    this.status=$('#status').val();
    this.config.cpdhospitaltaglist(this.cpdId,this.cpduserid,this.status,this.user.userId).subscribe((data:any)=>{
      if(data.status==200){
        this.list=data.data;
        this.record=this.list.length;
        if(this.record>0){
          this.showPegi=true
          this.currentPage=1
          this.pageElement=100
        }
      }else{
        this.swal("Error","Something went wrong","error")
      }
    });
  }

  ResetField(){
    window.location.reload();
  }

  report: any = [];
  sno: any = [];
  heading = [['Sl#', 'CPD Name','Hospital Code','Hospital Name','State Name', 'District Name','Status','Period From','Period To']];
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
      this.sno.push(sna.hospitalcode);
      this.sno.push(sna.hospital);
      this.sno.push(sna.state);
      this.sno.push(sna.dist);
      this.sno.push(sna.status);
      this.sno.push(sna.periodfrom);
      this.sno.push(sna.periodto);
      this.report.push(this.sno);
    }

    let status="All";
    if(this.status==""){
      status="All";
    }else if(this.status==0){
      status="Active";
    }else if(this.status==1){
      status="Inactive";
    }else{
      status="All";
    }
    if(no==1){
      let filter =[];
      filter.push([['CPD Name', this.cpdname]]);
      filter.push([['Status', status]]);
        TableUtil.exportListToExcelWithFilter(
          this.report,
          'CPD Hospital Tagging Report',
          this.heading,filter
        );
    }else{
      if(this.report==null || this.report.length==0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('l', 'mm',[297,210 ]);
      doc.setFontSize(20);
      doc.text("CPD Hospital Tagging Report", 80, 15);
      doc.setFontSize(13);
      doc.text('GeneratedOn :- '+generatedOn,15,25);
      doc.text('CPD Name :- '+this.cpdname,170,25);
      doc.text('GeneratedBy :- '+generatedBy,15,33);
      doc.text('Status :- '+status,170,33);
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
        doc.save('CPD Hospital Tagging Report.pdf');
    }
  }
}
