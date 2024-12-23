import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { JwtService } from 'src/app/services/jwt.service';
import { saveHighEndDrugs, getImplantName, getAllHighEndDrugs, getHighEndDrugsById, deleteHighEndDrugsById, updateHighEndDrugsById, getWardName, getImplantCode, checkDuplicateDrugCode } from 'src/app/services/api-config';

@Injectable({
  providedIn: 'root'
})
export class HighEndDrugsService {

  constructor(private http: HttpClient, private jwtService: JwtService) { }

  getImplantName(){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl =getImplantName;
    return this.http.get(fullUrl,options)

  }
  getWardName(){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
      .append('action', "A");
    let options = {
      headers: headers,
      params: queryparams
    };
    var fullUrl =getWardName;
    return this.http.get(fullUrl,options)
  }
  getImplantCode(wardCategoryId){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
      .append('action', "B")
      .append('wardCategoryId',wardCategoryId);
    let options = {
      headers: headers,
      params: queryparams
    };
    var fullUrl =getImplantCode;
    return this.http.get(fullUrl,options)

  }

  saveHighEndDrugs(item:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl =saveHighEndDrugs;
    return this.http.post(fullUrl,item,options)

  }
  getAllHighEndDrugs(){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl =getAllHighEndDrugs;
    return this.http.get(fullUrl,options)

  }
  getHighEndDrugsById(id:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl =getHighEndDrugsById+`/${id}`;
    return this.http.get(fullUrl,options)

  }
  deleteHighEndDrugsById(id:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl =deleteHighEndDrugsById+`/${id}`;
    return this.http.delete(fullUrl,options)
  }

  updateHighEndDrugsById(data:any,id){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl =updateHighEndDrugsById+`/${id}`;
    return this.http.put(fullUrl,data,options)
  }
  checkDuplicateDrugCode(drugCode:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
    .append('drugCode',drugCode )
    //.append('implantCode',implantCode);
    let options = {
      headers: headers,
      params: queryparams
    };
    let token = this.jwtService.getJwtToken();
    let fullUrl = checkDuplicateDrugCode;
    return this.http.get(fullUrl, options);
  }
}
  

