import { Component, OnInit } from '@angular/core';
import { OldandnewclaimdetailsService } from '../application/Services/oldandnewclaimdetails.service';
import { SnoCLaimDetailsService } from '../application/Services/sno-claim-details.service';
import { JwtService } from '../services/jwt.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-viewoldclaimandnewclaimdetails',
  templateUrl: './viewoldclaimandnewclaimdetails.component.html',
  styleUrls: ['./viewoldclaimandnewclaimdetails.component.scss']
})
export class ViewoldclaimandnewclaimdetailsComponent implements OnInit {
  urnnumber: any;
  urndata: any;
  claimid: any;
  selectedvalu: any;
  claimnumber: any;
  transactiondetaisid: any
  authorizedcode: any
  hospitalcode: any
  resultdata:any=[];
  actiontakenhistory:any;
  HospitalDetails:any;
  Treatmendetails:any;
  preauthlog:any;
  treatmenthistory:any;
  constructor(private oldandnewclaimdetailsService: OldandnewclaimdetailsService,public snoService: SnoCLaimDetailsService, private jwtService: JwtService,public route: Router) { }

  ngOnInit(): void {
    this.urnnumber = JSON.parse(localStorage.getItem("viewdetails"));
    $("#appealDisposal").hide();
    this.urndata = this.urnnumber.URN
    this.claimid = this.urnnumber.claimid;
    this.selectedvalu = this.urnnumber.selectedvalue;
    this.claimnumber = this.urnnumber.claimnumber;
    this.transactiondetaisid = this.urnnumber.transactiondetaisid;
    this.authorizedcode = this.urnnumber.authorizedcode;
    this.hospitalcode = this.urnnumber.hospitalcode;
    this.oldandnewclaimdetailsService.getdetailsdatathroughurn(this.urndata, this.claimid, this.selectedvalu, this.claimnumber,this.transactiondetaisid,this.authorizedcode,this.hospitalcode).subscribe((data: any) => {
      console.log(data)
      this.resultdata=data;
      this.actiontakenhistory=this.resultdata.data.Actiontakenhistory;
      this.HospitalDetails=this.resultdata.data.HospitalDetails[0];
      this.Treatmendetails=this.resultdata.data.Treatmendetails[0];
      this.preauthlog=this.resultdata.data.preauthlog;
      this.treatmenthistory=this.resultdata.data.treatmenthistory;
    }
    )
  }
  OlddownloadAction(event: any, fileName: any, hCode: any, year: any) {
    let target = event.target;
    if (
      target.nodeName == 'A' ||
      target.nodeName == 'a' ||
      target.nodeName == 'IMG' ||
      target.nodeName == 'img' ||
      target.nodeName == 'I' ||
      target.nodeName == 'i' ||
      target.nodeName == 'SPAN' ||
      target.nodeName == 'span'
    ) {
      target = $(target);
      let anchor = target.parent();
      anchor = anchor.get(0);
      if (fileName != null) {
        this.snoService.downloadOldFiles(fileName, hCode, year).subscribe(
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
  downloadAction(event: any, fileName: any, hCode: any, dateOfAdm: any) {
    console.log("hi"+hCode)
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
        this.snoService.downloadFiles(fileName, hCode, dateOfAdm).subscribe(
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
  preAuthLogDetails(urn, authCode, hosCode) {
    let authCodes = authCode;
    localStorage.setItem('urn', urn);
    localStorage.setItem('authorizedCode', authCodes);
    localStorage.setItem('hospitalCode', hosCode);
    localStorage.setItem('token', this.jwtService.getJwtToken());
    this.route.navigate([]).then((result) => {
      window.open(environment.routingUrl + '/preauthhistory');
    });
  }
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
