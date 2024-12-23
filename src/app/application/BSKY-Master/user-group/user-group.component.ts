import { ANALYZE_FOR_ENTRY_COMPONENTS, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { GroupService } from '../../Services/group.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { JsonPipe } from '@angular/common';
import { data } from 'jquery';
import { HeaderService } from '../../header.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-user-group',
  templateUrl: './user-group.component.html',
  styleUrls: ['./user-group.component.scss']
})
export class UserGroupComponent implements OnInit {

  form: FormGroup;
  updategroup: any;
  userId: any;
  check: any;
  gid: any;
  isUpdateBtnInVisible: boolean = true;
  isSave: boolean = false;
  submitted: boolean = false;
  user1: any;
  isActive: any;
  childmessage: any;
  minlengthforName = /^[a-zA-Z ]{3,}$/;
  constructor(private groupservice: GroupService, public headerService: HeaderService,
    public fb: FormBuilder, private active: ActivatedRoute, private route: Router,
    private sessionService: SessionStorageService) {
    this.gid = this.route.getCurrentNavigation().extras.state;
  }

  addGroup = new FormGroup({
    groupName: new FormControl(''),
    createdBy: new FormControl(''),
    lastupdateBy: new FormControl(''),
  });

  updategroupname = {
    groupName: "",
    isActive:""
  }

  groupDatat: any = [];
  ngOnInit(): void {
    this.user1 = this.sessionService.decryptSessionData("user");
    this.headerService.setTitle("Create Group");
    this.headerService.isIndicate(false);
    this.headerService.isBack(true)
    this.addGroup = this.fb.group({
      groupName: ['', Validators.required],
    });
    if (this.gid) {
      this.isUpdateBtnInVisible = false;
      this.isSave = true;
      this.groupservice.updateGroupById(this.gid.groupId).subscribe(
        (result: any) => {
          this.updategroup = result;
          this.updategroupname.groupName = this.updategroup.groupName;
          this.updategroupname.isActive=this.updategroup.isActive;
          this.isUpdateBtnInVisible = false;
          this.isSave = true;
        });
    }
  }
  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }
  resetData() {
    this.submitted = false;
  }
  saveData() {
    this.groupservice.checkDuplicateData(this.updategroupname.groupName).subscribe(data => {
      if (data.status == "Present") {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'GroupName is already exist!'
        })
        return;
      } else {
        this.submitted = true;
        if (this.addGroup.invalid) {
          Swal.fire("", "This field can't be blank !!", 'warning');
          return;
        }
       
        this.addGroup.value.createdBy = this.user1.userId;
        this.addGroup.value.groupName=$("#groupName").val();

        let groupName = $("#groupName").val().toString();
        if (!groupName.match(this.minlengthforName)) {
          this.swal("Info", "Group Name must be more than 2 character", 'info');
          return;
        }
        Swal.fire({
          title: 'Are you sure?',
          text: "You want to Save this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, Save it!'
        }).then((result) => {
          if (result.isConfirmed) {
            this.groupservice.saveGroup(this.addGroup.value).subscribe((response: any) => {
              if (response == 1) {
                this.swal("Success", "GroupName Saved Successfully", 'success'); 
              }
              else {
                this.swal("Error", "Some Error Happen!!", 'error');
              }
            },
              (error: any) => {
                this.swal("some error occur", "Try later", 'error');
              }
            )
          }
        })
        this.submitted = false;
      }
    })
  }
  get f() {
    return this.addGroup.controls;
  }
  update(itemds: any) {
        this.submitted = true;
        if (this.addGroup.invalid) {
          Swal.fire("", "This field can't be blank !!", 'warning');
          this.submitted = false;
          return;
        }
        this.user1 = this.sessionService.decryptSessionData("user");
        this.updategroup.lastupdateBy = this.user1.userId;
        this.updategroup.groupName = this.updategroupname.groupName;
       
       // this.addGroup.value.groupName=$("#groupName").val();
        this.updategroup.groupName = $("#groupName").val();

        let groupName = $("#groupName").val().toString();
        if (!groupName.match(this.minlengthforName)) {
          this.swal("Info", "Group Name must be more than 2 character", 'info');
          return;
        }
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
            this.updategroup.isActive=this.isActive;
            this.groupservice.updateGroup(this.updategroup).subscribe((response: any) => {
              if (response == 2) {
                this.swal("Oops...", "GroupName is already exist!", 'error');
              }else if(response == 1){
                this.swal("Success", "Updated Successfully !!", 'success');
                this.submitted = false;
                this.addGroup.reset();
                this.route.navigate(['/application/viewgroup']);
              }
              else {
                this.swal("Error", "Some Error Happen!!", 'error');
              }
            },
              (error: any) => {
                this.swal("some error occur", "Try later", 'error');
              }
            )
          }
        })
  }
  
  cancel1() {
    this.route.navigate(['/application/viewgroup']);
  }

  yes($event: any) {
    this.isActive = 0;
  }
  
  no($event: any) {
    this.isActive = 1;
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  keyfunction1(e){

    if (e.value[0] == " ") {
      $('#groupName').val('');
    }

}


}
