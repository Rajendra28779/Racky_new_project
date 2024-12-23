import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {savemedicalinfracat, medicalinfracatlist, medicalinfracatdatabyid, updatemedicalinfracat } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class MedicalinfracatservService {

  constructor(private http: HttpClient, private jwtService: JwtService) { }


  savecategory(items: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let token = this.jwtService.getJwtToken();
    let fullUrl = savemedicalinfracat

    return this.http.post(fullUrl, items, options);
  }



  getMedicalCategoryList() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let token = this.jwtService.getJwtToken();
    let fullUrl = medicalinfracatlist
    return this.http.get(fullUrl, options);

  }

  getbyid(user: any) {
    console.log("Id comes in service"+user);
    
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params: {
        'medInfracatId': user,

      }
    }
    let token = this.jwtService.getJwtToken();
    let fullUrl = medicalinfracatdatabyid;
    return this.http.get(fullUrl, options);

  }


  updateMedicalInfraCategory(items: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let token = this.jwtService.getJwtToken();
    let fullUrl = updatemedicalinfracat;
    return this.http.post(fullUrl, items, options);

  }
}
