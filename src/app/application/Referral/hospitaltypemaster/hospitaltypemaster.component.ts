import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { ReferralService } from '../../Services/referral.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-hospitaltypemaster',
  templateUrl: './hospitaltypemaster.component.html',
  styleUrls: ['./hospitaltypemaster.component.scss']
})
export class HospitaltypemasterComponent implements OnInit {
  maxChars:any=250;
  user:any;
  list:any=[];
  count:any=0;
  textserch:any;
  currentPage: any;
  pageElement: any;
  showPegi: boolean;
  reson:any;
  type:any;
  refid:any;
  update:boolean=false;
  status:any

    constructor(private userService: ReferralService,public headerService: HeaderService,private sessionService: SessionStorageService,) { }

    ngOnInit(): void {
      this.headerService.setTitle('Referral Hospital Type');
      // this.user = JSON.parse(sessionStorage.getItem("user"));
      this.user = this.sessionService.decryptSessionData("user");
      this.getallhosptype();
    }

    group=new FormGroup({
      hospitaltypename:new FormControl(''),
      hospitaltypedesc:new FormControl(''),
      createdby:new FormControl(''),
      status:new FormControl(''),
      hospitaltypeid:new FormControl(''),
    });

    keyPress(event: KeyboardEvent) {
      const pattern = /^[A-Za-z0-9.,-_ \\s]+$/;
      //var regex = new RegExp("^[A-Za-z0-9.,-\\s]+$");
      const inputChar = String.fromCharCode(event.charCode);
      if (!pattern.test(inputChar)) {
          // invalid character, prevent input
          event.preventDefault();
      }
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  getallhosptype(){
    this.userService.getallhosptype().subscribe((data:any)=>{
      this.list=data;
      this.count=this.list.length
    if(this.count>0){
      this.showPegi=true
      this.currentPage=1
      this.pageElement=20
    }else{
      this.showPegi=true
    }
    });
  }

  yes($event: any) {
    this.status = 0;
  }

  no($event: any) {
    this.status = 1;
  }

    SubmitCreate(){
      var hosptype = $('#hosptype').val().toString().trim();
      if (hosptype == null || hosptype == "" || hosptype == undefined) {
        $("#hosptype").focus();
        $("#hosptype").val('');
        this.swal("Info", "Please Enter Hospital Type Name", 'info');
        return;
      }
      var remarks = $('#reson').val().toString().trim();
      if (remarks == null || remarks == "" || remarks == undefined) {
        $("#reson").focus();
        $("#reson").val('');
        this.swal("Info", "Please Enter Description", 'info');
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
          this.group.value.createdby=this.user.userId
          this.group.value.hospitaltypename=hosptype
          this.userService.saverefhospitaltype(this.group.value).subscribe((data:any)=>{
            if(data.status==200){
              this.swal("Success", data.message, 'success');
              $("#reson").val('');$("#hosptype").val('');
              this.getallhosptype();
            }else{
              this.swal("Error", data.message, 'error');
              $("#reson").focus();
            }
          })
        }
      })
    }

    ResetForm(){
      $("#reson").val('');
      $("#hosptype").val('');
      this.update=false;
    }

    edit(item:any){
      window.scrollTo(0,0);
      this.reson=item.hospitaltypedesc;
      this.type=item.hospitaltypename;
      this.refid=item.hospitaltypeid;
      this.update=true;
      this.status=item.status;
    }

    Update(){
      var hosptype = $('#hosptype').val().toString().trim();
      if (hosptype == null || hosptype == "" || hosptype == undefined) {
        $("#hosptype").focus();
        $("#hosptype").val('');
        this.swal("Info", "Please Enter Hospital Type Name", 'info');
        return;
      }
      var remarks = $('#reson').val().toString().trim();
      if (remarks == null || remarks == "" || remarks == undefined) {
        $("#reson").focus();
        $("#reson").val('');
        this.swal("Info", "Please Enter Referral Reason", 'info');
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
          this.group.value.hospitaltypename=hosptype
          this.group.value.createdby=this.user.userId
          this.group.value.hospitaltypeid=this.refid
          this.group.value.status=this.status
          this.userService.updaterefhospitaltype(this.group.value).subscribe((data:any)=>{
            if(data.status==200){
              this.swal("Success", data.message, 'success');
              this.reson="";
              this.type="";
              $("#reson").val('');$("#hosptype").val('');
              this.getallhosptype();
              this.update=false;
            }else{
              this.swal("Error", data.message, 'error');
              $("#reson").focus();
            }
          })
        }
      })
    }


  }
