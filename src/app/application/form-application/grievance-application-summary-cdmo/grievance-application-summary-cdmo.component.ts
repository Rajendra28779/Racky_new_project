import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { TableUtil } from '../../util/TableUtil';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonconfigService } from 'src/app/services/form-services/commonconfig.service';
import { EncrypyDecrpyService } from 'src/app/services/form-services/encrypy-decrpy.service';
import { ViewAppListService } from 'src/app/services/form-services/view-app-list.service';
import { SnoCLaimDetailsService } from '../../Services/sno-claim-details.service';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;
@Component({
  selector: 'app-grievance-application-summary-cdmo',
  templateUrl: './grievance-application-summary-cdmo.component.html',
  styleUrls: ['./grievance-application-summary-cdmo.component.scss']
})
export class GrievanceApplicationSummaryCDMOComponent implements OnInit {
  public loading = false;
  title: any;
  tablist: any;
  tabDataId: any;
  utillist: any;
  messaageslist: any;
  jsonurl = 'assets/js/_configs/pendingApplicationsGrievanceCDMOView.config';
  jsonurlView ='assets/js/_configs/pendingApplicationsGrievanceCDMOView.config.json';
  formsList: any;
  isFlag = true;
  POSTS: any;
  page: number = 1;
  count: number = 0;
  tableSize: number = 10;
  pageSizes = [10, 20, 50, 100, 500, 1000];
  formNames: any;
  txtFormName: any;
  selModuleName: any = 0;
  moduleNames: any;
  dataResult: any;
  dataCols: any;
  sessiontoken: any;
  userRole = 0;
  formID: any;
  record: any;
  currentPage:any=1;
  pageElement:any=10;
  tempurl=environment.grievancePreviewUrl;
  elementTo:number=this.pageElement;
  showPegi?:boolean;
  recordList:any;
  report: any;
  userId: any;
  request: any;
  url:string;
  param: { itemId: any; pendingAt: number; pageType: string; profileId: number; serviceId: number;
    mode :any,formDate:any,toDate:any
  };
  searchList: any;
  statelist: Array<any> = [];
  stateCode: any;
  distList: any;
  caseStatus: string;
  formdat: string;
  todat: string;
  pageIn: number;
  pageEnd: number;
  selectedIndex: number;
  constructor(
    private route: Router,
    private httpClient: HttpClient,
    private router: ActivatedRoute,
    private commonService: CommonconfigService,
    private encDec: EncrypyDecrpyService,
    private appListService: ViewAppListService,
    public snoService: SnoCLaimDetailsService,
    private sessionService: SessionStorageService
  ) {}

