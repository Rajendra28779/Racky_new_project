import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { HeaderService } from '../../header.service';
import { FormControl, FormGroup } from '@angular/forms';
import { FunctionmasterserviceService } from '../../Services/functionmasterservice.service';
import { AdminconsoleService } from '../../Services/adminconsole.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-function-master-unlinked',
  templateUrl: './function-master-unlinked.component.html',
  styleUrls: ['./function-master-unlinked.component.scss']
})
export class FunctionMasterUnlinkedComponent implements OnInit {

  functionMasterForm: FormGroup;
  userDetails: any = [];
  showupdate: boolean;
  childmessage: any;
  maxChars = 100;
  editUser: any;
  update: any;
  status: any;
  dataa: any;
  user: any;

  getbyid = {
    fileName: "",
    description: "",
    functionName: "",
    isactive: "",
    userId: ""
  };

  constructor(
    private route: Router,
    public headerService: HeaderService,
    public fnmservice: FunctionmasterserviceService,
    private sessionService: SessionStorageService) {
    this.editUser = this.route.getCurrentNavigation().extras.state;
  }

  ngOnInit() {
    this.headerService.setTitle('Unlinked Function-Master');
    // this.user = JSON.parse(sessionStorage.getItem("user"));
    this.user = this.sessionService.decryptSessionData("user");
    this.functionMasterForm = new FormGroup({
      functionname: new FormControl(''),
      functionurl: new FormControl(''),
      userId: new FormControl(''),
      functiondescription: new FormControl('')
    });
    this.showupdate = false;
    this.getAllUserDetails();
    if (this.editUser) {
      this.fnmservice.getUnlinkedFunctionById(this.editUser.user).subscribe(data => {
        this.update = data;
        this.getbyid.fileName = this.update.fileName;
        this.getbyid.functionName = this.update.functionName;
        this.getbyid.description = this.update.description;
        this.getbyid.isactive = this.update.bitStatus;
        this.getbyid.userId = this.update.userId.userId;
        this.status = this.update.bitStatus;
        this.showupdate = true;
      });
    }
  }

  getAllUserDetails() {
    this.fnmservice.getAllUserDetails().subscribe(
      (response) => {
        this.userDetails = response;
      },
      (error) => console.log(error)
    )
  }

  yes($event: any) { this.status = 0; }

  no($event: any) { this.status = 1; }

  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }

  reset() {
    this.route.navigate(['/application/viewunlinkedfunctionmaster']);
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  save() {
    var fnname = this.functionMasterForm.controls['functionname'].value;  //$('#functionname').val().toString();
    var fnurl = this.functionMasterForm.controls['functionurl'].value;//$('#functionurl').val().toString().trim();
    var userId = this.functionMasterForm.controls['userId'].value;//$('#userId').val().toString();
    var description = this.functionMasterForm.controls['functiondescription'].value;//$('#functiondescription').val().toString();

    if (fnname == null || fnname == "" || fnname == undefined) {
      this.swal("Info", "Please Fill Function Name", 'info');
      return;
    }
    if (fnurl == null || fnurl == "" || fnurl == undefined) {
      this.swal("Info", "Please Fill Function URL", 'info');
      return;
    }
    if (userId == null || userId == "" || userId == undefined) {
      this.swal("Info", "Please Select User", 'info');
      return;
    }
    if (description == null || description == "" || description == undefined) {
      this.swal("Info", "Please Fill Description", 'info');
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Save it!'
    }).then((result) => {
      if (result.isConfirmed) {
        let userIdObj = {
          userId: userId
        }
        let object = {
          functionName: fnname,
          fileName: fnurl,
          userId: userIdObj,
          createdBy: this.user.userId,
          description: description
        }
        this.fnmservice.saveUnlinkedFunctionMaster(object).subscribe(data => {
          this.dataa = data;
          if (this.dataa.status == "Success") {
            this.swal("Success", this.dataa.message, "success");
            this.functionMasterForm.reset();
            this.functionMasterForm.controls['userId'].setValue("");
          } else if (this.dataa.status == "Failed") {
            this.swal("Error", this.dataa.message, "error");
          }
        });
      }
    })
  }

  updatefn() {
    var fnname = this.functionMasterForm.controls['functionname'].value;  //$('#functionname').val().toString();
    var fnurl = this.functionMasterForm.controls['functionurl'].value;//$('#functionurl').val().toString().trim();
    var userId = this.functionMasterForm.controls['userId'].value;//$('#userId').val().toString();
    var description = this.functionMasterForm.controls['functiondescription'].value;//$('#functiondescription').val().toString();

    if (fnname == null || fnname == "" || fnname == undefined) {
      this.swal("Info", "Please Fill Function Name", 'info');
      return;
    }
    if (fnurl == null || fnurl == "" || fnurl == undefined) {
      this.swal("Info", "Please Fill Function URL", 'info');
      return;
    }
    if (userId == null || userId == "" || userId == undefined) {
      this.swal("Info", "Please Select User", 'info');
      return;
    }
    if (description == null || description == "" || description == undefined) {
      this.swal("Info", "Please Fill Description", 'info');
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Save it!'
    }).then((result) => {
      if (result.isConfirmed) {

        this.update.fileName = fnurl;
        this.update.functionName = fnname;
        this.update.description = description;
        this.update.updatedBy = this.user.userId;
        this.update.bitStatus = this.status;
        this.update.userId.userId = userId;

        this.fnmservice.updateUnlinkedFunctionMaster(this.update).subscribe(data => {
          this.dataa = data;
          if (this.dataa.status == "Success") {
            this.swal("Success", this.dataa.message, "success");
            this.functionMasterForm.reset();
            this.route.navigate(['/application/viewunlinkedfunctionmaster']);
          } else if (this.dataa.status == "Failed") {
            this.swal("Error", this.dataa.message, "error");
          }
        });
      }
    })
  }

  keyPress(event: KeyboardEvent) {
    const pattern = /^[A-Za-z0-9.,-_ \\s]+$/;
    //var regex = new RegExp("^[A-Za-z0-9.,-\\s]+$");
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

}
