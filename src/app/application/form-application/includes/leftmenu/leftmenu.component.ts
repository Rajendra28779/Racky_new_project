import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
//import { EncrypyDecrpyService } from 'src/app/services/encrypy-decrpy.service';
import { Router } from '@angular/router';
import { CommonconfigService } from 'src/app/services/form-services/commonconfig.service';
import { EncrypyDecrpyService } from 'src/app/services/form-services/encrypy-decrpy.service';
import { WebcommonservicesService } from 'src/app/services/form-services/webcommonservices.service';
//import { WebcommonservicesService } from '../../../website/websiteservices/webcommonservices.service';
//import { CommonconfigService } from '../../../services/commonconfig.service';

@Component({
  selector: 'app-leftmenu',
  templateUrl: './leftmenu.component.html',
  styleUrls: ['./leftmenu.component.scss']
})
export class LeftmenuComponent implements OnInit {
  siteUrl = environment.siteURL;
  currentYear: number = new Date().getFullYear();
  arrAllFormDetails:any;
  moduleNames:any;
  txtModuleId:any;
  formNames:any;
 
menulist:any;
  constructor(
    private WebCommonService: WebcommonservicesService ,
  
    private commonService:CommonconfigService,
     private router :Router,
    
     public encDec : EncrypyDecrpyService
  ) { }

  ngOnInit(): void {
   
  
   this.getModFormName()
  }
  // navigatetopage(mid:any){
  //   this.router.navigate(['/admin/configuration/dynamicForms',mid]);
  // }

   getModFormName(){
  
    let formParams = 
      {
        "adminApplication":"",
        "websiteApplication":""
       };
    
    this.commonService.getModFormName(formParams).subscribe((res:any)=>{
    
      if(res.status == 200){
        this.menulist=res.result;

      }
      else{
       console.log(res.messages)
       }
       });
   }
}
