import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { AdminconsoleService } from '../../Services/adminconsole.service';
import { HospitalmasterService } from '../../Services/hospitalmaster.service';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-snaexecutivemapping',
  templateUrl: './snaexecutivemapping.component.html',
  styleUrls: ['./snaexecutivemapping.component.scss']
})
export class SnaexecutivemappingComponent implements OnInit {
  pageName: string = "SNA Executive Mapping";
  placeHolder = "Select SNA Executive";
  public snoList: any = [];
  public stateList: any = [];
  public districtList: any = [];
  public hospitalList: any = [];
  @ViewChild('multiSelect') multiSelect;
  @ViewChild('auto') auto;
  public submitted = false;
  isUpdateBtnInVisible: boolean;
  user: any;
  form!: FormGroup;
  public settingDistrict = {};
  //public settingHospital = {};
  public settingHospital: any;
  sNOId: any;
  isEditBtn: boolean;
  updatelist: any;
  sid: any;
  did: any;
  datas: any
  hospitalArray: any;
  hosp: any;
  selectedItems: any = [];
  status: any;
  snoUserId: any;
  keyword: any = 'fullName';
  hospObj: any;
  hospList: any = [];
  snoName: any;

  constructor(public fb: FormBuilder, private snoService: SnocreateserviceService,
    public headerService: HeaderService, private route: Router,private sessionService: SessionStorageService) {
    //this._design.pageTitle(this.pageName);
    this.sNOId = this.route.getCurrentNavigation().extras.state;

  }

  ngOnInit(): void {

    this.getSNOList();
    this.user = this.sessionService.decryptSessionData("user");
    this.form = this.fb.group({

      snoId: new FormControl(''),
      snoName: new FormControl(''),
      hospitalCode: new FormControl(null, []),
      hospList: new FormControl('', []),
      createdBy: new FormControl(this.user.userId),
      updatedBy: new FormControl(this.user.userId)

    })

    this.headerService.setTitle('SNA Executive Mapping');
    this.isUpdateBtnInVisible = true;
    this.isEditBtn = false;
    if (this.sNOId) {

      this.getSnoByIds(this.sNOId.sNOId);
      // alert("abcd" + JSON.stringify(this.sNOId));

    }




    this.settingHospital = {
      singleSelection: false,
      idField: 'userId',
      textField: 'fullName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 0,
      allowSearchFilter: true,
    };
  }

  onItemSelect(item) {
    this.hospObj={
      userId:"",
      fullName:"",
      snadoctorName:""
    }
    this.hospObj.userId = item.userId;
    for(var i=0;i<this.hospitalList.length;i++) {
      if(this.hospObj.userId==this.hospitalList[i].userId) {
        this.hospObj.fullName = this.hospitalList[i].fullName;
        this.hospObj.snadoctorName = this.snoName;
      }
    }
    var stat:boolean = false;
    for (const i of this.hospList) {
      if(i.userId==this.hospObj.userId) {
        stat=true;
      }
    }
    if(stat==false) {
      this.hospList.push(this.hospObj);
    }
  }

  onSelectAll(list) {
    for(var x=0;x<list.length;x++) {
      let item = list[x];
      this.hospObj={
        userId:"",
        fullName:"",
        snadoctorName:""
      }
      this.hospObj.userId = item.userId;
    for(var i=0;i<this.hospitalList.length;i++) {
      if(this.hospObj.userId==this.hospitalList[i].userId) {
        this.hospObj.fullName = this.hospitalList[i].fullName;
        this.hospObj.snadoctorName = this.snoName;
      }
    }
    var stat:boolean = false;
    for (const i of this.hospList) {
      if(i.userId==this.hospObj.userId) {
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
      if(item.userId==this.hospList[i].userId) {
        var index = this.hospList.indexOf(this.hospList[i]);
        if (index !== -1) {
          this.hospList.splice(index, 1);
        }
      }
    }
  }

  onDeSelectAll(list) {

    for(var x=0;x<list.length;x++) {
      let item = list[x];
      for(var i=0;i<this.hospList.length;i++) {
        if(item.userId==this.hospList[i].userId) {
          var index = this.hospList.indexOf(this.hospList[i]);
          if (index !== -1) {
            this.hospList.splice(index, 1);
          }
        }
      }
    }
    this.hospList = [];
  }

  remove(item) {
    for(var i=0;i<this.hospList.length;i++) {
      if(item.userId==this.hospList[i].userId) {
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
  getSNOList() {

    this.snoService.getSNODetails().subscribe(
      (response) => {
        this.snoList = response;
      },
      (error) => console.log(error)
    )
  }

  getAuthList() {
    this.snoService.getSNAEXDetails().subscribe(
      (response) => {
        this.hospitalList = response;
      },
      (error) => console.log(error)
    )
  }

  selectEvent(item) {
    // do something with selected item
    this.snoUserId = item.userId;
    this.snoName = item.fullName;
    this.hospList = [];
    this.getAuthList();
  }

  clearEvent() {
    this.snoUserId = '';
    this.snoName = '';
    this.hospList = [];
    this.selectedItems = [];
    this.hospitalList = [];
  }

  setSNOConfiguration() {
    this.submitted = true;
    let snoId = this.snoUserId;
    let userId=this.user.userId;
    if (snoId == null || snoId == "" || snoId == undefined) {
      this.swal("Info", "Please select SNA Doctor Name", 'info');
      return;
    }
    if (this.hospList.length == 0) {
      this.swal("Info", "Please select SNA Executive ", 'info');
      return;
    }
    let formData={
      userId:userId,
      snoId:snoId,
      hospList:this.hospList,
    }
    this.form.value.snoId = snoId;
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
        this.snoService.saveSNAExecutiveConfiguration(formData).subscribe(data => {
          if (data.status == "Success") {
            this.swal("Success", data.message, "success");
            this.clearEvent();
            this.route.navigate(['/application/snaExecutiveMapping']);
          } else if (data.status == "Failed") {
            this.swal("Error", data.message, "error");
          }
          else if (data.status == "Info") {
            this.swal("info", data.message, "info");
          }
        })
      }
    })

  }

  swal(title, text, icon) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  updategSNODetails() {
  //  alert(this.hospList);
    let snoId = this.snoUserId;
    let userId=this.user.userId;
    if(this.hospList.length==0) {
      this.swal("Info", "Please select SNA Executive ", 'info');
      return;
    }
    let formData={
      userId:userId,
      snoId:snoId,
      hospList:this.hospList,
    }
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
        this.snoService.updateSNAExecConfiguration(formData).subscribe(data => {
          if (data.status == "Success") {
            this.swal("Success", data.message, "success");
            this.form.reset();
            this.route.navigate(['/application/ViewsnaExecutiveMapping']);
            this.submitted = false;
          } else if (data.status == "Failed") {
            this.swal("Error", data.message, "error");
          }
        })
      }
    })

  }

  onReset() {
    this.auto.clear();
  }

  cancel() {
    this.route.navigate(['/application/ViewsnaExecutiveMapping']);
  }

  getSnoByIds(id) {
    this.snoService.getSnaExecById(id).subscribe(data => {
      this.updatelist = data;
      this.getAuthList();
      this.isUpdateBtnInVisible = false;
      this.isEditBtn = true;
      this.snoUserId=this.updatelist.snoId;
      this.form.controls['snoName'].setValue(this.updatelist.hospList[0].snadoctorName);
      this.snoName=this.updatelist.hospList[0].snadoctorName;
      this.hospList = this.updatelist.hospList;
    });
  }

}
