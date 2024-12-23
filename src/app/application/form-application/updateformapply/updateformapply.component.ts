// import { Component, OnInit } from '@angular/core';
import { Component, ComponentFactoryResolver, OnInit, Input, Output,EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute,NavigationExtras,Router} from '@angular/router';
import Swal from 'sweetalert2';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { environment } from 'src/environments/environment';
// import { ChangeEvent } from '@ckeditor/ckeditor5-angular';
// import { AlertService } from 'src/app/services/alert.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WebcommonservicesService } from 'src/app/services/form-services/webcommonservices.service';
import { ValidatorchecklistService } from 'src/app/services/form-services/validatorchecklist.service';
import { EncrypyDecrpyService } from 'src/app/services/form-services/encrypy-decrpy.service';
import { CommonconfigService } from 'src/app/services/form-services/commonconfig.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-updateformapply',
  templateUrl: './updateformapply.component.html',
  styleUrls: ['./updateformapply.component.scss']
})
export class UpdateformapplyComponent implements OnInit {
  @Input() fromadmin: any;
  arrSelectedCheckbox:any[]=[];
  processId:any=0;
  dynamicCtrlDetails:any=[];
  dynamicCtrlDetKeys:any =[];
  ctrlarray:any;
  currSecTabKey:any=0;
  currSecId:any=0;
  valid:any=0;
  loading = false;
  onlineServiceId:any=0;
  formName:any='';
  arralldynVal:any[]=[];
  arrallCascadingDetails:any[]=[];
  prevdipStatus:any='d-none';
  // editor:any = ClassicEditor;
  // ckEdtorCls=environment.ckEdiorClass;
  arrckEdtorVal:any[]=[];
  arrUploadedFiles:any[]=[];
  arrDeletedUploadedFiles:any=[];
  secDisable:any=true;
  arrCalcFields:any[]=[];
  arrAddmoreDetails:any[]=[];
  arrAddmoreFilledData:any[]=[];
  arrAddmoreElemntKeys:any[]=[];
  tempurl=environment.tempUrl;
  arrAddMoreEditData:any=[];
  editIndex:any='';
  storagePath:any=environment.baseUrl+'/downloadForm/';
  //storagePath:any=environment.baseUrl+'storage/app/uploads/';
  btnSaveNextDisableStatus=false; // if false then btn is enabled else disabled
  profileId:any =0;
  private _location: any;
  sessiontoken:any;
  profileid:any=0;
  appserviceid:any;
  loginType:any;
 adminsessiontoken:any;
adminuserid:any;
// === ifsc Code === //
@ViewChild('someModal') someModalRef:ElementRef;
ifscdistrictname:any='0';
ifscbankname:any='0';
error: any;
 DistrictNames: any;
  BankNames: any;
  ifscForm: any;
  Banks: any;
  siteURL = environment.siteURL;
  apiUrl=environment.apiUrl;
  ifscSubmitted = false;
  isIFSCFlag = false;
// === ifsc Code === //
arrallStaticDependtDetails:any=[];
arrCascadingBindDependtDetails:any=[];

constructor(private router : ActivatedRoute,private WebCommonService : WebcommonservicesService , public vldChkLst : ValidatorchecklistService ,public encDec : EncrypyDecrpyService,private route: Router,
  private modalService: NgbModal,
  private commonService:CommonconfigService
  ) { }



  ngOnInit(): void {

    this.sessiontoken = sessionStorage.getItem('WEB_SESSION');
    this.removeMandetory();


 this.adminsessiontoken=sessionStorage.getItem('user');
 let adminsession=JSON.parse(this.adminsessiontoken)
    let SeetionParsed = JSON.parse(this.sessiontoken );
    this.adminuserid=adminsession.groupId;
    console.log(this.adminuserid);

    if(SeetionParsed!=null)
    {
      this.profileid=SeetionParsed.PROFILE_ID;
  this.appserviceid=SeetionParsed.SERVICEID;
  this.loginType = SeetionParsed.LOGINTYPE;
    }


//  console.log();
   // console.log(this.profileid);

    this.secDisable   = false;
    let schemeArr:any = [];
    let encSchemeId = this.router.snapshot.paramMap.get('id');
    if(this.loginType == 'applicant' )
    {
      if(encSchemeId != ""){
        let schemeStr = this.encDec.decText(encSchemeId);
       // console.log(schemeStr);
         schemeArr = schemeStr.split(':');
         this.profileId         = this.profileid;
         this.processId         = schemeArr[0];
         this.onlineServiceId   = this.appserviceid;
         this.currSecId         = (schemeArr[3] == undefined) ? 0: schemeArr[3];

      }
      else{

      }
    }


    else  //For Admin
    {
      if(encSchemeId != ""){
        let schemeStr = this.encDec.decText(encSchemeId);
       // console.log(schemeStr);
         schemeArr = schemeStr.split(':');
         this.processId         = schemeArr[0];
         this.onlineServiceId   = schemeArr[1];
         this.currSecId         = (schemeArr[2] == undefined) ? 0: schemeArr[2];
         this.profileId         = (schemeArr[3] == undefined) ? 0: schemeArr[3];
      }
      console.log(this.profileId);
    }

    let dynSchmCtrlParms = {
      'intProcessId': this.processId,
      'intOnlineServiceId' :this.onlineServiceId,
      'sectionId'          :this.currSecId,
      'profileId'          :this.profileId
    }
  //  console.log(dynSchmCtrlParms)
  this.loading=true;
    this.loadDynamicCtrls(dynSchmCtrlParms);
    setTimeout(()=>{                           // <<<---using ()=> syntax
      this.loading=false;
  }, 2000);


  }



  setHtmlData(data:any)
  {
    return this.encDec.decodeHtml(data);
  }
  downlord:any;
  loadDynamicCtrls(dynSchmCtrlParms:any)
  {
    // console.log(dynSchmCtrlParms);

     this.WebCommonService.schemeDynCtrl(dynSchmCtrlParms).subscribe(res => {
       this.loading=true;
      if(res.status == 200)
        {
          // console.log(res.result);
          this.removeMandetory();
          this.downlord=res.result;
          this.dynamicCtrlDetails = res.result;
          this.formName           = res.formName;
          let arrDynmCtrlKeys = Object.keys(this.dynamicCtrlDetails);
          for(let secLoop of arrDynmCtrlKeys )
          {
            if(secLoop=='sec_0')
            {
              this.dynamicCtrlDetKeys[0]  = secLoop;
              break;

            }

            this.dynamicCtrlDetKeys[Number(secLoop.split('_')[1])-1]  = secLoop;
          }

         setTimeout(() => {
          this.loadDynamicValue();
        }, 4000);
        setTimeout(() => {
          if(this.onlineServiceId>0)
          {
          let dynBindType:any = document.querySelectorAll("[data-dynbindflag=true],.bind_block,.bind_district");
              for(let dynbndtype of dynBindType)
                {
                  if(dynbndtype.id == 'ctrl_02222023031618')
                    {

                    }
                 // ctrl_02222023031618
                  //formctrls.ctrlClass=='bind_block'
                console.log(dynbndtype);

                 // console.log();
                //  formctrls.ctrlClass=='bind_district'
                  let dynCtrlId         = dynbndtype.getAttribute('data-id');
                  let dataTypeID        = dynbndtype.getAttribute('data-typeid');
                  // let dynbindconditions = this.arrallCascadingDetails[dynCtrlId].ctrlCCDConditions;
                  // let dynbindtbl        = this.arrallCascadingDetails[dynCtrlId].ctrlCCDTableName;
                  // let dynbindtxtclmname = this.arrallCascadingDetails[dynCtrlId].ctrlCCDTextColumnName;
                  // let dynbinddependflag = dynbndtype.getAttribute('data-dynbinddependflag');
                  // let dynbindvalclmn    = this.arrallCascadingDetails[dynCtrlId].ctrlCCDValueColumnName;


                 // ctrl_02222023031618


                  if( dynbndtype.classList.contains('bind_district') )
                  {

                    //dynbndtype.classList.contains('bind_block') ||
                    var event = new Event('change');
                    dynbndtype.dispatchEvent(event);
                  //  changeblock($event)
                 //   continue;

                    continue;
                  }
                  this.loadDynDepend(dynCtrlId,dataTypeID);
                  // continue;
                  // console.log(this.arrallCascadingDetails[dynCtrlId]);
                  // if(dynbinddependflag == 'true')
                  //   {
                  //   let parms             = {
                  //     'tableName'          : dynbindtbl,
                  //     'columnName'         : dynbindtxtclmname+','+dynbindvalclmn,
                  //     'condition'          : dynbindconditions
                  //   }
                  //   console.log(parms);
                  //   this.dynmaicValApi(parms,dynCtrlId);
                  // }
                }
              }
        },11000);
          setTimeout(() => {
            this.loadDependCtrls();
            this.setCalcFields();
            if(this.onlineServiceId>0)
            {


// For Edit Case of Dependend Fields

let prntIds:any = document.querySelectorAll("[data-dependctrlId]");
for(let prntDet of prntIds)

{

  let prntDetFields = prntDet.getAttribute('data-dependctrlId');

  if(prntDet.getAttribute('data-dependctrlId')!= 0)

    {

      let parentDetailsElements:any = document.getElementsByName(prntDetFields);




      for(let loopOfParendetails of parentDetailsElements)

        {

          let dependntTypeID  = loopOfParendetails.getAttribute('data-typeid');

      //console.log(dependntTypeID);

          if(dependntTypeID == 5)

          {

            if(loopOfParendetails.checked==true)

            {

              this.loadDependchkBoxDetails(loopOfParendetails);

            }

          }

          else if(dependntTypeID == 6)

          {

          if(loopOfParendetails.checked==true)

          {

          loopOfParendetails.click();

          }

        }

        else if(dependntTypeID == 3)

        {

          var event = new Event('change');

          loopOfParendetails.dispatchEvent(event);

        }



        }



    }





}

                // For Edit Case of Dependend Fields
         /*    let prntIds:any = document.querySelectorAll("[data-parentflag=true]");

              for(let prntDet of prntIds)
              {
                let dependntTypeID  = prntDet.getAttribute('data-typeid');
                if(dependntTypeID == 5)
                {
                  if(prntDet.checked==true)
                  {
                    this.loadDependchkBoxDetails(prntDet);
                   // prntDet.innerHTML = true;
                  // prntDet.click();
                   // prntDet.click();
                  }
                }
                else if(dependntTypeID == 6)
                {
                if(prntDet.checked==true)
                {
                 prntDet.click();
                }
               }
               else if(dependntTypeID == 3)
               {
                var event = new Event('change');
                prntDet.dispatchEvent(event);
               }
            }*/
            }
            this.loading=false;
          }, 5000);


          if(this.currSecTabKey == 0 && this.currSecId ==0)
          {
              this.currSecTabKey      = this.dynamicCtrlDetKeys[0];

              this.currSecId          = this.dynamicCtrlDetails[this.currSecTabKey]['sectionid'];
          }
        }
  });


  
  }


