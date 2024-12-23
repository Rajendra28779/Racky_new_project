import { Component, OnInit } from '@angular/core';
import { PostmasterServiceService } from '../Services/postmaster-service.service';
import { Router } from '@angular/router';
import { HeaderService } from '../header.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-postmaster-add',
  templateUrl: './postmaster-add.component.html',
  styleUrls: ['./postmaster-add.component.scss']
})
export class PostmasterAddComponent implements OnInit {
  childmessage: any;
  showupdate: boolean;
  maxChars = 500;
  user: any;
  status: any;
  user1: any;
  getbyid = {
    postName: '',
    description: '',
    isactive: '',
  };
  id:any;

  constructor(
    private route: Router,
    public headerService: HeaderService,
    private postmasterservice: PostmasterServiceService,
    private sessionService: SessionStorageService
  ) {this.user1 = this.route.getCurrentNavigation().extras.state; }

  ngOnInit(): void {
    this.headerService.setTitle('Post Master');
    this.user = this.sessionService.decryptSessionData('user');
    this.showupdate = false;
    if(this.user1!=undefined){
      this.showupdate=true
      this.getbyid.postName=this.user1.user.POST_NAME;
      this.getbyid.description=this.user1.user.POST_DESCRIPTION;
      this.getbyid.isactive=this.user1.user.STATUS;
      this.status=this.user1.user.STATUS;
      this.id=this.user1.user.POST_ID;
    }
  }
  yes($event: any) {
    this.status = 0;
  }

  no($event: any) {
    this.status = 1;
  }
  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }
  group = new FormGroup({
    postname: new FormControl(''),
    functiondescription: new FormControl(''),
  });
  keyPress(event: KeyboardEvent) {
    const pattern = /^[A-Za-z0-9.,-_ ()\\s]+$/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  dataa: any;
  save(){
    var postname = $('#postname').val().toString();
    var description = $('#description').val().toString();
    var order = $('#order').val();
    if (postname == null || postname == '' || postname == undefined) {
      this.swal('Info', 'Please Fill Post Name', 'info');
      return;
    }

    if (description == null || description == '' || description == undefined) {
      this.swal('Info', 'Please Fill Description', 'info');
      return;
    }
    Swal.fire({
      title: 'Are you sure?',
      // text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Save it!',
    }).then((result) => {
      if (result.isConfirmed) {
        let object = {
          postname: postname,
          createdBy: this.user.userId,
          postdescription: description,
        };
        this.postmasterservice.savepostname(object).subscribe((data) => {
          this.dataa = data;
          if (this.dataa.status == '200') {
            this.swal('Success', this.dataa.message, 'success');
            this.route.navigate(['/application/postmasterview']);
          } else  {
            this.swal('Error', this.dataa.message, 'error');
          }
        });
      }
    });
  }
   update(){

    let postname = $('#postname').val().toString().trim();
    let description = $('#description').val().toString().trim();

    if (postname==null || postname== "" || postname==undefined){
      this.swal("Info", "Please Enter Post Name", 'info');
      return;
    }
    if (description == null || description == '' || description == undefined) {
      this.swal('Info', 'Please Fill Description', 'info');
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
        let object={
          postname: postname,
          createdBy: this.user.userId,
          postdescription: description,
          postid:this.id,
          bitStatus:this.status
        }
        this.postmasterservice.updatepostname(object).subscribe(data=>{
          this.dataa=data;
          if (this.dataa.status == 200) {
            this.swal("Success", this.dataa.message, "success");
            this.route.navigate(['/application/postmasterview']);
          }else {
            this.swal("Error",this.dataa.message, "error");
          }
        });
      }
    })
  }
  updatereset(){ this.route.navigate(['/application/postmasterview']);}
  resetform(){
    $('#postname').val('');
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
}
