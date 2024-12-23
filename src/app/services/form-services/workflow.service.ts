import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { formenvironment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class WorkflowService {

  constructor(private router: Router, private http: HttpClient) { }
  // Function to get events master
  getEvents(eventParams:any):Observable<any>{
    let serviceUrl = formenvironment.serviceURL+'getallApprovalAction';
    let serviceRes = this.http.get(serviceUrl,eventParams);
    return serviceRes;
  }
  // Function to get events master
  getAdminRoles(roleParams:any):Observable<any>{
    let serviceUrl = formenvironment.serviceURL+'getallOfficersApi';
    let serviceRes = this.http.get(serviceUrl,roleParams);
    return serviceRes;
  }

  saveCanvasData(params:any):Observable<any>{
    let serviceUrl = formenvironment.serviceURL+'setWorkflow';
    let serviceRes = this.http.post(serviceUrl,params);
    return serviceRes;
  }

  fillWorkflowData(params:any):Observable<any>{

    let serviceUrl = formenvironment.serviceURL+'fillWorkflow';
    
    let formData = new FormData();
    let paramKeys = Object.keys(params);
    for(let paramData of paramKeys)
    {
      formData.append('arrParam['+paramData+']', params[paramData]);
    }
    let serviceRes = this.http.post(serviceUrl,formData);
    return serviceRes;
  }
}
