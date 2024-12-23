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
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-grievance-application-summary',
  templateUrl: './grievance-application-summary.component.html',
  styleUrls: ['./grievance-application-summary.component.scss']
})
export class GrievanceApplicationSummaryComponent implements OnInit {

  public loading = false;
  title: any;
  tablist: any;
  tabDataId: any;
  utillist: any;
  messaageslist: any;
  jsonurl = 'assets/js/_configs/pendingApplicationsSummaryForGrievance.config.json';
  jsonurlView ='assets/js/_configs/pendingApplicationsGrievanceOfficerForView.config.json';
  jsonurldc ='assets/js/_configs/pendingApplicationsSummaryForDCGrievance.config.json';
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
    mode :any,formDate:any,toDate:any,stateCode:any,distCode:any
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

    this.getStateList();
    
    let SeetionParsed = this.sessionService.decryptSessionData("user");
    this.userRole = SeetionParsed.groupId ;
    this.userId = SeetionParsed.userId;
    this.getUserDetails(this.request);
    
    if(this.userRole == 99){
       this.loadconfigOfficer();
    }else if(this.userRole == 6){
      this.loadconfigOfficerDC();
    }
    else this.loadconfig();
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
  loadconfigOfficerDC() {
    this.httpClient.get<any>(this.jsonurldc).subscribe((data: any) => {
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
  getApplList(formID: any) {
    let param = { itemId: formID, pendingAt: this.userRole, pageType: 'sum', profileId:0,serviceId:0,
   mode: 'user',stateCode:'',distCode: ''
  };
    this.appListService.getApplicationList(param).subscribe((res) => {
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
          debugger;
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

  goToTakeAction(intId: any, serviceId: any) {
    debugger;
    let encParam = this.encDec.encText(
      this.formID + ':' + serviceId + ':' + intId
    );
    this.route.navigateByUrl('application/grievance-take-action/' + encParam);
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
      'Grievance by',
      'Case Type',
      'Priority',
      'NFSA/SFSS Card No',
      'Hospital Name',
      'Registration Number',
      'Mobile Number ',
      'DistictName',
      'State ',
      'Grievance Type',
      'Applied Date ',
      'Updated By',
      'Application Status'
    ],
  ];
  SNALISt: any = {
    slno: "",
    GrievanceBy:"",
    CaseType:"",
    Priority:"",
    NfsaSfsaCardNo:"",
    HospitalName: "",
    RegistrationNumber: "",
    PatientPhoneNo: "",
    City_Town: "",
    State: "",
    GrievanceType:"",
    AppliedDate: "",
    Applied_Updated_By: "",
    ApplicationStatus:""
  };
  downloadReport() {
    this.report = [];
    let sna: any;
    for (let i = 0; i < this.dataResult.length; i++) {
      sna = this.dataResult[i];
      if(sna.CASE_TYPE ==1){
        this.caseStatus='Complaint';
      }
      else if(sna.CASE_TYPE ==2){
        this.caseStatus='Enquiry';
      }
      else if(sna.CASE_TYPE ==3){
        this.caseStatus='Request';
      }
      else  this.caseStatus='Suggestion';
      let status= this.getAppStatusForReport(sna);
      this.SNALISt = [];
      this.SNALISt.slno = i + 1;
      this.SNALISt.GrievanceBy=sna.GRIEVANCEBY_NAME;
      this.SNALISt.CaseType=this.caseStatus;
      this.SNALISt.Priority=sna.PRIORITY_TYPE;
      this.SNALISt.NfsaSfsaCardNo=sna.NFSA_SFSA_CARD_NO;
      this.SNALISt.HospitalName = sna.HOSPITALNAME;
      this.SNALISt.RegistrationNumber = sna.VCHAPPLICATIONNO;
      this.SNALISt.PatientPhoneNo = sna.CONTACT_NO;
      this.SNALISt.DistictName = sna.DISTRICTCODE;
      this.SNALISt.State = sna.STATECODE;
      this.SNALISt.GrievanceType= sna.GRIEVANCETYPE;
      this.SNALISt.AppliedDate = sna.STMCREATEDON;
      this.SNALISt.Updated_By = sna.INTSENTFROM;
      this.SNALISt.ApplicationStatus=status;
      this.report.push(this.SNALISt);

    }
    TableUtil.exportListToExcel(
      this.report,
      'Record_Application',
      this.heading
    );
  }

  stateData: any = [];
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
    })
  }
  OnChangeState(event) {
    this.stateCode = event.target.value;
    this.appListService.getDistByState(this.stateCode).subscribe((data) => {
      this.distList = data;
      this.distList.sort((a, b) => a.districtname.localeCompare(b.districtname));
     console.log(data)
    })
  }
  getUserDetails(request: any){
    let groupType = this.userRole;
    let userName = this.userId;
    let request1 = {groupType,userName} 
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
  let stateCode = $("#statecode1").val();
  let distCode = $("#distcode1").val();
  this.formdat=fromdate
  this.todat=todate
  console.log(distCode);
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
  this.param = { itemId: this.formID, pendingAt: this.userRole, pageType: 'sum', profileId:0,serviceId:0,
  mode : 'search',formDate:this.formdat,toDate:todate,stateCode:stateCode,distCode: distCode
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
}
