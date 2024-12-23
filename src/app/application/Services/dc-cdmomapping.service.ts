import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtService } from 'src/app/services/jwt.service';
import {allowforregeotag, allowhospitalmobileactivity, allowhospitalmobileactivitylist, downLoaddcuploadDoc, getconfiggroupalldata,
 getconfiggroupdata, getconfigGroupList, getdccdmologdata, getdccdmomapcount, getdccdmomaplist, getdcfacelist,
 getdcgovthospmapcount, getdctaggeddetails, getfacelogdetails, getmapingbydcid, getmappedgovthospbydcid,
 getmobileattendancemaster, getuserDetailsbygroup, getusermobileconfiglist, getusermobiletrackingconfiglist, getusermobiletrackingconfigloglist, removefacedataofdc,
 saveDcCdmomapping, saveDcHospitalmapping, savegroupmobilemast, savegroupwisemobileconfig,
 savemobileattendancemaster, savetrackingconfiglist, saveusermobileconfig, taggedHOSDClogdetails, taggedlogdetails,
 updateDcCdmomapping, updateDcHospitalmapping, updatemobileattendancemaster} from 'src/app/services/api-config';
import { AnyObject } from 'chart.js/types/basic';
import { AnyAaaaRecord } from 'dns';

@Injectable({
  providedIn: 'root'
})
export class DcCdmomappingService {

    constructor(private http: HttpClient,private jwtService: JwtService) { }

