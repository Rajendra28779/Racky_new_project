import { Component, OnInit } from '@angular/core';
import {HeaderService} from "../../../header.service";
import {SnoCLaimDetailsService} from "../../../Services/sno-claim-details.service";
import {OldBlockedClaimMonitoringService} from "../../../Services/old-blocked-claim-monitoring.service";
import {Router} from "@angular/router";
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import Swal from 'sweetalert2';
import { TableUtil } from 'src/app/application/util/TableUtil';
import { formatDate } from '@angular/common';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-blocked-data-approval',
  templateUrl: './blocked-data-approval.component.html',
  styleUrls: ['./blocked-data-approval.component.scss']
})
export class BlockedDataApprovalComponent implements OnInit {

  user: any = this.sessionService.decryptSessionData("user");
  stateCode: any="0"
  districtCode: any="0";
  stateList: any[] = [];
  districtList: any[] = [];
  hospitalList: any[] = [];
  claimList: any[] = [];
  showPagination: boolean = false;
  pageElement: any = 25;
  currentPage: any = 1;
  searchFilterText: any;
  fromdate:any;
  todate:any;
  flag: any='A';
  hospitalCode: any="";
  dataRequest :any


  constructor(
    private headerService: HeaderService,
    private snoService: SnoCLaimDetailsService,
    private oldBlockedClaimService: OldBlockedClaimMonitoringService,
    private router: Router,
    private sessionService: SessionStorageService
  ) {
  }

  ngOnInit(): void {
    this.headerService.setTitle('Blocked Data Approval');
    this.dataRequest = this.sessionService.decryptSessionData('oldrequestData');
    this.setPicker();
    this.getStateList();
    if(this.dataRequest==null || this.dataRequest==undefined) {
      this.getOldBlockedClaimList();
    }else{
      this.setform();
    }

  }