  storeCasDetials(cascadingDetails:any,id:any)
  {
     this.arrallCascadingDetails[id] = cascadingDetails;

  }
  curSelectedSec(sectionKey:any)
  {

    this.loading=true;

    this.currSecTabKey = sectionKey;
    this.currSecId     = this.dynamicCtrlDetails[sectionKey]['sectionid']
    let dynSchmCtrlParms = {
      'intProcessId': this.processId,
      'sectionId'   : this.currSecId,
      'intOnlineServiceId' :this.onlineServiceId
    }
      this.loadDynamicCtrls(dynSchmCtrlParms);
      setTimeout(()=>{                           // <<<---using ()=> syntax
        this.loading=false;
    }, 2000);

  }


  /*loadDependCtrls()
  {

    let prntIds:any = document.querySelectorAll("[data-parentflag=true]");

    for(let prntDet of prntIds)
    {
      let dependntTypeID  = prntDet.getAttribute('data-typeid');
      if(dependntTypeID ==6 || dependntTypeID ==5) // For Radio and checkbox
        {
          let id  = prntDet.name;
          let chldDetls :any =  document.querySelectorAll("[data-dependctrlId="+id+"]");
          prntDet.addEventListener('click', ()=>{
            for (let loopChldDet of chldDetls)
            {
              let lopdependval = loopChldDet.getAttribute('data-dependentvalue');
              if(prntDet.value == lopdependval)
              {
                loopChldDet.closest(".dynGridCls").classList.remove('d-none');
                loopChldDet.closest(".dynGridCls").querySelector('.dynlabel').classList.remove('d-none');
                loopChldDet.classList.remove('d-none');
                // loopChldDet.closest(".control-holder").querySelector('.form-group').classList.remove('d-none');

                    let lblEmnt = (<HTMLInputElement>document.getElementById(loopChldDet.id)).nextElementSibling;
                    lblEmnt?.classList.remove('d-none');


              }
              else
              {
                loopChldDet.closest(".dynGridCls").classList.add('d-none');
                loopChldDet.closest(".dynGridCls").querySelector('.dynlabel').classList.add('d-none');
                loopChldDet.classList.remove('d-none');
                loopChldDet.classList.add('d-none');
                    let lblEmnt = (<HTMLInputElement>document.getElementById(loopChldDet.id)).nextElementSibling;
                    lblEmnt?.classList.add('d-none');
                let tpId   = loopChldDet.getAttribute('data-typeid');
                if(tpId == 2)
                {
                  (<HTMLInputElement>document.getElementById(loopChldDet.id)).value='';
                }
                else if(tpId == 3)
                {
                  (<HTMLInputElement>document.getElementById(loopChldDet.id)).value='0';
                }

              }
            }
          });

        }

            else // For Dropdown
            {
            let chldDetls :any =  document.querySelectorAll("[data-dependctrlId="+prntDet.id+"]");
            prntDet.addEventListener('change', ()=>{
              for (let loopChldDet of chldDetls)
              {
                let lopdependval = loopChldDet.getAttribute('data-dependentvalue');
                if(prntDet.value == lopdependval)
                {
                  loopChldDet.closest(".dynGridCls").classList.remove('d-none');
                  loopChldDet.closest(".dynGridCls").querySelector('.dynlabel').classList.remove('d-none');
                  // loopChldDet.closest(".control-holder").querySelector('.form-group').classList.remove('d-none');
                  loopChldDet.classList.remove('d-none');

                  if(loopChldDet.getAttribute('data-typeid') == 6 || loopChldDet.getAttribute('data-typeid') == 5)
                  {
                    let lblEmnt = (<HTMLInputElement>document.getElementById(loopChldDet.id)).nextElementSibling;
                    lblEmnt?.classList.remove('d-none')

                  }

                }
                else
                {
                  loopChldDet.closest(".dynGridCls").classList.add('d-none');
                  loopChldDet.closest(".dynGridCls").querySelector('.dynlabel').classList.add('d-none');

                  // loopChldDet.closest(".control-holder").querySelector('.form-group').classList.add('d-none');
                  loopChldDet.classList.add('d-none');
                  if(loopChldDet.getAttribute('data-typeid') == 6 || loopChldDet.getAttribute('data-typeid') == 5)
                  {
                    let lblEmnt = (<HTMLInputElement>document.getElementById(loopChldDet.id)).nextElementSibling;
                    lblEmnt?.classList.add('d-none');
                  }

                  let tpId   = loopChldDet.getAttribute('data-typeid');
                  if(tpId == 2)
                  {
                    (<HTMLInputElement>document.getElementById(loopChldDet.id)).value='';
                  }
                  else if(tpId == 3)
                  {
                    (<HTMLInputElement>document.getElementById(loopChldDet.id)).value='0';
                  }

                }

              }

            });

          }

    }

  }*/

  loadDependCtrls()

  {



    let prntIds:any = document.querySelectorAll("[data-parentflag]");

  // let prntIds:any = document.querySelectorAll("[data-dependctrlId]")




    for(let prntDet of prntIds)

    {

      let dependntTypeID  = prntDet.getAttribute('data-typeid');



      // if(prntDet.getAttribute('data-dependflagstatus') == 'false')

      // {

      //   continue;

      // }
      //console.log(dependntTypeID)
      if(dependntTypeID ==6 || dependntTypeID ==5) // For Radio and checkbox

        {

          let id  = prntDet.name;



          let chldDetls :any =  document.querySelectorAll("[data-dependctrlId="+id+"]");

          prntDet.addEventListener('click', ()=>{

            for (let loopChldDet of chldDetls)

            {

              let lopdependval = loopChldDet.getAttribute('data-dependentvalue');

              if(lopdependval.includes(prntDet.value))
               {

                if(prntDet.checked)

                  {

                    loopChldDet.closest(".dynGridCls").classList.remove('d-none');

                    loopChldDet.closest(".dynGridCls").querySelector('.dynlabel').classList.remove('d-none');


                    loopChldDet.classList.remove('d-none');

                // loopChldDet.closest(".control-holder").querySelector('small').classList.remove('d-none');



                    let lblEmnt = (<HTMLInputElement>document.getElementById(loopChldDet.id)).nextElementSibling;

                    lblEmnt?.classList.remove('d-none');




                   }

                    else

                    {

                      loopChldDet.closest(".dynGridCls").classList.add('d-none');

                      loopChldDet.closest(".dynGridCls").querySelector('.dynlabel').classList.add('d-none');

                      loopChldDet.classList.remove('d-none');

                      loopChldDet.classList.add('d-none');

                          let lblEmnt = (<HTMLInputElement>document.getElementById(loopChldDet.id)).nextElementSibling;

                          lblEmnt?.classList.add('d-none');

                      let tpId   = loopChldDet.getAttribute('data-typeid');

                      if(tpId == 2)

                      {



                        (<HTMLInputElement>document.getElementById(loopChldDet.id)).value='';

                      }

                      else if(tpId == 3)

                      {

                        (<HTMLInputElement>document.getElementById(loopChldDet.id)).value='0';

                      }




                      else if(tpId ==4)

                        {

                          let elmle:any      = (<HTMLInputElement>document.getElementById(loopChldDet.id));

                          elmle.options[elmle.selectedIndex].text = '';



                        }

                      else if(tpId ==5 || tpId ==6)

                      {

                        let chckboxClear:any   =(document.getElementsByName(loopChldDet.id));

                        for(let dynrdobndtype of chckboxClear)

                        {

                          if(dynrdobndtype.checked)

                          {

                            dynrdobndtype.checked = false;

                          }



                        }

                      }




                      else

                      {



                        (<HTMLInputElement>document.getElementById(loopChldDet.id)).value
= '';

                        document.getElementById('fileDownloadDiv_'+loopChldDet.id)?.querySelector('.downloadbtn')?.setAttribute('href','');

                        document.getElementById('fileDownloadDiv_'+loopChldDet.id)?.classList.add('d-none');

                        delete this.arrUploadedFiles[loopChldDet.id];

                      }



                    }





              }

             else if(dependntTypeID==6)

              {

                loopChldDet.closest(".dynGridCls").classList.add('d-none');

                loopChldDet.closest(".dynGridCls").querySelector('.dynlabel').classList.add('d-none');

                loopChldDet.classList.remove('d-none');

                loopChldDet.classList.add('d-none');

                    let lblEmnt = (<HTMLInputElement>document.getElementById(loopChldDet.id)).nextElementSibling;

                    lblEmnt?.classList.add('d-none');

                    let tpId   = loopChldDet.getAttribute('data-typeid');

                    if(tpId == 2)

                    {

                      (<HTMLInputElement>document.getElementById(loopChldDet.id)).value='';

                    }

                    else if(tpId == 3)

                    {

                      (<HTMLInputElement>document.getElementById(loopChldDet.id)).value='0';

                    }

                    else if(tpId ==4)

                      {

                        let elmle:any      = (<HTMLInputElement>document.getElementById(loopChldDet.id));

                        elmle.options[elmle.selectedIndex].text = '';

                      }

                    else if(tpId ==5 || tpId ==6)

                    {

                      let chckboxClear:any   =(document.getElementsByName(loopChldDet.id));

                      for(let dynrdobndtype of chckboxClear)

                      {

                        if(dynrdobndtype.checked)

                        {

                          dynrdobndtype.checked = false;

                        }



                      }

                    }




                    else

                    {



                      (<HTMLInputElement>document.getElementById(loopChldDet.id)).value
= '';

                      document.getElementById('fileDownloadDiv_'+loopChldDet.id)?.querySelector('.downloadbtn')?.setAttribute('href','');

                      document.getElementById('fileDownloadDiv_'+loopChldDet.id)?.classList.add('d-none');

                      delete this.arrUploadedFiles[loopChldDet.id];

                    }

              }










            }

          });



        }



            else // For Dropdown

            {

            let chldDetls :any =  document.querySelectorAll("[data-dependctrlId="+prntDet.id+"]");

            prntDet.addEventListener('change', ()=>{



              for (let loopChldDet of chldDetls)

              {

                let lopdependval = loopChldDet.getAttribute('data-dependentvalue');

                if(lopdependval.includes(prntDet.value))

                {

                  loopChldDet.closest(".dynGridCls").classList.remove('d-none');

                  loopChldDet.closest(".dynGridCls").querySelector('.dynlabel').classList.remove('d-none');

                  // loopChldDet.closest(".control-holder").querySelector('small').classList.remove('d-none');

                  loopChldDet.classList.remove('d-none');




                  if(loopChldDet.getAttribute('data-typeid') == 6 || loopChldDet.getAttribute('data-typeid')
== 5)

                  {

                    let lblEmnt = (<HTMLInputElement>document.getElementById(loopChldDet.id)).nextElementSibling;

                    lblEmnt?.classList.remove('d-none')



                  }




                }

                else

                {

                  loopChldDet.closest(".dynGridCls").classList.add('d-none');

                  loopChldDet.closest(".dynGridCls").querySelector('.dynlabel').classList.add('d-none');



                  // loopChldDet.closest(".control-holder").querySelector('small').classList.add('d-none');

                  loopChldDet.classList.add('d-none');

                  if(loopChldDet.getAttribute('data-typeid') == 6 || loopChldDet.getAttribute('data-typeid')
== 5)

                  {

                    let lblEmnt = (<HTMLInputElement>document.getElementById(loopChldDet.id)).nextElementSibling;

                    lblEmnt?.classList.add('d-none');

                  }




                  let tpId   = loopChldDet.getAttribute('data-typeid');

                      if(tpId == 2)

                      {



                        (<HTMLInputElement>document.getElementById(loopChldDet.id)).value='';

                      }

                      else if(tpId == 3)

                      {

                        (<HTMLInputElement>document.getElementById(loopChldDet.id)).value='0';

                      }




                      else if(tpId ==4)

                        {

                          let elmle:any      = (<HTMLInputElement>document.getElementById(loopChldDet.id));

                          elmle.options[elmle.selectedIndex].text = '';



                        }

                      else if(tpId ==5 || tpId ==6)

                      {

                        let chckboxClear:any   =(document.getElementsByName(loopChldDet.id));

                        for(let dynrdobndtype of chckboxClear)

                        {

                          if(dynrdobndtype.checked)

                          {

                            dynrdobndtype.checked = false;

                          }



                        }

                      }




                      else

                      {

                        (<HTMLInputElement>document.getElementById(loopChldDet.id)).value
= '';

                        document.getElementById('fileDownloadDiv_'+loopChldDet.id)?.querySelector('.downloadbtn')?.setAttribute('href','');

                        document.getElementById('fileDownloadDiv_'+loopChldDet.id)?.classList.add('d-none');

                        delete this.arrUploadedFiles[loopChldDet.id];

                      }




                }




              }




            });




          }




    }




  }

