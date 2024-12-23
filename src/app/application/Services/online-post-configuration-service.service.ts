import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { downLoadonlinepostDoc, getonlinepostconfigbyid, getonlinepostconfiglist, getpostnamebyid, savepostconfig, updateonlinepostconfig } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class OnlinePostConfigurationServiceService {

  constructor(private httpclient: HttpClient,private jwtService: JwtService) { }
  getpostnamebypostid(){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    let token = this.jwtService.getJwtToken();
    var fullUrl =getpostnamebyid;
    // return this.httpclient.get(fullUrl, options)
    return this.httpclient.get(fullUrl,options)
  }
  saveonlinepostconfig(object: any){
    let headers = new HttpHeaders({
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    let fullUrl = savepostconfig;
    return this.httpclient.post(fullUrl,object,options)
  }
  getonlinepostname(){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl =getonlinepostconfiglist;
    return this.httpclient.get(fullUrl,options)
  }
  downloadFile(fileName) {
    console.log("hi");

    let jsonObj = {
      f: fileName,
    };
    let jsonString = JSON.stringify(jsonObj);
    let queryParam = btoa(jsonString);
    let url = downLoadonlinepostDoc + '?' + 'data=' + queryParam;
    return url;
  }

  getbypostconfigid(user: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params: {
        'configid': user,
      }
    }
    var fullUrl =getonlinepostconfigbyid;
    return this.httpclient.get(fullUrl,options)
  }
  updateonlinepostconfig(object:any){
    let headers = new HttpHeaders({
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    let fullUrl = updateonlinepostconfig;
    return this.httpclient.post(fullUrl,object,options)
  }
  }

