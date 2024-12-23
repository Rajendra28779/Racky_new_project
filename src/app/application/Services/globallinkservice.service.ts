import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtService } from 'src/app/services/jwt.service';
import { savegloballink,getgloballink,deletegloballink, getgloballinkbyid,updategloballink } from 'src/app/services/api-config';

@Injectable({
  providedIn: 'root'
})
export class GloballinkserviceService {




  constructor(private http: HttpClient, private jwtService: JwtService) { }
  save(globalLinkName:any)
  {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl = savegloballink;
    return this.http.post(fullUrl,globalLinkName,options)
  }
  update(update: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl = updategloballink;
    return this.http.post(fullUrl,update,options)
  }
  getalldata() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl =getgloballink;
    return this.http.get(fullUrl,options)
  }
  getbyid(user: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params: {
        'userid': user,

      }
    }
    var fullUrl =getgloballinkbyid;
    return this.http.get(fullUrl,options)
  }
  delete(item: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params: {
        'userId': item


      }
    }
    var fullUrl =deletegloballink;
    return this.http.get(fullUrl,options)
  }

}
