import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { JwtService } from 'src/app/services/jwt.service';
import { gettransactionInformation, savecce, getallcce, getmobileNoActiveStatus, getallcallResponseCategory, getmobileNoActiveStatusNotConnected, saveCceNotConnected, getCceOutBound, updateCCeOutBound, getCceAllData, updateCceAllData, getCceReport, getccetotalcountedDetails, saveNotConnectedcce, getSupervisorCallCenterData, addReassignremark, saveReassigncce, getUserNameByGroupId, getCceAllDataView, getDistrictListByStateDC, getHospitalListByDc, getCceResettlementdata, getITACceOutBound, getGOITAdata, saveReassignData, getCceDataForShasCEO } from 'src/app/services/api-config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CallCenterExecutiveService {

  constructor(private http: HttpClient, private jwtService: JwtService) { }

  getalldata(userId) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
      .append('userId', userId)
      .append('action', "A")
    let options = {
      headers: headers,
      params: queryparams
    }
    var fullUrl = gettransactionInformation;
    return this.http.get(fullUrl, options)
  }

  getAllNotdata(userId) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
      .append('userId', userId)
      .append('action', "B")
    let options = {
      headers: headers,
      params: queryparams
    }
    var fullUrl = getmobileNoActiveStatusNotConnected;
    return this.http.get(fullUrl, options)
  }

  getAllActionData(userId) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
      .append('userId', userId)
      .append('action', "C")
    let options = {
      headers: headers,
      params: queryparams
    }
    var fullUrl = getallcce;
    return this.http.get(fullUrl, options)
  }

  getAllNotConnectedCompleteData(userId) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
      .append('userId', userId)
      .append('action', "D")
    let options = {
      headers: headers,
      params: queryparams
    }
    var fullUrl = getallcce;
    return this.http.get(fullUrl, options)
  }

  getAllReassignData(userId) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
      .append('userId', userId)
      .append('action', "E")
    let options = {
      headers: headers,
      params: queryparams
    }
    var fullUrl = getallcce;
    return this.http.get(fullUrl, options)
  }

  getAllReassignViewData(userId) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
      .append('userId', userId)
      .append('action', "F")
    let options = {
      headers: headers,
      params: queryparams
    }
    var fullUrl = getallcce;
    return this.http.get(fullUrl, options)
  }


  save(items: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    var fullUrl = savecce;
    return this.http.post(fullUrl, items, options)
  }

  saveNot(items: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    var fullUrl = saveNotConnectedcce;
    return this.http.post(fullUrl, items, options)
  }

  saveReassign(items: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    var fullUrl = saveReassigncce;
    return this.http.post(fullUrl, items, options)
  }

  // getAlldata() {
  //   let headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Authorization': this.jwtService.getJwtToken()
  //   })

  //   let options = {
  //     headers: headers
  //   }
  //   var fullUrl = getallcce;
  //   return this.http.get(fullUrl, options)
  // }

  getmobileNoActivatedata() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    var fullUrl = getmobileNoActiveStatus;
    return this.http.get(fullUrl, options)
  }

  getcallResponsedata(id: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers,
      params: {
        "statusId": id
      }
    }
    var fullUrl = getallcallResponseCategory;
    return this.http.get(fullUrl, options)
  }
  // getMobileNoActiveStatus(id:any) {
  //   let headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Authorization': this.jwtService.getJwtToken()
  //   })
  //   let options = {
  //     headers:headers,
  //     params: {
  //       "statusId": id
  //     }
  //   }
  //   var fullUrl =getMobilenoActiveStatus;
  //   return this.http.get(fullUrl,options)
  // }

  getmobileNoActiveStatus() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers,
      params: {

      }
    }
    var fullUrl = getmobileNoActiveStatusNotConnected;
    return this.http.get(fullUrl, options)
  }

  saveNotConnected(items: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    var fullUrl = saveCceNotConnected;
    return this.http.post(fullUrl, items, options)
  }

  getCceOutBound(action, userId, fromDate, toDate, cceId, hospitalCode, pageIn, pageEnd, queryStatus,stateCode,distCode) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
      .append('action', action)
      .append('userId', userId)
      .append('formDate', fromDate)
      .append('toDate', toDate)
      .append('cceId', cceId)
      .append('hospitalCode', hospitalCode)
      .append('pageIn', pageIn)
      .append('pageEnd', pageEnd)
      .append('queryStatus', queryStatus)
      .append('stateCode', stateCode)
      .append('distCode', distCode);
    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = getCceOutBound;
    return this.http.get(fullUrl, options);
  }

  cceSave(data: FormData): Observable<any> {
    let headers = new HttpHeaders({
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    let fullUrl = updateCCeOutBound;
    return this.http.post(fullUrl, data, options);

  }

  // getCceData(fromDate, toDate, hospitalCode, action) {
  getCceData(fromDate, toDate, stateCode, distCode, hospitalCode, actionBy, pendingAt, action, status, pageIn, pageEnd) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
      .append('formDate', fromDate)
      .append('toDate', toDate)
      .append('stateCode', stateCode)
      .append('distCode', distCode)
      .append('hospitalCode', hospitalCode)
      .append('actionBy', actionBy)
      .append('pendingAt', pendingAt)
      .append('action', action)
      .append('status', status)
      .append('pageIn', pageIn)
      .append('pageEnd', pageEnd);
    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = getCceAllData;
    return this.http.get(fullUrl, options);
  }

  getCceDataView(fromDate, toDate, stateCode, distCode, hospitalCode, actionBy, pendingAt, action, status, pageIn, pageEnd) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
      .append('formDate', fromDate)
      .append('toDate', toDate)
      .append('stateCode', stateCode)
      .append('distCode', distCode)
      .append('hospitalCode', hospitalCode)
      .append('actionBy', actionBy)
      .append('pendingAt', pendingAt)
      .append('action', action)
      .append('status', status)
      .append('pageIn', pageIn)
      .append('pageEnd', pageEnd);
    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = getCceAllDataView;
    return this.http.get(fullUrl, options);
  }

  addGoRemark(id, action, remarks, userId) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
      .append('id', id)
      .append('action', action)
      .append('remark', remarks)
      .append('userId', userId);
    // .append('subDate', subDate);
    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = updateCceAllData;
    return this.http.get(fullUrl, options);
  }

  getCceReport(action, userId, fromDate, toDate, hospitalCode) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
      .append('action', action)
      .append('userId', userId)
      .append('formDate', fromDate)
      .append('toDate', toDate)
      .append('hospitalCode', hospitalCode);
    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = getCceReport;
    return this.http.get(fullUrl, options);
  }
  getalltotalconnectedDetails(fromDate: any, toDate: any, type: any, hospitalCode: any, action: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })

    let queryparams = new HttpParams()
      .append('fromDate', fromDate)
      .append('toDate', toDate)
      .append('userId', type)
      .append('action', action)
      .append('hospitalCode', hospitalCode);

    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getccetotalcountedDetails;
    return this.http.get(fullUrl, options)
  }
  getSupervisorCallCenterData(action, userId, fromDate, toDate, cceId, hospitalCode, cceUserId, pageIn, pageEnd,stateCode,distCode): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
      .append('action', action)
      .append('userId', userId)
      .append('formDate', fromDate)
      .append('toDate', toDate)
      .append('cceId', cceId)
      .append('hospitalCode', hospitalCode)
      .append('cceUserId', cceUserId)
      .append('pageIn', pageIn)
      .append('pageEnd', pageEnd)
      .append('stateCode', stateCode)
      .append('distCode', distCode);
    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = getSupervisorCallCenterData;
    return this.http.get(fullUrl, options);

  }
  addReassignRemark(id, remark, reAssignUser) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
      .append('id', id)
      .append('remark', remark)
      .append('reAssignFlag', 0)
      .append('reAssignUser', reAssignUser);
    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = addReassignremark;
    return this.http.get(fullUrl, options);
  }
  saveReassignRemark(id, remark, reAssignUser,cceUserId) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
      .append('id', id)
      .append('remark', remark)
      .append('reAssignUser', reAssignUser)
      .append('cceUserId', cceUserId);
    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = saveReassignData;
    return this.http.get(fullUrl, options);
  }
  getUserNameByGroupId() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    let fullUrl = getUserNameByGroupId;
    return this.http.get(fullUrl, options);
  }

  getDistrictListByStateDC(userId, stateCode) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let queryparams = new HttpParams()
      .append('stateCode', stateCode)
      .append('userId', userId);
    let options = {
      headers: headers,
      params: queryparams,
    };
    //let token = this.jwtService.getJwtToken();
    let fullUrl = getDistrictListByStateDC;
    return this.http.get(fullUrl, options);
  }
  getHospitalListByDc(userId, stateCode, distCode) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let queryparams = new HttpParams()
      .append('stateCode', stateCode)
      .append('distCode', distCode)
      .append('userId', userId);
    let options = {
      headers: headers,
      params: queryparams,
    };
    //let token = this.jwtService.getJwtToken();
    let fullUrl = getHospitalListByDc;
    return this.http.get(fullUrl, options);
  }
  getCceResettleData(fromDate, toDate, stateCode, distCode, hospitalCode, action) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
      .append('formDate', fromDate)
      .append('toDate', toDate)
      .append('stateCode', stateCode)
      .append('distCode', distCode)
      .append('hospitalCode', hospitalCode)
      .append('action', action);
    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = getCceResettlementdata;
    return this.http.get(fullUrl, options);
  }
  getITACceOutBound(action, userId, fromDate, toDate, hospitalCode, stateCode,distCode) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
      .append('action', action)
      .append('userId', userId)
      .append('formDate', fromDate)
      .append('toDate', toDate)
      .append('hospitalCode', hospitalCode)
      .append('stateCode', stateCode)
      .append('distCode', distCode);
    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = getITACceOutBound;
    return this.http.get(fullUrl, options);
  }
  getGOITAData(userId,fromDate, toDate, stateCode, distCode, hospitalCode, action) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
      .append('userId', userId)
      .append('formDate', fromDate)
      .append('toDate', toDate)
      .append('stateCode', stateCode)
      .append('distCode', distCode)
      .append('hospitalCode', hospitalCode)
      .append('action', action);
    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = getGOITAdata;
    return this.http.get(fullUrl, options);
  }
  getCceDataForShasCEO(fromDate, toDate, stateCode, distCode, hospitalCode, pageIn, pageEnd) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
      .append('formDate', fromDate)
      .append('toDate', toDate)
      .append('stateCode', stateCode)
      .append('distCode', distCode)
      .append('hospitalCode', hospitalCode)
      .append('pageIn', pageIn)
      .append('pageEnd', pageEnd);
    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = getCceDataForShasCEO;
    return this.http.get(fullUrl, options);
  }
}
