import { CurrencyPipe, formatDate } from '@angular/common';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { OldBlockDataService } from '../../Services/old-block-data.service';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import { TableUtil } from '../../util/TableUtil';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-oldblock-data-viewlist',
  templateUrl: './oldblock-data-viewlist.component.html',
  styleUrls: ['./oldblock-data-viewlist.component.scss']
})
export class OldblockDataViewlistComponent implements OnInit {
  user:any
  txtsearchDate:any;
  stateList: any=[];
  districtList: any=[];
  hospitalList:any=[];
  list:any=[];
  showPegi: boolean;
  currentPage: any;
  pageElement: any;
  formdate:any;
  todate:any;
  totalcount:any=0;
  hospitalId:any='';
  hospitalname:any="All";
  keyword = "hospitalName";
  record:any=0;
  stetecode:any;
  distcode:any;

  constructor(private snoService: SnocreateserviceService, private sessionService: SessionStorageService,
    private route:Router, public headerService: HeaderService,private oldblocksrv:OldBlockDataService) { }

  ngOnInit(): void {
    this.headerService.setTitle("Old Block Data View List");
      this.user = this.sessionService.decryptSessionData("user");
      this.getStateList();
      $('.selectpicker').selectpicker();

      $('.datepicker').datetimepicker({
        format: 'DD-MMM-YYYY',
        // endDate: '0d',
        maxDate: new Date(),
        minDate: Date.parse('01-Dec-2022'),
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
      var frstDay = date1 + '-' + month + '-' + year;
      $('input[name="fromDate"]').val(frstDay);
      $('input[name="fromDate"]').attr('placeholder', 'From Date *');
      // $('input[name="toDate"]').val('');
      $('input[name="toDate"]').attr('placeholder', 'To Date *');

  }

  getStateList() {
    this.snoService.getStateList().subscribe(
      (response) => {
        this.stateList = response;
      },
      (error) => console.log(error)
    );
    }
    OnChangeState(id) {
      this.snoService.getDistrictListByStateId(id).subscribe(
        (response) => {
          this.districtList = response;
        },
        (error) => console.log(error)
      )
    }

    onchangeDistrict(id){
      let stateCode=$("#stateId").val();
      this.snoService.getHospitalbyDistrictId(id, stateCode).subscribe(
        (response) => {
          this.hospitalList = response;
          console.log(response);
        },
        (error) => console.log(error)
      )
    }

    selectEvent(item) {
      this.hospitalId = item.hospitalCode;
      this.hospitalname = item.hospitalName;
    }

    clearEvent() {
      this.hospitalId = '';
      this.hospitalname = 'All';
    }

    getReset(){
      window.location.reload();
    }

    Search(){
      this.formdate=$("#formdate").val()
      this.todate=$("#todate").val()
      this.stetecode=$("#stateId").val()
      this.distcode=$("#districtId").val()

      if (this.formdate==null || this.formdate== "" || this.formdate==undefined){
        this.swal("Warning", "Please Fill From Date", 'info');
        return;
      }
      if (this.todate==null || this.todate== "" || this.todate==undefined){
        this.swal("Warning", "Please Fill To Date", 'info');
        return;
      }
      if (Date.parse(this.formdate) > Date.parse(this.todate)) {
        this.swal('Warning', ' From Date should be less Than To Date', 'error');
        return;
      }
      if (this.stetecode==null || this.stetecode== "" || this.stetecode==undefined){
        this.swal("Warning", "Please Select State", 'info');
        return;
      }

      this.oldblocksrv.getoldblockdataviewlist(this.formdate,this.todate,this.stetecode,this.distcode,this.hospitalId,this.user.userId).subscribe((data:any)=>{
        if(data.status==200){
          this.list=data.data;
          this.record=this.list.length;
          if(this.record>0){
            this.currentPage = 1;
            this.pageElement = 100;
            this.showPegi=true;
          }else{
            this.showPegi=false;
          }
        }else{
          console.log(data);
          this.swal('Error','Something Went Wrong','error')
        }
      },
      (error) =>
      this.swal('Error','Something Went Wrong','error')
      );
    }

    swal(title: any, text: any, icon: any) {
      Swal.fire({
        icon: icon,
        title: title,
        text: text
      });
    }
    report: any = [];
    sno: any = {
      Slno: "",
      URN: "",
      HospitalName:"",
      PatientName: "",
      phone: "",
      ActualDateofAdmission: "",
      DateofAdmission: "",
      ActualDateofDischarge: "",
      DateofDischarge: "",
      claimstatus:"",
      Remarks:"",
      SnaRemarks:"",
      ApprovedUser:"",
      RejectedUser:"",
      InvestigationUser:"",
      SnaApprovedUser:"",
      SnaRejectedUser:"",
      SnaInvestigationUser:"",
      SnaFinalDecisionUser:"",
      PaidUser:"",
      TPAFinalDecisionUser:"",
    };
    heading = [[
      'Sl No',
      'urn',
      'Hospital Name',
      'Patient Name',
      'Patient Phone NO',
      'Actual Date Of Admission',
      'Date Of Admission',
      'Actual Date Of Discharge',
      'Date Of Discharge',
      'Claim Status',
      'Remarks',
      'Sna Remarks',
      'Approved User',
      'Rejected User',
      'Investigation User',
      'Sna Approved User',
      'Sna Rejected User',
      'Sna Investigation User',
      'Sna Final Decision User',
      'Paid User',
      'TPA Final Decision User',
    ]];

  downloadReport(){
  this.report = [];
  let claim: any;
  for(var i=0;i<this.list.length;i++) {
    claim = this.list[i];
    console.log(claim);
    this.sno = [];
    this.sno.Slno = i+1;
    this.sno.URN = claim.urn;
    this.sno.HospitalName=claim.hospitalname
    this.sno.PatientName = claim.patientName;
    this.sno.phone = claim.phone;
    this.sno.ActualDateofAdmission =  claim.actualDateOfAdmission;
    this.sno.DateofAdmission = claim.dateofadmission;
    this.sno.ActualDateofDischarge = claim.actualDateOfDischarge;
    this.sno.DateofDischarge =  claim.dateofdischarge;
    this.sno.claimstatus=  claim.claimstatus;
    this.sno.Remarks=  claim.remarks;
    this.sno.SnaRemarks=  claim.snaremarks;
    this.sno.ApprovedUser=  claim.approveduser;
    this.sno.RejectedUser=  claim.rejecteduser;
    this.sno.InvestigationUser=  claim.investigationuser;
    this.sno.SnaApprovedUser=  claim.snaapproveduser;
    this.sno.SnaRejectedUser=  claim.snarejecteduser;
    this.sno.SnaInvestigationUser=  claim.snainvestigationuser;
    this.sno.SnaFinalDecisionUser=  claim.snafinaldecisionuser;
    this.sno.PaidUser=  claim.paiduser;
    this.sno.TPAFinalDecisionUser=  claim.tpafinaldecisionuser;
    this.report.push(this.sno);
  }
  let statename="All";
  let distname="All";
  for(let j=0; j < this.stateList.length;j++){
    if(this.stateList[j].stateCode==this.stetecode){
      statename=this.stateList[j].stateName;
    }
  }
  for(let j=0; j < this.districtList.length;j++){
    if(this.districtList[j].districtcode==this.distcode){
      distname=this.districtList[j].districtname;
    }
  }
  let filter =[];
  filter.push([['Actual Date of Discharge From', this.formdate]]);
  filter.push([['Actual Date of Discharge To', this.todate]]);
  filter.push([['State Name', statename]]);
  filter.push([['District Name', distname]]);
  filter.push([['Hospital Name', this.hospitalname]]);
  TableUtil.exportListToExcelWithFilter(this.report, 'Old Block Data View List', this.heading, filter);
  }

  onaction(item:any){
    localStorage.setItem("txnid", item);
    this.route.navigate([]).then(result => { window.open(environment.routingUrl + '/oldblockdataviewdetails'); });
  }
}
