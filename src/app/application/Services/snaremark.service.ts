import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getallsnaremarks, getsnaremarkById, savesnaremark, updatesnaRemarkData } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class SnaremarkService {




  constructor(private http: HttpClient, private jwtService: JwtService) { }

  saveSnaRemark(object: { remarks: string; }) {
    // alert("Data in service========"+ JSON.stringify(object));
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    console.log("bankName : " + object.remarks)
    let options = {
      headers: headers
    }
    let token = this.jwtService.getJwtToken();
    var fullUrl = savesnaremark;
    //console.log(this.httpclient.get(fullUrl,options));
    return this.http.post(fullUrl, object, options);
  }


  getallsnaRemarkData() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    } 
    var fullUrl =getallsnaremarks;
    return this.http.get(fullUrl,options)
  }


  getbyId(id: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let token = this.jwtService.getJwtToken();
    let fullUrl = getsnaremarkById + "?id=" +id;
    return this.http.get(fullUrl, options);
  }


  updatesnaRemark(object: { remarks: any; id: any; statusFlag: any; }) {
    console.log("upfate data comes in service"+object);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl =updatesnaRemarkData;
    return this.http.post(fullUrl,object,options);
  }
 
}
