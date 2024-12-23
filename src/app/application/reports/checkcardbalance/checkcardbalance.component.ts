import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { HealthDeptDtlAdauthServiceService } from '../../Services/health-dept-dtl-adauth-service.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { PackageDetailsMasterService } from '../../Services/package-details-master.service';

@Component({
  selector: 'app-checkcardbalance',
  templateUrl: './checkcardbalance.component.html',
  styleUrls: ['./checkcardbalance.component.scss'],
})
export class CheckcardbalanceComponent implements OnInit {
  user: any;
  urn: any;
  response: any;
  cardbalance: any = [];
  family: any = [];
  benific: any = [];
  show: any = false;
  schemename: any = "";

  constructor(
    public headerService: HeaderService,
    public Service: HealthDeptDtlAdauthServiceService,
    private sessionService: SessionStorageService,
    private encryptionService: EncryptionService,
    public packageDetailsMasterService: PackageDetailsMasterService
  ) {}

  ngOnInit(): void {
    this.headerService.setTitle('Check Card Balance');
    // this.user = JSON.parse(sessionStorage.getItem("user"));
    this.user = this.sessionService.decryptSessionData('user');
    // this.getSchemeData();
    // this.getSchemeDetails();
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
  search: any;
  Search() {
    // this.schemeCategoryIdValue = $('#schemacategory').val();
    this.search = $('#search').val();
    if (this.search == '' || this.search == null || this.search == undefined) {
      this.swal('', 'Please Fill Search Type', 'error');
      return;
    }
    this.urn = $('#urn').val();
    if (this.urn == '' || this.urn == null || this.urn == undefined) {
      if (this.search == 'A') {
        this.swal('', 'Please Fill URN/Ration Card No. !', 'error');
      } else if (this.search == 'B') {
        this.swal('', 'Please Fill Aadhar Card No.', 'error');
      } else {
        this.swal('', 'Please Fill Search Type !', 'error');
      }
      return;
    }
    this.Service.checkcardbalance(this.urn, this.search,this.schemeidvalue,this.schemeCategoryIdValue).subscribe(
      (data: any) => {
        this.response = data;
        this.show = true;
        this.cardbalance = this.response.cardbalance;
        this.family = this.response.family;
        this.benific = this.response.benificiary;
        if(this.benific.length>0){
          this.schemename=this.benific[0].scheme
        }
      }
    );
  }
  getReset() {
    $('#urn').val('');
    $('#search').val('');
    this.show = false;
  }
  scheme: any;
  schemeidvalue: any=1;
  schemeName: any;
  getSchemeData() {
    let data = {
      action: 'A',
      schemeId: 1,
      schemeCategoryId: '',
    };
    let encData = this.encryptionService.encryptRequest(data);
    this.packageDetailsMasterService.getSchemeDetails(encData).subscribe(
      (res: any) => {
        let resData = this.encryptionService.getDecryptedData(res);
        if (resData.status == 'success') {
          this.scheme = resData.data;
          for (let i = 0; i < this.scheme.length; i++) {
            this.schemeidvalue = this.scheme[i].schemeId;
            this.schemeName = this.scheme[i].schemeName;
          }
        } else {
          this.swal('', 'Something went wrong.', 'error');
        }
      },
      (error) => {
        this.swal('', 'Something went wrong.', 'error');
      }
    );
  }
  schemeList: any = [];
  getSchemeDetails() {
    let data = {
      action: 'B',
      schemeId: 1,
      schemeCategoryId: '',
    };
    let encData = this.encryptionService.encryptRequest(data);
    this.packageDetailsMasterService.getSchemeDetails(encData).subscribe(
      (res: any) => {
        let resData = this.encryptionService.getDecryptedData(res);
        if (resData.status == 'success') {
          this.schemeList = resData.data;
          //  this.InclusionofsearchingforschemePackageData();
        } else {
          this.swal('', 'Something went wrong.', 'error');
        }
      },
      (error) => {
        this.swal('', 'Something went wrong.', 'error');
      }
    );
  }
  schemeCategoryIdValue: any=0;
  getschemacategoryid(event: any) {
    for (let i = 0; i < this.schemeList.length; i++) {
      if (event == this.schemeList[i].schemeCategoryId)
        this.schemeCategoryIdValue = this.schemeList[i].schemeCategoryId;
    }
  }
}
