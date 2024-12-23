import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JwtService } from 'src/app/services/jwt.service';
import {
  CpdDetailsFilteredByDistrict,
  CpdDetailsFilteredByState,
  deleteCpd,
  deleteSno,
  DetailsFilteredByDistrictSno,
  DetailsFilteredByStateSno,
  DistrictListsForFiltersSnoConfig,
  getConfigurationDetailsById,
  getConfigurationDetailsByIdSno,
  getConfigurationDetailsBySno,
  getCPDDetails,
  getDistrictDetailsByStateId,
  getHospitalByDistrictId,
  getHospitalByDistrictIdSno,
  getSNODetails,
  getStateMasterDetails,
  saveCPDConfiguration,
  saveSNOConfiguration,
  StateListsForFilterSnoConfig,
  updateCpdMasterData,
  updateSnoMasterData,
  checkSNOAssignedToHosp,
  getDistrictMasterDetails,
  checkCPDAssignedClaims,
  checkSNOAssignedToHospForSNA,
  getDistinctCPD,
  getConfigurationDetails,
  getSnoConfigurationDetails,
  getDistinctSNA,
  checkSNOAssignedToHospForUpdate,
  getSNAExecutiveDetails,
  saveSNAExecutive,
  getSNAExecutive,
  getSNAExecutiveMapping,
  getSnaExecById,
  updateSNAExecutive,
  getMonths,
  getYears,
  checkCPDAssignedClaimsForUpdate,
  checkDuplicatsnoname,
  getallhospitalreport,
  deleteSNOdata,
  deleteUserDetailsforSNO,
  ForupdateByIdSNOData,
  getSNOUserDetails,
  saveSNODetails,
  updateSNOUserData,
  getSnaListByExecutive,
  getHospitalCategoryList,
  saveSNOConfigurationLog,
  saveCPDConfigurationLog,
  saveSNOConfigurationLogForHospital,
  cpdwiseunprocessed,
  getHospitalListByUserId,
  getDistrictListByStateIddcid,
  getHospitalbyDistrictIddcid,
  getblockByDistrictId,
  getDClistForCDMO,
  getDClistByStateAndDist,
  getSNAList,
  hospitalWiseTreatment,
  getDistrictDetailsByNFSA, getMappedAuthDetails,
  latitudenlongitude
} from 'src/app/services/api-config';

@Injectable({
  providedIn: 'root'
})

/*
***
**** Author : Aman Jha
***
*/
export class SnocreateserviceService {



  constructor(private http: HttpClient, private jwtService: JwtService) { }

  saveSNOData(data: any) {
    console.log(data);
    let headers = new HttpHeaders({
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers

    };
    let fullUrl = saveSNODetails
    return this.http.post(fullUrl, data, options);

  }
  hospitalreport() {
    let headers = new HttpHeaders({
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers

    };
    let fullUrl = getallhospitalreport
    return this.http.get(fullUrl, options);
  }

  getSNOUserDetailsData() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    }
    let fullUrl = getSNOUserDetails;
    return this.http.get(fullUrl, options)
  }

