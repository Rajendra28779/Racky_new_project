import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { dcClaimList, getCCECountReport, getDcGrievanceCount, getDcGrievanceModeCount, getDcGrievanceResolveCount, getDcInvestigationCount, getDcOverrideCount, getEmpCountReport, getGOCCESecCount, getGOCCETBLSecCount, getGODistrictSecCount, getGOGrievanceMedCount, getGOGrievanceSecCount, getactiontakenhistory, getenrollmentlist, getenrollmentthroughid, gethospitalenrollmentlistactiontakenlist, getrecomplylist, saveEnrollmentaction } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class DcClaimService {

  constructor(private http: HttpClient,private jwtService: JwtService) { }
  getDcClaimList(userId) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let queryparams = new HttpParams()
      .append('userId', userId)
    let options = {
      headers: headers,
     params: queryparams
    }
    let fullUrl = dcClaimList;
    return this.http.get(fullUrl, options)
  }
  getDCInvestigationReport(requestData){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
    }
    let fullUrl = getDcInvestigationCount;
    return this.http.post(fullUrl, requestData, options)
  }
  getDCOverRideReport(requestData){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
    }
    let fullUrl = getDcOverrideCount;
    return this.http.post(fullUrl, requestData, options)
  }
  getDCGrievanceReport(requestData){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
    }
    let fullUrl = getDcGrievanceCount;
    return this.http.post(fullUrl, requestData, options)
  }
  getDCGrievanceResolveReport(requestData){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
    }
    let fullUrl = getDcGrievanceResolveCount;
    return this.http.post(fullUrl, requestData, options)
  }
  getDCGrievanceModeReport(requestData){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
    }
    let fullUrl = getDcGrievanceModeCount;
    return this.http.post(fullUrl, requestData, options)
  }
  getCCECountReport(requestData){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
    }
    let fullUrl = getCCECountReport;
    return this.http.post(fullUrl, requestData, options)
  }
  getEmpanelCountReport(requestData){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
    }
    let fullUrl = getEmpCountReport;
    return this.http.post(fullUrl, requestData, options)
  }
  getGOSecReport(requestData){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
    }
    let fullUrl = getGOGrievanceSecCount;
    return this.http.post(fullUrl, requestData, options)
  }
  getGOMediumReport(requestData){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
    }
    let fullUrl = getGOGrievanceMedCount;
    return this.http.post(fullUrl, requestData, options)
  }
  getGODistrictWiseReport(requestData){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
    }
    let fullUrl = getGODistrictSecCount;
    return this.http.post(fullUrl, requestData, options)
  }
  getGOCCEReport(requestData){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
    }
    let fullUrl = getGOCCESecCount;
    return this.http.post(fullUrl, requestData, options)
  }
  getGOCCEReportForTable(requestData){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
    }
    let fullUrl = getGOCCETBLSecCount;
    return this.http.post(fullUrl, requestData, options)
  }
  gethospitralenrollmentlist(fromDate:any,toDate:any,userId:any,urn:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let queryparams = new HttpParams()
      .append('fromDate', fromDate)
      .append('toDate', toDate)
      .append('userId', userId)
      .append('urn', urn)
    let options = {
      headers: headers,
     params: queryparams
    }
    let fullUrl = getenrollmentlist;
    return this.http.get(fullUrl, options)
  }
  getdetailslist(fromDate:any,toDate:any,userId:any,depregid:any,acknowledgementnumber:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let queryparams = new HttpParams()
      .append('fromDate', fromDate)
      .append('toDate', toDate)
      .append('userId', userId)
      .append('depregid', depregid)
      .append('acknowledgementnumber', acknowledgementnumber)
    let options = {
      headers: headers,
     params: queryparams
    }
    let fullUrl = getenrollmentthroughid;
    return this.http.get(fullUrl, options)
  }
  getAction(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = saveEnrollmentaction;
    console.log(formData);
    return this.http.post(fullUrl, formData, options);
  }
  getrecomplylist(fromDate:any,toDate:any,urn:any,userId:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let queryparams = new HttpParams()
      .append('fromDate', fromDate)
      .append('toDate', toDate)
      .append('urn', urn)
      .append('userId', userId)
    let options = {
      headers: headers,
     params: queryparams
    }
    let fullUrl = getrecomplylist;
    return this.http.get(fullUrl, options)
  }
  getactiontakenhistory(enggid:any,acknowledgementno:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let queryparams = new HttpParams()
      .append('enggid', enggid)
      .append('acknowledgementno', acknowledgementno)
    let options = {
      headers: headers,
     params: queryparams
    }
    let fullUrl = getactiontakenhistory;
    return this.http.get(fullUrl, options)
  }
  getActionTakenDetals(urn:any,fromDate:any,toDate:any,userId:any,username:any,searchdata:any,
    state:any,dist:any,hospital:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let queryparams = new HttpParams()
      .append('urn', urn)
      .append('fromDate', fromDate)
      .append('toDate', toDate)
      .append('userId', userId)
      .append('username', username)
      .append('searchdata', searchdata)
      .append('state', state)
      .append('dist', dist)
      .append('hospital', hospital)
    let options = {
      headers: headers,
     params: queryparams
    }
    let fullUrl = gethospitalenrollmentlistactiontakenlist;
    return this.http.get(fullUrl, options)
  }
}
