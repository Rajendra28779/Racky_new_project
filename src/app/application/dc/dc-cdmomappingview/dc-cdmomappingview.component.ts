import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { DcCdmomappingService } from '../../Services/dc-cdmomapping.service';
import { TableUtil } from '../../util/TableUtil';

@Component({
  selector: 'app-dc-cdmomappingview',
  templateUrl: './dc-cdmomappingview.component.html',
  styleUrls: ['./dc-cdmomappingview.component.scss']
})
export class DcCdmomappingviewComponent implements OnInit {
  dcUserId:any='';
  dcList:any=[];
  user:any;
  keyword: any = 'fullName';
  listOfDcData:any=[];
  showPegi:any=false;
  pageElement:any;
  currentPage:any;
  count:any=0;
  txtsearchDate:any;
  taggedcdmo:any=[];
  tagginglog:any=[];
  header:any="DC";
  dcUserName:any="All";
  group:any="";


  constructor(private dcService: DcCdmomappingService,
    private sessionService: SessionStorageService,
    public headerService: HeaderService,
    private route:Router) { }

  ngOnInit(): void {
    this.headerService.setTitle('DC CDMO Mapping');
    this.user =  this.sessionService.decryptSessionData("user");
    // this.getuserDetailsbygroup(6);
    this.getdccdmomapcount();
  }

  getuserDetailsbygroup(groupid:any) {
    this.dcService.getuserDetailsbygroup(groupid).subscribe(
      (response:any) => {
        this.dcList = response.data;
      },
      (error) => console.log(error)
    )
  }

  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }

  getdccdmomapcount(){
    this.dcService.getdccdmomapcount(this.dcUserId,this.group).subscribe(
      (response:any) => {
        if(response.status==200){
          this.listOfDcData = response.data;
          this.count=this.listOfDcData.length;
          if(this.count>0){
            this.showPegi=true;
            this.currentPage=1;
            this.pageElement=100;
          }else{
            this.showPegi=false;
          }
        }else{
          this.swal("Error", "Something Went Wrong", 'error');
        }
      },
      (error) => console.log(error)
    );
  }

  swal(title, text, icon) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  selectEvent(item) {
    this.dcUserId = item.userId;
    this.dcUserName = item.fullName;
  }

  clearEvent() {
    this.dcUserId = '';
    this.dcUserName = 'All';
    this.getdccdmomapcount();
  }

  edit(dcid:any){
    let navigationExtras: NavigationExtras = {
      state: {
        user: dcid.dcuserid,
        groupid: dcid.groupid,
      },
    };
    this.route.navigate(['application/dccdmomapping'], navigationExtras);
  }

  taggeddetails(item:any){
    this.dcService.getdccdmomaplist(item.dcuserid,this.group).subscribe(
      (response:any) => {
        if(response.status==200){
          this.header=item.dcname;
          this.taggedcdmo=response.data;
        }else{
          this.swal("Error", "Something Went Wrong", 'error');
        }
      },
      (error) => console.log(error)
    );
  }

  taggedlogdetails(item:any){
    this.dcService.taggedlogdetails(item.dcuserid).subscribe(
      (response:any) => {
        if(response.status==200){
          this.header=item.dcname;
          this.tagginglog=response.data;
        }else{
          this.swal("Error", "Something Went Wrong", 'error');
        }
      },
      (error) => console.log(error)
    );
  }

  report: any = [];
  sno: any = [];
  heading = [['Sl#', 'DC/ADC Name','DC/ADC UserName','Dc/ADC MobileNo','Grouptype Name' ,'CDMO Name','Working State','Working District','Tagged By', 'Tagged On']];
  downloadList(no:any){
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy =  this.user.fullName;
    this.report = [];
    let sna: any;

    this.dcService.getdccdmomaplist(this.dcUserId,this.group).subscribe(
      (response:any) => {
        if(response.status==200){
          let list=response.data;
    // let list=this.listOfDcData;
              for (let i = 0; i < list.length; i++) {
                sna = list[i];
                this.sno = [];
                this.sno.push(i + 1);
                this.sno.push(sna.dcname);
                this.sno.push(sna.username);
                this.sno.push(sna.phoneno);
                this.sno.push(sna.groupname);
                this.sno.push(sna.cdmoname);
                this.sno.push(sna.state);
                this.sno.push(sna.district);
                this.sno.push(sna.createdby);
                this.sno.push(sna.createdon);
                this.report.push(this.sno);
              }

              if (no == 1) {
                let filter = [];
                TableUtil.exportListToExcelWithFilter(
                  this.report,
                  'DC/ADC CDMO Mapping Report',
                  this.heading, filter
                );
              }else {
                if (this.report == null || this.report.length == 0) {
                  this.swal("Info", "No Record Found", "info");
                  return;
                }
                var doc = new jsPDF('l', 'mm', [297, 210]);
                doc.setFontSize(20);
                doc.text("DC/ADC CDMO Mapping Report", 100, 15);
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
                doc.save('DC/ADC_CDMO_Mapping_Report.pdf');
              }
        }else{
          this.swal("Error", "Something Went Wrong", 'error');
        }
      },
      (error) => console.log(error)
    );
  }

}
