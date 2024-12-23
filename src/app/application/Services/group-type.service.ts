import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { deleteGroupType, getGroupTypeList, saveGroupTypeData, getGroupTypeListbyid, grouptypeupdate, checkgrpTypeData } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class GroupTypeService {

  constructor(private http: HttpClient, private jwtService: JwtService) { }

  saveGroupType(items: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let token = this.jwtService.getJwtToken();
    let fullUrl = saveGroupTypeData

    return this.http.post(fullUrl, items, options);
  }



  getGroupList() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let token = this.jwtService.getJwtToken();
    let fullUrl = getGroupTypeList
    return this.http.get(fullUrl, options);

  }
  deleteDetails(typeId: any): Observable<any> {

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let token = this.jwtService.getJwtToken();
    let fullUrl = deleteGroupType + "?typeId=" + typeId;
    return this.http.get(fullUrl, options);

  }

  getbyid(user: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let token = this.jwtService.getJwtToken();
    let fullUrl = getGroupTypeListbyid + "?typeId=" + user;
    return this.http.get(fullUrl, options);

  }

  updateGroupType(items: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let token = this.jwtService.getJwtToken();
    let fullUrl = grouptypeupdate;
    return this.http.post(fullUrl, items, options);

  }

  checkDuplicategrpData(typeId: any): Observable<any> {

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    };
    let token = this.jwtService.getJwtToken();
    let fullUrl = checkgrpTypeData + "?typeId=" + typeId;
    return this.http.get(fullUrl, options);
  }


}
