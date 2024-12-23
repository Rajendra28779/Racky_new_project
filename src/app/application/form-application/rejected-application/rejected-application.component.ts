import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonconfigService } from 'src/app/services/form-services/commonconfig.service';
import { EncrypyDecrpyService } from 'src/app/services/form-services/encrypy-decrpy.service';
import { ViewAppListService } from 'src/app/services/form-services/view-app-list.service';
import Swal from 'sweetalert2';
import { SnoCLaimDetailsService } from '../../Services/sno-claim-details.service';
import { TableUtil } from '../../util/TableUtil';
import {Location} from '@angular/common';
import { HeaderService } from '../../header.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-rejected-application',
  templateUrl: './rejected-application.component.html',
  styleUrls: ['./rejected-application.component.scss']
})
export class RejectedApplicationComponent implements OnInit {
  public loading = false;
  title: any;
  tablist: any;
  tabDataId: any;
  utillist: any;
  messaageslist: any;
  jsonurl = 'assets/js/_configs/rejectedApplications.config.json';
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
  currentPage:any=1;
  pageElement:any=10;
  elementTo:number=this.pageElement;
  //elementTo:any = 0;
  showPegi?:boolean;
  recordList: any;
  report: any;
  userId: any;
  request: any;
  statelist: any  = [];
  stateCode: any;
  distList: any;
  record: any;
  butDisabled : boolean = false;
  butDisabled1 : boolean = false;
  selecteddist: any;
  selecteddistName: any;
  param: { itemId: any; pendingAt: number; pageType: string; profileId: number; serviceId: number;
    mode :any,lstAct:any,stateCode:any,distCode:any
  };
  constructor( private route: Router,
    private httpClient: HttpClient,
    private router: ActivatedRoute,
    private commonService: CommonconfigService,
    private encDec: EncrypyDecrpyService,
    private appListService: ViewAppListService,
    public snoService: SnoCLaimDetailsService,
    public headerService: HeaderService,
    private _location: Location,
    private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle("Rejected Application");
    this.getStateList();
    
    let SeetionParsed = this.sessionService.decryptSessionData("user");
   // this.userRole = SeetionParsed.USER_ROLE;
   this.userRole = SeetionParsed.groupId ;
   this.userId = SeetionParsed.userId;
   this.getUserDetails(this.request);
   if(this.userRole == 12 || this.userRole == 6){
    this.butDisabled  = true;
    this.butDisabled1  = true;
  }
    this.loadconfig();
    let encSchemeId = this.router.snapshot.paramMap.get('id');
    let action_Id: any = this.sessionService.decryptSessionData("ACTION_PROCESS_ID");
    if (encSchemeId != '') {
      this.tabDataId = encSchemeId;
      this.formID = this.encDec.decText(encSchemeId);

      this.sessionService.encryptSessionData("ACTION_PROCESS_ID", this.formID);

      //console.log();
      //let schemeArr:any = schemeStr.split(':');
      //this.formID = schemeArr[0];

      if (this.formID > 0) {
        this.getApplList(this.formID);
      }
    } else if (action_Id > 0) {
      this.formID = action_Id;
      this.getApplList(action_Id);
    }
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
  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
    if(this.recordList<=this.pageElement){
      this.elementTo = this.recordList
    }
    else
    this.elementTo = this.pageElement;
  }
  multilingual(test: any) {
    return test;
  }
  getApplList(formID: any) {
    let param = { itemId: formID, pendingAt: this.userRole, pageType: 'rej', profileId:0 ,serviceId:0,
    mode: 'all',stateCode:'',distCode: '',lstAct:''
  };
    this.appListService.getApplicationList(param).subscribe((res) => {
      this.dataCols = res.result.cols;
      this.dataResult = res.result.dataRes;
      // if(this.dataResult[0].DISTRICTCODE!=undefined && this.dataResult[0].DISTRICTCODE!="" && this.dataResult[0].DISTRICTCODE!=null){

      //   this.selecteddist = JSON.parse(this.dataResult[0].DISTRICTCODE);

      //   this.selecteddistName = JSON.parse(JSON.stringify(this.dataResult[0].DISTRICTNAME));

      //   }


    

      if(res.result.cdmoDistrict !=undefined && res.result.cdmoDistrict !="" && res.result.cdmoDistrict!=null){

        this.selecteddist = JSON.parse(JSON.stringify(res.result.cdmoDistrict));
      this.selecteddistName = JSON.parse(JSON.stringify(res.result.cdmoDistrictName));
     }

      this.formsList = this.dataResult;
      for (var i in this.dataResult) {
        if (this.dataResult[i].INTSENTFROM == 12) {
          this.dataResult[i].INTSENTFROM = "CDMO";
        }
        else if (this.dataResult[i].INTSENTFROM == 13) {
          this.dataResult[i].INTSENTFROM = "SHAS";
        }
        else if (this.dataResult[i].INTSENTFROM == 6) {
          this.dataResult[i].INTSENTFROM = "DC";
        }
        else if (this.dataResult[i].INTSENTFROM == 4) {
          this.dataResult[i].INTSENTFROM = "SNA";
        }   else if (this.dataResult[i].INTSENTFROM == 41) {
          this.dataResult[i].INTSENTFROM = "CEO";
        }
        else if (this.dataResult[i].INTSENTFROM == 19) {
          this.dataResult[i].INTSENTFROM = "SHAS CEO";
        }
        else
          this.dataResult[i].INTSENTFROM = "Hospital";
      }
      //console.log("data Res:" +  JSON.stringify(this.formsList))
      this.record = this.formsList.length;
      this.recordList=this.formsList.length;
      if(this.recordList>0){
      this.showPegi=true
    }
    this.recordList = this.formsList.length;
    // console.log("ele:" + this.elementTo)
     //console.log("rec:" + this.recordList)
     if (this.recordList > 0 || this.recordList > this.pageElement) {
       this.elementTo = this.recordList
       this.showPegi = true
     }
     else
       this.showPegi = false;
   });
  }
  onTableDataChange(event: any) {
    this.page = event;
  }
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
  }
  pageChange(current: any) {
    this.currentPage = current;
    var total = this.currentPage * this.pageElement;
    var istotal = this.compare(total, this.recordList);
    if (istotal) {
      this.elementTo = total;
    }
    else {
      this.elementTo = this.recordList;
    }
  }
  compare(first: number, second: number) {
    if (first > second) {
   //   console.log(first);
      return false;
    }
    else {
    //  console.log(second);

      return true;
    }
  }
  goToTakeAction(intId: any, serviceId: any) {
    let encParam = this.encDec.encText(
      this.formID + ':' + serviceId + ':' + intId
    );
    this.route.navigateByUrl('application/take-action/' + encParam);
  }

  getAppStatus(rows: any) {
    return this.appListService.getStatus(rows);
  }
  SNALISt: any = {
    slno:"",
    HospitalName:"",
    RegistrationNumber: "",
    RohiniID:"",
    HeadName:"",
    MobileNumber:"",
    City_Town:"",
    State:"",
    AppliedDate: "",
    status:''
  };
  heading = [
    [
      'Sl#',
      'Hospital Name',
      'Registration Number',
      'Head Name ',
      'Mobile Number ',
      'City/Town ',
      'State ',
      'Applied Date ',
      'Applied/Updated By',
      'Status',
    ],
  ];
  downloadReport(){
    this.report = [];
    let sna: any;
    for (var i = 0; i < this.dataResult.length; i++) {
      sna=this.dataResult[i];
  //    console.log(sna)
      this.SNALISt=[];
      this.SNALISt.slno=i+1;
      this.SNALISt.HospitalName=sna.VCHAPPLICANTNAME;
      this.SNALISt.RegistrationNumber=sna.VCH_HOSP_REGDNO;
      this.SNALISt.HeadName=sna.VCH_ORG_HD_NAME;
      this.SNALISt.MobileNumber=sna.VCHMOBILENO;
      this.SNALISt.City_Town=sna.VCH_CITY_TOWN;
      this.SNALISt.State=sna.VCH_STATE;
      this.SNALISt.AppliedDate=sna.STMCREATEDON;
      this.SNALISt.Applied_Updated_By=sna.INTUPDATEDBY;
      this.SNALISt.status=this.appListService.getStatusForExcelDownlaod(sna);
  this.report.push(this.SNALISt);

    }
    TableUtil.exportListToExcel(
      this.report,
      'RejectedApplicationList',
      this.heading
    );
  }
  stateData: any = [];
  getStateList() {
    this.snoService.getStateList().subscribe((data: any) => {
      this.stateData = data;
      this.stateData.sort((a, b) => a.stateName.localeCompare(b.stateName));
      for (let j = 0; j < this.stateData.length; j++) {
        if (this.stateData[j].stateCode == '21') {
          this.statelist.push(this.stateData[j]);
        }
      }
      for (let i = 0; i < this.stateData.length; i++) {
        if (this.stateData[i].stateCode != '21') {
          this.statelist.push(this.stateData[i]);
        }
      }
  //    console.log(this.statelist)
    })
  }
  OnChangeState(event) {
    this.stateCode = event.target.value;
    //this.userId = this.sessiontoken.userId;
    this.appListService.getDistByState(this.stateCode).subscribe((data) => {
    //  var jsonObject  = JSON.parse(data)
      this.distList = data;
      this.distList.sort((a, b) => a.districtname.localeCompare(b.districtname));
    //  console.log(data)
    })
  }
  getUserDetails(request: any){
    let groupType = this.userRole;
     let userName = this.userId;
     request = {groupType,userName} 
     this.appListService.sendUserDetails(request).subscribe((data) => {
    //    console.log("req:" + JSON.stringify(request))
     })
   }
   resetData(){
    if(this.userRole == 13 || this.userRole == 19 || this.userRole == 4){
    $("#distcode1").val('')
    $("#statecode1").val('')}
    $("#lastActionBy").val('')
    this.getApplList(this.formID);
    this.elementTo = 10;
  }
  searchData(){
    let lstAct = $("#lastActionBy").val();
    let stateCode = $("#statecode1").val();
    let distCode = $("#distcode1").val();
    let mode = 'search';
    if(lstAct === "" && stateCode === "" && distCode=== ""){
      Swal.fire("Info","Please select at least one search parameter","warning")
      return
    }
    else if(stateCode != "" && distCode=== ""){
      Swal.fire("Info","Please select district","warning");
      return
    }
    this.param = { itemId: this.formID, pendingAt: this.userRole, pageType: 'rej', profileId:0,serviceId:0,
    mode : 'search',stateCode:stateCode,distCode: distCode,lstAct: lstAct
  };
    this.appListService.getApplicationList(this.param).subscribe((res) => {
      this.dataCols = res.result.cols;
      this.dataResult = res.result.dataRes;
      console.log( this.dataResult);
      this.formsList = this.dataResult;
      for (var i in this.dataResult) {
        console.log(i);
        if (this.dataResult[i].INTSENTFROM == 12) {
          this.dataResult[i].INTSENTFROM = "CDMO";
        }
        else if (this.dataResult[i].INTSENTFROM == 13) {
          this.dataResult[i].INTSENTFROM = "SHAS";
        }
        else if (this.dataResult[i].INTSENTFROM == 6) {
          this.dataResult[i].INTSENTFROM = "DC";
        }
        else if (this.dataResult[i].INTSENTFROM == 4) {
          this.dataResult[i].INTSENTFROM = "SNA";
        }
        else if (this.dataResult[i].INTSENTFROM == 41) {
          this.dataResult[i].INTSENTFROM = "CEO";
        }
        else if (this.dataResult[i].INTSENTFROM == 19) {
          this.dataResult[i].INTSENTFROM = "SHAS CEO";
        }
        else
          this.dataResult[i].INTSENTFROM = "Hospital";
      }
      //console.log("data Res:" +  JSON.stringify(this.formsList))
      this.recordList = this.formsList.length;
     // console.log("ele:" + this.elementTo)
      //console.log("rec:" + this.recordList)
      if (this.recordList > 0 || this.recordList > this.pageElement) {
        this.elementTo = this.recordList
        this.showPegi = true
      }
      else
        this.showPegi = false;
    });
  }
  }
