import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/services/jwt.service';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { RejectRequestService } from '../../Services/reject-request.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-snasysrejbtn-enable-action',
  templateUrl: './snasysrejbtn-enable-action.component.html',
  styleUrls: ['./snasysrejbtn-enable-action.component.scss']
})
export class SnasysrejbtnEnableActionComponent implements OnInit {
  data: any;
  hosUserId: any;
  hospitalName: any;
  hospitalCode: any;
  nonUploadingStatus: any;
  nonComplianceStatus: any;
  childmessage: any;
  user: any;
  months: string;
  year: number;
  months2: any;
  secoundDay: string;
  claimRaisedBy: any;

  constructor(
    private jwtService: JwtService,
    public headerService: HeaderService,
    public route: Router,
    public rejectedrequest:RejectRequestService,
    private sessionService: SessionStorageService
    ) { }

  ngOnInit(): void {
    this.data = JSON.parse(localStorage.getItem('actionTakenData'));
    this.hosUserId = this.data.hosUserId;
    this.hospitalName = this.data.hospitalName;
    this.hospitalCode = this.data.hospitalCode;
    this.nonUploadingStatus = this.data.nonUploadingFlag;
    this.nonComplianceStatus = this.data.nonComplianceFlag;
    this.headerService.setTitle('Hospital Visibility');
    this.headerService.isIndicate(true);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.headerService.isBack(false);
    this.user = this.sessionService.decryptSessionData("user");
    $('.selectpicker').selectpicker();

    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
      // endDate: '0d',
      // maxDate: new Date(),
      daysOfWeekDisabled: ['', 7],
    });
    $('.timepicker').datetimepicker({
      format: 'LT',
      daysOfWeekDisabled: ['', 7],
    });
    $('.datetimepicker').datetimepicker({
      format: 'DD-MMM-YYYY LT',
      daysOfWeekDisabled: ['', 7],
    });
    var date = new Date();
    let year = date.getFullYear();
    let date2=date.getDate();
    this.months2=this.getMonthFrom( date.getMonth())
    this.secoundDay = date2 + "-" + this.months2 + "-" + year;
    $('input[name="toDate"]').attr('placeholder', 'To Date *');
  }
  getMonthFrom(month) {
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
    return month;
  }
  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }
  yes($event: any) {
    this.nonUploadingStatus = 0;
  }

  no($event: any) {
    this.nonUploadingStatus = 1;
  }
  yes1($event: any) {
    this.nonComplianceStatus = 0;
  }

  no1($event: any) {
    this.nonComplianceStatus = 1;
  }
  TakeAction() {
    this.claimRaisedBy = $('#datepicker2').val();
    let userId = this.user.userId;
    let fromDate = Date.parse(this.claimRaisedBy);
    let today1 = Date.parse(new Date().toLocaleString());
    //find 1 day more date
    // let today = new Date();
    // let tomorrow = new Date(today);
    // tomorrow.setDate(tomorrow.getDate() - 1);
    // let tomorrow1 = Date.parse(tomorrow.toLocaleString());
    if (this.claimRaisedBy == null || this.claimRaisedBy == '') {
      this.swal('', 'Button Visibility Date should not be blank', 'error');
      return;
    }
    if (fromDate < today1) {
      this.swal('', 'Button Visibility Date should be greater than Today', 'error');
      return;
    }
    Swal.fire({
      title: '',
      text: "Are you sure To Submit ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        const Data = new FormData();
        Data.append('snaUserId', userId);
        Data.append('claimBy', this.claimRaisedBy);
        Data.append('hospitalCode', this.hospitalCode);
        Data.append('hosUserId', this.hosUserId);
        Data.append('nonUploadingStatus',this.nonUploadingStatus);
        Data.append('nonComplianceStatus',this.nonComplianceStatus);
        this.rejectedrequest.saveActionButton(Data)
          .subscribe((data: any) => {
            if (data.status == "Success") {
              this.swal("Success", data.message, "success");
              this.route.navigate(['/application/sysrejectedbtnenable']);
            }
            else if (data.status == "Failed") {
              this.swal("Error", data.message, "error");
            }

          },
            (error) => {
              console.log(error);
              this.swal('', 'Something went wrong.', 'error');
            })
      }
    })
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
}
