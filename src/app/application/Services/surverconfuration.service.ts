import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { JwtService } from 'src/app/services/jwt.service';
import {getactivesurveylist, getallquestionmst, getallsurveygroupmappinglist, getallsurveyquestionmappinglist, getgrouplistbysurveyid, getquestionlistbysurveyid, getsurveymstlist, savegroupmapping, savequestionmapping, savequestionmaster, savesurveymst, updatequestionmaster, updatesurveymst,} from 'src/app/services/api-config';


@Injectable({
  providedIn: 'root'
})
export class SurverconfurationService {

  constructor(private httpclient: HttpClient,private jwtService: JwtService) { }

  savequestionmaster(data: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl =savequestionmaster;
    return this.httpclient.post(fullUrl,data,options)
  }

  getallquestionmst() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl =getallquestionmst;
    return this.httpclient.get(fullUrl,options)
  }

  updatequestionmaster(data: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl =updatequestionmaster;
    return this.httpclient.post(fullUrl,data,options)
  }

  savesurveymst(data: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl =savesurveymst;
    return this.httpclient.post(fullUrl,data,options)
  }

  getsurveymstlist() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl =getsurveymstlist;
    return this.httpclient.get(fullUrl,options)
  }

  updatesurveymst(data: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl =updatesurveymst;
    return this.httpclient.post(fullUrl,data,options)
  }

  getactivesurveylist(val:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params:{
        'val':val
      }
    };
    let fullUrl =getactivesurveylist;
    return this.httpclient.get(fullUrl,options)
  }

  getgrouplist(surveyid: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params: {
        'surveyid': surveyid
      }
    };
    let fullUrl =getgrouplistbysurveyid;
    return this.httpclient.get(fullUrl,options)
  }

  savegroupmapping(object: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers
    };
    let fullUrl =savegroupmapping;
    return this.httpclient.post(fullUrl,object,options)
  }

  getallsurveygroupmappinglist(survieid: string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params: {
        'surveyid': survieid
      }
    };
    let fullUrl =getallsurveygroupmappinglist;
    return this.httpclient.get(fullUrl,options)
  }

  getquestionlist(surveyid: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params: {
        'surveyid': surveyid
      }
    };
    let fullUrl =getquestionlistbysurveyid;
    return this.httpclient.get(fullUrl,options)
  }

  savequestionmapping(object: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers
    };
    let fullUrl =savequestionmapping;
    return this.httpclient.post(fullUrl,object,options)
  }

  getallsurveyquestionmappinglist(surveyid: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params: {
        'surveyid': surveyid
      }
    };
    let fullUrl =getallsurveyquestionmappinglist;
    return this.httpclient.get(fullUrl,options)
  }

}
