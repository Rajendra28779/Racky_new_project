import { formatDate } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable,Inject,
  LOCALE_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment} from 'src/environments/environment';
import { JwtService } from '../jwt.service';
import { CDMOActionofForwardGrv, getCDMOActionDetails, getHospitaldetailsFromDCUser, grvCCEFeedbackReport } from '../api-config';

@Injectable({
  providedIn: 'root',
})
export class ViewAppListService {
 
  serviceURL = environment.baseUrl;
  constructor(private router: Router, private http: HttpClient,@Inject(LOCALE_ID) public locale: string,private jwtService: JwtService) {}

  getApplicationList(ruleParams: any): Observable<any> {
    let serviceUrl = environment.baseUrl + '/getApplication';
    let serviceRes = this.http.post(serviceUrl, ruleParams);
    return serviceRes;
  }
  getGrievanceRepoprt(ruleParams: any): Observable<any> {
    let serviceUrl = environment.baseUrl + '/getGrievanceReport';
    let serviceRes = this.http.post(serviceUrl, ruleParams);
    return serviceRes;
  }
  getNoteing(param: any): Observable<any> {
    let serviceUrl = environment.baseUrl + '/getnoting';
    let serviceRes = this.http.post(serviceUrl, param);
    return serviceRes;
  }
  getActions(param: any): Observable<any> {
    let serviceUrl = environment.baseUrl + '/getAuthAction';
    let serviceRes = this.http.post(serviceUrl, param);
    return serviceRes;
  }
  takeAction(param: any): Observable<any> {
    let serviceUrl = environment.baseUrl + '/takeAction';
    let formData = new FormData();
    let paramKeys = Object.keys(param);
    for (let paramData of paramKeys) {
      formData.append('arrParam[' + paramData + ']', param[paramData]);
    }
    let serviceRes = this.http.post(serviceUrl, formData);
    return serviceRes;
  }

  getStatus(rows: any) {
    let status = 0;
    let pendingAuths = '';
    let appStatus = '';
    let pendingAt :any;
    let statusDate :any;
    
    if (rows) {
      status = rows.TINSTATUS;
      pendingAuths = rows.PENDINGAUTH;
      pendingAt = rows.INTPENDINGAT;
      statusDate = rows.DTMSTATUSDATE
      != '' ? rows.DTMSTATUSDATE
      : '';

      if (status == 8) {
        appStatus = '<div>Application Approved</div>';
        if (statusDate) {
          appStatus += '<small>On : ' + formatDate(rows.DTMSTATUSDATE,'dd-MM-yyyy',this.locale)
          
          + '</small>';
        }
      }
     else if (status == 7) {
        appStatus = '<div>Application Rejected</div>';
        if (statusDate) {
          appStatus += '<small>On : ' + formatDate(rows.DTMSTATUSDATE,'dd-MM-yyyy',this.locale)
          + '</small>';
        }
      }else if (status == 19 || status == 17) {
          appStatus = '<div>Grievance Disposed</div>';
          if (statusDate) {
            appStatus += '<small>On : ' + formatDate(rows.DTMSTATUSDATE,'dd-MM-yyyy',this.locale)
            + '</small>';
          }
      }
      else if (status == 3) {
        appStatus = '<div>Requested for resubmission</div>';
        if (statusDate) {
          appStatus += '<small>On : ' + formatDate(rows.DTMSTATUSDATE,'dd-MM-yyyy',this.locale)
          + '</small>';
        }
      }
      else if (status == 18) {
        appStatus = '<div>Application Reopen</div>';
        if (statusDate) {
          appStatus += '<small>On : ' + formatDate(rows.DTMSTATUSDATE,'dd-MM-yyyy',this.locale)
          + '</small>';
        }
       
      }
      
      else if(status == 6)
      {
        appStatus = '<div>Query raised </div>';
        if (statusDate) {
          appStatus += '<small>On : ' + formatDate(rows.DTMSTATUSDATE,'dd-MM-yyyy',this.locale)
          + '</small>';
        }
      }
      else if(status == 9 && pendingAt == 0)
      {
        appStatus = '<div>Query raised </div>';
        if (statusDate) {
          appStatus += '<small>On : ' + formatDate(rows.DTMSTATUSDATE,'dd-MM-yyyy',this.locale)
          + '</small>';
        }
      }
      else if (status == 0 && pendingAuths == undefined ) {
        appStatus = '<div>Pending at ' + "SNA" + '</div><small>';
        if (statusDate) {
          appStatus += '<small>On : ' + formatDate(rows.DTMSTATUSDATE,'dd-MM-yyyy',this.locale)
          + '</small>';
        }
        if (statusDate) {
          appStatus += '<small>From : ' + formatDate(rows.DTMSTATUSDATE,'dd-MM-yyyy',this.locale)
          + '</small>';
        }
      }
      else {
        appStatus = '<div>Pending at ' + pendingAuths + '</div><small>';

        if (statusDate) {
          appStatus += '<small>From : ' + formatDate(rows.DTMSTATUSDATE,'dd-MM-yyyy',this.locale)
          + '</small>';
        }
      }
    }
    return appStatus;
  }