  getuserDetailsbygroup(groupid:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params:{
        "groupid":groupid
      }
    }
    let fullUrl = getuserDetailsbygroup;
    return this.http.get(fullUrl,options)
  }

  saveDcCdmomapping(object: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    let fullUrl = saveDcCdmomapping;
    return this.http.post(fullUrl,object,options)
  }

  getdccdmomaplist(dcid:any,group:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params:{
        "dcId":dcid,
        "group":group
      }
    }
    let fullUrl = getdccdmomaplist;
    return this.http.get(fullUrl,options)
  }

  getmapingbydcid(dcid: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params:{
        "dcId":dcid
      }
    }
    let fullUrl = getmapingbydcid;
    return this.http.get(fullUrl,options)
  }

  updateDcCdmomapping(object:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    let fullUrl = updateDcCdmomapping;
    return this.http.post(fullUrl,object,options)
  }

  getdccdmomapcount(dcUserId: any,group:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params:{
        "dcId":dcUserId,
        "group":group
      }
    }
    let fullUrl = getdccdmomapcount;
    return this.http.get(fullUrl,options)
  }

  taggedlogdetails(dcuserid: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params:{
        "dcId":dcuserid
      }
    }
    let fullUrl = taggedlogdetails;
    return this.http.get(fullUrl,options)
  }

  saveDcHospitalmapping(object:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    let fullUrl = saveDcHospitalmapping;
    return this.http.post(fullUrl,object,options)
  }

  getdcgovthospmapcount(dcUserId: any,group:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params:{
        "dcId":dcUserId,
        "group":group
      }
    }
    let fullUrl = getdcgovthospmapcount;
    return this.http.get(fullUrl,options)
  }

  getmappedgovthospbydcid(dcid: any,group:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params:{
        "dcId":dcid,
        "group":group
      }
    }
    let fullUrl = getmappedgovthospbydcid;
    return this.http.get(fullUrl,options)
  }

  taggedHOSDClogdetails(dcuserid: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params:{
        "dcId":dcuserid
      }
    }
    let fullUrl = taggedHOSDClogdetails;
    return this.http.get(fullUrl,options)
  }

  updateDcHospitalmapping(object:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    let fullUrl = updateDcHospitalmapping;
    return this.http.post(fullUrl,object,options)
  }

  getdcfacelist(dcUserId: any,group:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params:{
        dcUserId:dcUserId,
        group:group
      }
    }
    let fullUrl = getdcfacelist;
    return this.http.get(fullUrl,options)
  }

  getdctaggeddetails(dcId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params:{
        dcUserId:dcId
      }
    }
    let fullUrl = getdctaggeddetails;
    return this.http.get(fullUrl,options)
  }

  removefacedataofdc(faceid: any,userid:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params:{
        faceid:faceid,
        userid:userid
      }
    }
    let fullUrl = removefacedataofdc;
    return this.http.get(fullUrl,options)
  }

  getfacelogdetails(dcId: any,group:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params:{
        dcUserId:dcId,
        group:group
      }
    }
    let fullUrl = getfacelogdetails;
    return this.http.get(fullUrl,options)
  }

  allowhospitalmobileactivitylist() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    let fullUrl = allowhospitalmobileactivitylist;
    return this.http.get(fullUrl,options)
  }

  allowhospitalmobileactivity(allowlist: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
    }
    let object = {
      allowlist:allowlist,
    }
    let fullUrl = allowhospitalmobileactivity;
    return this.http.post(fullUrl,object,options)
  }

  savegroupmobilemast(object:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
    }
    let fullUrl = savegroupmobilemast;
    return this.http.post(fullUrl,object,options)
  }

  getconfigGroupList() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
    }
    let fullUrl = getconfigGroupList;
    return this.http.get(fullUrl,options)
  }

  getconfiggroupdata(userId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params:{
        userId:userId
      }
    }
    let fullUrl = getconfiggroupdata;
    return this.http.get(fullUrl,options)
  }

  getconfiggroupalldata() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
    }
    let fullUrl = getconfiggroupalldata;
    return this.http.get(fullUrl,options)
  }


  saveusermobileconfig(object: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
    }
    let fullUrl = saveusermobileconfig;
    return this.http.post(fullUrl,object,options)
  }

  savegroupwisemobileconfig(object: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
    }
    let fullUrl = savegroupwisemobileconfig;
    return this.http.post(fullUrl,object,options)
  }

  getusermobileconfiglist(userId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params:{
        userId:userId
      }
    }
    let fullUrl = getusermobileconfiglist;
    return this.http.get(fullUrl,options)
  }

  savemobileattendancemaster(object: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    let fullUrl = savemobileattendancemaster;
    return this.http.post(fullUrl,object,options)
  }
  getmobileattendancemaster() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    let fullUrl = getmobileattendancemaster;
    return this.http.get(fullUrl,options)
  }

  updatemobileattendancemaster(object: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    let fullUrl = updatemobileattendancemaster;
    return this.http.post(fullUrl,object,options)
  }

  downLoaddcuploadDoc(docpath: any,action:any) {
    let jsonObj = {
      f: docpath,
      a: action,
    };
    let jsonString = JSON.stringify(jsonObj);
    let queryParam = btoa(jsonString);
    let url = downLoaddcuploadDoc + '?' + 'data=' + queryParam;
    return url;

  }
  getdccdmologdata(dcUserId: any, userId: any,action:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params:{
        userId:userId,
        dcUserId:dcUserId,
        action:action
      }
    }
    let fullUrl = getdccdmologdata;
    return this.http.get(fullUrl,options);
  }

  allowforregeotag(dcUserId: any, userid: any, action: any,createdby:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params:{
        userId:userid,
        dcUserId:dcUserId,
        action:action,
        actionby:createdby
      }
    }
    let fullUrl = allowforregeotag;
    return this.http.get(fullUrl,options);
  }
  getusermobiletrackingconfiglist(groupid: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params:{
        groupid:groupid
      }
    }
    let fullUrl = getusermobiletrackingconfiglist;
    return this.http.get(fullUrl,options);
  }

  savetrackingconfiglist(formData: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    let fullUrl = savetrackingconfiglist;
    return this.http.post(fullUrl,formData,options);
  }

  getusermobiletrackingconfigloglist(userId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params:{
        userId:userId
      }
    }
    let fullUrl = getusermobiletrackingconfigloglist;
    return this.http.get(fullUrl,options);
  }

}
