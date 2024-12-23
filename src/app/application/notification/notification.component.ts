import { Component, OnInit } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { HeaderService } from '../header.service';
import { UsercreateService } from '../Services/usercreate.service';
declare let $: any;
import { NotificationService } from '../Services/notification.service'
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CreatecpdserviceService } from 'src/app/application/Services/createcpdservice.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  groupList: any;
  maxChars = 500;
  user: any;
  placeHolder = "Select Group";
  user1: any;
  id: any;
  content: any;
  fdate: any;
  tdate: any;
  groupid: any = "";
  showbth: boolean;
  status: any;
  dataa: any
  fileToUpload?: File;
  fileToUpload2?: File;
  flag: any = false;
  documentType: any;
  docpath: any;
  popupFlag: any = "";




  constructor(public headerService: HeaderService, private route: Router, private encryptionService: EncryptionService, private userService: UsercreateService, private notificationservice: NotificationService, private sessionService: SessionStorageService) {
    this.user1 = this.route.getCurrentNavigation().extras.state;
  }
  dropdownSettings: IDropdownSettings = {};
  ngOnInit(): void {
    this.user = this.sessionService.decryptSessionData("user");
    this.headerService.setTitle("Notification");
    this.showbth = false;
    let dat = new Date();
    var today = new Date(dat.getFullYear(), dat.getMonth(), dat.getDate());
    $('.selectpicker').selectpicker();

    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
      // endDate: '0d',
      minDate: today,
      daysOfWeekDisabled: ['', 7],
    });
    $('.timepicker').datetimepicker({
      format: 'LT',
      daysOfWeekDisabled: ['', 7],
    });
    $('.datetimepicker').datetimepicker({
      format: 'YYYY-MM-DD LT',
      daysOfWeekDisabled: ['', 7],
    });
    var date = new Date();
    let year = date.getFullYear();
    let date1 = '01';
    let date2 = date.getDate();
    let month: any = date.getMonth();
    let month1: any = date.getMonth() - 1;
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
    var frstDay = date1 + "-" + month + "-" + year;
    var secoundDay = date2 + "-" + month + "-" + year;
    this.fdate = secoundDay
    this.tdate = secoundDay
    this.getGroupList();
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'typeId',
      textField: 'groupTypeName',
      itemsShowLimit: 0,
      allowSearchFilter: true,
      selectAllText: 'Select All',
      unSelectAllText: "Un-Select All",
    };
    if (this.user1 != undefined) {
      this.id = this.user1.id
      this.content = this.user1.content
      this.fdate = this.user1.fromdate
      this.tdate = this.user1.Todate
      this.groupid = this.user1.groupid
      this.status = this.user1.status
      this.showbth = true;
      this.docpath = this.user1.docpath
      this.popupFlag = this.user1.popupFlag == null ? "" : this.user1.popupFlag
    }
  }
  yes($event: any) {
    this.status = 0;
  }

  no($event: any) {
    this.status = 1;
  }
  handleFileInput(event: any) {
    this.flag = false;
    this.fileToUpload2 = event.target.files[0];
    if (this.fileToUpload2 != null || this.fileToUpload2 != undefined) {

      if (Math.round(this.fileToUpload2.size / 1024) >= 8192) {
        this.swal('Warning', ' Please Provide Document Size Less than 8MB', 'warning');
        $('#notficationdoc').val('');
        this.fileToUpload = event.target.files[0];
        this.flag = false;
      } else {
        this.fileToUpload = event.target.files[0];
        this.flag = true;
      }
    } else {

    }
  }

  getGroupList() {
    this.userService.getGroupList().subscribe(
      (response: any) => {
        response = this.encryptionService.getDecryptedData(response);
        this.groupList = response.data;

        // for(var i=0;i<groups.length;i++) {
        //   var g = groups[i];
        //   if(g.typeId!=3&&g.typeId!=5) {
        //     this.groupList.push(g);
        //   }
        // }
      },
      (error) => console.log(error)
    )
  }
  keyPress(event: KeyboardEvent) {
    const pattern = /^[A-Za-z0-9.,-_ \\s]+$/;
    //var regex = new RegExp("^[A-Za-z0-9.,-\\s]+$");
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }
  onItemDeSelect(item) {
    for (var i = 0; i < this.groupList.length; i++) {
      if (item.typeId == this.groupList[i].typeId) {
        var index = this.groupList.indexOf(this.groupList[i]);
        if (index !== -1) {
          this.groupList.splice(index, 1);
        }
      }
    }
  }
  group = new FormGroup({
    groupid: new FormControl(''),
    functiondescription: new FormControl(''),
    fromdate: new FormControl(''),
    todate: new FormControl(''),
    popup: new FormControl('')
  });
  search() {

    let groupid = $('#groupId').val();
    let fromdate = $('#fromDate').val();
    let todate = $('#toDate').val();
    let message = $('#message').val();
    let popup = $('#popup').val();
    let createby = this.user.userId;
    if (groupid == null || groupid == "" || groupid == undefined) {
      this.swal("Info", "Please Fill Group", 'info');
      return;
    }
    if (fromdate == null || fromdate == "" || fromdate == undefined) {
      this.swal("Info", "Please Fill From Date", 'info');
      return;
    }
    if (Date.parse(fromdate) > Date.parse(todate)) {
      this.swal('Warning', ' From Date should be less Than To Date', 'error');
      return;
    }
    if (todate == null || todate == "" || todate == undefined) {
      this.swal("Info", "Please Fill To Date", 'info');
      return;
    }
    if (message == null || message == "" || message == undefined) {
      this.swal("Info", "Please Fill Message", 'info');
      return;
    }
    Swal.fire({
      title: 'Are you sure?',
      // text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Save it!'
    }).then((result) => {
      if (result.isConfirmed) {
        let object = {
          sgroup: groupid,
          fdate: fromdate,
          tdate: todate,
          noticeContent: message,
          screate: createby,
          file: this.fileToUpload,
          popupFlag: popup
        }

        this.notificationservice.save(object, this.fileToUpload).subscribe((data) => {
          this.dataa = data;
          if (this.dataa.status == "Success") {
            this.swal("Success", this.dataa.message, "success");
            this.route.navigate(['application/viewnotification']);

          } else if (this.dataa.status == "Failed") {
            this.swal("Error", this.dataa.message, "error");
          }
        }
        );
      }
    })
  }
  Reset() {
    window.location.reload();
  }
  cancel() {
    this.route.navigate(['application/viewnotification']);
  }
  update() {
    let groupid = $('#groupId').val();
    let fromdate = $('#fromDate').val();
    let todate = $('#toDate').val();
    let message = $('#message').val();
    let popup = $('#popup').val();
    let createby = this.user.userId;
    if (groupid == null || groupid == "" || groupid == undefined) {
      this.swal("Info", "Please Fill Group", 'info');
      return;
    }
    if (fromdate == null || fromdate == "" || fromdate == undefined) {
      this.swal("Info", "Please Fill Form Date", 'info');
      return;
    }
    if (Date.parse(fromdate) > Date.parse(todate)) {
      this.swal('Warning', ' From Date should be less To Date', 'error');
      return;
    }
    if (todate == null || todate == "" || todate == undefined) {
      this.swal("Info", "Please Fill To Date", 'info');
      return;
    }
    if (message == null || message == "" || message == undefined) {
      this.swal("Info", "Please Fill Message", 'info');
      return;
    }
    Swal.fire({
      title: 'Are you sure?',
      // text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Update it!'
    }).then((result) => {
      if (result.isConfirmed) {
        let object = {
          sgroup: groupid,
          fdate: fromdate,
          tdate: todate,
          noticeContent: message,
          screate: createby,
          notificationId: this.id,
          statusFlag: this.status,
          popupFlag: popup
        }
        this.notificationservice.Update(object, this.fileToUpload).subscribe((data) => {
          this.dataa = data;
          if (this.dataa.status == "Success") {
            this.swal("Success", this.dataa.message, "success");
            this.route.navigate(['application/viewnotification']);

          } else if (this.dataa.status == "Failed") {
            this.swal("Error", this.dataa.message, "error");
          }

        }
        );
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
  downloadfiletreatmentbill(event: any, fileName: any) {
    if (this.flag == false) {
      if (this.user) {
        let target = event.target;
        if (
          target.nodeName == 'A' ||
          target.nodeName == 'a' ||
          target.nodeName == 'IMG' ||
          target.nodeName == 'img' ||
          target.nodeName == 'I' ||
          target.nodeName == 'i'
        ) {
          target = $(target);
          let anchor = target.parent();
          anchor = anchor.get(0);

          if (fileName != null && fileName != '' && fileName != undefined) {
            let img = this.notificationservice.downloadFile(fileName);
            window.open(img, '_blank');
          } else {
            this.swal('Info', 'Please Select File', 'info');
          }
        }
      } else {
        this.swal('Info', 'Please Select File', 'info');
      }
    } else {
      if (this.fileToUpload) {
        const file: File | null = this.fileToUpload;
        if (file) {
          this.documentType = file.type;
          const blob = new Blob([file], { type: this.documentType });
          const url = window.URL.createObjectURL(blob);
          window.open(url);
        }
      } else {
        this.swal('Info', 'Please Select File', 'info');
      }
    }
  }
}
