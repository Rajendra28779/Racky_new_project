import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { HeaderService } from '../header.service';
import { OnlinePostConfigurationServiceService } from '../Services/online-post-configuration-service.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { DatePipe, formatDate } from '@angular/common';
import { TableUtil } from '../util/TableUtil';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-online-post-configuration-view',
  templateUrl: './online-post-configuration-view.component.html',
  styleUrls: ['./online-post-configuration-view.component.scss']
})

export class OnlinePostConfigurationViewComponent implements OnInit {
  childmessage: any;
  showPegi: any;
  user: any;
  pageElement: any;
  currentPage: any;
  txtsearchDate: any;
  onlinepostlist:any;
  countpostlist:any;

  constructor
  ( private route: Router,
    public headerService: HeaderService,
    private onlinepostconfigurationservice: OnlinePostConfigurationServiceService,
    private sessionService: SessionStorageService
 ) { }

  ngOnInit(): void {
    this.headerService.setTitle('Online Post Configuration  View');
    this.user = this.sessionService.decryptSessionData('user');
    this.getonlinepostconfig();
    this.currentPage = 1;
    this.pageElement = 20;
    this.showPegi = true;
  }
  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }
  getonlinepostconfig(){
    this.onlinepostconfigurationservice.getonlinepostname().subscribe(
      (response:any) => {
        this.onlinepostlist = response.data;
        this.countpostlist = this.onlinepostlist.length;
        if(this.countpostlist>0){
          this.showPegi=true;
          this.currentPage=1;
          this.pageElement=20;
        }else{
          this.showPegi=false;
        }
      },
      (error) => console.log(error)
    )
  //   this.postlist = data;
  //   this.countpostlist = this.postlist.length;
  // });
  }
  edit(item: any) {
    let navigationExtras: NavigationExtras = {
      state: {
        user: item,
      },
    };
    this.route.navigate(['application/onlinepostconfiguration'], navigationExtras);
  }
  pageItemChange() {
    this.pageElement = (<HTMLInputElement>(
      document.getElementById('pageItem')
    )).value;
  }
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }
  report: any = [];
  sno: any = [];
  heading = [['Sl#',
  'Post Name',
   'Current Job Description',
   'Online Apply From',
   'Online Apply To',
   'Online Publish Status',
   'Total Application',
   'Total Application Completed',
   'Draft Mode',
   'No Of Vaccancy',
   'Advertisement Number',
   'Advertisement Date',
   'Created By',
   'Created On',
   'Status']];
  downloadReport(no: any) {
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy =  this.user.fullName;
    this.report = [];
    let sna: any;
    for (var i = 0; i < this.onlinepostlist.length; i++) {
      sna = this.onlinepostlist[i];
      this.sno = [];
      this.sno.push(i + 1);
      this.sno.push(sna.POSTNAME);
      this.sno.push(sna.CURRENTJOBDESCRIPTION);
      this.sno.push(sna.ONLINEAPPLYFROM);
      this.sno.push(sna.ONLINEAPPLYTO);
      this.sno.push(sna.ONLINEPUBLISHSTATUS);
      // this.sno.push(sna.DOCUMENTUPLOAD);
      this.sno.push(sna.TOTALAPPLIED);
      this.sno.push(sna.COMPLET);
      this.sno.push(sna.DRAFT);
      this.sno.push(sna.NOOFVACANCY);
      this.sno.push(sna.ADVERTISEMENTNUMBER);
      this.sno.push(sna.ADVERTISEMENTDATE);
      this.sno.push (sna.CREATEDBY);
      this.sno.push (sna.CREATEDON);

      this.sno.push(sna.STATUSFLAG);
      this.report.push(this.sno);
    }
    if (no == 1) {
      let filter = [];
      TableUtil.exportListToExcelWithFilter(
        this.report,
        'Online Post Configuration',
        this.heading, filter
      );
    } else {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('p', 'mm', [400, 320]);
      doc.setFontSize(20);
      doc.text("Online Post Configuration", 80, 15);
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
          0: { cellWidth: 20 },
          1: { cellWidth: 20 },
          2: { cellWidth: 20 },
          3: { cellWidth: 20 },
          4: { cellWidth: 20 },
          5: { cellWidth: 20 },
          6: { cellWidth: 20 },
          7: { cellWidth: 20 },
          8: { cellWidth: 20 },
          9: { cellWidth: 30 },
          10: { cellWidth: 20 },
          11: { cellWidth: 20 },
          12: { cellWidth: 20 },
          13: { cellWidth: 20 },
          14: { cellWidth: 20 },

        }
      });
      doc.save('Online Post Configuration.pdf');
    }
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
  downlordnotification(event: any, DOCUMENTUPLOAD: any) {

    if (DOCUMENTUPLOAD != null && DOCUMENTUPLOAD != '' && DOCUMENTUPLOAD != undefined) {
      let img = this.onlinepostconfigurationservice.downloadFile(DOCUMENTUPLOAD);
      window.open(img, '_blank');
    } else {
      this.swal('Info', 'There Is No File', 'info');
    }

  }
}
