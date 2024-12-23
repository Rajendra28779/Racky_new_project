import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HeaderService } from '../header.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ReferalService } from '../Services/referal.service';
import { JwtService } from 'src/app/services/jwt.service';
import { TableUtil } from '../util/TableUtil';
import { DatePipe } from '@angular/common';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-patient-referral-view',
  templateUrl: './patient-referral-view.component.html',
  styleUrls: ['./patient-referral-view.component.scss']
})
export class PatientReferralViewComponent implements OnInit {

  SearchForm: FormGroup;
  txtsearchData: any;
  currentUser: any;
  referralData: any;
  currentPage: any;
  showPegi: boolean;
  record: any;
  pageElement: any;
  invisibleButton: boolean;
  visibleButton: boolean;
  hospitalList: any = [];
  hospitacodedata:any

  report: any[];
  referral: any = {
    Slno: '',
    urn:'',
    patientName: '',
    regdNo: '',
    referralCode: '',
    referraldate: '',
    Authenticatestatus: '',
  };
  heading = [
    [
      'Sl No.',
      'URN',
      'Patient Name',
      'Regd No.',
      'Referral Code',
      'Referral Date',
      'Authenticate Status',
    ],
  ]

  constructor(public headerService: HeaderService,
    private referalService: ReferalService,
    private route: Router,
    private jwtService: JwtService,
    public datepipe: DatePipe,private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle('View Patient Referral Form');
    this.currentUser = this.sessionService.decryptSessionData("user");
    this.currentPage = 1;
    this.pageElement = 10;

    this.SearchForm = new FormGroup({
      'date1': new FormControl(null),
      'date2': new FormControl(null),
      'toHospital': new FormControl(null)

    });

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
    var date = new Date();
    let year = date.getFullYear();
    let date1 = '01';
    let month: any = date.getMonth();
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

    //Date input placeholder
    $('input[name="fromDate"]').val(frstDay);
    $('input[name="fromDate"]').attr("placeholder", "From Date *");

    // $('input[name="toDate"]').val('');
    $('input[name="toDate"]').attr("placeholder", "To Date *");
    this.gethospitallist();
    this.getPatientData();
  }

  getPatientData() {
    var userId = this.currentUser.userId;
    let fromDate = $('#date1').val();
    let toDate = $('#date2').val();
    this.hospitacodedata=$('#toHospital').val();
    if(this.hospitacodedata==null || this.hospitacodedata==undefined || this.hospitacodedata==''){
      this.hospitacodedata='';
    }
    if (Date.parse(fromDate) > Date.parse(toDate)) {
      this.swal('', ' From Date should be less To Date', 'error');
      return;
    }
    this.referalService.getReferralPatientDetails(userId, fromDate, toDate,this.hospitacodedata).subscribe((data: any) => {
      this.referralData = data;
      for (var i = 0; i < this.referralData.length; i++) {
        var referralThrough = this.referralData[i]
        if(referralThrough.authStatus=='Y'){
          referralThrough.authStatus='Authenticate'
        }
        if(referralThrough.authStatus=='R'){
          referralThrough.authStatus='Not Authenticate'
        }
        if(referralThrough.authStatus==null){
          referralThrough.authStatus='N/A'
        }

      }
      this.record = this.referralData.length;
      if (this.record > 0) {
        this.showPegi = true;
      }
      else {
        this.showPegi = false;
      }
      console.log(this.referralData)
    })

  }
  view(item: any) {

  }
  Submit(event: any) {

  }
  patientDetails(id: any) {
    console.log(id)
    localStorage.setItem("id", id)
    let state = {
      id: id,
    }
    localStorage.setItem("patientdetails", JSON.stringify(state));
    localStorage.setItem("token", this.jwtService.getJwtToken())
    this.route.navigate([]).then(result => { window.open(environment.routingUrl + '/patientdetails'); });
  }
  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
  }
  downloadReport() {
    this.report = [];
    let referralList: any;
    for(var i=0;i<this.referralData.length;i++){
      referralList=this.referralData[i];
      this.referral=[]
      this.referral.Slno=i+1;
      this.referral.urn=referralList.urn;
      this.referral.patientName=referralList.patientName;
      this.referral.regdNo=referralList.regdno;
      this.referral.referralCode=referralList.referralCode;
      this.referral.referraldate= this.datepipe.transform(referralList.referralDate,'dd-MMM-yy');
      this.referral.Authenticatestatus=referralList.authStatus;
      this.report.push(this.referral)
    }
    TableUtil.exportListToExcel(
      this.report, 'Patient Referral', this.heading
    );
  }
  resetField() {
    window.location.reload();
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  gethospitallist(){
  this.referalService.gethospitallist(this.currentUser.userId).subscribe((data: any) => {
    this.hospitalList = data;
    console.log(this.hospitalList)
  })
}
}
