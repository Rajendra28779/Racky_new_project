import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getClaimRecievedCountDetails, getclaimRecievedReportCount, getReportCountDetails, getTransactionCountDetails, getclaimcountprogressreportdetails, getSnaDashboardReport, getHospitalDashboardReport, getCpdDashboardReport, getPaymentFreezeReport, getdistrictdetailsformultiplecheckbox, getHospitaldetailsformulticheckbox, getDischargeandclaimdetailsinnerpage, getPaymentFreezeOldReport, getGrievancePendingCountDetails, getdcwiseHospitaldetailsformulticheckbox, getOldClaimCountReport, getoldclaimprogressreportdetails, getceodashboardreport, getdischargedetails, getattendancereport } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class ReportcountService {

  constructor(private http: HttpClient, private jwtService: JwtService) { }

  getReportsCountDetails(userId, fromDate, toDate, eventName, stateId, districtId, hospitalId) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let queryparams = new HttpParams()
      .append('userId', userId)
      .append('fromDate', fromDate)
      .append('toDate', toDate)
      .append('eventName', eventName)
      .append('stateId', stateId)
      .append('districtId', districtId)
      .append('hospitalId', hospitalId);
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getReportCountDetails;
    return this.http.get(fullUrl, options)
  }

  getClaimRecievedCount(userId, yearId, monthId) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let queryparams = new HttpParams()
      .append('userId', userId)
      .append('month', monthId)
      .append('year', yearId);
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getclaimRecievedReportCount;
    return this.http.get(fullUrl, options)
  }
  getTransactionCountDetails(userId, years, months, days, eventName) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let queryparams = new HttpParams()
      .append('userId', userId)
      .append('years', years)
      .append('months', months)
      .append('days', days)
      .append('eventName', eventName);
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getTransactionCountDetails;
    return this.http.get(fullUrl, options)
  }
  getClaimRecievedCountDetails(userId, years, months, days, eventName) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let queryparams = new HttpParams()
      .append('userId', userId)
      .append('years', years)
      .append('months', months)
      .append('days', days)
      .append('eventName', eventName);
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getClaimRecievedCountDetails;
    return this.http.get(fullUrl, options)
  }

  getPaymentFreezeReport(requestData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
    }
    let fullUrl = getPaymentFreezeReport;
    return this.http.post(fullUrl, requestData, options)
  }

  getPaymentFreezeOldReport(requestData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
    }
    let fullUrl = getPaymentFreezeOldReport;
    return this.http.post(fullUrl, requestData, options)
  }

  getSnaDashboardReport(requestData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
    }
    let fullUrl = getSnaDashboardReport;
    return this.http.post(fullUrl, requestData, options)
  }

  getHospitalDashboardReport(requestData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
    }
    let fullUrl = getHospitalDashboardReport;
    return this.http.post(fullUrl, requestData, options)
  }

  getCpdDashboardReport(requestData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
    }
    let fullUrl = getCpdDashboardReport;
    return this.http.post(fullUrl, requestData, options)
  }

  getalldetailsclaimcountprogress(userId, fromDate, toDate, eventName, stateId, districtId, hospitalId, groupid) {
    console.log("groupid", groupid);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let queryparams = new HttpParams()
      .append('userId', userId)
      .append('fromDate', fromDate)
      .append('toDate', toDate)
      .append('eventName', eventName)
      .append('stateId', stateId)
      .append('districtId', districtId)
      .append('hospitalId', hospitalId)
      .append('groupid', groupid);
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getclaimcountprogressreportdetails;
    return this.http.get(fullUrl, options)
  }

  getdistrictdetailsformultidropdown(requestData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let queryparams = new HttpParams()
      .append('Statecode', requestData)
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getdistrictdetailsformultiplecheckbox;
    return this.http.post(fullUrl, requestData, options)
  }
  gethospitallistformultidrodown(statecodeStatecodeforhospitallist, districtcode) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let queryparams = new HttpParams()
      .append('Statecodeforhospitallist', statecodeStatecodeforhospitallist)
      .append('Districtcode', districtcode)
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getHospitaldetailsformulticheckbox;
    return this.http.get(fullUrl, options)
  }


  getSummarydetailsforinnerpage(userid:any,years:any,months:any,searcby:any,satedata:any,districtdata:any,hospitaldata){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let queryparams = new HttpParams()
      .append('userid', userid)
      .append('month', months)
      .append('years', years)
      .append('searcby', searcby)
      .append('satedata', satedata)
      .append('districtdata', districtdata)
      .append('hospitaldata', hospitaldata)
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getDischargeandclaimdetailsinnerpage;
    return this.http.get(fullUrl, options)

  }
  getdcwisehospitallistformultidrodown(stateCodeList: any, districtCodeList: any, userId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let queryparams = new HttpParams()
      .append('Statecodeforhospitallist', stateCodeList)
      .append('Districtcode', districtCodeList)
      .append('userid', userId)
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getdcwiseHospitaldetailsformulticheckbox;
    return this.http.get(fullUrl, options)
  }

  getGOSecReport(requestData){
    let headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
    }
    let fullUrl = getGrievancePendingCountDetails;
    return this.http.post(fullUrl, requestData, options)
  }
  getOldClaimCountProgressReport(requestData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
    }
    let fullUrl = getOldClaimCountReport;
    return this.http.post(fullUrl, requestData, options)
  }
  getOlddetailsclaimProgress(userId, fromDate, toDate, eventName, stateId, districtId, hospitalId) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let queryparams = new HttpParams()
      .append('userId', userId)
      .append('fromDate', fromDate)
      .append('toDate', toDate)
      .append('eventName', eventName)
      .append('stateId', stateId)
      .append('districtId', districtId)
      .append('hospitalId', hospitalId)
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getoldclaimprogressreportdetails;
    return this.http.get(fullUrl, options)
  }

  getceodashboardreport() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
    }
    let fullUrl = getceodashboardreport;
    return this.http.get(fullUrl, options)
  }
  getDischargeDetails(requestData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
    }
    let fullUrl = getdischargedetails;
    return this.http.post(fullUrl, requestData, options)
  }
  getAtttendanceReport(userType) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let queryparams = new HttpParams()
      .append('userType', userType)
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getattendancereport;
    return this.http.get(fullUrl, options)
  }
}