  setPicker() {
    $('.selectpicker').selectpicker();
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const previousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
    const formatMonth = new Intl.DateTimeFormat('en', {month: 'short'}).format;
    const month = formatMonth(previousMonth);
    const firstDay = `01-Jan-2022`;

    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
      maxDate: currentDate,
      daysOfWeekDisabled: ['', 7],
    });

    $('.timepicker').datetimepicker({
      format: 'LT',
      daysOfWeekDisabled: ['', 7],
    });

    $('.datetimepicker').datetimepicker({
      format: 'DD-MM-YYYY LT',
      daysOfWeekDisabled: ['', 7],
    });

    $('input[name="fromDate"]').val(firstDay).attr('placeholder', 'From Date *');
    $('input[name="toDate"]').attr('placeholder', 'To Date *');
  }

  getStateList() {
    this.snoService.getStateList().subscribe(
      (data: any) => {
        let stateData = data;
        stateData.sort((a, b) => a.stateName.localeCompare(b.stateName));

        this.stateList = stateData.filter(state => state.stateCode === '21');
        this.stateList.push(...stateData.filter(state => state.stateCode !== '21'));
      }
    );
  }

  OnChangeState(event: any) {
    this.stateCode = event;
    let userId = this.user.userId;

    this.snoService.getDistrictListByState(userId, this.stateCode).subscribe(
      (data: any) => {
        this.districtList = data.sort((a, b) => a.DISTRICTNAME.localeCompare(b.DISTRICTNAME));
      }
    );
  }

  OnChangeDist(event: any) {
    this.districtCode = event;
    let userId = this.user.userId;

    this.snoService.getHospitalByDist(userId, this.stateCode, this.districtCode).subscribe(
      (data: any) => {
        this.hospitalList = data;
      }
    );
  }

  setform(){
    let date = new Date(this.dataRequest.fromDate);
      let fromDate = this.getDate(date);
      $('input[name="fromDate"]').val(fromDate);
      let date1 = new Date(this.dataRequest.toDate);
      let toDate = this.getDate(date1);
      $('input[name="toDate"]').val(toDate);
      this.stateCode = this.dataRequest.stateCode;
      this.OnChangeState(this.stateCode);
      this.districtCode = this.dataRequest.districtCode;
      this.OnChangeDist(this.districtCode);
      this.hospitalCode = this.dataRequest.hospitalCode;
      this.flag = this.dataRequest.flag;
      this.getOldBlockedClaimList();
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

  getDate(date) {
    let year = date.getFullYear();
    let date1 = date.getDate();
    if (date1.toString().length === 1) {
      date1 = '0' + date1;
    }
    let months = date.getMonth();
    let month = this.getMonthFrom(months);
    var frstDay = date1 + '-' + month + '-' + year;
    return frstDay;
  }

  getOldBlockedClaimList(): void {
    this.fromdate=(document.querySelector('input[name="fromDate"]') as HTMLInputElement)?.value
    this.todate= (document.querySelector('input[name="toDate"]') as HTMLInputElement)?.value
    // this.hospitalCode= (document.querySelector('#hospitalCode') as HTMLInputElement)?.value,
    // this.flag= (document.querySelector('#status') as HTMLSelectElement)?.value
    const request: any = {
      action: 'A',
      userId: this.user.userId,
      stateCode: this.stateCode,
      districtCode: this.districtCode,
      fromDate: this.fromdate,
      toDate: this.todate,
      hospitalCode: this.hospitalCode,
      flag: this.flag
    };
    sessionStorage.removeItem('oldrequestData');
    this.sessionService.encryptSessionData('oldrequestData', request);
    this.oldBlockedClaimService.getOldBlockedClaimList(request).subscribe((response: any) => {
      if (response.statusCode === 200 && response.status === 'success') {
        this.claimList = response.data;
        this.showPagination = true;
      } else {
        this.claimList = [];
        this.showPagination = false;
      }
    });
  }

  pageItemChange(event: any) {
    this.pageElement = event.target.value;
  }

  action(id: any, txnPackageDetailId: any) {
    let request: any = {
      id: id,
      action: 'C',
      pageStatus: 0,
      userId: this.user.userId,
      stateCode: this.stateCode,
      districtCode: this.districtCode,
      txnPackageDetailId: txnPackageDetailId,
      fromDate: (document.querySelector('input[name="fromDate"]') as HTMLInputElement)?.value,
      toDate: (document.querySelector('input[name="toDate"]') as HTMLInputElement)?.value,
      hospitalCode: (document.querySelector('#hospitalCode') as HTMLInputElement)?.value,
      flag: (document.querySelector('#status') as HTMLSelectElement)?.value
    }

    this.sessionService.encryptSessionData('requestData', request);
    this.router.navigate(['/application/blockedDataApprovalDetails']);
  }

  reset() {
    sessionStorage.removeItem('oldrequestData');
    window.location.reload();
  }

  getStatusColor(status: string): string {
    const colorMap = {
      'FRESH': '#0d980d',
      'QUERY-COMPLIED': '#fcb00f'
    };
    return colorMap[status] || '';
  }

report: any = [];
  sno: any = [];
  heading = [['Sl#', 'Invoice No','URN','Patient Name', 'Hospital Code','Hospital Name','Admission Date','Requested Date'
,'Procedure Code','Procedure Name','Hospital Remarks','Status']];


  downloadList(no:any){
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy = this.user.fullName;
    this.report = [];
    let sna: any;
    for (var i = 0; i < this.claimList.length; i++) {
      sna=this.claimList[i];
      this.sno=[];
      this.sno.push(i+1);
      this.sno.push(sna.invoiceNo);
      this.sno.push(sna.urn);
      this.sno.push(sna.patientName);
      this.sno.push(sna.hospitalCode);
      this.sno.push(sna.hospitalName);
      this.sno.push(sna.admissionDate);
      this.sno.push(sna.requestDate);
      this.sno.push(sna.procedureCode);
      this.sno.push(sna.procedureName);
      this.sno.push(sna.hospitalRemark);
      this.sno.push(sna.status);
      this.report.push(this.sno);
    }
    let statename="All";
    let districtName="All";
    let hospitalname="All";
    for (let i = 0; i < this.stateList.length; i++) {
      if (this.stateList[i].stateCode == this.stateCode) {
        statename = this.stateList[i].stateName
      }
    }
    for (let i = 0; i < this.districtList.length; i++) {
      if (this.districtList[i].districtcode == this.districtCode) {
        districtName = this.districtList[i].districtname;
      }
    }
    for (let i = 0; i < this.hospitalList.length; i++) {
      if (this.hospitalCode == this.hospitalList[i].hospitalCode) {
        hospitalname = this.hospitalList[i].hospitalName;
      }
    }
let status;
    if(this.flag=="Q"){
      status="Query Complied";
    }else if(this.flag=="N"){
      status="Fresh";
    }else{
      status="All";
      }
    if(no==1){
      let filter =[];
      filter.push([['Actual Date Of Discharge From', this.fromdate]]);
      filter.push([['Actual Date Of Discharge To', this.todate]]);
      filter.push([['State Name :- ', statename]]);
      filter.push([['District Name :- ', districtName]]);
      filter.push([['Hospital Name :- ', hospitalname]]);
      filter.push([['Status :- ', status]]);
        TableUtil.exportListToExcelWithFilter(
          this.report,
          'OLD Blocked Data Approval',
          this.heading,filter
        );
    }else{
      if(this.report==null || this.report.length==0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('l', 'mm',[397,280 ]);
      doc.setFontSize(20);
      doc.text("OLD Blocked Data Approval", 160, 15);
      doc.setFontSize(13);
      doc.text('Actual Date Of Discharge From :- '+ this.fromdate,15,25);
      doc.text('Actual Date Of Discharge To :- '+ this.todate,260,25);
      doc.text('State Name :- '+ statename,15,33);
      doc.text('District Name :- '+ districtName,260,33);
      doc.text('Hospital Name :- '+ hospitalname,15,41);
      doc.text('Status :- '+ status,260,41);
      doc.text('GeneratedOn :- '+generatedOn,260,49);
      doc.text('GeneratedBy :- '+generatedBy,14,49);
            autoTable(doc, {
              head: this.heading,
              body: this.report,
              theme: 'grid',
              startY: 55,
              headStyles: {
                fillColor: [26, 99, 54]
              },
              columnStyles: {
                0: {cellWidth: 10},
                10: {cellWidth: 50},
              }
            });
            doc.save('OLD_Blocked_Data_Approval.pdf');

    }
  }


  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
}
