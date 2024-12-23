import { Component, OnInit } from '@angular/core';
declare let $: any;

@Component({
  selector: 'app-appsidebar',
  templateUrl: './appsidebar.component.html',
  styleUrls: ['./appsidebar.component.scss']
})
export class AppsidebarComponent implements OnInit {
  isHospital: boolean = false;
  isCpd: boolean = false;
  isSna: boolean = false;
  isAdmin: boolean = false;
  isDc:boolean=false;
  isMISREport: boolean = false;
  constructor() { }

  ngOnInit(): void {
    let user = JSON.parse(sessionStorage.getItem("user"));
    let groupId = user.groupId;
    if (groupId == 5) {
      this.isHospital = true;
      this.isAdmin = false;
      this.isMISREport = true;
    } else if (groupId == 3) {
      this.isCpd = true;
      this.isAdmin = false;
    } else if (groupId == 4) {
      this.isSna = true;
      this.isAdmin = false;
    }else if(groupId == 6){
      this.isDc=true;
      this.isAdmin = false;
    }
     else if (groupId == 1) {
      // this.isHospital = true; 
      // this.isCpd = true; 
      // this.isSna = true;
      this.isAdmin = true; 
     }
    // }else if(groupId == 7){
    //   this.isMISREport = true;
    // }
    $(".scrollsidebar").mCustomScrollbar({
      theme: "minimal"
    });
  }

}
