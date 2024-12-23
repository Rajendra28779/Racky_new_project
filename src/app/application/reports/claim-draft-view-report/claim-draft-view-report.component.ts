import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../header.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { TableUtil } from '../../util/TableUtil';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { formatDate } from '@angular/common';
import { JwtService } from 'src/app/services/jwt.service';
import { Router } from '@angular/router';
import { SnoCLaimDetailsService } from '../../Services/sno-claim-details.service';
import { SnamasterserviceService } from '../../Services/snamasterservice.service';
import { ReportcountService } from '../../Services/reportcount.service';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-claim-draft-view-report',
  templateUrl: './claim-draft-view-report.component.html',
  styleUrls: ['./claim-draft-view-report.component.scss']
})
export class ClaimDraftViewReportComponent implements OnInit {

  childmessage: any;
  user: any;
  fromDate: any;
  toDate: any;
  hospital: any = '';
  districtId: any = '';
  stateId: any = '';
  month:any;
  year:any;
  summary:any;
  hospitalList: any = [];
  distList: any = [];
  statelist: any = [];
  stateCode: any;
  distCode: any;
  userId: any;
  showdropdown: boolean;
  cpdList: any = [];
  name: any="";
  searchType:any="";
  searchValue:any="";
  constructor(
    public headerService: HeaderService,
    private reportCount: ReportcountService,
    public snoService: SnamasterserviceService,
    public snoServices: SnoCLaimDetailsService,
    private snoService1: SnocreateserviceService,
    public route: Router,
    private jwtService: JwtService,private sessionService: SessionStorageService,
  ) {}

  ngOnInit(): void {
    // dynamic title
    // this.user = JSON.parse(sessionStorage.getItem('user'));
    this.user = this.sessionService.decryptSessionData("user");
    this.userId=this.user.userId;
    if (this.user.groupId == 3) {
      this.showdropdown = true;
    } else {
      this.showdropdown = false;
    }
    this.headerService.setTitle('Claim Draft View');
    this.headerService.isIndicate(true);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.headerService.isBack(false);
    // this.getStateList();

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
    let months: any = date.getMonth();
    if(months == -1){
      this.month = 'Dec';
      this.year = year-1;
    }else{
      this.month = this.getMonthFrom(months);
      this.year = year;
    }
    var frstDay = date1 + '-' + this.month + '-' + this.year;

    $('input[name="fromDate"]').val(frstDay);
    $('input[name="fromDate"]').attr('placeholder', 'From Date *');

    $('input[name="toDate"]').attr('placeholder', 'To Date *');
    this.getCPDList();
    this.getDetails();
  }
  getCPDList() {
    this.snoService1.getCPDList().subscribe(
      (response) => {
        this.cpdList = response;
        if(this.user.groupId==3){
          let data=this.cpdList
          for(let i=0;i<=this.cpdList.length;i++){
            if(data[i].userid==this.userId){
              this.name=data[i].userid;
              this.cpdList=[];
              this.cpdList.push(data[i]);
              break;
            }
         }
            }else{
           this.userId=this.user.userId
        }
      }
    )
  }

  resetTable() {
    window.location.reload();
  }

  getDate(date) {
    let year = date.getFullYear();
    let date1 = date.getDate();
    let months = date.getMonth();
    let month = this.getMonthFrom(months);
    var frstDay = date1 + '-' + month + '-' + year;
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
  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }
  stateData: any = [];
  getStateList() {
    this.statelist = [];
    this.snoService.getStateList(this.user.userId).subscribe((data: any) => {
      this.stateData = data;
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
      console.log(this.statelist);
    });
  }

  OnChangeState(event) {
    $('#districtId').val("");
    this.distCode = "";
    $('#hospital').val("");
    this.hospitalList = [];
    this.stateCode = event;
    this.snoService.getDistrictListByStateId(this.user.userId, this.stateCode).subscribe((data) => {
      this.distList = data;
      console.log(data);
    });
  }

