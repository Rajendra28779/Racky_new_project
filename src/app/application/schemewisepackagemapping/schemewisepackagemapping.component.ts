import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { EncryptionService } from 'src/app/services/encryption.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import Swal from 'sweetalert2';
import { HeaderService } from '../header.service';
import { HospitalPackageMappingService } from '../Services/hospital-package-mapping.service';
import { PackageDetailsMasterService } from '../Services/package-details-master.service';
import { QcadminServicesService } from '../Services/qcadmin-services.service';
import { SnocreateserviceService } from '../Services/snocreateservice.service';

@Component({
  selector: 'app-schemewisepackagemapping',
  templateUrl: './schemewisepackagemapping.component.html',
  styleUrls: ['./schemewisepackagemapping.component.scss']
})
export class SchemewisepackagemappingComponent implements OnInit {

  user:any;
  stateList:any=[];
  districtList:any=[];
  hospitalList:any=[];
  specialist:any;
  hospitalId: any;
  hospitalname: any;
  showtable: boolean=false;
  packageHeaderItem:any=[] ;
  packageHeaderItembkp:any=[] ;
  keyword2 = 'hospitalName';
  checkall :any=0;
  tagged: any=0;
  untagged: any=0;

  constructor(private hospitalService: HospitalPackageMappingService,
    private snoService: SnocreateserviceService,
    public headerService: HeaderService,
    private sessionService: SessionStorageService,
    public route: Router,
    public qcadminserv: QcadminServicesService,
    private encryptionService: EncryptionService,
    public packageDetailsMasterService: PackageDetailsMasterService) { }

  ngOnInit(): void {
    this.headerService.setTitle('Scheme wise Hospital mapping');
    this.user = this.sessionService.decryptSessionData('user');
    this.getStateList();
    this.getSchemeDetails();
  }

  getStateList() {
    this.snoService.getStateList().subscribe((response) => {
      this.stateList = response;
    });
  }

  OnChangescheme(){
    this.showtable=false;
    this.specialist=[];
  }
  OnChangeState(id) {
    this.showtable=false;
    this.specialist=[];
    this.snoService.getDistrictListByStateId(id).subscribe((response) => {
      this.districtList = response;
    });
  }

  getHospitalList() {
    this.showtable=false;
    this.specialist=[];
    let state;
    let dist;
      state = $('#stateId').val();
      dist = $('#districtId').val();
    this.qcadminserv.gettmasactivehospitallist(state, dist).subscribe((response) => {
        this.hospitalList = response;
      });
  }

  selectEvent2(item) {
    this.hospitalId = item.hospitalCode;
    this.hospitalname = item.hospitalName;
    this.showtable=false;
    this.specialist=[];
  }

  getpackagelist() {
    if(this.schemecatagory == null || this.schemecatagory==undefined || this.schemecatagory=="") {
      this.swal('Info',"Please Select Scheme Category !","info");
      return;
    }
    let state=$('#stateId').val();
    if(state == null || state==undefined || state=="") {
      this.swal('Info',"Please Select State Name !","info");
      return;
    }
    let dist=$('#districtId').val();
    if(dist == null || dist==undefined || dist=="") {
      this.swal('Info',"Please Select District Name !","info");
      return;
    }
    if(this.hospitalId == null || this.hospitalId==undefined || this.hospitalId=="") {
      this.swal('Info',"Please Select Hospital Name !","info");
      return;
    }

    this.hospitalService
      .getschemepackagelistbyhospitalid(this.hospitalId, this.user.userId,2)
      .subscribe((response:any) => {
        if(response.status == 200) {
        this.packageHeaderItem = response.data;
        this.packageHeaderItembkp=response.data;
        this.checkall=response.checkall;
        this.tagged=response.tagged;
        this.untagged=response.untag;
        this.showtable = true;
        this.specialist = [];
        }else{
          this.swal('Error',"Something Went Wrong","error");
        }
      });
  }

  schemecatagory: any=2;
  schemeList: any = [];
  getSchemeDetails() {
    let data = {
      action: 'B',
      schemeId: 1,
      schemeCategoryId: '',
    };
    let encData = this.encryptionService.encryptRequest(data);
    this.packageDetailsMasterService.getSchemeDetails(encData).subscribe((res: any) => {
      let resData = this.encryptionService.getDecryptedData(res);
      if (resData.status == 'success') {
        this.schemeList = resData.data;
      } else {
        this.swal('', 'Something went wrong.', 'error');
      }
    },
      (error) => {
        this.swal('', 'Something went wrong.', 'error');
      });
  }

