import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { CommonconfigService } from 'src/app/services/form-services/commonconfig.service';
import { EncrypyDecrpyService } from 'src/app/services/form-services/encrypy-decrpy.service';
import { ViewAppListService } from 'src/app/services/form-services/view-app-list.service';
import { environment } from 'src/environments/environment';
import { SnoCLaimDetailsService } from '../../Services/sno-claim-details.service';
import { HeaderService } from '../../header.service';
import { GrievanceByService } from '../../Services/grievance-by.service';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import { DatePipe,Location } from '@angular/common';
import Swal from 'sweetalert2';
import { TableUtil } from '../../util/TableUtil';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-grievance-query-for-dgo',
  templateUrl: './grievance-query-for-dgo.component.html',
  styleUrls: ['./grievance-query-for-dgo.component.scss']
})
export class GrievanceQueryForDGOComponent implements OnInit {

  showSearch:boolean=false;
  sessiontoken: any;
  userRole = 0;
  userId: any;
  jsonurl = 'assets/js/_configs/queryBucketDGO.config.json';
  tablist: any;
  tabDataId: any;
  utillist: any;
  messaageslist: any;
  public loading = false;
  tempurl=environment.grievancePreviewUrl;

  title: any;
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
    mode :any,formDate:any,toDate:any,stateCode:any,distCode:any,hostCode:any,grievancebyId:any,lstAct: any,pendingApplication:any,GrvcaseType:any,grievancemediumId:any,
    dcUserIdList:any,hospitalCodeList:any
  };
  record : any;
  packageData: any;
  selectedIndex: number;
  pendingcount:number=0;
  appriovedcount: number=0;
  grievanceById:any='';
  placeHolder = "Select DC";
  dropdownSettings: IDropdownSettings = {};
  @ViewChild('multiSelect') multiSelect;
  placeHolder1 = "Select Hospital";
  dropdownSettings1: IDropdownSettings = {};
  @ViewChild('multiSelect') multiSelect1;
  constructor(private route: Router,
    private httpClient: HttpClient,
    private router: ActivatedRoute,
    private commonService: CommonconfigService,
    private encDec: EncrypyDecrpyService,
    private appListService: ViewAppListService,
    public snoService: SnoCLaimDetailsService,
    public headerService: HeaderService,
    private _location: Location,
    private grievancebyService:GrievanceByService,
    private snoCreateService: SnocreateserviceService,
    private sessionService: SessionStorageService
    ) { 
      this.dropdownSettings = {
        singleSelection: false,
        idField: 'userId',
        textField: 'fullName',
        itemsShowLimit: 2,
        allowSearchFilter: true,
        selectAllText: 'Select All',
        unSelectAllText: "Un-Select All",
      };
      this.dropdownSettings1 = {
        singleSelection: false,
        idField: 'hospitalCode',
        textField: 'hospitalName',
        itemsShowLimit: 2,
        allowSearchFilter: true,
        selectAllText: 'Select All',
        unSelectAllText: "Un-Select All",
      };
    }
    dataRequest: any;
    stateId: any='';
    distId: any='';
    hospitalId: any='';
    currentPagenNum: any;
    showData: boolean=true;
    pendingAt: any='';
    lastActionBy='';
  ngOnInit(): void {
    localStorage.removeItem('tabAccess');
    if(localStorage.getItem('routepage')!="Y"){
      sessionStorage.removeItem('requestData');
    }
    localStorage.removeItem('routepage');
    console.log(this._location.path());
    console.log(location.href);
    this.grvFrom='';
    this.cdmoview=false;
    this.url=location.href
    if( this.url.includes('bskycms.odisha.gov.in')){   //Prod
      console.log("Prod true");
      this.tempurl='https://bskygrievance.odisha.gov.in/#/website/formPreview/';
    }
    if( this.url.includes('localhost')){
        console.log("Local true");
        this.tempurl='http://localhost:4200/#/website/formPreview/';
    }
    if( this.url.includes('192.168.10.46')){
      console.log("Testing true");
      this.tempurl='http://192.168.10.46/bsky_grv_testI/#/website/formPreview/';
  }
  if( this.url.includes('bskystg.csmpl.com')){
    this.tempurl='http://bskystg.csmpl.com/bsky_grv_AI/#/website/formPreview/';
}
    this.headerService.setTitle('View Pending Applications');
    this.dataRequest = this.sessionService.decryptSessionData("requestData");
    $('.selectpicker').selectpicker();

    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
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
    if (
      this.dataRequest == null ||
      this.dataRequest == undefined ||
      this.dataRequest == ''
    ) {
     
            this.loadconfig();
            let encSchemeId = this.router.snapshot.paramMap.get('id');
            let action_Id: any = this.sessionService.decryptSessionData("ACTION_PROCESS_ID");
           
            this.currentPage = 1;
            this.pageElement = 10;
            this.selectedIndex = 1;
             if (encSchemeId != '') {
              this.tabDataId = encSchemeId;
              this.formID = this.encDec.decText(encSchemeId);
              this.sessionService.encryptSessionData("ACTION_PROCESS_ID", this.formID);
              this.formID=583;
            } else if (action_Id > 0) {
              this.formID = action_Id;
            }
            this.searchData();
          } else {
            this.loadconfig();
            this.userRole = SeetionParsed.groupId;
            let encSchemeId = this.router.snapshot.paramMap.get('id');
            let action_Id: any = this.sessionService.decryptSessionData("ACTION_PROCESS_ID");
            
            if (encSchemeId != '') {
              this.tabDataId = encSchemeId;
              this.formID = this.encDec.decText(encSchemeId);
              this.sessionService.encryptSessionData("ACTION_PROCESS_ID", this.formID);
              this.formID=583;
            } else if (action_Id > 0) {
              this.formID = action_Id;
            }
            let date = this.dataRequest.formDate;
            $('input[name="fromDate"]').val(date);
            let date1 = this.dataRequest.toDate;
            $('input[name="toDate"]').val(date1);
            this.stateId = this.dataRequest.stateCode;
            this.distId = this.dataRequest.distCode;
            this.hospitalId = this.dataRequest.hostCode;
            this.grievanceById=this.dataRequest.grievancebyId;
            if(this.userRole==6){
              if(this.dataRequest.grievancebyId==9){
                this.grvFrom=this.dataRequest.DCcaseType;
                this.cdmoview=true;
              }
            }else{
              this.getGrievanceMediumById(this.dataRequest.grievancebyId);
              this.grievanceMediumId=this.dataRequest.grievancemediumId;
            }
            this.lastActionBy=this.dataRequest.lstAct;
            this.pendingAt=this.dataRequest.pendingApplication;
            console.log(this.dataRequest)
            this.searchData();
    }
    if (this.elementTo < this.recordList) {
      this.elementTo = this.recordList;
    }
    this.currentPagenNum = this.sessionService.decryptSessionData("currentPageNum");
  }
  viewFormApplication(formId: any) {
    let encSchemeStr = this.encDec.encText(formId.toString());
    this.route.navigate([
      '/application/pending-grievance-application',
      encSchemeStr,
    ]);
  }
  getGrievanceByDetails(){
    this.grievancebyService.getlist().subscribe((allData) => {
      this.packageData = allData;
      console.log(this.packageData);

    })
  }
  distCode: any;
  hostList: any=[];
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
      if (this.dataRequest != null) {
        if (
          this.dataRequest.stateCode != null ||
          this.dataRequest.stateCode != undefined ||
          this.dataRequest.stateCode != ''
        ) {
          this.stateId = this.dataRequest.stateCode;
          this.OnChangeState(this.stateId);
        }
      }
       
      console.log(this.statelist)
    })
  }
  OnChangeState(event) {
    this.distId='';
    this.stateCode = event;
    this.selectedItems=[];
    this.DCNameList=[];
    this.DCUserIdList=[];
    this.selectedItems1=[];
    this.hostList=[];
    this.hospitalCodeList=[];
    this.appListService.getDistByState(this.stateCode).subscribe((data) => {
      this.distList = data;
      this.distList.sort((a, b) => a.districtname.localeCompare(b.districtname));
      if (this.dataRequest != null) {
        if (
          this.dataRequest.distCode != null ||
          this.dataRequest.distCode != undefined ||
          this.dataRequest.distCode != ''
        ) {
          this.distId = this.dataRequest.distCode;
          this.OnChangeDistrict(this.distId);
        } 
      }
      console.log(data)
    })
  }//OnChangeDistrict
  dcList: any;
  selectedItems: any = [];
  selectedItems1: any = [];
  OnChangeDistrict(event) {
    this.distCode = event;
    this.dcList=[];
    this.DCNameList=[];
    this.DCUserIdList=[];
    this.selectedItems=[];
    this.selectedItems1=[];
    this.hostList=[];
    this.hospitalCodeList=[];
    this.snoCreateService.getDCDetailsByStateAndDist(this.stateCode,this.distCode).subscribe(
      (response) => {
        this.dcList = response;
        console.log(response);
      },
      (error) => console.log(error)
    );
    
  }
  onChangeDClList(dcList:any[]){
    console.log(dcList);
    this.hospitalId='';
    this.selectedItems1=[];
    this.hospitalCodeList=[];
    this.appListService.getHospitalDetailsFromDCUserId(dcList).subscribe((response:any) => {
      console.log(response);
      if (response.status == 'success') {
        this.hostList = response.data;
      }
      })
  }
  DCUserIdList: any = [];
  DCNameList: any = [];
  dcUserObj: any;
  onItemSelect(item) {
    if(!this.DCUserIdList.includes(Number(item.userId))){
    this.DCUserIdList.push(Number(item.userId));
    this.DCNameList.push(item.fullName);
    }
    this.onChangeDClList(this.DCUserIdList);
  }

  
  onSelectAll(list) {
    for(const element of list){
      if(!this.DCUserIdList.includes(Number(element.userId))){
        this.DCUserIdList.push(Number(element.userId));
        this.DCNameList.push(element.fullName);
      }
    }
    this.onChangeDClList(this.DCUserIdList);
  }

  onItemDeSelect(item) {
    if(this.DCUserIdList.includes(Number(item.userId))){
      let index = this.DCUserIdList.indexOf(Number(item.userId));
      this.DCUserIdList.splice(index, 1);
      this.DCNameList.splice(index, 1);
    }
    this.onChangeDClList(this.DCUserIdList);
  }

  onDeSelectAll(list) {
   this.DCNameList=[];
   this.DCUserIdList=[];
   this.onChangeDClList(this.DCUserIdList);
  }
  getUserDetails(request: any) {
    let groupType = this.userRole;
    let userName = this.userId;
    let request1 = { groupType, userName }
    this.appListService.sendUserDetails(request1).subscribe((data) => {
      console.log("req:" + JSON.stringify(request1))
    })
  }
  hospitalCodeList: any = [];
  hospitalNameList: any = [];
  onItemSelect1(item) {
    if(!this.hospitalCodeList.includes(Number(item.hospitalCode))){
    this.hospitalCodeList.push(Number(item.hospitalCode));
    this.hospitalNameList.push(item.hospitalName);
    }
    console.log(this.hospitalCodeList);
  }

  
  onSelectAll1(list) {
    for(const element of list){
      if(!this.hospitalCodeList.includes(Number(element.hospitalCode))){
        this.hospitalCodeList.push(Number(element.hospitalCode));
        this.hospitalNameList.push(element.hospitalName);
      }
    }
    console.log(this.hospitalCodeList);
  }

  onItemDeSelect1(item) {
    if(this.hospitalCodeList.includes(Number(item.hospitalCode))){
      let index = this.hospitalCodeList.indexOf(Number(item.hospitalCode));
      this.hospitalCodeList.splice(index, 1);
      this.hospitalNameList.splice(index, 1);
    }
    console.log(this.hospitalCodeList);
  }

  onDeSelectAll1(list) {
   this.hospitalNameList=[];
   this.hospitalCodeList=[];
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
  searchData(){
    this.appriovedcount=0;
    this.pendingcount=0;
    let fromdate=$('#formdate').val().toString();
    let todate=$('#todate').val().toString();
    let stateCode = this.stateId;
    let distCode = this.distId;
    let hostCode = this.hospitalId;
    let grievancebyId = this.grievanceById;
    let lstAct = this.lastActionBy;
    let pendingAt=this.pendingAt;
    this.formdat=fromdate
    this.todat=todate
    let GrvcaseType = 'Q';
    let grievancemediumId=this.grievanceMediumId;

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
    this.param = { itemId: this.formID.toString(), pendingAt: this.userRole, pageType: 'pen', profileId:0,serviceId:0,
    mode : 'search',formDate:fromdate,toDate:todate,stateCode:stateCode,distCode: distCode,hostCode:hostCode,grievancebyId:grievancebyId,lstAct: lstAct,pendingApplication:pendingAt,GrvcaseType:GrvcaseType,grievancemediumId:grievancemediumId,
    dcUserIdList:this.DCUserIdList,hospitalCodeList:this.hospitalCodeList 
  };
    console.log(this.param);
    this.sessionService.encryptSessionData("requestData", this.param);
    this.appListService.getApplicationList(this.param).subscribe((res) => {
      this.dataCols = res.result.cols;
      this.dataResult = res.result.dataRes;
      this.formsList = this.dataResult;
      this.pendingRecordCount(this.formsList);
      this.traverseToRequiredPage();
      for(let i in this.dataResult){
        console.log("this.dataResult" + JSON.stringify(this.dataResult[i].INTSENTFROM));
      }
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
          this.appriovedcount++;
        }
        else if (this.dataResult[i].INTSENTFROM == 32) {
          this.dataResult[i].INTSENTFROM = "SHAS EXEC 2";
        }
        else
          this.dataResult[i].INTSENTFROM = this.dataResult[i].INTUPDATEDBY; //bibhu
      }

      //console.log("data Res:" +  JSON.stringify(this.formsList))
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
  traverseToRequiredPage() {
    if (this.currentPagenNum != null && this.currentPagenNum != undefined) {
      this.currentPage = this.currentPagenNum;
      sessionStorage.removeItem('currentPageNum');
    } else {
      this.currentPage = 1;
    }
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  pendingRecordCount(data:any){
    for (let i in data) {
      if(data[i].INTPENDINGAT == 30){
        this.pendingcount++;
      }
    }
  }
  getAppStatus(rows: any) {
    return this.appListService.getStatus(rows);
  }

  getAppStatusForReport(rows: any) {
    return this.appListService.getStatusForReport(rows);
  }

  notingDetails(formParms: any) {
    let encSchemeStr = this.encDec.encText(formParms.toString());
    this.sessionService.encryptSessionData("currentPageNum", this.currentPage);
    localStorage.setItem('routepage', "Y");
    this.route.navigate(['application/noting', encSchemeStr]);

  }
  goToTakeAction(intId: any, serviceId: any) {
    let encParam = this.encDec.encText(
      this.formID + ':' + serviceId + ':' + intId
    );
    this.sessionService.encryptSessionData("currentPageNum", this.currentPage);
    localStorage.setItem('tabAccess', this.param.GrvcaseType);
    localStorage.setItem('routepage', "Y");
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
      'Benificiary Name',
      'Contact No',
      'State',
      'District',
      'Hospital Details',
      'Registered by ',
      'Grievance Medium Name',
      'Applied Date ',
      'Last Action by',
      'Status'
    ],
  ];
  SNALISt: any = {
    slno: "",
    GrievanceNo:"",
    beneficiaryName:"",
    contactNo:"",
    state: "",
    district:"",
    hospital: "",
    registerBy: "",
    MediumName: "",
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
      this.SNALISt.beneficiaryName=sna.BENIFICIARY_NAME;
      this.SNALISt.contactNo=sna.CONTACT_NO;
      this.SNALISt.state = sna.STATECODE;
      this.SNALISt.district=sna.DISTRICTCODE;
      this.SNALISt.hospital = sna.HOSPITALDETAILS;
      this.SNALISt.registerBy = sna.INTUPDATEDBY;
      this.SNALISt.MediumName = sna.GRIEVANCE_MEDIUM_NAME;
      this.SNALISt.AppliedDate = sna.STMCREATEDON;
      this.SNALISt.lastActionBy= sna.INTSENTFROM;
      this.SNALISt.status=status;
      this.report.push(this.SNALISt);
    }
    console.log(this.param);
    let stateName = 'All', districtName = 'All', hospitalName = 'All',grievance_By='All',lastActionBy='All',pendingAt='All',grievance_medium='All';
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
    if(this.param.grievancebyId==9){
      for(const element of this.mediumDetails) {
        if(this.param.grievancemediumId==element.id) {
          grievance_medium=element.grivancemediumname;
        }
      }
    }
    lastActionBy=this.param.lstAct!=""?this.param.lstAct:"All";
    pendingAt=this.param.pendingApplication!=""?this.param.pendingApplication:"All";
  }
      let filter =[];
      filter.push([['From Date', fromDate]]);
      filter.push([['To Date', toDate]]);
      filter.push([['State Name', stateName]]);
      filter.push([['District Name', districtName]]);
      filter.push([['Hospital Name', hospitalName]]);
      filter.push([['Grievance By', grievance_By]]);
      filter.push([['Grievance Medium', grievance_medium]]);
      filter.push([['Last Action By', lastActionBy]]);
      filter.push([['Pending At', pendingAt]]);

    TableUtil.exportListToExcelWithFilter(this.report, 'Grievance_Query_application_DGO', this.heading, filter);
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
  resetData(){
    sessionStorage.removeItem('requestData');
    window.location.reload();
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
  getGrievanceType(id:any){
    if(id=='CD'){
      return "CDMO";
    }else if(id=='FR'){
      return "Fresh";
    }else{
      return "All";
    }
  }
  downloadPdf() {
    let doc = new jsPDF('l', 'mm', [280, 210]);
    doc.setFontSize(12);
    let stateName = 'All', districtName = 'All', hospitalName = 'All',grievance_By='All',lastActionBy='All',pendingAt='All',grievance_medium='All';
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
    if(this.param.grievancebyId==9){
      for(const element of this.mediumDetails) {
        if(this.param.grievancemediumId==element.id) {
          grievance_medium=element.grivancemediumname;
        }
      }
    }
    lastActionBy=this.param.lstAct!=""?this.param.lstAct:"All";
    pendingAt=this.param.pendingApplication!=""?this.param.pendingApplication:"All";
  }
    doc.text('From Date:'+fromDate, 10, 10);
    doc.text('To Date:'+toDate, 90, 10);
    doc.text('State Name:'+stateName, 180, 10);
    doc.text('District Name:'+districtName, 10, 20);
    doc.text('Hospital Name:'+hospitalName, 90, 20);
    doc.text('Grievance By:'+grievance_By, 180, 20);
    doc.text('Grievance Medium:'+grievance_medium, 10, 30);
    doc.text('Last Action By:'+lastActionBy, 90, 30);
    doc.text('Pending At:'+pendingAt, 180, 30);
    doc.text("Generated On: "+this.convertDate(new Date()), 10, 40);
    doc.text("Generated By: "+this.sessionService.decryptSessionData("user").fullName, 180, 40);
    doc.text("Grievance_Query_application_DGO", 110, 50);
    let col = this.heading;
    let rows = [];
    let claim: any;
    for(let i=0;i<this.dataResult.length;i++) {
      claim = this.dataResult[i];
      let temp = [i+1, claim.VCHAPPLICATIONNO, claim.BENIFICIARY_NAME, claim.CONTACT_NO,claim.STATECODE, claim.DISTRICTCODE,claim.HOSPITALDETAILS,
      claim.INTUPDATEDBY, claim.GRIEVANCE_MEDIUM_NAME,claim.STMCREATEDON,claim.INTSENTFROM,this.getAppStatusForReport(claim)];
      rows.push(temp);
    }
    autoTable(doc, {
      head: col,
      body: rows,
      theme: 'grid',
      startY: 60,
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
        9: {cellWidth: 20},
        10:{cellWidth:20},
        11:{cellWidth:20}
      }
    });

    doc.save('Grievance_Query_application_DGO.pdf');
}
convertDate(date) {
  let datePipe = new DatePipe("en-US");
  date = datePipe.transform(date, 'dd-MMM-yyyy, h:mm:ss a');
  return date;
}
heading1 = [
  [
    'Sl#',
    'Grievance Number',
    'Contact No',
    'State',
    'District',
    'Hospital Details',
    'Registered by ',
    'Applied Date ',
    'Last Action by',
    'Status'
  ],
];
SNALISt1: any = {
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


cdmoview:boolean;
grvFrom:any='';
viewGrievanceFrom(event:any){
  let grBy=event.target.value;
  if(grBy==9){
    this.cdmoview=true;
  }else{
    this.cdmoview=false;
    this.grvFrom='';
  }
}
mediumDetails:any=[];
  grievanceMediumId:any='';
  getGrievanceMediumById(event:any) {
    this.grievanceMediumId='';
    let grievancebyId = event;
    if(grievancebyId==9){
      this.appListService.getMediumDetails().subscribe((data) => {
      this.mediumDetails = data;
      console.log(this.mediumDetails);
      if (this.dataRequest != null) {
        if (this.dataRequest.grievancemediumId != null || this.dataRequest.grievancemediumId != undefined || this.dataRequest.grievancemediumId != '') {
          this.grievanceMediumId = this.dataRequest.grievancemediumId;
        }
      }
     })
    }else{
      if (this.dataRequest != null)
      this.dataRequest.grievancemediumId='';
      this.mediumDetails=[];
    }
  }
}
