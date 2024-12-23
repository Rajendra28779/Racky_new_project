import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { downLoadActionforSnoQueriedthospital, getOldQueriedClaimDetails, getQueriedClaimDetailsBySno, getQueriedClaimsListbySno, getSNAquerytohospitalDetailsthroughid, getSNAquerytohospitalsubmit, gettakeActionOnQuery, takeActionOnOldClaimQuery } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';
@Injectable({
  providedIn: 'root'
})

export class ClaimsqueriedbySNOServive {

  constructor(private http: HttpClient, private jwtService: JwtService) { }

  
  getClaimsList(hospitalCode,fromDate,toDate,Package,packagecode,URN,schemeid,schemecategoryid) {
    console.log(hospitalCode);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
    .append('hospitalCode',hospitalCode)
    .append('fromDate',fromDate)
    .append('toDate',toDate)
    .append('Package',Package)
    .append('packagecode',packagecode)
    .append('URN',URN)
    .append('schemeid',schemeid)
    .append('schemecategoryid',schemecategoryid)
    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = getQueriedClaimsListbySno;
    return this.http.get(fullUrl, options);

  }
  getDetails(id: any) {
    console.log(id);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
      params: {
        'claimID': id
      }
    };
    let fullUrl = getQueriedClaimDetailsBySno;
    return this.http.get(fullUrl, options);
  }

  reclaimRequest(claimID: any, action: any, userName: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
      params: {
        'claimID': claimID,
        'action': action,
        'userName': userName
      }
    };
    let fullUrl = gettakeActionOnQuery;
    return this.http.get(fullUrl, options);
  }


  queryclaimRequest(Data:FormData):Observable<any>  {
    let headers = new HttpHeaders({
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
    }
    let fullUrl = gettakeActionOnQuery;
    console.log(Data);
    return this.http.post(fullUrl,Data,options);
  }

  getOldDetails(id: any) {
    console.log(id);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
      params: {
        'claimID': id
      }
    };
    let fullUrl = getOldQueriedClaimDetails;
    return this.http.get(fullUrl, options);
  }
  queryOldclaimRequest(Data:FormData):Observable<any>  {
    let headers = new HttpHeaders({
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
    }
    let fullUrl = takeActionOnOldClaimQuery;
    console.log(Data);
    return this.http.post(fullUrl,Data,options);
  }

  
  getsnaquerytohospitaldetails(caseid: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let queryparams = new HttpParams().append('caseid', caseid);
    let options = {
      headers: headers,
      params: queryparams,
    };
    let fullUrl = getSNAquerytohospitalDetailsthroughid;
    return this.http.get(fullUrl, options);
  }

  getcasewisesnaquerytohospitalsubmit(data: FormData): Observable<any> {
    let headers = new HttpHeaders({
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    let fullUrl = getSNAquerytohospitalsubmit;
    return this.http.post(fullUrl, data, options);
  }
}