  ngOnInit(): void {
    this.url=location.href
    if( this.url.includes('bskycms.odisha.gov.in')){   //Prod
      console.log("Prod true");
      this.tempurl='https://bskygrievance.odisha.gov.in/#/website/formPreview/';
    }
    if( this.url.includes('localhost')){
        console.log("true");
        this.tempurl='http://localhost:4200/#/website/formPreview/';
    }
    if( this.url.includes('192.168.10.76')){
      console.log("Testing true");
      this.tempurl='http://192.168.10.76/bsky_grv_testI/#/website/formPreview/';
  }
  if( this.url.includes('bskystg.csmpl.com')){  
    console.log("Staging true");
    this.tempurl='http://bskystg.csmpl.com/bsky_grv_AI/#/website/formPreview/';
}
this.currentPage = 1;
this.pageElement = 10;
this.selectedIndex = 1;


$('.selectpicker').selectpicker();
  
$('.datepicker').datetimepicker({
  format: 'DD-MMM-YYYY',
  // endDate: '0d',
  maxDate: new Date(),
  daysOfWeekDisabled: ['', 7],
});
$('.timepicker').datetimepicker({
  format: 'LT',
  daysOfWeekDisabled: ['', 7],
});
$('.datetimepicker').datetimepicker({
  format: 'DD-MM-YYYY LT',
  daysOfWeekDisabled: ['', 7],
});
let date = new Date();

let year = date.getFullYear();
let date1 = '01';
let month: any = date.getMonth() - 1;
if (month == -1) {
  month = 11;
  year = year - 1;
}
if (month == 0) {
  month = 'Jan';
} else if (month == 1) {
  month = 'Feb';
} else if (month == 2) {
  month = 'Mar';
} else if (month == 3) {
  month = 'Apr';
} else if (month == 4) {
  month = 'May';
} else if (month == 5) {
  month = 'Jun';
} else if (month == 6) {
  month = 'Jul';
} else if (month == 7) {
  month = 'Aug';
} else if (month == 8) {
  month = 'Sep';
} else if (month == 9) {
  month = 'Oct';
} else if (month == 10) {
  month = 'Nov';
} else if (month == 11) {
  month = 'Dec';
}
let frstDay = date1 + '-' + month + '-' + year;
$('input[name="fromDate"]').val(frstDay);
$('input[name="fromDate"]').attr('placeholder', 'From Date *');

$('input[name="toDate"]').attr('placeholder', 'To Date *');

   
    let SeetionParsed = this.sessionService.decryptSessionData("user");
    this.userRole = SeetionParsed.groupId ;
    this.userId = SeetionParsed.userId;
    this.getUserDetails(this.request);
    this.loadconfigOfficer();
    let encSchemeId = this.router.snapshot.paramMap.get('id');
    let action_Id: any = this.sessionService.decryptSessionData("ACTION_PROCESS_ID");
    if (encSchemeId != '') {
      this.tabDataId = encSchemeId;
      this.formID = this.encDec.decText(encSchemeId);
      this.sessionService.encryptSessionData("ACTION_PROCESS_ID", this.formID);
    } 
    else if (action_Id > 0) {
      this.formID = action_Id;
    }
    this.searchData();
  }
  loadconfig() {
    this.httpClient.get<any>(this.jsonurl).subscribe((data: any) => {
      this.tablist = data[0].tabList;
      let encSchemeId = this.router.snapshot.paramMap.get('id');
      if (encSchemeId != '') {
        this.tablist = this.tablist.map((v: any) =>
          Object.assign(v, { id: encSchemeId })
        );
      }
      this.utillist = data[0].utils;
      this.messaageslist = data[0].messages;
      this.title = this.multilingual(data[0].pagetitle);
      if(this.userRole == 13){
        this.tablist.splice(-1)
      }
    });
  }
  loadconfigOfficer() {
    this.httpClient.get<any>(this.jsonurlView).subscribe((data: any) => {
      this.tablist = data[0].tabList;
      let encSchemeId = this.router.snapshot.paramMap.get('id');
      if (encSchemeId != '') {
        this.tablist = this.tablist.map((v: any) =>
          Object.assign(v, { id: encSchemeId })
        );
      }
      this.utillist = data[0].utils;
      this.messaageslist = data[0].messages;
      this.title = this.multilingual(data[0].pagetitle);
      if(this.userRole == 13){
        this.tablist.splice(-1)
      }
    });
  }
  multilingual(test: any) {
    return test;
  }
  
  pageChange(current: any) {
    this.currentPage = current;
    let total = this.currentPage * this.pageElement;
    let istotal = this.compare(total, this.recordList);
    if (istotal) {
      this.elementTo = total;
    }
    else {
      this.elementTo = this.recordList;
    }
  }
  compare(first: number, second: number) {
    if (first > second) {
      console.log(first);
      return false;
    }
    else {
      console.log(second);

      return true;
    }
  }
  onTableDataChange(event: any) {
    this.page = event;
  }
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
  }

  getAppStatus(rows: any) {
    return this.appListService.getStatus(rows);
  }
  getAppStatusForReport(rows: any) {
    return this.appListService.getStatusForReport(rows);
  }
  heading = [
    [
      'Sl#',
      'Grievance Number',
      'Contact No',
      'State',
      'District',
      'Grievance By',
      'Grievance Medium',
      'Action On',
      'Forwarded To'
    ],
  ];
  SNALISt: any = {
    slno: "",
    applicationNo:"",
    contactNo:"",
    state:"",
    district:"",
    grievanceBy: "",
    grievanceMedium: "",
    actionOn: "",
    forwardTo: ""
  };
  downloadReport() {
    this.report = [];
    let sna: any;
    for (let i = 0; i < this.listData.length; i++) {
      sna = this.listData[i];
      this.SNALISt = [];
      this.SNALISt.slno = i + 1;
      this.SNALISt.applicationNo=sna.APPLICATIONNO;
      this.SNALISt.contactNo=sna.CONTACTNO;
      this.SNALISt.state=sna.STATE;
      this.SNALISt.district=sna.DISTRICT;
      this.SNALISt.grievanceBy = sna.GRIEVANCE_BY_NAME;
      this.SNALISt.grievanceMedium = sna.GRIEVANCE_MEDIUM_NAME;
      this.SNALISt.actionOn = this.convertDate(sna.ACTIONON);
      this.SNALISt.forwardTo = sna.DCNAME;
      this.report.push(this.SNALISt);
    }
    let fromDate = $('#formdate').val().toString(); 
    let toDate = $('#todate').val().toString();
    let filter =[];
      filter.push([['From Date', fromDate]]);
      filter.push([['To Date', toDate]]);
    TableUtil.exportListToExcelWithFilter(this.report, 'Grievance_Summary_CDMO', this.heading, filter);
  }
  convertDate(date) {
    let datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy, h:mm:ss a');
    return date;
    }
  listData: any = [];
  
  getUserDetails(request: any){
     let groupType = this.userRole;
     let userName = this.userId;
     let request1 = {groupType,userName}; 
     this.appListService.sendUserDetails(request1).subscribe((data) => {
        console.log("req:" + JSON.stringify(request1))
     })
   }
