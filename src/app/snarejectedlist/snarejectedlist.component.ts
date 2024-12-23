import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { HeaderService } from '../application/header.service';
import { SnoCLaimDetailsService } from '../application/Services/sno-claim-details.service';
import { JwtService } from '../services/jwt.service';
import { SessionStorageService } from '../services/session-storage.service';
import { SnarejectedserviceService } from '../snarejectedservice.service';
declare let $: any;
@Component({
  selector: 'app-snarejectedlist',
  templateUrl: './snarejectedlist.component.html',
  styleUrls: ['./snarejectedlist.component.scss']
})
export class SnarejectedlistComponent implements OnInit {
  statelist: Array<any> = [];
  user: any;
  stateCode: any;
  userId: any;
  distList: any;
  distCode: any;
  hospitalList: any;
  paymentlist: any = [];
  txtsearchDate: any;
  pageElement: any;
  currentPage:any;
  totalpaymentlist: any;
  record: any;
  stateData: any = [];
  showPegi: boolean;
  constructor(public headerService: HeaderService,public snoService: SnoCLaimDetailsService, public SnaService:SnarejectedserviceService,private jwtService: JwtService,public route: Router
   , private sessionService: SessionStorageService ) { }
  ngOnInit(): void {
    this.headerService.setTitle("SNA Rjected list")
    this.currentPage = 1;
    this.pageElement = 10;
    this.user = this.sessionService.decryptSessionData("user");
    $('.selectpicker').selectpicker();
    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
      // endDate: '0d',
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
    this.getStateList();
  }
  getStateList() {
    this.snoService.getStateList().subscribe((data: any) => {
      this.stateData = data;
      console.log(data);
      this.stateData.sort((a, b) => a.stateName.localeCompare(b.stateName));
      for (let j = 0; j < this.stateData.length; j++) {
        if (this.stateData[j].stateCode == '21') {
          this.statelist.push(this.stateData[j]);
        }
      }
      for (let i = 0; i < this.stateData.length; i++) {
        if (this.stateData[i].stateCode != '21') {
          this.statelist.push(this.stateData[i]);
        }
      }
      console.log(this.statelist)
    })
  }
  OnChangeState(event) {
    this.stateCode = event.target.value;
    this.userId = this.user.userId;
    this.snoService.getDistrictListByState(this.userId, this.stateCode).subscribe((data) => {
      this.distList = data;
      this.distList.sort((a, b) => a.DISTRICTNAME.localeCompare(b.DISTRICTNAME));
      console.log(data)
    })
  }
  OnChangeDist(event) {
    this.distCode = event.target.value;
    this.userId = this.user.userId;
    this.snoService.getHospitalByDist(this.userId, this.stateCode, this.distCode).subscribe((data) => {
      this.hospitalList = data;
      console.log(data);
    })
  }
  getPaymentfreezeDetails() {
    let userId = this.user.userId;
    let fromDate = $('#formdate1').val();
    let distCode1 = $('#dist').val();
    let hospitalCode = $('#hospital').val();
    let toDate = $('#todate1').val();
    let stateCode1 = $('#state').val();
    // let clamNo = $('#Type').val();
    //alert( Date.parse(fromDate)>Date.parse(toDate))
    if (Date.parse(fromDate) > Date.parse(toDate)) {
      this.swal('', 'From Date should be less than To Date', 'error');
      return;
    }
    this.SnaService.getpaymentlist(userId,fromDate, toDate, stateCode1, distCode1, hospitalCode).subscribe(data => {
      this.paymentlist = data;
      console.log(data);
      this.record = this.paymentlist.length;
      if (this.record > 0) {
        this.showPegi = true;
      }
      else {
        this.showPegi = false;
      }
    },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      });
  }
  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
    console.log(this.pageElement);
  }
  getActionDetails(claimid){
    localStorage.setItem("claimid", claimid)
    localStorage.setItem("token", this.jwtService.getJwtToken())
    this.route.navigate([]).then(result => { window.open(environment.routingUrl+'/trackingdetails'); });
    }
    onAction(id: any, urn: any, packageCode: any){
      let state = {
        transactionId: id,
        flag: 'APRV',
        URN: urn,
        packageCode: packageCode,
        Redirection:'SNA'
      }
      localStorage.setItem("actionData", JSON.stringify(state));
      this.route.navigate(['/application/snoapproval/action']);
      // this.route.navigate([]).then(result => { window.open(environment.routingUrl+'/application/snoapproval/action'); });
    }
    OnGetReset(){
      $('#state').val("");
      this.distList = null;
      this.hospitalList = null;
    }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
}
