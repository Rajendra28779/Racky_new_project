import { Component, OnInit } from '@angular/core';
import { TableUtil } from '../../util/TableUtil';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonconfigService } from 'src/app/services/form-services/commonconfig.service';
import { EncrypyDecrpyService } from 'src/app/services/form-services/encrypy-decrpy.service';
import { ViewAppListService } from 'src/app/services/form-services/view-app-list.service';
import { SnoCLaimDetailsService } from '../../Services/sno-claim-details.service';
import { HeaderService } from '../../header.service';
import { GrievanceByService } from '../../Services/grievance-by.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DatePipe } from '@angular/common';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;
@Component({
  selector: 'app-grievance-application-ceo',
  templateUrl: './grievance-application-ceo.component.html',
  styleUrls: ['./grievance-application-ceo.component.scss']
})
export class GrievanceApplicationCeoComponent implements OnInit {

  showSearch:boolean=false;
  sessiontoken: any;
  userRole = 0;
  userId: any;
  jsonurl = 'assets/js/_configs/pendingApplicationsForGrievance.config.json';
  jsonurlnew  = 'assets/js/_configs/pendingApplicationsGrievanceOfficer.config.json'
  jsonurlShas  = 'assets/js/_configs/pendingApplicationsSHAS.config.json'
  jsonurlCeo  = 'assets/js/_configs/pendingApplicationsGrievanceCEO.config.json'
  tablist: any;
  tabDataId: any;
  utillist: any;
  messaageslist: any;
  public loading = false;
  title: any;
  tempurl=environment.grievancePreviewUrl;
  request: any
  formID: any
  dataCols: any;
  dataResult: any = [];
  formsList: any;
  recordList: any;
  currentPage: any = 1;
  pageElement: any = 10;
  elementTo: number = this.pageElement;
  showPegi?: boolean;
  stateData: any = [];
  statelist: Array<any> = [];
  tabgrievance: any;
  report: any[];
  caseStatus: string;
  stateCode: any;
  distList: any=[];
  formdat: any;
  todat: any;
  page: number = 1;
  count: number = 0;
  tableSize: number = 10;
  pageSizes = [10, 20, 50, 100, 500, 1000];
  url:string
  param: { itemId: any; pendingAt: number; pageType: string; profileId: number; serviceId: number;
    mode :any,formDate:any,toDate:any,stateCode:any,distCode:any,hostCode:any,grievancebyId:any
  };
  record : any;
  distCode: any;
  hostList: any=[];
  packageData: any;

  constructor(private route: Router,
    private httpClient: HttpClient,
    private router: ActivatedRoute,
    private commonService: CommonconfigService,
    private encDec: EncrypyDecrpyService,
    private appListService: ViewAppListService,
    public snoService: SnoCLaimDetailsService, 
    public headerService: HeaderService,
    private grievancebyService:GrievanceByService,
    private sessionService: SessionStorageService
    ) { }

  ngOnInit(): void {
    debugger;
    console.log("CEO")
    this.url=location.href
    if( this.url.includes('bskycms.odisha.gov.in')){   //Prod
      console.log("Prod true");
      this.tempurl='https://bskygrievance.odisha.gov.in/#/website/formPreview/';;
    }
    if( this.url.includes('localhost')){
      console.log("true");
      this.tempurl='http://localhost:4200/#/website/formPreview/';
  }
  if( this.url.includes('192.168.10.46')){
    console.log("Testing true");
    this.tempurl='http://192.168.10.46/bsky_grv_testI/#/website/formPreview/';
}
if( this.url.includes('bskystg.csmpl.com')){  
  console.log("Staging true");
  this.tempurl='http://bskystg.csmpl.com/bsky_grv_AI/#/website/formPreview/';
}

    this.headerService.setTitle('View Pending Applications');
  //  console.log(this._location.href;
      console.log(location.href);
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

    this.getStateList();
    this.getGrievanceByDetails();

   
    let SeetionParsed = this.sessionService.decryptSessionData("user");

    this.userRole = SeetionParsed.groupId;
    this.userId = SeetionParsed.userId;
    this.getUserDetails(this.request);
    console.log("role id:" + this.userRole);
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
    if (this.elementTo < this.recordList) {
      this.elementTo = this.recordList;
    }
  }
  viewFormApplication(formId: any) {
    let encSchemeStr = this.encDec.encText(formId.toString());
    this.route.navigate([
      '/application/pending-grievance-application',
      encSchemeStr,
    ]);
  }
  getStateList() {
    this.snoService.getStateList().subscribe((data: any) => {
      this.stateData = data;
      this.stateData.sort((a, b) => a.stateName.localeCompare(b.stateName));
      for (const element of this.stateData) {
        if (element.stateCode == '21') {
          this.statelist.push(element);
        }
      }
      for (const element of this.stateData) {
        if (element.stateCode != '21') {
          this.statelist.push(element);
        }
      }
      console.log(this.statelist)
    })
  }
  getGrievanceByDetails(){
    this.grievancebyService.getlist().subscribe((allData) => {
      this.packageData = allData;
      console.log(this.packageData);
    
    })
  }
  OnChangeState(event) {
    this.stateCode = event.target.value;
    this.appListService.getDistByState(this.stateCode).subscribe((data) => {
      this.distList = data;
      this.distList.sort((a, b) => a.districtname.localeCompare(b.districtname));
      console.log(data)
    })
  }//OnChangeDistrict
  OnChangeDistrict(event) {
    this.distCode = event.target.value;
    this.appListService.getHostByDist(this.distCode,this.stateCode).subscribe((data) => {
    console.log(data);
      this.hostList = data;
      this.hostList.sort((a, b) => a.hospName.localeCompare(b.hospName));
      console.log(data)
    })
  }
  