  getStatusForExcelDownlaod(rows: any) {
    let status = 0;
    let pendingAuths = '';
    let appStatus = '';
    let pendingAt :any;
    let statusDate :any;
    
    if (rows) {
      status = rows.TINSTATUS;
      pendingAuths = rows.PENDINGAUTH;
      pendingAt = rows.INTPENDINGAT;
      statusDate = rows.DTMSTATUSDATE
      != '' ? rows.DTMSTATUSDATE
      : '';

      if (status == 8) {
        appStatus = 'Application Approved';
        if (statusDate) {
          appStatus += ' On : ' + formatDate(rows.DTMSTATUSDATE,'dd-MM-yyyy',this.locale)
          
          + '';
        }
      }
     else if (status == 7) {
        appStatus = 'Application Rejected';
        if (statusDate) {
          appStatus += ' On : ' + formatDate(rows.DTMSTATUSDATE,'dd-MM-yyyy',this.locale)
          + '';
        }
      }else if (status == 19 || status == 17) {
          appStatus = 'Grievance Disposed';
          if (statusDate) {
            appStatus += ' On : ' + formatDate(rows.DTMSTATUSDATE,'dd-MM-yyyy',this.locale)
            + '';
          }
      }
      else if (status == 3) {
        appStatus = 'Requested for resubmission';
        if (statusDate) {
          appStatus += ' On : ' + formatDate(rows.DTMSTATUSDATE,'dd-MM-yyyy',this.locale)
          + '';
        }
      }
      else if (status == 18) {
        appStatus = 'Application Reopen';
        if (statusDate) {
          appStatus += ' On : ' + formatDate(rows.DTMSTATUSDATE,'dd-MM-yyyy',this.locale)
          + '';
        }
       
      }
      
      else if(status == 6)
      {
        appStatus = 'Query raised ';
        if (statusDate) {
          appStatus += ' On : ' + formatDate(rows.DTMSTATUSDATE,'dd-MM-yyyy',this.locale)
          + '.';
        }
      }
      else if(status == 9 && pendingAt == 0)
      {
        appStatus = 'Query raised ';
        if (statusDate) {
          appStatus += ' On : ' + formatDate(rows.DTMSTATUSDATE,'dd-MM-yyyy',this.locale)
          + '.';
        }
      }
      else if (status == 0 && pendingAuths == undefined ) {
        appStatus = 'Pending at ' + "SNA" + '';
        if (statusDate) {
          appStatus += ' On : ' + formatDate(rows.DTMSTATUSDATE,'dd-MM-yyyy',this.locale)
          + '';
        }
        if (statusDate) {
          appStatus += ' From : ' + formatDate(rows.DTMSTATUSDATE,'dd-MM-yyyy',this.locale)
          + '';
        }
      }
      else {
        appStatus = 'Pending at ' + pendingAuths + '';

        if (statusDate) {
          appStatus += ' From : ' + formatDate(rows.DTMSTATUSDATE,'dd-MM-yyyy',this.locale)
          + '';
        }
      }
    }
    return appStatus;
  }

