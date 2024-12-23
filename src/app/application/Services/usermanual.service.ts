import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import {
    getPrimarylinkname,
    getSearchdata,
    getSpecialitydetails,
    getSubmitdata,
    getallviewlist,
    getdetailshospitaldoctorprifile,
    gethospitaldatabystate,
    getlinklistdata,
    getlistGrouptype,
    getusermanuallreportsave,
    usermanuladoc,
    gethospitladoctordetailsprofile,
    getEditDoctorprofiledata,
    getclaimmultipledoctortreated,
    getDoctorTaggedHospital,
    getDoctortreatedhospital
} from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class UsermanualService {

  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute, private jwtService: JwtService) { }

  getgrouptyes(){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers:headers
    }
    let fullUrl = getlistGrouptype;
    return this.http.get(fullUrl, options);
  }
  getprimarylink(grouptype:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers:headers,
      params:{
        'grouptype':grouptype
      }
    }
    let fullUrl = getPrimarylinkname;
    return this.http.get(fullUrl, options);
  }
  getsubmit(data:FormData):Observable<any>{
    console.log(data);
    let headers = new HttpHeaders({
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers:headers
    }
    let fullUrl = getusermanuallreportsave;
    return this.http.post(fullUrl,data, options);
  }
  getallviewdetails(userid:any)
  {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers:headers,
      params:{
        'userid':userid
      }
    }
    let fullUrl = getallviewlist;
    return this.http.get(fullUrl, options);
  }
  downloadFiles(fileName:any,type:any) {
    let jsonObj = {
      f: fileName,
      t: type
    };
    let jsonString = JSON.stringify(jsonObj);
    let queryParam = btoa(jsonString);
    let fullUrl = usermanuladoc + '?' + 'data=' + queryParam;
    return fullUrl;
  }
  getlist(groupid:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers:headers,
      params:{
        'userid':groupid
      }
    }
    let fullUrl = getlinklistdata;
    return this.http.get(fullUrl, options);
  }
  getsearchdata(primarylinkid:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers:headers,
      params:{
        'primarylinkid':primarylinkid
      }
    }
    let fullUrl = getSearchdata;
    return this.http.get(fullUrl, options);
  }
  gethospitalbystae(hospitalcode:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers:headers,
      params:{
        'hospitalcode':hospitalcode
      }
    }
    let fullUrl = gethospitaldatabystate;
    return this.http.get(fullUrl, options);
  }
  getSpeciality(hospitalCode){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers:headers,
      params:{
        'hospitalcode':hospitalCode
      }
    }
    let fullUrl = getSpecialitydetails;
    return this.http.get(fullUrl, options);
  }
  getSubmitdata(requestData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
    }
    let fullUrl = getSubmitdata;
    return this.http.post(fullUrl,requestData,options)
  }
  getviewdetailsfoprofile(statecode,districtcode,hospitalcode,hospitalCode,userid){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers:headers,
      params:{
        'statecode':statecode,
        'districtcode':districtcode,
        'hospitalcode':hospitalcode,
        'hospitalCode':hospitalCode,
        'userid':userid,
      }
    }
    let fullUrl = getdetailshospitaldoctorprifile;
    return this.http.get(fullUrl, options);
  }
  getdetailshistory(profilid:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let params = {
      "profilid": profilid
    }
    let options = {
      headers:headers,
      params:params
    }
    var fullUrl = gethospitladoctordetailsprofile;
    return this.http.get(fullUrl,options)
  }
  detailsdata(profilid:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let params = {
      "profilid": profilid
    }
    let options = {
      headers:headers,
      params:params
    }
    var fullUrl = getEditDoctorprofiledata;
    return this.http.get(fullUrl,options)
  }
  getdetailshistorydata(){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl = getclaimmultipledoctortreated;
    return this.http.get(fullUrl,options)
  }
  gettagggedhospital(regno:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let params = {
      "regno": regno
    }
    let options = {
      headers:headers,
      params:params
    }
    var fullUrl = getDoctorTaggedHospital;
    return this.http.get(fullUrl,options)
  }
  gettreatedHospital(regno:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let params = {
      "regnonumber": regno
    }
    let options = {
      headers:headers,
      params:params
    }
    var fullUrl = getDoctortreatedhospital;
    return this.http.get(fullUrl,options)
  }
}
