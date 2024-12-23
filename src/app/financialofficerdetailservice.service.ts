import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finacialdetailsid, finacialdetailsidthroughid, inseertdatainfinacialdetails, updatedatainfinacialdetails } from './services/api-config';
import { JwtService } from './services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class FinancialofficerdetailserviceService {

  constructor(private jwtService: JwtService, private http: HttpClient) { }
  getFinancialOfficerDetails(fromDate, toDate, Financialnumber) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
      .append('fromDate', fromDate)
      .append('toDate', toDate)
      .append('finacialno', Financialnumber)
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = finacialdetailsid;
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
  insertdata(remarks: any, value: any, userid: any, amount: any, floatid: any, floatno: any, flag: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
      .append('remarks', remarks)
      .append('value', value)
      .append('userid', userid)
      .append('amount', amount)
      .append('floatid', floatid)
      .append('floatno', floatno)
      .append('flag', flag);


    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = inseertdatainfinacialdetails;
    return this.http.get(fullUrl, options)
  }
  rejeted(remarks: any, value: any, userid: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
      .append('remarks', remarks)
      .append('value', value)
      .append('userid', userid);
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = inseertdatainfinacialdetails;
    return this.http.get(fullUrl, options)
  }
  updateData(dataArray: any = [], ApprovedAmount: any=[], userid: any, remarks: any) {
    console.log(dataArray);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
      .append('dataArray', JSON.stringify(dataArray))
      .append('ApprovedAmount',JSON.stringify(ApprovedAmount) )
      .append('userid', userid)
      .append('remarks', remarks);
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = updatedatainfinacialdetails;
    return this.http.get(fullUrl, options)
  }
}
