import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { formenvironment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class RuleengineService {
 
  constructor(private router: Router, private http: HttpClient) {}
 
  addUpdateRuleEngine(ruleParams:any):Observable<any>{
    let serviceUrl = formenvironment.serviceURL+'addRuleEngineData';
    let serviceRes = this.http.post(serviceUrl,ruleParams);
    return serviceRes;
  }

  getRuleName(ruleParams:any):Observable<any>{
    let serviceUrl = formenvironment.serviceURL+'getRuleName';
    let serviceRes = this.http.post(serviceUrl,ruleParams);
    return serviceRes;
  }

  getRuleData(ruleParams:any):Observable<any>{
    let serviceUrl = formenvironment.serviceURL+'getRuleData';
    let serviceRes = this.http.post(serviceUrl,ruleParams);
    return serviceRes;
  }
  getRuleImplimentation(ruleParams:any):Observable<any>{
    let serviceUrl = formenvironment.serviceURL+'getRuleImplimentation';
    let serviceRes = this.http.post(serviceUrl,ruleParams);
    return serviceRes;
  }
}
