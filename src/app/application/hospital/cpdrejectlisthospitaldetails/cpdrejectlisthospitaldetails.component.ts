import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/services/jwt.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { PendingService } from '../../pending.service';
import { SnoCLaimDetailsService } from '../../Services/sno-claim-details.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-cpdrejectlisthospitaldetails',
  templateUrl: './cpdrejectlisthospitaldetails.component.html',
  styleUrls: ['./cpdrejectlisthospitaldetails.component.scss']
})
export class CpdrejectlisthospitaldetailsComponent implements OnInit {
  dataClaim: any;
  getid: any;
  urnNo: any;
  authorized: any;
  Hospital: any;
  preAuthdata: any;
  preAuth: any;
  claimLog: Array<any> = [];
  userdetailsByid1: any = [];
  childmessage: any;
  check: boolean = false;
  user: any;
  maxChars = 200;
  claimBy: any;
  claimDetails: any;
  actionhistory: boolean = false;
  constructor(public snoService: SnoCLaimDetailsService, private jwtService: JwtService, public headerService: HeaderService, public route: Router, private pendingService: PendingService,private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.dataClaim = JSON.parse(localStorage.getItem("actionDataforcpdcompliance"));
    this.getid = this.dataClaim.Action;
    this.urnNo = this.dataClaim.URN;
    this.Hospital = this.dataClaim.Hospitalcode;
    this.claimBy = new Date(this.dataClaim.claimraisedBy);
    this.user =  this.sessionService.decryptSessionData("user");
    this.headerService.setTitle('Non compliance of Query-CPD');
    this.headerService.isIndicate(false);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.headerService.isBack(false);
    this.getByClaimById();
    $("#appealDisposal").hide();
  }

  getByClaimById() {
    this.pendingService.getTxnDetails(this.getid).subscribe((data: any) => {
      let resData = data;
      if (resData.status == "success") {
        let details = JSON.parse(resData.details);
        this.claimDetails = details.actionData;
        this.claimLog = details.actionLog;
        this.preAuth = details.preAuthHist;
        if (this.preAuth.length != 0) {
          this.check = true;
        }
        if (this.claimLog.length != 0) {
          this.actionhistory = true;
        }

      } else {
        this.swal('', 'Something went wrong.', 'error');
      }
    },
      (error) => {
        this.swal('', 'Something went wrong.', 'error');
      });
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  dtls: any;
  viewDescription(descriptinDtls) {
    this.dtls = descriptinDtls;
    $("#appealDisposal").show();
  }
  modalClose() {
    $("#appealDisposal").hide();
  }
  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }
  preAuthLogDetail(urn: any, authCode: any, hosCode: any) {
    let authCodes = authCode;
    localStorage.setItem("urn", urn);
    localStorage.setItem("authorizedCode", authCodes);
    localStorage.setItem("hospitalCode", hosCode);
    localStorage.setItem("token", this.jwtService.getJwtToken())
    this.route.navigate([]).then(result => { window.open(environment.routingUrl + '/preauthhistory'); });
  }
  downloadAction(event: any, fileName: any, hCode: any, dateOfAdm: any) {
    let target = event.target;
    if ((target.nodeName == "A" || target.nodeName == "a") || (target.nodeName == "IMG" || target.nodeName == "img") || (target.nodeName == "I" || target.nodeName == "i") || (target.nodeName == "SPAN" || target.nodeName == "span")) {
      target = $(target);
      let anchor = target.parent();
      anchor = anchor.get(0);
      if (fileName != null) {
        this.snoService.downloadFiles(fileName, hCode, dateOfAdm).subscribe(
          (response: any) => {
            var result = response;
            let blob = new Blob([result], { type: result.type });
            let url = window.URL.createObjectURL(blob);
            window.open(url);
          },
          (error) => {
          }
        );
      }
    }
  }
  description: any;
  myGroup = new FormGroup({
    description: new FormControl()
  });
  submitDetails(urn: any, hospitalcode: any, transactiondetailsid: any) {
    let statusflag = 0;
    let claimstatus = 3;
    this.description = $('#description').val();
    let userId = this.user.userId;
    if (this.description == '' || this.description == null) {
      this.swal('', ' Description should not be left blank', 'error');
      return;
    }
    let data = {
      'userId': userId,
      'description': this.description,
      'transactiondetailsid': transactiondetailsid,
      'hospitalcode': hospitalcode,
      'urnNo': urn,
      'statusflag': statusflag,
      'claimBy': this.claimBy,
      'claimstatus': claimstatus
    }
    Swal.fire({
      title: '',
      text: "Are you sure To Request?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        this.pendingService.saveRejectRequestOfCPD(data)
          .subscribe((data: any) => {
            if (data.status == "Success") {
              this.swal("Success", data.message, "success");
              localStorage.removeItem("actionDataforcpdcompliance");
              this.route.navigate(['/application/CPDRejectedlist']);
            } else if (data.status == "Failed") {
              this.swal("Error", data.message, "error");
            }

          },
            (error) => {
              this.swal('', 'Something went wrong.', 'error');
            })
      }
    })
  }
  OncancelClaimRAise() {
    $('#description').val('');
    this.swal("error", "Request is Cancelled", "error");
    this.route.navigate(['/application/CPDRejectedlist']);
  }
  DescriptionValidation(event: KeyboardEvent) {
    const pattern = /^[A-Za-z0-9.,-_ \\s]+$/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}
