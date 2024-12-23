import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtService } from 'src/app/services/jwt.service';
import { Observable } from 'rxjs';
import { savepackageheader, getpackageheader, deletepackageheader, updatepackageheader, getbypackageheader, checkDuplicateheadername, checkDuplicatepackageheadercode, activepackageheader } from 'src/app/services/api-config';

@Injectable({
  providedIn: 'root'
})
export class PackageHeaderService {

  constructor(private http: HttpClient, private jwtService: JwtService) { }
  save(items:any)
  {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl =savepackageheader;
    return this.http.post(fullUrl,items,options)
  }
  getalldata() {
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
  deletepackageheader(id : any): Observable<any>{
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    let token = this.jwtService.getJwtToken();
    var fullUrl = deletepackageheader+`/${id}`  ;

    return this.http.delete(fullUrl,options)

  }
  activepackageheader(id : any,userid : any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params:{
        "headerId":id,
        "userid":userid
      }
    }
    let token = this.jwtService.getJwtToken();
    var fullUrl = activepackageheader;
    return this.http.get(fullUrl,options)

  }
  updatepackageheader(data:any,id:string): Observable<any>{
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    let token = this.jwtService.getJwtToken();
    var fullUrl =updatepackageheader+`/${id}`;
    return this.http.put(fullUrl,data,options)


  }
  getbypackageHeader(id :string): Observable<any>{

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    let token = this.jwtService.getJwtToken();
    var fullUrl =getbypackageheader+`/${id}`;
    return this.http.get(fullUrl,options)
  }

  checkDuplicateData(packageheadername: any): Observable<any> {

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    };
    let token = this.jwtService.getJwtToken();
    let fullUrl = checkDuplicateheadername + "?packageheadername=" + packageheadername;
    return this.http.get(fullUrl, options);
  }
  checkDuplicateDatapackageheadercode(packageheadercode: any): Observable<any> {

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    };
    let token = this.jwtService.getJwtToken();
    let fullUrl = checkDuplicatepackageheadercode + "?packageheadercode=" + packageheadercode;
    return this.http.get(fullUrl, options);
  }
}
