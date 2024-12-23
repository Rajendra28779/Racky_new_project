import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getAllSwasthyaMitraDetails,saveswasthyamitra,inactiveSwasthyaMitra,updateswasthyamitra,getsmtaggedhospital,getsmmappinglist, getSwasthyaListDetails,getsmattendancereport, saveSwasthyaMapping, updateSwasthyaMitraHospital, getswasthyaMappingData, getswasthyaConfigDetails, getswasthyaMitraDetails, getswasthyaMitraFilter, getsmlistbyhospital, getsmlistforregistaration, getsmdetailsforregister, allowsmforregister, getapprovesmlistforregistaration, getsmhelpdeskregister, downloadsmreviewdoc, getsmpendingreport, getsmlistforscoring, getsmscoreview, getsmscoringreport, getsmdetailsforscoring, submitsmscore, getsmfinalincenivereport } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class SwastyaMitraHospitalService {
  constructor(private http: HttpClient,private jwtService: JwtService) { }
  getSwasthyaList() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    //let fullUrl = snoDetails;
    //var url = "master/getCPDDetails";
    let fullUrl = getSwasthyaListDetails;
    return this.http.get(fullUrl, options);
  }

  getswasthyaConfigList(userId) {
    console.log(userId);

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams().append('userId', userId);
    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = getswasthyaMappingData;
    return this.http.get(fullUrl, options);
  }

  saveSwasthyaMitraHospital(Object) {

    console.log("Data in service========"+ JSON.stringify(Object));
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    console.log("Years : " + Object.hospitalCode)
    let options = {
      headers:headers
    }
    let token = this.jwtService.getJwtToken();
    var fullUrl = saveSwasthyaMapping;
    //console.log(this.httpclient.get(fullUrl,options));
    return this.http.post(fullUrl,Object,options);
  }
  getSwasthyaMitra () {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let token = this.jwtService.getJwtToken();
    let fullUrl = getAllSwasthyaMitraDetails;
    return this.http.get(fullUrl, options);

  }


  updateSwasthyaMitra(object) {
    console.log("Data in service========"+ JSON.stringify(object));
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    console.log("Years : " + object.hospitalCode);
    console.log("User id:"+object.useId);
    console.log("Status flag: " +object.stateFlg);
    console.log("dist code:" +object.distCode);
    console.log("state code: "+object.statCode);





    let options = {
      headers:headers
    }
    let token = this.jwtService.getJwtToken();
    var fullUrl = updateSwasthyaMitraHospital;
    //console.log(this.httpclient.get(fullUrl,options));
    return this.http.post(fullUrl,object,options);
  }

  ///////////////////////////////////////////////Rajendra///////////////////////////////

  getsmattendancereport(selectedYear: any, Months: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
      params: {
        'year': selectedYear,
        'month': Months
      }
    };
    var fullUrl = getsmattendancereport;
    return this.http.get(fullUrl,options);
  }

  saveSwasthya(userIId: any, hospList: any, created:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };

    let data={
      'cpdId': userIId,
      'hospitalCode': hospList,
      'createdBy':created
    }
    var fullUrl = saveswasthyamitra;
    return this.http.post(fullUrl,data,options);
  }

  update(userIId: any, hospList: any, created:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };

    let data={
      'cpdId': userIId,
      'hospitalCode': hospList,
      'createdBy':created,
      'status':0
    }
    var fullUrl = updateswasthyamitra;
    return this.http.post(fullUrl,data,options);
  }

  getSwasthyamappingList() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    var fullUrl = getsmmappinglist;
    return this.http.get(fullUrl,options);
  }

  getsmtaggedhospital(userid:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
      params: {
        'userid': userid
      }
    };
    var fullUrl = getsmtaggedhospital;
    return this.http.get(fullUrl,options);
  }

  inactiveSwasthyaMitra(bskyid: any, userid: any , statusflag:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
      params: {
        'userid': userid,
        'bskyid' :bskyid,
        'statusflag':statusflag
      }
    };
    var fullUrl = inactiveSwasthyaMitra;
    return this.http.get(fullUrl,options);
  }

  ///////////////////////////////////////////////Rajendra///////////////////////////////

  getswasthyaConfigDetails(userId: any, stateId: any, districtId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
      params: {
        "userId":userId,
        "stateId":stateId,
        "districtId":districtId
      }
    };
    var fullUrl = getswasthyaConfigDetails;
    return this.http.get(fullUrl,options);
  }

  getSwasthyaMitraDeta(groupId: any, stateId: any, districtId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
    // .append('userId',userId)
    .append('groupId', groupId)
    .append('stateId', stateId)
    .append('districtId', districtId);

    let options = {
      headers: headers,
      params: queryparams
    }
    var fullUrl = getswasthyaMitraDetails;
    return this.http.get(fullUrl,options);

  }

  getSwasthyaFilter( stateId: any, districtId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
    // .append('userId',userId)
    // .append('groupId', groupId)
    .append('stateId', stateId)
    .append('districtId', districtId);

    let options = {
      headers: headers,
      params: queryparams
    }
    var fullUrl = getswasthyaMitraFilter;
    return this.http.get(fullUrl,options);
  }


  getsmlistbyhospital(hospital: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
      params: {
        "hosp":hospital,
      }
    };
    var fullUrl =getsmlistbyhospital;
    return this.http.get(fullUrl,options);
  }

  getsmlistforregistaration(state: any, dist: any, hospital: any, smid: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
      params: {
        "state":state,
        "dist":dist,
        "hosp":hospital,
        "smid":smid
      }
    };
    var fullUrl =getsmlistforregistaration;
    return this.http.get(fullUrl,options);
  }

  getsmdetailsforregister(item: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
      params: {
        "smid":item,
      }
    };
    var fullUrl =getsmdetailsforregister;
    return this.http.get(fullUrl,options);
  }

  getapprovesmlistforregistaration(statecode: any, distcode: any, hospcode: any, smid: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
      params: {
        "state":statecode,
        "dist":distcode,
        "hosp":hospcode,
        "smid":smid
      }
    };
    var fullUrl =getapprovesmlistforregistaration;
    return this.http.get(fullUrl,options);
  }

  allowforregister(item: any,userid:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
      params: {
        "smid":item,
        "updateby":userid,
      }
    };
    var fullUrl =allowsmforregister;
    return this.http.get(fullUrl,options);
  }

  getsmhelpdeskregister(formdate: any, todate: any, state: any, dist: any,
                        hospitalCode: any, smaid: any, status: any,userId:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
      params: {
        "formdate":formdate,
        "todate":todate,
        "state":state,
        "dist":dist,
        "hospitalCode":hospitalCode,
        "smaid":smaid,
        "status":status,
        "userId":userId
      }
    };
    var fullUrl =getsmhelpdeskregister;
    return this.http.get(fullUrl,options);
  }

  downloadsmreviewdoc(docpath: any, hospitalcode: any) {
    let jsonObj = {
      f: docpath,
      h:hospitalcode
    };
    let jsonString = JSON.stringify(jsonObj);
    let queryParam = btoa(jsonString);
    let url = downloadsmreviewdoc + '?' + 'data=' + queryParam;
    return url;
  }

  getsmpendingreport(formdate: any, todate: any, state: any, dist: any,
     hospitalCode: any, userId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
      params: {
        "formdate":formdate,
        "todate":todate,
        "state":state,
        "dist":dist,
        "hospitalCode":hospitalCode,
        "userId":userId,
      }
    };
    var fullUrl =getsmpendingreport;
    return this.http.get(fullUrl,options);
  }

  getsmlistforscoring
    (selectedYear: any, month: any, state: any, dist: any, hospitalCode: any, smaid: any, userId: any) {
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': this.jwtService.getJwtToken()
        });
        let options = {
          headers: headers,
          params: {
            "year":selectedYear,
            "month":month,
            "state":state,
            "dist":dist,
            "hospitalCode":hospitalCode,
            "userId":userId,
            "smaid":smaid,
          }
        };
        var fullUrl =getsmlistforscoring;
        return this.http.get(fullUrl,options);
  }

  getsmscoreview(selectedYear: any, month: any,userId:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
      params: {
        "year":selectedYear,
        "month":month,
        "userId":userId,
      }
    };
    var fullUrl =getsmscoreview;
    return this.http.get(fullUrl,options);
  }

  getsmscoringreport(selectedYear: any, month: any, userId: any,state:any,
      dist:any,hospital:any,smid:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
      params: {
        "year":selectedYear,
        "month":month,
        "userId":userId,
        "state":state,
        "dist":dist,
        "hospital":hospital,
        "smid":smid,
      }
    };
    var fullUrl =getsmscoringreport;
    return this.http.get(fullUrl,options);
  }
  getsmdetailsforscoring(item: any,year:any,month:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
      params: {
        "smid":item,
        "year":year,
        "month":month,
      }
    };
    var fullUrl =getsmdetailsforscoring;
    return this.http.get(fullUrl,options);
  }

  submitsmscore(selectedYear: any, month: any, smid: any, remark: any, score: any, userId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
      params: {
        "year":selectedYear,
        "month":month,
        "smid":smid,
        "remark":remark,
        "score":score,
        "userId":userId
      }
    };
    var fullUrl =submitsmscore;
    return this.http.get(fullUrl,options);
  }

  getsmfinalincenive (selectedYear: any, month: any, userId: any, state: any,
    dist: any, hospital: any, smid: any) {
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.jwtService.getJwtToken()
      });
      let options = {
        headers: headers,
        params: {
          "year":selectedYear,
          "month":month,
          "userId":userId,
          "state":state,
          "dist":dist,
          "hospital":hospital,
          "smid":smid,
        }
      };
      var fullUrl =getsmfinalincenivereport;
      return this.http.get(fullUrl,options);
  }

}
