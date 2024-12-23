import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { checkDuplicateHospitalCode, validateotpforhosp,gethostlogdata,getallhospitalbackdatelogdata,
  generateoptforhospitalupdate,getmouexplist,gethcexplist,getincentivedetails,getincentive,
  getallhospitallogdata,updatebackdateconfig,deleteHospitalData, DetailsFilteredByDistrictHospital,
  DetailsFilteredByStateHospital, saveHospitalData, updateHospitalData, updateHospitalDataById,
  getHospitalList, updateHospitalDataByUserId, saveHosplog, getHospitalDetails, serachHospitalData,
  updateHospitalProfile, hospitallistforotpconfigure, submithospitallistforotpconfigure, getTreatingdoctorconfigurationlist, SubmitgetTreatingdoctorconfigurationlist, getlogdetailsFortreatingdoctor, getunbundlingpagedetails, getSubmitunbundlingpagedetails, hospitallistforloginotpconfigure, submithospitallistforloginotpconfigure, hospitallistforfaceradiousconfigure, savehospitalfaceradious } from 'src/app/services/api-config';

import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {


  constructor(private http: HttpClient, private jwtService: JwtService) { }

  saveHospital(data: any): Observable<any> {
    console.log(data);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let token = this.jwtService.getJwtToken();
    let fullUrl = saveHospitalData;

    return this.http.post(fullUrl, data, options);
  }

  hospitalreport(stateid: any, distid: any, sna: any, dc:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers,
      params: {
        'stateid': stateid,
        'distid': distid,
        'sna': sna,
        'dc': dc
      }
    }
    let token = this.jwtService.getJwtToken();
    let fullUrl = serachHospitalData;

    return this.http.get(fullUrl, options);
  }


  getHospitalList(stateId, districtId, cpdApprovalRequired, snoTagged, categoryId,tmsActive) {
    console.log()
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
      .append('stateId', stateId)
      .append('districtId', districtId)
      .append('cpdApprovalRequired', cpdApprovalRequired)
      .append('snoTagged', snoTagged)
      .append('categoryId', categoryId)
      .append('tmsActive', tmsActive);
    let options = {
      headers: headers,
      params: queryparams
    }
    let token = this.jwtService.getJwtToken();
    let fullUrl = getHospitalList;
    return this.http.get(fullUrl, options);
  }

  checkDuplicateCode(hospitalCode: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    };
    let token = this.jwtService.getJwtToken();
    let fullUrl = checkDuplicateHospitalCode+"?hospitalCode="+hospitalCode;
    return this.http.get(fullUrl, options);
  }

  deleteDetails(hospitalId: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    let token = this.jwtService.getJwtToken();
    let fullUrl=deleteHospitalData+"?hospitalId="+hospitalId;
    return this.http.get(fullUrl,options)
  }

  getbyhId(hospitalId: any):Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers

    };
    let token = this.jwtService.getJwtToken();
    let fullUrl = updateHospitalDataById+"?hospitalId="+hospitalId;
    return this.http.get(fullUrl, options);
  }

  getbyUserId(userId: any):Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    let token = this.jwtService.getJwtToken();
    let fullUrl = updateHospitalDataByUserId+"?userId="+userId;
    return this.http.get(fullUrl, options);
  }

  updateHospital(data: any): Observable<any>{
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    let token = this.jwtService.getJwtToken();
    let fullUrl=updateHospitalData;
    return this.http.post(fullUrl,data,options);
  }

  updateHospitalProfile(data: any): Observable<any>{
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    let token = this.jwtService.getJwtToken();
    let fullUrl=updateHospitalProfile;
    return this.http.post(fullUrl,data,options);
  }

  saveHosplog(userId:any, createdBy:any): Observable<any>{
    let headers = new HttpHeaders({
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
      .append('userId', userId)
      .append('createdBy', createdBy);
    let options = {
      headers:headers,
      params: queryparams
    }
    var fullUrl = saveHosplog;
    return this.http.get(fullUrl,options);
  }

  // saveHospDashlog(logData:any): Observable<any>{
  //   let headers = new HttpHeaders({
  //     'Authorization': this.jwtService.getJwtToken()
  //   })
  //   let options = {
  //     headers:headers
  //   }
  //   var fullUrl = saveHospDashlog;
  //   return this.http.post(fullUrl,logData,options);
  // }

  getStateListsForFilterHospital(stateId) {
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
    let fullUrl = DetailsFilteredByStateHospital;
    return this.http.get(fullUrl, options);
  }

  getDistrictListsForFiltersHospital(stateId, districtId) {
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
    let fullUrl = DetailsFilteredByDistrictHospital;
    return this.http.get(fullUrl, options);
  }


  getHospitalDetails(hospitalId) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams().append('hospitalId', hospitalId);
    let options = {
      headers: headers,
      params: queryparams
    }

    //var url = "cpdConfiguration/Delete";
    let fullUrl = getHospitalDetails;
    return this.http.get(fullUrl, options);
  }

  getPosition(): Promise<any> {
    return new Promise((resolve, reject) => {
      // navigator.permissions.query({name:'geolocation'}).then((result) => {
      //   console.log(result);
      //   if (result.state == 'prompt') {
      //     reject('Geolocation access is denied');
      //   } else {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(resp => {
            resolve({lng: resp.coords.longitude, lat: resp.coords.latitude});
            },
            err => {
              reject(err);
            });
          } else {
            reject('Geolocation is not supported by this browser');
          }
      //   }
      // });
    });
  }

  updatebackdateconfig(admission: any, discharge: any, hospcode: any, userId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers,
      params: {
        'hospital': hospcode,
        'admission': admission,
        'discharge': discharge,
        'userid': userId
      }
    }
    let fullUrl = updatebackdateconfig;
    return this.http.get(fullUrl, options);
  }

  getallhospitallogdata() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let fullUrl = getallhospitallogdata;
    return this.http.get(fullUrl, options);
  }
  getallhospitalbackdatelogdata() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let fullUrl = getallhospitalbackdatelogdata;
    return this.http.get(fullUrl, options);
  }

  getmouexplist() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let fullUrl = getmouexplist;
    return this.http.get(fullUrl, options);
  }
  gethcexplist() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let fullUrl = gethcexplist;
    return this.http.get(fullUrl, options);
  }

  getincentive(state: any, dist: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers,
      params:{
        "state":state,
        "dist":dist
      }
    }
    let fullUrl = getincentive;
    return this.http.get(fullUrl, options);
  }

  getincentivedetails(statecode: any, distcode: any, catgorycode: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers,
      params:{
        "state":statecode,
        "dist":distcode,
        "catagory":catgorycode
      }
    }
    let fullUrl = getincentivedetails;
    return this.http.get(fullUrl, options);
  }

  generateotp(userid:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers,
      params: {
        'userid':userid
      }
    }
    let fullUrl = generateoptforhospitalupdate;
    return this.http.get(fullUrl, options);
  }

  validateotpforhosp(otp: any,userid:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params: {
        'otp':otp,
        'accessid':userid
      }
    }
    var fullUrl=validateotpforhosp;
    return this.http.get(fullUrl,options)
  }

  getlogdata(hospoitalid: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
      params: {
        'hospoitalid':hospoitalid
      }
    };
    let token = this.jwtService.getJwtToken();
    let fullUrl = gethostlogdata
    return this.http.get(fullUrl, options);
  }

  hospitallistforotpconfigure(state: any, dist: any,userid:any,otpreq:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
      params: {
        'state':state,
        'dist':dist,
        'userid':userid,
        'otpreq':otpreq
      }
    };
    let fullUrl = hospitallistforotpconfigure
    return this.http.get(fullUrl, options);
  }

  hospitallistforloginotpconfigure(state: any, dist: any, userId: any, otpreq: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
      params: {
        'state':state,
        'dist':dist,
        'userid':userId,
        'otpreq':otpreq
      }
    };
    let fullUrl = hospitallistforloginotpconfigure
    return this.http.get(fullUrl, options);
  }

  submithospitallistforotpconfigure(object: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    let token = this.jwtService.getJwtToken();
    let fullUrl = submithospitallistforotpconfigure
    return this.http.post(fullUrl,object,options);
  }
  getTreatingdoctorlist(state: any, dist: any,type:any,userid:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
      params: {
        'state':state,
        'dist':dist,
        'type':type,
        'userid':userid
      }
    };
    let token = this.jwtService.getJwtToken();
    let fullUrl = getTreatingdoctorconfigurationlist
    return this.http.get(fullUrl, options);
  }
  submitTreatingdoctorlist(object: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    let token = this.jwtService.getJwtToken();
    let fullUrl = SubmitgetTreatingdoctorconfigurationlist
    return this.http.post(fullUrl,object,options);
  }

  getTreatingdoctorlogdetails() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let fullUrl = getlogdetailsFortreatingdoctor;
    return this.http.get(fullUrl, options);
  }

  getHospitalByDistrictIdSno() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let fullUrl = getunbundlingpagedetails;
    return this.http.get(fullUrl, options);
  }
  getsumitunbundlingdata(requestData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
    }
    let fullUrl = getSubmitunbundlingpagedetails;
    return this.http.post(fullUrl,requestData,options)
  }

  submithospitallistforloginotpconfigure(object:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    let token = this.jwtService.getJwtToken();
    let fullUrl = submithospitallistforloginotpconfigure
    return this.http.post(fullUrl,object,options);
  }

  hospitallistforfaceradiousconfigure(state: any, dist: any, userId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
      params: {
        'state':state,
        'dist':dist,
        'userid':userId
      }
    };
    let token = this.jwtService.getJwtToken();
    let fullUrl = hospitallistforfaceradiousconfigure;
    return this.http.get(fullUrl, options);
  }

  savehospitalfaceradious(object: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    let token = this.jwtService.getJwtToken();
    let fullUrl = savehospitalfaceradious;
    return this.http.post(fullUrl,object, options);
  }

}
