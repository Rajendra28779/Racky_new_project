import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { data } from 'jquery';
import Swal from 'sweetalert2';
import { HeaderService } from '../header.service';
import { PackageMasterserviceService } from '../Services/package-masterservice.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-package-master',
  templateUrl: './package-master.component.html',
  styleUrls: ['./package-master.component.scss']
})
export class PackageMasterComponent implements OnInit {
  user: any;
  isSaveData: boolean = true;
  submitted: boolean = false;
  childmessage: any;
  item: any;
  getbyid: any;

  packageUpdate = {
    id: "",
    procedureCode: "",
    procedures: "",
    statusFlag: ""
  };
  data:any;
  status: any;
  statusFlag: any;

  constructor(private sessionService: SessionStorageService,private packageMasterserviceService: PackageMasterserviceService, private route: Router, public formBuilder: FormBuilder, public headerService: HeaderService) {
    this.item = this.route.getCurrentNavigation().extras.state;
  }

  packageMaster = new FormGroup({
    procedureCode: new FormControl(''),
    procedures: new FormControl(''),
    statusFlag: new FormControl(''),
  });

  ngOnInit(): void {
    this.headerService.setTitle("Create Package Master");
    this.user = this.sessionService.decryptSessionData("user");
    if (this.item) {
      this.packageMasterserviceService.getbyid(this.item.item).subscribe(
        (result: any) => {
          this.getbyid = result;
          this.packageUpdate.id = this.getbyid.id;
          this.packageUpdate.procedureCode = this.getbyid.procedureCode;
          this.packageUpdate.procedures=this.getbyid.procedures;
          this.packageUpdate.statusFlag = this.getbyid.statusFlag;
          this.statusFlag = this.getbyid.statusFlag;
          this.isSaveData=false;
        },
        (err: any) => {
          console.log(err);
        }
      );
    }
  }

  resetData(){
  }
  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }
  saveData(){
    this.packageMaster.value.procedureCode=$("#procedureCode").val();
    this.packageMaster.value.procedures=$("#procedures").val();
    var procedureCode = $('#procedureCode').val().toString();
    if (procedureCode==null || procedureCode== "" || procedureCode==undefined){
      $("#procedureCode").focus();
      this.swal("Info", "Please Enter Procedure Code", 'info');
      return;
    }
      var procedures = $('#procedures').val().toString();
      if (procedures==null || procedures== "" || procedures==undefined){
        $("#procedures").focus();
        this.swal("Info", "Please Enter Procedure Name", 'info');
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
            this.packageMasterserviceService.savePackageMasterData(this.packageMaster.value).subscribe((response: any) => {
              this.data=response;
              if(this.data.status == "Success") {
                this.swal('Success',this.data.message,'success')
                this.route.navigate(['/application/viewpackage']);
               }else if(this.data.status == "Failed"){
                 this.swal('Success',this.data.message,'error')
               }
               else {
                 this.swal("Error", "Something went wrong", 'error');
               }
            })
          }
        })
    }

  update(){
    var procedureCode = $('#procedureCode').val().toString();
    if (procedureCode==null || procedureCode== "" || procedureCode==undefined){
      $("#procedureCode").focus();
      this.swal("Info", "Please Enter Procedure Code", 'info');
      return;
    }
    var procedures = $('#procedures').val().toString();
    if (procedures==null || procedures== "" || procedures==undefined){
      $("#procedures").focus();
      this.swal("Info", "Please Enter Procedure Name", 'info');
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
        this.packageUpdate.procedureCode=$('#procedureCode').val().toString();
        this.packageUpdate.procedures=$('#procedures').val().toString();
        this.packageUpdate.statusFlag=this.statusFlag;
        this.packageMasterserviceService.updatePackageMasterData(this.packageUpdate).subscribe((response: any) => {
          this.data=response;
          if(this.data.status == "Success") {
            this.swal('Success',this.data.message,'success');
            this.route.navigate(['/application/viewpackage']);
           }else if(this.data.status == "Failed"){
             this.swal('Success',this.data.message,'error');
           }
           else {
             this.swal("Error", "Something went wrong", 'error');
           }
        })
      }
    })
  }
  yes($event: any) {
    this.statusFlag = 0;
  }
  no($event: any) {
    this.statusFlag = 1;
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
      $('#procedureCode').val('');
    }
  }
  keyfunction2(e){
  }
}
