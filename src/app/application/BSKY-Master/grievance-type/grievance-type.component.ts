import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderService } from '../../header.service';
import { GrievanceTypeService } from '../../Services/grievance-type.service';
import Swal from 'sweetalert2';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-grievance-type',
  templateUrl: './grievance-type.component.html',
  styleUrls: ['./grievance-type.component.scss']
})
export class GrievanceTypeComponent implements OnInit {
  isSaveData: boolean = true;
  user: any;
  submitted: boolean = false;
  childmessage: any;
  item: any;
  getbyid: any;

  packageUpdate = {
    grievancetypeid: "",
    grievancetypename: "",
    updatedby:"",
    statusflag:""


  };
  data:any;

  statusFlag: any;
  constructor(private grievancetypeService:GrievanceTypeService,private route: Router, public headerService: HeaderService, private sessionService: SessionStorageService) {
  this.item = this.route.getCurrentNavigation().extras.state;
}
  packageMaster= new FormGroup({
    grievancetypename: new FormControl(''),
    createdby:new FormControl(''),


    statusFlag: new FormControl(''),
  });
  ngOnInit(): void {
    this.headerService.setTitle("Grievance-Type");
    this.user = this.sessionService.decryptSessionData("user");
    if (this.item) {
      this.grievancetypeService.getbyid(this.item.item).subscribe(
        (result: any) => {
          this.getbyid = result;
          this.packageUpdate.grievancetypeid = this.getbyid.grievancetypeid;
          this.packageUpdate.grievancetypename = this.getbyid.grievancetypename;
          this.packageUpdate.statusflag = this.getbyid.statusflag;
          this.statusFlag = this.getbyid.statusflag;
          this.isSaveData=false;
        },
        (err: any) => {
        }
      );
    }}
    keyfunction1(e){
      if (e.value[0] == " ") {
        $('#grievancetypename').val('');
      }
    }

    saveData(){
      this.packageMaster.value.grievancetypename=$("#grievancetypename").val();

      var grievancetypename = $('#grievancetypename').val().toString();

      if (grievancetypename==null || grievancetypename== "" || grievancetypename==undefined)
      {
        $("#grievancetypename").focus();
        this.swal("Info", "Please Enter Grievance Type", 'info');
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
          this.grievancetypeService.savegrievancetype(this.packageMaster.value).subscribe((response: any) => {
            this.data=response;
            if(this.data.status == "Success") {
              this.swal('Success',this.data.message,'success')
              this.route.navigate(['/application/grievancetypeview']);
             }else if(this.data.status == "Failed"){
               this.swal('Success',this.data.message,'error')
             }
             else {
               this.swal("Info", this.data.message, 'error');
             }
          })
        }
      })
  }
  resetData(){
  }
  update(){
    var grievancetypename = $('#grievancetypename').val().toString();
    if (grievancetypename==null || grievancetypename== "" || grievancetypename==undefined){
      $("#grievancetypename").focus();
      this.swal("Info", "Please Enter Grievance Type", 'info');
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
        this.packageUpdate.grievancetypename=$('#grievancetypename').val().toString();
        this.packageUpdate.statusflag=this.statusFlag;
        this.grievancetypeService.updateGrievancetypedata(this.packageUpdate).subscribe((response: any) => {
          this.data=response;
          if(this.data.status == "Success") {
            this.swal('Success',this.data.message,'success');
            this.route.navigate(['/application/grievancetypeview']);
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


    }



