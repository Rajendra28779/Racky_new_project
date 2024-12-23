import { Component, OnInit } from '@angular/core';
import { WhatsappuserconfigurationServiceService } from 'src/app/services/whatsappuserconfiguration-service.service';
import { HeaderService } from '../header.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { NavigationExtras, Router } from '@angular/router';
import { formatDate } from '@angular/common';
import Swal from 'sweetalert2';
import { TableUtil } from '../util/TableUtil';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-whatsapp-user-configuration-view',
  templateUrl: './whatsapp-user-configuration-view.component.html',
  styleUrls: ['./whatsapp-user-configuration-view.component.scss']
})
export class WhatsappUserConfigurationViewComponent implements OnInit {
  childmessage: any;
  user: any;
  list:any
  countgllist: any;
  showPegi:any=false;
  pageElement:any;
  currentPage:any;
  txtsearchDate:any;

  constructor(
    private whatsappuserconfigurationservice: WhatsappuserconfigurationServiceService,
    private route:Router,
    public headerService:HeaderService,
    private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle('WhatsApp User Configuration View');
    this.user = this.sessionService.decryptSessionData("user");
    this.getviewlist();
  }

  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }
  getviewlist(){
    this.whatsappuserconfigurationservice.getwhatsappconfigviewlist().subscribe((data:any)=>{
      if(data.status==200){
        this.list=data.data;
        console.log( this.list);
        this.countgllist=this.list.length
          if(this.countgllist>0){
            this.currentPage = 1;
            this.pageElement = 20;
            this.showPegi=true;
          }else{
            this.showPegi=false;
          }
        }else{
          this.swal('Error','Something Went Wrong','error')
        }
    });
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  edit(item:any){
    let navigationExtras: NavigationExtras = {
      state: {
        user: item
      }
    };
    this.route.navigate(['application/whatsappuserconfiguration'], navigationExtras);
  }

   report: any = [];
  sno: any = [];
  heading = [['Sl#', 'Whatsapp Template Name', 'Group Name', 'User Name','Template Id', 'Created By', 'Created On','Status']];
  downloadReport(no: any) {
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy =  this.user.fullName;
    this.report = [];
    let sna: any;
    for (var i = 0; i < this.list.length; i++) {
      sna = this.list[i];
      this.sno = [];
      this.sno.push(i + 1);
      this.sno.push(sna.templetname);
      this.sno.push(sna.groupname);
      this.sno.push(sna.userfullname);
      this.sno.push(sna.odishatempid);
      this.sno.push(sna.createdbyname);
      this.sno.push(sna.createdon);
      this.sno.push(sna.statusflag == 0 ? "Active" : "In-Active");
      this.report.push(this.sno);
    }
    if (no == 1) {
      let filter = [];
      TableUtil.exportListToExcelWithFilter(
        this.report,
        'WhatsApp User Configuration ',
        this.heading, filter
      );
    } else {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('p', 'mm', [297, 210]);
      doc.setFontSize(20);
      doc.text("WhatsApp User Configuration ", 80, 15);
      doc.setFontSize(13);
      doc.text('GeneratedOn :- ' + generatedOn, 15, 25);
      doc.text('GeneratedBy :- ' + generatedBy, 15, 33);
      autoTable(doc, {
        head: this.heading,
        body: this.report,
        theme: 'grid',
        startY: 40,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 10 },
        }
      });
      doc.save('WhatsApp User Configuration.pdf');
    }
  }

  action(configid:any,stattus:any){
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        this.whatsappuserconfigurationservice.inactiveonwhatsappconfig(configid,stattus).subscribe((data: any) => {
          if (data.status == 200) {
            this.swal(
              'Success',
              data.message,
              'success'
            )
            this.getviewlist();
          }else{
            this.swal(
              'Error!',
              'Something Went Wrong',
              'error'
            )
          }
        })
      }
    })
  }

}
