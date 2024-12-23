import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { ClaimStatisticsService } from '../../Services/claim-statistics.service';
import { TableUtil } from '../../util/TableUtil';

@Component({
  selector: 'app-claimstatictisc-details',
  templateUrl: './claimstatictisc-details.component.html',
  styleUrls: ['./claimstatictisc-details.component.scss']
})
export class ClaimstatictiscDetailsComponent implements OnInit {
  token: any;
  searchBy:any;
  fromDate:any;
  toDate:any;
  urn:any;
  eventName:any;
  showPegi:boolean;
  record:any;
  currentPage:any;
  pageElement:any;
  userId: any;
  stateid:any;
  districtvalue:any;
  hospitalcode:any;
  detailsdata:any=[];

  constructor(public claimStatisticsService:ClaimStatisticsService,public headerService: HeaderService) { }

  ngOnInit(): void {
    // this.searchBy=localStorage.getItem("searchBy");
    this.headerService.setTitle('Claim statistics Details Report');
    this.fromDate= localStorage.getItem("fromDatevlue");
    this.toDate= localStorage.getItem("TODatevlue");
    this.stateid= localStorage.getItem("StateIdValue");
    this.districtvalue= localStorage.getItem("Disctrictatevlue");
    this.hospitalcode= localStorage.getItem("Hospitalatevlue");
    this.eventName= localStorage.getItem("event");
    this.token=localStorage.getItem("token");
    this.getdaata();
  }
  getdaata(){
    this.claimStatisticsService.getClaimStatisticsDetails(this.fromDate,this.toDate,this.stateid,this.districtvalue,this.hospitalcode,this.eventName).subscribe((data:any)=>{
      console.log(data);
      this.detailsdata=data;
      localStorage.removeItem("fromDatevlue");
      localStorage.removeItem("TODatevlue");
      localStorage.removeItem("StateIdValue");
      localStorage.removeItem("Disctrictatevlue");
      localStorage.removeItem("Hospitalatevlue");
      localStorage.removeItem("event");
      localStorage.removeItem("token");
    },
    (error)=>{
      console.log(error);
      this.swal('', 'Something went wrong.', 'error');
    }
    )
  }

  report: any = [];
  sno: any = {
    Slno: '',
    ClaimNumber: '',
    URN: '',
    InvoiceNumber: '',
    HospitalName: '',
    PackageName: '',
    ActualDateOfAdmission: '',
    ActualDateOfDischarge: '',
    DischargeofAdmission: '',
    DischargeofDischarge: '',
    CPDName: '',
    HospitalCode: '',
    authorizedCode: '',
  };
  heading = [
    [
      'Slno',
      'Claim Number',
      'URN',
      'Invoice Number',
      'Hospital Name',
      'Package Name',
      'ActualDate Of Admission: ',
      'ActualDate Of Discharge',
      'Discharge of Admission',
      'Discharge of Discharge',
      'CPD Name',
      'Hospital Code',
      'AuthorizedCode',
  
    ],
  ];
  downloadReport(){
    this.report = [];
    let Sna: any;
    for (var i = 0; i < this.detailsdata.length; i++) {
      Sna = this.detailsdata[i];
      this.sno = [];
      this.sno.Slno = i + 1;
      this.sno.ClaimNumber = Sna.claim_no;
      this.sno.URN = Sna.urn;
      this.sno.InvoiceNumber = Sna.invoiceno;
      this.sno.HospitalName = Sna.hospitalname;
      this.sno.PackageName= Sna.packagename;
      this.sno.ActualDateOfAdmission = Sna.actualdateofadmission;
      this.sno.ActualDateOfDischarge = Sna.actualdateofdischarge;
      this.sno.DischargeofAdmission = Sna.dateofadmission;
      this.sno.DischargeofDischarge = Sna.dateofdischarge;
      this.sno.CPDName = Sna.fullname;
      this.sno.HospitalCode = Sna.hospitalcode;
      this.sno.authorizedCode = Sna.authorizedcode;
      this.report.push(this.sno);
  }
  TableUtil.exportListToExcel(
    this.report,
    'Claim Statistic Report',
    this.heading
  );
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

}
