import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { downloadDischargeRpt, getAdmissionBlockedData, getMonthWiseDischargeData, getMonthWiseDischargeMeData, getMonthWiseFloatData, saveDischargeReport } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class MnthWiseDischargeMeService {
  
  downloadDischargeReport(fileName: any) {
    
    let jsonObj = {
      f: fileName
    };
    let jsonString = JSON.stringify(jsonObj);
    let queryParam = btoa(jsonString);
    alert
    let url = downloadDischargeRpt + '?' + 'file=' + queryParam;
    return url;
  }
  
 

  constructor(private http: HttpClient, private jwtService: JwtService) { }

  monthWiseDischargeMeData(userId: any, fromdate: any, todate: any, stat: any, dist: any, hospitalCode: any,serchtype:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
      .append('userId', userId)
      .append('fromdate', fromdate)
      .append('todate', todate)
      .append('stateId1', stat)
      .append('districtId1', dist)
      .append('hospitalCode1', hospitalCode)
      .append('serchtype',serchtype);
    
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getMonthWiseDischargeMeData;
    return this.http.get(fullUrl, options)
  }
  monthWiseDetailData(userId: any, formDate: any, toDate: any, stat: any, dist: any, hospitalCode: any, serchtype: any, Package: any, packageName: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
      .append('userId', userId)
      .append('fromdate', formDate)
      .append('todate', toDate)
      .append('stateId1', stat)
      .append('districtId1', dist)
      .append('hospitalCode1', hospitalCode)
      .append('serchtype',serchtype)
      .append('Package', Package)
      .append('packageName',packageName);
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getMonthWiseDischargeData;
    return this.http.get(fullUrl, options)
  }

  blockedcaselogdetailsof(txnid: any,pkgid:any,userId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
      params: {
        "txnid":txnid,
        "pkgid":pkgid,
        "userId":userId
      }
    }
    let fullUrl = getAdmissionBlockedData;
    return this.http.get(fullUrl,options)
  }

  saveDischargeReport(formData: any){   
    let headers= new HttpHeaders({
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    var fullUrl = saveDischargeReport;
    return this.http.post(fullUrl, formData, options);
  }
  monthWiseFloatData(userId: any, fromdate: any, todate: any, stat: any, dist: any, hospitalCode: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
      .append('userId', userId)
      .append('fromdate', fromdate)
      .append('todate', todate)
      .append('stateId1', stat)
      .append('districtId1', dist)
      .append('hospitalCode1', hospitalCode);
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getMonthWiseFloatData;
    return this.http.get(fullUrl, options)
  }
}
