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
declare let $: any;


@Component({
  selector: 'app-usermobiletracking-config',
  templateUrl: './usermobiletracking-config.component.html',
  styleUrls: ['./usermobiletracking-config.component.scss']
})
export class UsermobiletrackingConfigComponent implements OnInit {
  userlist:any=[];
  user: any
  txtsearchDate: any;
  showPegi: boolean;
  currentPage: any;
  pageElement: any;
  totalcount: any = 0;
  checkAllBox:any;
  hoursarr:any=["06", "07", "08", "09", "10", "11", "12", "01", "02", "03", "04", "05"];
  minarr:any=["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];

  constructor(private dcService: DcCdmomappingService,
    private sessionService: SessionStorageService,
    public headerService: HeaderService,private snoService: SnocreateserviceService,
    private route:Router) { }

  ngOnInit(): void {
    this.headerService.setTitle('User Mobile tracking Configuration');
    this.user =  this.sessionService.decryptSessionData("user");

    let date = new Date();
    let today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    $('.selectpicker').selectpicker();
    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
      minDate: today,
      daysOfWeekDisabled: ['', 7],
    });
    $('.timepicker').datetimepicker({
      format: 'LT',
      // minDate: moment(), // Set minimum selectable date to current date
      daysOfWeekDisabled: ['', 7],
    });
  }

  getuserDetailsbygroup(groupid:any) {
    this.userobjlist=[];
    this.dcService.getusermobiletrackingconfiglist(groupid).subscribe(
      (response:any) => {
        if(response.status==200){
          this.userlist = response.data;
          this.checkAllBox=response.allcheck;
          this.currentPage=1;
          this.pageElement=50;
          this.showPegi=true;
          this.totalcount=this.userlist.length;
        }else{
          this.swal("Error","Something went Wrong","error");
        }
      },
      (error) => console.log(error)
    )
  }

  swal(title, text, icon) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  userobj:any;
  userobjlist:any=[];
  showsubmitbutton:any=false;
  selectitem(item:any,no:any){
    this.userobj = {
      userId: item.userId,
      trackStatus:item.trackstattus==0?1:0,
      endtime:"",
      createdBy:this.user.userId
    }
    var stat: boolean = false;
    for (const i of this.userobjlist) {
      if (i.userId == this.userobj.userId) {
        i.trackStatus=item.trackstattus==0?1:0
        stat = true;
      }
    }
    for(const element of this.userlist){
      if(element.userId==item.userId){
        element.trackstattus=item.trackstattus==0?1:0;
      }
    }
    if (stat == false) {
      let hour=$('#hour'+no).val().toString().trim();
      let minite=$('#minite'+no).val().toString().trim();
      let stat=$('#stat'+no).val().toString().trim();
      let endtime=hour+':'+minite+" "+stat;
      this.userobj.endtime=endtime;
      this.userobjlist.push(this.userobj);
    }

    if(this.userobjlist.length>=0){
      this.showsubmitbutton=true;
    }else{
      this.showsubmitbutton=false;
    }
  }

  allselectitem(){
    this.userobjlist=[];
    this.checkAllBox=!this.checkAllBox;
    let status=this.checkAllBox?0:1;
    let i=1;
    for(const element of this.userlist){
      if(element.trackstattus!=status){
        this.selectitem(element,i++);
        element.trackstattus=status;
      }
    }
  }

  selecttime(item:any,no:any){
    let hour=$('#hour'+no).val().toString().trim();
    let minite=$('#minite'+no).val().toString().trim();
    let stat=$('#stat'+no).val().toString().trim();
    let endtime=hour+':'+minite+" "+stat;
    let flag: boolean = false;
    for (var i = 0; i < this.userobjlist.length; i++) {
      if (item.userId == this.userobjlist[i].userId) {
        this.userobjlist[i].endtime=endtime;
        flag=true;
      }
    }
    for(const element of this.userlist){
      if(element.userId==item.userId){
        element.trackstattus=0;
      }
    }
    if(!flag){
      this.userobj = {
        userId: item.userId,
        trackStatus:item.trackstattus,
        endtime:endtime,
        createdBy:this.user.userId
      }
      this.userobjlist.push(this.userobj);
    }

    if(this.userobjlist.length>=0){
      this.showsubmitbutton=true;
    }else{
      this.showsubmitbutton=false;
    }
  }

  Submit(){
    console.log(this.userobjlist);
    if(this.userobjlist.length==0){
      this.swal("Error","Please select user to allow tracking","error");
      return;
    }
    Swal.fire({
      title: 'Are You Sure?',
      text: "",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Allow It!'
    }).then((result) => {
      if (result.isConfirmed) {
        let object={
          'trackconfiglist': this.userobjlist
        }
        this.dcService.savetrackingconfiglist(object).subscribe(
          (response:any) => {
            if(response.status == 200){
              this.swal("Success","Success","success");
              this.userobjlist=[];
              let group=$('#group').val();
              this.getuserDetailsbygroup(group);
              this.showsubmitbutton=false;
            }else{
              this.swal("Error","Something Went Wrong","error");
            }
          },
          (error) => console.log(error)
        )
      }
    });
  }

  loglist:any;
  loguser:any;
  logdata(item:any){
    this.loguser=item;

    this.dcService.getusermobiletrackingconfigloglist(this.loguser.userId).subscribe(
      (response:any) => {
        if(response.status==200){
          this.loglist = response.data;
        }else{
          this.swal("Error","Something went Wrong","error");
        }
      },
      (error) => console.log(error)
    )
  }

  heading:any=[];
  report:any=[];
  downloadList(no:any){
    this.heading = [
      [
          'Sl No',
          'Full Name',
          'Mobile No',
          'Allow For Tracking',
          'Tracking End Time'
      ]
  ];
    this.report=[];
      let group=$('#group').val();
      for (let i = 0; i < this.userlist.length; i++) {
        let item = this.userlist[i];
        let row = [];
        row.push(i + 1); // Sl No
        row.push(item.fullName); // Latitude
        row.push(item.phone); // Longitude
        row.push(item.checkstattus==0?"Yes":"No"); // Status
        row.push(item.endtime); // GeoTag Status
        this.report.push(row);
    }

      let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
      let generatedBy = this.user.fullName;

      let groupname:any="N/A";
      if(group==6)
        groupname="DC";
      else if(group==27)
        groupname="ADC";
      else if(group==22)
        groupname="CSM DC";
      else if(group==14)
        groupname="SwasthyaMitra";

      if (no == 1) {
        let filter = [[['Group Type:', groupname]]];
        TableUtil.exportListToExcelWithFilter(this.report, "User Mobile tracking Configuration", this.heading, filter);
    } else {
        // Generate PDF
        if (this.report == null || this.report.length == 0) {
            this.swal("Info", "No Record Found", "info");
            return;
        }
        let doc = new jsPDF('p', 'mm', [297, 210]); // A4 size
        doc.setFontSize(18);
        doc.text("User Mobile tracking Configuration", 70, 15);
        doc.setFontSize(12);
        doc.text('Group Type: ' + groupname, 14, 22);
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
        doc.save("User Mobile tracking Configuration"+'.pdf'); // Save the PDF
    }
  }
}
