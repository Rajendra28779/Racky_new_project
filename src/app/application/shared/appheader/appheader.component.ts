import { Component, Directive, ElementRef, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CreatecpdserviceService } from 'src/app/application/Services/createcpdservice.service';
import { LoginSharedServiceService } from 'src/app/login-shared-service.service';
import { ShowAllNotificationComponent } from 'src/app/show-all-notification/show-all-notification.component';
import { HeaderService } from '../../header.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { EncrypyDecrpyService } from 'src/app/services/form-services/encrypy-decrpy.service';
import { LoginService } from 'src/app/services/shared-services/login.service';
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
  isAdmin: boolean = false;
  documentName?: File;
  // userName:any;
  userObj: any;
  ProfilePhoto: any = "./assets/img/male-profile.jpg";
  msg: string;
  flag: any = false;
  imageToShow: any = "./assets/img/male-profile.jpg";
  fileName?: File;
  isImage: boolean;
  user: any;
  dataa: any;
  isUploadData: boolean = true;
  isSaveData: boolean = false;
  isRemoveData: boolean = false;
  PatientPhoto: string;
  fullName: any;
  leftDays: any;
  showUpdatePasword: boolean = true;
  colors: string[] = ['blue', 'red'];
  currentIndex: number = 0;
  constructor(private routerLink: Router, private headerService: HeaderService, public dialog: MatDialog, private loginService: LoginService, private sessionService: SessionStorageService,
    public encDec: EncrypyDecrpyService, private logser: CreatecpdserviceService, private eRef: ElementRef, private loginSharedServiceService: LoginSharedServiceService) { }

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
    // $('#saveImage').hide();
    // $('#removeImage').hide();
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
    this.loginSharedServiceService.message1$.subscribe(res => {
      let userObj = JSON.parse(res);
      this.userName = userObj.userName;
      // let groupId = user.groupId;
      // if (groupId == 1) {
      //   this.isAdmin = true;
      // } else {
      //   this.isAdmin = false;
      // }
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
    })
    this.leftDays = this.user.leftDays;;
    setInterval((timeout) => {
      $('#tag').css({
        color: this.colors[this.currentIndex]
      });
      if (!this.colors[this.currentIndex]) {
        this.currentIndex = 0;
      } else {
        this.currentIndex++;
      }
    }, 200);
    if (this.leftDays > 10) {
      this.showUpdatePasword = false;
    }
    setTimeout(() => {
      this.showUpdatePasword = false;
    }, 90000);

    this.showProfilePic();
    if (this.user.isAuth==0) {
      if(this.user.uidRefNumber == null || this.user.uidRefNumber == undefined ||this.user.uidRefNumber=='') {
        this.profileUpdate();
      }
    }
  }

  profile() {
    this.logser.currentMessage.subscribe(data => {
      let user = this.sessionService.decryptSessionData("user");
      this.userName = user.userName;
      let groupId = user.groupId;
      if (groupId == 3) {
        // console.log('cpd');
        this.routerLink.navigateByUrl('/application/cpdprofile');
      }
      // else if (groupId == 16) {
      //   this.routerLink.navigateByUrl('/application/hospitalopreatorprofile');
      // }
      else if (groupId == 5) {
        // console.log('hospital');
        // this.routerLink.navigateByUrl('/application/hospitalprofile');
        this.openHospital();

      } else {
        // console.log('others');
        this.routerLink.navigateByUrl('/application/userprofile');
      }
    });
  }

  //@HostListener('document:click', ['$event'])

  toggScreen() {
    //if (this.eRef.nativeElement.contains(event.target)) {
    if (localStorage.getItem('layoutType') === '') {
      this.setLayout('toggle-layout');
      this.toggleLayoutBtn = true;
    }
    else {
      this.setLayout('');
      this.toggleLayoutBtn = false;
    }
    // } else {
    //   if (localStorage.getItem('layoutType') === 'toggle-layout') {
    //     this.setLayout('');
    //     this.toggleLayoutBtn = false;
    //   }
    //   // else {
    //   //   this.setLayout('toggle-layout');
    //   //   this.toggleLayoutBtn = true;
    //   // }
    // }
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
    // console.log('here');
    this.headerService.getProfilePhoto(user.userId).subscribe(data => {
      // console.log(data);
      this.isImage = true;
      this.createImage(data);
    }, error => {
      // console.log(error);
      this.isImage = false;
    });
  }

  logout() {
    sessionStorage.clear();
    localStorage.clear();
    this.routerLink.navigateByUrl('/login')
  }

  profilepic(files: any, filetype = 'profile') {
    for (var i = 0; i < files.length; i++) {
      var filename = files[0].name;
      let data = this.loginService.fileExtensionCheck(filename);
      if (data.status != "success") {
        this.swal('Warning', "The file name shouldn't contain " + data.message + " please re-name the file.", 'warning');
        $('#profile').val('');
        this.imageToShow = "./assets/img/male-profile.jpg";
        return;
      }
      let ext = filename.split('.').pop();
      if (ext != 'jpg' && ext != 'jpeg' && ext != 'JPEG' && ext != 'JPG' && ext != 'png' && ext != 'PNG') {
        this.swal('Warning', 'Only JPG/JPEG/PNG Are Allowed!', 'warning');
        $('#profile').val('');
        this.imageToShow = "./assets/img/male-profile.jpg";
        return;
      }
    }
    if (Math.round(files[0].size / 1024) >= 10000) {
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
        this.fileName = event[0];
        // console.log(this.fileName);

      }
    }
  }
  saveImage() {
    // let imageToShow = $('#profile').val();
    // console.log(this.fileName);
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
        this.headerService.saveProfileDetails(this.fileName, userId).subscribe((data) => {
          // console.log(data);
          this.dataa = data;
          if (this.dataa.status == "Success") {
            this.swal("Success", this.dataa.message, "success");
            $('#profilePicModal').hide();
            // this.route.navigate(['application/internalgrivanceview']);
          } else if (this.dataa.status == "Failed") {
            this.swal("Error", this.dataa.message, "error");
          }
        }
        );
      }
    })
    // this.appheader.saveProfileDetails(this.fileName,userId).subscribe({
    // })
  }
  removePhoto() {
    let userId = this.user.userId;
    let profile = $('#profile').val('');
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
  updatePassword() {
    this.routerLink.navigate(['/changeuserpassword']);
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  openHospital() {
    this.user = this.sessionService.decryptSessionData("user");
    this.user.sidebar = 0;
    let user = JSON.stringify(this.user);
    user = this.encDec.encText(user);
    let token = this.sessionService.decryptSessionData("auth_token");
    token = this.encDec.encText(token);
    let sessionId = sessionStorage.getItem("sessionId");
    sessionId = this.encDec.encText(sessionId);

    // user = user.replace("=","");
    // token = token.replace("=","");
    if (user.endsWith("=")) {
      user = user.substring(0, user.indexOf("="));
    }
    if (token.endsWith("=")) {
      token = token.substring(0, token.indexOf("="));
    }
    if (sessionId.endsWith("=")) {
      sessionId = sessionId.substring(0, sessionId.indexOf("="));
    }

    // window.location.href = environment.hospitalEmpanelmentUrl + user + '/' + token + '/' + sessionId;
    window.open(environment.hospitalEmpanelmentUrl + user + '/' + token + '/' + sessionId);

  }
  profileUpdate(){
    this.routerLink.navigateByUrl('/application/userprofile');
  }
}
