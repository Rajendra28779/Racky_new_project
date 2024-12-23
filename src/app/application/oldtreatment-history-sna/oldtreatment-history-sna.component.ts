import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/services/jwt.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { TreatmenthistoryperurnService } from '../Services/treatmenthistoryperurn.service';
import { TableUtil } from '../util/TableUtil';

@Component({
  selector: 'app-oldtreatment-history-sna',
  templateUrl: './oldtreatment-history-sna.component.html',
  styleUrls: ['./oldtreatment-history-sna.component.scss']
})
export class OldtreatmentHistorySNAComponent implements OnInit {

  urn: any;
  trtData: any = [];
  token: any;
  txnId: any;
  userId: any;
  constructor(private jwtService: JwtService,private treatmenthistoryperurn: TreatmenthistoryperurnService, private route: Router) {
    
  }

  ngOnInit(): void {
    this.urn = localStorage.getItem("urn1");
    this.token = localStorage.getItem("token1");
    this.txnId = localStorage.getItem("transactionDetailsId1");
    this.userId = localStorage.getItem("userId1");
    localStorage.removeItem('treat');
    this.getTreatMentHistory();
  }
  getTreatMentHistory() {
    let urno = this.urn;
    console.log("urno--", urno);
    console.log("token--", this.token);
    console.log("userId--", this.userId);
    console.log("transactiondetailsId--", this.txnId);
    this.treatmenthistoryperurn.OldsearchbyUrnSna(urno, this.token,this.userId).subscribe(data => {
      this.trtData = data;
      console.log(this.trtData);
      // localStorage.removeItem("urn");
      // localStorage.removeItem("token");
    },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      });
  }
  // onAction(id: any, urn: any, packageCode: any,claimStatus:any) {
  //   if(claimStatus == 1){
  //     let state = {
  //       transactionId: id,
  //       flag: 'APRV',
  //       URN: urn,
  //       packageCode: packageCode,
  //     };
  //     localStorage.setItem('treat', 'Y');
  //     localStorage.setItem('actionData', JSON.stringify(state));
  //     this.route.navigate(['/application/snoapproval/action']);
  //   }
  //   if(claimStatus == 2){
  //     let state = {
  //       transactionId:id,
  //       URN:urn,
  //       packageCode:packageCode
  //     }
  //   localStorage.setItem('treat', 'Y');
  //   localStorage.setItem("actionData",JSON.stringify(state));
  //   this.route.navigate(['/application/cpdrejectedaction/action']);
  //   }
  //   if(claimStatus == 4){
  //     let state = {
  //       transactionId: id,
  //       flag: 'REAPRV',
  //       URN: urn,
  //       packageCode: packageCode,
  //     };
  //     localStorage.setItem('treat', 'Y');
  //     localStorage.setItem('actionData', JSON.stringify(state));
  //     this.route.navigate(['/application/snoreapproval/action']);
  //   }
  // }
  // getDetails(transactionId, claimId,claimRaiseStatus,urn,packagecode) {
  //   if(claimRaiseStatus==1){
  //     let trnsId = transactionId;
  //     let clmId = claimId;
  //     if (clmId != null || clmId != undefined) {
  //       localStorage.setItem("claimid", clmId);
  //       this.route.navigate([]).then(result => { window.open(environment.routingUrl+'/trackingdetails'); });
  //     } else {
  //       localStorage.setItem("trnsId", trnsId);
  //       this.route.navigate(['/treatmentinfo']);
  //     }
  //   }
  //   if(claimRaiseStatus==0){
  //     let  state={
  //       txnid: transactionId,
  //        urn:urn
  //    }
  //    localStorage.setItem("history",JSON.stringify(state));
  //    localStorage.setItem("token", this.jwtService.getJwtToken())
  //    this.route.navigate([]).then(result => { window.open(environment.routingUrl+'/dischargelistHistoryHospital'); });
  //   }
    
  // }
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
    chipNo: "",
    claimStatus: "",
    approvedAmount: "",
    approveddate: "",
    SnaApprovedAmount: "",
    SnaApprovedDate: "",
    remark: "",
    SnaRemarks: ""
  };
  heading = [['Sl#',  'URN', 'Chip Serial No.', '	Claim Status', 'Approved Amount(₹)','Approved Date', '	SNA Approved Amount(₹)','SNA Approved Date', 'Remarks','SNA Remarks']];

  downloadReport(){
    this.report = [];
    let claim: any;
    console.log(this.trtData);
    for(var i=0;i<this.trtData.length;i++) {
      claim = this.trtData[i];
      console.log(claim);
      this.sno = [];
      this.sno.Slno = i+1;
      this.sno.URN = claim.urn;
      this.sno.chipNo =claim.chipno;
      this.sno.claimStatus =  claim.claimstatus;
      this.sno.approvedAmount = claim.approvedamount;
      this.sno.approveddate =  this.convertDate(claim.approveddate);
      this.sno.SnaApprovedAmount =  claim.snaapprovedamount;
      this.sno.SnaApprovedDate =  this.convertDate(claim.snaapproveddate);
      this.sno.remark =  claim.remarks;
      this.sno.SnaRemarks =  claim.snaremarks;
      this.report.push(this.sno);
    }
    TableUtil.exportListToExcel(this.report, "Old Treatment History", this.heading);


  }
  convertDate(date) { 
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy, h:mm:ss a');
    return date;
  }

}