  loadDynamicValue(){
    let dynBindType:any = document.querySelectorAll("[data-dynbindFlag=true]");
    console.log(dynBindType);
    for(let dynbndtype of dynBindType)
    {
      let dynCtrlId         = dynbndtype.getAttribute('data-id');
      let dynbindconditions = this.arrallCascadingDetails[dynCtrlId].ctrlCCDConditions;
      let dynbindtbl        = this.arrallCascadingDetails[dynCtrlId].ctrlCCDTableName;
      let dynbindtxtclmname = this.arrallCascadingDetails[dynCtrlId].ctrlCCDTextColumnName;
      let dynbinddependflag = dynbndtype.getAttribute('data-dynbinddependflag');
      let dynbindvalclmn    = this.arrallCascadingDetails[dynCtrlId].ctrlCCDValueColumnName;
      if(dynbinddependflag == 'false') // if not dependent on parent
        {
        let parms             = {
          'tableName'          : dynbindtbl,
          'columnName'         : dynbindtxtclmname+','+dynbindvalclmn,
          'condition'          : dynbindconditions
        }
        this.dynmaicValApi(parms,dynCtrlId);
      }
    }

  }
  dynmaicValApi(params:any,dynbindCtrlId:any)
  {
    this.WebCommonService.loadDynamicBindDetails(params).subscribe(res => {

     if(res.status == 200)
       {
        this.arralldynVal[dynbindCtrlId] = res.result;
       }
 });
  }

  loadDynDepend(ctrlId:any,typeId:any=0)
  {

    let dynBindType:any;
    let dynBndVal:any;
    if(typeId == 5 || typeId == 6 )
    {
       dynBindType   =(document.getElementsByName(ctrlId));
       for(let dynrdobndtype of dynBindType)
       {
         if(dynrdobndtype.checked)
         {
          dynBndVal = dynrdobndtype.value;
          break;
         }

       }

    }
    else
    {
       dynBindType  =(<HTMLInputElement>document.getElementById(ctrlId));
       dynBndVal = dynBindType.value


    }

      let dynbindvalclmn    = this.arrallCascadingDetails[ctrlId].ctrlCCDValueColumnName;
      let bnddpndfld:any    = document.querySelectorAll("[data-dynbinddependctlfldid="+ctrlId +"]");
      let bindconditions    = (dynbindvalclmn+'='+"'"+dynBndVal+"'");
      console.log(bnddpndfld);
      for(let dynbndtype of bnddpndfld)
      {
        let dynCtrlId         = dynbndtype.getAttribute('data-id');
        let dynbindconditions = this.arrallCascadingDetails[dynCtrlId].ctrlCCDConditions;
        let dynfnlBind        =  '';

        if(dynbindconditions.length > 0 )
          {
            
            dynfnlBind   = "'"+dynbindconditions+"'" + ' and ';
            //dynfnlBind   = dynbindconditions + ' and ';
          }
          // if('ctrl_02222023031618'==ctrlId)
          //     {
          //       console.log(bindconditions);
          //     }
          dynfnlBind+=bindconditions;

        if(dynbndtype.getAttribute('data-dynbinddependflag') == 'true')
        {
        let parms             = {
          'tableName'          : this.arrallCascadingDetails[dynCtrlId].ctrlCCDTableName,
          'columnName'         : this.arrallCascadingDetails[dynCtrlId].ctrlCCDTextColumnName+','+ this.arrallCascadingDetails[dynCtrlId].ctrlCCDValueColumnName,
          'condition'          : dynfnlBind
        }

        this.dynmaicValApi(parms,dynCtrlId)
      }
    }

  }


