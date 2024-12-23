import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { cpdRegPreviewData, downloadfileCpdRegistrations } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';


@Injectable({
  providedIn: 'root'
})
export class CpdregsdetailsPreviewService {

  constructor(private http: HttpClient,private jwtService: JwtService) { }

  previewData(cpdUserId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params: {
        'cpdUserId': cpdUserId,
      }
    }
    var fullUrl =cpdRegPreviewData;
    return this.http.get(fullUrl,options)
  }

  downloadfileCpdRegistration(filename: any, prefix: any,cpdUserId: any) {
    let jsonObj = {
      f: filename,
      p: prefix,
      u: cpdUserId
    };
    let jsonString = JSON.stringify(jsonObj);
    let queryParam = btoa(jsonString);
    let url = downloadfileCpdRegistrations + '?' + 'data=' + queryParam;
    return url;
  }

  downloadfileCpdRegistration1(filename: any, prefix: any,cpdUserId: any) {
    let jsonObj = {
      f: filename,
      p: prefix,
      u: cpdUserId
    };
    let jsonString = JSON.stringify(jsonObj);
    let queryParam = btoa(jsonString);
    return this.http.get(downloadfileCpdRegistrations + '?' + 'data=' + queryParam, {responseType:'blob'}) ;
  }
}
