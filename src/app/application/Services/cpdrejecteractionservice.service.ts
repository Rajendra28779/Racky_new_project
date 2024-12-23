import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  downLoadAction,
  getcpdrejectedaction,
  getcpdrejecteddetailsid,
  getPreAuthcpd,
  getRemarks,
  getRemarksByids,

} from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root',
})
export class CpdrejecteractionserviceService {


  constructor(private http: HttpClient, private jwtService: JwtService) { }
  getcpdrejecteddetails(id: any) {

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let queryparams = new HttpParams().append('claimid', id);
    let options = {
      headers: headers,
      params: queryparams,
    };
    let fullUrl = getcpdrejecteddetailsid;
    return this.http.get(fullUrl, options);
  }

  getRemarks() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let fullUrl = getRemarks;
    return this.http.get(fullUrl, options);

  }
  getRemarksById(remarkid) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams().append('remarkId', remarkid);
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getRemarksByids;
    return this.http.get(fullUrl, options);

  }


  getPreAuthData(urn: any) {
    //let claimUrl=snoapprovalById;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams().append('urn', urn);
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getPreAuthcpd;
    return this.http.get(fullUrl, options);
  }
  saveDetails(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = getcpdrejectedaction;
    console.log(formData);
    return this.http.post<any>(fullUrl, formData, options);
  }

  dowloadMethod(fileName, hCode, dateOfAdm): Observable<Blob> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let queryparams = new HttpParams().append('fileName', fileName).append('hCode', hCode).append('dateOfAdm', dateOfAdm);

    let options = {
      headers: headers,
      params: queryparams,
    }
    let fullUrl = downLoadAction;
    return this.http.get<Blob>(fullUrl, options);
  }
}
