import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getAllUsers, getDataforresetpassword, resetpassword, statusChange, viewresetdata, checkStatus, getAllUsersFiltered } from 'src/app/services/api-config';
import { Observable } from 'rxjs';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordserviceService {

  constructor(private http: HttpClient, private jwtService: JwtService) { }


  getListDataForResetData(userId:any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
      params: {
        'userid': userId,
      }
    };
    let fullUrl = getDataforresetpassword;
    return this.http.get(fullUrl, options);
  }


  resetPassword(userId: any, createdBy: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
      params: {
        'userId': userId,
        'createdBy': createdBy,
      }
    };
    let fullUrl = resetpassword;
    return this.http.get(fullUrl, options);

  }


  viewResetData(userId: any): Observable<any> {

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
      params: {
        'userId': userId,
      }
    }
    let token = this.jwtService.getJwtToken();
    let fullUrl = viewresetdata
    return this.http.get(fullUrl, options);
  }

  getListUserData() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    }
    let fullUrl = getAllUsers;
    return this.http.get(fullUrl, options)
  }

  getListUserDataFiltered(userId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams().append('userId', userId);
    let options = {
      headers: headers,
      params: queryparams
    }
    //let token = this.jwtService.getJwtToken();
    let fullUrl = getAllUsersFiltered;
    return this.http.get(fullUrl, options)
  }

  changeStatus(userId: any, status: any, updatedBy: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
      .append('userId', userId)
      .append('status', status)
      .append('updatedBy', updatedBy);
    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = statusChange;
    return this.http.get(fullUrl, options)
  }

  checkStatus(userId: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams().append('userId', userId);
    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = checkStatus;
    return this.http.get(fullUrl, options)
  }

}
