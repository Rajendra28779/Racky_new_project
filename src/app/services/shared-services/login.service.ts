import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { __values } from 'tslib';
import { ActivatedRoute, Router } from '@angular/router';
import { changePassword, forgotPassword, internalLogin, loginUrl, otpValidate, queryDetails, queryloginUrl, usermenulist, changeuserpassword, otpDuringInternalLogin, mobileApiloginforweb, getFingerDeviceList, verifyFINGERForOperator, verifyIRISForOperator } from '../api-config';
import { JwtService } from '../jwt.service';
import { EncryptionService } from '../encryption.service';
@Injectable({
  providedIn: 'root',
})
export class LoginService {

  constructor(
    private jwtService: JwtService,
    private routerLink: Router,
    private http: HttpClient,
    private encryptionService: EncryptionService
  ) { }
  loginpagesucess(loginForm) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    let options = {
      headers: headers,
    };
    let fullUrl = loginUrl;
    return this.http.post(fullUrl, loginForm, options);
  }
  changePassword(data) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    let options = {
      headers: headers,
    };
    let fullUrl = changePassword;
    return this.http.post(fullUrl, this.encryptionService.encryptRequest(data), options);
  }
  forgotPassword(data) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    let options = {
      headers: headers,
    };
    let fullUrl = forgotPassword;
    return this.http.post(fullUrl, this.encryptionService.encryptRequest(data), options);
  }

  validateOtp(data) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    let options = {
      headers: headers,
    };
    let fullUrl = otpValidate;
    return this.http.post(fullUrl, data, options);
  }

  logout() {
    sessionStorage.clear();
    this.routerLink.navigateByUrl('/login');
  }

  getMenuList(userId) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    // let queryparams = new HttpParams().append('userId', userId);
    let options = {
      headers: headers
    };
    let data = {
      userId: userId
    }
    let fullUrl = usermenulist;
    return this.http.post(fullUrl, this.encryptionService.encryptRequest(data), options);
  }


  internalLogin(data) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    let options = {
      headers: headers
    }
    let fullUrl = internalLogin;
    return this.http.post(fullUrl, data, options);
  }


  querylogin(loginForm) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = queryloginUrl;
    return this.http.post(fullUrl, loginForm, options);
  }
  queryDetails(data) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    console.log(data);
    let fullUrl = queryDetails;
    return this.http.post(fullUrl, data, options);
  }
  changeuserPassword(data: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = changeuserpassword;
    return this.http.post(fullUrl, data, options);
  }
  OtpDuringInternalLogin(data) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    let options = {
      headers: headers,
    };
    let fullUrl = otpDuringInternalLogin;
    return this.http.post(fullUrl, data, options);
  }

  mobileapilogin(username: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    let options = {
      headers: headers,
      params: {
        'username': username
      }
    };
    let fullUrl = mobileApiloginforweb;
    return this.http.get(fullUrl, options);
  }

  fileExtensionArr: any =
    ['!', '"', '#', '$', '%', '&', '\'', '(', ')', '*',
      '+', ',', '/', ':', ';', '<', '=', '>', '?', '@',
      '[', '\\', ']', '^', '`', '{', '|', '}', '~'];

  fileExtensionCheck(filename: any) {
    let data = {
      status: "success",
      message: ""
    }
    let fileArr = filename.split('.');
    if (fileArr == null || fileArr == undefined ||
      fileArr == "null" || fileArr.length == 0 || fileArr.length > 2) {
      data.status = "failed";
      data.message = ".";
    } else {
      for (let i = 0; i < this.fileExtensionArr.length; i++) {
        if (filename.indexOf(this.fileExtensionArr[i]) != -1) {
          data.status = "failed";
          data.message = this.fileExtensionArr[i];
        }
      }
    }
    return data;
  }
  getFingerDeviceList(data:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    let options = {
      headers: headers
    }
    return this.http.post(getFingerDeviceList, this.encryptionService.getEncryptedData(data),options);
  }
  verifyIRIS(data: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    let options = {
      headers: headers,
    };
    return this.http.post(data.authType === 'IRIS' ? verifyIRISForOperator : verifyFINGERForOperator, this.encryptionService.getEncryptedData(data), options);
  }
}
