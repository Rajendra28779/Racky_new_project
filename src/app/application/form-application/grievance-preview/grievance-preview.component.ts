import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { WebcommonservicesService } from 'src/app/services/form-services/webcommonservices.service';
import { EncrypyDecrpyService } from 'src/app/services/form-services/encrypy-decrpy.service';
import {Location} from '@angular/common';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-grievance-preview',
  templateUrl: './grievance-preview.component.html',
  styleUrls: ['./grievance-preview.component.scss']
})
export class GrievancePreviewComponent implements OnInit {

  siteUrl = environment.siteURL;
  processId:any=0;
  onlineServiceId:any=0;
  dynamicpreviewDetails:any;
  formName:any;
  dynamicCtrlPreviewKeys:any=[];
  sectionwise=true;
  gridtype:any;
  btnShow:any=0;
  sessiontoken:any;
  status:any;
  profileid:any;
  loading = false;
  btnDisabledStatus=false;
  application: any;
  priority: any;
  trackData: any;
  noteingList: any;
  constructor(private router : ActivatedRoute,private WebCommonService : WebcommonservicesService,public encDec : EncrypyDecrpyService,private route: Router,
    private _location: Location,
    private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.sessiontoken = this.sessionService.decryptSessionData("WEB_SESSION");
    let SeetionParsed = JSON.parse(this.sessiontoken );

    //this.profileid=SeetionParsed.PROFILE_ID;
    let encSchemeId = this.router.snapshot.paramMap.get('id');
    let schemeArr:any = [];
    if(encSchemeId != ""){
      let schemeStr = this.encDec.decText(encSchemeId);
       schemeArr = schemeStr.split(':');
    }
    this.processId  = schemeArr[0];
    this.onlineServiceId =schemeArr[1];
    this.btnShow     = schemeArr[2];
    let ctrlParms = {
      'intProcessId': this.processId,
      'intOnlineServiceId' :this.onlineServiceId,
    }

    this.previewDynamicForm(ctrlParms);

  }

  previewDynamicForm(params:any)
  {
    this.loading=true;
    this.WebCommonService.previewDynamicForm(params).subscribe(res => {

      if(res.status == 200)
        {
          debugger;
          var serviceResult:any       = res.result
          this.gridtype               = serviceResult.tinGridType;
          this.dynamicpreviewDetails  = serviceResult.arrSecFormDetails;
          this.formName               = serviceResult.formName;
          this.application=res.result.application;
          this.priority=serviceResult.priorityType;
          
          let arrDynmCtrlKeys = Object.keys(serviceResult.arrSecFormDetails); // For Section sorting
          for(let secLoop of arrDynmCtrlKeys )
          {  //console.log(secLoop);
            if(secLoop=='sec_0')
            {
              this.dynamicCtrlPreviewKeys[0]  = secLoop;
              this.sectionwise = false;
              break;
            }
            this.dynamicCtrlPreviewKeys[Number(secLoop.split('_')[1])-1]  = secLoop;
          }
          if(this.dynamicCtrlPreviewKeys[0] == 'sec_0')
          {
            this.sectionwise = false;
          }
          this.loading=false;
        }
  });
  }

  applyForProcess()
  {
    this.btnDisabledStatus=true;
    this.loading=true;
   let params:any=
    {
      'intProcessId': this.processId,
      'intOnlineServiceId' :this.onlineServiceId,
      'profileID':0

    }
    this.WebCommonService.applyForProcess(params).subscribe(res => {
      this.btnDisabledStatus=false;
      if(res.status == 200)
        {
          this.loading=false;
          Swal.fire({
            icon: 'success',
            text: 'Registration Successful',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Ok'
          }).then((result) => {
            let formParms  = 142+':'+0+':'+0;
            let encSchemeStr = this.encDec.encText(formParms.toString());

            this.route.navigate(['/website/applicationSummary',encSchemeStr]);
         // this.route.navigate(['/website/servicelisting']);
          });
        }
        else if(res.status == 201)
          {
            this.loading=false;
            Swal.fire({
              icon: 'success',
              text: 'Resubmitted Successfully',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Ok'
            }).then((result) => {
              let formParms  = 142+':'+0+':'+0;
              let encSchemeStr = this.encDec.encText(formParms.toString());

              this.route.navigate(['/website/applicationSummary',encSchemeStr]);
           // this.route.navigate(['/website/servicelisting']);
            });
          }
  });

  }

  gotToPrev()
  {

    let formParms  = this.processId+':'+this.onlineServiceId+':'+0;

    console.log(this.onlineServiceId);
    let encSchemeStr = this.encDec.encText(formParms.toString());

    this.route.navigate(['/website/formapply',encSchemeStr]);

  }
  backClicked(){
    this._location.back();
  }
//   modalData(onlineServiceId:any,processId:any){

//      this.WebCommonService.getTrackStatus(onlineServiceId,processId).subscribe(res => {
    
//       if(res.status == 200)
//         {
//           this.trackData=res.data
//           this.noteingList=res.notingData
//           if(this.trackData !=null){
//             debugger
//             if(this.trackData.benificiaryName == 'null'){
//               this.trackData.benificiaryName='Hospital';
//             }
//           }
//   }
// });
//   }
}
