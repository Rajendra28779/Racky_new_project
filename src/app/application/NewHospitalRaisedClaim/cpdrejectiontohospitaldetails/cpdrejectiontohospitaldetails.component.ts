import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../header.service';
import { ClaimRaiseServiceService } from '../../Services/claim-raise-service.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { LoginService } from 'src/app/services/shared-services/login.service';
import Swal from 'sweetalert2';
import { FormControl, FormGroup } from '@angular/forms';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { QueryByCpdService } from '../../Services/query-by-cpd.service';
declare let $: any;
@Component({
  selector: 'app-cpdrejectiontohospitaldetails',
  templateUrl: './cpdrejectiontohospitaldetails.component.html',
  styleUrls: ['./cpdrejectiontohospitaldetails.component.scss']
})
export class CpdrejectiontohospitaldetailsComponent implements OnInit {
  urlPreSurgery: any = "./assets/img/gallery.png";
  urlPostSurgery: any = "./assets/img/gallery.png";
  urlIntraSurgery: any = "./assets/img/gallery.png";
  urlSpecimenRemoval: any = "./assets/img/gallery.png";
  PatientPhoto: any = "./assets/img/gallery.png";
  childmessage: any;
  deleteReason: string = '';
  isSubmitAttempted: boolean = false;
  isDisabled: boolean = false;
  itemToDelete: any;
  itemTobeupload: any;
  caseid: any;
  data: any;
  errorMessage: any;
  newClaimDetailsData: any[] = [];
  newClaimDetailsData1: any[] = [];
  selectedProcedureCode: any;
  selectedProcedureName: any;
  selectedPackageType: any;
  selectedPackageAmount: any;
  selectedspecialityCode: any;
  selectedPatientName: any;
  URN: any;
  userdetailsByid: any = [];
  userdetailsByid1: any
  mimeType: any;
  selectedFile: any;
  selectedFilehospital: any;
  fileToUpload: any;
  TreatmentDetails: any;
  file: any;
  documentType: any;
  postdetails: any;
  predetails: any;
  specimandetails: any;
  intadetails: any;
  patientpic: any;
  user: any;
  msg: string;
  hospitalNav: string;
  maxChars = 1000;
  selectedtransactiondetailsid: any;
  constructor(public headerService: HeaderService, private logser: ClaimRaiseServiceService, public router: Router, private loginService: LoginService, 
    private sessionService: SessionStorageService,private service: QueryByCpdService
  ) { }

  ngOnInit(): void {
    document.querySelectorAll('[data-bs-toggle="tooltip"]');
    this.data = JSON.parse(localStorage.getItem("rejectioncaseid"));
    this.caseid = this.data.caseid;
    this.user = this.sessionService.decryptSessionData("user");
    this.headerService.setTitle('Case Details');
    this.headerService.isIndicate(true);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.headerService.isBack(false);
    this.getClaimrejectiondetails();
    this.getActiontakenhistory();

  }
  cpdqueryhsptldtls: any[] = [];
  cpdqueryhsptldtls1: any[] = [];
  getClaimrejectiondetails() {
    let caseid = this.caseid;
    this.service.getcpdquerytohospitaldetails(caseid).subscribe({
      next: (response: any) => {
        if (response && response.status === 200 && response.data) {
          this.cpdqueryhsptldtls = response?.data?.data;
          this.cpdqueryhsptldtls1 = response?.data?.data1;
          this.cpdqueryhsptldtls1.forEach(item => {
            item.originalAmount = item.hospitalDischargeAmount; // Store original value
            item.modifiedAmount = item.hospitalDischargeAmount; // Initialize modified amount
          });
        } else {
          this.errorMessage = response.message || 'An error occurred while fetching claim details.';
        }
      },
      error: () => {
        this.errorMessage = 'An error occurred while fetching claim details.';
      }
    });
  }

  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }


  getSum(field: string): number {
    return this.cpdqueryhsptldtls1
      .filter(item => item.deletedstatus !== '1') // Filter out rows where deletedstatus is '1'
      .reduce((acc, item) => acc + (parseFloat(item[field]) || 0), 0); // Calculate the sum
  }
  

  getactiontakenData: any[] = [];
  getActiontakenhistory(){
    let id = this.caseid;
    this.service.getgetActiontakenhistory(id).subscribe({
      next: (response: any) => {
        if (response && response.status === 200 && response.data) {
          console.log(response.data);
          this.getactiontakenData = response?.data?.data;
        } else {
          this.errorMessage = response.message || 'An error occurred while fetching claim details.';
        }
      },
      error: () => {
        this.errorMessage = 'An error occurred while fetching claim details.';
      }
    });
  }

  currentPage: any;
  openDetails(transactiondetailsId: any, urn: any, authorizedCode: any, hospitalCode: any) {
    let state = {
      Action: transactiondetailsId,
      URN: urn,
      Authroziedcode: authorizedCode,
      Hospitalcode: hospitalCode
    }
    console.log(state);
    localStorage.setItem("actionDataforclaim", JSON.stringify(state));
    localStorage.setItem("currentPageNum", JSON.stringify(this.currentPage));
    this.router.navigate([]).then((result) => {
      window.open(environment.routingUrl + '/Hospitalclaimwisepatienttreatmentdetails');
    });
  }
}
