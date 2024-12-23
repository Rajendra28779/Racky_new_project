import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtService } from 'src/app/services/jwt.service';
import { saveward, getallward, deleteward, updateward, getbyward, checkDuplicatewardname, checkDuplicatewardcode, gethospitalcategory, getallwardcategoryMaster, getPackageDescription } from 'src/app/services/api-config';
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class WardMasterService {

  constructor(private http: HttpClient, private jwtService: JwtService) { }
  save(items: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    var fullUrl = saveward;
    return this.http.post(fullUrl, items, options)
  }
  getalldata() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    var fullUrl = getallward;
    return this.http.get(fullUrl, options)
  }
  deleteward(id: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let token = this.jwtService.getJwtToken();
    var fullUrl = deleteward + `/${id}`;

    return this.http.delete(fullUrl, options)

  }
  updateward(data: any, id: string): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let token = this.jwtService.getJwtToken();
    var fullUrl = updateward + `/${id}`;
    return this.http.put(fullUrl, data, options)
  }
  getbywardId(id: string): Observable<any> {

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let token = this.jwtService.getJwtToken();
    var fullUrl = getbyward + `/${id}`;
    return this.http.get(fullUrl, options)
  }
  checkDuplicateData(wardName: any): Observable<any> {

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    };
    let token = this.jwtService.getJwtToken();
    let fullUrl = checkDuplicatewardname + "?wardName=" + wardName;
    return this.http.get(fullUrl, options);
  }
  checkDuplicateWardCode(wardCode: any): Observable<any> {

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    };
    let token = this.jwtService.getJwtToken();
    let fullUrl = checkDuplicatewardcode + "?wardCode=" + wardCode;
    return this.http.get(fullUrl, options);
  }

  getallHospitalCategory() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    var fullUrl = gethospitalcategory;
    return this.http.get(fullUrl, options)
  }
  getallWardCategorydata() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    var fullUrl = getallwardcategoryMaster;
    return this.http.get(fullUrl, options)
  }

  getPackagdescription(hospitalcategoryid){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params: {
        "hospitalCategoryId":hospitalcategoryid
      }
    }
    var fullUrl =getPackageDescription;
    return this.http.get(fullUrl,options)

  }
}
