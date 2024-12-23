import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../header.service';
import { SnoCLaimDetailsService } from '../../Services/sno-claim-details.service';
declare let $: any;
import { SysrejreportserviceService } from 'src/app/application/Services/sysrejreportservice.service'
import Swal from 'sweetalert2';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-sysrejectedreports',
  templateUrl: './sysrejectedreports.component.html',
  styleUrls: ['./sysrejectedreports.component.scss']
})
export class SysrejectedreportsComponent implements OnInit {
  txtsearchDate:any;
  showPegi:any;
  pageElement:any;
  currentPage:any;
  user:any;
  stateData: any = [];
  statelist: Array<any> = [];
  stateCode: any;
  userId: any;
  distList: any;
  distCode: any;
  hospitalList: any;
  rejectelist:any;
  countrejectelist: any;

  constructor(private sessionService: SessionStorageService,public headerService:HeaderService,public snoService: SnoCLaimDetailsService,private sysrejrepservices:SysrejreportserviceService) { }

  ngOnInit(): void {
      this.headerService.setTitle('System Rejected Reports');
      this.headerService.isIndicate(true);
      this.headerService.isPrint(true);
      this.headerService.isDelete(true);
      this.headerService.isDownload(true);
      this.headerService.isBack(false);
      this.user = this.sessionService.decryptSessionData("user");
      this.currentPage = 1;
      this.pageElement = 10;
      this.getStateList();
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
        format: 'DD-MMM-YYYY LT',
        daysOfWeekDisabled: ['', 7],
      });
      var date = new Date();
      // var firstDay = new Date(date.getFullYear(), date.getMonth()-1, 1);
      // let day = moment(new Date(firstDay.substr(0, 16)));
      // let frstDay=firstDay.format('DD-MMM-YYYY');
      // var frstDay = firstDay.getDate()+"-"+(firstDay.getMonth()+1)+"-"+firstDay.getFullYear();
      let year = date.getFullYear();
      let date1 = '01';
      let date2 = date.getDate();
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
      var secoundDay = date2 + "-" + month + "-" + year;
      //Date input placeholder
      $('input[name="fromDate"]').val(frstDay);
      $('input[name="fromDate"]').attr("placeholder", "From Date *");

       $('input[name="toDate"]').val(secoundDay);
      $('input[name="toDate"]').attr("placeholder", "To Date *");
      this.search();
  }
  getStateList() {
    this.snoService.getStateList().subscribe((data: any) => {
      this.stateData = data;
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
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  search(){
    let formdate=$('#datepicker9').val().toString().trim();
    let todate=$('#datepicker10').val().toString().trim();
    if(Date.parse(formdate) > Date.parse(todate)){
      this.swal('', ' From Date should be less than To Date', 'error');
      return;
    }
    let state=$('#statecode1').val().toString().trim();
    let district=$('#distcode1').val().toString().trim();
    let hospitalcode=$('#hospitalcode').val().toString().trim();
    let userID=this.user.userId;
    this.sysrejrepservices.getsysrejlist(formdate,todate,state,district,hospitalcode,userID).subscribe((data) => {
      console.log(data);
      this.rejectelist=data;
      this.countrejectelist=this.rejectelist.length;
      if(this.countrejectelist>0){
        this.currentPage = 1;
          this.pageElement = 10;
          this.showPegi=true;
      }else{
        this.showPegi=false;
      }
    });
  }
  Reset(){
      window.location.reload();
  }
}
