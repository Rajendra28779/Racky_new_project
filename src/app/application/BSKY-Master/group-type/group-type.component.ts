import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { GroupTypeService } from '../../Services/group-type.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-group-type',
  templateUrl: './group-type.component.html',
  styleUrls: ['./group-type.component.scss']
})
export class GroupTypeComponent implements OnInit {
  form!: FormGroup;
  item: any;
  getbyid: any;
  valid: any = 0;
  isvisiblesave: boolean;
  visibleupdate: boolean;
  submitted: boolean = false;
  Grouptype: FormGroup;
  childmessage: any;
  user1: any;
  status: any;
  minlengthforName = /^[a-zA-Z0-9 ]{3,}$/;
  grouptype = {
    typeId: "",
    grouptypename: "",
    status: ""
  };

  constructor(private groupTypeService: GroupTypeService, private route: Router, public fb: FormBuilder, public headerService: HeaderService, private sessionService: SessionStorageService) {
    this.item = this.route.getCurrentNavigation().extras.state;
  }

  ngOnInit(): void {
    this.headerService.setTitle("Create Group Type");
    this.headerService.isIndicate(false);
    this.headerService.isBack(true);
    this.user1 = this.sessionService.decryptSessionData("user");
    this.Grouptype = this.fb.group({
      typeId: new FormControl(''),
      groupTypeName: new FormControl(''),
      createdBy: new FormControl(''),
      updatedBy: new FormControl(''),
    });
    this.isvisiblesave = true;
    this.visibleupdate = false;
    if (this.item) {
      this.groupTypeService.getbyid(this.item.item).subscribe(
        (result: any) => {
          this.getbyid = result;
          this.grouptype.typeId = this.getbyid.typeId;
          this.grouptype.grouptypename = this.getbyid.groupTypeName;
          this.grouptype.status = this.getbyid.status;
          this.status = this.getbyid.status;
          this.isvisiblesave = false;
          this.visibleupdate = true;
        },
        (err: any) => {
          console.log(err);
        }
      );
    }
  }
  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }

  resetData() {
    this.submitted = false;
    window.location.reload();
  }

  validateGroupName() {
    let groupTypeName = $("#groupTypeName").val().toString();
    if (!groupTypeName.match(this.minlengthforName)) {
      $("#groupTypeName").focus();
      this.swal("Info", "Group Type Name must be more than 3 character", 'info');
      return;
    }
  }

  checkTypeId() {
    let typeId = $('#typeId').val().toString();
    this.groupTypeService.checkDuplicategrpData(typeId).subscribe(data => {
      if (data.status == "Present") {
        this.valid = 2;
        $("#typeId").focus();
        Swal.fire({
          icon: 'info',
          title: 'Info',
          text: 'Type ID already exists!'
        })
        return;
      } else {
        this.valid = 1;
      }
    })
  }

  save() {
    this.submitted = true;
    let typeId = $("#typeId").val().toString();
    let groupTypeName = $("#groupTypeName").val().toString();
    if (typeId == null || typeId == "" || typeId == undefined) {
      $("#typeId").focus();
      this.swal("Info", "Please Enter Type ID", 'info');
      return;
    }
    if (groupTypeName == null || groupTypeName == "" || groupTypeName == undefined) {
      $("#groupTypeName").focus();
      this.swal("Info", "Please Enter Group Type", 'info');
      return;
    }
    if (!groupTypeName.match(this.minlengthforName)) {
      $("#groupTypeName").focus();
      this.swal("Info", "Group Type Name must be more than 3 character", 'info');
      return;
    }
    this.checkTypeId();
    this.validateGroupName();
    this.Grouptype.value.createdBy = this.user1.userId;
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to save!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Save it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.groupTypeService.saveGroupType(this.Grouptype.value).subscribe(
          (result: any) => {
            if (result == 1) {
              Swal.fire("Success", "Group Type Saved Successfully!!", "success")
              this.route.navigate(['application/groupList']);
              this.Grouptype.reset();
              this.valid = 0;
              this.submitted = false;
            }else if (result == 2){
              Swal.fire("Error", "Group Type Already Exist !!", "error")
            } else {
              Swal.fire("Error", "Some Error Happened!!", "error")
            }
          },
          (err: any) => {
            console.log(err);
          }
        )
      }
    });
  }

  get f() {
    return this.Grouptype.controls;
  }

  update(items: any) {
    this.submitted = true;
    let typeId = $("#typeId").val().toString();
    let groupTypeName = $("#groupTypeName").val().toString();
    if (typeId == null || typeId == "" || typeId == undefined) {
      $("#typeId").focus();
      this.swal("Info", "Please Enter Type ID", 'info');
      return;
    }
    if (groupTypeName == null || groupTypeName == "" || groupTypeName == undefined) {
      $("#groupTypeName").focus();
      this.swal("Info", "Please Enter Group Type", 'info');
      return;
    }
    if (!groupTypeName.match(this.minlengthforName)) {
      $("#groupTypeName").focus();
      this.swal("Info", "Group Type Name must be more than 3 character", 'info');
      return;
    }
    this.validateGroupName();
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to Update this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Update it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.getbyid.groupTypeName = groupTypeName;
        this.getbyid.status = this.status;
        this.getbyid.updatedBy = this.user1.userId;
        this.groupTypeService.updateGroupType(this.getbyid).subscribe((response: any) => {
          if (response == 1) {
            this.swal("Success", "Group Type Updated Successfully!!", 'success');
            this.submitted = false;
            this.route.navigate(['application/groupList']);
          }else if (response == 2){
            Swal.fire("Error", "Group Type Already Exist !!", "error")
          }else {
            this.swal("Error", "Some Error Happened!!", 'error');
          }
        },
          (error: any) => {
            this.swal("Error", "Some Error Happened!!", 'error');
          }
        )
      }
    });
  }

  yes($event: any) {
    this.status = 0;
  }

  no($event: any) {
    this.status = 1;
  }

  cencel1() {
    this.route.navigate(['application/groupList'])
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  keyfunction1(e) {
    if (e.value[0] == " ") {
      $('#groupTypeName').val('');
    }
  }
}
