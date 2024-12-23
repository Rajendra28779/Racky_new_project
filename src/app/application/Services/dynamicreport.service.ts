import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  findAllActiveTrigger,
  getdynamicbyid,
  getdynamicconfigurationlist,
  getdynamicreport,
  getdynamicreportdetails,
  getdynamicreportforexceldoenload,
  getdynamicreportsubdetails,
  getmeabstractreport,
  getmeactiontakendetails,
  getMeGrievancedetails,
  getmeremark,
  getmeTreatmentHistoryoverpackgae,
  getspecificcaseremarklist,
  getunBundlingPackagebyid,
  getunBundlingPackagelist,
  SubmitdunamicConfiguration,
  submitunBundlingPackage,
  sumbitmeremark,
  updatedunamicConfiguration,
  updateunBundlingPackage,
} from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root',
})
export class DynamicreportService {

  constructor(private http: HttpClient, private jwtService: JwtService) {}

  SubmitdunamicConfiguration(object: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = SubmitdunamicConfiguration;
    return this.http.post(fullUrl, object, options);
  }

  getdynamicconfigurationlist() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = getdynamicconfigurationlist;
    return this.http.get(fullUrl, options);
  }

  getdynamicbyid(id: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params: {
        slno: id,
      },
    };
    let fullUrl = getdynamicbyid;
    return this.http.get(fullUrl, options);
  }

  updatedunamicConfiguration(getbyid: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = updatedunamicConfiguration;
    return this.http.post(fullUrl, getbyid, options);
  }

  getdynamicreport(formdate: any, toDate: any,trigger:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params: {
        formdate: formdate,
        toDate: toDate,
        trigger:trigger
      },
    };
    let fullUrl = getdynamicreport;
    return this.http.get(fullUrl, options);
  }

  getdynamicreportdetails(flag: any, report: any, fromdate: any, todate: any,val:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params: {
        formdate: fromdate,
        toDate: todate,
        flag: flag,
        report: report,
        val: val,
      },
    };
    let fullUrl = getdynamicreportdetails;
    return this.http.get(fullUrl, options);
  }

  getdynamicreportsubdetails(flag: any, report: any, fromdate: any, todate: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params: {
        formdate: fromdate,
        toDate: todate,
        flag: flag,
        report: report
      },
    };
    let fullUrl = getdynamicreportsubdetails;
    return this.http.get(fullUrl, options);
  }

  getmeTreatmentHistoryoverpackgae(
    txnId: any,
    urnnumber: any,
    hospitalcode: any,
    caseno: any,
    uidreferencenumber: any,
    userid: any
  ) {
    //let claimUrl=snoapprovalById;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });

    let queryparams = new HttpParams()
      .append('txnId', txnId)
      .append('urnnumber', urnnumber)
      .append('hospitalcode', hospitalcode)
      .append('caseno', caseno)
      .append('uidreferencenumber', uidreferencenumber)
      .append('userid', userid);
    let options = {
      headers: headers,
      params: queryparams,
    };
    let fullUrl = getmeTreatmentHistoryoverpackgae;
    return this.http.get(fullUrl, options);
  }

  sumbitmeremark(
    txnId: any,
    remark: any,
    userid: any,
    urnno: any,
    claimid: any,
    flag:any,
    year:any,
    month:any
  ) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params: {
        txnId: txnId,
        remark: remark,
        userid: userid,
        urnno: urnno,
        claimid: claimid,
        flag: flag,
        year: year,
        month: month,
      },
    };
    let fullUrl = sumbitmeremark;
    return this.http.get(fullUrl, options);
  }

  getmeactiontakendetails(fromdate: any, todate: any, userId: any,trigger:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params: {
        userid: userId,
        fromdate: fromdate,
        todate: todate,
        trigger: trigger,
      },
    };
    let fullUrl = getmeactiontakendetails;
    return this.http.get(fullUrl, options);
  }

  getremark(txnId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params: {
        txnId: txnId,
      },
    };
    let fullUrl = getmeremark;
    return this.http.get(fullUrl, options);
  }

  getspecificcaseremark(searchby: any, fieldvalue: any, userId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params: {
        searchby: searchby,
        fieldvalue: fieldvalue,
        userId: userId,
      },
    };
    let fullUrl = getspecificcaseremarklist;
    return this.http.get(fullUrl, options);
  }

  ///UnBoundling Controller
  SubmitunboundlingConfiguration(object: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = submitunBundlingPackage;
    return this.http.post(fullUrl, object, options);
  }
  getunboundlingconfigurationlist() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = getunBundlingPackagelist;
    return this.http.get(fullUrl, options);
  }
  getunboundingbyid(id: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params: {
        slno: id,
      },
    };
    let fullUrl = getunBundlingPackagebyid;
    return this.http.get(fullUrl, options);
  }

  updateunboundingConfiguration(getbyid: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = updateunBundlingPackage;
    return this.http.post(fullUrl, getbyid, options);
  }
  findAllActiveTrigger() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = findAllActiveTrigger;
    return this.http.get(fullUrl, options);
  }

  getmeabstractreport(fromdate: any, todate: any, trigger: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params: {
        fromdate: fromdate,
        todate: todate,
        trigger: trigger,
      },
    };
    let fullUrl = getmeabstractreport;
    return this.http.get(fullUrl, options);
  }
  getMeGrievancedetails(fromdate: any, todate: any, snaUserId: any,trigger:any,stateCode:any,districtCode:any,hospitalCode:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params: {
        snaUserId: snaUserId,
        fromdate: fromdate,
        todate: todate,
        trigger: trigger,
        stateCode: stateCode,
        districtCode: districtCode,
        hospitalCode:hospitalCode
      },
    };
    let fullUrl = getMeGrievancedetails;
    return this.http.get(fullUrl, options);
  }

  getdynamicreportforexceldoenload(flag: any, fromdate: any, todate: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params: {
        fromdate: fromdate,
        todate: todate,
        trigger: flag,
      },
    };
    let fullUrl = getdynamicreportforexceldoenload;
    return this.http.get(fullUrl, options);
  }

}
