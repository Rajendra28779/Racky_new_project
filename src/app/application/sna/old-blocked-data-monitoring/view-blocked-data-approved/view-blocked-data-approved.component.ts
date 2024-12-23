import { Component, OnInit } from '@angular/core';
import {HeaderService} from "../../../header.service";
import {SnoCLaimDetailsService} from "../../../Services/sno-claim-details.service";
import {OldBlockedClaimMonitoringService} from "../../../Services/old-blocked-claim-monitoring.service";
import {Router} from "@angular/router";
import Swal from 'sweetalert2';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { TableUtil } from 'src/app/application/util/TableUtil';
import { formatDate } from '@angular/common';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-view-blocked-data-approved',
  templateUrl: './view-blocked-data-approved.component.html',
  styleUrls: ['./view-blocked-data-approved.component.scss']
})
export class ViewBlockedDataApprovedComponent implements OnInit {

  user: any = this.sessionService.decryptSessionData("user");
  stateCode: any="0";
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
  ) { }

  ngOnInit(): void {
    this.headerService.setTitle('Action Taken Blocked Data');

    this.setPicker();
    this.getStateList();
    this.getActionTakenBlockedDataList();
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

  claimstatus:any=[
    {id:1,claimstatus:"Fresh Claim Pending At CPD."},
    {id:2,claimstatus:"Resettlment Claim Pending At CPD."},
    {id:3,claimstatus:"Claim Approved By CPD."},
    {id:4,claimstatus:"Claim Rejected By CPD."},
    {id:5,claimstatus:"Claim Query By CPD."},
    {id:6,claimstatus:"Claim Non Compliance By CPD."},
    {id:7,claimstatus:"Claim Approved By SNA."},
    {id:8,claimstatus:"Claim Rejected By SNA."},
    {id:9,claimstatus:"Claim Query By SNA."},
    {id:10,claimstatus:"Claim resettelment By SNA."},
    {id:11,claimstatus:"SNA Non Compliance "},
    {id:12,claimstatus:"Claim Unprocessed."},
  ]

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
    this.stateCode = event.target.value;
    let userId = this.user.userId;

    this.snoService.getDistrictListByState(userId, this.stateCode).subscribe(
      (data: any) => {
        this.districtList = data.sort((a, b) => a.DISTRICTNAME.localeCompare(b.DISTRICTNAME));
      }
    );
  }

  OnChangeDist(event: any) {
    this.districtCode = event.target.value;
    let userId = this.user.userId;

    this.snoService.getHospitalByDist(userId, this.stateCode, this.districtCode).subscribe(
      (data: any) => {
        this.hospitalList = data;
      }
    );
  }

  clmstatus:any;
  getActionTakenBlockedDataList(){
    this.fromdate=(document.querySelector('input[name="fromDate"]') as HTMLInputElement)?.value;
    this.todate= (document.querySelector('input[name="toDate"]') as HTMLInputElement)?.value;
    this.hospitalCode= $('#hospitalCode').val();
    this.flag= $('#status1').val();
    this.clmstatus= $('#currstatus').val();
    const request: any = {
      action: 'B',
      userId: this.user.userId,
      stateCode: this.stateCode,
      districtCode: this.districtCode,
      fromDate: this.fromdate,
      toDate: this.todate,
      hospitalCode: this.hospitalCode,
      flag: this.flag,
      clmstatus: this.clmstatus,
    };

    this.oldBlockedClaimService.getActionTakenBlockedDataList(request).subscribe((res: any) => {
      if(res.statusCode == 200 && res.status == 'success') {
        this.claimList = res.data;
        this.showPagination = true;
      } else {
        this.claimList = [];
        this.showPagination = false;
      }
    });
  }

  reset() {
    window.location.reload();
  }

  pageItemChange(event: any) {
    this.pageElement = event.target.value;
  }
  view(id: any, txnPackageDetailId: any) {
    let request: any = {
      id: id,
      action: 'C',
      pageStatus: 1,
      userId: this.user.userId,
      stateCode: this.stateCode,
      districtCode: this.districtCode,
      txnPackageDetailId: txnPackageDetailId,
      fromDate: (document.querySelector('input[name="fromDate"]') as HTMLInputElement)?.value,
      toDate: (document.querySelector('input[name="toDate"]') as HTMLInputElement)?.value,
      hospitalCode: (document.querySelector('#hospitalCode') as HTMLInputElement)?.value,
      flag: (document.querySelector('#status1') as HTMLSelectElement)?.value
    }

    this.sessionService.encryptSessionData('requestData',request);
    this.router.navigate(['/application/blockedDataApprovalDetails']);
  }

  getStatusColor(status: string): string {
    const colorMap = {
      'APPROVED': '#1aa81a',
      'QUERY': '#fcb00f',
      'REJECTED': '#da3b3b',
      'CANCELED BY HOSPITAL': '#13a9c4',
      'NA': '#000000'
    };
    return colorMap[status] || '';
  }
  report: any = [];
  sno: any = [];
  heading = [['Sl#', 'Invoice No','URN','Patient Name', 'Hospital Code','Hospital Name','Admission Date','Requested Date'
,'Procedure Code','Procedure Name','Date of Discharge','Claim Status','Claim Submit Date',
'Current CPD Name',' Current Claim Status','Status']];


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
      this.sno.push(sna.dateOfDischarge);
      this.sno.push(sna.claimStatus);
      this.sno.push(sna.claimSubmitDate);
      this.sno.push(sna.currentCPDName);
      this.sno.push(sna.currentClaimStatus);
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
    if(this.flag=="Y"){
      status="Approved";
    }else if(this.flag=="Q"){
      status="Query";
    }else if(this.flag=="R"){
      status="Rejected";
    }else if(this.flag=="C"){
      status="Unblocked By Hospital";
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
          'View ActionTaken OLD Blocked Data',
          this.heading,filter
        );
    }else{
      if(this.report==null || this.report.length==0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('l', 'mm',[397,280 ]);
      doc.setFontSize(20);
      doc.text("View ActionTaken OLD Blocked Data", 150, 15);
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
                // 10: {cellWidth: 50},
              }
            });
            doc.save('View_ActionTaken_OLD_Blocked_Data.pdf');

    }
  }


  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }

  showcount:any=false;
  showcountdata:any;
  viewcount(){
    this.fromdate=$('#fromDate').val();;
    this.todate= $('#toDate').val();;
    this.hospitalCode= $('#hospitalCode').val();
    this.flag= $('#status1').val();
    this.clmstatus= $('#currstatus').val();
    const request: any = {
      userId: this.user.userId,
      stateCode: this.stateCode,
      districtCode: this.districtCode,
      fromDate: this.fromdate,
      toDate: this.todate,
      hospitalCode: this.hospitalCode,
      flag: this.flag,
      clmstatus: this.clmstatus,
    };

    this.oldBlockedClaimService.viewblockeddataactioncount(request).subscribe((res: any) => {
      if(res.status == 200) {
        this.showcountdata = res.data;
        this.showcount=true;
      } else {
        this.swal("Error", "Something Went Wrong", "error");
      }
    });
  }
}
