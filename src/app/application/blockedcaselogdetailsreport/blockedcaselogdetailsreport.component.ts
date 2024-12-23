import { Component, OnInit } from '@angular/core';
import { CreatecpdserviceService } from '../Services/createcpdservice.service';
import { MisreportService } from '../Services/misreport.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-blockedcaselogdetailsreport',
  templateUrl: './blockedcaselogdetailsreport.component.html',
  styleUrls: ['./blockedcaselogdetailsreport.component.scss']
})
export class BlockedcaselogdetailsreportComponent implements OnInit {
  value='Rajendra';
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

  constructor(private misservice:MisreportService,private cpdService: CreatecpdserviceService,
    private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.user = this.sessionService.decryptSessionData("user");
    this.txnid=localStorage.getItem('txnid');
    this.pkgid=localStorage.getItem('pkgid');
    this.misservice.blockedcaselogdetailsof1(this.txnid,this.pkgid,this.user.userId).subscribe((data:any)=>{
      console.log(data);
      this.result=data;
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
