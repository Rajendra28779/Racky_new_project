import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtService } from 'src/app/services/jwt.service';
import { Observable } from 'rxjs';
import { saveimplant, getimplant, deleteimplant, updateimplant, getbyimplant, checkDuplicateimplantname, checkDuplicateimplantcode, getpackageicddetails, saveimplantconfiguration, implantproceduremappeddata } from 'src/app/services/api-config';

@Injectable({
  providedIn: 'root'
})
export class ImplantMasterService {



  constructor(private http: HttpClient, private jwtService: JwtService) { }
  save(items: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    var fullUrl = saveimplant;
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
    var fullUrl = getimplant;
    return this.http.get(fullUrl, options)
  }
  deleteimplant(id: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let token = this.jwtService.getJwtToken();
    var fullUrl = deleteimplant + `/${id}`;

    return this.http.delete(fullUrl, options)

  }
  updateimplant(data: any, id: string): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let token = this.jwtService.getJwtToken();
    var fullUrl = updateimplant + `/${id}`;
    return this.http.put(fullUrl, data, options)
  }
  getbyimplantId(id: string): Observable<any> {

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let token = this.jwtService.getJwtToken();
    var fullUrl = getbyimplant + `/${id}`;
    return this.http.get(fullUrl, options)
  }
  checkDuplicateData(implantName: any): Observable<any> {

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    };
    let token = this.jwtService.getJwtToken();
    let fullUrl = checkDuplicateimplantname + "?implantName=" + implantName;
    return this.http.get(fullUrl, options);
  }
  checkDuplicateImplantCode(implantCode: any): Observable<any> {

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    };
    let token = this.jwtService.getJwtToken();
    let fullUrl = checkDuplicateimplantcode + "?implantCode=" + implantCode;
    return this.http.get(fullUrl, options);
  }

  getpackageicddetails(procedure: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers,
      params:{
        "procedure":procedure
      }
    };
    let fullUrl = getpackageicddetails;
    return this.http.get(fullUrl, options);
  }

  saveimplantconfiguration(object: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    };
    let fullUrl = saveimplantconfiguration;
    return this.http.post(fullUrl,object,options);
  }

  implantproceduremappeddata(procedure: any, packageheadercode: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers,
      params:{
        "procedure":procedure,
        "packageheadercode":packageheadercode
      }
    };
    let fullUrl = implantproceduremappeddata;
    return this.http.get(fullUrl, options);
  }

}
