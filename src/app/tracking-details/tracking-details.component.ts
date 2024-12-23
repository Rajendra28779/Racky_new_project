import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Console } from 'console';
import { environment } from 'src/environments/environment';
import { CreatecpdserviceService } from '../application/Services/createcpdservice.service';
import { SnoCLaimDetailsService } from '../application/Services/sno-claim-details.service';
import { TrackingTransistServiceService } from '../application/Services/tracking-transist-service.service';
import { TreatmenthistoryperurnService } from '../application/Services/treatmenthistoryperurn.service';
import { TableUtil } from '../application/util/TableUtil';
import { JwtService } from '../services/jwt.service';
import Swal from "sweetalert2";
import { SessionStorageService } from '../services/session-storage.service';
declare var $: any;

@Component({
  selector: 'app-tracking-details',
  templateUrl: './tracking-details.component.html',
  styleUrls: ['./tracking-details.component.scss']
})
export class TrackingDetailsComponent implements OnInit {


  dataDisplay:any;
  claimid: any;
  authorizedcode:any;
  hospitalcode:any;
  trtData: any = [];
  token: any;
  recordhistory:any=[];
  preAuth: any;
  preAuthdata: any;
  check: boolean = false;

  ispreAuthLength: boolean=true;
  tableData: any=[];
  item: any=[];
  isTableData: boolean;
  desc:any;
  URN:any;
  AUTHORIZEDCODE:any;
  HOSPITALCODE:any;
  actiontable:any=[];
  isactiontable: boolean=false;
  urn:any
  claimlist1: any;
  actualdate:any;
  txnid:any;
  urnNUmber:any
  hospitalCodenumber:any
  authorizedcodenumber:any
  actiontable2: any=[];
  tableDatalength: any;
  tracking:any;
  // ispreAuthLength:boolean=true;
  user:any;
  treatmentHistoryList: any = [];
  oldTreatmentHistoryList: any = [];
  refundedBy: any;
  groupId: any;
  caseno: string;

  constructor(private trackingtransistReport:TrackingTransistServiceService,
    public snoservice: SnoCLaimDetailsService,
    private jwtService: JwtService,
    private route:Router,
    private cpdService: CreatecpdserviceService,
    private treatmenthistoryperurnService : TreatmenthistoryperurnService,private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.user =this.sessionService.decryptSessionData("user");
    this.groupId = this.user.groupId;
    if(this.user.groupId==5){
      this.route.navigate(['/unauthorize']);
    }
    this.tracking = JSON.parse(localStorage.getItem("trackingdetails"));
    console.log("data about trackingg"+JSON.stringify(this.tracking));
    this.claimid = localStorage.getItem("claimid")
    this.authorizedcode=localStorage.getItem("authorizedcode")
    this.authorizedcodenumber=localStorage.getItem("authorizedCodenumber")
    this.token = localStorage.getItem("token");
    this.urn=localStorage.getItem("urn");
    this.urnNUmber=localStorage.getItem("urnnumber");
    this.actualdate=localStorage.getItem("actualdate");
    this.caseno=localStorage.getItem("caseno");
    // this.txnid=localStorage.getItem("txnid");
    // console.log("okk"+this.urn);
    this.hospitalcode=localStorage.getItem("hospitalcode")
    this.hospitalCodenumber=localStorage.getItem("hospitalCodenumber")
    this.refundedBy=localStorage.getItem("refundedBy");
    localStorage.removeItem("refundedBy");
    this.trackingdetails();
    $("#appealDisposal").hide();
    this.getPreAuthdata();
    this.getTreatmentHistory();
    this.getOldTreatmentHistory();
    // this.urnNo = this.dataClaim.URN;
    // this.authorized = this.dataClaim.Authroziedcode;
    // this.Hospital = this.dataClaim.Hospitalcode;
  }

  getPreAuthdata() {
    // var claimid= this.claimid;
    // var actualdate=this.actualdate;
    // var URNnumber = this.urnNUmber;
    // var Authroziedcode = this.authorizedcodenumber;
    // var Hospitalcode = this.hospitalCodenumber;
    // var transactionid = this.txnid;

    var URNnumber= this.tracking.Urn;
    var Authroziedcode= this.tracking.authorizedcode;
    var Hospitalcode= this.tracking.Hospitalcode;
    console.log("Authroziedcode"+Authroziedcode);
 this.cpdService.getPreAuthHistory(URNnumber,Authroziedcode,Hospitalcode).subscribe(data => {
      //this.claimlist = data.result;//JSON.parse(data.getItem("result"));
 console.log(data);
this.claimlist1 = data;
this.preAuth = this.claimlist1.preAuthLogList;
console.log(this.preAuth);
if (this.preAuth.length != 0) {
  this.check = true;
}

    });

    // this.cpdService.getPreAuthHistory(URNnumber, Authroziedcode, Hospitalcode).subscribe(data => {
    //   this.preAuth = data;
    //   console.log(this.preAuth);
    //   console.log("preAuth", JSON.stringify(this.preAuth))
    //   // console.log("inside preauth data in preAuth"+this.preAuth)
    // })
  }