  doSchemeApply()
  {
    let schemeWiseFormDetails =  this.dynamicCtrlDetails[this.currSecTabKey]['formDetails'];
    const formData = new FormData();
    let uploadFile:any;
    let validatonStatus  = true;
    let validateArray: any[]    =[];
    let arrJsnTxtDet:any = [];
    for(let schemeWiseFormCtr of schemeWiseFormDetails )
    {
      let arrAddMoreElement:any='';
      let ctrlTypeId      = schemeWiseFormCtr.ctrlTypeId;
      let elmVal          = '';
      let elmValText:any      = '';
      let elmId           = schemeWiseFormCtr.ctrlId;
      let elmName         = schemeWiseFormCtr.ctrlName;
      let lblName         =  schemeWiseFormCtr.ctrlLabel;
      let mandatoryDetails = schemeWiseFormCtr.ctrlMandatory;
      let attrType        = schemeWiseFormCtr.ctrlAttributeType;
      let ctrlMaxLength   = schemeWiseFormCtr.ctrlMaxLength;
      let ctrlMinLength   = schemeWiseFormCtr.ctrlMinLength;
      let elmClass        = schemeWiseFormCtr.ctrlClass;
      let addMoreElementData = '';
      if(ctrlTypeId == 2) // For Textbox
      {
        if(schemeWiseFormCtr['dependctrlDetails'][0]['ctrlChkDepend'])
        {
          let dependElemId        = schemeWiseFormCtr['dependctrlDetails'][0]['ctrlSelDependParent'];
          let dependElemdCondVal  = schemeWiseFormCtr['dependctrlDetails'][0]['ctrlSelDependValue'];

          let dependElemVal

          if(validateArray[dependElemId] == undefined)

            {

              continue;

            }

          if(validateArray[dependElemId]['ctrlTypeId'] == 6 || validateArray[dependElemId]['ctrlTypeId']
== 5)

          {

            let depndAllSelectElementValues:any=[];

            let dependElem:any  = document.getElementsByName(dependElemId);




             for(let i of dependElem)
             {



               if(i.checked)

               {

                depndAllSelectElementValues.push(i.value);



               }



             }

// console.log(dependElemdCondVal);
// console.log(depndAllSelectElementValues);
//             var compareDpndFields = dependElemdCondVal.filter(function(obj:any)
// {

//               return depndAllSelectElementValues.indexOf(obj) !== -1;

//           });

            if(!depndAllSelectElementValues.includes(dependElemdCondVal))

              {

                continue;

              }








          }

          else

          {

            dependElemVal       = (<HTMLInputElement>document.getElementById(dependElemId)).value;

            if(!dependElemdCondVal.includes(dependElemVal))

            {

              continue;

            }

          }





        }
        elmVal   = (<HTMLInputElement>document.getElementById(elmId)).value;

        if(mandatoryDetails && this.valid !=1 && elmClass =='valid' ) // For Mandatory
        {

          if(!this.vldChkLst.blankCheck(elmVal,lblName+' can not be left blank'))
          {
            validatonStatus =  false;
          break;
          }

        }
        else if(mandatoryDetails && this.valid !=1 && elmClass =='acclev'){
          if(!this.vldChkLst.blankCheck(elmVal,lblName+' can not be left blank'))
          {
            validatonStatus =  false;
          break;
          }
        }
        else if(mandatoryDetails && this.valid !=1 && elmClass =='accnum'){
          if(!this.vldChkLst.blankCheck(elmVal,lblName+' can not be left blank'))
          {
            validatonStatus =  false;
          break;
          }
        }

        else if(mandatoryDetails && elmClass !='valid' &&  elmClass !='acclev'  &&  elmClass !='accnum') // For Mandatory

          {



            if(!this.vldChkLst.blankCheck(elmVal,lblName+' can not be left blank'))

            {

              validatonStatus =  false;

            break;

            }

          }

        
        
        
        

        // if(mandatoryDetails) // For Mandatory
        // {
        //  // console.log("elmval "+elmVal+" lblName "+lblName);
        //   if(!this.vldChkLst.blankCheck(elmVal,lblName+' can not be left blank'))
        //   {
            
        //     validatonStatus =  false;
        //     // console.log("elmval "+elmVal+"lblName "+lblName);
        //   break;
        //   }

        // }
        if(elmClass=='valid')

        {

          if(!this.functionValiduptoo(elmClass,elmVal))

            {

              validatonStatus =  false;

              break;

            }




        }




        if(ctrlMaxLength!='') // For Max length
        {
          if(!this.vldChkLst.maxLength(elmVal,ctrlMaxLength,lblName))
          {
            validatonStatus =  false;
            break;
          }
        }

        if(ctrlMinLength!='')// For Min length
        {
          if(!this.vldChkLst.minLength(elmVal,ctrlMinLength,lblName))
          {
            validatonStatus =  false;
             break;
          }

        }

        if(attrType == 'email') // For Valid Email
          {
            if(!this.vldChkLst.validEmail(elmVal))
            {
              validatonStatus =  false;
               break;
            }

          }

          else if(attrType == 'telephone') // For Valid Mobile
          {
            if(!this.vldChkLst.validMob(elmVal))
            {
              validatonStatus =  false;
               break;
            }

          }

          else if(attrType == 'password') // For password Validation
          {
            if(!this.vldChkLst.validPassword(elmVal))
            {
              validatonStatus =  false;
              break;
            }

          }

      }

      else if(ctrlTypeId == 3) // For DropDown
      {
        let elm:any      = (<HTMLInputElement>document.getElementById(elmId));
        elmVal           = elm.value;
        elmValText        = elm.options[elm.selectedIndex].text;

        if(schemeWiseFormCtr['dependctrlDetails'][0]['ctrlChkDepend'])
        {

          let dependElemId        = schemeWiseFormCtr['dependctrlDetails'][0]['ctrlSelDependParent'];
          let dependElemdCondVal  = schemeWiseFormCtr['dependctrlDetails'][0]['ctrlSelDependValue'];
          let dependElemVal;
          if(validateArray[dependElemId] == undefined)
          {
            continue;
          }
          if(validateArray[dependElemId]['ctrlTypeId'] == 6 || validateArray[dependElemId]['ctrlTypeId'] == 5)
          {
            let depndAllSelectElementValues:any=[];
            let dependElem:any  = document.getElementsByName(dependElemId);
             for(let i of dependElem)
             {
               if(i.checked)
               {
                depndAllSelectElementValues.push(i.value);
                 break;

               }

             }
             //             var compareDpndFields = dependElemdCondVal.filter(function(obj:any)
// {
//               return depndAllSelectElementValues.indexOf(obj) !== -1;
//           });
            if(!depndAllSelectElementValues.includes(dependElemdCondVal))
            {
              continue;
            }

          }
          else
          {
            dependElemVal       = (<HTMLInputElement>document.getElementById(dependElemId)).value;
            if(dependElemVal !=dependElemdCondVal)
            {
              continue;
            }
          }


        }

        if(mandatoryDetails) // For Mandatory
        {
          //console.log("mandatoryDetails : "+mandatoryDetails)
          if(!this.vldChkLst.selectDropdown(elmVal,lblName))
          {
            console.log("elmVal "+elmVal+" lblName "+lblName);
            validatonStatus =  false;
            break;
          }

        }

      }

      else if(ctrlTypeId == 4) // For TextArea
      {
        // if(elmClass ==  this.ckEdtorCls)
        if(elmClass ==  "TextArea")
          {
            elmVal   =  this.arrckEdtorVal[elmId];
          }
        else
        {
          elmVal   = (<HTMLInputElement>document.getElementById(elmId)).value;
        }

        if(schemeWiseFormCtr['dependctrlDetails'][0]['ctrlChkDepend'])
        {
          let dependElemId        = schemeWiseFormCtr['dependctrlDetails'][0]['ctrlSelDependParent'];
          let dependElemdCondVal  = schemeWiseFormCtr['dependctrlDetails'][0]['ctrlSelDependValue'];
          let dependElemVal;

          if(validateArray[dependElemId] == undefined)

            {

              continue;

            }

          if(validateArray[dependElemId]['ctrlTypeId'] == 6 || validateArray[dependElemId]['ctrlTypeId']
== 5)

          {

            let depndAllSelectElementValues:any=[];

            let dependElem:any  = document.getElementsByName(dependElemId);




             for(let i of dependElem)

             {



               if(i.checked)

               {

                depndAllSelectElementValues.push(i.value);



               }



             }



//             var compareDpndFields = dependElemdCondVal.filter(function(obj:any)
// {

//               return depndAllSelectElementValues.indexOf(obj) !== -1;

//           });

            if(!depndAllSelectElementValues.includes(dependElemdCondVal))

              {

                continue;

              }








          }

          else

          {

            dependElemVal       = (<HTMLInputElement>document.getElementById(dependElemId)).value;

            if(!dependElemdCondVal.includes(dependElemVal))

            {

              continue;

            }

          }


        }
        if(mandatoryDetails) // For Mandatory
        {
          
          
          if(!this.vldChkLst.blankCheck(elmVal,lblName+' can not be left blank'))
          {
            
            
            validatonStatus =  false;
             break;
          }
        }
        if(ctrlMaxLength!='') // For Max length
        {
          if(!this.vldChkLst.maxLength(elmVal,ctrlMaxLength,lblName))
          {
            validatonStatus =  false;
             break;
          }


        }

        if(ctrlMinLength!='')// For Min length
        {
          if(!this.vldChkLst.minLength(elmVal,ctrlMinLength,lblName))
          {
            validatonStatus =  false;
             break;
          }

        }
      }

      else if(ctrlTypeId == 5) // For Checkbox
      {

        let chkdVal :any  = '';
        let chkdTxt :any = '';
        var checkboxes :any = document.getElementsByName(elmId);




        for (var checkbox of checkboxes)
        {
           if (checkbox.checked) {
              if(chkdVal.length > 0)
                {
                  chkdVal+= ','+checkbox.value;
                  let el = document.querySelector(`label[for="${checkbox.id}"]`);
                  chkdTxt+=','+el?.textContent;
                }
              else
                  {
                    chkdVal+= checkbox.value;
                    let el = document.querySelector(`label[for="${checkbox.id}"]`);
                    chkdTxt+=el?.textContent;
                  }

           }
        }
        elmVal      = chkdVal;
        elmValText  = chkdTxt;
        if(schemeWiseFormCtr['dependctrlDetails'][0]['ctrlChkDepend'])
        {
          let dependElemId        = schemeWiseFormCtr['dependctrlDetails'][0]['ctrlSelDependParent'];
          let dependElemdCondVal  = schemeWiseFormCtr['dependctrlDetails'][0]['ctrlSelDependValue'];
          let dependElemVal

          if(validateArray[dependElemId] == undefined)

            {

              continue;

            }

          if(validateArray[dependElemId]['ctrlTypeId'] == 6 || validateArray[dependElemId]['ctrlTypeId']
== 5)

          {

            let depndAllSelectElementValues:any=[];

            let dependElem:any  = document.getElementsByName(dependElemId);




             for(let i of dependElem)

             {



               if(i.checked)

               {

                depndAllSelectElementValues.push(i.value);



               }



             }



//             var compareDpndFields = dependElemdCondVal.filter(function(obj:any)
// {

//               return depndAllSelectElementValues.indexOf(obj) !== -1;

//           });

            if(!depndAllSelectElementValues.includes(dependElemdCondVal))

              {

                continue;

              }








          }

          else

          {

            dependElemVal       = (<HTMLInputElement>document.getElementById(dependElemId)).value;

            if(!dependElemdCondVal.includes(dependElemVal))

            {

              continue;

            }

          }



        }

        if(mandatoryDetails) // For Mandatory
        {
        if(!this.vldChkLst.blankCheckRdoDynamic(elmId,lblName))
          {
            validatonStatus =  false;
             break;
          }
        }
      }

     else if(ctrlTypeId == 6) // For Radio Btn
      {
        var radioBtnElmn=document.getElementsByName(elmId);

            for (var i = 0, length = radioBtnElmn.length; i < length; i++)
            {
              if ((<HTMLInputElement>radioBtnElmn[i]).checked)
              {
                elmVal   = (<HTMLInputElement>radioBtnElmn[i]).value;
                let rdId  = (<HTMLInputElement>radioBtnElmn[i]).id;
                let el = document.querySelector(`label[for="${rdId}"]`);
                elmValText = el?.textContent;
              }
            }
            if(schemeWiseFormCtr['dependctrlDetails'][0]['ctrlChkDepend'])

        {

          let dependElemId        = schemeWiseFormCtr['dependctrlDetails'][0]['ctrlSelDependParent'];

          let dependElemdCondVal  = schemeWiseFormCtr['dependctrlDetails'][0]['ctrlSelDependValue'];

          let dependElemVal

          if(validateArray[dependElemId] == undefined)

            {

              continue;

            }

          if(validateArray[dependElemId]['ctrlTypeId'] == 6 || validateArray[dependElemId]['ctrlTypeId']
== 5)

          {

            let depndAllSelectElementValues:any=[];

            let dependElem:any  = document.getElementsByName(dependElemId);




             for(let i of dependElem)

             {



               if(i.checked)

               {

                depndAllSelectElementValues.push(i.value);



               }



             }



//             var compareDpndFields = dependElemdCondVal.filter(function(obj:any)
// {

//               return depndAllSelectElementValues.indexOf(obj) !== -1;

//           });

            if(!depndAllSelectElementValues.includes(dependElemdCondVal))

              {

                continue;

              }








          }

          else

          {

            dependElemVal       = (<HTMLInputElement>document.getElementById(dependElemId)).value;

            if(!dependElemdCondVal.includes(dependElemVal))

            {

              continue;

            }

          }





        }
            if(mandatoryDetails) // For Mandatory
            {
          if(!this.vldChkLst.blankCheckRdoDynamic(elmId,lblName))
          {
            validatonStatus =  false;
             break;
          }
          }
      }

      else if(ctrlTypeId == 7)
      {
        uploadFile = this.arrUploadedFiles[elmId];
        if(mandatoryDetails) // For Mandatory
        {
        if(uploadFile == '' || uploadFile == undefined || uploadFile['fileName'] =='' || uploadFile['fileName'] == undefined)
          {
            Swal.fire({
              icon: 'error',
              text: 'Please upload ' + lblName
            });
            validatonStatus =  false;
             break;
          }
        }
      }

      else if(ctrlTypeId == 10) //For AddMore
      {
        if(schemeWiseFormCtr['dependctrlDetails'][0]['ctrlChkDepend']) // For Dependent Check
        {

          let dependElemId        = schemeWiseFormCtr['dependctrlDetails'][0]['ctrlSelDependParent'];
          let dependElemdCondVal  = schemeWiseFormCtr['dependctrlDetails'][0]['ctrlSelDependValue'];
          let dependElemVal;
          if(validateArray[dependElemId] == undefined)

          {

            continue;

          }
          if(validateArray[dependElemId]['ctrlTypeId'] == 6 || validateArray[dependElemId]['ctrlTypeId'] == 5)
          {
            let depndAllSelectElementValues:any=[];
            let dependElem:any  = document.getElementsByName(dependElemId);
             for(let i of dependElem)
             {
               if(i.checked)
               {
                depndAllSelectElementValues.push(i.value);
               }

             }
             //             var compareDpndFields = dependElemdCondVal.filter(function(obj:any)
// {
//               return depndAllSelectElementValues.indexOf(obj) !== -1;
//           });
            if(!depndAllSelectElementValues.includes(dependElemdCondVal))
            {
              continue;
            }
          }
          else
          {
            dependElemVal       = (<HTMLInputElement>document.getElementById(dependElemId)).value;
            if(!dependElemdCondVal.includes(dependElemVal))

            {
              continue;
            }
          }


        }

        let addmoreAllCtrlWiseData = this.arrAddmoreFilledData[elmId];
        if(addmoreAllCtrlWiseData == undefined)
          {
            addmoreAllCtrlWiseData = [];
          }
        if(!this.addMoreValidation(addmoreAllCtrlWiseData,schemeWiseFormCtr['addmoreDetails']))
          {
            validatonStatus =  false;
            break;
          }
        addMoreElementData = JSON.stringify(this.arrAddmoreFilledData[elmId]);
      }
      validateArray[elmId]  =  {
        'ctrlValue'  : elmVal,
        'ctrlTypeId' : ctrlTypeId
      };
      formData.append('ctrlTypeId['+elmId+']', ctrlTypeId);
      formData.append('ctrlId['+elmId+']', elmId);
      formData.append('ctrlName['+elmId+']', elmName);
      formData.append('lblName['+elmId+']', this.encDec.escapeHtml(lblName));
      formData.append('ctrlValue['+elmId+']', elmVal);
      formData.append( 'ctrlValueText['+elmId+']', elmValText);
      formData.append('uploadedFiles['+elmId+']', JSON.stringify(uploadFile));
      formData.append('addMoreElementData['+elmId+']',addMoreElementData);
    }

    formData.append('processId', this.processId);
    formData.append('secId', this.currSecId);
    formData.append('intOnlineServiceId', this.onlineServiceId);
     formData.append('ProfileID',  this.profileId);
     formData.append('USERID',  this.adminuserid);
    // formData.append('optionTxtDetails', JSON.stringify(arrJsnTxtDet));
    if(validatonStatus)
    {
      this.loading=true;
    this.WebCommonService.schemeApply(formData).subscribe((res:any)=>{
      let validationMsg = (res.result.validationMsg!='') ? res.result.validationMsg : 'error' ;
      if(res.status == 200){
        this.loading=false;
        this.onlineServiceId = res.result.intOnlineServiceId;
        if(this.dynamicCtrlDetKeys.length > this.dynamicCtrlDetKeys.indexOf(this.currSecTabKey ) + 1)
          {
            let latestDynCtlkeyIndex = Number(this.dynamicCtrlDetKeys.indexOf(this.currSecTabKey ))+1
            this.currSecTabKey = this.dynamicCtrlDetKeys[latestDynCtlkeyIndex];
            this.currSecId     = this.dynamicCtrlDetails[this.currSecTabKey]['sectionid'];
            this.prevdipStatus = '';
            this.secDisable   = false;
            (<HTMLElement>document.getElementById("sec-tab-"+this.dynamicCtrlDetKeys[latestDynCtlkeyIndex])).click();
           // this.secDisable   = true;
          }
          else
          {
            let formParms  = this.processId+':'+this.onlineServiceId+':'+1;
            let encSchemeStr = this.encDec.encText(formParms.toString());
            if(this.fromadmin != 'admin'){
              this.route.navigate(['/website/formPreview',encSchemeStr]);
                         }
                        else{
                         Swal.fire({
                           icon: 'success',
                           text: 'Success',
                           confirmButtonColor: '#3085d6',
                           confirmButtonText: 'Ok'
                         }).then((result) => {

                             let formParms  = this.processId;
                             let encSchemeStr = this.encDec.encText(formParms.toString());


                         this.route.navigate(['./application/pending-application',encSchemeStr]);
                         });
                        }
          }
      }

      else{
        Swal.fire({
          icon: 'error',
          text: validationMsg
        });
      }
      });
    }
  }

