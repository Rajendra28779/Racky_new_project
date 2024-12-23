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
  selector: 'app-dc-hospitalmappingview',
  templateUrl: './dc-hospitalmappingview.component.html',
  styleUrls: ['./dc-hospitalmappingview.component.scss']
})
export class DcHospitalmappingviewComponent implements OnInit {
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
  group:any="";


  constructor(private dcService: DcCdmomappingService,
    private sessionService: SessionStorageService,
    public headerService: HeaderService,
    private route:Router) { }

  ngOnInit(): void {
    this.headerService.setTitle('DC Referral Hospital Mapping');
    this.user =  this.sessionService.decryptSessionData("user");
    // this.getuserDetailsbygroup(6);
    this.getdcgovyhospmapcount();
  }

  getuserDetailsbygroup(groupid:any) {
    this.dcService.getuserDetailsbygroup(groupid).subscribe(
      (response:any) => {
        this.dcList = response.data;
      },
      (error) => console.log(error)
    )
  }

  getdcgovyhospmapcount(){
    this.dcService.getdcgovthospmapcount(this.dcUserId,this.group).subscribe(
      (response:any) => {
        if(response.status==200){
          this.listOfDcData = response.data;
          this.count=this.listOfDcData.length;
          if(this.count>0){
            this.showPegi=true;
            this.currentPage=1;
            this.pageElement=50;
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
  }

  clearEvent() {
    this.dcUserId = '';
    this.getdcgovyhospmapcount();
  }

  edit(dcid:any){
    let navigationExtras: NavigationExtras = {
      state: {
        user: dcid.dcuserid,
        groupid: dcid.grouptype,
      },
    };
    this.route.navigate(['application/dcgovthospitalmapping'], navigationExtras);
  }

  taggeddetails(item:any){
    this.dcService.getmappedgovthospbydcid(item.dcuserid,"").subscribe(
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

  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }

  taggedlogdetails(item:any){
    this.dcService.taggedHOSDClogdetails(item.dcuserid).subscribe(
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
  heading = [['Sl#', 'DC/ADC Name','DC/ADC UserName','Dc/ADC MobileNo','Grouptype Name', 'State Name', 'District Name', 'Hospital Name', 'Tagged By', 'Tagged On']];
  downloadList(no:any){
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy =  this.user.fullName;
    this.report = [];
    let sna: any;
    this.dcService.getmappedgovthospbydcid(this.dcUserId,this.group).subscribe(
      (response:any) => {
        if(response.status==200){
          let list=response.data;
              for (let i = 0; i < list.length; i++) {
                sna = list[i];
                this.sno = [];
                this.sno.push(i + 1);
                this.sno.push(sna.dcname);
                this.sno.push(sna.username);
                this.sno.push(sna.phoneno);
                this.sno.push(sna.grouptypename);
                this.sno.push(sna.statename);
                this.sno.push(sna.distname);
                this.sno.push(sna.hospitalname);
                this.sno.push(sna.createdby);
                this.sno.push(sna.createdon);
                this.report.push(this.sno);
              }

              if (no == 1) {
                let filter = [];
                TableUtil.exportListToExcelWithFilter(
                  this.report,
                  'DC/ADC Hospital Mapping Report',
                  this.heading, filter
                );
              }else {
                if (this.report == null || this.report.length == 0) {
                  this.swal("Info", "No Record Found", "info");
                  return;
                }
                let doc = new jsPDF('l', 'mm', [297, 210]);
                doc.setFontSize(20);
                doc.text("DC/ADC Hospital Mapping Report", 100, 15);
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
                doc.save('DC/ADC_Hospital_Mapping_Report.pdf');
              }
        }else{
          this.swal("Error", "Something Went Wrong", 'error');
        }
      },
      (error) => console.log(error)
    );
  }

}
