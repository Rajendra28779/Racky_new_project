import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getallcpdremarks, getcpdremarkById, saveCpdremark, updateCpdRemarkData } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class CpdremarkService {

  getbyId(id: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let token = this.jwtService.getJwtToken();
    let fullUrl = getcpdremarkById + "?id=" +id;
    return this.http.get(fullUrl, options);
  }
 

  constructor(private http: HttpClient, private jwtService: JwtService) { }


  saveCpdRemark(object: { remarks: string; }) {
    
   
    // alert("Data in service========"+ JSON.stringify(object));
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    // console.log("bankName : " + object.remarks)
    let options = {
      headers:headers
    }
    let token = this.jwtService.getJwtToken();
    var fullUrl = saveCpdremark;
    //console.log(this.httpclient.get(fullUrl,options));
    return this.http.post(fullUrl,object,options);
  }



  getallRemarkData() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    
    var fullUrl =getallcpdremarks;
    return this.http.get(fullUrl,options)
  }

  updateCpdRemark(object: { remarks: string, id: any; }) {
    console.log("upfate data comes in service"+object);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl =updateCpdRemarkData;
    return this.http.post(fullUrl,object,options);
  }

}
