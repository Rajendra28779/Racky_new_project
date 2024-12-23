import { HttpClient } from '@angular/common/http';

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

//import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { CommonconfigService } from 'src/app/services/form-services/commonconfig.service';
import { EncrypyDecrpyService } from 'src/app/services/form-services/encrypy-decrpy.service';
import { ViewAppListService } from 'src/app/services/form-services/view-app-list.service';
import {Location} from '@angular/common';
import Swal from 'sweetalert2';
import { SessionStorageService } from 'src/app/services/session-storage.service';



@Component({

  selector: 'app-take-action',

  templateUrl: './take-action.component.html',

  styleUrls: ['./take-action.component.scss'],

})

export class TakeActionComponent implements OnInit {

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

  //editor: any = ClassicEditor;

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

  constructor(

    private route: Router,

    private httpClient: HttpClient,

    private router: ActivatedRoute,

    private commonService: CommonconfigService,

    private encDec: EncrypyDecrpyService,

    private appListService: ViewAppListService,

    private _location: Location,
    private sessionService: SessionStorageService
  ) {}



  ngOnInit(): void {

    let SectionParsed = this.sessionService.decryptSessionData("user");
    console.log(SectionParsed)
    //this.userRole = SectionParsed.USER_ROLE;

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



  getAppData() {

    let param = {

      itemId: this.formId,

      pendingAt: this.userRole,

     // pendingAt: 1,

      serviceId: this.serviceId,
      profileId:0,
      mode: 'all',stateCode:'',distCode: '',lstAct:''
    };
     console.log("params:" + JSON.stringify(param))
    this.appListService.getApplicationList(param).subscribe((res) => {



      this.dataCols = res.result.cols;

      this.dataResult = res.result.dataRes;

      this.formsList = this.dataResult;

      this.currentStage = this.dataResult[0].INTSTAGENO

      ;

      if (this.formsList) {

        let actionParam = {

          processId: this.formId,

          stageNo: this.dataResult[0].INTSTAGENO

          ,
          serviceId: this.serviceId,

        };

        console.log("Actparams:" + JSON.stringify(actionParam))

        this.appListService.getActions(actionParam).subscribe((actionRes) => {

          this.allActions = actionRes.result.actions;
          console.log( this.allActions)

          let displayActions = Object.keys(this.allActions);

          this.actionData = actionRes.result.dataRes;

          if (this.actionData) {

            let authActions = this.actionData[0].VCHAUTHTYPES;

            this.splActions = authActions.split(',');

             console.log("act:" +  this.splActions)

            this.userActions = displayActions.filter((element) =>

              this.splActions.includes(element)

            );

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

    let checkedAction = <HTMLInputElement>(

      document.querySelector('input[name="radAction"]:checked')

    );

    let valid = true;

    let curObj = this;



    if (checkedAction == null || typeof checkedAction == 'undefined') {

      Swal.fire({

        icon: 'error',

        text: this.messaageslist.chooseAction,

      });

      valid = false;

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

        action: checkedAction.value,

        remark: this.txtRemark,

        updatedBy: this.userId,

        updatedByRoleId: this.userRole,

      };

      if (this.uploadDocs) {

        Object.assign(param, { docIds: this.uploadDocs });

        Object.assign(param, this.upDocObj);

      }



      this.appListService.takeAction(param).subscribe((res) => {
        Swal.fire({

          icon: 'success',

          text: this.messaageslist.successMsg,

        }).then(function () {

          let encSchemeStr = curObj.encDec.encText(curObj.formId.toString());

          curObj.route.navigateByUrl(

            '/application/pending-application/' + encSchemeStr

          );

        });

      });

    }

    return valid;

    // $processId        =  (isset($input->processId)) ? $input->processId : 0;

    // $serviceId        =  (isset($input->serviceId)) ? $input->serviceId : 0;

    // $stageNo          =  (isset($input->stageNo)) ? $input->stageNo : 0;

    // $action           =  (isset($input->action)) ? $input->action : 0;

    // $remark           =  (isset($input->remark)) ? $input->remark : '';

  }

  // chooseAction() {

  //   let inptEleRadActn :any   = (<HTMLInputElement>(

  //     document.querySelector('input[name="radAction"]:checked')

  //   ));

    // let radAction  = (inptEleRadActn!=null || inptEleRadActn!='') ? '' : inptEleRadActn.value ;
  backClicked(){
    this._location.back();
  }

}

