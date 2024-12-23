import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getByTransactionId,noncompliancequerysno, getNonComplianceExtensionview,getCpdSystemRejectedList, getCpdSystemRejectedListToSNA, getNonComplianceById, getNonComplianceExtension, getRejectedList, getRequestedByTransactionId,  getSnasystemRejectedlist, rejectRequest, rejectRequestCpd, rejectRequestSna, saveDateExtension, snoNonComplianceaction, getSNASystemRejectedListToSNA, getBulkNonComplianceExtension, saveBulkDateExtension } from '../services/api-config';
import { JwtService } from '../services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class PendingService {

  constructor( private http: HttpClient,private jwtService: JwtService) { }
  getRejetctedlist(hospitalcoderejected,fromDate,toDate,Package,packagecode,URN,schemeid, schemecategoryid) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
    .append('hospitalcoderejected',hospitalcoderejected)
    .append('fromDate',fromDate)
    .append('toDate',toDate)
    .append('Package', Package)
    .append('packagecode', packagecode)
    .append('URN', URN)
    .append('schemeid', schemeid)
    .append('schemecategoryid', schemecategoryid);
    let options = {
      headers:headers,
      params: queryparams
    }
    let fullUrl = getRejectedList;
    return this.http.get(fullUrl, options)
  }
  getSystemRejectedata(hospitalcoderejected,fromDate,toDate,Package,packageCodedata,URN,schemeid,schemecategoryid) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
    .append('hospitalcoderejected',hospitalcoderejected)
    .append('fromDate',fromDate)
    .append('toDate',toDate)
    .append('Package', Package)
    .append('packageCodedata', packageCodedata)
    .append('URN', URN)
    .append('schemeid',schemeid)
    .append('schemecategoryid',schemecategoryid)
    let options = {
      headers:headers,
      params: queryparams
    }
    let fullUrl = getSnasystemRejectedlist;
    return this.http.get(fullUrl, options)
  }

  noncompliancequerysno(sno,fromDate,toDate,Package,PackageName,URN) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
    .append('sno',sno)
    .append('fromDate',fromDate)
    .append('toDate',toDate)
    .append('Package', Package)
    .append('PackageName', PackageName)
    .append('URN', URN);
    let options = {
      headers:headers,
      params: queryparams
    }
    let fullUrl = noncompliancequerysno;
    return this.http.get(fullUrl, options)
  }

  getCPDSystemRejectedata(hospitalcoderejected,fromDate,toDate,Package,packageCodedata,URN,schemeid,schemecategoryid) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
    .append('hospitalcoderejected',hospitalcoderejected)
    .append('fromDate',fromDate)
    .append('toDate',toDate)
    .append('Package', Package)
    .append('packageCodedata', packageCodedata)
    .append('URN', URN)
    .append('schemeid',schemeid)
    .append('schemecategoryid',schemecategoryid)
    let options = {
      headers:headers,
      params: queryparams
    }
    let fullUrl = getCpdSystemRejectedList;
    return this.http.get(fullUrl, options)
  }
  saveRejectRequest(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let fullUrl = rejectRequest;
    return this.http.post(fullUrl, formData, options);

  }
  getTxnDetails(txnId: any) {
    //let claimUrl=snoapprovalById;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams().append('txnId', txnId);
    let options = {
      headers: headers,
      params: queryparams
    }
    //let token = this.jwtService.getJwtToken();
    let fullUrl = getRequestedByTransactionId;
    return this.http.get(fullUrl, options);
    //return this.http.get<any>(`${this.Dataurl}/snoapproval/${claimid}`);
  }
  saveRejectRequestOfCPD(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let fullUrl = rejectRequestCpd;
    return this.http.post(fullUrl, formData, options);

  }
  saveRejectRequestOfSNA(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let fullUrl = rejectRequestSna;
    return this.http.post(fullUrl, formData, options);

  }
  getDetails(check: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams().append('txnId', check);
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getByTransactionId;
    return this.http.get(fullUrl, options);
  }


  getCPDSystemRejectedataForSNA(requestData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
    }
    let fullUrl = getCpdSystemRejectedListToSNA;
    return this.http.post(fullUrl,requestData,options)
  }
  getMultiPackageNonCompliance(txnId: any) {
    //let claimUrl=snoapprovalById;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams().append('txnId', txnId);
    let options = {
      headers: headers,
      params: queryparams
    }
    //let token = this.jwtService.getJwtToken();
    let fullUrl = getNonComplianceById;
    return this.http.get(fullUrl, options);
    //return this.http.get<any>(`${this.Dataurl}/snoapproval/${claimid}`);
  }
  saveNonComplianceDetails(formData) {
    //alert(claimAmount)
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let fullUrl = snoNonComplianceaction;
    return this.http.post(fullUrl, formData, options);

  }
  getNonComplianceExtension(requestData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
    }
    let fullUrl = getNonComplianceExtension;
    return this.http.post(fullUrl,requestData,options)
  }
  submitNonComplianceExtension(formData) {
    //alert(claimAmount)
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let fullUrl = saveDateExtension;
    return this.http.post(fullUrl, formData, options);

  }
  getSNASystemRejectedataForSNA(requestData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
    }
    let fullUrl = getSNASystemRejectedListToSNA;
    return this.http.post(fullUrl,requestData,options)
  }
  getBulkNonComplianceExtension(requestData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
    }
    let fullUrl = getBulkNonComplianceExtension;
    return this.http.post(fullUrl,requestData,options)
  }
  submitBulkNonComplianceExtension(formData) {
    //alert(claimAmount)
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let fullUrl = saveBulkDateExtension;
    return this.http.post(fullUrl, formData, options);

  }
  getNonComplianceExtensionview(actionId: any, userid: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers,
      params:{
        "action":actionId,
        "userid":userid
      }
    }
    let fullUrl = getNonComplianceExtensionview;
    return this.http.get(fullUrl,options);
  }

}
