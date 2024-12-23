import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/services/jwt.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { PendingService } from '../../pending.service';
import { ClaimRaiseServiceService } from '../../Services/claim-raise-service.service';
import { CreatecpdserviceService } from '../../Services/createcpdservice.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-pendingclaimdetails',
  templateUrl: './pendingclaimdetails.component.html',
  styleUrls: ['./pendingclaimdetails.component.scss']
})
export class PendingclaimdetailsComponent implements OnInit {
  dataClaim: any;
  getid: any;
  urnNo: any;
  authorized: any;
  Hospital: any;
  preAuthdata: any;
  preAuth: any;
  userdetailsByid: any = [];
  userdetailsByid1: any = [];
  childmessage: any;
  check: boolean = false;
  user: any;
  maxChars = 200;
  claimBy: any;
  claimDetails: any;
  constructor(public headerService: HeaderService, private jwtService: JwtService, public route: Router, private pendingService: PendingService, private cpdService: CreatecpdserviceService, private logser: ClaimRaiseServiceService, private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.dataClaim = JSON.parse(localStorage.getItem("actionDataforpending"));
    this.getid = this.dataClaim.Action;
    this.urnNo = this.dataClaim.URN;
    this.authorized = this.dataClaim.Authroziedcode;
    this.Hospital = this.dataClaim.Hospitalcode;
    this.claimBy = this.dataClaim.claimraisedBy;
    this.user =  this.sessionService.decryptSessionData("user");
    this.headerService.setTitle('Non Uploading Initial Document');
    this.headerService.isIndicate(false);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.headerService.isBack(false);
    this.onSearchFilterClaimDetails();
  }
  onSearchFilterClaimDetails() {
    var check = this.getid;
    this.pendingService.getDetails(check).subscribe((data: any) => {
      let resData = data;
      if (resData.status == "success") {
        let details = JSON.parse(resData.details);
        this.claimDetails = details.actionData;
        this.preAuth = details.preAuthHist;
        if (this.preAuth.length != 0) {
          this.check = true;
        }

      } else {
        this.swal('', 'Something went wrong.', 'error');
      }
    },
      (error) => {
        this.swal('', 'Something went wrong.', 'error');
      });
  }

  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }
  description: any;
  myGroup = new FormGroup({
    description: new FormControl()
  });
  submitDetails(urn, hospitalcode, transactiondetailsid) {
    let statusflag = 0;
    let claimstatus = 0;
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
        this.pendingService.saveRejectRequest(data)
          .subscribe((data: any) => {
            if (data.status == "Success") {
              this.swal("Success", data.message, "success");
              localStorage.removeItem("actionDataforpending");
              this.route.navigate(['/application/RejectedClaim']);
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
    this.route.navigate(['/application/RejectedClaim']);
  }
  preAuthLogDetail(urn: any, authCode: any, hosCode: any) {
    let authCodes = authCode;
    localStorage.setItem("urn", urn);
    localStorage.setItem("authorizedCode", authCodes);
    localStorage.setItem("hospitalCode", hosCode);
    localStorage.setItem("token", this.jwtService.getJwtToken())
    this.route.navigate([]).then(result => { window.open(environment.routingUrl + '/preauthhistory'); });
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  DescriptionValidation(event: KeyboardEvent) {
    const pattern = /^[A-Za-z0-9.,-_ \\s]+$/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}
