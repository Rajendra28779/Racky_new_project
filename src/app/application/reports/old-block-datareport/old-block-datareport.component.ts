import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderService } from '../../header.service';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
declare let $: any;
import Swal from 'sweetalert2';
import { OldBlockDataService } from '../../Services/old-block-data.service';
import { environment } from 'src/environments/environment';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-old-block-datareport',
  templateUrl: './old-block-datareport.component.html',
  styleUrls: ['./old-block-datareport.component.scss']
})
export class OldBlockDatareportComponent implements OnInit {
  @ViewChild('auto') auto;
  @ViewChild('autocopy') autocopy;
  showdropdown: any;
  selectedItems: any = [];
  stateList: any = [];
  districtList: any = [];
  hospitalList: any;
  hospitalCode: any;
 
  keyword: any = 'hospitalName';
  user: any;
  name: any;
  userId: any;
  record: any;
  stat: any;
  dist: any;
  fromdate: any;
  todate: any;
  oldBlockCount: any = [];
  txtsearchDate: any;
  totalcount: any;
  sum: number;
  showPegi: boolean;
  currentPage: number;
  pageElement: number;
  hospitalname: any = 'All';
 
  statename: any = 'All';
  districtName: any = 'All';
  constructor(private snoService: SnocreateserviceService, public headerService: HeaderService, private route: Router,private sessionService: SessionStorageService,
    private oldBlockDataService: OldBlockDataService) { }

  ngOnInit(): void {
    // this.user = JSON.parse(sessionStorage.getItem("user"));
    this.user = this.sessionService.decryptSessionData("user");
    this.userId = this.user.userId;
    this.headerService.setTitle('Old Block Data Report');
    // this.user = JSON.parse(sessionStorage.getItem("user"));
    this.user = this.sessionService.decryptSessionData("user");
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
      format: 'DD-MMM-YYYY LT',
      daysOfWeekDisabled: ['', 7],
    });
    let month: any
    var date = new Date();
    let year = date.getFullYear();
    let date1 = '01';
    if(date.getFullYear()==0){
    year = year-1;
    month=11;
    }else{
      year= date.getFullYear() - 5;
      month=date.getMonth();
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
    var frstDay = date1 + "-" + month + "-" + year;
    $('input[name="fromDate"]').val(frstDay);
    $('input[name="fromDate"]').attr("placeholder", "From Date *");
    $('input[name="toDate"]').attr("placeholder", "To Date *");
    if (this.user.groupId == 4) {
      this.name = this.user.fullName;
      this.showdropdown = true;
    } else {
      this.showdropdown = false;
    }
    this.getStateList();
  }

  getStateList() {
    this.snoService.getStateList().subscribe(
      (response) => {
        this.stateList = [];
        this.stateList = response;
        this.record = this.stateList.length;
      },
      (error) => console.log(error)
    )
  }

  OnChangeState(id) {
    $("#districtId").val("");
    this.auto.clear();
    this.hospitalCode = "";
    this.selectedItems = [];
    localStorage.setItem("stateCode", id);
    this.snoService.getDistrictListByStateId(id).subscribe(
      (response) => {
        this.districtList = [];
        this.districtList = response;
      },
      (error) => console.log(error)
    )
  }

  OnChangeDistrict(id) {
    this.auto.clear();
    this.hospitalCode = "";
    this.selectedItems = [];
    var stateCode = localStorage.getItem("stateCode");
    this.snoService.getHospitalbyDistrictId(id, stateCode).subscribe(
      (response) => {
        this.hospitalList = [];
        this.hospitalList = response;
      },
      (error) => console.log(error)
    )
  }

  selectEvent1(item) {
    this.hospitalCode = "";
    this.hospitalCode = item.hospitalCode;
    this.hospitalname = item.hospitalName;
  }
  search() {
    let userId = this.user.userId;
    let fromDate = $('#fromDate').val();
    let toDate = $('#toDate').val();
    let stateId = $('#stateId').val();
    let districtId = $('#districtId').val();

    if (fromDate == null || fromDate == "" || fromDate == undefined) {
      this.swal("Info", "Please Select Actual Date of Discharge From", 'info');
      return;
    }
    if (toDate == null || toDate == "" || toDate == undefined) {
      this.swal("Info", "Please Select Actual Date of Discharge To", 'info');
      return;
    }
    if (Date.parse(fromDate) > Date.parse(toDate)) {
      this.swal('Info', ' From Date should be less than To Date', 'info');
      return;
    }
    if (stateId == null || stateId == "" || stateId == undefined) {
      this.swal("Info", "Please Select State", 'info');
      return;
    }
    if (districtId == null || districtId == "" || districtId == undefined) {
      this.swal("Info", "Please Select District", 'info');
      return;
    }
    
    if (this.hospitalCode == undefined) {
      this.hospitalCode = "";
    }
    this.stat = stateId;
    this.dist = districtId;
    let hospitalCode = this.hospitalCode;
    this.fromdate = fromDate;
    this.todate = toDate;
    this.oldBlockDataService.getOldBlockDataReport(userId, this.fromdate, this.todate, this.stat, this.dist, this.hospitalCode).subscribe(
      (result: any) => {
        this.oldBlockCount = result;
        this.totalcount = this.oldBlockCount.length;
        if (this.totalcount > 0) {
          let sum = 0;
          let sum1 = 0;
          for (let i = 0; i < this.oldBlockCount.length; i++) {
            sum += parseInt(this.oldBlockCount[i].caseCount);
          }
          this.sum = sum;
          this.showPegi = true
          this.currentPage = 1
          this.pageElement = 100
        } else {
          this.showPegi = true
        }
      },
      (error) => console.log(error)
    )
  }
  view(year) {
   
    for (let i = 0; i < this.stateList.length; i++) {
      if (this.stateList[i].stateCode == this.stat) {
        this.statename = this.stateList[i].stateName
      }
    }
    for (let i = 0; i < this.districtList.length; i++) {
      if (this.districtList[i].districtcode == this.dist) {
        this.districtName = this.districtList[i].districtname;
      }
    }
    for (let i = 0; i < this.hospitalList; i++) {
      if (this.hospitalCode == this.hospitalList[i].hospitalCode) {
        this.hospitalname = this.hospitalList[i].hospitalName;
      }
    }
    
    localStorage.setItem("stat", this.stat)
    localStorage.setItem("dist", this.dist)
    localStorage.setItem("hospitalCode", this.hospitalCode)
    localStorage.setItem("formDate", this.fromdate)
    localStorage.setItem("toDate", this.todate)
    localStorage.setItem("stateName", this.statename)
    localStorage.setItem("distName", this.districtName)
    localStorage.setItem("hospitalName", this.hospitalname);
    localStorage.setItem("name",this.name);
    localStorage.setItem("reportData",year);
   
    this.route.navigate([]).then(result => {
      window.open(environment.routingUrl + '/oldblockdatareportlist');
    });
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  getReset() {
    window.location.reload();
  }

}