   goToPrevious() {
     if(this.dynamicCtrlDetKeys.indexOf(this.currSecTabKey) == 0)
     {

      this.route.navigate(['/website/servicelisting']);
     }

     else
     {

            let latestDynCtlkeyIndex = Number(this.dynamicCtrlDetKeys.indexOf(this.currSecTabKey ))-1
            this.currSecTabKey = this.dynamicCtrlDetKeys[latestDynCtlkeyIndex];
            this.currSecId     = this.dynamicCtrlDetails[this.currSecTabKey]['sectionid'];
            this.prevdipStatus = '';
            this.secDisable   = false;
            (<HTMLElement>document.getElementById("sec-tab-"+this.dynamicCtrlDetKeys[latestDynCtlkeyIndex])).click();
            this.secDisable   = true;
     }
  }

  reset()
  {
    if(this.currSecTabKey == 'sec_0')
    {
      location.reload();
      return
    }
    (<HTMLElement>document.getElementById("sec-tab-"+this.currSecTabKey)).click();
  }
  // setCkEdtorValue({ editor }: ChangeEvent , ckId:any)
  // {
  //   this.arrckEdtorVal[ckId] = editor.getData();
  // }

  // setCkedtorArr(ckVal:any,ckId:any) // To set the ck editor value in array while page submit
  // {
  //   this.arrckEdtorVal[ckId] = ckVal;
  // }
  saveFileTemp(event:any,fileId:any,fileType:any,fileSize:any,fileForApproval:any,fileSizeType:any) // This function is used to save the file in temporary Folder
  {
    const target = event.target as HTMLInputElement;
    const files :any = target.files as FileList;
    const uploadedfleSize  = files[0].size;
    const uploadedfileType  = files[0].type;
    let validFileStatus = true;
    if(!this.vldChkLst.validateFile(uploadedfileType,fileType)) // File Type Validation Check
      {
        validFileStatus = false;
        Swal.fire({
          icon: 'error',
          text: 'invalid file type'
        });
      }
      if(!this.vldChkLst.validateFileSize(uploadedfleSize,fileSize,fileSizeType)) // File Size Validation Check
      {
        let filesizeMsg ='';
        if (fileSizeType.toLowerCase() == 'kb')
        {
            filesizeMsg = 'File size exceeds ' + fileSize + 'KB.';
        }
        else
        {
            filesizeMsg = 'File size exceeds ' + fileSize + 'MB.';
        }
        validFileStatus = false;
        Swal.fire({
          icon: 'error',
          text: filesizeMsg
        });
      }
      if(!validFileStatus)
      {
        (<HTMLInputElement>document.getElementById(fileId)).value = '';
        document.getElementById('fileDownloadDiv_'+fileId)?.closest('.form-group')?.querySelector('.downloadbtn')?.setAttribute('href','');
        document.getElementById('fileDownloadDiv_'+fileId)?.classList.add('d-none');
        delete this.arrUploadedFiles[fileId];
        return false;
      }
        const fileData          = new FormData();
        fileData.append("file", files[0]);
        fileData.append("fileType",fileType);
        fileData.append("fileSize",fileSize);
        fileData.append("fileSizeType",fileSizeType);
        this.btnSaveNextDisableStatus = true;
       this.WebCommonService.saveFileToTemp(fileData).subscribe((res:any)=>{
        if(res.status ==200)
        {
          this.arrUploadedFiles[fileId]  = {'fileName':res.result.fileName ,'fileForApproval':fileForApproval ,'fileType':fileType} ;
           document.getElementById('fileDownloadDiv_'+fileId)?.closest('.form-group')?.querySelector('.downloadbtn')?.setAttribute('href',res.result.filePath);
           document.getElementById('fileDownloadDiv_'+fileId)?.classList.remove('d-none');
         }
         else
         {
          (<HTMLInputElement>document.getElementById(fileId)).value = '';
          Swal.fire({
            icon: 'error',
            text: 'error while uploading files'
          });
         }

         this.btnSaveNextDisableStatus = false;
      });
      return true;
  }

  removeFile(ctrlId:any)
  {
    (<HTMLInputElement>document.getElementById(ctrlId)).value = '';
    document.getElementById('fileDownloadDiv_'+ctrlId)?.closest('.form-group')?.querySelector('.downloadbtn')?.setAttribute('href','');
    document.getElementById('fileDownloadDiv_'+ctrlId)?.classList.add('d-none');
    delete this.arrUploadedFiles[ctrlId];
    this.arrDeletedUploadedFiles.push(ctrlId);
  }

  showUploadFile(fileName:any,ctrlId:any,fileForApproval:any,fileType:any)
  {
    if(fileName!=null && fileName!='' && !this.arrDeletedUploadedFiles.includes(ctrlId))
    {
        document.getElementById('fileDownloadDiv_'+ctrlId)?.closest('.form-group')?.querySelector('.downloadbtn')?.setAttribute('href',environment.tempUrl+fileName);
        document.getElementById('fileDownloadDiv_'+ctrlId)?.classList.remove('d-none');
        this.arrUploadedFiles[ctrlId]= {'fileName':fileName , 'fileForApproval':fileForApproval,'fileType':fileType};
    }
  }

  setCalcFieldValue(ctrlCalcFieldData:any , ctrlId:any)
  {
    this.arrCalcFields[ctrlId] = ctrlCalcFieldData;

  }
  setCalcFields()
  {
    let dynCalc:any =document.querySelectorAll("[data-calcflag='true']");
    for(let loopdynCalc of  dynCalc)
    {
      (<HTMLInputElement>document.getElementById(loopdynCalc.id)).readOnly=true ;
      for(let clcloop of this.arrCalcFields[loopdynCalc.id])
        {
          if(clcloop.ctrlCalcFieldtype == 'fieldValue')
          {
            let clcElement =   (<HTMLInputElement>document.getElementById(clcloop.ctrlCalcValue));
            clcElement.addEventListener('keyup', ()=>{
              this.calculate(this.arrCalcFields[loopdynCalc.id],loopdynCalc.id);
              });
          }

        }

    }
    return;
  }

  calculate(calcDetails:any,ctrlId:any) // This function is used for Calculation purpose
  {
    let clc :any=0;
    let valuate:any='';
    for (let calcloop of calcDetails)
    {
      if(calcloop.ctrlCalcFieldtype == 'fieldValue')
        {
          let fldValue = (<HTMLInputElement>(document.getElementById(calcloop.ctrlCalcValue))).value
          clc= (fldValue.length > 0) ? fldValue : 0;
        }
       else
       {
        clc = calcloop.ctrlCalcValue;
       }
       valuate+=clc;
    }
    (<HTMLInputElement>(document.getElementById(ctrlId))).value = eval(valuate);
    return;
  }

  backClicked(){
    this._location.back();
  }

  setArrAddMoreDetails(ctrlId:any,addMoreparams:any) {  // This function is used to set the configured data of Add more
    this.arrAddmoreDetails[ctrlId] = addMoreparams;
   // console.log(this.arrAddmoreDetails);
  }

