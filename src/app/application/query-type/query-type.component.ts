import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from '../header.service';
import { GroupService } from '../Services/group.service';
import Swal from 'sweetalert2';
import { QueryTypeServiceService } from '../Services/query-type-service.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
@Component({
  selector: 'app-query-type',
  templateUrl: './query-type.component.html',
  styleUrls: ['./query-type.component.scss']
})
export class QueryTypeComponent implements OnInit {
  form: FormGroup;
  maxChars = 200;
  updategroup: any;
  userId: any;
  check: any;
  item: any;
  isSaveData: boolean = true;
  isUpdateData: boolean = false;
  submitted: boolean = false;
  user1: any;
  isActive: any;
  childmessage: any;
  data: any;
  minlengthforName = /^[a-zA-Z ]{3,}$/;
  statusflag: any;
  constructor(private groupservice: GroupService, private queryTypeservice: QueryTypeServiceService, public headerService: HeaderService, public fb: FormBuilder, private active: ActivatedRoute, private route: Router,private sessionService: SessionStorageService) {
    this.item = this.route.getCurrentNavigation().extras.state;
  }

  addQueryType = new FormGroup({
    typeName: new FormControl(''),
    remark: new FormControl(''),
    createdBy: new FormControl(''),
    updatedBy: new FormControl(''),
  });

  updateQuerytype = {
    typeName: "",
    remark: "",
    statusflag: "",
    typeId: "",
    updatedBy: ""
  }

  groupDatat: any = [];
  ngOnInit(): void {
    this.headerService.setTitle("Create Query Type");
    this.headerService.isIndicate(false);
    this.headerService.isBack(true);
    if (this.item) {
      this.isSaveData = false;
      this.isUpdateData = true;
      this.queryTypeservice.getbyid(this.item.typeId).subscribe(
        (result: any) => {
          this.updategroup = result;
          this.updateQuerytype.typeName = this.updategroup.typeName;
          this.updateQuerytype.statusflag = this.updategroup.statusflag;
          this.updateQuerytype.remark = this.updategroup.remarks;
          this.statusflag = this.updategroup.statusflag;
          this.isSaveData = false;
          this.isUpdateData = true;
        });
    }
  }

  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }

  resetData() {
  }

  saveData() {
    // this.user1 = JSON.parse(sessionStorage.getItem("user"))
    this.user1 = this.sessionService.decryptSessionData("user");
    this.addQueryType.value.createdBy = this.user1.userId;
    this.addQueryType.value.typeName = $("#typeName").val();
    this.addQueryType.value.remark = $("#remark").val();
    var typeName = $('#typeName').val().toString();
    if (typeName == null || typeName == "" || typeName == undefined) {
      $("#typeName").focus();
      this.swal("Info", "Please Enter QueryType", 'info');
      return;
    }
    var remark = $('#remark').val().toString();
    if (remark == null || remark == "" || remark == undefined) {
      $("#typeName").focus();
      this.swal("Info", "Please Enter Remark", 'info');
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
        this.queryTypeservice.saveQueryType(this.addQueryType.value).subscribe((response: any) => {
          this.data = response;
          if (this.data.status == "Success") {
            this.swal('Success', this.data.message, 'success')
          } else if (this.data.status == "Failed") {
            this.swal('Success', this.data.message, 'error')
          }
          else {
            this.swal("Error", "Something went wrong", 'error');
          }
        })
      }
    })
  }
  yes($event: any) {
    this.statusflag = 0;
  }

  no($event: any) {
    this.statusflag = 1;
  }

  update(itemds: any) {
    // this.user1 = JSON.parse(sessionStorage.getItem("user"))
    this.user1 = this.sessionService.decryptSessionData("user");
    this.addQueryType.value.createdBy = this.user1.userId;
    this.addQueryType.value.typeName = $("#typeName").val();
    this.addQueryType.value.remark = $("#remark").val();
    var typeName = $('#typeName').val().toString();
    if (typeName == null || typeName == "" || typeName == undefined) {
      $("#typeName").focus();
      this.swal("Info", "Please Enter QueryType", 'info');
      return;
    }
    var remark = $('#remark').val().toString();
    if (remark == null || remark == "" || remark == undefined) {
      $("#typeName").focus();
      this.swal("Info", "Please Enter Remark", 'info');
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
      this.updateQuerytype.statusflag = this.statusflag;
      this.updateQuerytype.typeId = this.updategroup.typeId;
      this.updateQuerytype.updatedBy = this.user1.userId;
      this.queryTypeservice.updateQuery(this.updateQuerytype).subscribe((resp: any) => {
        this.data = resp;
        if (this.data.status == "Success") {
          this.swal('Success', this.data.message, 'success')
          this.route.navigate(['application/querytypeview']);

        } else if (this.data.status == "Failed") {
          this.swal('Success', this.data.message, 'error')
        }
        else {
          this.swal("Error", "Something went wrong", 'error');
        }

      },
        (error: any) => {
          this.swal("some error occur", "Try later", 'error');
        })
    })
  }

  cancel1() {
    this.route.navigate(['/application/viewgroup']);
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
      $('#typeName').val('');
    }
  }

  keyfunction2(e) {
    if (e.value[0] == " ") {
      $('#remark').val('');
    }
  }

  keyPress(event: KeyboardEvent) {
    const pattern = /^[A-Za-z0-9.,-_ \\s]+$/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}
