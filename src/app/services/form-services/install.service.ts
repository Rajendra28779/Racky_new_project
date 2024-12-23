import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { formenvironment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InstallService {
  installURL = formenvironment.installURL;
  constructor(private router: Router, private http: HttpClient) { }

  public folderExistCheck(formParams:any):Observable<any> {
    let installURL = formenvironment.installURL + 'api';
    let moduleResponse = this.http.post(installURL, formParams);
    return moduleResponse;
  }

  public databaseExistCheck(formParams:any):Observable<any> {
    let installURL = formenvironment.installURL + 'api';
    let moduleResponse = this.http.post(installURL, formParams);
    return moduleResponse;
  }
  
}
