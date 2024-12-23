import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { PackageDetailsMasterService } from '../../Services/package-details-master.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-package-details-master',
  templateUrl: './package-details-master.component.html',
  styleUrls: ['./package-details-master.component.scss'],
})
export class PackageDetailsMasterComponent implements OnInit {
  hospitalCategory: any;
  packageHeader: any;
  packageSubcategory: any;
  packageheaderId: any;
  packageDetails: FormGroup;
  updateId: any;
  getByPackageDetailsId: any;
  isVisibleSave: boolean;
  isVisibleUpdate: boolean;
  subCode: any;
  currentUser: any;
  value: string;
  maxChars = 1000;
  @ViewChild('multiSelect') multiSelect;

  constructor(
    public fb: FormBuilder,
    public headerService: HeaderService,
    private route: Router,
    public activeroute: ActivatedRoute,
    public packageDetailsMasterService: PackageDetailsMasterService,
    private sessionService: SessionStorageService,
    private encryptionService: EncryptionService
  ) {}

  updateData = {
    packageHeaderCode: '',
    packageSubcatagoryId: '',
    procedureCode: '',
    procedureDescription: '',
    mandatoryPreauth: '',
    packageCatagoryType: '',
    maximumDays: '',
    dayCare: '',
    multiProcedure: '',
    stayType: '',
    claimProcessDocs: '',
    preauthDocs: '',
    packageExtention: '',
    priceEditable: '',
    isPackageException: '',
    scheme:[],
    isSurgical:'',
    extnofstay:''
  };

  ngOnInit(): void {
    this.getSchemeDetails();
    this.headerService.setTitle('Package Details Master');
    this.updateId = this.activeroute.snapshot.paramMap.get('id');
    this.getHospitalcategory();
    this.getPackageHeader();
    this.getByPackageDetails();
    this.currentUser = this.sessionService.decryptSessionData('user');
    this.packageDetails = this.fb.group({
      packageHeaderCode: new FormControl(''),
      packageSubcatagoryId: new FormControl(''),
      procedureCode: new FormControl(''),
      procedureDescription: new FormControl(''),
      mandatoryPreauth: new FormControl(''),
      packageCatagoryType: new FormControl(''),
      maximumDays: new FormControl(''),
      dayCare: new FormControl(''),
      packageSubcode: new FormControl(''),
      stayType: new FormControl(''),
      claimProcessDocs: new FormControl(''),
      preauthDocs: new FormControl(''),
      packageExtention: new FormControl(''),
      priceEditable: new FormControl(''),
      isPackageException: new FormControl(''),
      scheme: new FormControl(''),
      isSurgical: new FormControl(''),
      createdBy: this.currentUser.userId,
      updatedBy: this.currentUser.userId,
      extnofstay:new FormControl(''),
    });
    this.isVisibleSave = true;
    this.isVisibleUpdate = false;

    this.settingScheme = {
      singleSelection: false,
      idField: 'schemeCategoryId',
      textField: 'categoryName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true,
    };
  }

  getPackageHeader() {
    this.packageDetailsMasterService.getAllHeader().subscribe((data: any) => {
      this.packageHeader = data;
    });
  }

  getHospitalcategory() {
    this.packageDetailsMasterService
      .getAllHospitalCategory()
      .subscribe((data: any) => {
        this.hospitalCategory = data;
      });
  }

  onChangeHeaderName(id) {
    localStorage.setItem('packageheadercode', id);
    this.packageDetailsMasterService
      .getAllSubcategory(id)
      .subscribe((res: any) => {
        this.packageSubcategory = res;
      });
  }

  onChangeSubcategory(id) {
    for (var i = 0; i < this.packageSubcategory?.length; i++) {
      var code = this.packageSubcategory[i];
      if (id == code.subcategoryId) {
        this.subCode = code.packagesubcategorycode;
      }
    }
  }

