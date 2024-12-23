import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { SurverconfurationService } from '../../Services/surverconfuration.service';
import { TableUtil } from '../../util/TableUtil';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-surveygoupmappingview',
  templateUrl: './surveygoupmappingview.component.html',
  styleUrls: ['./surveygoupmappingview.component.scss']
})
export class SurveygoupmappingviewComponent implements OnInit {
  childmessage: any;
  txtsearchDate:any;
  showPegi:any;
  pageElement:any;
  currentPage:any;
  list:any=[];
  user: any;
  countgllist: any;
  keyword: any = 'surveyName';
  surveyid:any="";
  surveylist:any=[];

  constructor(private route:Router,public headerService:HeaderService,private surveyserv:SurverconfurationService, private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle('Survey Group Mapping');
    this.user =this.sessionService.decryptSessionData("user");
    this.getactivesurveylist();
    this.getallmappinglist();
  }

  getactivesurveylist(){
    this.surveyserv.getactivesurveylist(0).subscribe((data:any) => {
      if(data.status==200){
        this.surveylist=data.data;
      }else{
        this.surveylist=[];
        this.swal("Error", "Something Went Wrong", "error");
      }
    });
  }

  selectEvent(item) {
    this.surveyid = item.surveyId;
  }
  onReset() {
    this.surveyid = "";
  }

  getallmappinglist(){
    this.surveyserv.getallsurveygroupmappinglist(this.surveyid).subscribe((data:any)=>{
      console.log(data);
      if(data.status==200){
        this.list=data.data;
        this.countgllist=this.list.length
        if(this.countgllist>0){
          this.currentPage = 1;
          this.pageElement = 50;
          this.showPegi=true;
        }else{
          this.showPegi=false;
        }
      }else{
        this.showPegi=false;
        this.swal("Error","Something went wrong","error");
      }
    });
  }

  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  report: any = [];
  sno: any = [];
  heading = [['Sl#', 'Survey Name','Group Name','Created By', 'Created On']];
  downloadList(no:any){
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy = this.user.fullName;
    this.report = [];
    let sna: any;
    for (var i = 0; i < this.list.length; i++) {
      sna=this.list[i];
      this.sno=[];
      this.sno.push(i+1);
      this.sno.push(sna.surveyName);
      this.sno.push(sna.groupName);
      this.sno.push(sna.createdBy);
      this.sno.push(sna.createdOn);
      this.report.push(this.sno);
    }

    let surveyname="All";
    for(let i=0;i<this.surveylist.length;i++){
      if(this.surveylist[i].surveyId==this.surveyid){
        surveyname=this.surveylist[i].surveyName;
      }
    }

    if(no==1){
      let filter =[];
      filter.push([['SurveyName', surveyname]]);
        TableUtil.exportListToExcelWithFilter(
          this.report,
          'Survey Group Mapping List',
          this.heading,filter
        );
    }else{
      if(this.report==null || this.report.length==0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('p', 'mm',[297,210 ]);
      doc.setFontSize(20);
      doc.text("Survey Group Mapping List", 80, 15);
      doc.setFontSize(13);
      doc.text('SurveyName :- '+surveyname,15,25);
      doc.text('GeneratedOn :- '+generatedOn,15,33);
      doc.text('GeneratedBy :- '+generatedBy,15,41);
            autoTable(doc, {
              head: this.heading,
              body: this.report,
              theme: 'grid',
              startY: 46,
              headStyles: {
                fillColor: [26, 99, 54]
              },
              columnStyles: {
                0: {cellWidth: 10},
              }
            });
            doc.save('Survey_Group_Mapping_List.pdf');
    }
  }
}

