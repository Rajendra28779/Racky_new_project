import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Console } from 'console';
import { environment } from 'src/environments/environment';
import { CreatecpdserviceService } from '../application/Services/createcpdservice.service';
import { SnoCLaimDetailsService } from '../application/Services/sno-claim-details.service';
import { TrackingTransistServiceService } from '../application/Services/tracking-transist-service.service';
import { JwtService } from '../services/jwt.service';
declare var $: any;

@Component({
  selector: 'app-tracking-details-hospital',
  templateUrl: './tracking-details-hospital.component.html',
  styleUrls: ['./tracking-details-hospital.component.scss']
})
export class TrackingDetailsHospitalComponent implements OnInit {

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
  caseNo: any;
  claim_no: any;
  // ispreAuthLength:boolean=true;
  constructor(private trackingtransistReport:TrackingTransistServiceService,public snoservice: SnoCLaimDetailsService,private jwtService: JwtService,private route:Router,private cpdService: CreatecpdserviceService) { }

  ngOnInit(): void {
    this.tracking = JSON.parse(localStorage.getItem("trackingdetails"));
    console.log("data about trackingg"+JSON.stringify(this.tracking));
    this.claimid = localStorage.getItem("claimid")
    this.authorizedcode=this.tracking.authorizedcode;
    this.authorizedcodenumber=localStorage.getItem("authorizedCodenumber")
    this.token = localStorage.getItem("token");
    this.urn=localStorage.getItem("urn");
    this.urnNUmber=localStorage.getItem("urnnumber");
    this.actualdate=localStorage.getItem("actualdate");
    // this.txnid=localStorage.getItem("txnid");
    // console.log("okk"+this.urn);
    this.hospitalcode=localStorage.getItem("hospitalcode")
    this.hospitalCodenumber=localStorage.getItem("hospitalCodenumber")
    this.caseNo=localStorage.getItem("caseno");
    this.claim_no=localStorage.getItem("claim_no");
    // alert(this.caseNo);
    this.trackingdetails();
    $("#appealDisposal").hide();
    this.getPreAuthdata();
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
    // var Authroziedcode= this.item.AUTHORIZEDCODE;
    var Authroziedcode= this.authorizedcode;
    var Hospitalcode= this.tracking.Hospitalcode;
    console.log("Authroziedcode"+Authroziedcode);
 this.cpdService.getPreAuthHistory(URNnumber,Authroziedcode,Hospitalcode).subscribe(data => {
      //this.claimlist = data.result;//JSON.parse(data.getItem("result"));
 console.log(data);
this.claimlist1 = data;
// this.preAuth = this.claimlist1.preAuthLogList;
// console.log(data);

// console.log(this.preAuth);
// if (this.preAuth.length != 0) {
//   this.check = true;
// }

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
      
        console.log( this.item)
        // if(data[1]!=undefined)
        // {
        //   this.actiontable.push(data[1]);
        //   this.actiontable.push(data[2]);

        // }
        this.actiontable2=data;
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
            console.log(data);
            // let dataLength = this.tableData.length
            this.preAuth = this.tableData.preAuthLogList;
            console.log(this.preAuth);
            if (this.preAuth.length != 0) {
              this.check = true;
            }
            console.log(this.tableData.length)
                if (this.tableData.length != 0) {
                  this.isTableData = true;
                }
          })
    })
  }
  downloadAction(event: any, fileName: any, hCode: any, dateOfAdm: any) {
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
    this.route.navigate([]).then(result => { window.open(environment.routingUrl+'/treatmenthistoryhospital'); });
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