  checkDuplicateData(userName: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    };
    let fullUrl = checkDuplicatsnoname + "?userName=" + userName;
    return this.http.get(fullUrl, options);
  }

  deleteSNOuserDetailsData(bskyUserId: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    let fullUrl = deleteSNOdata + "?bskyUserId=" + bskyUserId;
    return this.http.get(fullUrl, options)
  }
  deleteUserDeatilsSNO(userId: any): Observable<any> {

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    let fullUrl = deleteUserDetailsforSNO + "?userId=" + userId;
    return this.http.get(fullUrl, options)
  }
  updateSNOuser(data: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    let fullUrl = updateSNOUserData;
    return this.http.post(fullUrl, data, options);
  }
  forupdateByIDSNO(bskyUserId: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    let fullUrl = ForupdateByIdSNOData + "?bskyUserId=" + bskyUserId;
    return this.http.get(fullUrl, options);

  }

  getSNODetails() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    //let fullUrl = snoDetails;
    //var url = "master/getSNODetails";
    let fullUrl = getSNODetails;
    return this.http.get(fullUrl, options);
  }
  getSNAList() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    //let fullUrl = snoDetails;
    //var url = "master/getSNODetails";
    let fullUrl = getSNAList;
    return this.http.get(fullUrl, options);
  }

  getCPDList() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    //let fullUrl = snoDetails;
    //var url = "master/getCPDDetails";
    let fullUrl = getCPDDetails;
    return this.http.get(fullUrl, options);
  }

  getStateList() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    //var url = "master/getStateMasterDetails";
    let fullUrl = getStateMasterDetails;
    return this.http.get(fullUrl, options);
  }

  getDistrictListByStateId(stateCode: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });

    let queryparams = new HttpParams().append('stateCode', stateCode);
    let options = {
      headers: headers,
      params: queryparams
    };
    //var url = "master/getDistrictDetailsByStateId/" + stateCode;
    let fullUrl = getDistrictDetailsByStateId;
    return this.http.get(fullUrl, options);
  }

  getDistrictByStateAndDistrictCode(stateCode: any, districtCode: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });

    let queryparams = new HttpParams()
    .append('stateCode', stateCode)
    .append('districtCode', districtCode);
    let options = {
      headers: headers,
      params: queryparams
    };
    //var url = "master/getDistrictDetailsByStateId/" + stateCode;
    let fullUrl = getDistrictMasterDetails;
    return this.http.get(fullUrl, options);
  }

  getHospitalbyDistrictId(districtCode: any, stateCode: any) {
    const httpOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.jwtService.getJwtToken()
      },
      params: { 'districtCode': districtCode, 'stateCode': stateCode }
    };
    //var url = "master/getHospitalByDistrictId";
    let fullUrl = getHospitalByDistrictId;
    return this.http.get(fullUrl, httpOptions);
  }

  getHospitalByDistrictIdSno(snoId: any, districtCode: any, stateCode: any) {
    const httpOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.jwtService.getJwtToken()
      },
      params: { 'snoId': snoId, 'districtCode': districtCode, 'stateCode': stateCode }
    };
    //var url = "master/getHospitalByDistrictId";
    let fullUrl = getHospitalByDistrictIdSno;
    return this.http.get(fullUrl, httpOptions);
  }

  getBlockbyDistrictId(districtCode: any, stateCode: any) {
    const httpOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.jwtService.getJwtToken()
      },
      params: { 'districtCode': districtCode, 'stateCode': stateCode }
    };
    //var url = "master/getHospitalByDistrictId";
    let fullUrl = getblockByDistrictId;
    return this.http.get(fullUrl, httpOptions);
  }

  getHospitalCategoryList() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    //var url = "master/getStateMasterDetails";
    let fullUrl = getHospitalCategoryList;
    return this.http.get(fullUrl, options);
  }

  saveSNOConfiguration(object): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    //var url = "snoConfiguration/saveSNOConfiguration";
    let fullUrl = saveSNOConfiguration;
    return this.http.post(fullUrl, object, options);

  }

  saveSNOConfigurationLog(snoUserId, createdBy, ipAddress): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
      .append('snoUserId', snoUserId)
      .append('createdBy', createdBy)
      .append('ipAddress', ipAddress);
    let options = {
      headers: headers,
      params: queryparams
    };
    //var url = "snoConfiguration/saveSNOConfiguration";
    let fullUrl = saveSNOConfigurationLog;
    return this.http.get(fullUrl, options);
  }

  saveSNOConfigurationLogForHospital(hospitalCode, createdBy, ipAddress): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
      .append('hospitalCode', hospitalCode)
      .append('createdBy', createdBy)
      .append('ipAddress', ipAddress);
    let options = {
      headers: headers,
      params: queryparams
    };
    //var url = "snoConfiguration/saveSNOConfiguration";
    let fullUrl = saveSNOConfigurationLogForHospital;
    return this.http.get(fullUrl, options);
  }

  saveCPDConfigurationLog(cpdUserId, createdBy, ipAddress): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
      .append('cpdUserId', cpdUserId)
      .append('createdBy', createdBy)
      .append('ipAddress', ipAddress);
    let options = {
      headers: headers,
      params: queryparams
    };
    //var url = "snoConfiguration/saveSNOConfiguration";
    let fullUrl = saveCPDConfigurationLog;
    return this.http.get(fullUrl, options);
  }

  checkSNOAssignedToHosp(object): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    //var url = "snoConfiguration/saveSNOConfiguration";
    let fullUrl = checkSNOAssignedToHosp;
    return this.http.post(fullUrl, object, options);
  }

  checkSNOAssignedToHospForUpdate(object): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    //var url = "snoConfiguration/saveSNOConfiguration";
    let fullUrl = checkSNOAssignedToHospForUpdate;
    return this.http.post(fullUrl, object, options);
  }

  checkSNOAssignedToHospForSNA(object): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    //var url = "snoConfiguration/saveSNOConfiguration";
    let fullUrl = checkSNOAssignedToHospForSNA;
    return this.http.post(fullUrl, object, options);
  }

  checkCPDAssignedClaims(object): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    let fullUrl = checkCPDAssignedClaims;
    return this.http.post(fullUrl, object, options);
  }

  checkCPDAssignedClaimsForUpdate(object): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    let fullUrl = checkCPDAssignedClaimsForUpdate;
    return this.http.post(fullUrl, object, options);
  }

  saveCPDConfiguration(object): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    //var url = "cpdConfiguration/saveCPDConfiguration";
    let fullUrl = saveCPDConfiguration;
    return this.http.post(fullUrl, object, options);
  }

  getCpdConfigurationList(bskyUserId): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams().append('bskyUserId', bskyUserId)
    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = getDistinctCPD;
    return this.http.get(fullUrl, options);
  }

  getCpdConfigurationDetails(bskyUserId, stateId, districtId) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
      .append('bskyUserId', bskyUserId)
      .append('stateId', stateId)
      .append('districtId', districtId);
    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = getConfigurationDetails;
    return this.http.get(fullUrl, options);
  }

  getSnoConfigurationDetails(userId, stateId, districtId) {
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
    let fullUrl = getSnoConfigurationDetails;
    return this.http.get(fullUrl, options);
  }

  getSnoConfigurationList(userId) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams().append('userId', userId);
    let options = {
      headers: headers,
      params: queryparams
    };
    // var url = "snoConfiguration/getSnoConfigurationDetails";
    let fullUrl = getDistinctSNA;
    return this.http.get(fullUrl, options);
  }

  getbyid(cpdUserId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams().append('cpdUserId', cpdUserId);
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getConfigurationDetailsById;
    return this.http.get(fullUrl, options);
  }

  getSnoById(snoUserId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams().append('snoUserId', snoUserId);
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getConfigurationDetailsByIdSno;
    return this.http.get(fullUrl, options);
  }

  updateCPDConfiguration(object): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    //var url = "cpdConfiguration/updateCpdData";
    let fullUrl = updateCpdMasterData;
    return this.http.post(fullUrl, object, options);
  }

  updateSNOConfiguration(object): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    let fullUrl = updateSnoMasterData;
    return this.http.post(fullUrl, object, options);
  }

  delete(cpdMappingId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams().append('cpdMappingId', cpdMappingId);
    let options = {
      headers: headers,
      params: queryparams
    }

    //var url = "cpdConfiguration/Delete";
    let fullUrl = deleteCpd;
    return this.http.get(fullUrl, options);
  }

  deleteSno(snoMappingId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams().append('snoMappingId', snoMappingId);
    let options = {
      headers: headers,
      params: queryparams
    }

    //var url = "snoConfiguration/DeleteSno";
    let fullUrl = deleteSno;
    return this.http.get(fullUrl, options);
  }

  getStateListsForFilter(stateId) {
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
    let fullUrl = CpdDetailsFilteredByState;
    return this.http.get(fullUrl, options);
  }


  getDistrictListsForFilters(stateId, districtId) {
    // return this.http.get<any>(`${this.baseUrl+"api/getDistrictMappingDetailsFilteredByScheme"}/${districtId}`);

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
      .append('stateId', stateId)
      .append('districtId', districtId);
    let options = {
      headers: headers,
      params: queryparams
    }

    //var url = "cpdConfiguration/Delete";
    let fullUrl = CpdDetailsFilteredByDistrict;
    return this.http.get(fullUrl, options);
  }


  getStateListsForFilterForSno(stateId) {
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
    let fullUrl = DetailsFilteredByStateSno;
    return this.http.get(fullUrl, options);
  }


  getDistrictListsForFiltersForSno(stateId, districtId) {
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
    let fullUrl = DetailsFilteredByDistrictSno;
    return this.http.get(fullUrl, options);
  }


  getStateListsForFilterSnoConfig(stateId) {
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
    let fullUrl = StateListsForFilterSnoConfig;
    return this.http.get(fullUrl, options);
  }


  getDistrictListsForFiltersSnoConfig(stateId, districtId) {
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
    let fullUrl = DistrictListsForFiltersSnoConfig;
    return this.http.get(fullUrl, options);
  }
  getSNAEXDetails() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    //let fullUrl = snoDetails;
    //var url = "master/getSNODetails";
    let fullUrl = getSNAExecutiveDetails;
    return this.http.get(fullUrl, options);
  }
  saveSNAExecutiveConfiguration(object): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    //var url = "snoConfiguration/saveSNOConfiguration";
    let fullUrl = saveSNAExecutive;
    return this.http.post(fullUrl, object, options);

  }
  getSnaExecConfigurationList(userId) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams().append('userId', userId);
    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = getSNAExecutive;
    return this.http.get(fullUrl, options);
  }
  getSNAExecutiveDetails(userId) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
      .append('userId', userId);
    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = getSNAExecutiveMapping;
    return this.http.get(fullUrl, options);
  }

  getSnaExecById(snoUserId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams().append('snoUserId', snoUserId);
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getSnaExecById;
    return this.http.get(fullUrl, options);
  }
  updateSNAExecConfiguration(object): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    let fullUrl = updateSNAExecutive;
    return this.http.post(fullUrl, object, options);
  }

  getMonths() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    //var url = "master/getStateMasterDetails";
    let fullUrl = getMonths;
    return this.http.get(fullUrl, options);
  }

  getYears() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    //var url = "master/getDistrictDetailsByStateId/" + stateCode;
    let fullUrl = getYears;
    return this.http.get(fullUrl, options);
  }
  getSNOListByExecutive(userId){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams().append('userId', userId);
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getSnaListByExecutive;
    return this.http.get(fullUrl, options);
  }

  getIpAddress() {
    return this.http.get("http://api.ipify.org/?format=json");
  }

  getcpdwiseunprocessed(requestData: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = cpdwiseunprocessed;
    return this.http.post(fullUrl,requestData, options);
  }


  getHospitalById(userId){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams().append('userId', userId);
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getHospitalListByUserId;
    return this.http.get(fullUrl, options);
  }
  getDCDetails(userId:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
      params:{
        'userId':userId
      }
    };
    //let fullUrl = snoDetails;
    //var url = "master/getSNODetails";
    let fullUrl = getDClistForCDMO;
    return this.http.get(fullUrl, options);
  }
  getDistrictListByStateIddcid(userId: any, id: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers,
      params:{
        'dcid':userId,
        'stateid':id
      }
    }
    let fullUrl = getDistrictListByStateIddcid;
    return this.http.get(fullUrl, options);
  }
  getHospitalbyDistrictIddcid(userId: any, id: any, stateCode: string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers,
      params:{
        'dcid':userId,
        'stateid':stateCode,
        'distid':id
      }
    }
    let fullUrl = getHospitalbyDistrictIddcid;
    return this.http.get(fullUrl, options);
 }
 getDCDetailsByStateAndDist(stateId:any,distId:any) {
  let headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': this.jwtService.getJwtToken()
  });
  let options = {
    headers: headers,
    params:{
      'stateId':stateId,
      'distId':distId
    }
  };
  let fullUrl = getDClistByStateAndDist;
  return this.http.get(fullUrl, options);
}

  getHospitalWiseTreatment(data: any) {
    let headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Authorization': this.jwtService.getJwtToken()
      }
    )

    let options = {
      headers: headers
    };
    return this.http.post(hospitalWiseTreatment, data, options)
  }

  getDistrictListByStateIdNFSA() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    let fullUrl = getDistrictDetailsByNFSA;
    return this.http.get(fullUrl, options);
  }

  getMappedAuthDetails(data): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    return this.http.post(getMappedAuthDetails, data, options);
  }

  gethospitallatitudeandlongitude(id:any, statecode:any, distcode:any, hospitalCode:any) {
    const httpOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.jwtService.getJwtToken()
      },
      params: { 'statecode': statecode, 'distcode': distcode ,'hospitalCode': hospitalCode}
    };
    let fullUrl = latitudenlongitude;
    return this.http.get(fullUrl, httpOptions);
  }
}
