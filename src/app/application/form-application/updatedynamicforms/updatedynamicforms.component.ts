import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { WebcommonservicesService } from 'src/app/services/form-services/webcommonservices.service';
import { ValidatorchecklistService } from 'src/app/services/form-services/validatorchecklist.service';
import { EncrypyDecrpyService } from 'src/app/services/form-services/encrypy-decrpy.service';
import { HttpClient } from '@angular/common/http';
//import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {Location} from '@angular/common';
//import { ChangeEvent } from '@ckeditor/ckeditor5-angular';
import Swal from 'sweetalert2';
import { CommonconfigService } from 'src/app/services/form-services/commonconfig.service';
import { FormApplyComponent } from '../form-apply/form-apply.component';
import { UpdateformapplyComponent } from '../updateformapply/updateformapply.component';

@Component({
  selector: 'app-updatedynamicforms',
  templateUrl: './updatedynamicforms.component.html',
  styleUrls: ['./updatedynamicforms.component.scss']
})
export class UpdatedynamicformsComponent implements OnInit {
  tablist:any;
  utillist:any;
  messaageslist:any;
  jsonurl="assets/js/_configs/dynamicform.config.json";

arrSelectedCheckbox:any[]=[];
  processId:any=0;
 cprocessid:any=0;
 formName:any;
 onlineServiceId:any=0;
 currSecId:any=0;
 foradmin:any='admin';
 formNames:any;
 @ViewChild(UpdateformapplyComponent, { static: false }) formapplyItems: UpdateformapplyComponent;
 sessiontoken:any;
 userRole:any;
 user1:any;
 id:any;
 hospitalName:any;
 stateName:any;
 districtName:any;
 mobile:any;
 emailid:any;
 hospitalCategoryName:any;
 intonlineserviceId:any;



  constructor(
    private router : ActivatedRoute,
    private WebCommonService : WebcommonservicesService ,
     public vldChkLst : ValidatorchecklistService ,
     public encDec : EncrypyDecrpyService,
     private route: Router,
     private httpClient: HttpClient,
     private commonService:CommonconfigService,
     private _location: Location,
     
    ) { 

      this.user1 = this.route.getCurrentNavigation().extras.state;
    }

  //constructor() { }

  

  ngOnInit(): void {
   
    // this.sessiontoken = sessionStorage.getItem('ADMIN_SESSION');
    // let SeetionParsed = JSON.parse(this.sessiontoken);
    // this.userRole = SeetionParsed.USER_ROLE;

    if(this.user1!=undefined){
      
        this.id=this.user1.hospitalCode
        this.hospitalName=this.user1.hospitalName
        this.stateName=this.user1.stateName
        this.districtName=this.user1.districtName
        this.mobile=this.user1.mobile
        this.emailid=this.user1.emailId
        this.hospitalCategoryName=this.user1.hospitalCategoryName
        this.intonlineserviceId=this.user1.intonlineserviceId


       
    }


    let schemeArr:any = [];
   
    this.router.paramMap.subscribe((params: ParamMap) => {
     // this.processId = +params.get('id');
      let encSchemeId = params.get('id')
  //  console.log(encSchemeId)
  if(encSchemeId != ""){
    let schemeStr = this.encDec.decText(encSchemeId);
     schemeArr = schemeStr.split(':');
     this.processId         = schemeArr[0];
     this.onlineServiceId   = schemeArr[1];
     this.currSecId         = schemeArr[2];

//console.log(schemeStr)

  }
      //this.processId =this.childprocessId;

      this.getForms(this.processId)
     
     });
  
  
    this.loadconfig();
  }


  loadconfig(){
    this.httpClient.get<any>(this.jsonurl).subscribe((data:any)=>
     {
      this.tablist=data[0].tabList;
      this.utillist=data[0].utils
      this.messaageslist=data[0].messages; 
      // if(! this.formID )
      // {
      // this.title = this.multilingual(data[0].pagetitle);
      // }
      // else{
      //   this.title = "Edit Manage Form";
      // }
      
     })
   }
   multilingual(test:any)
   {
   return test;
   }


 
   getForms(processid:any){
  
    let formParams = 
      {
      "moduleId": "",
      "processId":processid
       };
    
    this.commonService.getFormName(formParams).subscribe((res:any)=>{
    
      if(res.status == 200){
        this.formNames=res.result;
      
        if(this.formNames.length > 0){
         
         
          this.formName =this.formNames[0].vchProcessName;
        }
        
      }
      else{
       console.log(res.messages)
       }
       });
   }
  
   gotoPreview()
   {  
             let formParms  = this.processId+':'+0+':'+0;
             let encSchemeStr = this.encDec.encText(formParms.toString());
             this.route.navigate(['./application/dynamicForms',encSchemeStr]);
   }
   gotoview()
   {  
             let formParms  = this.processId+':'+0+':'+0;
             let encSchemeStr = this.encDec.encText(formParms.toString());
             this.route.navigate(['./application/dynamicFormsview',encSchemeStr]);
   }
   backClicked(){
    this._location.back();
  }


}