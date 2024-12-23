import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginSharedServiceService } from 'src/app/login-shared-service.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { LoginService } from 'src/app/services/shared-services/login.service';
import Swal from 'sweetalert2';
declare let $: any;

@Component({
  selector: 'app-sidebarmenu',
  templateUrl: './sidebarmenu.component.html',
  styleUrls: ['./sidebarmenu.component.scss']
})


export class SidebarmenuComponent implements OnInit,OnDestroy {

  userId:any;
  landDetailsSubscription: Subscription;
  user: any;

  constructor(
    private loginSerivce: LoginService,
    private loginSharedServiceService: LoginSharedServiceService,
    public router: Router,
    private encryptionService: EncryptionService,
    private sessionService: SessionStorageService) { }
  menuList:any=[];
  ngOnInit(): void {
    this.menuList= localStorage.getItem("MenuList");
    console.log("Jauchiiiiii",localStorage.getItem("UpdatedMenuList"));
    this.user = this.sessionService.decryptSessionData("user");
    this.userId = this.user.userId;
    this.getSnoClaimDetailsById(this.userId);
    $(".scrollsidebar").mCustomScrollbar({
      theme: "minimal"
    });

      this.loginSharedServiceService.message$.subscribe(res => {
      this.menuList=res;
      console.log(res);
      // this.getSnoClaimDetailsById(res);
    })

  }

  getSnoClaimDetailsById(userId) {
    console.log(userId);

    this.loginSerivce.getMenuList(userId).subscribe((response: any) => {
      let resData = this.encryptionService.getDecryptedData(response);
      if (resData.status == "success") {
        this.menuList= resData.data;
        console.log('menulist->');
        console.log(this.menuList);
        var index;
        for(var i=0;i<this.menuList.length;i++) {
          if(this.menuList[i].globalNameId=='MISReport') {
            index = this.menuList.indexOf(this.menuList[i]);
          }
        }
        for(var j=0;j<this.menuList.length;j++) {
          if(this.menuList[j].globalNameId=='Report') {
            if (index !== -1) {
              this.menuList.splice(index, 1);
            }
          }
        }
        console.log('menulist->');
        console.log(this.menuList);

      } else {
        this.swal('', 'Something went wrong.', 'error');
      }
    },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      });
    }


  util(id){
    var link = $("#"+id);
    var closest_ul = link.closest("ul");
    var parallel_active_links = closest_ul.find(".active")
    var closest_li = link.closest("li");
    var link_status = closest_li.hasClass("active");
    var count = 0;

    closest_ul.find("ul").slideUp(function() {
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
    if (this.user.groupId==5) {
      this.router.navigateByUrl('/application/hospital-dashboard');
    } else if (this.user.groupId==4) {
      this.router.navigateByUrl('/application/sna-dashboard');
    } else if (this.user.groupId==3) {
      this.router.navigateByUrl('/application/cpd-dashboard');
    } else if (this.user.groupId==6) {
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


ngOnDestroy() {
this.landDetailsSubscription.unsubscribe();

}

}