  OnChangeDist(event) {
    $('#hospital').val("");
    this.distCode = event;
    this.snoService.getHospitalbyDistrictId(this.user.userId, this.distCode, this.stateCode).subscribe((data) => {
      this.hospitalList = data;
      console.log(data);
    });
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
  claimCount: any = [];
  requestData:any;
  getDetails() {
    let userId = this.name;
    let serachType=this.searchType;
    let searchValue=this.searchValue;
    this.requestData = {
      userId: userId,
      serachType: serachType,
      searchValue:searchValue,
    };
    console.log(this.requestData);
    // this.reportCount.getOldClaimCountProgressReport(this.requestData).subscribe(
    //   (data) => {
    //     this.summary = data;
    //     this.claimCount=this.summary;
    //     console.log(data);
    //   },
    //   (error) => {
    //     console.log(error);
    //     this.swal('Error', 'Something went wrong.', 'error');
    //   }
    // );
  }
  GetCountDetails(event: any) {
    let eventName = event.target.id;
    localStorage.setItem("fromDate", this.fromDate);
    localStorage.setItem("toDate", this.toDate);
    localStorage.setItem("eventName", eventName);
    localStorage.setItem("userId", this.requestData.userId);
    localStorage.setItem("stateId", this.requestData.stateId);
    localStorage.setItem("districtId", this.requestData.districtId);
    localStorage.setItem("hospitalId", this.requestData.hospitalId);
    localStorage.setItem("token", this.jwtService.getJwtToken());
    this.route.navigate([]).then(result => { window.open(environment.routingUrl + '/oldClaimProgressReportdetails'); });
  }

  heading1 = [
    [
      'Count Details',
      'Count',
    ]
  ];

  downloadList(type) {
    let item = this.summary;
    console.log(item);
    if (item==null) {
      this.swal('Info', 'No data found', 'info');
      return;
    }
    let stateName = 'All', districtName = 'All', hospitalName = 'All';
    for(var i=0;i<this.statelist.length;i++) {
      if(this.stateId==this.statelist[i].stateCode) {
        stateName=this.statelist[i].stateName;
      }
    }
    for(var i=0;i<this.distList.length;i++) {
      if(this.districtId==this.distList[i].districtcode) {
        districtName=this.distList[i].districtname;
      }
    }
    for(var i=0;i<this.hospitalList.length;i++) {
      if(this.hospital==this.hospitalList[i].hospitalCode) {
        hospitalName=this.hospitalList[i].hospitalName;
      }
    }

    if (type == 'xcl') {
      let list = [];
      list[0] = { countDetails: 'Total Case Re-Open', count: item.totalCaseReopen };
      list[1] = { countDetails: 'Total Re-Open of Approved Case', count: item.totalApprovedReopen };
      list[2] = { countDetails: 'Total Re-Open of SNA Rejected Case', count: item.totalSnaRejectedReopen };
      list[3] = { countDetails: 'SNA Queried And Pending At Hospital(Approved)', count: item.totalAPQueryPendingAtHospital };
      list[4] = { countDetails: 'Hospital Reclaimed and Pending At SNA(Approved)', count: item.totalAPQueryReClaimed };
      list[5] = { countDetails: 'Total SNA Approved(Approved)', count: item.totalAPSNAApproved};
      list[6] = { countDetails: 'Total SNA Rejected(Approved)', count: item.totalAPSNARejected};
      list[7] = { countDetails: 'SNA Queried And Pending At Hospital(SNA Rejected)', count: item.totalSNARejQueryPendingAtHospital };
      list[8] = { countDetails: 'Hospital Reclaimed and Pending At SNA(SNA Rejected)', count: item.totalSNARejQueryReClaimed };
      list[9] = { countDetails: 'Total SNA Approved(SNA Rejected)', count: item.totalSNARejSNAApproved};
      list[10] = { countDetails: 'Total SNA Rejected(SNA Rejected)', count: item.totalSNARejSNARejected};
      let filter =[];
      filter.push([['Discharge Date From', this.fromDate]]);
      filter.push([['Discharge Date To', this.toDate]]);
      filter.push([['State', stateName]]);
      filter.push([['District', districtName]]);
      filter.push([['Hospital', hospitalName]]);
      TableUtil.exportListToExcelWithFilter(list, "Old Claim Progress Report", this.heading1, filter);
    } else if (type == 'pdf') {
      const doc = new jsPDF('p', 'mm', [275, 225] );
      doc.text("Old Claim Progress Report", 14, 20);
      doc.setFontSize(10);
      doc.text("Actual Date Of Discharge From: "+this.fromDate+"\t Actual Date Of Discharge To: "+this.toDate, 14, 30);
      doc.text("State: "+stateName+"\t District: "+districtName+"\t Hospital: "+hospitalName, 14, 40);
      doc.text("Generated By: "+this.user.fullName+"\tGenerated On: " + formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString(), 14, 50);
      doc.setFontSize(12);
      let list = [];
      list[0] = [ 'Total Case Re-Open', item.totalCaseReopen ];
      list[1] = [ 'Total Re-Open of Approved Case', item.totalApprovedReopen ];
      list[2] = [ 'Total Re-Open of SNA Rejected Case', item.totalSnaRejectedReopen ];
      list[3] = [ 'SNA Queried And Pending At Hospital(Approved)', item.totalAPQueryPendingAtHospital ];
      list[4] = [ 'Hospital Reclaimed and Pending At SNA(Approved)', item.totalAPQueryReClaimed ];
      list[5] = [ 'Total SNA Approved(Approved)', item.totalAPSNAApproved ];
      list[6] = [ 'Total SNA Rejected(Approved)', item.totalAPSNARejected ];
      list[7] = [ 'SNA Queried And Pending At Hospital(SNA Rejected)', item.totalSNARejQueryPendingAtHospital ];
      list[8] = [ 'Hospital Reclaimed and Pending At SNA(SNA Rejected)', item.totalSNARejQueryReClaimed ];
      list[9] = [ 'Total SNA Approved(SNA Rejected)', item.totalSNARejSNAApproved ];
      list[10] = [ 'Total SNA Rejected(SNA Rejected)', item.totalSNARejSNARejected ];
      console.log(list);
      autoTable(doc, {
        head: this.heading1,
        body: list,
        theme: 'grid',
        startY: 60,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: {cellWidth: 175},
          1: {cellWidth: 20},
        }
      });
      let filename = 'GJAY_Old Claim Progress Report.pdf';
      doc.save(filename);
    }
  }

}
