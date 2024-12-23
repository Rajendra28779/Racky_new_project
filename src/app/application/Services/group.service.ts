import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { data, param } from 'jquery';
import { Observable } from 'rxjs';
import { JwtService } from 'src/app/services/jwt.service';
import { getgroupData, savegroupData, checkduplicategrpData, deleteGrpData, updateGrpData, updateGrpById } from 'src/app/services/api-config';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  constructor(private http: HttpClient, private jwtService: JwtService) { }

  saveGroup(data: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers

    };
    let token = this.jwtService.getJwtToken();
    let fullUrl = savegroupData;
    return this.http.post(fullUrl, data, options);

  }

  getGroupData() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    }
    let token = this.jwtService.getJwtToken();
    let fullUrl = getgroupData;

    return this.http.get(fullUrl, options)
  }

  delete(groupId: any): Observable<any> {

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    let token = this.jwtService.getJwtToken();
    let fullUrl = deleteGrpData + "?groupId=" + groupId;
    return this.http.get(fullUrl, options)
  }

  updateGroup(data: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers

    };
    let token = this.jwtService.getJwtToken();
    let fullUrl = updateGrpData;
    return this.http.post(fullUrl, data, options);


  }

  updateGroupById(groupId: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers

    };
    let token = this.jwtService.getJwtToken();
    let fullUrl = updateGrpById + "?groupId=" + groupId;
    return this.http.get(fullUrl, options);

  }

  checkDuplicateData(groupName: any): Observable<any> {

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    };
    let token = this.jwtService.getJwtToken();
    let fullUrl = checkduplicategrpData + "?groupName=" + groupName;
    return this.http.get(fullUrl, options);
  }

}
