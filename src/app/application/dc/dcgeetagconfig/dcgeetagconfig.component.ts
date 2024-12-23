import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { DcCdmomappingService } from '../../Services/dc-cdmomapping.service';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import { TableUtil } from '../../util/TableUtil';

@Component({
  selector: 'app-dcgeetagconfig',
  templateUrl: './dcgeetagconfig.component.html',
  styleUrls: ['./dcgeetagconfig.component.scss']
})
export class DcgeetagconfigComponent implements OnInit {
  dcUserId:any='';
  dcList:any=[];
  user:any;
  keyword: any = 'fullName';
  dc:any
  showdc:any=false;
  dcid:any;
  group:any="";
  hosplist: any=[];
  cdmolist: any=[];
  refhosplist: any=[];
  loglist:any=[];

  constructor(private dcService: DcCdmomappingService,
    private sessionService: SessionStorageService,
    public headerService: HeaderService,private snoService: SnocreateserviceService,
    private route:Router) {
      this.dcid = this.route.getCurrentNavigation().extras.state;
     }

  ngOnInit(): void {
    this.headerService.setTitle('Allow Dc For Geo Tagging');
    this.user =  this.sessionService.decryptSessionData("user");
  }

  getuserDetailsbygroup(groupid:any) {
    this.dcService.getuserDetailsbygroup(groupid).subscribe(
      (response:any) => {
        this.dcList = response.data;
      },
      (error) => console.log(error)
    )
  }
  selectEvent(item) {
    this.dcUserId = item.userId;
    this.dc=item;
    this.showdc=true;
    this.details(this.dcUserId);
  }

  clearEvent() {
    this.dcUserId = '';
    this.showdc=false;
  }
  onReset(){
    window.location.reload();
  }
  swal(title, text, icon) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  details(item:any){
    this.dcService.getdctaggeddetails(item).subscribe((data:any)=>{
      if(data.status==200){
        this.hosplist=data.hosplist;
        this.cdmolist=data.cdmolist;
        this.refhosplist=data.refhosplist;
      }else{
        this.swal("Error", "Something Went Wrong", 'error');
      }
    });
  }

  downLoaddcuploadDoc(event:any,docpath:any,action:any){
    if (docpath != null && docpath != '' && docpath != undefined) {
      let img = this.dcService.downLoaddcuploadDoc(docpath,action);
      window.open(img, '_blank');
    } else {
      this.swal('Info', 'There Is No File', 'info');
    }
  }

  downLoaddcuploadDoclog(event:any,docpath:any){
    let action="no";
    if(this.action == 1){action='CDMO';}else{action='REFH';}
    this.downLoaddcuploadDoc(event,docpath,action);
  }

  tagged:any="";
  action:any;
  log(item:any){
    this.tagged=item.fullname;
    this.action=1;
    this.dcService.getdccdmologdata(this.dcUserId,item.userId,this.action).subscribe(
      (response:any) => {
        this.loglist = response.data;
      },
      (error) => console.log(error)
    )
  }

  log1(item:any){
    this.tagged=item.hospitalName;
    this.action=2;
    this.dcService.getdccdmologdata(this.dcUserId,item.userId,this.action).subscribe(
      (response:any) => {
        this.loglist = response.data;
      },
      (error) => console.log(error)
    )
  }

  onaction(userid:any,action:any){
    Swal.fire({
      title: 'Are You Sure?',
      text: "You Want to Allow This User To Geo Tag Again !",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Allow It!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.dcService.allowforregeotag(this.dcUserId,userid,action,this.user.userId).subscribe(
          (response:any) => {
            if(response.status == 200){
              if(action == 1){
                this.swal("Success","Successfully Allowed For CDMO Geo Tagging","success");
              }else if(action == 1){
                this.swal("Success","Successfully Allowed For Referral Hospital Geo Tagging","success");
              }else {
                this.swal("Success","Successfully Allowed For Geo Tagging","success");
              }
              this.details(this.dcUserId);
            }else{
              this.swal("Error","Something Went Wrong","error");
            }
          },
          (error) => console.log(error)
        )
      }
    });
  }
  report:any=[];
  heading:any=[];

  downloadCdmo(no:any){
    this.heading = [
      [
          'Sl No',
          'CDMO Name',
          'Mobile No',
          'Latitude',
          'Longitude'
      ]
  ];

  this.report = []; // Initialize report data

  // Populate rows
  for (let i = 0; i < this.cdmolist.length; i++) {
      let item = this.cdmolist[i];
      let row = [];

      row.push(i + 1); // Sl No
      row.push(item.fullname); // CDMO Name
      row.push(item.mobileno); // Mobile No
      row.push(item.lattitude); // Latitude
      row.push(item.longitude); // Longitude

      this.report.push(row);
  }
  this.download(no,"DC Tagged CDMO Details");
  }

  downloadREFH(no:any){
    this.heading = [
      [
          'Sl No',
          'State Name',
          'District Name',
          'Hospital Name',
          'Latitude',
          'Longitude'
      ]
  ];

  this.report = []; // Initialize report data

  // Populate rows
    for (let i = 0; i < this.refhosplist.length; i++) {
        let item = this.refhosplist[i];
        let row = [];
        row.push(i + 1); // Sl No
        row.push(item.state); // State Name
        row.push(item.district); // District Name
        row.push(item.hospitalName); // Hospital Name
        row.push(item.lattitude); // Latitude
        row.push(item.longitude); // Longitude
        this.report.push(row);
    }
    this.download(no,"DC Tagged Referral Hospital Details");
  }

  downloadLog(no:any){
    this.heading = [
      [
          'Sl No',
          'Latitude',
          'Longitude',
          'Status',
          'GeoTag Status',
          'Updated By',
          'Updated On'
      ]
  ];

  this.report = []; // Initialize report data

  // Populate rows
  for (let i = 0; i < this.loglist.length; i++) {
      let item = this.loglist[i];
      let row = [];

      row.push(i + 1); // Sl No
      row.push(item.lattitude); // Latitude
      row.push(item.longitude); // Longitude
      row.push(item.status); // Status
      row.push(item.geotagstatus); // GeoTag Status
      row.push(item.updatedby); // Updated By
      row.push(item.updatedon); // Updated On

      this.report.push(row);
  }
    this.download(no,"DC Geo tagging Log Details");
  }

  download(no:any,name:any){
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy = this.user.fullName;

    if (no == 1) {
      let filter = [[['DC Name:', this.dc?.fullName]]];
      TableUtil.exportListToExcelWithFilter(this.report, name, this.heading, filter);
  } else {
      // Generate PDF
      if (this.report == null || this.report.length == 0) {
          this.swal("Info", "No Record Found", "info");
          return;
      }

      let doc = new jsPDF('p', 'mm', [297, 210]); // A4 size
      doc.setFontSize(18);
      doc.text(name, 70, 15);
      doc.setFontSize(12);
      doc.text('DC name: ' + this.dc?.fullName, 14, 22);
      doc.text('Generated By: ' + generatedBy, 14, 29);
      doc.text('Generated On: ' + generatedOn, 14, 36);

      // Use autoTable to generate the table
      autoTable(doc, {
          head: this.heading,
          body: this.report,
          theme: 'grid',
          startY: 40,
          headStyles: { fillColor: [31, 114, 63] },
          columnStyles: {
              0: { cellWidth: 10 }, // Example column width customization
          }
      });

      doc.save(name+'.pdf'); // Save the PDF
  }
  }

}
