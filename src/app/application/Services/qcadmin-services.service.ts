import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtService } from 'src/app/services/jwt.service';
import { getlistdatabyhos, gethospitalwiseclaimreportdata, getAllDischargeCountAndAllsubmittedDetails, updateEmpanelhospdata, getAllhosplist, getHosplistviewpage, gettmasactivehospitallist, savepecialistconfig, getpackagelistbyhospitalid, savecivilinfraconfig, getcivilinfradetails, getHospitalDetailsFromCode, getEmpaneledhospitallist, getcivilInfraDetailsById, updatePackageSpecility, getsearchdataofhospitallspecilityapproval, getsearchdataofhospitallspecdetailslist, getsearchdataofhospitallspecdetailstpendingcase, getQcapprovalofhospitalspeciality, specialityapprovelist, submituidauthconfig, temporyoverridecode, temporyoverridecodeview, removetemporyoverridecode, getMappedAuthDetailslog, getMappedAuthDetailsview, saveHospitalDeactivation, getHospitalDetailsfordeactive, getHospitalDeactivionview, getHospitalDeactivionlog, downLoaddeempanelDoc } from 'src/app/services/api-config';
import { log } from 'console';

@Injectable({
  providedIn: 'root'
})
export class QcadminServicesService {

  constructor(private http: HttpClient, private jwtService: JwtService) { }


