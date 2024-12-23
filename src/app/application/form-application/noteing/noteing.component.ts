import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { EncrypyDecrpyService } from 'src/app/services/form-services/encrypy-decrpy.service';
import { ViewAppListService } from 'src/app/services/form-services/view-app-list.service';
import {Location} from '@angular/common';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-noteing',
  templateUrl: './noteing.component.html',
  styleUrls: ['./noteing.component.scss']
})
export class NoteingComponent implements OnInit {
  title: any="Action History";
  tempurl=environment.tempUrl;
  tablist: any;
  tabDataId: any;
  utillist: any;
  messaageslist: any;
  jsonurl="assets/js/_configs/noting.config.json";
  loading:any=false;
  noteingList:any;
  formid:any;
  serviceid:any;
  tempurlForApproval=environment.tempUrlForApproval;
  constructor( private route: Router,
    private httpClient: HttpClient,
    private router: ActivatedRoute,
    public encDec : EncrypyDecrpyService,
    private appListService: ViewAppListService,
     private _location: Location) { }

  ngOnInit(): void {
    let encSchemeId = this.router.snapshot.paramMap.get('id');
   
      if(encSchemeId != ""){
        let schemeStr = this.encDec.decText(encSchemeId);
      console.log(schemeStr)
        let schemeArr       = schemeStr.split(':');
        this.formid         = schemeArr[0];
        this.serviceid      = schemeArr[1];
        this.getnotingList(this.formid,this.serviceid,'')
      }
    



  }
  loadconfig() {
    this.httpClient.get<any>(this.jsonurl).subscribe((data: any) => {
      this.tablist = data[0].tabList;
      let encSchemeId = this.router.snapshot.paramMap.get('id');
      if (encSchemeId != '') {
        this.tablist = this.tablist.map((v: any) =>
          Object.assign(v, { id: encSchemeId })
        );
      }
      this.utillist = data[0].utils;
      this.messaageslist = data[0].messages;
      this.title = this.multilingual(data[0].pagetitle);
    });
  }
  multilingual(test:any)
  {
  return test;
  }


  getnotingList(processId:any,serviceId:any,staus:any){

 
    let param = {"processId":processId,"serviceId":serviceId,"status":staus };
    this.appListService.getNoteing(param).subscribe((res) => {
      if(res.length > 0){
        this.noteingList = res;
       
      }
      

   
    });
  }
  
  backClicked(){
    this._location.back();
  }
}
