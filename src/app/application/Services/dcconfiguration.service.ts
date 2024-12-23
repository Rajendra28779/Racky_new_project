import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { JwtService } from 'src/app/services/jwt.service';
import { getDCDetails, getDClist, checkDCAssignedToHosp, saveDCConfiguration, updateDCConfiguration, getConfigurationDetailsByIdDC, getConfigurationDetailsByDC, DistrictListsForFiltersDcConfig, StateListsForFilterDcConfig, checkOtherDCAssignedToHosp, checkDCAssignedToHospForUpdate, getDistinctDC, getDcConfigurationDetails, saveDCConfigurationLog, getCSMDCDetails, getsubmitcsmdcconfiguration, getsubmitcsmdcconfigurationview, getsubmitcsmdcconfigurationEdit, getcsmdcconfigurationupdate, savecsmDCConfiguration, savecsmDCConfigurationview, savecsmDCConfigurationgetbyid, savecsmDCConfigurationLogtdetails } from 'src/app/services/api-config';

@Injectable({
  providedIn: 'root'
})
export class DcconfigurationService {


  constructor(private http: HttpClient, private jwtService: JwtService) { }

  getDCDetails() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    //let fullUrl = snoDetails;
    //var url = "master/getSNODetails";
    let fullUrl = getDCDetails;
    return this.http.get(fullUrl, options);
  }
  getDClist() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    //let fullUrl = snoDetails;
    //var url = "master/getSNODetails";
    let fullUrl = getDClist;
    return this.http.get(fullUrl, options);
  }

  checkDCAssignedToHosp(object): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    //var url = "snoConfiguration/saveSNOConfiguration";
    let fullUrl = checkDCAssignedToHosp;
    return this.http.post(fullUrl, object, options);
  }

  checkDCAssignedToHospForUpdate(object): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    //var url = "snoConfiguration/saveSNOConfiguration";
    let fullUrl = checkDCAssignedToHospForUpdate;
    return this.http.post(fullUrl, object, options);
  }

  checkOtherDCAssignedToHosp(object): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    //var url = "snoConfiguration/saveSNOConfiguration";
    let fullUrl = checkOtherDCAssignedToHosp;
    return this.http.post(fullUrl, object, options);

  }

  saveDCConfiguration(object): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    //var url = "snoConfiguration/saveSNOConfiguration";
    let fullUrl = saveDCConfiguration;
    return this.http.post(fullUrl, object, options);
  }

  saveDCConfigurationLog(dcId, createdBy): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
      .append('dcId', dcId)
      .append('createdBy', createdBy);
    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = saveDCConfigurationLog;
    return this.http.get(fullUrl, options);
  }

  updateDCConfiguration(object): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    //var url = "snoConfiguration/updateSnoData";
    let fullUrl = updateDCConfiguration;
    return this.http.post(fullUrl, object, options);
  }

  getDcById(dcUserId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams().append('dcUserId', dcUserId);
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getConfigurationDetailsByIdDC;
    return this.http.get(fullUrl, options);
  }

  getDcConfigurationList() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    // var url = "snoConfiguration/getSnoConfigurationDetails";
    let fullUrl = getConfigurationDetailsByDC;
    return this.http.get(fullUrl, options);
  }

  getStateListsForFilterDcConfig(stateId) {
    // return this.http.get<any>(`${this.baseUrl+"api/getDistrictMappingDetailsFilteredByDepartment"}/${stateId}`);

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams().append('stateId', stateId);
    let options = {
      headers: headers,
      params: queryparams
    }

    //var url = "cpdConfiguration/Delete";
    let fullUrl = StateListsForFilterDcConfig;
    return this.http.get(fullUrl, options);
  }


  getDistrictListsForFiltersDcConfig(stateId, districtId) {
    // return this.http.get<any>(`${this.baseUrl+"api/getDistrictMappingDetailsFilteredByScheme"}/${districtId}`);

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams().append('stateId', stateId).append('districtId', districtId);
    let options = {
      headers: headers,
      params: queryparams
    }

    //var url = "cpdConfiguration/Delete";
    let fullUrl = DistrictListsForFiltersDcConfig;
    return this.http.get(fullUrl, options);
  }

  getDcConfigList(userId: any, state: any, dist: any, hospital: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    // let queryparams = new HttpParams().append('userId', userId);
    let options = {
      headers: headers,
      params: {
        userId: userId,
        state: state,
        dist: dist,
        hospital: hospital
      }
    };
    let fullUrl = getDistinctDC;
    return this.http.get(fullUrl, options);
  }

  getDcConfigurationDetails(userId, stateId, districtId) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
      .append('userId', userId)
      .append('stateId', stateId)
      .append('districtId', districtId);
    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = getDcConfigurationDetails;
    return this.http.get(fullUrl, options);
  }

  getCSMDCDetails() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    //let fullUrl = snoDetails;
    //var url = "master/getSNODetails";
    let fullUrl = getCSMDCDetails;
    return this.http.get(fullUrl, options);
  }

  saveCSMDCConfigurationLog(dcId: any, hospitalCodesString: any, userId: any, latitude: any, longitude: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
      .append('dcId', dcId)
      .append('hospitalCodesString', hospitalCodesString)
      .append('userId', userId)
      .append('latitude', latitude)
      .append('longitude', longitude);
    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = getsubmitcsmdcconfiguration;
    return this.http.get(fullUrl, options);
  }

  saveCSMDCConfigurationLogview(dcId:any, statecode:any, distcode:any, hospitalCode:any, userId:any,group:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
      .append('group', group)
      .append('dcId', dcId)
      .append('statecode', statecode)
      .append('distcode', distcode)
      .append('hospitalCode', hospitalCode)
      .append('userId', userId);
    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = getsubmitcsmdcconfigurationview;
    return this.http.get(fullUrl, options);
  }


  saveCSMDCConfigurationLogedit(csmdcId:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
      .append('csmdcId', csmdcId);
    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = getsubmitcsmdcconfigurationEdit;
    return this.http.get(fullUrl, options);
  }

  saveCSMDCConfigurationLogUpdate(dcId: any, hospitalCodesString: any, userId: any, latitude: any, longitude: any, csmdcmappedid: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
      .append('dcId', dcId)
      .append('hospitalCodesString', hospitalCodesString)
      .append('userId', userId)
      .append('latitude', latitude)
      .append('longitude', longitude)
      .append('csmdcmappedid', csmdcmappedid);
    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = getcsmdcconfigurationupdate;
    return this.http.get(fullUrl, options);
  }

  savecsmdcstateanddistrict(object: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    let fullUrl = savecsmDCConfiguration;
    return this.http.post(fullUrl, object, options);
  }

  getviewlist(csmdcId:any,userid:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
      .append('csmdcId', csmdcId)
      .append('userid', userid);
    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = savecsmDCConfigurationview;
    return this.http.get(fullUrl, options);
  }


  getdetailsbyid(csmdcId:any,userid:any,statecode:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
      .append('csmdcId', csmdcId)
      .append('userid', userid)
      .append('statecode', statecode);
    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = savecsmDCConfigurationgetbyid;
    return this.http.get(fullUrl, options);
  }
  getviewloglist(csmdcId:any,userid:any,statecode:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
      .append('csmdcId', csmdcId)
      .append('userid', userid)
      .append('statecode', statecode);
    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = savecsmDCConfigurationLogtdetails;
    return this.http.get(fullUrl, options);
  }
}