  getHospitalList() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let token = this.jwtService.getJwtToken();
    let fullUrl = getAllhosplist;
    return this.http.get(fullUrl, options);

  }


  getDatabyhospitalCode(hospitalId: any) {

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });

    let queryparams = new HttpParams()
      .append('hospitalId', hospitalId);

    let options = {
      headers: headers,
      params: queryparams
    };
    //var url = "master/getDistrictDetailsByStateId/" + stateCode;
    let fullUrl = getlistdatabyhos;
    return this.http.get(fullUrl, options);
  }


  //correct one

  // updateEmpanelhospData(data: any,file: any){
  //   console.log(data);

  //   let headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Authorization': this.jwtService.getJwtToken()
  //   })
  //   let options = {
  //     headers:headers
  //   }
  //   var fullUrl = updateEmpanelhospdata;
  //   return this.http.post(fullUrl,data,options);

  // }




  // save(object: { sgroup: any; fdate: any; tdate: any; noticeContent: any; screate: any; file:any},file:any) {
  //   let headers = new HttpHeaders({
  //     'Authorization': this.jwtService.getJwtToken(),
  //   })

  //   let options = {
  //     headers: headers,
  //   }
  //   const formData: FormData = new FormData();
  //   formData.append('file2', file);
  //   formData.append('tdate', object.tdate)
  //   formData.append('sgroup', object.sgroup)
  //   formData.append('fdate', object.fdate)
  //   formData.append('noticeContent', object.noticeContent)
  //   formData.append('screate', object.screate)
  //   let fullUrl = savenotification;
  //   return this.http.post(fullUrl,formData,options)
  // }



  //first try

  // updateEmpanelhospData(object: {hospitalCode: any; mobile: any; emailId: any; stateCode: any; districtCode: any; hospitalCategoryid:any;
  //   hosCValidDateFrom:any; hosCValidDateTo:any; mou:any; mouStartDt:any; mouEndDt:any; status:any;
  //   mouStatus:any;empanelmentstatus:any;updatedby:any;file:any},file:any)
  // {
  //   //console.log(data);

  //   let headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Authorization': this.jwtService.getJwtToken()
  //   })
  //   let options = {
  //     headers:headers,
  //   }
  //   const formData: FormData = new FormData();
  //   formData.append('file2', file);
  //   formData.append('hospitalCode', object.hospitalCode)
  //   formData.append('mobile', object.mobile)
  //   formData.append('emailId', object.emailId)
  //   formData.append('stateCode', object.stateCode)
  //   formData.append('districtCode', object.districtCode)
  //   formData.append('hospitalCategoryid', object.hospitalCategoryid)
  //   formData.append('hosCValidDateFrom', object.hosCValidDateFrom)
  //   formData.append('hosCValidDateTo', object.hosCValidDateTo)
  //   formData.append('mou', object.mou)
  //   formData.append('mouStartDt', object.mouStartDt)
  //   formData.append('mouEndDt', object.mouEndDt)
  //   formData.append('status', object.status)
  //   formData.append('mouStatus', object.mouStatus)
  //   formData.append('empanelmentstatus', object.empanelmentstatus)
  //   formData.append('updatedby', object.updatedby)
  //   var fullUrl = updateEmpanelhospdata;
  //   return this.http.post(fullUrl,formData,options);
  // }




  updateEmpanelhospData(object: {
    hospitalCode: any; mobile: any; emailId: any; stateCode: any; districtCode: any; hospitalCategoryid: any;
    hosCValidDateFrom: any; hosCValidDateTo: any; mou: any; mouStartDt: any; mouEndDt: any;
    mouStatus: any; empanelmentstatus: any; isBlockActive: any; updatedby: any; preauthapprovalrequired: any; cpdApprovalRequired: any,
    certification: any, validateFrom1: any, validateFrom2: any, hospitalregistration: any, validateFrom3: any, validateFrom4: any
  }, file: any, file2: any, file3: any,previousuploadedfiredistingusher:any,previousuploadedclinical:any) {
    let headers = new HttpHeaders({
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers,
    }
    const formData: FormData = new FormData();
    formData.append('file2', file);
    formData.append('hospitalCode', object.hospitalCode)
    formData.append('hospitalCategoryid', object.hospitalCategoryid)
    formData.append('hosCValidDateFrom', object.hosCValidDateFrom)
    formData.append('hosCValidDateTo', object.hosCValidDateTo)
    formData.append('mou', object.mou)
    formData.append('mouStartDt', object.mouStartDt)
    formData.append('mouEndDt', object.mouEndDt)
    formData.append('mouStatus', object.mouStatus)
    formData.append('empanelmentstatus', object.empanelmentstatus)
    formData.append('isBlockActive', object.isBlockActive)
    formData.append('updatedby', object.updatedby)
    formData.append('preauthapprovalrequired', object.preauthapprovalrequired)
    formData.append('cpdApprovalRequired', object.cpdApprovalRequired)
    formData.append('file3', file2);
    formData.append('file4', file3);
    formData.append('certification', object.certification)
    formData.append('validateFrom1', object.validateFrom1)
    formData.append('validateFrom2', object.validateFrom2)
    formData.append('hospitalregistration', object.hospitalregistration)
    formData.append('validateFrom3', object.validateFrom3)
    formData.append('validateFrom4', object.validateFrom4)
    formData.append('previousuploadedfiredistingusher', previousuploadedfiredistingusher)
    formData.append('previousuploadedclinical', previousuploadedclinical)

    var fullUrl = updateEmpanelhospdata;
    return this.http.post(fullUrl, formData, options);
  }


  getListAfterUpdate() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let token = this.jwtService.getJwtToken();
    let fullUrl = getHosplistviewpage;
    return this.http.get(fullUrl, options);

  }

  gettmasactivehospitallist(state: any, dist: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers,
      params: {
        state: state,
        dist: dist
      }
    }
    let token = this.jwtService.getJwtToken();
    let fullUrl = gettmasactivehospitallist;
    return this.http.get(fullUrl, options);
  }

  savepecialistconfig(object: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    let fullUrl = savepecialistconfig;
    return this.http.post(fullUrl, object, options);
  }

  savecivilinfraconfig(object: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    let fullUrl = savecivilinfraconfig;
    return this.http.post(fullUrl, object, options);
  }

  getpackagelistbyhospitalid(hospitalId: any, userid: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers,
      params: {
        hospitalid: hospitalId,
        userid: userid
      }
    }
    let fullUrl = getpackagelistbyhospitalid;
    return this.http.get(fullUrl, options);
  }

  getcivilinfradetails(hospitalId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers,
      params: {
        hospitalid: hospitalId
      }
    }
    let fullUrl = getcivilinfradetails;
    return this.http.get(fullUrl, options);
  }
  getHospitaldetailsFromCode(hospitalId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers,
      params: {
        hospitalCode: hospitalId
      }
    }
    let fullUrl = getHospitalDetailsFromCode;
    return this.http.get(fullUrl, options);
  }
  getEmphospitallist(state: any, dist: any, hospitalId: any, userid: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers,
      params: {
        state: state,
        dist: dist,
        hospitalId: hospitalId,
        userid: userid
      }
    }
    let fullUrl = getEmpaneledhospitallist;
    return this.http.get(fullUrl, options);
  }
  getCivilInfraDetails(civilInfraId: any) {
    //let claimUrl=snoapprovalById;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let queryparams = new HttpParams().append('civilInfraId', civilInfraId);
    let options = {
      headers: headers,
      params: queryparams,
    };
    let fullUrl = getcivilInfraDetailsById;
    return this.http.get(fullUrl, options);
  }
  updatePackageSpecility(data) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    let fullUrl = updatePackageSpecility;
    return this.http.post(fullUrl, data, options);
  }

  getSerachdata(statecodeval: any, districtcodeval: any, userId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers,
      params: {
        "statecodeval": statecodeval,
        "districtcodeval": districtcodeval,
        "userId": userId,
      }
    }
    var fullUrl = getsearchdataofhospitallspecilityapproval;
    return this.http.get(fullUrl, options)
  }
  getHospitalspecialityaDetailsExistingcase(hospitalid: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers,
      params: {
        "hospitalid": hospitalid
      }
    }
    var fullUrl = getsearchdataofhospitallspecdetailslist;
    return this.http.get(fullUrl, options)
  }

  getHospitaspecialitydetaislforpendingcase(hospitalid: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers,
      params: {
        "hospitalidpending": hospitalid
      }
    }
    var fullUrl = getsearchdataofhospitallspecdetailstpendingcase;
    return this.http.get(fullUrl, options)
  }

  getQcApproval(object: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    let fullUrl = getQcapprovalofhospitalspeciality;
    return this.http.post(fullUrl, object, options);
  }

  specialityapprovelist(statecode: any, districtcode: any, hospitalCode: any, type: any, userid: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
      params: {
        "statecode": statecode,
        "districtcode": districtcode,
        "hospitalCode": hospitalCode,
        "type": type,
        "userid": userid
      }
    };
    let fullUrl = specialityapprovelist;
    return this.http.get(fullUrl, options);
  }

  submituidauthconfig(object: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    let fullUrl = submituidauthconfig;
    return this.http.post(fullUrl, object, options);
  }
  submitTemporyOverrideCode(object: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };

    let fullUrl = temporyoverridecode;
    return this.http.post(fullUrl, object, options);
  }

  viewTemporyOverrideCode(object: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };

    let fullUrl = temporyoverridecodeview;
    return this.http.post(fullUrl, object, options);
  }

  removeTemporyOverrideCode(object: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };

    let fullUrl = removetemporyoverridecode;
    return this.http.post(fullUrl, object, options);
  }
  getMappedAuthDetailsview(data: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    return this.http.post(getMappedAuthDetailsview, data, options);
  }

  getMappedAuthDetailslog(hospcode: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params: {
        hospcode: hospcode
      }
    };
    return this.http.get(getMappedAuthDetailslog, options);
  }

  saveHospitalDeactivation(formData: any) {
    let headers = new HttpHeaders({
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    return this.http.post(saveHospitalDeactivation, formData, options);
  }

  getHospitalDetailsfordeactive(hospitalId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params: {
        hospcode: hospitalId
      }
    };
    return this.http.get(getHospitalDetailsfordeactive, options);
  }

  getHospitalDeactivionview(stateCode: any, distCode: any, hospitalId: any, action: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params: {
        stateCode: stateCode,
        hospitalId: hospitalId,
        distCode: distCode,
        action: action
      }
    };
    return this.http.get(getHospitalDeactivionview, options);
  }

  getHospitalDeactivionlog(hospitalCode: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params: {
        hospitalId: hospitalCode
      }
    };
    return this.http.get(getHospitalDeactivionlog, options);
  }

  downlordeempaneldoc(docpath: any) {
    let jsonObj = {
      f: docpath,
    };
    let jsonString = JSON.stringify(jsonObj);
    let queryParam = btoa(jsonString);
    let url = downLoaddeempanelDoc + '?' + 'data=' + queryParam;
    return url;
  }

}
