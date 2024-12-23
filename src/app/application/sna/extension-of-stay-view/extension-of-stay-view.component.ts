import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { PreauthService } from '../../Services/preauth.service';
import { Router } from '@angular/router';
declare let $: any;
@Component({
  selector: 'app-extension-of-stay-view',
  templateUrl: './extension-of-stay-view.component.html',
  styleUrls: ['./extension-of-stay-view.component.scss']
})
export class ExtensionOfStayViewComponent implements OnInit {
  extentionList: any = [];
  txtsearchDate: any;
  pageElement: any;
  currentPage: any;
  showPegi: boolean;
  user: any;
  constructor(
    public headerService: HeaderService,
    private sessionService: SessionStorageService,
    public preauthService: PreauthService,
    public route: Router
  ) {}

  ngOnInit(): void {
    this.headerService.setTitle('Action taken list');
    this.user = this.sessionService.decryptSessionData('user');
    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
      maxDate: new Date(),
      daysOfWeekDisabled: ['', 7],
    });
    this.getExtentionList();
  }
  resData: any;
  getExtentionList() {
    let userId = this.user.userId;
    let fromDate = $('#formdate').val();
    let toDate = $('#todate').val();
    if (Date.parse(fromDate) > Date.parse(toDate)) {
      this.swal('', ' From Date should be less To Date', 'error');
      return;
    }
    let requestData = {
      userId: userId,
      fromDate: fromDate,
      toDate: toDate,
      action: 'B',
    };
    console.log(requestData);
    this.preauthService.getExtentionList(requestData).subscribe(
      (data) => {
        this.resData = data;
        if (this.resData.status == 200) {
          this.extentionList = this.resData.data;
          if (this.extentionList.length) {
            this.currentPage = 1;
            this.pageElement = 50;
            this.showPegi = true;
          } else {
            this.showPegi = false;
          }
        } else {
          this.swal('', 'Something went wrong.', 'error');
        }
      },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      }
    );
  }
  reset() {
    window.location.reload();
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
  statusSubmit(urn, id) {
    let state = {
      urnNo: urn,
      extensionId: id,
    };
    localStorage.setItem('extsndata', JSON.stringify(state));
    this.route.navigate(['/application/extensionrequestdetails']);
  }
}
