import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { getNonComplianceRequestApproval, getNonComplianceRequestById, getRequestApproval, getRequestById, getSysRejListSna, snaNonCompliancePermission, snaNonComplianceRequestAction, snaSystemRejectedAction } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class RejectRequestService {

  constructor(private http: HttpClient, private jwtService: JwtService) { }

  getRejectedClaimList(userId,fromDate, toDate, stateCode1, distCode1, hospitalCode,schemeid,schemecategoryid) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let queryparams = new HttpParams()
      .append('userId', userId)
      .append('fromDate', fromDate)
      .append('toDate', toDate)
      .append('stateCode', stateCode1)
      .append('distCode', distCode1)
      .append('hospitalCode', hospitalCode)
      .append('schemeid', schemeid)
      .append('schemecategoryid', schemecategoryid);
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getRequestApproval;
    return this.http.get(fullUrl, options)
  }
  getDetailsById(txnId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams().append('txnId', txnId);
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getRequestById;
    return this.http.get(fullUrl, options);
  }
  saveRejectAction(formData:FormData) :Observable<any>{
    let headers = new HttpHeaders({
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let fullUrl = snaSystemRejectedAction;
    console.log(formData)
    return this.http.post(fullUrl, formData, options);

  }
  getNonComplianceRequestList(userId,fromDate, toDate, stateCode1, distCode1, hospitalCode,flag,schemeid,schemecategoryid) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let queryparams = new HttpParams()
      .append('userId', userId)
      .append('fromDate', fromDate)
      .append('toDate', toDate)
      .append('stateCode', stateCode1)
      .append('distCode', distCode1)
      .append('hospitalCode', hospitalCode)
      .append('flag', flag)
      .append('schemeid', schemeid)
      .append('schemecategoryid', schemecategoryid);
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getNonComplianceRequestApproval;
    return this.http.get(fullUrl, options)
  }
  getNonComplianceDetailsById(txnId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams().append('txnId', txnId);
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getNonComplianceRequestById;
    return this.http.get(fullUrl, options);
  }
  saveNonComplianceAction(formData:FormData) :Observable<any> {
    let headers = new HttpHeaders({
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let fullUrl = snaNonComplianceRequestAction;
    return this.http.post(fullUrl, formData, options);

  }
  getSysRejectedClaimListToSNA(requestData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers
    }
    let fullUrl = getSysRejListSna;
    return this.http.post(fullUrl,requestData,options)
  }
  saveActionButton(formData:FormData) :Observable<any> {
    let headers = new HttpHeaders({
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let fullUrl = snaNonCompliancePermission;
    return this.http.post(fullUrl, formData, options);

  }
}
