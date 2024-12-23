import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

import { GrievanceByService } from '../../Services/grievance-by.service';
import { HeaderService } from '../../header.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-grievance-by',
  templateUrl: './grievance-by.component.html',
  styleUrls: ['./grievance-by.component.scss']
})
export class GrievanceByComponent implements OnInit {
  isSaveData: boolean = true;
  user: any;
  submitted: boolean = false;
  childmessage: any;
  item: any;
  getbyid: any;

  packageUpdate = {
    id: "",
    grivancename: "",
    updatedby:"",
    statusFlag:""


  };
  data:any;

  statusFlag: any;


  constructor(private route: Router,private grievancebyService:GrievanceByService, public headerService: HeaderService, private sessionService: SessionStorageService) {
  this.item = this.route.getCurrentNavigation().extras.state;
  }
  packageMaster= new FormGroup({
    grivancename: new FormControl(''),
    createdby:new FormControl(''),

    // updatedby:new FormControl(''),

    statusFlag: new FormControl(''),
  });
  ngOnInit(): void {
    this.headerService.setTitle("Grievance-By");
    this.user = this.sessionService.decryptSessionData("user");

if (this.item) {
  this.grievancebyService.getbyid(this.item.item).subscribe(
    (result: any) => {
      this.getbyid = result;
      this.packageUpdate.id = this.getbyid.id;
      this.packageUpdate.grivancename = this.getbyid.grivancename;
      this.packageUpdate.statusFlag = this.getbyid.statusFlag;
      this.statusFlag = this.getbyid.statusFlag;
      this.isSaveData=false;
    },
    (err: any) => {
    }
  );
}
  }
  keyfunction1(e){
    if (e.value[0] == " ") {
      $('#grivancename').val('');
    }
  }
  saveData(){
    this.packageMaster.value.grivancename=$("#grivancename").val();

    var grivancename = $('#grivancename').val().toString();

    if (grivancename==null || grivancename== "" || grivancename==undefined)
    {
      $("#grivancename").focus();
      this.swal("Info", "Please Enter GrivanceBy", 'info');
      return;
    }
    this.packageMaster.value.createdby=this.user.userId;
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
            this.grievancebyService.savegrievanceby(this.packageMaster.value).subscribe((response: any) => {
              this.data=response;
              if(this.data.status == "Success") {
                this.swal('Success',this.data.message,'success')
                this.route.navigate(['/application/grievancebyView']);
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
    resetData(){
    }
    update(){
      var grivancename = $('#grivancename').val().toString();
      if (grivancename==null || grivancename== "" || grivancename==undefined){
        $("#grivancename").focus();
        this.swal("Info", "Please Enter grivancename", 'info');
        return;
      }




      this.packageUpdate.updatedby=this.user.userId;
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
          this.packageUpdate.grivancename=$('#grivancename').val().toString();
          this.packageUpdate.statusFlag=this.statusFlag;
          this.grievancebyService.updateGrievanceMasterData(this.packageUpdate).subscribe((response: any) => {
            this.data=response;
            if(this.data.status == "Success") {
              this.swal('Success',this.data.message,'success');
              this.route.navigate(['/application/grievancebyView']);
             }else if(this.data.status == "Failed"){
               this.swal('Success',this.data.message,'error');
             }
             else {
               this.swal("Info", "Something went wrong", 'error');
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


      }


