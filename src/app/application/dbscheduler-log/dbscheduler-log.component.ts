import { Component, OnInit } from '@angular/core';
import { HeaderService } from './../header.service';
import { SchedularserviceService } from '../Services/schedularservice.service';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { TableUtil } from '../util/TableUtil';
import { formatDate } from '@angular/common';
import Swal from 'sweetalert2';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-dbscheduler-log',
  templateUrl: './dbscheduler-log.component.html',
  styleUrls: ['./dbscheduler-log.component.scss']
})
export class DbschedulerLogComponent implements OnInit {
  totalcount:any=0;
  txtsearchDate:any;
  showPegi:any=false;
  currentPage:any;
  pageElement:any;
  list:any=[];
  schedulerlist:any=[];
  user:any;
  scheduler:any;
  schedulername:any;
  showdata:any=false;

  constructor(public headerService: HeaderService,
    public schedularserv:SchedularserviceService,private sessionService: SessionStorageService
    ) { }

  ngOnInit(): void {
    this.headerService.setTitle('DB-Scheduler Configuration');
    this.user= this.sessionService.decryptSessionData("user");
    this.getschedulerlist();
  }

  getschedulerlist(){
    this.schedularserv.getallschedulerlist().subscribe((data:any)=>{
      this.schedulerlist=data;
    },
    (error) => console.log(error)
    );
  }

  search(){
  this.scheduler=$('#schedular').val();
  if(this.scheduler==null || this.scheduler==undefined || this.scheduler==""){
    this.swal("Info", "Please Select Scheduler Name", "info");
    return;
  }
  this.showdata=true;
  for(let i=0;i<this.schedulerlist.length;i++){
      if(this.scheduler==this.schedulerlist[i].id){
        this.schedulername=this.schedulerlist[i];
      }
    }
  this.schedularserv.getschedulerloglist(this.scheduler).subscribe((data:any)=>{
    this.list=data;
    this.totalcount=this.list.length;
    if(this.totalcount>0){
      this.showPegi=true
      this.currentPage=1
      this.pageElement=100
    }else{
      this.showPegi=true
    }
  },
  (error) => console.log(error)
  );
  }
  ResetField(){
    $('#schedular').val('');
    this.list=[];
    this.showPegi=false;
    this.showdata=false;

  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }


  report: any = [];
  sno: any = {
    Slno: "",
    scheduler: "",
    createby: "",
    createon: "",
    remark: "",
    status: "",
  };
  heading = [['Sl#','Scheduler Name','Updated By', 'Updated On','Remark','Status']];

  downloadList(no:any){
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy = this.user.fullName;
    this.report = [];
    let sna: any;
    for (var i = 0; i < this.list.length; i++) {
      sna=this.list[i];
      this.sno=[];
      this.sno.Slno=i+1;
      this.sno.scheduler=sna.schedulerName;
      this.sno.createby=sna.createdName;
      this.sno.createon=sna.createdOn;
      this.sno.remark=sna.remark;
      this.sno.status=sna.status;
      this.report.push(this.sno);
    }
    // this.schedulername:any;
    // for(let i=0;i<this.schedulerlist.length;i++){
    //   if(this.scheduler==this.schedulerlist[i].id){
    //     schedulername=this.schedulerlist[i];
    //   }
    // }
    if(no==1){
      let filter =[];
      filter.push([['Procedure Name', this.schedulername.procedurename]]);
      filter.push([['Scheduler Name', this.schedulername.schedularname]]);
      filter.push([['Current Status', this.schedulername.statusflag]]);
        TableUtil.exportListToExcelWithFilter(
          this.report,
          this.schedulername.schedularname+' Scheduler Log Details',
          this.heading,filter
        );
    }else{
      if(this.report==null || this.report.length==0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('l', 'mm',[297,210 ]);
      doc.setFontSize(20);
      doc.text("Scheduler Log Details", 100, 15);
      doc.setFontSize(12);
      doc.text('Procedure Name :- '+this.schedulername.procedurename,180,23);
      doc.text('Scheduler Name :- '+this.schedulername.schedularname,15,23);
      doc.text('Current Status :- '+this.schedulername.statusflag,15,31);
      doc.text('GeneratedOn :- '+generatedOn,180,39);
      doc.text('GeneratedBy :- '+generatedBy,15,39);
      doc.text('Log Details :- ',15,47);
            var rows = [];
            for(var i=0;i<this.report.length;i++) {
              var clm = this.report[i];
              var pdf = [];
              pdf[0] = clm.Slno;
              pdf[1] = clm.scheduler;
              pdf[2] = clm.createby;
              pdf[3] = clm.createon;
              pdf[4] = clm.remark;
              pdf[5] = clm.status;
              rows.push(pdf);
            }
            autoTable(doc, {
              head: this.heading,
              body: rows,
              theme: 'grid',
              startY: 52,
              headStyles: {
                fillColor: [26, 99, 54]
              },
              columnStyles: {
                0: {cellWidth: 10},
              }
            });
            doc.save(this.schedulername.schedularname+'_Scheduler_Log_Details.pdf');
    }
  }


}
