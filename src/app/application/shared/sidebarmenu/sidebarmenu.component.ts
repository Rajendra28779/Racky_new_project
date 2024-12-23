import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginSharedServiceService } from 'src/app/login-shared-service.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { LoginService } from 'src/app/services/shared-services/login.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import * as CryptoJS from 'crypto-js';
import { EncrypyDecrpyService } from 'src/app/services/form-services/encrypy-decrpy.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

declare let $: any;

@Component({
  selector: 'app-sidebarmenu',
  templateUrl: './sidebarmenu.component.html',
  styleUrls: ['./sidebarmenu.component.scss']
})
export class SidebarmenuComponent implements OnInit {
  userId: any;
  user: any;

  constructor(private loginSerivce: LoginService,
    private loginSharedServiceService: LoginSharedServiceService,
    public router: Router,
    public encDec: EncrypyDecrpyService,
    private encryptionService: EncryptionService,
    private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.user = this.sessionService.decryptSessionData("user");
    this.userId = this.user.userId;
    if(this.user.isAuth == 0 && this.user.uidRefNumber != null){
      this.getSnoClaimDetailsById();
    }else if(this.user.isAuth == 1){
      this.getSnoClaimDetailsById();
    }
    $(".scrollsidebar").mCustomScrollbar({
      theme: "minimal"
    });

    this.loginSharedServiceService.message$.subscribe(res => {
      this.menuList = res;
      // console.log(res);
      // this.getSnoClaimDetailsById(res);
    })

    this.loginSharedServiceService.message1$.subscribe(res => {
      let userObj = JSON.parse(res);
      this.userId = userObj.userId;
      this.sessionService.encryptSessionData("user", userObj);
    })

  }
  menuList: any = [];
  getSnoClaimDetailsById() {
    this.loginSerivce.getMenuList(this.userId).subscribe((response: any) => {
      let resData = this.encryptionService.getDecryptedData(response);
      if (resData.status == "success") {
        this.menuList = resData.data;
        var index;
        for (var i = 0; i < this.menuList.length; i++) {
          if (this.menuList[i].globalNameId == 'MISReport') {
            index = this.menuList.indexOf(this.menuList[i]);
          }
        }
        for (var j = 0; j < this.menuList.length; j++) {
          if (this.menuList[j].globalNameId == 'Report') {
            if (index !== -1) {
              this.menuList.splice(index, 1);
            }
          }
        }
      } else {
        this.swal('', 'Something went wrong.', 'error');
      }
    },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      });
  }
  util(id) {
    var link = $("#" + id);
    var closest_ul = link.closest("ul");
    var parallel_active_links = closest_ul.find(".active")
    var closest_li = link.closest("li");
    var link_status = closest_li.hasClass("active");
    var count = 0;

    closest_ul.find("ul").slideUp(function () {
      if (++count == closest_ul.find("ul").length)
        parallel_active_links.removeClass("active");
    });
    if (!link_status) {
      closest_li.children("ul").slideDown();
      closest_li.addClass("active");
    }
  }

  dashboard() {
    sessionStorage.removeItem('globalLink');
    if (this.user.groupId == 5) {
      this.router.navigateByUrl('/application/hospital-dashboard');
    } else if (this.user.groupId == 4) {
      this.router.navigateByUrl('/application/sna-dashboard');
    } else if (this.user.groupId == 3) {
      this.router.navigateByUrl('/application/cpd-dashboard');
    } else if (this.user.groupId == 6) {
      this.router.navigateByUrl('/application/dc-dashboard');
    } else if (this.user.groupId == 37) {
      this.router.navigate(['/application/ceodashboard']);
    } else {
      this.router.navigateByUrl('/application/dashboard');
    }
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  removeStore(link: any, globalName: any) {
    sessionStorage.setItem("globalName", globalName)
    sessionStorage.removeItem("requestData");

    if (link == "/application/dcauthoritypending") {

      this.applicationRedirection("dc_authority", environment.hospitalEmpanelmentUrl);

    }if (link == "/application/hospitalbankdetailsupdation") {

      this.applicationRedirection("bankdetails", environment.hospitalEmpanelmentUrl);

    } else if (link == "/application/hospitalupdatemobilenumber") {

      this.applicationRedirection("hospital_update", environment.hospitalEmpanelmentUrl);

    }else if (link == "/application/dcAuthPending") {

      this.applicationRedirection("dcauth_pending", environment.hospitalEmpanelmentUrl);

    } else if (link == "/application/newenrollment") {

      this.applicationRedirection("enrollment", environment.hospitalEnrollmentUrl);

    }
    else if (link == "/application/getReportList") {

      this.applicationRedirection("report", environment.reporttUrl);

    }
    else if(link == "/application/newhospitallist"){
      this.applicationRedirection("hospital_codegenerate", environment.hospitalEmpanelmentUrl);
    }
    else {
      this.router.navigate([link]);
    }
  }
  applicationRedirection(subMod, URL) {
    this.user = this.sessionService.decryptSessionData("user");
    if (subMod == "dc_authority") {
      this.user.sidebar = 1;
    } else if (subMod == "hospital_update") {
      this.user.sidebar = 2;
    } else if (subMod == "hospital_codegenerate") {
      this.user.sidebar = 5;
    } else if (subMod == "bankdetails") {
      this.user.sidebar = 11;//bank details page
    } else if (subMod == "dcauth_pending") {
      this.user.sidebar = 6;//manage new application
    }


    let user = JSON.stringify(this.user);
    user = this.encDec.encText(user);
    let token = this.sessionService.decryptSessionData("auth_token");
    token = this.encDec.encText(token);
    let sessionId = sessionStorage.getItem("sessionId");
    sessionId = this.encDec.encText(sessionId);

    if (user.endsWith("=")) {
      user = user.substring(0, user.indexOf("="));
    }
    if (token.endsWith("=")) {
      token = token.substring(0, token.indexOf("="));
    }
    if (sessionId.endsWith("=")) {
      sessionId = sessionId.substring(0, sessionId.indexOf("="));
    }

    let fullUrl = URL + user + '/' + token + '/' + sessionId;
    window.open(fullUrl);
  }
  // window.location.href = environment.hospitalEmpanelmentUrl + user + '/' + token + '/' + sessionId;
  // user = user.replace("=","");
  // token = token.replace("=","");
  // sessionId = sessionId.replace("=","");
}
