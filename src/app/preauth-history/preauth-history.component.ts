import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderService } from '../application/header.service';
import { CreatecpdserviceService } from '../application/Services/createcpdservice.service';
import { SnoCLaimDetailsService } from '../application/Services/sno-claim-details.service';

@Component({
  selector: 'app-preauth-history',
  templateUrl: './preauth-history.component.html',
  styleUrls: ['./preauth-history.component.scss']
})
export class PreauthHistoryComponent implements OnInit {
  urnNo: any;
  authorizedCode: any;
  hospitalCode: any;
  authData: any;
  token: any;
  dtls:any;
  value:any;

  constructor( private route: Router,private cpdService: CreatecpdserviceService,public snoService: SnoCLaimDetailsService,private headerService: HeaderService) { }

  ngOnInit(): void {
    this.headerService.setTitle('Pre-Auth Log');
    this.urnNo = localStorage.getItem("urn");
    this.authorizedCode = localStorage.getItem("authorizedCode");
    this.hospitalCode = localStorage.getItem("hospitalCode");
    this.token = localStorage.getItem("token");
    this.getPreAuthHistory();
    $("#appealDisposal").hide();
  }
  getPreAuthHistory() {
    let urno = this.urnNo;
    let authorizedCode = this.authorizedCode;
    let hospitalCode = this.hospitalCode;
    this.cpdService.getPreAuthHistory(urno,authorizedCode,hospitalCode).subscribe(data => {
      this.authData = data;
      this.value=this.authData.preAuthLogList;
      console.log(this.authData);
      localStorage.removeItem("urn");
      localStorage.removeItem("token");
      localStorage.removeItem("authorizedCode");
      localStorage.removeItem("hospitalCode");
    })
  }
  downloadAction(event: any, fileName: any, hCode: any, dateOfAdm: any, status) {
    let target = event.target;
    //console.log(target.nodeName);
    if ((target.nodeName == "A" || target.nodeName == "a") || (target.nodeName == "IMG" || target.nodeName == "img") || (target.nodeName == "I" || target.nodeName == "i")) {
      target = $(target);
      let anchor = target.parent();
      anchor = anchor.get(0);
      if (fileName != null) {
        let img = this.snoService.downloadFile(fileName, hCode, dateOfAdm);
        window.open(img, '_blank')
      }
    }
    // this.snoService.dowloadMethod(fileName,hCode,dateOfAdm).subscribe((response:any)=>{
    //   let blob:any=new Blob([response.blob()])
    //   const url=window.URL.createObjectURL(blob);
    //   window.open(url,'_blank');
    //   console.log(response.json());
    // });
  }

  viewDescription(descriptinDtls) {
    this.dtls = descriptinDtls;
    $("#appealDisposal").show();

  }
  modalClose() {
    $("#appealDisposal").hide();
  }

}