  getStatusForReport(rows: any) {
    let status = 0;
    let pendingAuths = '';
    let appStatus = '';
    let statusDate :any;
    
    if (rows) {
      status = rows.TINSTATUS;
      pendingAuths = rows.PENDINGAUTH;
      statusDate = rows.DTMSTATUSDATE
      != '' ? rows.DTMSTATUSDATE
      : '';

      if (status == 8) {
        appStatus = 'Grievance Disposed';
        if (statusDate) {
          appStatus += ' On : ' + formatDate(rows.DTMSTATUSDATE,'dd-MM-yyyy',this.locale)
          
           ;
        }
      }
     else if (status == 7) {
        appStatus = 'Grievance Disposed';
        if (statusDate) {
          appStatus += ' On : ' + formatDate(rows.DTMSTATUSDATE,'dd-MM-yyyy',this.locale)
           ;
        }
      }
      else if (status == 19) {
        appStatus = 'Grievance Disposed';
        if (statusDate) {
          appStatus += 'On : ' + formatDate(rows.DTMSTATUSDATE,'dd-MM-yyyy',this.locale);
        }
      }
      else if (status == 3) {
        appStatus = 'Requested for resubmission';
        if (statusDate) {
          appStatus += ' On : ' + formatDate(rows.DTMSTATUSDATE,'dd-MM-yyyy',this.locale)
          ;
        }
      }
      else if (status == 18) {
        appStatus = 'Application Reopen';
        if (statusDate) {
          appStatus += 'On : ' + formatDate(rows.DTMSTATUSDATE,'dd-MM-yyyy',this.locale)
         ;
        }
      }
      else if(status == 6)
      {
        appStatus = 'Query raised ';
        if (statusDate) {
          appStatus += 'On : ' + formatDate(rows.DTMSTATUSDATE,'dd-MM-yyyy',this.locale)
          ;
        }
      }

      else if (status == 0 && pendingAuths == undefined ) {
        appStatus = 'Pending at ' + "SNA" + '';
        if (statusDate) {
          appStatus += 'On : ' + formatDate(rows.DTMSTATUSDATE,'dd-MM-yyyy',this.locale)
          ;
        }
        if (statusDate) {
          appStatus += 'From : ' + formatDate(rows.DTMSTATUSDATE,'dd-MM-yyyy',this.locale)
          ;
        }
      }
      else {
        appStatus = 'Pending at ' + pendingAuths + '';

        if (statusDate) {
          appStatus += 'From : ' + formatDate(rows.DTMSTATUSDATE,'dd-MM-yyyy',this.locale)
          ;
        }
      }
    }
    return appStatus;
  }
  sendUserDetails(request:any) {
    let serviceUrl = environment.baseUrl + '/getUserDetails';
    let serviceRes = this.http.post(serviceUrl,request);
    return serviceRes;
  }
  getDistByState(stateCode:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams().append('stateCode', stateCode);
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = environment.baseUrl + '/master/getDistrictDetailsByStateId';
    return this.http.get(fullUrl, options);
  }

  getHostByDist(districtCode:any,stateCode:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams().set('districtCode', districtCode)
    .set('stateCode', stateCode);
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = environment.baseUrl + '/master/getHospitalByDistrictId';
    return this.http.get(fullUrl, options);
  }
  saveCDMOForwardData(formData) {
    //alert(claimAmount)
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = CDMOActionofForwardGrv;
    console.log(formData);
    return this.http.post(fullUrl, formData, options);
  }
  getCDMOActionListData(userId:any,fromDate:any,toDate:any) {
    //alert(claimAmount)
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let queryparams = new HttpParams().append('userId', userId).append('fromDate', fromDate).append('toDate', toDate);
    let options = {
      headers: headers,
      params: queryparams,
    };
    let fullUrl = getCDMOActionDetails;
    return this.http.get(fullUrl, options);
  }
  getMediumDetails() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let fullUrl = environment.baseUrl + '/api/getGrivancemediumData';
    return this.http.get(fullUrl, options);
  }

  getHospitalDetailsFromDCUserId(requestData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let queryparams = new HttpParams()
      .append('dcUserIdList', requestData)
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getHospitaldetailsFromDCUser;
    return this.http.post(fullUrl, requestData, options)
  }

  getCCEFeedbackReportsDetails(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = grvCCEFeedbackReport;
    console.log(formData);
    return this.http.post(fullUrl, formData, options);
  }
}
