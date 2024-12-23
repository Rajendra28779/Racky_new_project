import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebcommonservicesService {

  constructor(private router: Router, private http: HttpClient) { }

  getFormDetails(ruleParams:any):Observable<any>{
    let serviceUrl = environment.baseUrl+'/getFormDetails';
    let serviceRes = this.http.get(serviceUrl,ruleParams);
    return serviceRes;
  }

   schemeDynCtrl(formParams:any):Observable<any>{
    let serviceURL = environment.baseUrl +'/getSchemeApplyDetails';
    let moduleResponse = this.http.post(serviceURL, formParams);
    return moduleResponse;
  }

  schemeApply(formParams:any):Observable<any>{
    let serviceURL = environment.baseUrl +'/schemeApply';
    let moduleResponse = this.http.post(serviceURL, formParams);
    return moduleResponse;
  }

  loadDynamicBindDetails(formParams:any):Observable<any>{
    let serviceURL = environment.baseUrl +'/tableColumnFetch';
    let moduleResponse = this.http.post(serviceURL, formParams);
    return moduleResponse;
  }
  previewDynamicForm(formParams:any):Observable<any>{
    let serviceURL = environment.baseUrl +'/previewDynamicForm';
    let moduleResponse = this.http.post(serviceURL, formParams);
    return moduleResponse;
  }

  applyForProcess(formParams:any):Observable<any>{
    let serviceURL = environment.baseUrl +'/applyForProcess';
    let moduleResponse = this.http.post(serviceURL, formParams);
    return moduleResponse;
  }

  saveFileToTemp(formParams:any):Observable<any>{
    let serviceURL = environment.baseUrl +'/saveFileToTemp';
    let moduleResponse = this.http.post(serviceURL, formParams);
    return moduleResponse;
  }

  getLogo(formParams:any):Observable<any>{
    let serviceURL = environment.baseUrl +'/websitPreviewLogo';
    let moduleResponse = this.http.post(serviceURL, formParams);
    return moduleResponse;
  }

  getIfscCode(params:any):Observable<any>{
    let serviceUrl = environment.baseUrl+'/getBankDist';
    let ifscRes = this.http.post(serviceUrl,params);
    return ifscRes;
  }


  getifscDetails(params:any):Observable<any>{
    let serviceUrl = environment.baseUrl+'/getIfscDetails';
    let ifscDetailsRes = this.http.post(serviceUrl,params);
    return ifscDetailsRes;
  }

}
