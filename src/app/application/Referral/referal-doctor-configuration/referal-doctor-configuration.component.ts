import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ReferralService } from '../../Services/referral.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';


@Component({
  selector: 'app-referal-doctor-configuration',
  templateUrl: './referal-doctor-configuration.component.html',
  styleUrls: ['./referal-doctor-configuration.component.scss']
})
export class ReferalDoctorConfigurationComponent implements OnInit {
  user: any;
  cPDID: any;
  placeHolder = "Select Hospital";
  updatelist: any;
  public cpdList: any = [];
  public stateList: any = [];
  public districtList: any = [];
  public hospitalList: any = [];
  public blocklist: any = [];
  isUpdateBtnInVisible: boolean;
  isEditBtn: boolean;
  submitted: boolean = false;
  sid: any;
  did: any;
  hospitalArray: any;
  selectedItems: any = [];
  cpdId: any;
  keyword: any = 'fullname';
  hospObj: any;
  hospList: any = [];
  ipAddress: any;
  shodetails:any=false;
  sdistrictcode:any;

  @ViewChild('multiSelect') multiSelect;
  @ViewChild('auto') auto;
  mobileno: any;
  emailid: any;
  constructor(public fb: FormBuilder, private snoService: SnocreateserviceService,
    public headerService: HeaderService, public route: Router,private userService: ReferralService,private sessionService: SessionStorageService) {
    this.cPDID = this.route.getCurrentNavigation().extras.state;
  }

