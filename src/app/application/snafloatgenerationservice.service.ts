import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { applyforunfreeze, approveforunfreeze, finacialdetailsid, finacialdetailsidthroughid, getIndividualClaimDetails, getIndividualFloatDetails, getsnafreezelist, getsnafreezelistforapprove, getspecialfloatereport, inseertdatainfinacialdetails, oldclaimnoncompliance, SnaFloatDataforrevert, SnaFloatrevert, snaFloatrevertData, updateFloatGenData, viewSnaFloatData } from '../services/api-config';
import { JwtService } from '../services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class SnafloatgenerationserviceService {


  constructor(private jwtService: JwtService,private http: HttpClient) { }
  viewSnaFloatData(fromDate, toDate, Financialnumber,userId) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
      .append('fromDate', fromDate)
      .append('toDate', toDate)
      .append('finacialno', Financialnumber)
      .append('userId', userId)
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = viewSnaFloatData;
    return this.http.get(fullUrl, options)
  }
  getFinancialOfficerDetailsbyid(id) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams().append('id', id);
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = finacialdetailsidthroughid;
    return this.http.get(fullUrl, options)
  }
  insertdata(remarks:any,value:any,snadata:any,userid:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
    .append('remarks', remarks)
    .append('value', value)
    .append('snadata', snadata)
    .append('userid', userid);
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = inseertdatainfinacialdetails;
    return this.http.get(fullUrl, options)
  }


  getIndividualClaimDetails(floatNo: any): Observable<any> {
  console.log(floatNo);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
      params: {
        'floatNo': floatNo
      }
    };
    let fullUrl = getIndividualFloatDetails;
    return this.http.get(fullUrl, options);


  }


  updateData(dataArray: any = [], ApprovedAmount: any, userid: any, remarks: any) {
    console.log(dataArray);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
      .append('dataArray', JSON.stringify(dataArray))
      .append('ApprovedAmount', ApprovedAmount)
      .append('userid', userid)
      .append('remarks', remarks);
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = updateFloatGenData;
    return this.http.get(fullUrl, options)
  }

  SnaFloatDataforrevert(formdate: any, toDate: any, Financialnumber: any, userId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
      .append('formdate', formdate)
      .append('toDate', toDate)
      .append('userId', userId)
      .append('floateno', Financialnumber);
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = SnaFloatDataforrevert;
    return this.http.get(fullUrl, options)
  }

  SnaFloatrevert(formdate: any, toDate: any, userId: any,floateno:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
      .append('formdate', formdate)
      .append('toDate', toDate)
      .append('userId', userId)
      .append('floateno', floateno);;
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = SnaFloatrevert;
    return this.http.get(fullUrl, options)
  }

  getsnafloaterevertdata(formdate: any, toDate: any,userid:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
      .append('formdate', formdate)
      .append('toDate', toDate)
      .append('userId', userid)
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = snaFloatrevertData;
    return this.http.get(fullUrl, options)
  }

  getsnafreezelist(formdate: any, toDate: any, userId: any,state:any,dist:any,hospital:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
      .append('formdate', formdate)
      .append('toDate', toDate)
      .append('userId', userId)
      .append('state', state)
      .append('dist', dist)
      .append('hospital', hospital)
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getsnafreezelist;
    return this.http.get(fullUrl, options)
  }

  applyforunfreeze(formdate: any, toDate: any, userId: any, claimid: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
      .append('formdate', formdate)
      .append('toDate', toDate)
      .append('userId', userId)
      .append('claimid', claimid)
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = applyforunfreeze;
    return this.http.get(fullUrl, options)
  }

  approveforunfreeze(userId: any, claimid: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
      .append('userId', userId)
      .append('claimid', claimid)
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = approveforunfreeze;
    return this.http.get(fullUrl, options)
  }

  getsnafreezelistforapprove(fromdate: any,todate:any,snaid:any,state:any,dist:any,hospital:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
      .append('fromdate', fromdate)
      .append('todate', todate)
      .append('snaid', snaid)
      .append('state', state)
      .append('dist', dist)
      .append('hospital', hospital)
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getsnafreezelistforapprove;
    return this.http.get(fullUrl, options)
  }

  getspecialfloatereport(formdate: any, todate: any, userId: any, snaid: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
      .append('formdate', formdate)
      .append('todate', todate)
      .append('userId', userId)
      .append('snaid', snaid)
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getspecialfloatereport;
    return this.http.get(fullUrl, options)
  }

  oldclaimnoncompliance(formdate: any, toDate: any, userId: any,
    state: any, dist: any, hospital: any) {
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.jwtService.getJwtToken()
      })
      let queryparams = new HttpParams()
        .append('formdate', formdate)
        .append('todate', toDate)
        .append('userId', userId)
        .append('state', state)
        .append('dist', dist)
        .append('hospital', hospital)
      let options = {
        headers: headers,
        params: queryparams
      }
      let fullUrl = oldclaimnoncompliance;
      return this.http.get(fullUrl, options)
  }



}