  // preauthLogDetails() {
  //   this.urn=localStorage.getItem("urn")
  //   this.hospitalcode=localStorage.getItem("hospitalcode")
  //   this.authorizedcode=localStorage.getItem("authorizedcode")


  //   // var URNnumber = this.urn;
  //   var Authroziedcode = this.authorizedcode;
  //   var Hospitalcode = this.hospitalcode;
  //   console.log( this.urn);
  //   console.log(Authroziedcode);
  //   console.log(Hospitalcode);
  //   localStorage.setItem("urn", this.urn);
  //   localStorage.setItem("authorizedcode",this.authorizedcode);
  //   localStorage.setItem("hospitalcode", this.hospitalcode);
  //   localStorage.setItem("token", this.jwtService.getJwtToken())
  //   this.route.navigate([]).then(result => { window.open(environment.routingUrl+'/preauthhistory'); });
  // }
  preauthLogDetails(urn:any, authCode:any, hosCode:any)

  {
    // console.log
    // let authCodes = authCode.slice(2);

    localStorage.setItem("urn", urn);
    localStorage.setItem("authorizedCode", authCode);
    localStorage.setItem("hospitalCode", hosCode);
    localStorage.setItem("token", this.jwtService.getJwtToken())
    this.route.navigate([]).then(result => { window.open(environment.routingUrl + '/preauthhistory'); });
  }

  trackingdetails(){
    this.trackingtransistReport.gettrackingdetails(this.claimid).subscribe((data)=>{
      this.item=data[0];
        console.log(data);
        this.urn=this.item.URN;
        // if(data[1]!=undefined)
        // {
        //   this.actiontable.push(data[1]);
        //   this.actiontable.push(data[2]);

        // }
        this.actiontable2=data;
        console.log("Data Action Details.")
        this.tableDatalength=this.actiontable2.length;
        let i:any;
        for(i=1;i<this.tableDatalength;i++){
          this.actiontable.push(data[i]);

        }

        console.log(this.actiontable);
        if (this.actiontable.length != 0) {
          //alert(this.actiontable.length)
          this.isactiontable = true;
        }
        console.log(this.actiontable);

          this.cpdService.getPreAuthHistory(this.item.URN, this.item.AUTHORIZEDCODE, this.item.HOSPITALCODE).subscribe((data)=>{
            this.tableData=data;
            // let dataLength = this.tableData.length
            console.log(this.tableData.length)
                if (this.tableData.length != 0) {
                  this.isTableData = true;
                }
          })
    })
  }
  downloadAction(event: any, fileName: any, hCode: any, dateOfAdm: any) {
    if (this.groupId != 1 && this.groupId != 4) {
        Swal.fire({
          icon: 'info',
          title: 'Info',
          text: 'Only authorized user can see this file!',
        });
        return;
    }

    console.log("hi"+fileName)
    let target = event.target;
    if (
      target.nodeName == 'A' ||
      target.nodeName == 'a' ||
      target.nodeName == 'IMG' ||
      target.nodeName == 'img' ||
      target.nodeName == 'I' ||
      target.nodeName == 'i'
    ) {
      target = $(target);
      let anchor = target.parent();
      anchor = anchor.get(0);

      if (fileName != null) {
        // let img = this.snoservice.downloadFile(fileName, hCode, dateOfAdm);
        // window.open(img, '_blank');
        this.snoservice.downloadFiles(fileName, hCode, dateOfAdm).subscribe(
          (response: any) => {
            var result = response;
            let blob = new Blob([result],{ type: result.type});
            let url = window.URL.createObjectURL(blob);
            window.open(url);
          },
          (error) => {
            console.log(error);
          }
        );
      }
    }
  }
  treatmentdetails() {
   console.log( this.item[0]);

    // localStorage.setItem("click", "Y");
    localStorage.setItem("urn", this.item.URN)
    localStorage.setItem("token", this.jwtService.getJwtToken())
    this.route.navigate([]).then(result => { window.open(environment.routingUrl+'/treatmenthistory'); });
  }