resetData(){
  window.location.reload();
}
searchData(){
  let fromdate=$('#formdate').val().toString();
  let todate=$('#todate').val().toString();
  this.formdat=fromdate
  this.todat=todate
  let userid=this.userId
  if (fromdate == null || fromdate == "" || fromdate == undefined) {
    this.swal("Info", "Please Fill Form Date", 'info');
    return;
  }
  if (todate == null || todate == "" || todate == undefined) {
    this.swal("Info", "Please Fill To Date", 'info');
    return;
  }
  if (Date.parse(fromdate) > Date.parse(todate)) {
    this.swal('Warning', ' From Date should be less To Date', 'error');
    return;
  }
  this.appListService.getCDMOActionListData(userid,this.formdat,this.todat).subscribe((res:any) => {
    if (res.status == 'success') {
        let data=JSON.parse(res.details);
        this.listData = data.actionData;
        console.log(this.listData);
    this.record = this.listData.length;
    this.recordList=this.listData.length;
    if(this.recordList>0){
    this.showPegi=true
  }
  else if(this.recordList<=this.pageElement){
    this.elementTo =  this.recordList
    this.showPegi=true
  }
    else
      this.showPegi=false;
    }else if (res.status == 'Failed') {
      this.swal('Error', res.message, 'error');
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
pageItemChange() {
  this.pageElement = $("#pageItem").val();
  this.pageIn = 1;
  this.pageEnd = this.pageElement;
  this.selectedIndex = 1;
}

paginate(element) {
  this.selectedIndex = element.id;
  this.pageIn = element.init;
  this.pageEnd = element.end;
}

prev() {
  this.selectedIndex = this.selectedIndex - 1;
  this.pageIn = this.pageIn - this.pageElement;
  this.pageEnd = this.pageEnd - this.pageElement;
}

next() {
  this.selectedIndex = this.selectedIndex + 1;
  this.pageIn = +this.pageIn + +this.pageElement;
  this.pageEnd = +this.pageEnd + +this.pageElement;
}
downloadPdf() {
  let doc = new jsPDF('l', 'mm', [220, 175]);
  doc.setFontSize(12);
  let fromDate = $('#formdate').val().toString(); 
  let toDate = $('#todate').val().toString();
  doc.text('From Date:'+fromDate, 10, 10);
  doc.text('To Date:'+toDate, 140, 10);
  doc.text("Generated On: "+this.convertDate(new Date()), 10, 20);
  doc.text("Generated By: "+this.sessionService.decryptSessionData("user").fullName, 140, 20);
  doc.text("Grievance_Summary_CDMO", 80, 30);
  let col = this.heading;
  let rows = [];
  let claim: any;
  for(let i=0;i<this.listData.length;i++) {
    claim = this.listData[i];
    let temp = [i+1, claim.APPLICATIONNO, claim.CONTACTNO, claim.STATE,claim.DISTRICT, claim.GRIEVANCE_BY_NAME, 
    claim.GRIEVANCE_MEDIUM_NAME, this.convertDate(claim.ACTIONON),claim.DCNAME];
    rows.push(temp);
  }
  autoTable(doc, {
    head: col,
    body: rows,
    theme: 'grid',
    startY: 40,
    styles: {overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20},
    bodyStyles: {overflow: 'linebreak',cellWidth: 'wrap',lineWidth: 0.1, lineColor: 0, textColor: 20},
    headStyles: {overflow: 'linebreak',cellWidth: 'wrap',lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255],fillColor: [26, 99, 54]},
    columnStyles: {
      0: {cellWidth: 10},
      1: {cellWidth: 25},
      2: {cellWidth: 25},
      3: {cellWidth: 20},
      4: {cellWidth: 25},
      5: {cellWidth: 30},
      6: {cellWidth: 20},
      7: {cellWidth: 20},
      8: {cellWidth: 20},
    }
  });
  doc.save('Grievance_Summary_CDMO.pdf');
}
}
