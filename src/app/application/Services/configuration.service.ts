import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { gettaggedhospitalofcpd,applyforexclusion,getappliedlistadmin,getappliedlistSNA,getappliedinclusionlistadmin
  ,getappliedinclusionlistsna,approveofexclusion,approveofinclusion,gethospitalforinclusion,applyhospitalforinclusion
  ,getcpdtagginglog,getcpdtaggedhospital, cancelrequestforapply, cpdhospitaltaglist, getcpdmappedPackageList, saveCPDSpecialityMapping, downloadcpdspecdoc, getcpdtaggedPackageList, getspecilitywisecpdcount, getspecilitywisecpdlist} from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  constructor(private http: HttpClient, private jwtService: JwtService) { }

  gettaggedhospitalofcpd(userid: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params: {
        'userid': userid,
      }
    }
    var fullUrl =gettaggedhospitalofcpd;
    return this.http.get(fullUrl,options)
  }

  applyforexclusion(hospitalCode: any, bskyuserid: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params: {
        'hospitalcode': hospitalCode,
        'bskyuserid':bskyuserid
      }
    }
    var fullUrl =applyforexclusion;
    return this.http.get(fullUrl,options)
  }

  approveofexclusion(hospitalCode: any, bskyuserid: any, userid: any, ip: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params: {
        'hospitalcode': hospitalCode,
        'bskyuserid':bskyuserid,
        'userid':userid,
        'ipaddress':ip
      }
    }
    var fullUrl =approveofexclusion;
    return this.http.get(fullUrl,options)
  }

  approveofinclusion(hospitalCode: any, bskyuserid: any, userId: any, ip: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params: {
        'hospitalcode': hospitalCode,
        'bskyuserid':bskyuserid,
        'userid':userId,
        'ipaddress':ip
      }
    }
    var fullUrl =approveofinclusion;
    return this.http.get(fullUrl,options)
  }

  getappliedlistadmin() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl =getappliedlistadmin;
    return this.http.get(fullUrl,options)
  }

  getappliedlistsna(userId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params: {
        'userid': userId,
      }
    }
    var fullUrl =getappliedlistSNA;
    return this.http.get(fullUrl,options)
  }

  getappliedinclusionlistadmin() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl =getappliedinclusionlistadmin;
    return this.http.get(fullUrl,options)
  }
  getappliedinclusionlistsna(userId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params: {
        'userid': userId,
      }
    }
    var fullUrl =getappliedinclusionlistsna;
    return this.http.get(fullUrl,options)
  }

  gethospitalforinclusion(userId: any, state: any, dist: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params: {
        'userid': userId,
        'state': state,
        'dist': dist,
      }
    }
    var fullUrl =gethospitalforinclusion;
    return this.http.get(fullUrl,options)
  }

  applyhospitalforinclusion(userId: any, hospitalcode: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params: {
        'userid': userId,
        'hospitalcode': hospitalcode
      }
    }
    var fullUrl =applyhospitalforinclusion;
    return this.http.get(fullUrl,options)
  }

  getcpdtagginglog(bskyuserid: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params: {
        'userid': bskyuserid
      }
    }
    var fullUrl =getcpdtagginglog;
    return this.http.get(fullUrl,options)
  }

  getcpdtaggedhospital(userId: any, type: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params: {
        'userid': userId,
        'type':type
      }
    }
    var fullUrl =getcpdtaggedhospital;
    return this.http.get(fullUrl,options)
  }

  cancel(hospitalCode: any, userId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params: {
        'userid': userId,
        'hospitalcode':hospitalCode
      }
    }
    var fullUrl =cancelrequestforapply;
    return this.http.get(fullUrl,options)
  }

  cpdhospitaltaglist(cpdId: any, cpduserid: any,status: any,userid:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params: {
        'cpdId': cpdId,
        'cpduserid':cpduserid,
        'status':status,
        'userid':userid
      }
    }
    var fullUrl =cpdhospitaltaglist;
    return this.http.get(fullUrl,options);
  }

  getPackageList(cpdId: any, cpduserid: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params: {
        'cpdId': cpdId,
        'cpduserid':cpduserid
      }
    }
    var fullUrl =getcpdmappedPackageList;
    return this.http.get(fullUrl,options);
  }

  saveCPDSpecialityMapping(object: any) {
    let headers = new HttpHeaders({
      // 'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    console.log(object.speciality);
    const formData: FormData = new FormData();
    formData.append('cpdData', JSON.stringify(object))
    for (let speciality of object.speciality) {
      formData.append('files', speciality.document);
    }
    var fullUrl =saveCPDSpecialityMapping;
    return this.http.post(fullUrl,formData,options);
  }

  downloadcpdspecdoc(fileName: any, cpduserid: any) {
    let jsonObj = {
      f: fileName,
      c: cpduserid,
    };
    let jsonString = JSON.stringify(jsonObj);
    let queryParam = btoa(jsonString);
    let url = downloadcpdspecdoc + '?' + 'data=' + queryParam;
    return url;
  }

  getcpdtaggedPackageList(cpduserid: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params: {
        'cpduserid':cpduserid
      }
    }
    var fullUrl =getcpdtaggedPackageList;
    return this.http.get(fullUrl,options);
  }

  getspecilitywisecpdcount(speclty: string, userId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params: {
        'speclty':speclty,
        'userId':userId,
      }
    }
    var fullUrl =getspecilitywisecpdcount;
    return this.http.get(fullUrl,options);
  }

  getspecilitywisecpdlist(packageid: any, userId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params: {
        'packageid':packageid,
        'userId':userId,
      }
    }
    var fullUrl =getspecilitywisecpdlist;
    return this.http.get(fullUrl,options);
  }


}
