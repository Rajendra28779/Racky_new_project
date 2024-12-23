import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { EncrypyDecrpyService } from 'src/app/services/form-services/encrypy-decrpy.service';
import { ViewAppListService } from 'src/app/services/form-services/view-app-list.service';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-grievance-take-action',
  templateUrl: './grievance-take-action.component.html',
  styleUrls: ['./grievance-take-action.component.scss']
})
export class GrievanceTakeActionComponent implements OnInit {

  public loading = false;
  title: any;
  tablist: any;
  tabDataId: any;
  utillist: any;
  messaageslist: any;
  jsonurl = 'assets/js/_configs/takeAction.config.json';
  sessionToken: any;
  userRole: any;
  userId: any;
  dataResult: any;
  dataCols: any;
  formsList: any;
  intId: any;
  formId: any;
  serviceId: any;
  allActions: any;
  actionData: any;
  splActions: any;
  uploadableDocs: any;
  docDetailsToUpload: any = [];
  upDocObj: any = {};
  uploadDocs: any = [];
  userActions: any;
  currentStage: any;
  txtRemark: any = '';
  maxChars = 2000;
  tabAccess:any='';
  tabAccess1:any='';
  tempurlForApproval=environment.tempUrlForApproval;
  tempUrlForDocument:any;
  url:any;
  constructor(private route: Router,
    private httpClient: HttpClient,
    private router: ActivatedRoute,
    private encDec: EncrypyDecrpyService,
    private appListService: ViewAppListService,
    private _location: Location,
    private sessionService: SessionStorageService
  ) { }

  ngOnInit(): void {
    this.url=location.href
    console.log(this.url);
    if( this.url.includes('bskyportal.odisha.gov.in')){   //Prod
      console.log("Prod true");
      this.tempUrlForDocument='https://bskygrievance.odisha.gov.in/bsky_grv_service/downloadForm/';
    }
    if( this.url.includes('localhost')){
      console.log("true");
      this.tempUrlForDocument='http://192.168.10.46:7001/bsky_grv_test/downloadForm/';
    }
   if( this.url.includes('192.168.10.46')){
    console.log("Testing true");
    this.tempUrlForDocument='http://192.168.10.46:7001/bsky_grv_test/downloadForm/';
    }
    if( this.url.includes('bskycms.odisha.gov.in')){  //pre prod
      console.log("pre prod");
      this.tempUrlForDocument='https://bskygrvpp.odisha.gov.in:8443/bsky_grv_service/downloadForm/';
    }
   
    let SectionParsed = this.sessionService.decryptSessionData("user");
    console.log(SectionParsed)
    this.tabAccess=localStorage.getItem('tabAccess');
    this.tabAccess1=localStorage.getItem('tabAccess1');
    this.userRole = SectionParsed.groupId;
    this.userId = SectionParsed.userId;
    this.loadConfig();
    let encData = this.router.snapshot.paramMap.get('id');

    if (encData != '') {
      let decText = this.encDec.decText(encData);
      let decTextArr = decText.split(':');
      this.formId = decTextArr[0];
      this.serviceId = decTextArr[1];
      this.intId = decTextArr[2];
    }

    this.getAppData();
    this.chooseAction();
    this.showLessButtonVisible = this.datadocument?.length > 4;
  }

  loadConfig() {
    this.httpClient.get<any>(this.jsonurl).subscribe((data: any) => {
      this.tablist = data[0].tabList;
      this.utillist = data[0].utils;
      this.messaageslist = data[0].messages;
      this.title = this.multilingual(data[0].pagetitle);
    });
  }