  form!: FormGroup;
  public settingDistrict = {};
  // public settingHospital = {};
  dropdownSettings: IDropdownSettings = {};
  ngOnInit(): void {
    this.headerService.setTitle('Referral Doctor Configuration');
    this.isUpdateBtnInVisible = true;
    this.isEditBtn = false;
    this.getCPDList();
    // this.getStateList();
    this.OnChangeState(21);
    // this.user = JSON.parse(sessionStorage.getItem("user"))
    this.user = this.sessionService.decryptSessionData("user");
    this.form = this.fb.group({
      cpdId: new FormControl(''),
      cpdName: new FormControl(''),
      hospitaltype: new FormControl(''),
      hospitalCode: new FormControl(null, []),
      hospList: new FormControl('', []),
      createdBy: new FormControl(this.user.userId),
      updatedBy: new FormControl(this.user.userId)
    });

    if (this.cPDID) {
      this.getCpdByIds(this.cPDID);
    }

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'hospitalid',
      textField: 'hospitalname',
      itemsShowLimit: 0,
      allowSearchFilter: true,
      selectAllText: 'Select All',
      unSelectAllText: "Un-Select All",
    };
  }


  onItemSelect(item) {
    this.hospObj={
      stateCode:"",
      stateName:"",
      districtCode:"",
      districtName:"",
      blockCode:"",
      blockName:"",
      hospitalCode:"",
      hospitalName:""
    }
    this.hospObj.stateCode = $('#stateId').val();
    this.hospObj.stateName = "Odisha";
    // for(var i=0;i<this.stateList.length;i++) {
    //   if(this.hospObj.stateCode==this.stateList[i].stateCode) {
    //     this.hospObj.stateName = this.stateList[i].stateName;
    //   }
    // }
    this.hospObj.districtCode = $('#districtId').val();
    for(var i=0;i<this.districtList.length;i++) {
      if(this.hospObj.districtCode==this.districtList[i].districtcode) {
        this.hospObj.districtName = this.districtList[i].districtname;
      }
    }
    this.hospObj.blockCode = $('#blockId').val();
    for(var i=0;i<this.blocklist.length;i++) {
      if(this.hospObj.blockCode==this.blocklist[i].blockcode) {
        this.hospObj.blockName = this.blocklist[i].blockname;
      }
    }
    this.hospObj.hospitalCode = item.hospitalid;
    for(var i=0;i<this.hospitalList.length;i++) {
      if(this.hospObj.hospitalCode==this.hospitalList[i].hospitalid) {
        this.hospObj.hospitalName = this.hospitalList[i].hospitalname;
      }
    }

    var stat:boolean = false;
    for (const i of this.hospList) {
      if(i.hospitalCode==this.hospObj.hospitalCode) {
        stat=true;
      }
    }
    if(stat==false) {
      this.hospList.push(this.hospObj);
    }
  }

  onSelectAll(list) {
    console.log(list);
    for(var x=0;x<list.length;x++) {
      let item = list[x];
      this.hospObj={
        stateCode:"",
        stateName:"",
        districtCode:"",
        districtName:"",
        blockCode:"",
        blockName:"",
        hospitalCode:"",
        hospitalName:""
      }
      this.hospObj.stateCode = $('#stateId').val();
      this.hospObj.stateName = "Odisha";
      // for(var i=0;i<this.stateList.length;i++) {
      //   if(this.hospObj.stateCode==this.stateList[i].stateCode) {
      //     this.hospObj.stateName = this.stateList[i].stateName;
      //   }
      // }
      this.hospObj.districtCode = $('#districtId').val();
      for(var i=0;i<this.districtList.length;i++) {
        if(this.hospObj.districtCode==this.districtList[i].districtcode) {
          this.hospObj.districtName = this.districtList[i].districtname;
        }
      }
      this.hospObj.blockCode = $('#blockId').val();
    for(var i=0;i<this.blocklist.length;i++) {
      if(this.hospObj.blockCode==this.blocklist[i].blockcode) {
        this.hospObj.blockName = this.blocklist[i].blockname;
      }
    }
      this.hospObj.hospitalCode = item.hospitalid;
      for(var i=0;i<this.hospitalList.length;i++) {
        if(this.hospObj.hospitalCode==this.hospitalList[i].hospitalid) {
          this.hospObj.hospitalName = this.hospitalList[i].hospitalname;
        }
      }

      var stat:boolean = false;
      for (const i of this.hospList) {
        if(i.hospitalCode==this.hospObj.hospitalCode) {
          stat=true;
        }
      }
      if(stat==false) {
        this.hospList.push(this.hospObj);
      }
    }
  }

  onItemDeSelect(item) {
    for(var i=0;i<this.hospList.length;i++) {
      if(item.hospitalid==this.hospList[i].hospitalid) {
        var index = this.hospList.indexOf(this.hospList[i]);
        if (index !== -1) {
          this.hospList.splice(index, 1);
        }
      }
    }
  }

  onDeSelectAll(list) {
    //this.onDeSelectAll.emit(this.emittedValue(this.selectedItems));
    console.log(list);
    for(var x=0;x<list.length;x++) {
      let item = list[x];
      for(var i=0;i<this.hospList.length;i++) {
        if(item.hospitalid==this.hospList[i].hospitalid) {
          var index = this.hospList.indexOf(this.hospList[i]);
          if (index !== -1) {
            this.hospList.splice(index, 1);
          }
        }
      }
    }
  }

  remove(item) {
    for(var i=0;i<this.hospList.length;i++) {
      if(item.hospitalCode==this.hospList[i].hospitalCode) {
        var index = this.hospList.indexOf(this.hospList[i]);
        if (index !== -1) {
          this.hospList.splice(index, 1);
        }
      }
    }
  }

  get f() {
    return this.form.controls;
  }
  getCPDList() {

    this.userService.getreferaldoctorlist().subscribe(
      (response) => {
        this.cpdList = response;
        console.log(this.cpdList);
      },
      (error) => console.log(error)
    )
  }

  getStateList() {

    this.snoService.getStateList().subscribe(
      (response) => {
        this.stateList = response;
        console.log(this.stateList);
      },
      (error) => console.log(error)
    )
  }

  OnChangeState(id) {
    $("#districtId").val("");
    this.hospitalList = [];
    this.selectedItems = [];
    localStorage.setItem("stateCode", id);
    this.snoService.getDistrictListByStateId(id).subscribe(
      (response) => {
        this.districtList = response;
        console.log(response);


      },
      (error) => console.log(error)
    )
  }


  OnChangeDistrict(id) {
    this.selectedItems = [];
    var stateCode = localStorage.getItem("stateCode");
    this.sdistrictcode=id;
    this.userService.getrefHospitalbyDistrictId(id, stateCode).subscribe(
      (response) => {
        this.hospitalList = response;
        console.log(response);
      },
      (error) => console.log(error)
    )

    this.snoService.getBlockbyDistrictId(id, stateCode).subscribe(
      (response) => {
        console.log(response);
        this.blocklist = response;
      },
      (error) => console.log(error)
    )
  }

  OnChangeblock(id) {
    this.userService.getrefHospitalbyDistrictIdblockid(id, this.sdistrictcode).subscribe(
      (response) => {
        this.hospitalList = response;
        console.log(response);
      },
      (error) => console.log(error)
    )
  }

  selectEvent(item) {
    // do something with selected item
    this.cpdId = item.userid.userId;
    this.shodetails=true;
    this.mobileno=item.mobileno;
    this.emailid=item.emailid;
  }

  clearEvent() {
    this.cpdId = '';
    this.shodetails=false;
    this.mobileno='';
    this.emailid='';
  }

  setCPDConfiguration() {
    this.submitted = true;
    let cpdId = this.cpdId;

    if (cpdId == null || cpdId == "" || cpdId == undefined) {
      this.swal("Info", "Please select Referral Doctor Name", 'info');
      return;
    }
    if (this.hospList.length == 0) {
      this.swal("Info", "Please select At least One hospital ", 'info');
      return;
    }

    this.form.value.cpdId = cpdId;
    // this.form.value.hospitaltype = $("#hosptype").val();
    this.form.value.hospList = this.hospList;

    Swal.fire({
      title: 'Are You Sure?',
      text: "You Want To Save This Data!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,Submit It!'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log( this.form.value.hospList);
            this.userService.saverefdocConfiguration(this.form.value).subscribe((data:any) => {
              console.log(data);
              if (data.status==200) {
                this.swal("Success", data.message, "success");
                this.route.navigate(['/application/referaldoctormappingview']);
              } else if (data.status==400) {
                this.swal("Error", data.message, "error");
              }
            });
      }
    });
  }

  swal(title, text, icon) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  updategCPDDetails() {
    console.log(this.selectedItems);
    let cpdId = this.cpdId;

    if (cpdId == null || cpdId == "" || cpdId == undefined) {
      this.swal("Info", "Please select CPD Doctor Name", 'info');
      return;
    }

    this.form.value.cpdId = cpdId;
    this.form.value.hospList = this.hospList;
    Swal.fire({
      title: 'Are You Sure?',
      text: "You Want To Update This Data!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,Update It!'
    }).then((result) => {
      if (result.isConfirmed) {
            this.userService.updatereferraldocConfiguration(this.form.value).subscribe((data:any) => {
              if (data.status == 200) {
                this.swal("Success", data.message, "success");
                this.route.navigate(['/application/referaldoctormappingview']);
                this.submitted = false;
              } else if (data.status == 400) {
                this.swal("Error", data.message, "error");
              }
            });
        }
    });
  }

  onReset() {
    this.auto.clear();
    $("#stateId").val("");
    this.OnChangeState("");
    $("#districtId").val("");
    $("#blockId").val("");
    this.OnChangeDistrict("");
    this.hospList = [];
  }

  cancel() {
    this.route.navigate(['/application/referaldoctormappingview']);
  }

  taggedhospitallist:any;
  getCpdByIds(item) {
    this.isUpdateBtnInVisible = false;
      this.isEditBtn = true;
      this.form.controls['cpdName'].setValue(item.fullname);
      this.cpdId=item.id
      this.userService.getdoctortaglistbydoctorid(item.id).subscribe((data:any)=>{
        this.taggedhospitallist=data;
        for(let i=0;i<this.taggedhospitallist.length;i++) {
          this.hospObj={
            stateCode:"",
            stateName:"",
            districtCode:"",
            districtName:"",
            blockCode:"",
            blockName:"",
            hospitalCode:"",
            hospitalName:""
          }
          this.hospObj.stateName=this.taggedhospitallist[i].statecode;
          this.hospObj.districtName=this.taggedhospitallist[i].distcode;
          this.hospObj.hospitalCode=this.taggedhospitallist[i].hospitalid;
          this.hospObj.hospitalName=this.taggedhospitallist[i].hospitalname;

          this.hospList.push(this.hospObj);
        }

    });


  }
}
