import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { OldBlockDataService } from '../../Services/old-block-data.service';
import { TableUtil } from '../../util/TableUtil';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-oldblock-generic-search',
  templateUrl: './oldblock-generic-search.component.html',
  styleUrls: ['./oldblock-generic-search.component.scss']
})
export class OldblockGenericSearchComponent implements OnInit {
  showPegi: boolean;
  record: any=0;
  currentPage: any;
  pageElement: any;
  txtsearchDate: any;
  checkPlaceHolder: any='Enter Urn,Patient Name & MobileNo,Hospital Name & Code';
  user: any;
  userId: any;
  childmessage: any;
  list:any=[];
  fieldvalue:any;
  showtable: boolean=false;

  constructor(public headerService: HeaderService,private oldblocksrv:OldBlockDataService,private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle('Old Block Data Generic Search');
    this.user = this.sessionService.decryptSessionData("user");

  }

  search(){
    this.fieldvalue=$('#fieldValue').val();
    this.oldblocksrv.getoldblockgenericsearch(this.fieldvalue,this.user.userId).subscribe((data:any)=>{
      this.showtable=true;
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
        this.swal('Error','Something Went Wrong','error')
      }
    },
    (error) =>
    this.swal('Error','Something Went Wrong','error')
    );
  }
  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }
  resetField() {
    $('#fieldValue').val('');
    this.list=[];
    this.showPegi = false;
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
let filter =[];
TableUtil.exportListToExcelWithFilter(this.report, 'Old Block Generic Search List', this.heading, filter);
}

}