  getUserDetails(request: any) {
    let groupType = this.userRole;
    let userName = this.userId;
    let request1 = { groupType, userName }
    this.appListService.sendUserDetails(request1).subscribe((data) => {
      console.log("req:" + JSON.stringify(request1))
    })
  }
  loadconfigOfficer() {
   
    this.httpClient.get<any>(this.jsonurlCeo).subscribe((data: any) => {
      this.tablist = data[0].tabList;
      this.tabgrievance=this.tablist[0];
      let encSchemeId = this.router.snapshot.paramMap.get('id');
      if (encSchemeId != '') {
        this.tablist = this.tablist.map((v: any) =>
          Object.assign(v, { id: encSchemeId })
        );
      }
      console.log("tablist:" + JSON.stringify(this.tablist))
      this.utillist = data[0].utils;
      this.messaageslist = data[0].messages;
      this.title = this.multilingual(data[0].pagetitle);
    });
  }
  loadconfigSHAS() {
    this.httpClient.get<any>(this.jsonurlnew).subscribe((data: any) => {
      this.tablist = data[0].tabList;
      this.tabgrievance=this.tablist[0];
      let encSchemeId = this.router.snapshot.paramMap.get('id');
      if (encSchemeId != '') {
        this.tablist = this.tablist.map((v: any) =>
          Object.assign(v, { id: encSchemeId })
        );
      }
      console.log("tablist:" + JSON.stringify(this.tablist))
      this.utillist = data[0].utils;
      this.messaageslist = data[0].messages;
      this.title = this.multilingual(data[0].pagetitle);
    });
  }
  loadconfig() {
    this.httpClient.get<any>(this.jsonurl).subscribe((data: any) => {
      this.tablist = data[0].tabList;
      this.tabgrievance=this.tablist[0];
      let encSchemeId = this.router.snapshot.paramMap.get('id');
      if (encSchemeId != '') {
        this.tablist = this.tablist.map((v: any) =>
          Object.assign(v, { id: encSchemeId })
        );
      }
      console.log("tablist:" + JSON.stringify(this.tablist))
      this.utillist = data[0].utils;
      this.messaageslist = data[0].messages;
      this.title = this.multilingual(data[0].pagetitle);
      if (this.userRole == 13) {
        this.tablist.splice(-1)
      }
    });
  }
  multilingual(test: any) {
    return test;
  }
pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
    if (this.recordList <= this.pageElement) {
      this.elementTo = this.recordList
    }
    else
      this.elementTo = this.pageElement;
  }
  resetData(){
    window.location.reload();
  }
  searchData(){
    let fromdate=$('#formdate').val().toString();
    let todate=$('#todate').val().toString();
    let stateCode = $("#statecode1").val();
    let distCode = $("#distcode1").val();
    let hostCode = $("#hostcode1").val();
    let grievancebyId = $("#grievancebyId").val();
    this.formdat=fromdate
    this.todat=todate
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
    this.param = { itemId: this.formID, pendingAt: this.userRole, pageType: 'pen', profileId:0,serviceId:0,
    mode : 'search',formDate:fromdate,toDate:todate,stateCode:stateCode,distCode: distCode,hostCode:hostCode,grievancebyId:grievancebyId
  };
    this.appListService.getApplicationList(this.param).subscribe((res) => {
      this.dataCols = res.result.cols;
      this.dataResult = res.result.dataRes;
      this.formsList = this.dataResult;
      for (let i in this.dataResult) {
        if (this.dataResult[i].INTSENTFROM == 12) {
          this.dataResult[i].INTSENTFROM = "CDMO";
        }
        else if (this.dataResult[i].INTSENTFROM == 13) {
          this.dataResult[i].INTSENTFROM = "SHAS";
        }
        else if (this.dataResult[i].INTSENTFROM == 6) {
          this.dataResult[i].INTSENTFROM = "DC";
        }
        
        else if (this.dataResult[i].INTSENTFROM == 99) {
          this.dataResult[i].INTSENTFROM = "Grievance Officer";
        }
        else if (this.dataResult[i].INTSENTFROM == 30) {
          this.dataResult[i].INTSENTFROM = "Deputy Grievance Officer";
        } 
        else if (this.dataResult[i].INTSENTFROM == 32) {
          this.dataResult[i].INTSENTFROM = "SHAS EXEC 2";
        }
        else
        this.dataResult[i].INTSENTFROM = this.dataResult[i].INTUPDATEDBY; //bibhu
      }
  
      this.record = this.formsList.length;
      this.recordList=this.formsList.length;
      if(this.recordList>0){
      this.showPegi=true
    }
    else if(this.recordList<=this.pageElement){
      this.elementTo =  this.recordList
      this.showPegi=true
    }
      else
        this.showPegi=false;
    });
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  getApplList(formID: any) {
    debugger;
    let param = { itemId: 583, pendingAt: this.userRole, pageType: 'pen', profileId: 0, serviceId: 0 };
    this.appListService.getApplicationList(param).subscribe((res) => {
      this.dataCols = res.result.cols;
      this.dataResult = res.result.dataRes;
      console.log("result:" + JSON.stringify(this.dataResult))
      this.formsList = this.dataResult;
      for (let i in this.dataResult) {
        if (this.dataResult[i].INTSENTFROM == 12) {
          this.dataResult[i].INTSENTFROM = "CDMO";
        }
        else if (this.dataResult[i].INTSENTFROM == 13) {
          this.dataResult[i].INTSENTFROM = "SHAS";
        }
        else if (this.dataResult[i].INTSENTFROM == 6) {
          this.dataResult[i].INTSENTFROM = "DC";
        }
        
        else if (this.dataResult[i].INTSENTFROM == 99) {
          this.dataResult[i].INTSENTFROM = "Grievance Officer";
        }
        else if (this.dataResult[i].INTSENTFROM == 30) {
          if(this.dataResult[i].GRIEVANCE_UPDATE){
            this.dataResult[i].INTSENTFROM= this.dataResult[i].GRIEVANCE_UPDATE;
          }
          else this.dataResult[i].INTSENTFROM = "Deputy Grievance Officer";
        } 
        else if (this.dataResult[i].INTSENTFROM == 32) {
          this.dataResult[i].INTSENTFROM = "SHAS EXEC 2";
        }
        else
          this.dataResult[i].INTSENTFROM = this.dataResult[i].INTUPDATEDBY; //bibhu
      }
      console.log(this.formsList);
      this.recordList = this.formsList.length;
      if (this.recordList > 0 || this.recordList > this.pageElement) {
        this.elementTo = this.recordList
        this.showPegi = true
      }
      else
        this.showPegi = false;
    });
  }
  getAppStatus(rows: any) {
    return this.appListService.getStatus(rows);
  }
  getAppStatusForReport(rows: any) {
    return this.appListService.getStatusForReport(rows);
  }
  notingDetails(formParms: any) {
    let encSchemeStr = this.encDec.encText(formParms.toString());
    this.route.navigate(['application/noting', encSchemeStr]);

  }
  goToTakeAction(intId: any, serviceId: any) {
    debugger;
    let encParam = this.encDec.encText(
      this.formID + ':' + serviceId + ':' + intId
    );
    this.route.navigateByUrl('application/grievance-take-action/' + encParam);
  }
  editDetails(formParms: any) {
  
    let encSchemeStr = this.encDec.encText(formParms.toString());
  const url = this.tempurl+encSchemeStr;
  window.open( url, '_blank');
  }
  heading = [
    [
      'Sl#',
      'Grievance Number',
      'Contact No',
      'District',
      'State',
      'Hospital Details',
      'Registered by ',
      'Applied Date ',
      'Last Action by',
      'Status'
    ],
  ];
  SNALISt: any = {
    slno: "",
    GrievanceNo:"",
    contactNo:"",
    state: "",
    district:"",
    hospital: "",
    registerBy: "",
    AppliedDate: "",
    lastActionBy: "",
    status:""
  };
  downloadReport() {
    this.report = [];
    let sna: any;
    for (let i = 0; i < this.dataResult.length; i++) {
      sna = this.dataResult[i];
      let status= this.getAppStatusForReport(sna);
      this.SNALISt = [];
      this.SNALISt.slno = i + 1;
      this.SNALISt.GrievanceNo=sna.VCHAPPLICATIONNO;
      this.SNALISt.contactNo=sna.CONTACT_NO;
      this.SNALISt.state = sna.STATECODE;
      this.SNALISt.district=sna.DISTRICTCODE;
      this.SNALISt.hospital = sna.HOSPITALDETAILS;
      this.SNALISt.registerBy = sna.INTUPDATEDBY;
      this.SNALISt.AppliedDate = sna.STMCREATEDON;
      this.SNALISt.lastActionBy= sna.INTSENTFROM;
      this.SNALISt.status=status;
      this.report.push(this.SNALISt);
    }
    console.log(this.param);
    let stateName = 'All', districtName = 'All', hospitalName = 'All',grievance_By='All';
    let fromDate = $('#formdate').val().toString(); 
    let toDate = $('#todate').val().toString();
    if(this.param!=undefined){
      fromDate=this.param.formDate;
      toDate=this.param.toDate;
    for(const element of this.statelist) {
      if(this.param.stateCode==element.stateCode) {
        stateName=element.stateName;
      }
    }
    for(const element of this.distList) {
      if(this.param.distCode==element.districtcode) {
        districtName=element.districtname;
      }
    }
    for(const element of this.hostList) {
      if(this.param.hostCode==element.hospitalCode) {
        hospitalName=element.hospName;
      }
    }
    grievance_By=this.getGrievanceBy(this.param.grievancebyId);
  }
      let filter =[];
      filter.push([['From Date', fromDate]]);
      filter.push([['To Date', toDate]]);
      filter.push([['State Name', stateName]]);
      filter.push([['District Name', districtName]]);
      filter.push([['Hospital Name', hospitalName]]);
      filter.push([['Grievance By', grievance_By]]);
  
    TableUtil.exportListToExcelWithFilter(this.report, 'Grievance_application_Summary', this.heading, filter);
  }
  getGrievanceBy(id:any){
    if(id==7){
      return "Beneficiary";
    }else if(id==8){
      return "Hospital";
    }else if(id==9){
      return "Others";
    }else{
      return "All";
    }
  }
  downloadPdf() {
    let doc = new jsPDF('l', 'mm', [240, 180]);
    doc.setFontSize(12);
    let stateName = 'All', districtName = 'All', hospitalName = 'All',grievance_By='All';
    let fromDate = $('#formdate').val().toString(); 
    let toDate = $('#todate').val().toString();
    if(this.param!=undefined){
      fromDate=this.param.formDate;
      toDate=this.param.toDate;
    for(const element of this.statelist) {
      if(this.param.stateCode==element.stateCode) {
        stateName=element.stateName;
      }
    }
    for(const element of this.distList) {
      if(this.param.distCode==element.districtcode) {
        districtName=element.districtname;
      }
    }
    for(const element of this.hostList) {
      if(this.param.hostCode==element.hospitalCode) {
        hospitalName=element.hospName;
      }
    }
    grievance_By=this.getGrievanceBy(this.param.grievancebyId);
  }
    doc.text('From Date:'+fromDate, 10, 10);
    doc.text('To Date:'+toDate, 90, 10);
    doc.text('State Name:'+stateName, 180, 10);
    doc.text('District Name:'+districtName, 10, 20);
    doc.text('Hospital Name:'+hospitalName, 90, 20);
    doc.text('Grievance By:'+grievance_By, 180, 20);
    doc.text("Generated On: "+this.convertDate(new Date()), 10, 30);
    doc.text("Generated By: "+this.sessionService.decryptSessionData("user").fullName, 180, 30);
    doc.text("Grievance_application_Summary", 90, 40);
    let col = this.heading;
    let rows = [];
    let claim: any;
    for(let i=0;i<this.dataResult.length;i++) {
      claim = this.dataResult[i];
      let temp = [i+1, claim.VCHAPPLICATIONNO,claim.CONTACT_NO,claim.STATECODE, claim.DISTRICTCODE,claim.HOSPITALDETAILS, 
      claim.INTUPDATEDBY,claim.STMCREATEDON,claim.INTSENTFROM,this.getAppStatusForReport(claim)];
      rows.push(temp);
    }
    autoTable(doc, {
      head: col,
      body: rows,
      theme: 'grid',
      startY: 50,
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
        9: {cellWidth: 20}
      }
    });

    doc.save('Grievance_application_Summary.pdf');
}
convertDate(date) {
  let datePipe = new DatePipe("en-US");
  date = datePipe.transform(date, 'dd-MMM-yyyy, h:mm:ss a');
  return date;
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
      return true;
    }
  }
}
