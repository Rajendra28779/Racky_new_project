
import { Injectable, EventEmitter } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { LoginService } from './services/shared-services/login.service';
@Injectable({
  providedIn: 'root',
})

export class LoginSharedServiceService {

  private message: Subject<string> = new BehaviorSubject<string>(null);
  public message$: Observable<string> = this.message.asObservable();

  private message1: Subject<string> = new Subject<string>();
  public message1$: Observable<string> = this.message1.asObservable();
   
  

  constructor(private loginSerivce: LoginService) { }
  menuList:any=[];
  //userObj:any=[];
  setMessage(menuList) {
  
    console.log(menuList);
    
    // this.loginSerivce.getMenuList(userId).subscribe((data: any) => {
    //   let resData = data;
    //   console.log(resData);
    //   if (resData.status == "success") { 
    //     this.menuList= JSON.parse(resData.globalLinkList);
    //     console.log(this.menuList);
        // localStorage.setItem("UpdatedMenuList","UpdatedMenuList");
        // localStorage.setItem("MenuList",this.menuList);
        this.message.next(menuList);
        
    //   } else {
    //     this.swal('', 'Something went wrong.', 'error');
    //   }
    // },
    //   (error) => {
    //     console.log(error);
    //     this.swal('', 'Something went wrong.', 'error');
    //   });
  }



  setUserDetails(userObj){
    console.log("user details"+userObj);
    //console.log(userObj);
    this.message1.next(userObj);
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  private errorHandler(error) {
    this.message.next('Got an error')
  }

}
