import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonconfigService } from 'src/app/services/form-services/commonconfig.service';
import { EncrypyDecrpyService } from 'src/app/services/form-services/encrypy-decrpy.service';
import { ViewAppListService } from 'src/app/services/form-services/view-app-list.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-view-application-list',
  templateUrl: './view-application-list.component.html',
  styleUrls: ['./view-application-list.component.scss'],
})
export class ViewApplicationListComponent implements OnInit {
  public loading = false;
  title: any;
  tablist: any;
  tabDataId: any;
  utillist: any;
  messaageslist: any;
  jsonurl = 'assets/js/_configs/viewApplicationList.config.json';
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
  constructor(
    private route: Router,
    private httpClient: HttpClient,
    private router: ActivatedRoute,
    private commonService: CommonconfigService,
    private encDec: EncrypyDecrpyService,
    private appListService: ViewAppListService,
    private sessionService: SessionStorageService
  ) {}

  ngOnInit(): void {

   let SeetionParsed = this.sessionService.decryptSessionData("user");
   console.log(SeetionParsed);
   this.userRole = SeetionParsed.groupId;
   console.log( this.userRole)
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
      this.utillist = data[0].utils;
      this.messaageslist = data[0].messages;
      this.title = this.multilingual(data[0].pagetitle);
    });
  }
  multilingual(test: any) {
    return test;
  }
  getApplList(formID: any) {
    let param = { itemId: formID, pendingAt: this.userRole, pageType: 'pen' };
    this.appListService.getApplicationList(param).subscribe((res) => {
      this.dataCols = res.result.cols;
      this.dataResult = res.result.dataRes;
      this.formsList = this.dataResult;
    });
  }
  onTableDataChange(event: any) {
    this.page = event;
  }
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
  }

  goToTakeAction(intId: any, serviceId: any) {
    let encParam = this.encDec.encText(
      this.formID + ':' + serviceId + ':' + intId
    );
    this.route.navigateByUrl('/application/take-action/' + encParam);
  }

  getStatus(rows: any) {
    let status = 0;
    let pendingAuths = '';
    let appStatus = '';
    let statusDate = '';
    if (rows) {
      status = rows.tinStatus;
      pendingAuths = rows.pendingAuth;
      statusDate = rows.dtmStatusDate != '' ? rows.dtmStatusDate : '';

      if (status == 8) {
        appStatus = '<div>Application Approved</div>';
        if (statusDate) {
          appStatus += '<small>On : ' + rows.dtmStatusDate + '</small>';
        }
      } else {
        appStatus = '<div>Pending at ' + rows.pendingAuths + '</div><small>';

        if (statusDate) {
          appStatus += '<small>From : ' + rows.dtmStatusDate + '</small>';
        }
      }
    }
    return appStatus;
  }
}
