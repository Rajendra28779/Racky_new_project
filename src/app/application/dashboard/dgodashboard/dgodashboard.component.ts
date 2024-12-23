import { Component, OnInit } from '@angular/core';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import { DcClaimService } from '../../Services/dc-claim.service';
import * as Highcharts from 'highcharts';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import { DatePipe } from '@angular/common';
import html2canvas from 'html2canvas';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-dgodashboard',
  templateUrl: './dgodashboard.component.html',
  styleUrls: ['./dgodashboard.component.scss']
})
export class DGODashboardComponent implements OnInit {

  graphToggleVal : number = 1;
  graphresolvedVal : number = 1;
  empaneltoggleVal : number = 1;


  selectedItems: any[];
  districtList: any;
  districtId: any='';
  districtList1: Object;
  districtId1:any='';
  fromDate: any='';
  toDate: any=''; 
  overmonth: any;
  overyear: any; 
  // fromDate1: any='';
  // toDate1: any=''; 
  // fromDate2: any='';
  // toDate2: any='';
  HosActive: any='Inactive';
  BenActive: any='active';
  MoActive: any='Inactive';
  NewActive: any='Inactive';
  EmlActive: any='Inactive';
  SocActive: any='Inactive';
  user: any;
  userId: any;
  constructor(private snoService1: SnocreateserviceService,private dsService:DcClaimService,public route: Router,private sessionService: SessionStorageService) { }
  
