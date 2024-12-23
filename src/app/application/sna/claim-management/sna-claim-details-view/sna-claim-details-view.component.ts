import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderService } from 'src/app/application/header.service';
import { ClaimRaiseServiceService } from 'src/app/application/Services/claim-raise-service.service';
import { CreatecpdserviceService } from 'src/app/application/Services/createcpdservice.service';
import { FreshCaseAllocationService } from 'src/app/application/Services/freshcaseallocation.service';
import { SnoCLaimDetailsService } from 'src/app/application/Services/sno-claim-details.service';
import { JwtService } from 'src/app/services/jwt.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
@Component({
  selector: 'app-sna-claim-details-view',
  templateUrl: './sna-claim-details-view.component.html',
  styleUrls: ['./sna-claim-details-view.component.scss']
})
export class SnaClaimDetailsViewComponent implements OnInit {

  userdetailsByid: any = [];
  userdetailsByid1: any;
  getid: any;
  urnNo: any;
  preAuth: any;
  authorized: any;
  Hospital: any;
  dataClaim: any;
  datavalue: any;
  query: boolean = false;
  procedureNameStatus: boolean = false;
  highEndDrugList: any = [];
  implantDataList: any = [];
  wardDataList: any = [];
  implantTotalPrice: any;
  implantTotalUnitPrice: any;
  implantTotalUnit: any;
  highEndDrugTotalPrice: any;
  constructor(
    public allocateService: FreshCaseAllocationService,
    public headerService: HeaderService,
    private logser: ClaimRaiseServiceService,
    public router: Router,
    public snoService: SnoCLaimDetailsService,
    private jwtService: JwtService,
    private cpdService: CreatecpdserviceService,
    private location: Location
  ) {}

  ngOnInit() {
    this.dataClaim = JSON.parse(localStorage.getItem('claimData'));
    this.urnNo = this.dataClaim.urn;
    this.authorized = this.dataClaim.authroziedCode;
    this.Hospital = this.dataClaim.hospitalCode;
    this.headerService.setTitle('Casewise Patient Treatment Details');
    this.onSearchFilterClaimDetails();
    this.ongetpreAuthdata();
    // this.getPackageDetailsInfoList();
  }

  errorMessage: any;
  hsptlpatientdtls: any = [];
  onSearchFilterClaimDetails() {
    this.allocateService.getCPDCasePackageDetails(this.dataClaim).subscribe({
      next: (response: any) => {
        if (
          response &&
          response.status === 200 &&
          response.data &&
          response.data.data
        ) {
          // Assign the fetched data to the class property
          this.hsptlpatientdtls = response.data.data;

          // Ensure the data is correctly fetched and then log it
          if (this.hsptlpatientdtls.length > 0) {
            console.log('data: ' + this.hsptlpatientdtls[0].txnpackagedetailid);
            this.getPackageDetailsInfoList(
              this.hsptlpatientdtls[0].txnpackagedetailid
            );
          } else {
            console.log('No data available in hsptlpatientdtls array');
          }
        } else {
          this.errorMessage =
            response.message ||
            'An error occurred while fetching claim details.';
          console.log(this.errorMessage); // Log the error message if any
        }
      },
      error: () => {
        this.errorMessage = 'An error occurred while fetching claim details.';
        console.log(this.errorMessage); // Log if there was an error with the HTTP request
      },
    });
  }

  ongetpreAuthdata() {
    const URNnumber = this.urnNo;
    const Authroziedcode = this.authorized;
    const Hospitalcode = this.Hospital;

    this.cpdService
      .getPreAuthHistory(URNnumber, Authroziedcode, Hospitalcode)
      .subscribe({
        next: (data: any) => {
          this.preAuth = data;
          this.datavalue = this.preAuth.preAuthLogList;

          // Optional logic to check if data is available and update UI accordingly
          // this.query = this.preAuth.preAuthLogList.length > 0;
        },
        error: (err: any) => {
          // Handle the error gracefully
          this.errorMessage =
            'An error occurred while fetching the pre-authorization data. Please try again later.';
          // Optionally log the error somewhere else, e.g., a remote logging service
          // this.logService.logError(err);

          // Optionally reset UI or take appropriate actions
          this.datavalue = []; // Reset the data if necessary
        },
      });
  }

  preauthLogDetails() {
    var URNnumber = this.urnNo;
    var Authroziedcode = this.authorized;
    var Hospitalcode = this.Hospital;
    localStorage.setItem('urn', URNnumber);
    localStorage.setItem('authorizedCode', Authroziedcode);
    localStorage.setItem('hospitalCode', Hospitalcode);
    localStorage.setItem('token', this.jwtService.getJwtToken());
    this.router.navigate([]).then((result) => {
      window.open(environment.routingUrl + '/preauthhistory');
    });
  }
  OngetFalsebackbutton() {
    this.headerService.isBack(false);
    localStorage.setItem('status', JSON.stringify('true'));
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }

