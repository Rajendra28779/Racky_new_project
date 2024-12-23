import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { AdminconsoleService } from '../../Services/adminconsole.service';
import { HospitalmasterService } from '../../Services/hospitalmaster.service';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-hospital-master-user',
  templateUrl: './hospital-master-user.component.html',
  styleUrls: ['./hospital-master-user.component.scss']
})
export class HospitalMasterUserComponent implements OnInit {

  user: any;
  cPDID: any;
  placeHolder = "Select Hospital";
  updatelist: any;
  public cpdList: any = [];
  userList: any = [];
  isUpdateBtnInVisible: boolean;
  isEditBtn: boolean;
  submitted: boolean = false;
  sid: any;
  did: any;
  hospitalArray: any;
  selectedItems: any = [];
  status: any;
  keyword = 'fullName';
  keyword1 = 'hospitalName';
  @ViewChild('auto') auto;
  @ViewChild('auto1') auto1;
  userId: any;
  fullname: any;
  groupType: any;
  hospitalName: any;
  sno: {
    createdUser: any; authId: string; hosCode: string; type: string; hosName: string; authName: string;
  };

  cpdName: any;
  hospList: any;
  updateStatus: any;
  updateStatusList: any;
  
  constructor(public fb: FormBuilder, private snoService: SnocreateserviceService, private sessionService: SessionStorageService,
    public headerService: HeaderService, public route: Router, public hospitalService: HospitalmasterService) {
    this.cPDID = this.route.getCurrentNavigation().extras.state;
  }
  form: FormGroup;
  // public settingHospital = {};
  
  ngOnInit(): void {
    this.headerService.setTitle('Hospital Group Mapping');
    this.isUpdateBtnInVisible = true;
    this.isEditBtn = false;

    this.getAuthList();
    // this.getUserList();
    this.addList = [];
    this.user = this.sessionService.decryptSessionData("user");
    if (this.cPDID) {
      this.getByIds(this.cPDID.PID);
    }
  }

  getAuthList() {

    this.hospitalService.getHospitalAuthList().subscribe(
      (response) => {
        this.cpdList = response;
        this.groupType = this.cpdList[0].groupId.typeId;
      },
      (error) => console.log(error)
    )
  }
  
  selectEvent(item) {
    this.auto.open();
    if (this.userList.length == 0)
      this.getUserList();
    this.userId = item.userId.userId;
    this.fullname = item.fullName;
  }

  onChangeSearch(event) {
    // this.auto.open();
    // this.getUserList();
  }

  selectEvent1(item) {
    // alert(item)
    this.hospitalCode = item.hospitalCode;
    this.hospitalName = item.hospitalName;
  }

  getUserList() {
    this.hospitalService.getHospitalUserList().subscribe(
      (response) => {
        this.userList = response;
        this.hospitalCode = "";
      },
      (error) => console.log(error)
    )
  }

  addList: any = [];
  authId: any = "";
  hospitalCode: any = "";

  AddMore() {
    // let authId=$('#cpdId').val();
    // let hospitalCode=$('#hospitalCode').val();
    // alert(this.userId)
    if (this.userId == "") {
      this.swal("Error", "Please select Hospital Authority Name", 'error');
      return;
    }
    if (this.hospitalCode == "") {
      this.swal("Error", "Please select Hospital", 'error');
      return;
    }
    for (let i = 0; i < this.addList.length; i++) {
      if (this.addList[i].hosCode == this.hospitalCode) {
        this.swal("Error", "Hospital Already Selected", 'error');
        return;
      }
    }
    // this.sno=[];
    this.sno = {
      authId: "",
      hosCode: "",
      type: "",
      hosName: "",
      authName: "",
      createdUser: "",
    };
    this.sno.authId = this.userId;
    this.sno.hosCode = this.hospitalCode;
    this.sno.type = this.groupType;
    this.sno.authName = this.fullname;
    this.sno.hosName = this.hospitalName;
    this.sno.createdUser = this.user.userId;
    this.hospitalService.checkDuplicateAssignToHosp(this.sno).subscribe((data: any) => {
      if (data.status == "Info") {
        this.swal("Info", data.message, "info");
        return;
      } else if (data.status == "Error") {
        this.swal("Error", data.message, "error");
        return;
      } else {
        this.addList.push(this.sno);
      }
    });
  }

  getByIds(userId) {
    this.hospitalService.getbyid(userId).subscribe((data: any) => {
      this.updatelist = data;
      this.isUpdateBtnInVisible = false;
      this.isEditBtn = true;
      this.userId = this.updatelist[0].authId;
      this.fullname = this.updatelist[0].fullname;
      for (let i = 0; i < this.updatelist.length; i++) {
        this.sno = {
          authId: "",
          hosCode: "",
          type: "",
          hosName: "",
          authName: "",
          createdUser: "",
        };
        this.sno.authId = this.updatelist[i].authId;
        this.sno.hosCode = this.updatelist[i].hospitalCode;
        this.sno.type = this.updatelist[i].type;
        this.sno.authName = this.updatelist[i].fullname;
        this.sno.hosName = this.updatelist[i].hospitalName;
        this.sno.createdUser = this.user.userId;
        this.addList.push(this.sno);
      }     
      this.getUserList();

    });
  }

  swal(title, text, icon) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  onReset() {
    this.userId = "";
    this.fullname = "";
    this.auto.clear();
    // this.auto.close();
    this.addList = [];
  }

  onReset1() {
    this.hospitalCode = "";
    this.hospitalName = "";
  }


  SubmitDetails() {

    Swal.fire({
      title: 'Are You Sure To Save?',
      text: "",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,Submit It!'
    }).then((result) => {
      if (result.isConfirmed) {
        let obj = {
          group: this.addList
        }
        this.hospitalService.saveHospitalConfiguration(obj).subscribe((data: any) => {
          if (data.status == "Success") {
            this.swal("Success", data.message, "success");
            this.route.navigate(['/application/hospitalgroupMappingDetails']);
          } else if (data.status == "Failed") {
            this.swal("Error", data.message, "error");
          }
        })
      }
    })
  }

  updateDetails() {
    Swal.fire({
      title: 'Are You Sure To Update?',
      text: "",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,Update It!'
    }).then((result) => {
      if (result.isConfirmed) {        
        let obj = {
          group: this.addList
        }
        this.hospitalService.updateHospitalConfiguration(obj).subscribe((data: any) => {
          if (data.status == "Success") {
            this.swal("Success", data.message, "success");
            this.route.navigate(['/application/hospitalgroupMappingDetails']);
          } else if (data.status == "Failed") {
            this.swal("Error", data.message, "error");
          }
        })
      }
    })
  }

  remove(claim) {
    for(var i=0;i<this.addList.length;i++) {
      if(claim.hosCode==this.addList[i].hosCode) {
        var index = this.addList.indexOf(this.addList[i]);
        if (index !== -1) {
          this.addList.splice(index, 1);
        }
      }
    }
  }

  cancel() {
    this.route.navigate(['/application/hospitalgroupMappingDetails']);
  }
}
