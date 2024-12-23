

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { data } from 'jquery';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { MedicalinfracatservService } from '../../Services/medicalinfracatserv.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

//import { GroupTypeService } from '../../Services/group-type.service';

@Component({
  selector: 'app-medicalinfracategory',
  templateUrl: './medicalinfracategory.component.html',
  styleUrls: ['./medicalinfracategory.component.scss']
})
export class MedicalinfracategoryComponent implements OnInit {

  form!: FormGroup;
  item: any;
  getbyid: any;
  valid: any = 0;
  isvisiblesave: boolean;
  visibleupdate: boolean;
  submitted: boolean = false;
  childmessage: any;
  user1: any;
  statusFlag: any;
  minlengthforName = /^[a-zA-Z0-9 ]{3,}$/;
  data:any;
 

  constructor(private catserv: MedicalinfracatservService, private route: Router, public fb: FormBuilder, public headerService: HeaderService,private sessionService: SessionStorageService) { 
    this.item = this.route.getCurrentNavigation().extras.state;
  }

  MedicalInfraCategory = new FormGroup({
    medInfraCatName: new FormControl(''),
    createdon: new FormControl(''),
    createdby: new FormControl(''),
    updateon: new FormControl(''),
    updateby: new FormControl(''),
    statusFlag: new FormControl(''),
    isMandatory: new FormControl(''),
  });

  updateMedicalInfraCategory = {
    medInfraCatName: "",
    createdon: "",
    createdby: "",
    updateon: "",
    updateby: "",
    statusFlag: "",
    isMandatory:"",
  };

  ngOnInit(): void {
    this.headerService.setTitle("Medical Infra Category");
    this.headerService.isIndicate(false);
    this.headerService.isBack(true);
    this.user1 = this.sessionService.decryptSessionData("user");
    this.isvisiblesave = true;
    this.visibleupdate = false;
    console.log("item is: ");
    console.log(this.item);

    if (this.item) {
      this.catserv.getbyid(this.item.item).subscribe(
        (result: any) => {
          this.getbyid = result;
          this.updateMedicalInfraCategory.medInfraCatName = this.getbyid.medInfraCatName;
          this.updateMedicalInfraCategory.statusFlag = this.getbyid.statusFlag;
          this.updateMedicalInfraCategory.isMandatory = this.getbyid.isMandatory;
          this.statusFlag = this.getbyid.statusFlag;
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

  save() {
    this.submitted = true;
    let medInfraCatName = $("#medInfraCatName").val().toString(); 
    let isMandatory = $("#isMandatory").val(); 

    if (medInfraCatName==null || medInfraCatName== "" || medInfraCatName==undefined){
      $("#medicalinfracat").focus();
      this.swal("Info", "Please Enter Medical Infra Category", 'info');
      return;
    }
    if(!medInfraCatName.match(this.minlengthforName)) {
      $("#medicalinfracat").focus();
      this.swal("Info", "Medical Infra Category Name must be more than 3 character", 'info');
      return;
    }
    if (isMandatory==null || isMandatory== "" || isMandatory==undefined){
      $("#isMandatory").focus();
      this.swal("Info", "Please Select IsMandatory", 'info');
      return;
    }
   
    this.user1 = this.user1;
    this.MedicalInfraCategory.value.createdBy = this.user1.userId;
    this.MedicalInfraCategory.value.medInfraCatName=$("#medInfraCatName").val().toString();
    this.MedicalInfraCategory.value.isMandatory=$("#isMandatory").val();
    console.log("value of catogory: ");
    console.log( this.MedicalInfraCategory.value)
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
        this.catserv.savecategory(this.MedicalInfraCategory.value).subscribe((response: any) => {
          console.log(response);
          this.data=response;
          if(this.data.status == "Success") {
            this.swal('Success',this.data.message,'success')
            this.route.navigate(['/application/medicalinfracategoryview']);
           }else if(this.data.status == "Failed"){
             this.swal('Warning',this.data.message,'error')
           }
           else {
             this.swal("Error", "Something went wrong", 'error');
           }
        })
      }
    });
  }

  update(items: any) {
    this.submitted = true;
    let medInfraCatName = $("#medInfraCatName").val().toString();
    let isMandatory = $("#isMandatory").val().toString(); 

    if (medInfraCatName==null || medInfraCatName== "" || medInfraCatName==undefined){
      $("#medicalinfracat").focus();
      this.swal("Info", "Please Enter Medical Infra Category", 'info');
      return;
    }
    if(!medInfraCatName.match(this.minlengthforName)) {
      $("#medicalinfracat").focus();
      this.swal("Info", "Medical Infra Category Name must be more than 3 character", 'info');
      return;
    }
    if (isMandatory==null || isMandatory== "" || isMandatory==undefined){
      $("#medicalinfracat").focus();
      this.swal("Info", "Please Select IsMandatory", 'info');
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
        console.log(this.getbyid);
        this.getbyid.medInfraCatName = medInfraCatName;
        this.getbyid.statusFlag = this.statusFlag;
        this.getbyid.updatedBy = this.user1.userId;
        this.getbyid.isMandatory = isMandatory;
        console.log(this.getbyid);
        this.catserv.updateMedicalInfraCategory(this.getbyid).subscribe((response: any) => {
          console.log(response);
          console.log(response);
          this.data=response;
          if(this.data.status == "Success") {
            this.swal('Success',this.data.message,'success')
            this.route.navigate(['/application/medicalinfracategoryview']);
           }else if(this.data.status == "Failed"){
             this.swal('Warning',this.data.message,'error')
           }
           else {
             this.swal("Error", "Something went wrong", 'error');
            }
          })
        }
      });
  }

  yes($event: any) {
    this.statusFlag = 0;
  }

  no($event: any) {
    this.statusFlag = 1;
  }

  cencel1() {
    this.route.navigate(['/application/medicalinfracategoryview'])

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
      $('#medInfraCatName').val('');
    }
  }
}
