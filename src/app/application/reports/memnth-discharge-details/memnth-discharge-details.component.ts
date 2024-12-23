import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/services/jwt.service';
import { CreatecpdserviceService } from '../../Services/createcpdservice.service';
import { SnoCLaimDetailsService } from '../../Services/sno-claim-details.service';
import { TreatmenthistoryperurnService } from '../../Services/treatmenthistoryperurn.service';
import { environment } from 'src/environments/environment';
import { TrackingTransistServiceService } from '../../Services/tracking-transist-service.service';
import Swal from 'sweetalert2';
import { TableUtil } from '../../util/TableUtil';
import { MisreportService } from '../../Services/misreport.service';
import { MnthWiseDischargeMeService } from '../../Services/mnth-wise-discharge-me.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-memnth-discharge-details',
  templateUrl: './memnth-discharge-details.component.html',
  styleUrls: ['./memnth-discharge-details.component.scss']
})
export class MemnthDischargeDetailsComponent implements OnInit {
  // value='Rajendra';
  trtmntid:any;
  
  actioncode:any;
  package:any;
  result:any;
  response:any;
  highenddrug:any=[];
  txnid: any;
  pkgid: any;
  user: any;
  highEndDrugList: any = [];
  implantDataList: any = [];
  wardDataList: any = [];
  highEndDrugTotalPrice: any;
  implantTotalPrice: any;
  implantTotalUnitPrice: any;
  implantTotalUnit: any;
  constructor(private misservice:MisreportService,private cpdService: CreatecpdserviceService,private mnthWiseDischargeMeService: MnthWiseDischargeMeService,private sessionService: SessionStorageService,) { }

  ngOnInit(): void {
    // this.user = JSON.parse(sessionStorage.getItem("user"));
    this.user = this.sessionService.decryptSessionData("user");
    this.txnid=localStorage.getItem('txnid');
    this.pkgid=localStorage.getItem('pkgid');
    if ( this.pkgid == undefined && this.pkgid==null) {
      this.pkgid = '';
    }
    this.mnthWiseDischargeMeService.blockedcaselogdetailsof(this.txnid, this.pkgid,this.user.userId).subscribe((data:any)=>{
      console.log(data);
      this.result=data[0];
    },
    (error) => console.log(error)
    );
    this.getPackageDetailsInfoList();
  }

  getPackageDetailsInfoList() {
    let txnpackagedetailid = this.pkgid;
    this.cpdService.getPackageDetailsInfoList(txnpackagedetailid).subscribe(data => {
      let result: any = data;
      if (result != null && result.statusCode == 200) {
        this.highEndDrugList = result.highEndDrugList;
        this.implantDataList = result.implantDataList;
        this.wardDataList = result.wardDataList;
        this.highEndDrugTotalPrice = result.highEndDrugTotalPrice;
        this.implantTotalPrice = result.implantTotalPrice;
        this.implantTotalUnit = result.implantTotalUnit;
        this.implantTotalUnitPrice = result.implantTotalUnitPrice;
      }
    })
  }
}
