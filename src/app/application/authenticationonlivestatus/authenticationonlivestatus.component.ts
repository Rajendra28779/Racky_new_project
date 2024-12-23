import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderService } from '../header.service';
import { MisreportService } from '../Services/misreport.service';
import { SnamasterserviceService } from '../Services/snamasterservice.service';
import { SnocreateserviceService } from '../Services/snocreateservice.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-authenticationonlivestatus',
  templateUrl: './authenticationonlivestatus.component.html',
  styleUrls: ['./authenticationonlivestatus.component.scss']
})
export class AuthenticationonlivestatusComponent implements OnInit {
  user: any;
  stateList: any = [];
  districtList: any = [];
  hospitalList: any = [];
  showsna: any;
  otp: any = []
  iris: any = []
  pos: any = []
  count1: any = 0
  count2: any = 0
  count3: any = 0
  textserch1: any;
  textserch2: any;
  textserch3: any;
  state: any;
  fromDate: any;
  dist: any;
  hospital: any;
  faceList: any = [];
  count4: any = 0;

  constructor(private route: Router, private misservice: MisreportService, private snoService: SnocreateserviceService, public headerService: HeaderService, private snamasterService: SnamasterserviceService,private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle('Live Status');
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
      format: 'YYYY-MM-DD LT',
      daysOfWeekDisabled: ['', 7],
    });
    if (this.user.groupId == 4) {
      this.showsna = 1
    } else if (this.user.groupId == 6) {
      this.showsna = 2
    } else {
      this.showsna = 3
    }
    this.getStateList();
  }

  getStateList() {
    if (this.showsna == 1) {
      this.snamasterService.getStateList(this.user.userId).subscribe(
        (response) => {
          this.stateList = response;
        },
        (error) => console.log(error)
      )
    } else {
      this.snoService.getStateList().subscribe(
        (response) => {
          this.stateList = response;
        },
        (error) => console.log(error)
      );
    }
  }
  OnChangeState(id) {
    $("#districtId").val("");
    localStorage.setItem("stateCode", id);
    if (this.showsna == 1) {
      this.snamasterService.getDistrictListByStateId(this.user.userId, id).subscribe(
        (response) => {
          this.districtList = response;
        },
        (error) => console.log(error)
      )
    } else if (this.showsna == 2) {
      this.snoService.getDistrictListByStateIddcid(this.user.userId, id).subscribe(
        (response) => {
          this.districtList = response;
        },
        (error) => console.log(error)
      )
    } else {
      this.snoService.getDistrictListByStateId(id).subscribe(
        (response) => {
          this.districtList = response;
        },
        (error) => console.log(error)
      )
    }

  }
  OnChangeDistrict(id) {
    var stateCode = localStorage.getItem("stateCode");
    if (this.showsna == 1) {
      this.snamasterService.getHospitalbyDistrictId(this.user.userId, id, stateCode).subscribe(
        (response) => {
          this.hospitalList = response;
        },
        (error) => console.log(error)
      )
    } else if (this.showsna == 2) {
      this.snoService.getHospitalbyDistrictIddcid(this.user.userId, id, stateCode).subscribe(
        (response) => {

          this.hospitalList = response;
        },
        (error) => console.log(error)
      )
    } else {
      this.snoService.getHospitalbyDistrictId(id, stateCode).subscribe(
        (response) => {
          this.hospitalList = response;
        },
        (error) => console.log(error)
      )
    }
  }

  reset() {
    $('#stateId').val('');
    this.districtList = [];
    this.hospitalList = [];
    this.otp = []; this.count1 = 0;
    this.iris = []; this.count2 = 0;
    this.pos = []; this.count3 = 0;
    this.faceList = []; this.count4 = 0;
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  details() {
    this.fromDate = $('#fromDate').val();
    if (this.fromDate == '' || this.fromDate == null || this.fromDate == undefined) {
      this.swal('', 'Please Select Authentication Date', 'error');
      return;
    }
    this.state = $('#stateId').val();
    this.dist = $('#districtId').val();
    this.hospital = $('#hospital').val();
    let userid;
    if (this.user.groupId == 1) {
      userid = ""
    } else {
      userid = this.user.userId
    }
    this.misservice.getauthlivestatus(this.fromDate, this.state, this.dist, this.hospital, userid).subscribe((data: any) => {
      this.otp = data.otp;
      this.count1 = this.otp.length
      if (this.count1 > 5) {
        document.getElementById('treatmentTable').classList.add('treatment-history-table-class', 'treatment-history-table-head-class');
      }
      this.iris = data.iris;
      this.count2 = this.iris.length
      if (this.count2 > 5) {
        document.getElementById('treatmentTable1').classList.add('treatment-history-table-class', 'treatment-history-table-head-class');
      }
      this.pos = data.pos;
      this.count3 = this.pos.length;
      if (this.count3 > 5) {
        document.getElementById('treatmentTable2').classList.add('treatment-history-table-class', 'treatment-history-table-head-class');
      }
      this.faceList = data.faceList;
      this.count4 = this.faceList.length;
      if (this.count4 > 5) {
        document.getElementById('treatmentTable3').classList.add('treatment-history-table-class', 'treatment-history-table-head-class');
      }
    })
  }
}