  multilingual(test: any) {
    return test;
  }
  QueryCount:any;
  queryButtonVisible: boolean ;
  datadocument:any;
  dataMedia:any;
  dcUploadDetails:any;
  getAppData() {
    let param = {
      itemId: this.formId,
      pendingAt: this.userRole,
      // pendingAt: 1,
      serviceId: this.serviceId,
      profileId: 0
    };
    console.log("params:" + JSON.stringify(param))
    this.queryButtonVisible=true;
    this.appListService.getApplicationList(param).subscribe((res) => {
      this.dataCols = res.result.Grievancecols;
      this.dataResult = res.result.dataRes;
      this.formsList = this.dataResult;
      this.currentStage = this.dataResult[0].INTSTAGENO;
      this.datadocument=res.result.documents;
      this.dataMedia=res.result.media;
      this.dcUploadDetails=res.result.documentDetails;
      console.log(this.datadocument);
      console.log(this.dataMedia);
      console.log(this.dcUploadDetails);
      this.pendingstatus= this.appListService.getStatus(this.dataResult[0]);
      if (this.formsList) {
        let actionParam = {
          processId: this.formId,
          stageNo: this.dataResult[0].INTSTAGENO,
          serviceId: this.serviceId,
          pendingAt: this.userRole,
        };
        console.log("Actparams:" + JSON.stringify(actionParam))

        this.appListService.getActions(actionParam).subscribe((actionRes) => {
          this.allActions = actionRes.result.actions;
          console.log(this.allActions)
          let displayActions = Object.keys(this.allActions);
          this.actionData = actionRes.result.dataRes;
          this.QueryCount = actionRes.result.QueryCount;
          if (this.actionData) {
            let authActions = this.actionData[0].VCHAUTHTYPES;
            this.splActions = authActions.split(',');
            console.log("act:" + this.splActions)
            this.userActions = displayActions.filter((element) =>
              this.splActions.includes(element)
            );

            for (let i = 0; i < this.splActions.length; i++) {
              debugger;
              if (this.userActions[i] == '18') {
                if (this.dataResult[0].TINSTATUS != 17) {
                  this.userActions.splice(i, i);
                }else if(this.dataResult[0].TINSTATUS == 17){
                  this.userActions=[];
                  this.userActions[0]='18';
                  this.queryButtonVisible=false;
                }
              }
              console.log(this.splActions);
            }

            if (this.splActions.includes('15')) {
              if (
                typeof this.actionData[0].JSNAPPROVALDOCUMENT != 'undefined' &&
                this.actionData[0].JSNAPPROVALDOCUMENT != ''
              ) {
                this.uploadableDocs = JSON.parse(
                  this.actionData[0].JSNAPPROVALDOCUMENT
                );
              }
            }
          }
        });
      }
    });
  }

  validateDocuments() {
    debugger;
    this.uploadDocs = [];
    let valid = true;
    let docUploadFlag = true;
    this.upDocObj = {};

    if (this.docDetailsToUpload) {
      for (let allUpDocs of this.docDetailsToUpload) {
        let docFiles: any = <HTMLInputElement>(
          document.getElementById(allUpDocs.docId)
        );
        let validSizeInKB =
          allUpDocs.selSizeType == 'KB'
            ? allUpDocs.txtFileSize
            : Number(allUpDocs.txtFileSize) * 1024;
        let validateFiles: any = [];
        let uploadedFileType: any = '';

        if (docFiles.value != '') {
          validateFiles = allUpDocs.txtFileType.split(',');
          uploadedFileType = docFiles.value.split('.').pop();
          validateFiles = validateFiles.map((v: any) => v.toLowerCase());
          this.uploadDocs.push(allUpDocs.docId);
          if (allUpDocs.selIsMandatory == 'Y' && docFiles.value == '') {
            Swal.fire({
              icon: 'error',
              text: 'Upload ' + allUpDocs.txtDocName,
            });
            return false;
          } else if (!validateFiles.includes(uploadedFileType.toLowerCase()) && docFiles.value != '') {
            Swal.fire({
              icon: 'error',
              text: 'Upload ' + allUpDocs.txtFileType + ' file only',
            });
            valid = false;
            return valid;
          } else if (validSizeInKB > 0 && Number(Math.round(docFiles.files[0].size / 1024)) > Number(validSizeInKB)) {
            Swal.fire({
              icon: 'error',
              text:
                allUpDocs.txtDocName +
                ' should be less than ' +
                allUpDocs.txtFileSize +
                ' ' +
                allUpDocs.selSizeType,
            });
            valid = false;
            return valid;
          } else {
            Object.assign(this.upDocObj, {
              [allUpDocs.docId]: docFiles.files[0],
            });
          }
        }
      }
    }
    return valid;
  }