  clearEvent2() {
    this.hospitalId = '';
    this.hospitalname = '';
    this.showtable = false;
    this.specialist = [];
  }

  onSelectType(item:any,no:any){
    let flag = $('#preauth' + no).val();
    let stat=true;
    for (const i of this.specialist) {
      if (i.packageid == item.packageid) {
        i.flag=flag;stat=false;
      }
    }
    if(stat){
      this.special = {
        packageid: item.packageid,
        packagecode: item.packagecode,
        status: 0,
        flag: flag,
      };
      this.specialist.push(this.special);
    }
  }

  swal(title, text, icon) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }

  allcheck(event){
    this.specialist=[];
    this.packageHeaderItem=this.packageHeaderItembkp
    let status;
    if(event.target.checked){
      status=0;
    }else{
      status=1;
    }
  for(let i=0;i<this.packageHeaderItem.length;i++){
    this.packageHeaderItem[i].showstatus=this.packageHeaderItem[i].status;
    if(this.packageHeaderItem[i].status!=status){
      this.selectitem(this.packageHeaderItem[i],i);
      if(status==1){$('#preauth' + i).val('');};
    }else{
      this.packageHeaderItem[i].showstatus=this.packageHeaderItem[i].status;
    }
  }

  }

  special: any;
  selectitem(item: any,no:any) {
    for (let i = 0; i < this.packageHeaderItem.length; i++) {
      if (this.packageHeaderItem[i].packageid == item.packageid) {
        this.packageHeaderItem[i].showstatus =
          this.packageHeaderItem[i].showstatus == 0 ? 1 : 0;
      }
    }

    this.special = {
      packageid: '',
      packagecode: '',
      status: 0,
      flag: '',
    };
    this.special.packageid = item.packageid;
    this.special.packagecode = item.packagecode;
    this.special.status = item.status == 0 ? 1 : 0;
    let stat = false;
    for (const i of this.specialist) {
      if (i.packageid == this.special.packageid) {
        stat = true;
      }
    }
    if (stat == false) {
      this.specialist.push(this.special);
    } else {
      for (let i = 0; i < this.specialist.length; i++) {
        if (item.packageid == this.specialist[i].packageid) {
          let index = this.specialist.indexOf(this.specialist[i]);
          if (index !== -1) {
            this.specialist.splice(index, 1);
          }
        }
      }
      $('#preauth' + no).val('');
    }

    if(this.specialist.length==this.untagged){
      this.checkall=0;
      $('#allchk').prop('checked', true);
    }else if(this.specialist.length==this.tagged){
      this.checkall=1;
      $('#allchk').prop('checked', false);
    }else{
      this.checkall=1;
      $('#allchk').prop('checked', false);
    }
  }

  submit(){
    console.log(this.specialist);
    if (this.specialist.length == 0) {
      this.swal('Info', 'Please select at least One Specialist', 'info');
      return;
    }

    let checkHospitalType=false
    this.specialist.forEach(element => {
      if (element.flag == null || element.flag == undefined || element.flag == "") {
        checkHospitalType = true;
      }
    });
    if (checkHospitalType) {
      this.swal('Info', 'Please select Is Pre-Auth Required', 'info');
      return;
    }

    Swal.fire({
      title: 'Are You Sure?',
      text: 'You Want To Updated This !',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,Updated It!',
    }).then((result) => {
      if (result.isConfirmed) {
        let object = {
          hospitalcode: this.hospitalId,
          specialist: this.specialist,
          createdby: this.user.userId,
          schemeid:2//this.schemecatagory
        };
        this.hospitalService.updateschemepackage(object).subscribe((response:any) => {
            if(response.status == 200) {
              this.swal('Success',"Record Updated Successfully ","success");
            this.getpackagelist();
            this.specialist=[];
            }else{
              this.swal('Error',"Something Went Wrong","error");
            }
          });
        }
    });
  }

  onReset(){
    window.location.reload();
  }


}
