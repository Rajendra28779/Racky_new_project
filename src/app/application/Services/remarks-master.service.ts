import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtService } from 'src/app/services/jwt.service';
import { Observable } from 'rxjs';
import { saveremark, getallremarks, updateremark, getbyremark } from 'src/app/services/api-config';

@Injectable({
  providedIn: 'root'
})
export class RemarksMasterService {

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
    var fullUrl =saveremark;
    return this.http.post(fullUrl,items,options)
  }
  getallRemarkData() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl =getallremarks;
    return this.http.get(fullUrl,options)
  }
  updateRemark(data:any,id:string): Observable<any>{
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    let token = this.jwtService.getJwtToken();
    var fullUrl =updateremark+`/${id}`;
    return this.http.put(fullUrl,data,options)


  }
  getbyRemark(id :string): Observable<any>{
  
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    let token = this.jwtService.getJwtToken();
    var fullUrl =getbyremark+`/${id}`;
    return this.http.get(fullUrl,options)
  }

}
