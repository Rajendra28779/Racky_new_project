import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {JwtService} from "../../services/jwt.service";
import {
  getMailServiceConfigDataById,
  getMailServiceConfigList,
  getMailServiceDataById,
  getMailServiceList, getMailServiceNameList,
  saveMailServiceConfigData,
  saveMailServiceData
} from "../../services/api-config";

@Injectable({
  providedIn: 'root'
})
export class MailCommunicationService {

  constructor(
    private httpClient: HttpClient,
    private jwtService: JwtService
  ) { }

  getMailServiceList() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    return this.httpClient.get(getMailServiceList, options);
  }

  saveMailServiceData(mailServiceData : any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    return this.httpClient.post(saveMailServiceData, mailServiceData, options);
  }

  getMailServiceDataById(id : any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    let queryParams = {
      "id": id
    }
    return this.httpClient.post(getMailServiceDataById, queryParams, options);
  }

  getMailServiceNameList() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    return this.httpClient.get(getMailServiceNameList, options);
  }

  getMailServiceConfigList() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    return this.httpClient.get(getMailServiceConfigList, options);
  }

  getMailServiceConfigDataById(id : any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    let queryParams = {
      "id": id
    }
    return this.httpClient.post(getMailServiceConfigDataById, queryParams, options);
  }

  saveMailServiceConfigData(mailServiceConfigData : any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    return this.httpClient.post(saveMailServiceConfigData, mailServiceConfigData, options);
  }
}
