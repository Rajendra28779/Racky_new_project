import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from '../../header.service';
import Swal from 'sweetalert2';
import { SubgroupserviceService } from '../../Services/subgroupservice.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-user-sub-group',
  templateUrl: './user-sub-group.component.html',
  styleUrls: ['./user-sub-group.component.scss']
})
export class UserSubGroupComponent implements OnInit {
  user:any;
  user1:any;
  form:FormGroup;
  isUpdateBtnInVisible: boolean;
  isEditBtn: boolean;
  updatelist:any;
  grouplist:any;
  minlengthforName = /^[a-zA-Z ]{4,}$/;
  isActive:any;
  
  // check:any;
  update={
    subgroupname:"",
    groupid:"Select",
    status:""
  };
  childmessage: any;

  constructor(private subgroupservice:SubgroupserviceService,private activatedRoute:ActivatedRoute,public route:Router,public fb:FormBuilder,public headerService:HeaderService, private sessionService: SessionStorageService) {
    this.user = this.route.getCurrentNavigation().extras.state;
   }

  ngOnInit(): void {
    this.headerService.setTitle('Create Sub-Group');
    this.headerService.isIndicate(false);
    this.headerService.isBack(true)
     this.isUpdateBtnInVisible=true;
    this.isEditBtn=false;
    if(this.user)
    {
        this.subgroupservice.getbyid(this.user.user).subscribe(data=>{
        this.updatelist=data;

        this.update.subgroupname=this.updatelist.subgroupname;
        this.update.groupid=this.updatelist.groupid.groupId;
        this.update.status=this.updatelist.status;
        this.isUpdateBtnInVisible=false;
        this.isEditBtn=true;
        

      });
    }
    this.getGroupname();

  }
  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }

Subgroup=new FormGroup({
  groupid:new FormControl(''),
  subgroupname:new FormControl(''),
  createdby:new FormControl('')
});

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  cancel(){
    this.route.navigate(['/application/viewsubgroup']);
  }

  yes($event: any) {
    this.isActive = 0;
  }
  
  no($event: any) {
    this.isActive = 1;
  }



  //For Save Subgroup
  savegroup() {
    //  var groupName =$('#subgroupname').val();
    // var GroupId =$('#groupid').val();
    if(this.Subgroup.value.groupid=='Select'||this.Subgroup.value.groupid==null)    {
      this.swal("warning","Please Fill the Group Name", "warning");
    }else{
      let subgroupname = $("#subgroupname").val().toString();

      if (subgroupname == null || subgroupname == "" || subgroupname == undefined) {
        this.swal("Info", "Please Enter SubGroupName", 'info');
        return;
      }

      if (!subgroupname.match(this.minlengthforName)) {
        this.swal("Info", "Subgroup Name must be more than 3 character", 'info');
        return;
      }
      Swal.fire({
        title: 'Are you sure?',
        // text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Save it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.user1 = this.sessionService.decryptSessionData("user");
          this.Subgroup.value.createdby=this.user1.userId;
          this.Subgroup.value.subgroupname=$('#subgroupname').val().toString();
          this.subgroupservice.savesubgroup(this.Subgroup.value).subscribe(data=>{
      if (data == 1) {
        this.swal("Success","Record Inserted Successfully", "success");
        this.Subgroup.reset();
      }else if(data ==0){
        this.swal("Error","Some error happen", "error");
      }else if(data ==2){
        this.swal("warning","Already Exist", "warning");
      }else if(data ==3){
        this.swal("warning","Please Fill The Sub Group Name", "warning");
      }
    });
        }
      })

  }
  window.location
  }

  
  getGroupname(){
    this.subgroupservice.getGroupname().subscribe(data=>{
      this.grouplist=data;
    });
  }
  updategroup(items:any)
  {

    let subgroupname = $("#subgroupname").val().toString();
    if (!subgroupname.match(this.minlengthforName)) {
      this.swal("Info", "Subgroup Name must be more than 3 character", 'info');
      return;
    }
    Swal.fire({
      title: 'Are you sure?',
      // text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Update it!'
    }).then((result) => {
      if (result.isConfirmed) {
    this.user1 = this.sessionService.decryptSessionData("user");
    this.updatelist.updateby=this.user1.userId;
    this.updatelist.subgroupname=$('#subgroupname').val().toString();
    this.updatelist.status=this.isActive;

    this.subgroupservice.updatet(this.updatelist,items.groupid).subscribe(data=>{
      if (data == 1) {
        this.swal("Success","Record Update Successful", "success");
        this.route.navigate(['/application/viewsubgroup']);
      }else if(data ==0){
        this.swal("Error","Some error happen", "error");
      }else if(data ==2){
        this.swal("warning","Already Exists", "warning");
      }else if(data ==3){
        this.swal("warning","Please Fill The Sub Group Name", "warning");
      }

    });
  }
    })
  }

  keyfunction1(e){

    if (e.value[0] == " ") {
      $('#subgroupname').val('');
    }
}


}