  ngOnInit(): void {
    this.user = this.sessionService.decryptSessionData("user");
    this.userId= this.user.userId;
    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
      maxDate: new Date()
    })
    $('.timepicker').datetimepicker({
      format: 'LT',
      daysOfWeekDisabled: ['', 7],
    });
    $('.datetimepicker').datetimepicker({
      format: 'DD-MMM-YYYY LT',
      daysOfWeekDisabled: ['', 7],
    });
    $('input[name="fromDate"]').val(this.changeDateFormat());
    $('input[name="toDate"]').val(this.changeDateFormat1());

    this.getAllDistrict();
    this.grievanceOfficerData();
  }
  changeDateFormat(){
    var date1 = new Date();
    let year1 = date1.getFullYear();
    let date2 = '01';
    let months: any = date1.getMonth();
    if(months == -1){
      this.overmonth = 'Dec';
      this.overyear = year1-1;
    }else{
      this.overmonth = this.getMonthFrom(months);
      this.overyear = year1;
    }
    var frstDay = date2 + '-' + this.overmonth + '-' + this.overyear;
    return frstDay;
  }
  changeDateFormat1(){
    var date1 = new Date();
    let year1 = date1.getFullYear();
    let date2 = date1.getDate();
    let months: any = date1.getMonth();
    if(months == -1){
      this.overmonth = 'Dec';
      this.overyear = year1-1;
    }else{
      this.overmonth = this.getMonthFrom(months);
      this.overyear = year1;
    }
    var frstDay = date2 + '-' + this.overmonth + '-' + this.overyear;
    return frstDay;
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
  getAllDistrict(){
    this.selectedItems = [];
    let id=21;
    this.snoService1.getDistrictListByStateId(id).subscribe(
      (response) => {
        this.districtList = response;
        this.districtList1 = response;
        console.log(response);
      },
      (error) => console.log(error)
    )
  }
  flag:any='';
  GoInrCount:any;
  ChangeStatus(event:any){
    // alert(this.fromDate);
      this.flag=event;
      this.setActive(this.flag);
      let stateCode=21;
      let districtCode=this.districtId;
      let userId = this.user.userId;
      let section='OTH';
      let InSection=this.flag;
      let fromDate=$('#fromDate').val();
      let toDate=$('#toDate').val();
      let requestData4 = {
        userId: userId,
        stateCode: stateCode,
        districtCode: districtCode,
        sectionFlag: section,
        inSection:InSection,
        fromDate:new Date(fromDate),
        toDate:new Date(toDate)
      };
      console.log(requestData4);
      this.dsService.getGOMediumReport(requestData4).subscribe(
          (data:any) => {
            console.log(data);
            this.GoInrCount=data.InrTotal;
          },
          (error) => {
            console.log(error);
            this.swal('Error', 'Something went wrong.', 'error');
          }
        );
  
  }
  setActive(flag:any){
    if(flag=='HOS'){
      this.HosActive='active';
      this.BenActive='Inactive';
      this.MoActive='Inactive';
      this.NewActive='Inactive';
      this.EmlActive='Inactive';
      this.SocActive='Inactive';
    }else if(flag=='BNF'){
      this.HosActive='Inactive';
      this.BenActive='active';
      this.MoActive='Inactive';
      this.NewActive='Inactive';
      this.EmlActive='Inactive';
      this.SocActive='Inactive';
    }else if(flag=='MS'){
      this.HosActive='Inactive';
      this.BenActive='Inactive';
      this.MoActive='active';
      this.NewActive='Inactive';
      this.EmlActive='Inactive';
      this.SocActive='Inactive';
    }else if(flag=='NP'){
      this.HosActive='Inactive';
      this.BenActive='Inactive';
      this.MoActive='Inactive';
      this.NewActive='active';
      this.EmlActive='Inactive';
      this.SocActive='Inactive';
    }else if(flag=='EL'){
      this.HosActive='Inactive';
      this.BenActive='Inactive';
      this.MoActive='Inactive';
      this.NewActive='Inactive';
      this.EmlActive='active';
      this.SocActive='Inactive';
    }else if(flag=='SM'){
      this.HosActive='Inactive';
      this.BenActive='Inactive';
      this.MoActive='Inactive';
      this.NewActive='Inactive';
      this.EmlActive='Inactive';
      this.SocActive='active';
    }

  }
  GoTotalCount:any;
  requestData4:any;
  grievanceOfficerData(){
    // this.flag=event;
      // this.setActive(this.flag);
      let stateCode=21;
      let districtCode=this.districtId;
      let userId = this.user.userId;
      let section='GO';
      // let InSection=this.flag;
      let fromDate=$('#fromDate').val();
      let toDate=$('#toDate').val();
      this.requestData4 = {
        userId: userId,
        stateCode: stateCode,
        districtCode: districtCode,
        sectionFlag: section,
        fromDate:new Date(fromDate),
        toDate:new Date(toDate)
      };
      console.log(this.requestData4);
      this.dsService.getGOSecReport(this.requestData4).subscribe(
          (data:any) => {
            console.log(data);
            this.GoTotalCount=data.GOTotal;
            this.ChangeStatus('HOS');
          },
          (error) => {
            console.log(error);
            this.swal('Error', 'Something went wrong.', 'error');
          }
        );
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
  ngAfterViewInit() {
    $('#fromDate,#toDate').datetimepicker().on('dp.change', (e) => {
      const selectedDate = $('input[name="fromDate"]').val();
      console.log('Selected date:', selectedDate);
      this.grievanceOfficerData();
    });
  }
  public openPDF(): void {
    let DATA: any = document.getElementById('contentData');

    html2canvas(DATA).then((canvas) => {
     
      let fileWidth = 230;
      let pageheight=273;
      let fileHeight = ((canvas.height * fileWidth) / canvas.width)+80;
      //alert(fileHeight);
      if(fileHeight<Number(477.3951219512195)){
      let heightleft = fileHeight;
      heightleft -= pageheight;
      const FILEURI = canvas.toDataURL('image/jpeg',1.0);


      let PDF = new jsPDF('p', 'mm', [280, 250]);
      //PDF.setFontSize(12);
      //PDF.text("Grievance Officer Dashboard", 95, 10);
      //PDF.text("Generated By: "+this.user.fullName+"\tGenerated On: " + formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString(), 14, 17);
      PDF.setFontSize(15);
      PDF.text("Grievance Officer Dashboard", 90, 9);
      PDF.setFontSize(12);
      PDF.text("Generated By: " + this.user.fullName, 14, 16);
      PDF.text("Generated On: " + this.convertDate(new Date()), 14, 22);
      let position = 30;
      PDF.addImage(FILEURI, 'JPEG', 10, position, fileWidth, fileHeight+70,'',"FAST");
      while(heightleft >= 0){
        let position = (heightleft - fileHeight)+67;
        PDF.addPage();
        PDF.addImage(FILEURI, 'JPEG', 10, position, fileWidth, fileHeight,'',"FAST");
        heightleft -= pageheight;
      }
      // PDF.prin
      //PDF.output('dataurlnewwindow');
      PDF.save('Grievance OfficerDashboard Data.pdf');
      //PDF.restore();
      }
      else{
      let heightleft = fileHeight;
      heightleft -= pageheight;
      const FILEURI = canvas.toDataURL('image/jpeg',1.0);
      let PDF = new jsPDF('p', 'mm', [280, 250]);
      PDF.setFontSize(15);
      PDF.text("Grievance Officer Dashboard", 90, 9);
      PDF.setFontSize(12);
      PDF.text("Generated By: " + this.user.fullName, 14, 16);
      PDF.text("Generated On: " + this.convertDate(new Date()), 14, 22);
      let position = 30;
      PDF.addImage(FILEURI, 'JPEG', 10, position, fileWidth, fileHeight,'',"FAST");
      while(heightleft >= 0){
        let position = (heightleft - fileHeight)+25;
        PDF.addPage();
        PDF.addImage(FILEURI, 'JPEG', 10, position, fileWidth, fileHeight,'',"FAST");
        heightleft -= pageheight;
      }
      // PDF.prin
      //PDF.output('dataurlnewwindow');
      PDF.save('Grievance OfficerDashboard Data.pdf');
      //PDF.restore();

      }
    });
  }
  convertDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy hh:mm:ss a');
    return date;
  }
  GetCountDetails(event:any){
    let eventName=event;
    let innerFlag=this.flag;
    localStorage.setItem("fromDate", $('#fromDate').val());
    localStorage.setItem("toDate", $('#toDate').val());
    localStorage.setItem("innerFlag",this.flag);
    localStorage.setItem("eventName",eventName);
    localStorage.setItem("stateId", this.requestData4.stateCode);
    localStorage.setItem("districtId", this.requestData4.districtCode);
    this.route.navigate([]).then(result => { window.open(environment.routingUrl+'/grievanceReportDetails');});    
  }
}
