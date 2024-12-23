import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { JwtService } from 'src/app/services/jwt.service';
import { deletesubgroupbyid, getgroupname, getsubgroupbyid, getsubgrouplist, savesubgroup, updatesubgroup } from 'src/app/services/api-config';

@Injectable({
  providedIn: 'root'
})
export class SubgroupserviceService {

  constructor(private httpclient: HttpClient,private jwtService: JwtService) { }

  getGroupname(){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    let token = this.jwtService.getJwtToken();
    var fullUrl =getgroupname;
    // return this.httpclient.get(fullUrl, options)
    return this.httpclient.get(fullUrl,options)
  }

  getallsubgroup(){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    let token = this.jwtService.getJwtToken();
    var fullUrl = getsubgrouplist;
    return this.httpclient.get(fullUrl,options)
  }
  updatet(items: any,groupid:any) {

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
     let fullUrl =updatesubgroup+'?groupid='+groupid+'&subgroupname='+items.subgroupname+'&updateby='+items.updateby+"&subgroupid="+items.subgroupid+"&status="+items.status;
    return this.httpclient.get(fullUrl,options);
  }
  getbyid(subgroupid: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    let fullUrl =getsubgroupbyid+'?subgroupid='+subgroupid;
    return this.httpclient.get(fullUrl,options)
  }
  delete(subgroupid:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    let fullUrl =deletesubgroupbyid+'?subgroupid='+subgroupid;
   return this.httpclient.get(fullUrl,options)
  }
  savesubgroup(subgroup:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    let fullUrl =savesubgroup+'?groupid='+subgroup.groupid+'&subgroupname='+subgroup.subgroupname+'&createdby='+subgroup.createdby
   return this.httpclient.get(fullUrl,options)
  }


}
