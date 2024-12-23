import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { checkDCAssignedToHosp, checkDCAssignedToHospForUpdate,updatecdmoConfiguration, checkOtherDCAssignedToHosp, DistrictListsForFiltersDcConfig, getCDMODetails, getcdmoList, getDcConfigurationDetails, getDCDetails, savecdmoConfiguration, StateListsForFilterDcConfig } from 'src/app/services/api-config';

import { JwtService } from 'src/app/services/jwt.service';



@Injectable({

  providedIn: 'root'

})

export class CDMOconfigurationServiceService {



  constructor(private http: HttpClient, private jwtService: JwtService) { }



  saveDCConfiguration(object: any) {

    let headers = new HttpHeaders({

      'Content-Type': 'application/json',

      'Authorization': this.jwtService.getJwtToken()

    });

    let options = {

      headers: headers

    };

    //var url = "snoConfiguration/saveSNOConfiguration";

    let fullUrl = savecdmoConfiguration;

    return this.http.post(fullUrl, object, options);

  }

  updateDCConfiguration(object: { cdmoMappingId: any; cdmoId: any; stateCode: any; districtCode: any; status: any; }) {

    let headers = new HttpHeaders({

      'Content-Type': 'application/json',

      'Authorization': this.jwtService.getJwtToken()

    });

    let options = {

      headers: headers

    };

    //var url = "snoConfiguration/saveSNOConfiguration";

    let fullUrl = updatecdmoConfiguration;

    return this.http.post(fullUrl, object, options);

  }

  getCDMODetails() {

    let headers = new HttpHeaders({

      'Content-Type': 'application/json',

      'Authorization': this.jwtService.getJwtToken()

    });

    let options = {

      headers: headers

    };

    //let fullUrl = snoDetails;

    //var url = "master/getSNODetails";

    let fullUrl = getCDMODetails;

    return this.http.get(fullUrl, options);

  }

  // checkDCAssignedToHosp(object): Observable<any> {

  //   let headers = new HttpHeaders({

  //     'Content-Type': 'application/json',

  //     'Authorization': this.jwtService.getJwtToken()

  //   });

  //   let options = {

  //     headers: headers

  //   };

  //   //var url = "snoConfiguration/saveSNOConfiguration";

  //   let fullUrl = checkDCAssignedToHosp;

  //   return this.http.post(fullUrl, object, options);

  // }



  // checkDCAssignedToHospForUpdate(object): Observable<any> {

  //   let headers = new HttpHeaders({

  //     'Content-Type': 'application/json',

  //     'Authorization': this.jwtService.getJwtToken()

  //   });

  //   let options = {

  //     headers: headers

  //   };

  //   //var url = "snoConfiguration/saveSNOConfiguration";

  //   let fullUrl = checkDCAssignedToHospForUpdate;

  //   return this.http.post(fullUrl, object, options);

  // }



  // checkOtherDCAssignedToHosp(object): Observable<any> {

  //   let headers = new HttpHeaders({

  //     'Content-Type': 'application/json',

  //     'Authorization': this.jwtService.getJwtToken()

  //   });

  //   let options = {

  //     headers: headers

  //   };

  //   //var url = "snoConfiguration/saveSNOConfiguration";

  //   let fullUrl = checkOtherDCAssignedToHosp;

  //   return this.http.post(fullUrl, object, options);



  // }



  saveCDMOConfiguration(object): Observable<any> {

    let headers = new HttpHeaders({

      'Content-Type': 'application/json',

      'Authorization': this.jwtService.getJwtToken()

    });

    let options = {

      headers: headers

    };

    //var url = "snoConfiguration/saveSNOConfiguration";

    let fullUrl = savecdmoConfiguration;

    return this.http.post(fullUrl, object, options);



  }



  // updateDCConfiguration(object): Observable<any> {

  //   let headers = new HttpHeaders({

  //     'Content-Type': 'application/json',

  //     'Authorization': this.jwtService.getJwtToken()

  //   });

  //   let options = {

  //     headers: headers

  //   };

  //   //var url = "snoConfiguration/updateSnoData";

  //   let fullUrl = updateDCConfiguration;

  //   return this.http.post(fullUrl, object, options);

  // }



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

    let fullUrl = getDcConfigurationDetails;

    return this.http.get(fullUrl, options);

  }



  // getDcConfigurationList() {

  //   let headers = new HttpHeaders({

  //     'Content-Type': 'application/json',

  //     'Authorization': this.jwtService.getJwtToken()

  //   });

  //   let options = {

  //     headers: headers

  //   };

  //   // var url = "snoConfiguration/getSnoConfigurationDetails";

  //   let fullUrl = getConfigurationDetailsByDC;

  //   return this.http.get(fullUrl, options);

  // }



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

  getlist(){



    let headers = new HttpHeaders({

         'Content-Type': 'application/json',

         'Authorization': this.jwtService.getJwtToken()

       })

       let options = {

         headers: headers

       }

       let token = this.jwtService.getJwtToken();

       let fullUrl =getcdmoList;

       return this.http.get(fullUrl, options);



     }



  // getDcConfigList(userId) {

  //   let headers = new HttpHeaders({

  //     'Content-Type': 'application/json',

  //     'Authorization': this.jwtService.getJwtToken()

  //   });

  //   let queryparams = new HttpParams().append('userId', userId);

  //   let options = {

  //     headers: headers,

  //     params: queryparams

  //   };

  //   let fullUrl = getDistinctDC;

  //   return this.http.get(fullUrl, options);

  // }



  // getDcConfigurationDetails(userId, stateId, districtId) {

  //   let headers = new HttpHeaders({

  //     'Content-Type': 'application/json',

  //     'Authorization': this.jwtService.getJwtToken()

  //   });

  //   let queryparams = new HttpParams()

  //     .append('userId', userId)

  //     .append('stateId', stateId)

  //     .append('districtId', districtId);

  //   let options = {

  //     headers: headers,

  //     params: queryparams

  //   };

  //   let fullUrl = getDcConfigurationDetails;

  //   return this.http.get(fullUrl, options);

  // }

}
