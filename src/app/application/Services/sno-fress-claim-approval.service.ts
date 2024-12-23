import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getCpdClaimApproval, getCPDinvestigateCase ,getSnaClaimApprovalDetails,
  getSnoGettabdatadetails,
  snacasewiseactionTakeAction,
  getSnaResettelment,
  getsnaResettlementcasedetails,
  snaActionForResettlement} from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';
@Injectable({
  providedIn: 'root'
})
export class SnoFressClaimApprovalService {


  constructor(private http: HttpClient, private jwtService: JwtService) { }


  getCPDApprovalCase(requestData:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = getCpdClaimApproval;
    return this.http.post(fullUrl, requestData, options);
  }

  getCPDinvestigateCase(fromDate: any, toDate: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params:{
        fromDate:fromDate,
        toDate:toDate
      }
    };
    let fullUrl = getCPDinvestigateCase;
    return this.http.get(fullUrl, options);
  }

  getSnaCaseDetails(requestData) {
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
    let fullUrl = getSnaClaimApprovalDetails;
    return this.http.get(fullUrl, options);
  }

  getTabDataDetails(requestData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = getSnoGettabdatadetails;
    return this.http.post(fullUrl, requestData, options);
  }

  //SNA Take Action 
  SnaCaseWiseAction(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = snacasewiseactionTakeAction;
    return this.http.post(fullUrl, formData, options);
  }

  //SNA Resettelment
  getSNAReSettelmemtCase(requestData:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = getSnaResettelment;
    return this.http.post(fullUrl, requestData, options);
  }


   //SNA Take Action 
   SnaCaseWiseActionForResettlement(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = snaActionForResettlement;
    return this.http.post(fullUrl, formData, options);
  }


  getSnaCaseDetailsForresettlement(requestData) {
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
    let fullUrl = getsnaResettlementcasedetails;
    return this.http.get(fullUrl, options);
  }
}
