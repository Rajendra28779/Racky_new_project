import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { JwtService } from 'src/app/services/jwt.service';
import {  getPackageDetailsDescription, saveHospitalPackageMapping, getAllHospitalPackageMapping, getByHospitalpackageMappingId, deleteHospitalMappingById, updateHospitalMappingById, getpackageheader, getPackageSubcategory, getAlldetailsmosarkar, getschemepackagelistbyhospitalid, updateschemepackage, getschemehospitalmappingrpt } from 'src/app/services/api-config';

@Injectable({
  providedIn: 'root'
})
export class HospitalPackageMappingService {

  constructor(private http: HttpClient, private jwtService: JwtService) { }

  getallPackageHeaders() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl =getpackageheader;
    return this.http.get(fullUrl,options)
  }
  getPackageDetailsDescription(packageSubcategoryId:any,hospitalcategoryid){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params: {
        "packageSubcategoryId": packageSubcategoryId,
        "hospitalcategoryid":1
      }
    }
    var fullUrl =getPackageDetailsDescription;
    return this.http.get(fullUrl,options)

  }
  saveHospitalPackageMapping(item:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl =saveHospitalPackageMapping;
    return this.http.post(fullUrl,item,options)

  }
  getAllHospitalPackageMapping(){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl =getAllHospitalPackageMapping;
    return this.http.get(fullUrl,options)

  }
  getByHospitalpackageMappingId(id:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl =getByHospitalpackageMappingId+`/${id}`;
    return this.http.get(fullUrl,options)

  }
  deleteHospitalMappingById(id){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl =deleteHospitalMappingById+`/${id}`;
    return this.http.delete(fullUrl,options)

  }
  updateHospitalMappingById(data:any,id){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl =updateHospitalMappingById+`/${id}`;
    return this.http.put(fullUrl,data,options)

  }
  getPackageSubcategory(headerCode:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params: {
        "packageheadercode": headerCode
      }
    }
    var fullUrl =getPackageSubcategory;
    return this.http.get(fullUrl,options)
  }

  getmosarkardetails(fromDate:any,toDate:any,serachtype:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params: {
        "fromDate": fromDate,
        "toDate": toDate,
        "serachtype":serachtype
      }
    }
    var fullUrl =getAlldetailsmosarkar;
    return this.http.get(fullUrl,options)
  }

  getschemepackagelistbyhospitalid(hospitalId: any, userId: any,schemecatagory:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params: {
        "hospitalCode": hospitalId,
        "userId": userId,
        "schemeid":schemecatagory
      }
    }
    var fullUrl =getschemepackagelistbyhospitalid;
    return this.http.get(fullUrl,options)
  }

  updateschemepackage(object: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl =updateschemepackage;
    return this.http.post(fullUrl,object,options)
  }

  getschemehospitalmappingrpt(state: any, dist: any, schemecatagory: any, hospitalId: any, userId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params: {
        "state": state,
        "dist": dist,
        "hospitalCode": hospitalId,
        "userId": userId,
        "schemeid":schemecatagory
      }
    }
    var fullUrl =getschemehospitalmappingrpt;
    return this.http.get(fullUrl,options);
  }


}
