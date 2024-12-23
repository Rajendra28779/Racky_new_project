import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/services/jwt.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { CreatecpdserviceService } from '../../Services/createcpdservice.service';
import { DynamicreportService } from '../../Services/dynamicreport.service';
import { PaidServiceService } from '../../Services/paid-service.service';
import { SnoCLaimDetailsService } from '../../Services/sno-claim-details.service';


@Component({
  selector: 'app-meclaimdetails',
  templateUrl: './meclaimdetails.component.html',
  styleUrls: ['./meclaimdetails.component.scss']
})
export class MeclaimdetailsComponent implements OnInit {
  childmessage: any;
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
  maxChars = 1000;
  ispreAuthLength: boolean=true;
  tableData: any=[];
  item: any=[];
  itemvalue:any;
  isTableData: boolean;
  desc:any;
  URN:any;
  user:any;
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
  datavalue: any;
  query: boolean = false;
  caseno: string;
  claimno: string;
  hopitalclmcaseno: string;
  routeFlag:any;
  triggerflag:any;
  showage:any;

  constructor(public paid:PaidServiceService,private cpdService: CreatecpdserviceService,private jwtService: JwtService,
    private route:Router,public headerService: HeaderService,private SnoCLaimDetailsServ: SnoCLaimDetailsService,
    private dynamicservice:DynamicreportService,private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.user = this.sessionService.decryptSessionData("user");;
    this.headerService.isIndicate(true);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.headerService.isBack(false);
    this.caseno=localStorage.getItem("caseno");
    this.claimno=localStorage.getItem("claimno");
    this.hopitalclmcaseno=localStorage.getItem("hopitalclmcaseno");
    this.headerService.setTitle('ME Trigger Claim Details');
    this.triggerflag = localStorage.getItem("flag");
    this.getnolist();
    if(this.triggerflag==5 || this.triggerflag==6 || this.triggerflag==7){
      this.showage=true;
    }else{
      this.showage=false;
    }
    this.trackingdetails();
    this.ongetpreAuthdata();
    // this.getremark();
  }

  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }

  nolist:any=[];
  getnolist(){
    for(let i=1;i<=125;i++){
      this.nolist.push(i);
    }
  }

  trackingdetails(){
    this.tracking = JSON.parse(localStorage.getItem("history"));
    this.routeFlag=this.tracking.flag;
    this.paid.gettrackingdetails(this.tracking.txnid).subscribe((data)=>{
      this.item=data;
      this.itemvalue=this.item[0];
      console.log(JSON.stringify(this.itemvalue));
    })
  }
  treatmentdetails() {
     localStorage.setItem("urn", this.item.URN)
     localStorage.setItem("token", this.jwtService.getJwtToken())
     this.route.navigate([]).then(result => { window.open(environment.routingUrl+'/treatmenthistory'); });
   }
   ongetpreAuthdata() {
    var URNnumber = this.tracking.urn;
    var Authroziedcode = this.tracking.authcode;
    var Hospitalcode = this.tracking.hospitalcode;
    console.log(URNnumber, Authroziedcode, Hospitalcode);
    this.cpdService.getPreAuthHistory(URNnumber, Authroziedcode, Hospitalcode).subscribe(data => {
      this.preAuth = data;
      this.datavalue = this.preAuth.preAuthLogList;
      if (this.preAuth.preAuthLogList.length > 0) {
        this.query = true;
      } else {
        this.query = false;
      }
    },
      error => {
        console.log("error", error);
      }
    );
  }
  preauthLogDetails(urn:any, authCode:any, hospitalCode:any)

  {
    // console.log
    // let authCodes = authCode.slice(2);

    localStorage.setItem("urn", urn);
    localStorage.setItem("authorizedCode", authCode);
    localStorage.setItem("hospitalCode", hospitalCode);
    localStorage.setItem("token", this.jwtService.getJwtToken())
    this.route.navigate([]).then(result => { window.open(environment.routingUrl + '/preauthhistory'); });
  }
  downloadActionforDischarge(event: any, fileName: any, hospitalCode: any, dateOfAdm: any) {
    let target = event.target;
    console.log(target.nodeName);
    if ((target.nodeName == "A" || target.nodeName == "a") || (target.nodeName == "IMG" || target.nodeName == "img") || (target.nodeName == "I" || target.nodeName == "i")) {
      target = $(target);
      let anchor = target.parent();
      anchor = anchor.get(0);
      if (fileName != null) {
        // let img = this.SnoCLaimDetailsServ.downloadFile(fileName, hCode, dateOfAdm);
        // window.open(img, '_blank')
        this.SnoCLaimDetailsServ.downloadFiles(fileName, hospitalCode, dateOfAdm).subscribe(
          (response: any) => {
            var result = response;
            let blob = new Blob([result], { type: result.type });
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

    keyPress(event: KeyboardEvent) {
      // const pattern = /^[A-Za-z0-9.,-_ \\s]+$/;
      // const pattern = /^[A-Za-z0-9.,#%<>()-_ \\s]+$/;
      const pattern = /'/;
      //var regex = new RegExp("^[A-Za-z0-9.,-\\s]+$");
      const inputChar = String.fromCharCode(event.charCode);
      // if (!pattern.test(inputChar)) {
      if (pattern.test(inputChar)) {
        // invalid character, prevent input
        event.preventDefault();
      }
    }

    remark:any;
  showremark:boolean=true;
  snaname:any;
  swal1:any="You want to Submit it!";
  swal2:any="Yes, Submit it!";
  claimLog;any=[];
  desablebtn:any;
  year:any="";
  month:any="";
  getremark(){
    this.dynamicservice.getremark(this.tracking.txnid).subscribe((data:any)=>{
      console.log(data);
      this.snaname=data.snaname;
      this.claimLog=data.meactionlog;
      if(data.status==200){
        this.remark=data.message
        this.showremark=false;
        this.year=data.year;
        if(this.year==null){this.year="";}
        // this.month=data.month;
      }else{
        this.remark="";
        this.showremark=true;
      }
      if(this.showremark==false){
        this.swal1="You want to Update it!"
        this.swal2="Yes, Update it!";
        if(this.triggerflag==1 || this.triggerflag==6 || this.triggerflag==4){
          this.desablebtn=true;
        }else{
          this.desablebtn=false;
        }
      }else{
        this.swal1="You want to Submit it!"
        this.swal2="Yes, Submit it!"
      }
    },
    (error)=>console.log(error)
    );
  }

  submitDetails() {
    let remark=$('#remarks').val();
    let year=$('#year').val();
    // let month=$('#month').val();
    let month="";
    if(year==undefined){year="";}
    // if(month==undefined){month="";}
    if(remark == null|| remark=="" || remark==undefined){
      this.swal("Info", "Please Enter Report Name", 'info');
      return;
    }
    let flag
    if(this.routeFlag==1|| this.routeFlag==3){
      flag=localStorage.getItem("flag");
    }else{
      flag=0
    }
    Swal.fire({
      title: 'Are you sure?',
      text: this.swal1,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: this.swal2
    }).then((result) => {
      if (result.isConfirmed) {
          this.dynamicservice.sumbitmeremark(this.tracking.txnid,remark,this.user.userId,this.tracking.urn,"",flag,year,month).subscribe((data:any)=>{
            console.log(data);
            if(data.status==200){
              this.swal("Success", data.message, 'success');
              if(this.routeFlag==1){
                this.route.navigate(['/application/mereportdetails']);
              }else if(this.routeFlag==2){
                this.route.navigate(['/application/mecasespecificremark']);
              }else{
                this.route.navigate(['/application/meactiontakenlist']);
              }
            }else{
              this.swal("Error", data.message, 'error');
            }
          },
          (error)=>console.log(error)
          );
      }
    });
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }

}
