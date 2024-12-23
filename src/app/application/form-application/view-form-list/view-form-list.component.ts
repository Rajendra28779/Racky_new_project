import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonconfigService } from 'src/app/services/form-services/commonconfig.service';
import { EncrypyDecrpyService } from 'src/app/services/form-services/encrypy-decrpy.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { ManageformconfigService } from 'src/app/services/form-services/manageformconfig.service';

@Component({
  selector: 'app-view-form-list',
  templateUrl: './view-form-list.component.html',
  styleUrls: ['./view-form-list.component.scss'],
})
export class ViewFormListComponent implements OnInit {
  public loading = false;
  title: any;
  tablist: any;
  utillist: any;
  messaageslist: any;
  jsonurl = 'assets/js/_configs/viewFormList.config.json';
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
  letterIdArray: any = [];
  chkAll: any = 0;
  sevName: any = 'addManageForm';

  constructor(
    private route: Router,
    private httpClient: HttpClient,
    private commonService: CommonconfigService,
    private ManageformconfigService: ManageformconfigService,
    private encDec: EncrypyDecrpyService
  ) {}

  ngOnInit(): void {
   this.viewFormApplication(142)
    this.loadconfig();
    this.viewItems();
    this.getModuleNames();
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

  getModuleNames() {
    this.loading = true;
    this.commonService.getModules().subscribe((res: any) => {
      if (res.status === 200) {
        this.loading = false;
        this.moduleNames = res.result;
      } else {
        console.log(res.messages);
      }
    });
  }
  viewItems() {
    this.selModuleName = 0;
    this.txtFormName = null;
    let formParams = {
      moduleId: '',
      iteamId: '',
      vchProcessName: '',
    };
    this.loading = true;
    this.ManageformconfigService.viewManageForm(formParams).subscribe(
      (response: any) => {
        let respData = response.RESPONSE_DATA;
        let respToken = response.RESPONSE_TOKEN;
        let res = JSON.parse(atob(respData));

        if (res.status == 200) {
          this.loading = false;
          this.formsList = res.result;
        } else {
          Swal.fire({
            icon: 'error',
            text: 'Something Went Wrong',
          });
        }
      }
    );
  }
  onTableDataChange(event: any) {
    this.page = event;
  }
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
  }

  viewSearchList() {
    let moduleId = this.selModuleName;
    let formName = this.txtFormName;
    this.loading = true;
    let formParams = {
      moduleId: moduleId,
      iteamId: '',
      vchProcessName: formName,
    };
    this.ManageformconfigService.viewManageForm(formParams).subscribe(
      (response: any) => {
        let respData = response.RESPONSE_DATA;
        let respToken = response.RESPONSE_TOKEN;
        let res = JSON.parse(atob(respData));

        if (res.status == 200) {
          this.loading = false;
          this.formsList = res.result;
          this.isFlag = true;
        } else {
          this.isFlag = false;
          Swal.fire({
            icon: 'error',
            text: this.messaageslist.errorMsg,
          });
        }
      }
    );
  }

  viewFormApplication(formId: any) {
    let encSchemeStr = this.encDec.encText(formId.toString());
    this.route.navigate([
      '/application/pending-application',
      encSchemeStr,
    ]);
  }
  nullidsArray() {
    this.letterIdArray = [];
  }
}