  addMoreData(addMorectrlId:any)
    {
      let validateArray: any[] =[];
      let validatonStatus  = true;
      let arrAddMoreElementWiseData:any[] =[];
      let uploadFile:any;
      let indx=0;
      let clearAddMoreValue = [];
      for(let schemeWiseFormCtr of this.arrAddmoreDetails[addMorectrlId])
        {
          let ctrlTypeId      = schemeWiseFormCtr.ctrlTypeId;
          let elmVal          = '';
          let elmValText:any      = '';
          let elmId           = schemeWiseFormCtr.ctrlId;
          let elmName         = schemeWiseFormCtr.ctrlName;
          let lblName         =  schemeWiseFormCtr.ctrlLabel;
          let mandatoryDetails = schemeWiseFormCtr.ctrlMandatory;
          let attrType        = schemeWiseFormCtr.ctrlAttributeType;
          let ctrlMaxLength   = schemeWiseFormCtr.ctrlMaxLength;
          let ctrlMinLength   = schemeWiseFormCtr.ctrlMinLength;
          let elmClass        = schemeWiseFormCtr.ctrlClass;
          let bndDataType     =  schemeWiseFormCtr.addmorecascadingCtrlDetails[0].ctrlCCbindDatatype;
          let bndDataTypeDpndOther     =  schemeWiseFormCtr.addmorecascadingCtrlDetails[0].AMctrlCCbinddepentOther

          clearAddMoreValue.push({'elmId':elmId,'elmtypeId':ctrlTypeId,'elmClass':elmClass,'bindDataType':bndDataType,'bndDataTypeDpndOther':bndDataTypeDpndOther});
          if(ctrlTypeId == 2) // For Textbox
          {
            elmVal   = (<HTMLInputElement>document.getElementById(elmId)).value;

            if(mandatoryDetails) // For Mandatory
            {

              if(!this.vldChkLst.blankCheck(elmVal,lblName+' can not be left blank'))
              {
                validatonStatus =  false;
              break;
              }

            }

            if(ctrlMaxLength!='') // For Max length
            {
              if(!this.vldChkLst.maxLength(elmVal,ctrlMaxLength,lblName))
              {
                validatonStatus =  false;
                break;
              }
            }

            if(ctrlMinLength!='')// For Min length
            {
              if(!this.vldChkLst.minLength(elmVal,ctrlMinLength,lblName))
              {
                validatonStatus =  false;
                 break;
              }

            }

            if(attrType == 'email') // For Valid Email
              {
                if(!this.vldChkLst.validEmail(elmVal))
                {
                  validatonStatus =  false;
                   break;
                }

              }

              else if(attrType == 'telephone') // For Valid Mobile
              {
                if(!this.vldChkLst.validMob(elmVal))
                {
                  validatonStatus =  false;
                   break;
                }

              }

              else if(attrType == 'password') // For password Validation
              {
                if(!this.vldChkLst.validPassword(elmVal))
                {
                  validatonStatus =  false;
                  break;
                }

              }

          }

          else if(ctrlTypeId == 3) // For DropDown
          {
            let elm:any      = (<HTMLInputElement>document.getElementById(elmId));

            elmVal           = elm.value;

            if(elmVal=='0' || elmVal == undefined || elmVal == '')

            {

              elmValText        = '--';

            }

            else

            {

              elmValText        = elm.options[elm.selectedIndex].text;

            }

            if(mandatoryDetails) // For Mandatory
            {
              if(!this.vldChkLst.selectDropdown(elmVal,lblName))
              {
                validatonStatus =  false;
                break;
              }

            }

          }

          else if(ctrlTypeId == 4) // For TextArea
          {
            // if(elmClass ==  this.ckEdtorCls)
            if(elmClass ==  "TextArea")
              {
                elmVal   =  this.arrckEdtorVal[elmId];

              }
            else
            {
              elmVal   = (<HTMLInputElement>document.getElementById(elmId)).value;

            }


            if(mandatoryDetails) // For Mandatory
            {
              if(!this.vldChkLst.blankCheck(elmVal,lblName+' can not be left blank'))
              {
                validatonStatus =  false;
                 break;
              }
            }
            if(ctrlMaxLength!='') // For Max length
            {
              if(!this.vldChkLst.maxLength(elmVal,ctrlMaxLength,lblName))
              {
                validatonStatus =  false;
                 break;
              }


            }

            if(ctrlMinLength!='')// For Min length
            {
              if(!this.vldChkLst.minLength(elmVal,ctrlMinLength,lblName))
              {
                validatonStatus =  false;
                 break;
              }

            }
          }

          else if(ctrlTypeId == 5) // For Checkbox
          {

            if(mandatoryDetails) // For Mandatory
            {
            if(!this.vldChkLst.blankCheckRdoDynamic(elmId,lblName))
              {
                validatonStatus =  false;
                 break;
              }
            }
            let chkdVal :any  = '';
            let chkdTxt :any = '';
            var checkboxes :any = document.getElementsByName(elmId);
            for (var checkbox of checkboxes)
            {
               if (checkbox.checked) {
                  if(chkdVal.length > 0)
                    {
                      chkdVal+= ','+checkbox.value;
                      let el = document.querySelector(`label[for="${checkbox.id}"]`);
                      chkdTxt+=','+el?.textContent;
                    }
                  else
                      {
                        chkdVal+= checkbox.value;
                        let el = document.querySelector(`label[for="${checkbox.id}"]`);
                        chkdTxt+=el?.textContent;
                      }



               }
            }
            elmVal      = chkdVal.toString();
            if(chkdVal != '')

            {

              elmValText  = chkdTxt;

            }

            else

            {

              elmValText  = '--';

            }

          }

         else if(ctrlTypeId == 6) // For Radio Btn
          {
            if(mandatoryDetails) // For Mandatory
            {
              if(!this.vldChkLst.blankCheckRdoDynamic(elmId,lblName))
              {
                validatonStatus =  false;
                 break;
              }
            }


            var radioBtnElmn=document.getElementsByName(elmId);

                for (var i = 0, length = radioBtnElmn.length; i < length; i++)
                {
                  if ((<HTMLInputElement>radioBtnElmn[i]).checked)
                  {
                    elmVal   = (<HTMLInputElement>radioBtnElmn[i]).value;
                    let rdId  = (<HTMLInputElement>radioBtnElmn[i]).id;
                    if(elmVal=='0' || elmVal == undefined || elmVal == '')

                    {

                      elmValText        = '--';

                    }

                    else

                    {

                      let el = document.querySelector(`label[for="${rdId}"]`);

                      elmValText = el?.textContent;

                    }

                  }


                }

          }

          else if(ctrlTypeId == 7)
          {
            uploadFile = this.arrUploadedFiles[elmId];

            if(mandatoryDetails) // For Mandatory
            {
            if(uploadFile =='' || uploadFile == undefined)
              {
                Swal.fire({
                  icon: 'error',
                  text: 'Please upload ' + lblName
                });
                validatonStatus =  false;
                 break;
              }
            }
          }
          validateArray[elmId]  =  {
            'ctrlValue'  : elmVal,
            'ctrlTypeId' : ctrlTypeId
          };

            arrAddMoreElementWiseData.push(
            {
            'ctrlTypeId': ctrlTypeId,
            'ctrlId'    : elmId,
            'ctrlName'  : elmName,
            'lblName'   : lblName,
            'ctrlValue' : elmVal,
            'ctrlValueText' : elmValText,
            'uploadFile':uploadFile,
            'editStaus':0
         });

         indx++;
        }
         if(validatonStatus)
         {
           if(clearAddMoreValue.length > 0)
              { // Clear All the add More elements
                  for (let addMoreClearloop of clearAddMoreValue)
                      {
                        if(addMoreClearloop['elmtypeId'] == 2)
                          {
                            (<HTMLInputElement>document.getElementById(addMoreClearloop['elmId'])).value=''
                          }
                          else if(addMoreClearloop['elmtypeId'] == 3)
                            {
                              (<HTMLInputElement>document.getElementById(addMoreClearloop['elmId'])).value='0';

                              // if(addMoreClearloop['bindDataType'] == 'dynamic' && addMoreClearloop['bndDataTypeDpndOther'] == 0)
                              //   {
                              //    console.log(this.arralldynVal[addMoreClearloop['elmId']].splice(Object.keys(this.arralldynVal).indexOf(addMoreClearloop['elmId']),500));
                              //    console.log(this.arralldynVal[addMoreClearloop['elmId']]);
                              //   }
                             //
                            }
                            else if(addMoreClearloop['elmtypeId'] == 4)
                            {
                              // if(addMoreClearloop['elmClass'] ==  this.ckEdtorCls)TextArea
                              if(addMoreClearloop['elmClass'] ==  "TextArea")
                              {
                                this.arrckEdtorVal[addMoreClearloop['elmId']] = '';
                              }
                              else
                              {
                              (<HTMLInputElement>document.getElementById(addMoreClearloop['elmId'])).value='';
                               }
                            }

                            else if(addMoreClearloop['elmtypeId'] == 5)
                            {
                              var checkboxes :any = document.getElementsByName(addMoreClearloop['elmId']);
                              for (var checkbox of checkboxes)
                              {
                                 if (checkbox.checked) {
                                        (<HTMLInputElement>document.getElementById(checkbox.id)).checked = false;
                                 }
                              }
                            }

                            else if(addMoreClearloop['elmtypeId'] == 6)
                            {
                              var radioBtnElmn=document.getElementsByName(addMoreClearloop['elmId']);

                              for (var i = 0, length = radioBtnElmn.length; i < length; i++)
                              {
                                if ((<HTMLInputElement>radioBtnElmn[i]).checked)
                                {
                                  let rdId  = (<HTMLInputElement>radioBtnElmn[i]).id;
                                  (<HTMLInputElement>document.getElementById(rdId)).checked = false;
                                }
                              }
                            }

                            else if(addMoreClearloop['elmtypeId'] == 7)
                              {
                                document.getElementById('fileDownloadDiv_'+addMoreClearloop['elmId'])?.closest('.form-group')?.querySelector('.downloadbtn')?.setAttribute('href','');
                                document.getElementById('fileDownloadDiv_'+addMoreClearloop['elmId'])?.classList.add('d-none');
                               (<HTMLInputElement>document.getElementById(addMoreClearloop['elmId'])).value = '';
                              }

                      }
              }

           // First store using index of add more id  in this.arrAddmoreFilledData and then push it in this.arrAddmoreFilledData
          if(this.arrAddmoreFilledData[addMorectrlId]!=undefined)
        {
            this.arrAddmoreFilledData[addMorectrlId].push(arrAddMoreElementWiseData);

        }
        else
        {
          this.arrAddmoreFilledData[addMorectrlId]= [arrAddMoreElementWiseData];
        }
        this.arrAddmoreElemntKeys[addMorectrlId]= (Object.keys(arrAddMoreElementWiseData));
        this.editIndex = '';
         }

    }


    // editAddMore(event:any,ctrlId:any,indx:any)
    // {
    //   this.editIndex = indx;
    //  if(this.arrAddMoreEditData.length > 0)
    //  {
    //   this.arrAddMoreEditData = [];
    //  }
    //   this.arrAddMoreEditData.push(this.arrAddmoreFilledData[ctrlId][indx]);
    //   console.log(this.arrAddMoreEditData);
    // }
    setDynRadioBtn(dynSetVal:any,ctrlValue:any)
    {
      if(dynSetVal != null)
        {
          let arrRadioDetails = dynSetVal.split(',');
           return   arrRadioDetails.includes(ctrlValue)
        }
        else
        {
          return false;
        }
    }

  deleteAddMore(event:any,ctrlId:any,indx:any)
  {

    this.arrAddmoreFilledData[ctrlId].splice(indx,1);
  }

    fillAddMoreArray(addMorectrlId:any , addMoreFormConfigData:any , addMoreFormResult:any) // when page is loaded this function set's add more array
    {
      if(addMoreFormResult[addMorectrlId]!=undefined && !(Object.keys(this.arrAddmoreElemntKeys)).includes(addMorectrlId))
        {
          let arrAddMoreElementWiseData = [];
          if(addMoreFormResult[addMorectrlId]['addMoreDataValue']!='')
            {
              for(let addmoreloop of addMoreFormResult[addMorectrlId]['addMoreDataValue'])
                {
                  let optAddMoreValue = '';
                  arrAddMoreElementWiseData = [];
                  if(addmoreloop.jsonOptTxtDetails!='' && addmoreloop.jsonOptTxtDetails!=undefined)
                      {
                        optAddMoreValue =  JSON.parse(addmoreloop.jsonOptTxtDetails);
                     //   optVal   =
                      }
                    for(let addMoreConfigloop of addMoreFormConfigData)
                    {
                      console.log(addMoreConfigloop['addmoretablecolDetails'][0]['ctrlTblColName']+"===========ColumnName");
                      let optVal   = (optAddMoreValue!=undefined) ? optAddMoreValue[addMoreConfigloop['addmoretablecolDetails'][0]['ctrlTblColName']] : '';
                      console.log(addmoreloop);
                      arrAddMoreElementWiseData.push(
                        {
                        'ctrlTypeId': addMoreConfigloop.ctrlTypeId,
                        'ctrlId'    : addMoreConfigloop.ctrlId,
                        'ctrlName'  : addMoreConfigloop.ctrlName,
                        'lblName'   : addMoreConfigloop.ctrlLabel,
                        'ctrlValue' : (addMoreConfigloop.ctrlTypeId!=7) ? addmoreloop[addMoreConfigloop['addmoretablecolDetails'][0]['ctrlTblColName']] : '',
                        'ctrlValueText' :optVal,
                        'uploadFile': ( addMoreConfigloop.ctrlTypeId==7) ? {'fileName':addmoreloop[addMoreConfigloop['addmoretablecolDetails'][0]['ctrlTblColName']] , 'fileForApproval':addMoreConfigloop.ctrlForApproval,'fileType':addMoreConfigloop.ctrlFileType}
                        : '',
                        'editStaus' :1
                    });
                    console.log(arrAddMoreElementWiseData)
                    }
                    if(this.arrAddmoreFilledData[addMorectrlId]!=undefined)
                    {
                    this.arrAddmoreFilledData[addMorectrlId].push(arrAddMoreElementWiseData);
                    }
                    else
                    {
                      this.arrAddmoreFilledData[addMorectrlId]= [arrAddMoreElementWiseData];
                    }
                }
           // First store using index of add more id  in this.arrAddmoreFilledData and then push it in this.arrAddmoreFilledData
            this.arrAddmoreElemntKeys[addMorectrlId]= (Object.keys(arrAddMoreElementWiseData));

          }
        }

    }