  chooseAction() {
    let radAction = $('input[name="radAction"]:checked').val();//
    console.log(radAction);
    this.docDetailsToUpload = [];

    if (this.uploadableDocs) {
      for (let upDocs of this.uploadableDocs) {
        if (Number(upDocs.selEvents) == Number(radAction)) {
          this.docDetailsToUpload.push(upDocs);
        }
      }
    }
  }

  takeAction() {
    debugger;
    let checkedAction = $('input[name="radAction"]:checked').val();
    let checkedPriority = $('input[name="priority"]:checked').val();
    let valid = true;
    let curObj = this;

    if (checkedAction == null || typeof checkedAction == 'undefined') {
      Swal.fire({
        icon: 'error',
        text: this.messaageslist.chooseAction,
      });
      valid = false;
    } else if (this.userRole != 99 && (checkedPriority == null || typeof checkedPriority == 'undefined')) {
      Swal.fire({
        icon: 'error',
        text: this.messaageslist.choosePriority,
      });
      valid = false;
      //  }
    } else if (!this.validateDocuments()) {
      valid = false;
    } else if (this.txtRemark == '') {
      Swal.fire({
        icon: 'error',
        text: this.messaageslist.chooseRemark,
      });
      valid = false;
    } else {
      let param = {
        processId: this.formId,
        stageNo: this.currentStage,
        serviceId: this.serviceId,
        action: checkedAction,
        remark: this.txtRemark,
        updatedBy: this.userId,
        updatedByRoleId: this.userRole,
        contactNumber: this.dataResult[0].CONTACT_NO,
        priority: checkedPriority
      };
      console.log(param);
      if (this.uploadDocs) {
        Object.assign(param, { docIds: this.uploadDocs });
        Object.assign(param, this.upDocObj);
      }
      
      let radAction = $('input[name="radAction"]:checked').val();
      Swal.fire({
        title: '',
        text: 'Are you sure To '+this.findStatus(radAction)+'?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
      }).then((result) => {
        if (result.isConfirmed) {
            this.appListService.takeAction(param).subscribe((res) => {
            Swal.fire({
              icon: 'success',
              text: this.messaageslist.successMsg,
            }).then(function () {
              let encSchemeStr = curObj.encDec.encText(curObj.formId.toString());
              if(this?.tabAccess=='Q'){
                curObj.route.navigateByUrl(
                  '/application/grievanceQueryForDGO/' + encSchemeStr
                );
              }else if(this?.tabAccess1=='Q'){
                curObj.route.navigateByUrl(
                  '/application/grievanceQuerySettleForGO/' + encSchemeStr
                );
              }
              else{
                curObj.route.navigateByUrl(
                  '/application/pending-grievance-application/' + encSchemeStr
                );
              }
            });
          });
        }
      });
    }
    return valid;
  }


  backClicked() {
    this._location.back();
  }
  findStatus(status){
    if(status == 1){
      return 'Forward';
    }else if(status == 6){
      return 'Query';
    }else if(status == 8){
      return 'Approve';
    }else if(status == 18){
      return 'Re Open';
    }else
      return 'Take Action';
  }
  tempurl=environment.grievancePreviewUrl;
  intProfileId:any;
  editDetails(formParms:any) {
     let encSchemeStr = this.encDec.encText(formParms.toString());
     const url = this.tempurl+encSchemeStr;
     window.open( url, '_blank');
   }
   notingDetails(formParms: any) {
    let encSchemeStr = this.encDec.encText(formParms.toString());
    this.route.navigate(['application/noting', encSchemeStr]);
  }
  pendingstatus:any;
  visibleDocumentsCount = 4;
  showMoreButtonText = 'Show More';
  showLessButtonText = 'Show Less';
  showLessButtonVisible = false;
  toggleShowMore() {
    if (this.visibleDocumentsCount === this.datadocument.length) {
      this.showLessButtonVisible=false;
      this.visibleDocumentsCount = 4;
    } else {
      this.showLessButtonVisible=true;
      this.visibleDocumentsCount = this.datadocument.length;
    }
  }
}