  swal(title, text, icon) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }

  getByPackageDetails() {
    let categoryId = [];
    let scmList = [];
    if (!this.updateId) {
      return;
    }
    this.packageDetailsMasterService
      .getByPackageDetailsId(this.updateId)
      .subscribe((response: any) => {
        let responseData = response;
        console.log(responseData);
        this.getByPackageDetailsId = responseData.packageDetailsMaster;
        let packageMapping = responseData.schemMapping;
        this.schemeList.forEach(element => {
          packageMapping.forEach(element1 => {
            if(element.schemeCategoryId == element1.schemeCategoryId){
              scmList.push(element);
            }
          });
        });
        console.log(scmList);
        this.updateData.packageHeaderCode =
          this.getByPackageDetailsId.packageHeaderCode;
        this.onChangeHeaderName(this.updateData.packageHeaderCode);
        this.updateData.packageSubcatagoryId =
          this.getByPackageDetailsId.packageSubcatagory.subcategoryId;
        this.onChangeSubcategory(this.updateData.packageSubcatagoryId);
        this.updateData.procedureCode =
          this.getByPackageDetailsId.procedureCode;
        this.updateData.procedureDescription =
          this.getByPackageDetailsId.procedureDescription;
        this.updateData.mandatoryPreauth =
          this.getByPackageDetailsId.mandatoryPreauth;
        this.updateData.packageCatagoryType =
          this.getByPackageDetailsId.packageCatagoryType;
        this.updateData.maximumDays = this.getByPackageDetailsId.maximumDays;
        this.updateData.dayCare = this.getByPackageDetailsId.dayCare==null?"":this.getByPackageDetailsId.dayCare;
        this.subCode =
          this.getByPackageDetailsId.packageSubcatagory.subcategoryId;
        this.updateData.multiProcedure =
          this.getByPackageDetailsId.multiProcedure;
        this.updateData.stayType = this.getByPackageDetailsId.stayType;
        this.updateData.claimProcessDocs =
          this.getByPackageDetailsId.claimProcessDocs;
        this.updateData.preauthDocs = this.getByPackageDetailsId.preauthDocs;
        this.updateData.packageExtention =
          this.getByPackageDetailsId.packageExtention;
        this.updateData.priceEditable =
          this.getByPackageDetailsId.priceEditable;
        this.updateData.isPackageException =
          this.getByPackageDetailsId.ispackageException;
        this.updateData.isSurgical = this.getByPackageDetailsId.isSurgical;
        this.updateData.extnofstay = this.getByPackageDetailsId.extnofstay==null?"":this.getByPackageDetailsId.extnofstay;
        this.updateData.scheme = scmList;
        this.isVisibleSave = false;
        this.isVisibleUpdate = true;
      },(error) => {
        this.swal('', 'Something went wrong.', 'error');
      });
  }

  onChange(event) {
    this.value = 'Y';
    if (event.target.checked) {
      event.target.checked = this.value;
    }
  }

  savegroup() {
    let packageHeaderCode = this.packageDetails.value.packageHeaderCode;
    let packageSubcatagoryId = this.packageDetails.value.packageSubcatagoryId;
    let procedureCode = this.packageDetails.value.procedureCode;
    let procedureDescription = this.packageDetails.value.procedureDescription;
    let packageCatagoryType = this.packageDetails.value.packageCatagoryType;
    let mandatoryPreauth = this.packageDetails.value.mandatoryPreauth;
    let maximumDays = this.packageDetails.value.maximumDays;
    let dayCare = this.packageDetails.value.dayCare;
    let stayType = this.packageDetails.value.stayType;
    let claimProcessDocs = this.packageDetails.value.claimProcessDocs;
    let preauthDocs = this.packageDetails.value.preauthDocs;
    let packageExtention = this.packageDetails.value.packageExtention;
    let priceEditable = this.packageDetails.value.priceEditable;
    let isPackageException = this.packageDetails.value.isPackageException;
    let scheme = this.packageDetails.value.scheme;
    let isSurgical = this.packageDetails.value.isSurgical;
    let extnofstay = this.packageDetails.value.extnofstay;
    if (packageHeaderCode == null || packageHeaderCode == '') {
      $('#packageHeaderCode').focus();
      this.swal('Info', 'Please Select Package Header', 'info');
      return;
    }

    if (packageSubcatagoryId == null || packageSubcatagoryId == '') {
      $('#packageSubcatagoryId').focus();
      this.swal('Info', 'Please Select Package Subcatagory', 'info');
      return;
    }

    if (procedureCode == null || procedureCode == '') {
      $('#procedureCode').focus();
      this.swal('Info', 'Please Enter Procedure Code', 'info');
      return;
    }

    if (procedureDescription == null || procedureDescription == '') {
      $('#procedureDescription').focus();
      this.swal('Info', 'Please Enter Procedure Description', 'info');
      return;
    }
    if (mandatoryPreauth == null || mandatoryPreauth == '') {
      $('#mandatoryPreauth').focus();
      this.swal('Info', 'Please Enter Mandatory Preauth', 'info');
      return;
    }

    if (packageCatagoryType == null || packageCatagoryType == '') {
      $('#packageCatagoryType').focus();
      this.swal('Info', 'Please select Package Category Type', 'info');
      return;
    }

    if (maximumDays == null || maximumDays == '') {
      $('#maximumDays').focus();
      this.swal('Info', 'Please Enter Maximum Days', 'info');
      return;
    }

    if (dayCare == null || dayCare == '') {
      $('#dayCare').focus();
      this.swal('Info', 'Please Select Day Care', 'info');
      return;
    }
    if (stayType == null || stayType == '') {
      $('#stayType').focus();
      this.swal('Info', 'Please Enter Fixed/Variable length of stay', 'info');
      return;
    }
    if (preauthDocs == null || preauthDocs == '') {
      $('#preauthDocs').focus();
      this.swal('Info', 'Please Enter PreAuth Docs', 'info');
      return;
    }
    if (claimProcessDocs == null || claimProcessDocs == '') {
      $('#claimProcessDocs').focus();
      this.swal('Info', 'Please Enter Claim Processes Docs', 'info');
      return;
    }
    if (packageExtention == null || packageExtention == '') {
      $('#packageExtention').focus();
      this.swal('Info', 'Please Enter Package Extention', 'info');
      return;
    }
    if (priceEditable == null || priceEditable == '') {
      $('#priceEditable').focus();
      this.swal('Info', 'Please Enter Price Editable', 'info');
      return;
    }

    if (isPackageException == null || isPackageException == '') {
      $('#isPackageException').focus();
      this.swal('Info', 'Please Enter Package Under Exception', 'info');
      return;
    }
    if (scheme == null || scheme == '' || scheme== undefined) {
      $('#scheme').focus();
      this.swal('Info', 'Please select Scheme', 'info');
      return;
    }
    if (isSurgical == null || isSurgical == '' || isSurgical== undefined) {
      $('#isSurgical').focus();
      this.swal('Info', 'Please select Surgical', 'info');
      return;
    }
    if(isSurgical=='M'){
      if (extnofstay == null || extnofstay == '' || extnofstay== undefined) {
        $('#extnofstay').focus();
        this.swal('Info', 'Please select Extension Of Stay Allow', 'info');
        return;
      }
    }
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Save it!',
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.updateId) {
          this.packageDetails.value.packageSubcode = this.subCode;
          this.packageDetailsMasterService
            .updatePackageDetails(this.packageDetails.value, this.updateId)
            .subscribe((data: any) => {
              if (data.status == 'Success') {
                this.swal('Success', data.message, 'success');
                this.route.navigate(['/application/packageDetailsMasterView']);
              } else if (data.status == 'Failed') {
                this.swal('Error', data.message, 'error');
              }
            },(error) => {
              this.swal('', 'Something went wrong.', 'error');
            });
        } else {
          this.packageDetails.value.packageSubcode = this.subCode;
          this.packageDetailsMasterService
            .savePackageDetails(this.packageDetails.value)
            .subscribe((data: any) => {
              if (data.status == 'Success') {
                this.swal('Success', data.message, 'success');
                this.route.navigate(['/application/packageDetailsMasterView']);
              } else if (data.status == 'Failed') {
                this.swal('Error', data.message, 'error');
              }
            },(error) => {
              this.swal('', 'Something went wrong.', 'error');
            });
        }
      }
    });
  }
  reset() {
    window.location.reload();
  }

  numericOnly(event) {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }
  schemeList:any = [];
  public settingScheme: IDropdownSettings = {};
  schemePlaceHolder: "Select Scheme";

  getSchemeDetails() {
    let data = {
      action: 'B',
      schemeId:1,
      schemeCategoryId: '',
    };
    let encData = this.encryptionService.encryptRequest(data);
    this.packageDetailsMasterService
      .getSchemeDetails(encData)
      .subscribe((res: any) => {
        let resData = this.encryptionService.getDecryptedData(res);
        if(resData.status == 'success') {
          this.schemeList=resData.data;
        }else{
        this.swal('', 'Something went wrong.', 'error');
        }
        console.log(this.schemeList);
      },
      (error) => {
        this.swal('', 'Something went wrong.', 'error');
      });
  }
  selectedSchemeList:any=[];
  schemeObj:any;
  onSelect(item) {
    this.schemeObj = {
      schemeCategoryId: ""
    }
    this.schemeObj.schemeCategoryId = item.schemeCategoryId;

    let stat: boolean = false;
    for (const i of this.selectedSchemeList) {
      if (i.schemeCategoryId == this.schemeObj.schemeCategoryId) {
        stat = true;
      }
    }
    if (stat == false) {
      this.selectedSchemeList.push(this.schemeObj);
    }
    console.log(this.selectedSchemeList);
  }
  onDeSelect(item) {
    for (let i = 0; i < this.selectedSchemeList.length; i++) {
      if (item.schemeCategoryId == this.selectedSchemeList[i].schemeCategoryId) {
        let index = this.selectedSchemeList.indexOf(this.selectedSchemeList[i]);
        if (index !== -1) {
          this.selectedSchemeList.splice(index, 1);
        }
      }
    }
    console.log(this.selectedSchemeList);
  }
  onSelectAll(list) {
    for (let x = 0; x < list.length; x++) {
      let item = list[x];
      this.schemeObj = {
        schemeCategoryId: ""
      }
      this.schemeObj.schemeCategoryId = item.schemeCategoryId;

      let stat: boolean = false;
      for (const i of this.selectedSchemeList) {
        if (i.schemeCategoryId == this.schemeObj.schemeCategoryId) {
          stat = true;
        }
      }
      if (stat == false) {
        this.selectedSchemeList.push(this.schemeObj);
      }
    }
    console.log(this.selectedSchemeList);
  }
  onDeSelectAll(list) {
    this.selectedSchemeList = [];
    console.log(this.selectedSchemeList);
  }
}
