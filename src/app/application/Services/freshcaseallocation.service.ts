import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  allocatedcaselist,
  caseallocationreuest,
  cpdcaseresettlementaction,
  cpdcaseresettlementdetails,
  cpdcasewiseaction,
  cpddraftcaseaction,
  cpdunassignedclaim,
  getcasepackagedetails,
  getcpdcasedetails,
  getcpdconsidercasedetails,
  getcpddraftcase,
  getcpdresettlementcase,
  gettabdatadetails,
  manualcpdalloment,
} from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';
@Injectable({
  providedIn: 'root',
})
export class FreshCaseAllocationService {
  constructor(private http: HttpClient, private jwtService: JwtService) {}

  allocationRequest(data): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = caseallocationreuest;
    return this.http.post(fullUrl, data, options);
  }
  getCPDAllocateCase(requestData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    console.log(requestData);
    let options = {
      headers: headers,
      // params: queryparams
    };
    let fullUrl = allocatedcaselist;
    return this.http.post(fullUrl, requestData, options);
  }
  getUnAssignedClaimList(requestData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    console.log(requestData);
    let options = {
      headers: headers,
      // params: queryparams
    };
    let fullUrl = cpdunassignedclaim;
    return this.http.post(fullUrl, requestData, options);
  }
  manualAlloment(data): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = manualcpdalloment;
    return this.http.post(fullUrl, data, options);
  }
  getCPDCaseDetails(requestData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let queryparams = new HttpParams()
      .append('caseId', requestData.caseId)
      .append('caseNumber', requestData.caseNumber)
      .append('urn', requestData.urn);
    let options = {
      headers: headers,
      params: queryparams,
    };
    let fullUrl = getcpdcasedetails;
    return this.http.get(fullUrl, options);
  }
  cpdCaseWiseAction(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = cpdcasewiseaction;
    return this.http.post(fullUrl, formData, options);
  }
  getTabDataDetails(requestData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    // let queryparams = new HttpParams()
    // .append('caseId', requestData.caseId)
    // .append('caseNumber', requestData.caseNumber)
    // .append('urn', requestData.urn)
    let options = {
      headers: headers,
      // params: queryparams
    };
    let fullUrl = gettabdatadetails;
    return this.http.post(fullUrl, requestData, options);
  }
  getCPDCasePackageDetails(requestData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let queryparams = new HttpParams()
      .append('transactionid', requestData.transactionDetailsId)
      .append('urn', requestData.urn)
      .append('memberId', requestData.memberId)
      .append('procedureCode', requestData.procedureCode);
    let options = {
      headers: headers,
      params: queryparams,
    };
    let fullUrl = getcasepackagedetails;
    return this.http.get(fullUrl, options);
  }
  getCPDDraftCase(requestData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    console.log(requestData);
    let options = {
      headers: headers,
      // params: queryparams
    };
    let fullUrl = getcpddraftcase;
    return this.http.post(fullUrl, requestData, options);
  }
  getCPDConsiderCaseDetails(requestData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let queryparams = new HttpParams()
      .append('caseId', requestData.caseId)
      .append('caseNumber', requestData.caseNumber)
      .append('urn', requestData.urn);
    let options = {
      headers: headers,
      params: queryparams,
    };
    let fullUrl = getcpdconsidercasedetails;
    return this.http.get(fullUrl, options);
  }
  cpdDraftCaseWiseAction(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = cpddraftcaseaction;
    return this.http.post(fullUrl, formData, options);
  }
  getCPDResettlementCase(requestData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    console.log(requestData);
    let options = {
      headers: headers,
      // params: queryparams
    };
    let fullUrl = getcpdresettlementcase;
    return this.http.post(fullUrl, requestData, options);
  }
  getCPDResettlementDetails(requestData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let queryparams = new HttpParams()
      .append('caseId', requestData.caseId)
      .append('caseNumber', requestData.caseNumber)
      .append('urn', requestData.urn);
    let options = {
      headers: headers,
      params: queryparams,
    };
    let fullUrl = cpdcaseresettlementdetails;
    return this.http.get(fullUrl, options);
  }
  cpdCaseResettlementAction(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = cpdcaseresettlementaction;
    return this.http.post(fullUrl, formData, options);
  }
}