  getTreatmentHistory(){
    this.treatmenthistoryperurnService.searchbyUrn2(this.tracking.Urn, this.jwtService.getJwtToken()).subscribe((data)=>{
      this.treatmentHistoryList = data;
      // console.log("vlaueeeeeeeeeeeeeeeeeeeee"+JSON.stringify(this.treatmentHistoryList))
      if (this.treatmentHistoryList.length > 3) {
        document.getElementById('treatmentTable').classList.add('treatment-history-table-class', 'treatment-history-table-head-class');
      }
    });
  }
  getOldTreatmentHistory(){
    console.log("Old Treatment History");
    this.treatmenthistoryperurnService.getOldTreatmentHistoryURNCPD(this.tracking.Urn, this.jwtService.getJwtToken()).subscribe((data)=>{
      if (data != null && data.status == 'success') {
        this.oldTreatmentHistoryList = data.data;
        console.log("vlaueeeeeeeeeeeeeeeeeeeee"+JSON.stringify(this.oldTreatmentHistoryList))
        if (this.oldTreatmentHistoryList.length > 3) {
          document.getElementById('oldTreatmentTable').classList.add('treatment-history-table-class', 'treatment-history-table-head-class');
        }
      }
    });
  }
  getDetails(transactionId, claimId) {
    let trnsId = transactionId;
    let clmId = claimId;
    if (clmId != null || clmId != undefined) {
      localStorage.setItem("claimid", clmId);
      this.route.navigate([]).then(result => { window.open(environment.routingUrl+'/trackingdetails'); });
    } else {
      localStorage.setItem("trnsId", trnsId);
      this.route.navigate(['/treatmentinfo']);
    }
  }
  downloadExcelTreatmentHistory() {
    console.log("Inside Download Report");
    let SlNo = 1;
    let report = [];
    let heading = [['Sl#','URN', 'Invoice No.', 'Hospital Name','Package Code', 'Patient Name', 'Date of Admission',  'Actual Date of Admission', 'Date of Discharge', 'Actual Date of Discharge', 'Action Amount(₹)', 'CPD Approved Amount(₹)', 'SNA Approved Amount(₹)', 'Status']];

    let claim : any;
    this.treatmentHistoryList.forEach(element => {
      claim = {
        "Sl#": SlNo,
        "URN": element.urnno,
        "Invoice No.": element.invoiceNo,
        "Hospital Name":element.hospitalname,
        "Package Code": element.packagecode,
        "Patient Name": element.patientname,
        "Date of Admission": element.dateofadmission,
        "Actual Date of Addmission": element.actualDateofadmission,
        "Date of Discharge": element.dateofdischarge,
        "Actual Date of Discharge": element.actualDateofdischarge,
        "Action Amount(₹)": element.totalamount != null ? element.totalamount : 'N/A',
        "CPD Approved Amount(₹)": element.cpdapproveamount != null ? element.cpdapproveamount : 'N/A',
        "SNA Approved Amount(₹)": element.snaapproveamount != null ? element.snaapproveamount : 'N/A',
        "Status": element.status
      }
      report.push(claim);
      SlNo++;
    });
    TableUtil.exportListToExcel(report, "Discharge Treatment Information", heading);
  }
  downloadExcelOldTreatmentHistory() {
    console.log("Inside Download Report");
    let SlNo = 1;
    let report = [];
    let heading = [['Sl#','URN', 'Invoice No.', 'Patient Name', 'Date of Admission', 'Actual Date of Admission',  'Date of Discharge', 'Actual Date of Discharge', 'Claim Status', 'Approved Amount(₹)', 'Approved Date', 'SNA Approved Amount(₹)', 'SNA Approved Date', 'Remarks', 'SNA Remarks']];

    let claim : any;
    this.oldTreatmentHistoryList.forEach(element => {
      claim = {
        "Sl#": SlNo,
        "URN": element.URN,
        "Invoice No.": element.invoiceNo,
        "Patient Name": element.patientName,
        "Date of Admission": element.dateOfAdmission,
        "Actual Date of Admission": element.actualDateOfAdmission,
        "Date of Discharge": element.dateOfDischarge,
        "Actual Date of Discharge": element.actualDateOfDischarge,
        "Claim Status": element.claimStatus,
        "Approved Amount(₹)": element.approvedAmount,
        "Approved Date": element.approvedDate,
        "SNA Approved Amount(₹)": element.SNAApprovedAmount,
        "SNA Approved Date": element.SNAApprovedDate,
        "Remarks": element.remark,
        "SNA Remarks": element.SNARemark
      }
      report.push(claim);
      SlNo++;
    });
    TableUtil.exportListToExcel(report, "Old Claim Information", heading);
  }
  // preAuthLogDetails(urn, authCode, hosCode) {
  //   alert()
  //   let authCodes = authCode.slice(2);
  //   localStorage.setItem("urn", urn);
  //   localStorage.setItem("authorizedCode", authCodes);
  //   localStorage.setItem("hospitalCode", hosCode);
  //   localStorage.setItem("token", this.jwtService.getJwtToken())
  //   this.route.navigate([]).then(result => { window.open(environment.routingUrl+'/preauthhistory'); });
  // }
  // viewDescription(descriptinDtls) {
  //  this.dataDisplay = descriptinDtls;
  //   alert(this.dataDisplay);
  //   $("#appealDispo12").show();

  // }
  // modalClose() {
  //   $("#appealDispo12").hide();
  // }
  dtls: any;
  viewDescription(descriptinDtls) {
    this.dtls = descriptinDtls;
    // alert(this.dtls)
    $("#appealDisposal").show();
  }
  modalClose() {
    $("#appealDisposal").hide();
  }


}
