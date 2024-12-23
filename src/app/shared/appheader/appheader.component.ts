import { Component, Directive, ElementRef, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CreatecpdserviceService } from 'src/app/application/Services/createcpdservice.service';
import { ShowAllNotificationComponent } from 'src/app/show-all-notification/show-all-notification.component';
import { HeaderService } from '../../application/header.service';
import Swal from 'sweetalert2';
import { SessionStorageService } from 'src/app/services/session-storage.service';
@Component({
  selector: 'app-appheader',
  templateUrl: './appheader.component.html',
  styleUrls: ['./appheader.component.scss']
})
export class AppheaderComponent implements OnInit {

  toggleLayoutBtn: boolean = false;
  pagetitle: any;
  Response: any;
  userName: string;
  dialogData: any;
  dataa: any;
  router: any;
  isAdmin: boolean = false;
  ProfilePhoto: any = "./assets/img/male-profile.jpg";
  // userName:any;
  fileName?:File;
  imageToShow: any;
  isUploadData: boolean = true;
  isSaveData: boolean = false;
  isRemoveData: boolean = false;
  isImage: any;
  user: any;
  msg: string;
  fullName: any;

  constructor(private routerLink: Router, private headerService: HeaderService, public dialog: MatDialog, 
    private logser: CreatecpdserviceService, private eRef: ElementRef, private sessionService: SessionStorageService)  { }

  openDialog(index: any) {
    this.dialog.open(ShowAllNotificationComponent, { data: this.dialogData[index] });
  }
  // openDialog() {
  //   this.dialog.open(DialogElementsExampleDialogComponent);
  // }

  Showallnotification() {
    this.dialog.open(ShowAllNotificationComponent);
  }

  ngOnInit() {
    this.isUploadData = true;
    this.isSaveData = false;
    this.isRemoveData = false;
    this.user = this.sessionService.decryptSessionData("user");
    this.logser.currentMessage.subscribe(data => {
      let user = this.sessionService.decryptSessionData("user");
      this.fullName = user.fullName;
      let groupId = user.groupId;
      if (groupId == 1) {
        this.isAdmin = true;
      } else {
        this.isAdmin = false;
      }
    });
    if (localStorage.getItem('layoutType') === '') {
      this.setLayout('');
      this.toggleLayoutBtn = false;
    } else {
      this.setLayout('');
      this.toggleLayoutBtn = false;
    }

    this.headerService.title.subscribe(title => {
      this.pagetitle = title;
    });
    this.showProfilePic();
  }

  profile() {
    this.logser.currentMessage.subscribe(data => {
      let user = this.sessionService.decryptSessionData("user");
      this.userName = user.userName;
      let groupId = user.groupId;
      if (groupId == 3) {
        console.log('cpd');
        this.routerLink.navigateByUrl('/application/cpdprofile');
      } else if (groupId == 5) {
        console.log('hospital');
        this.routerLink.navigateByUrl('/application/hospitalprofile');
      } else {
        console.log('others');
        this.routerLink.navigateByUrl('/application/userprofile');
      }
    });
  }

  @HostListener('document:click', ['$event'])

  clickout(event: any) {
    if (this.eRef.nativeElement.contains(event.target)) {
      if (localStorage.getItem('layoutType') === '') {
        this.setLayout('toggle-layout');
        this.toggleLayoutBtn = true;
      }
      else {
        this.setLayout('');
        this.toggleLayoutBtn = false;
      }
    } else {
      if (localStorage.getItem('layoutType') === 'toggle-layout') {
        this.setLayout('');
        this.toggleLayoutBtn = false;
      }
      // else {
      //   this.setLayout('toggle-layout');
      //   this.toggleLayoutBtn = true;
      // }
    }
  }
  // toggle layout
  // toggScreen() {
  //   if (localStorage.getItem('layoutType') === '') {
  //     this.setLayout('toggle-layout');
  //     this.toggleLayoutBtn = true;
  //     //alert(0)
  //   } else {
  //     this.setLayout('');
  //     this.toggleLayoutBtn = false;
  //     //alert(1)
  //   }
  // }

  // toggle layout
  setLayout(layoutToggle: any) {
    localStorage.setItem('layoutType', layoutToggle);
    document.body.className = layoutToggle;
  }

  private createImage(image: Blob) {
    if (image && image.size > 0) {
      let reader = new FileReader();
      reader.addEventListener("load", () => {
        this.imageToShow = reader.result;
      }, false);
      reader.readAsDataURL(image);
    } else {
      this.isImage = false;
    }
  }

  showProfilePic() {
    let user = this.sessionService.decryptSessionData("user");
    console.log('here');
    this.headerService.getProfilePhoto(user.userId).subscribe(data => {
      console.log(data);
      this.isImage = true;
      this.createImage(data);
    }, error => {
      // console.log(error);
      this.isImage = false;
    });
  }
  profilepic(files: any, filetype = 'profile') {
    for (var i = 0; i < files.length; i++) {
      var filename = files[0].name;
      let ext = filename.split('.').pop();
      if (ext != 'jpg' && ext != 'jpeg') {
        this.swal('Warning', 'Only JPG/JPEG Are Allowed!', 'warning');
        $('#profile').val('');
         this.imageToShow = "./assets/img/male-profile.jpg";
        return;
      }
    }
    if (Math.round(files[0].size / 1024) >= 1024) {
      this.swal('Warning', 'Photo Size  is Not allowed ', 'warning');
      $('#profile').val('');
      return;
    } else {
      this.isUploadData = true;
      this.isSaveData = true;
      this.isRemoveData = true;
     this.selectFileintspce(files, filetype);
    } 
  }
  selectFileintspce(event: any, type: string) {
    if (!event[0] || event[0].length == 0) {
      return;
    }
    var mimeType = event[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.swal('', 'Only JPG/JPEG Are Allowed!', 'error');
      if (type == "profile") {
        $('#profile').val('');
        this.imageToShow = "./assets/img/male-profile.jpg";
      }
      return;
    }
    var reader = new FileReader();
    reader.readAsDataURL(event[0]);
    reader.onload = (_event) => {
      this.msg = "";
      if (type == 'profile') {
        this.imageToShow = reader.result;
        this.fileName=event[0];
        console.log(this.fileName);
        
      }
    }
  }
  saveImage(){
    // let imageToShow = $('#profile').val();
    console.log(this.fileName);
    let userId = this.user.userId;
    Swal.fire({
      title: 'Are you sure?',
      // text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Upload it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.headerService.saveProfileDetails(this.fileName,userId).subscribe((data) => {
          console.log(data);
          this.dataa = data;
          if (this.dataa.status == "Success") {
            this.swal("Success", this.dataa.message, "success");
            $('#profilePicModal').hide();
    
          } else if (this.dataa.status == "Failed") {
            this.swal("Error", this.dataa.message, "error");
          }
        }
        );
      }
    })
  }
  removePhoto(){
    let userId = this.user.userId;
    let profile=$('#profile').val('');
    Swal.fire({
      title: 'Do you want to remove?',
      // text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        $('#profile').val('');
          this.imageToShow = "./assets/img/male-profile.jpg";
          this.isUploadData = true;
          this.isSaveData = false;
          this.isRemoveData = true;
      }
    })
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  logout() {
    sessionStorage.clear();
    localStorage.clear();
    this.routerLink.navigateByUrl('/login')
  }
}
