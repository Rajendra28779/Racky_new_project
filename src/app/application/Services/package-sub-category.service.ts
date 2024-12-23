import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtService } from 'src/app/services/jwt.service';
import { Observable } from 'rxjs';
import { savepackagesubcategory, getpackagesubcategory, deletepackagesubcategory, getbypackagesubcategory, updatepackagesubcategory, checkDuplicatesubcategoryname, checkDuplicatesubcategorycode, activepackagesubcategory } from 'src/app/services/api-config';

@Injectable({
  providedIn: 'root'
})
export class PackageSubCategoryService {

  constructor(private http: HttpClient, private jwtService: JwtService) { }

  save(items: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    var fullUrl = savepackagesubcategory;
    return this.http.post(fullUrl, items, options)
  }

  getAllpackageSubCatagory() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    var fullUrl = getpackagesubcategory;
    return this.http.get(fullUrl, options)
  }

  deletepackagesubcategory(id: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let token = this.jwtService.getJwtToken();
    var fullUrl = deletepackagesubcategory + `/${id}`;
    return this.http.delete(fullUrl, options)
  }

  activepackagesubcategory(id: any,userid:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers,
      params:{
        "subcategory":id,
        "userid":userid
      }
    }
    var fullUrl = activepackagesubcategory;
    return this.http.get(fullUrl, options)
  }

  getbyPackagesubcategory(id: string): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let token = this.jwtService.getJwtToken();
    var fullUrl = getbypackagesubcategory + `/${id}`;
    return this.http.get(fullUrl, options)
  }

  updatePackagesubcategory(data: any, id: string): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let token = this.jwtService.getJwtToken();
    var fullUrl = updatepackagesubcategory + `/${id}`;
    return this.http.put(fullUrl, data, options)
  }

  checkDuplicateData(packagesubcategoryname: any): Observable<any> {

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    };
    let token = this.jwtService.getJwtToken();
    let fullUrl = checkDuplicatesubcategoryname + "?packagesubcategoryname=" + packagesubcategoryname;
    return this.http.get(fullUrl, options);
  }
  checkDuplicatesubcategorycode(packagesubcategorycode: any): Observable<any> {

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    };
    let token = this.jwtService.getJwtToken();
    let fullUrl = checkDuplicatesubcategorycode + "?packagesubcategorycode=" + packagesubcategorycode;
    return this.http.get(fullUrl, options);
  }
}
