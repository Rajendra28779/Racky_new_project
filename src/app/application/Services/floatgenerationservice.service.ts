import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { JwtService } from 'src/app/services/jwt.service';
import { getFloatReport, getSummary, downloadFloat, downloadFile, getGeneratedReports, getAbstractFloatReport, getActionWiseFloatReport, saveFloatReport, getOldFloatReport, saveOldFloatReport, downloadOldFile, getOldGeneratedReports, saveActionWiseFloatGeneration, getoldblocknewdischargelist } from 'src/app/services/api-config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FloatgenerationserviceService {

  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute, private jwtService: JwtService) { }

  getfloatlist(requestData) {
    console.log(requestData)
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
      // params: queryparams
    }
    let fullUrl = getFloatReport;
    return this.http.post(fullUrl,requestData,options)
  }

  getAbstractlist(requestData) {
    console.log(requestData)
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
      // params: queryparams
    }
    let fullUrl = getAbstractFloatReport;
    return this.http.post(fullUrl,requestData,options)
  }

  getActionWisefloatlist(requestData) {
    console.log(requestData)
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
      // params: queryparams
    }
    let fullUrl = getActionWiseFloatReport;
    return this.http.post(fullUrl,requestData,options)
  }

  getSummary(requestData) {
    console.log(requestData)
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
      // params: queryparams
    }
    let fullUrl = getSummary;
    return this.http.post(fullUrl,requestData,options)
  }

  downloadFloat(floatReport: any) : Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
      // params: queryparams
    }
    let fullUrl = downloadFloat;
    return this.http.post(fullUrl,floatReport,options)
  }

  downloadFile(filename: any, userId: any) {
    let jsonObj = {
      f: filename,
      u: userId
    };
    let jsonString = JSON.stringify(jsonObj);
    let queryParam = btoa(jsonString);
    let url = downloadFile + '?' + 'file=' + queryParam;
    return url;
  }

  downloadOldFile(filename: any, userId: any) {
    let jsonObj = {
      f: filename,
      u: userId
    };
    let jsonString = JSON.stringify(jsonObj);
    let queryParam = btoa(jsonString);
    let url = downloadOldFile + '?' + 'file=' + queryParam;
    return url;
  }

  saveFloatReport(formData: any): Observable<any> {
    let headers = new HttpHeaders({
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    var fullUrl = saveFloatReport;
    return this.http.post(fullUrl, formData, options);
  }
  saveFloatReportActionwiseFloat(formData: any): Observable<any> {
    let headers = new HttpHeaders({
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    var fullUrl = saveActionWiseFloatGeneration;
    return this.http.post(fullUrl, formData, options);
  }

  saveOldFloatReport(formData: any): Observable<any> {
    let headers = new HttpHeaders({
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    var fullUrl = saveOldFloatReport;
    return this.http.post(fullUrl, formData, options);
  }

  getGeneratedReports(requestData) {
    console.log(requestData)
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
      // params: queryparams
    }
    let fullUrl = getGeneratedReports;
    return this.http.post(fullUrl,requestData,options)
  }

  getOldGeneratedReports(requestData) {
    console.log(requestData)
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
      // params: queryparams
    }
    let fullUrl = getOldGeneratedReports;
    return this.http.post(fullUrl,requestData,options)
  }

  getoldfloatlist(requestData) {
    console.log(requestData)
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
      // params: queryparams
    }
    let fullUrl = getOldFloatReport;
    return this.http.post(fullUrl,requestData,options)
  }
  getoldblocknewdischarge(requestData) {
    console.log(requestData)
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
      // params: queryparams
    }
    let fullUrl = getoldblocknewdischargelist;
    return this.http.post(fullUrl,requestData,options)
  }
}
