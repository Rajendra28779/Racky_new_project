import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as $ from 'jquery';
//import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { AuthService } from 'src/app/services/form-services/auth.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  siteUrl = environment.siteURL;
  decrypted: any;
  secretCode = " ";
  sessiontoken:any;
username:any;
  constructor(private authService: AuthService, private router: Router) { }

 notificationsec = document.getElementsByClassName("notification-sec"); 




  ngOnInit(): void {
    if (localStorage.getItem('theme') === 'theme-dark') {
      this.setTheme('theme-dark');
      $('#slider').prop("checked", true)
    
  } else {
      this.setTheme('theme-light');
      $('#slider').prop("checked", false)
  }






this.sessiontoken = sessionStorage.getItem('ADMIN_SESSION'); 
let SeetionParsed = JSON.parse(this.sessiontoken ); 
 
this.username=SeetionParsed.USER_NAME;


}

  notificationOpen(){
   $(this.notificationsec).toggleClass("active");
  }
 
  divclose(){
    $(this.notificationsec).toggleClass("active");
  }
  
  setTheme(themeName:any) {
    localStorage.setItem('theme', themeName);
    document.documentElement.className = themeName;
  }
  // function to toggle between light and dark theme
  toggleTheme() {
  
  if (localStorage.getItem('theme') === 'theme-dark') {
      this.setTheme('theme-light');
  } else {
      this.setTheme('theme-dark');
  }
  }
  togglemenu(){


    $(".nav-toggle-btn").toggleClass("on");
    $('.page-container').toggleClass("display-full");
    $('.sidemenu').toggleClass("active");
   $('.fixed-topmenu').toggleClass("active");
  }

  logout(){

    this.authService.logout();
    
    this.router.navigateByUrl('/admin/login');
    
    }
}
