import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { EncrypyDecrpyService } from 'src/app/services/form-services/encrypy-decrpy.service';
import { ViewAppListService } from 'src/app/services/form-services/view-app-list.service';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import { HeaderService } from '../../header.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-grievance-take-action-cdmo',
  templateUrl: './grievance-take-action-cdmo.component.html',
  styleUrls: ['./grievance-take-action-cdmo.component.scss']
})
export class GrievanceTakeActionCDMOComponent implements OnInit {

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
  maxChars = 2000;
  public dcList: any = [];
  @ViewChild('auto') auto;
  dcUserId: any;
  keyword: any = 'fullName';
  dcName: any;
  constructor(private route: Router,
    private httpClient: HttpClient,
    private router: ActivatedRoute,
    private encDec: EncrypyDecrpyService,
    private appListService: ViewAppListService,
    private _location: Location,
    private snoService: SnocreateserviceService,
    public headerService: HeaderService,
    private sessionService: SessionStorageService
  ) { }

  ngOnInit(): void {
    this.headerService.setTitle('Grievance Application');

    let SectionParsed = this.sessionService.decryptSessionData("user");
    console.log(SectionParsed);

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
      serviceId: this.serviceId,
      profileId: 0
    };
    console.log("params:" + JSON.stringify(param))

    this.appListService.getApplicationList(param).subscribe((res) => {
      this.dataCols = res.result.Grievancecols;
      this.dataResult = res.result.dataRes;
      this.formsList = this.dataResult;
      this.currentStage = this.dataResult[0].INTSTAGENO;
      if (this.formsList) {
        let actionParam = {
          processId: this.formId,
          stageNo: this.dataResult[0].INTSTAGENO,
          serviceId: this.serviceId,
          pendingAt: this.userRole
        };
        console.log("Actparams:" + JSON.stringify(actionParam))

        this.appListService.getActions(actionParam).subscribe((actionRes) => {
          this.allActions = actionRes.result.actions;
          console.log(this.allActions)
          let displayActions = Object.keys(this.allActions);
          this.actionData = actionRes.result.dataRes;

          if (this.actionData) {
            let authActions = '1';
            this.splActions = authActions.split(',');
            console.log("act:" + this.splActions)
            this.userActions = displayActions.filter((element) =>
              this.splActions.includes(element)
            );

          }
        });
        this.snoService.getDCDetails(this.userId).subscribe(
          (response) => {
            this.dcList = response;
            console.log(response);
          },
          (error) => console.log(error)
        );
      }
    });
  }

  chooseAction() {
    let radAction = $('input[name="radAction"]:checked').val();
    console.log(radAction);
  }

  takeAction() {
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
    } else if (this.dcUserId == '' || typeof this.dcUserId == 'undefined' || this.dcUserId == null) {
      Swal.fire({
        icon: 'error',
        text: 'Please select DC',
      });
      valid = false;
    }
    else if (this.txtRemark == '') {
      Swal.fire({
        icon: 'error',
        text: this.messaageslist.chooseRemark,
      });
      valid = false;
    } else {
      let param = {
        processId: this.formId,
        serviceId: this.serviceId,
        action: checkedAction,
        remark: this.txtRemark,
        updatedBy: this.userId,
        updatedByRoleId: this.userRole,
        priority: checkedPriority,
        dcUserId: this.dcUserId,
      };
      console.log(param);
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
            this.appListService.saveCDMOForwardData(param).subscribe((res:any) => {
              if (res.status == 'Success') {
                Swal.fire({
                  icon: 'success',
                  text: res.message,
                }).then(function () {
                  let encSchemeStr = curObj.encDec.encText(curObj.formId.toString());
                  curObj.route.navigateByUrl(
                    '/application/pending-grievance-application/' + encSchemeStr
                  );
                });
              }else if (res.status == 'Failed') {
                this.swal('Error', res.message, 'error');
              }
            
          },(error) => {
            console.log(error);
            this.swal('', 'Something went wrong.', 'error');
          });
        }
      });
    }
    return valid;
    
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
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
  clearEvent() {
    this.dcUserId = '';
    this.dcName = '';
  }
  selectEvent(item) {
    // do something with selected item
    this.dcUserId = item.userId;
    this.dcName = item.fullName;
  }
}
