import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AnyNaptrRecord } from 'dns';
import { getschedularlist,getschedularreportlist,getschedulardetailslist, savescheduler, generateotpforscheduler, validateotpforscheduler, getallschedulerlist, updatescheduler, getschedulerloglist, getcpddishonorcountlist, deactivecpddishonour } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class SchedularserviceService {

  constructor(private http: HttpClient, private jwtService: JwtService) { }

  getschedularlist() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers
    }
    let fullUrl = getschedularlist;
    return this.http.get(fullUrl, options)
  }

  getschedularreportlist(proc: any, formdate: any, todate: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })

    let options = {
      headers: headers,
      params:{
        "procedure":proc,
        "fromdate":formdate,
        "todte":todate,
      }
    }
    let fullUrl = getschedularreportlist;
    return this.http.get(fullUrl, options)
  }

  getschedulardetailslist(procid: any, date: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })

    let options = {
      headers: headers,
      params:{
        "procid":procid,
        "date":date,
      }
    }
    let fullUrl = getschedulardetailslist;
    return this.http.get(fullUrl, options)
  }

  savescheduler(form: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })

    let options = {
      headers: headers
    }
    let fullUrl = savescheduler;
    return this.http.post(fullUrl,form, options)
  }

  updatescheduler(editeddata: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })

    let options = {
      headers: headers
    }
    let fullUrl = updatescheduler;
    return this.http.post(fullUrl,editeddata, options)
  }

  generateotp() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })

    let options = {
      headers: headers
    }
    let fullUrl = generateotpforscheduler;
    return this.http.get(fullUrl, options)
  }

  validateotpforscheduler(otp: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })

    let options = {
      headers: headers,
      params:{
        "otp":otp
      }
    }
    let fullUrl = validateotpforscheduler;
    return this.http.get(fullUrl, options)
  }

  getallschedulerlist() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers
    }
    let fullUrl = getallschedulerlist;
    return this.http.get(fullUrl, options)
  }

  getschedulerloglist(scheduler: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })

    let options = {
      headers: headers,
      params:{
        "scheduler":scheduler
      }
    }
    let fullUrl = getschedulerloglist;
    return this.http.get(fullUrl, options)
  }

  getcpddishonorcountlist(formdate: any, todate: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })

    let options = {
      headers: headers,
      params:{
        "formdate":formdate
        // "todate":todate
      }
    }
    let fullUrl = getcpddishonorcountlist;
    return this.http.get(fullUrl, options)
  }

  deactivecpddishonour(formdate: any, remark: any, cpdid: any, userId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })

    let options = {
      headers: headers,
      params:{
        "formdate":formdate,
        "remark":remark,
        "cpdid":cpdid,
        "userId":userId
      }
    }
    let fullUrl = deactivecpddishonour;
    return this.http.get(fullUrl, options)
  }

}