    setColumnNameToUpperCase(ctrlTblColName:any , dataValue:any)
      {
        if(dataValue == null || dataValue[ctrlTblColName]=='undefined' || dataValue[ctrlTblColName]==undefined )
          {
            return '';
          }
          else
          {
            return dataValue[ctrlTblColName.toUpperCase()];
          }
      }

    addMoreValidation(addmoreData:any,addmoreConfiguredData:any)
      {
        let arrAddMoreValdiator:any[]=[];
        let addmreValidStaus = true;
        for(let addMoreConfiguredValidatorloop of addmoreConfiguredData)
          {
            let addMoreerrorMsg:any = '';
            if(addMoreConfiguredValidatorloop.ctrlMandatory && addmoreData.length == 0)
              {
                    if(addMoreConfiguredValidatorloop.ctrlTypeId == 3 || addMoreConfiguredValidatorloop.ctrlTypeId == 5 || addMoreConfiguredValidatorloop.ctrlTypeId == 6)
                            {
                              addMoreerrorMsg = 'Select ' +  addMoreConfiguredValidatorloop.ctrlLabel;
                            }
                            else
                            {
                              addMoreerrorMsg =  addMoreConfiguredValidatorloop.ctrlLabel + ' can not be left blank';
                            }
                    Swal.fire({
                      icon: 'error',
                      text: addMoreerrorMsg
                    });
                    addmreValidStaus = false;
                    break;
              }
             arrAddMoreValdiator[addMoreConfiguredValidatorloop.ctrlId] = {'ctrlTypeId': addMoreConfiguredValidatorloop.ctrlTypeId , 'ctrlMandatory':addMoreConfiguredValidatorloop.ctrlMandatory , 'ctrlMaxLength': addMoreConfiguredValidatorloop.ctrlMaxLength , 'ctrlMinLength':addMoreConfiguredValidatorloop.ctrlMinLength , 'ctrlAttributeType' : addMoreConfiguredValidatorloop.ctrlAttributeType , 'ctrlLabel' : addMoreConfiguredValidatorloop.ctrlLabel}
          }
          if(addmreValidStaus && addmoreData!=undefined)
              {
                for(let addMoreTrDataValidatorloop of addmoreData) //TR
                  {
                    for(let addMoreTdDataValidatorloop of addMoreTrDataValidatorloop) //TD
                      {
                        if(addMoreTdDataValidatorloop['ctrlTypeId']  == 2) // Textbox Validation
                            {
                              if(addMoreTdDataValidatorloop['ctrlValue']== undefined || addMoreTdDataValidatorloop['ctrlValue'] == "undefined")
                                {
                                  addMoreTdDataValidatorloop['ctrlValue'] = "";
                                }
                              if(arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlMandatory']) // For Mandatory
                              {
                                if(!this.vldChkLst.blankCheck(addMoreTdDataValidatorloop['ctrlValue'],arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlLabel']+' can not be left blank'))
                                  {
                                     addmreValidStaus =  false;
                                      break;
                                  }
                                }

                                  if(arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlMaxLength']!='' && addMoreTdDataValidatorloop['ctrlValue']!='' && addMoreTdDataValidatorloop['ctrlValue']!='undefined' && addMoreTdDataValidatorloop['ctrlValue']!=undefined) // For Max length
                                  {
                                    //console.log(this.vldChkLst);
                                    if(!this.vldChkLst.maxLength(addMoreTdDataValidatorloop['ctrlValue'],arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlMaxLength'],arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlLabel']))
                                    {
                                      
                                      addmreValidStaus =  false;
                                      break;
                                    }
                                  }

                                    if(arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlMinLength']!='' && addMoreTdDataValidatorloop['ctrlValue']!='' && addMoreTdDataValidatorloop['ctrlValue']!='undefined' && addMoreTdDataValidatorloop['ctrlValue']!=undefined)// For Min length
                                    {
                                      if(!this.vldChkLst.minLength(addMoreTdDataValidatorloop['ctrlValue'],arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlMinLength'],arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlLabel']))
                                      {
                                        addmreValidStaus =  false;
                                        break;
                                      }
                                    }

                                    if(arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlAttributeType'] == 'email') // For Valid Email
                                      {
                                        if(!this.vldChkLst.validEmail(addMoreTdDataValidatorloop['ctrlValue']))
                                        {
                                          addmreValidStaus =  false;
                                          break;
                                        }

                                      }

                                      else if(arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlAttributeType'] == 'telephone') // For Valid Mobile
                                      {
                                        if(!this.vldChkLst.validMob(addMoreTdDataValidatorloop['ctrlValue']))
                                        {
                                          addmreValidStaus =  false;
                                          break;
                                        }
                                      }

                                      else if(arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlAttributeType'] == 'password') // For password Validation
                                      {
                                        if(!this.vldChkLst.validPassword(addMoreTdDataValidatorloop['ctrlValue']))
                                        {
                                          addmreValidStaus =  false;
                                          break;
                                        }

                                      }
                              }
                              else if(addMoreTdDataValidatorloop['ctrlTypeId'] == 3) // Dropdown Validation
                              {
                                if(arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlMandatory']) // For Mandatory
                                {
                                  if(!this.vldChkLst.selectDropdown(addMoreTdDataValidatorloop['ctrlValue'],arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlLabel']))
                                  {
                                    addmreValidStaus =  false;
                                    break;
                                  }
                                }
                              }
                              else if(addMoreTdDataValidatorloop['ctrlTypeId'] == 4) // Text Area and ckeditor Validation
                              {
                                if(arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlMandatory']) // For Mandatory
                                {
                                  if(!this.vldChkLst.blankCheck(addMoreTdDataValidatorloop['ctrlValue'],arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlLabel']+' can not be left blank'))
                                  {
                                     addmreValidStaus =  false;
                                      break;
                                  }
                                }

                                if(arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlMaxLength']!='') // For Max length
                                  {
                                    if(!this.vldChkLst.maxLength(addMoreTdDataValidatorloop['ctrlValue'],arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlMaxLength'],arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlLabel']))
                                    {
                                      addmreValidStaus =  false;
                                      break;
                                    }
                                  }

                                    if(arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlMinLength']!='')// For Min length
                                    {
                                      if(!this.vldChkLst.minLength(addMoreTdDataValidatorloop['ctrlValue'],arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlMinLength'],arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlLabel']))
                                      {
                                        addmreValidStaus =  false;
                                        break;
                                      }
                                    }
                              }

                              else if(addMoreTdDataValidatorloop['ctrlTypeId'] == 5) // Checkbox Validation
                              {
                                if(arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlMandatory']) // For Mandatory
                                {
                                if(!this.vldChkLst.blankCheck(addMoreTdDataValidatorloop['ctrlValue'],arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlLabel']+' can not be left blank'))
                                  {
                                     addmreValidStaus =  false;
                                      break;
                                  }
                                }
                              }

                              else if(addMoreTdDataValidatorloop['ctrlTypeId'] == 6) // Radio Validation
                              {
                                if(arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlMandatory']) // For Mandatory
                                {
                                if(!this.vldChkLst.blankCheck(addMoreTdDataValidatorloop['ctrlValue'],arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlLabel']+' can not be left blank'))
                                  {
                                     addmreValidStaus =  false;
                                      break;
                                  }
                                }
                              }
                              else if(addMoreTdDataValidatorloop['ctrlTypeId'] == 7) // File Validation
                              {
                                if(arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlMandatory']) // For Mandatory
                                {
                                if(!this.vldChkLst.blankCheck(addMoreTdDataValidatorloop['uploadFile']['fileName'],arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlLabel']+' can not be left blank'))
                                  {
                                      addmreValidStaus =  false;
                                      break;
                                  }
                                }
                              }
                      }

                  }
              }
        return addmreValidStaus
      }

      setStaticDependBindArr(casDetails:any,parentCtrlId:any) // Set the static array if depended Static Details exists
      {
        if(!Object.keys(this.arrallStaticDependtDetails).includes(parentCtrlId))
        {
          this.arrallStaticDependtDetails[parentCtrlId] = casDetails;
        }
      }
      loadStaticDetails(ctrlId:any,ctrlTypeId:any) // Load The depended Static Details if exist
      {
        if(Object.keys(this.arrallStaticDependtDetails).includes(ctrlId))
        {
                let parnetStaticValue = ''
                if(ctrlTypeId == 6)
                  {
                    var radioBtnElmn=document.getElementsByName(ctrlId);
                     // console.log(radioBtnElmn);
                      for (var i = 0, length = radioBtnElmn.length; i < length; i++)
                      {
                        if ((<HTMLInputElement>radioBtnElmn[i]).checked)
                        {
                          parnetStaticValue   = (<HTMLInputElement>radioBtnElmn[i]).value;
                        }
                      }
                  }
                  else
                    {
                      parnetStaticValue = (<HTMLInputElement>document.getElementById(ctrlId)).value;
                    }
                if(this.arrCascadingBindDependtDetails[ctrlId] != undefined)
                  {
                    this.arrCascadingBindDependtDetails[ctrlId].splice(0,this.arrCascadingBindDependtDetails[ctrlId].length);
                  }
                for(let staticCasLoop  of this.arrallStaticDependtDetails[ctrlId])
                    {
                      if(staticCasLoop['ctrlCCStaticFieldValue'] == parnetStaticValue)
                        {
                          if(this.arrCascadingBindDependtDetails[ctrlId] == undefined)
                            {
                              this.arrCascadingBindDependtDetails[ctrlId] = [{'ctrlCCStaticName':staticCasLoop['ctrlCCStaticName'] ,'ctrlCCStaticValue' : staticCasLoop['ctrlCCStaticValue']}];
                            }
                            else
                            {
                              this.arrCascadingBindDependtDetails[ctrlId].push({'ctrlCCStaticName':staticCasLoop['ctrlCCStaticName'] ,'ctrlCCStaticValue' : staticCasLoop['ctrlCCStaticValue']});
                            }
                        }
                    }
        }
      }
// ===============  GET IFSC CODE  =============== //
getIFSC(){

  this.Banks = [];

 this.loading=true;
  let params = { };
 this.WebCommonService.getIfscCode(params).subscribe((res:any)=>{

  if(res.status=='200'){
    this.loading=false;
    this.BankNames = res.result['bankDetails'];
    this.DistrictNames = res.result['districtDetails'];
  }

      },
      (error:any) => {
        this.error = error
        this.BankNames = []
        this.DistrictNames = []
      }

    );
    this.open(this.someModalRef);


}

searchIFSC(){
  let ifscdistrictname = this.ifscdistrictname;
let ifscbankname=this.ifscbankname;
if(ifscbankname == 0 || typeof (ifscbankname) == undefined || ifscbankname == null) {

  Swal.fire({
    icon: 'error',
    text: "Please Select Bank Name",


  });
}
 else if(ifscdistrictname == 0 || typeof (ifscdistrictname) == undefined || ifscdistrictname == null) {

    Swal.fire({
      icon: 'error',
      text: "Please Select District Name",


    });
  }
else{
  let params = {
    bankName:ifscbankname,
    distName:ifscdistrictname
  }
  //console.log(params)
  this.loading=true;
  this.WebCommonService.getifscDetails(params)
    .subscribe(
      (data: any)=> {
        if(data.status=='200'){
          this.loading=false;
          this.Banks = data.result;

          this.isIFSCFlag = true;

        }else{
          this.loading=false;
          this.isIFSCFlag = false;
          Swal.fire({
            icon: 'error',
            text: data.errMsg
          });
        }

      },
      (error:any) => {
        this.error = error
        this.Banks = [];
       // console.log(error);
        Swal.fire({
          icon: 'error',
          text: 'No Records Found!'
        });
      }

    );
}

}


selectIFSC(ifscdistrictname:any, ifscbankname:any, branchName:any, ifscCode:any, int_Min_Account_No:any, int_Max_Account_No:any) {
 let ifscarr:any=[
   {'itemclass':'ifsc_branch','itemvalue':branchName},
   {'itemclass':'ifsc_code','itemvalue':ifscCode},
   {'itemclass':'ifsc_bank','itemvalue':ifscbankname},
   {'itemclass':'ifsc_dist','itemvalue':ifscdistrictname}
  ]

for(let i=0; i<= ifscarr.length; i++){
 // console.log(ifscarr[i])
  if (document.getElementsByClassName(ifscarr[i].itemclass).length > 0) {
    let ifsc_branch_field: any = document.getElementsByClassName(ifscarr[i].itemclass)[0];
    let ifsc_branch_name:any = ifsc_branch_field.getAttribute('name');
  ifsc_branch_field.value = ifscarr[i].itemvalue;
  }
  this.modalService.dismissAll();
}


}


// ===============  GET IFSC CODE  =============== //

open(content:any) {

  this.modalService.open(content, {size: 'lg',backdrop: 'static',keyboard: false,ariaLabelledBy: 'modal-basic-title'}).result.then((result:any) => {
    //this.closeResult = `Closed with: ${result}`;
  }, (reason:any) => {
    //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  });
}
close(content:any) {

  this.modalService.open(content, {size: 'lg',backdrop: 'static',keyboard: false,ariaLabelledBy: 'modal-basic-title'}).result.then((result:any) => {
    //this.closeResult = `Closed with: ${result}`;
  }, (reason:any) => {
    //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  });
}
changestate(){
 // alert(0);
  $('.bind_block option:not(:first)').remove();
  $('.bind_village option:not(:first)').remove();

}

changeDistrict(e:any){
 //alert(0)
  //  let distval=e.target.value;
  //  $('.bind_block option:not(:first)').remove();
  //  $('.bind_village option:not(:first)').remove();
  // // let blockval:any=e.target.value;
  //  let stateval:any = $('.states').val();
  // this.getBlocks(distval,stateval);

  setTimeout(() => {
    let distval=e.target.value;
    $('.bind_block option:not(:first)').remove();
    $('.bind_village option:not(:first)').remove();
   // let blockval:any=e.target.value;
    let stateval:any = $('.states').val();
   this.getBlocks(distval,stateval);
  }, 500);

}
changeblock(e:any){
 // alert(0)
 // $('.bind_block option').remove();
  let blockval:any=e.target.value;
  let distval:any = $('.bind_district').val();

  this.getVillage(distval,blockval);

 }

 getBlocks(dist:any,state:any){
  let districtcode:any;
  let blockcode:any;
  $('.bind_village option:not(:first)').remove();

    let blocklist:any=[];
    let formParams =
    {
      "tableName":"BLOCK",
      "columnName":'BLOCKNAME,BLOCKCODE',
      "condition":"STATECODE="+state+" AND DISTRICTCODE="+dist
     };



     this.commonService.tableColumnFetch(formParams).subscribe((res:any)=>{

      if(res.status == 200){
      let getdynamicTbldataList:any=res.result;

        for(let j=0; j < getdynamicTbldataList.length; j++){
          let ctrlCCStaticValue=getdynamicTbldataList[j].BLOCKCODE;
          let ctrlCCStaticName=getdynamicTbldataList[j].BLOCKNAME;
         blocklist.push("<option value="+ctrlCCStaticValue+">"+ctrlCCStaticName+"</option>")

         }
         $('.bind_block').append(blocklist);
         let blokListDataValue:any = $('.bind_block').attr('data-bindvalue');
         if(blokListDataValue.length > 0)
          {
            $('.bind_block option[value='+blokListDataValue+']').attr('selected','selected');
           // var event = new Event('change');
         //  setTimeout(() => {
            let attrId:any = $('.bind_block').attr('id');
            let blockEle:any = document.getElementById(attrId)
            var event = new Event('change');
            blockEle.dispatchEvent(event);
         //  }, 100);
          }

       }
      // else{
      //  console.log(res.messages)
      //  }
       });


  }


getVillage(dist:any,block:any){
let districtcode:any;
let blockcode:any;
$('.bind_village option:not(:first)').remove();

  let villageslist:any=[];
  let formParams =
  {
    "tableName":"VILLAGE",
    "columnName":'VILLAGENAME,VILLAGECODE',
    "condition":"BLOCKCODE="+block+" AND DISTRICTCODE="+dist
   };



   this.commonService.tableColumnFetch(formParams).subscribe((res:any)=>{

    if(res.status == 200){
    let getdynamicTbldataList:any=res.result;

      for(let j=0; j < getdynamicTbldataList.length; j++){
        let ctrlCCStaticValue=getdynamicTbldataList[j].VILLAGECODE;
        let ctrlCCStaticName=getdynamicTbldataList[j].VILLAGENAME;
       villageslist.push("<option value="+ctrlCCStaticValue+">"+ctrlCCStaticName+"</option>")

       }
       $('.bind_village').append(villageslist);
       let bindVillageDataValue:any = $('.bind_village').attr('data-bindvalue');
       if(bindVillageDataValue.length > 0)
        {
          $('.bind_village option[value='+bindVillageDataValue+']').attr('selected','selected');
        }
   }

    // else{
    //  console.log(res.messages)
    //  }
     });


}
loadDependchkBoxDetails(chkbxDetails:any)

    {

      let chldDetlsDpnd :any =  document.querySelectorAll("[data-dependctrlId="+chkbxDetails.name+"]");

      for(let dpndx of chldDetlsDpnd)

        {

          if(dpndx.getAttribute('data-dependentvalue')!=chkbxDetails.value)

              {

                continue;

              }

                     dpndx.closest(".dynGridCls").classList.remove('d-none');

                    dpndx.closest(".dynGridCls").querySelector('.dynlabel').classList.remove('d-none');


                    dpndx.classList.remove('d-none');

                // dpndx.closest(".control-holder").querySelector('.form-group').classList.remove('d-none');



                    let lblEmnt = (<HTMLInputElement>document.getElementById(dpndx.id)).nextElementSibling;

                    lblEmnt?.classList.remove('d-none');

        }

    }

    functionValiduptoo(elmClass:any,elmVal:any)

       {




        if(elmClass == 'valid' )

        {

         if(this.valid !=1 && elmVal == ''){

        

      return false;

    }

        }

        return true;

       }


    public openPDF(): void {
      let DATA: any = document.getElementById('content');
      html2canvas(DATA).then((canvas) => {
        let fileWidth = 150;
        let fileHeight = (canvas.height * fileWidth) / canvas.width;
        const FILEURI = canvas.toDataURL('image/png');
        let PDF = new jsPDF('p', 'mm', 'a4');
        let position = 0;
        PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
        PDF.save('emp_data.pdf');
      });
    }

    Downlordpdf(){
      this.downlord;
      console.log(this.downlord);
      let navigationExtras: NavigationExtras = {
        state: {
          user: this.downlord,
          processid:this.processId,
          onlsid:this.onlineServiceId
        }
      };
      this.route.navigate(['application/downlordpreviewform'], navigationExtras);
    }

    removeMandetory(){

      setTimeout(() => {

        let ngrvdata:any= document.getElementsByClassName('board');

        let dynElem:any = (document.getElementsByClassName('valid'));










             for(let value of ngrvdata){




            console.log(value)




            value.addEventListener('change',()=>{










                console.log(value.value)




                if(value.value == 5){

                 // if(this.valid== 1){




                  this.valid=1;




             // let dynElem:any = (document.getElementsByClassName('valid'));




               console.log(dynElem[0].closest('.dynGridCls').querySelector('.text-danger').classList.add("d-none"));




               let dynElemm:any = (document.getElementsByClassName('acclev'));




               console.log(dynElemm[0].closest('.dynGridCls').querySelector('.text-danger').classList.add("d-none"));




               let dynElemmm:any = (document.getElementsByClassName('accnum'));




               console.log(dynElemmm[0].closest('.dynGridCls').querySelector('.text-danger').classList.add("d-none"));










                 // }

                }

                if(value.value == 4){

                  //if(this.valid== 1){




                  this.valid=1;




            //  let dynElem:any = (document.getElementsByClassName('valid'));




               console.log(dynElem[0].closest('.dynGridCls').querySelector('.text-danger').classList.add("d-none"));




               let dynElemm:any = (document.getElementsByClassName('acclev'));




               console.log(dynElemm[0].closest('.dynGridCls').querySelector('.text-danger').classList.add("d-none"));




               let dynElemmm:any = (document.getElementsByClassName('accnum'));




               console.log(dynElemmm[0].closest('.dynGridCls').querySelector('.text-danger').classList.add("d-none"));

                //  }

                 console.log(this.valid);

                }




                if(value.value == 1){




                  if(this.valid== 1){




                  this.valid=0;




             // let dynElem:any = (document.getElementsByClassName('valid'));




               console.log(dynElem[0].closest('.dynGridCls').querySelector('.text-danger').classList.remove("d-none"));




               let dynElemm:any = (document.getElementsByClassName('acclev'));




               console.log(dynElemm[0].closest('.dynGridCls').querySelector('.text-danger').classList.remove("d-none"));




               let dynElemmm:any = (document.getElementsByClassName('accnum'));




               console.log(dynElemmm[0].closest('.dynGridCls').querySelector('.text-danger').classList.remove("d-none"));
















                }




              }

              if(value.value == 2){




                if(this.valid== 1){




                this.valid=0;




           // let dynElem:any = (document.getElementsByClassName('valid'));




             console.log(dynElem[0].closest('.dynGridCls').querySelector('.text-danger').classList.remove("d-none"));




             let dynElemm:any = (document.getElementsByClassName('acclev'));




             console.log(dynElemm[0].closest('.dynGridCls').querySelector('.text-danger').classList.remove("d-none"));




             let dynElemmm:any = (document.getElementsByClassName('accnum'));




             console.log(dynElemmm[0].closest('.dynGridCls').querySelector('.text-danger').classList.remove("d-none"));










              }




            }

            if(value.value == 3){




              if(this.valid== 1){




              this.valid=1;




          //let dynElem:any = (document.getElementsByClassName('valid'));




           console.log(dynElem[0].closest('.dynGridCls').querySelector('.text-danger').classList.remove("d-none"));




           let dynElemm:any = (document.getElementsByClassName('acclev'));




           console.log(dynElemm[0].closest('.dynGridCls').querySelector('.text-danger').classList.remove("d-none"));




           let dynElemmm:any = (document.getElementsByClassName('accnum'));




           console.log(dynElemmm[0].closest('.dynGridCls').querySelector('.text-danger').classList.remove("d-none"));










            }




          }

            })




             }







           }, 3000);

          }


}