  showProcedureName() {
    $('#procedureNameId').text(this.userdetailsByid1.procedureName);
    $('#showMoreId').empty();
    $('#showMoreId1').append(
      '<div style="cursor: pointer; color: #1d89c9">Show Less</div>'
    );
  }

  hideProcedureName() {
    let procedureName = this.userdetailsByid1.procedureName;
    if (procedureName.length > 40) {
      this.procedureNameStatus = true;
      $('#procedureNameId').text(procedureName.substring(0, 40) + '...');
      $('#showMoreId1').empty();
      $('#showMoreId').empty();
      $('#showMoreId').append(
        '<span style="cursor: pointer; color: #1d89c9">Show More</span>'
      );
    }
  }
  myGroup = new FormGroup({
    remarks: new FormControl(),
  });
  pkgDetailsData: any = [];
  overAllDetailsData: any = [];
  // modalShow:boolean =false;
  getPackageDetails(packageCode, subPackageCode, procedureCode) {
    this.snoService
      .getPackageDetails(
        packageCode,
        subPackageCode,
        procedureCode,
        this.Hospital
      )
      .subscribe(
        (data: any) => {
          let resData = data;
          if (resData.status == 'success') {
            let packgeInfo = resData.data;
            let overallInfo = resData.data1;
            this.pkgDetailsData = JSON.parse(packgeInfo);
            this.overAllDetailsData = JSON.parse(overallInfo);
          } else {
            this.swal('', 'Something went wrong.', 'error');
          }
        },
        (error) => {
          console.log(error);
          this.swal('', 'Something went wrong.', 'error');
        }
      );
  }

  downloadActionforDischarge(
    event: any,
    fileName: any,
    hCode: any,
    dateOfAdm: any
  ) {
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
        this.snoService.downloadFiles(fileName, hCode, dateOfAdm).subscribe(
          (response: any) => {
            var result = response;
            let blob = new Blob([result], { type: result.type });
            let url = window.URL.createObjectURL(blob);
            window.open(url);
          },
          (error) => {}
        );
      }
    }
  }

  getPackageDetailsInfoList(txnpackagedetailid: any) {
    this.cpdService
      .getPackageDetailsInfoList(txnpackagedetailid)
      .subscribe((data) => {
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
      });
  }
  showPreDoc(id, text) {
    $('#preAuthDocId' + id).text(text);
    $('#showMoreId2' + id).empty();
    $('#showMoreId3' + id).append(
      '<div style="cursor: pointer; color: #1d89c9">Show Less</div>'
    );
  }

  hidePreDoc(id, text) {
    if (text.length > 30) {
      $('#preAuthDocId' + id).text(text.substring(0, 30) + '...');
      $('#showMoreId3' + id).empty();
      $('#showMoreId2' + id).empty();
      $('#showMoreId2' + id).append(
        '<span style="cursor: pointer; color: #1d89c9">Show More</span>'
      );
    }
  }

  showClaimDoc(id, text) {
    $('#claimProcessDocId' + id).text(text);
    $('#showMoreId4' + id).empty();
    $('#showMoreId5' + id).append(
      '<div style="cursor: pointer; color: #1d89c9">Show Less</div>'
    );
  }

  hideClaimDoc(id, text) {
    if (text.length > 30) {
      $('#claimProcessDocId' + id).text(text.substring(0, 30) + '...');
      $('#showMoreId5' + id).empty();
      $('#showMoreId4' + id).empty();
      $('#showMoreId4' + id).append(
        '<span style="cursor: pointer; color: #1d89c9">Show More</span>'
      );
    }
  }

  showPreDoc1(text) {
    $('#preAuthDocId').text(text);
    $('#showMoreId6').empty();
    $('#showMoreId7').append(
      '<div style="cursor: pointer; color: #1d89c9">Show Less</div>'
    );
  }

  hidePreDoc1(text) {
    if (text.length > 30) {
      $('#preAuthDocId').text(text.substring(0, 30) + '...');
      $('#showMoreId7').empty();
      $('#showMoreId6').empty();
      $('#showMoreId6').append(
        '<span style="cursor: pointer; color: #1d89c9">Show More</span>'
      );
    }
  }

  showClaimDoc1(text) {
    $('#claimProcessDocId').text(text);
    $('#showMoreId8').empty();
    $('#showMoreId9').append(
      '<div style="cursor: pointer; color: #1d89c9">Show Less</div>'
    );
  }

  hideClaimDoc1(text) {
    if (text.length > 30) {
      $('#claimProcessDocId').text(text.substring(0, 30) + '...');
      $('#showMoreId9').empty();
      $('#showMoreId8').empty();
      $('#showMoreId8').append(
        '<span style="cursor: pointer; color: #1d89c9">Show More</span>'
      );
    }
  }

  backClicked() {
    this.location.back();
  }

}
