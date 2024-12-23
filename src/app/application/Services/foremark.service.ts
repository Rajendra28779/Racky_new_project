import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { saveforemark,getforemark,updateforemark, updatemstdoc, savemstdoc, getalldocumentlist } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class ForemarkService {



  constructor(private http: HttpClient, private jwtService: JwtService) { }
  save(object:any)
  {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    let fullUrl = saveforemark;
    return this.http.post(fullUrl,object,options)
  }

  update(object: { remark: string; createdBy: any; description: string; remarkid: any; }) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    let fullUrl = updateforemark;
    return this.http.post(fullUrl,object,options)
  }

  getalldata() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    let fullUrl = getforemark;
    return this.http.get(fullUrl,options)
  }
  getActivateData() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    let fullUrl = getforemark;
    return this.http.get(fullUrl,options)
  }

  updatemstdoc(object: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    let fullUrl = updatemstdoc;
    return this.http.post(fullUrl,object,options)
  }
  savemstdoc(object: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    let fullUrl = savemstdoc;
    return this.http.post(fullUrl,object,options)
  }

  getalldocumentlist() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    let fullUrl = getalldocumentlist;
    return this.http.get(fullUrl,options)
  }

}
