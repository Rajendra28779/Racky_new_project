import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/services/jwt.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { TreatmenthistoryperurnService } from '../Services/treatmenthistoryperurn.service';
import { TableUtil } from '../util/TableUtil';

@Component({
  selector: 'app-treatment-history-sna',
  templateUrl: './treatment-history-sna.component.html',
  styleUrls: ['./treatment-history-sna.component.scss']
})
export class TreatmentHistorySnaComponent implements OnInit {
  urn: any;
  trtData: any = [];
  token: any;
  txnId: any;
  userId: any;
  constructor(private jwtService: JwtService,private treatmenthistoryperurn: TreatmenthistoryperurnService, private route: Router) {

  }

  ngOnInit(): void {
    this.urn = localStorage.getItem("urn");
    this.token = localStorage.getItem("token");
    this.txnId = localStorage.getItem("transactionDetailsId");
    this.userId = localStorage.getItem("userId");
    localStorage.removeItem('treat');
    this.getTreatMentHistory();
  }
  getTreatMentHistory() {
    let urno = this.urn;
    console.log("urno--", urno);
    console.log("token--", this.token);
    console.log("userId--", this.userId);
    console.log("transactiondetailsId--", this.txnId);
    this.treatmenthistoryperurn.searchbyUrnSna(urno, this.token,this.userId).subscribe(data => {
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
  onAction(id: any, urn: any, packageCode: any,claimStatus:any) {
    if(claimStatus == 1){
      let state = {
        transactionId: id,
        flag: 'APRV',
        URN: urn,
        packageCode: packageCode,
      };
      localStorage.setItem('treat', 'Y');
      localStorage.setItem('actionData', JSON.stringify(state));
      this.route.navigate(['/application/snoapproval/action']);
    }
    if(claimStatus == 2){
      let state = {
        transactionId:id,
        URN:urn,
        packageCode:packageCode
      }
    localStorage.setItem('treat', 'Y');
    localStorage.setItem("actionData",JSON.stringify(state));
    this.route.navigate(['/application/cpdrejectedaction/action']);
    }
    if(claimStatus == 4){
      let state = {
        transactionId: id,
        flag: 'REAPRV',
        URN: urn,
        packageCode: packageCode,
      };
      localStorage.setItem('treat', 'Y');
      localStorage.setItem('actionData', JSON.stringify(state));
      this.route.navigate(['/application/snoreapproval/action']);
    }
  }
  getDetails(transactionId, claimId,claimRaiseStatus,urn,packagecode) {
    if(claimRaiseStatus==1){
      let trnsId = transactionId;
      let clmId = claimId;
      if (clmId != null || clmId != undefined) {
        localStorage.setItem("claimid", clmId);
        // localStorage.setItem("token",this.token);
        this.route.navigate([]).then(result => { window.open(environment.routingUrl+'/trackingdetails'); });
      } else {
        localStorage.setItem("trnsId", trnsId);
        this.route.navigate(['/treatmentinfo']);
      }
    }
    if(claimRaiseStatus==0){
      let  state={
        txnid: transactionId,
        //  authcode:authorizedcode,
        //  hospitalcode:hospitalcode,
         urn:urn
     }
     localStorage.setItem("history",JSON.stringify(state));
     localStorage.setItem("token", this.jwtService.getJwtToken())
     this.route.navigate([]).then(result => { window.open(environment.routingUrl+'/dischargelistHistoryHospital'); });
    }

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
    claimNo: "",
    URN: "",
    PackageCode: "",
    patientName: "",
    HospitalName: "",
    DateofAdmission: "",
    ActualDateofAdmission: "",
    dateOfDischarge: "",
    ActualDateofDischarge: "",
    hospitalClaimAmount: "",
    cpdApprovedAmount: "",
    snaApprovedAmount: "",
    status: "",
    cpdName: ""
  };
  heading = [['Sl#', 'Claim No.', 'URN', 'Package Code', 'Patient Name', 'Hospital Name','Admission Date', 'Actual Admission Date','Discharge Date', 'Actual Discharge Date','Hospital Claim Amount(₹)','CPD Approved Amount(₹)','SNA Approved Amount(₹)','Status', 'CPD Name']];

  downloadReport(){
    this.report = [];
    let claim: any;
    console.log(this.trtData);
    for(var i=0;i<this.trtData.length;i++) {
      claim = this.trtData[i];
      console.log(claim);
      this.sno = [];
      this.sno.Slno = i+1;
      this.sno.claimNo = claim.claimNo;
      this.sno.URN = claim.urn;
      this.sno.PackageCode =claim.packagecode;
      this.sno.patientName =  claim.patientname;
      this.sno.HospitalName = claim.hospitalName;
      this.sno.DateofAdmission =  claim.dateofadmission;
      this.sno.ActualDateofAdmission =  claim.actualdateofadmission;
      this.sno.dateOfDischarge =  claim.dateofdischarge;
      this.sno.ActualDateofDischarge =  claim.actualdateofdischarge;
      this.sno.hospitalClaimAmount =  claim.hospitalclaimedamount;
      this.sno.cpdApprovedAmount =  claim.cpdapprovedamount;
      this.sno.snaApprovedAmount =  claim.snoapprovedamount;
      this.sno.status =  claim.actiontype;
      this.sno.cpdName =  claim.cpdName;
      this.report.push(this.sno);
    }
    TableUtil.exportListToExcel(this.report, "Treatment History SNA", this.heading);


  }

}
