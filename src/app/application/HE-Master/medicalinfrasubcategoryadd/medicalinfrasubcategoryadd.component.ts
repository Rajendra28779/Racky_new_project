
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { data } from 'jquery';
import Swal from 'sweetalert2';
import { MedicalinfracatservService } from '../../Services/medicalinfracatserv.service';
import { MedicalinfrasubcatservService } from '../../Services/medicalinfrasubcatserv.service';
import { HeaderService } from '../../header.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';


@Component({
  selector: 'app-medicalinfrasubcategoryadd',
  templateUrl: './medicalinfrasubcategoryadd.component.html',
  styleUrls: ['./medicalinfrasubcategoryadd.component.scss']
})
export class MedicalinfrasubcategoryaddComponent implements OnInit {

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
  categoryData: any = [];

  constructor(private catserv: MedicalinfracatservService,private subcatserv: MedicalinfrasubcatservService, private route: Router, public fb: FormBuilder, public headerService: HeaderService, private sessionService: SessionStorageService) { 
    this.item = this.route.getCurrentNavigation().extras.state;
  }

  MedicalInfraSubCategory = new FormGroup({
    medInfraSubCatName: new FormControl(''),
    medInfracatId: new FormControl(''),
    createdon: new FormControl(''),
    createdby: new FormControl(''),
    updatedOn: new FormControl(''),
    updatedBy: new FormControl(''),
    statusFlag: new FormControl(''),
  });

  updateMedicalInfraSubCat = {
    medInfraSubCatName: "",
    medInfracatId: "",
    createdon: "",
    createdby: "",
    updatedOn: "",
    updatedBy: "",
    statusFlag: ""
  };

  ngOnInit(): void {
    this.headerService.setTitle("Medical Infra Sub Category");
    this.headerService.isIndicate(false);
    this.headerService.isBack(true);
    this.user1 = this.sessionService.decryptSessionData("user");
    this.isvisiblesave = true;
    this.visibleupdate = false;
    console.log("item of submedicalcategory : ");
    console.log(this.item);
    if (this.item) {
      this.subcatserv.getbyid(this.item.item).subscribe(
        (result: any) => {
          console.log(result);
          this.getbyid = result;
          console.log("get the getbyid")
          console.log(this.getbyid);
          this.updateMedicalInfraSubCat.medInfraSubCatName = this.getbyid.medInfraSubCatName;
          this.updateMedicalInfraSubCat.medInfracatId = this.getbyid.medInfracatId.medInfracatId;
          // console.log(this.getbyid.medInfracatId);
          this.updateMedicalInfraSubCat.statusFlag = this.getbyid.statusFlag;
          this.statusFlag = this.getbyid.statusFlag;
          this.isvisiblesave = false;
          this.visibleupdate = true;
          console.log(this.updateMedicalInfraSubCat.medInfracatId);
        },
        (err: any) => {
          console.log(err);
        }
      );
    }
    this. MedicalCategoryList();
  }

  MedicalCategoryList() {
    this.subcatserv.getCategoryList().subscribe((allData) => {
      this.categoryData = allData;
      console.log("category data");
      console.log(this.categoryData);
    })
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
    let medInfraSubCatName=$("#medInfraSubCatName").val().toString();

    if(this.MedicalInfraSubCategory.value.medInfracatId=='Select' || this.MedicalInfraSubCategory.value.medInfracatId==null)    {
      $("#medInfracatId").focus();
      this.swal("Info", "Please Select Medical Infra Category", 'info');
      return;
    }

    if (medInfraSubCatName==null || medInfraSubCatName== "" || medInfraSubCatName==undefined){
      $("#medInfraSubCatName").focus();
      this.swal("Info", "Please Enter Medical Infra Subcategory", 'info');
      return;
    }
    // if(!medInfracatId.match(this.minlengthforName)) {
    //   $("#medicalinfracat").focus();
    //   this.swal("Info", "Medical Infra Category Name must be more than 3 character", 'info');
    //   return;
    // }
    this.user1 = this.user1;
    this.MedicalInfraSubCategory.value.createdBy = this.user1.userId;
    this.MedicalInfraSubCategory.value.medInfraSubCatName=$("#medInfraSubCatName").val().toString();
    console.log("value of subcatogory: ");
    console.log( this.MedicalInfraSubCategory.value)
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
        this.subcatserv.savesubcategory(this.MedicalInfraSubCategory.value).subscribe((response: any) => {
          console.log(response);
          this.data=response;
          if(this.data.status == "Success") {
            this.swal('Success',this.data.message,'success')
            this.route.navigate(['/application/medicalinfrasubcategoryview']);
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

  medInfracatId:any;
  update(items: any) {
    this.submitted = true;
    let medInfraSubCatName=$("#medInfraSubCatName").val().toString();
    if(this.MedicalInfraSubCategory.value.medInfracatId=='Select' || this.MedicalInfraSubCategory.value.medInfracatId==null)    {
      $("#medInfracatId").focus();
      this.swal("Info", "Please Select Medical Infra Category", 'info');
      return;
    }

    if (medInfraSubCatName==null || medInfraSubCatName== "" || medInfraSubCatName==undefined){
      $("#medInfraSubCatName").focus();
      this.swal("Info", "Please Enter Medical Infra Subcategory", 'info');
      return;
    }
    // if(!medInfraCatName.match(this.minlengthforName)) {
    //   $("#medicalinfracat").focus();
    //   this.swal("Info", "Medical Infra Category Name must be more than 3 character", 'info');
    //   return;
    // }
    this.user1 = this.user1;
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
        this.getbyid.medInfraSubCatName=medInfraSubCatName;
        this.getbyid.updatedBy = this.user1.userId;
        this.getbyid.statusFlag =  this.statusFlag;
        this.medInfracatId=this.getbyid.medInfracatId.medInfracatId;
        this.subcatserv.updateMedicalInfraSubCategory(this.getbyid,this.medInfracatId).subscribe((response: any) => {
          this.data=response;
          if(this.data.status == "Success") {
            this.swal('Success',this.data.message,'success')
            this.route.navigate(['/application/medicalinfrasubcategoryview']);
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
    this.route.navigate(['/application/medicalinfrasubcategoryview'])

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
