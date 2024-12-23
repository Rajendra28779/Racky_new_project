import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtService } from 'src/app/services/jwt.service';
import {
  getCPDTriggerdetails,
  getFamilytreatmentlist,
  getmultipledocumentList,
  getOldTreatmentHistoryCPD,
  getOldTreatMentHistorySna,
  getOnGoingTreatmenthistory,
  getPatienttreatmentlistbyProcedure,
  getTreatMentHistorySna,
  getwardandextenstionlist,
  multipackthroughcaseno,
  patienttreatmnetlog,
  searchbyurn,
  treatment,
  getswathyamitrapatientrviedetls
} from 'src/app/services/api-config';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TreatmenthistoryperurnService {


  constructor(private http: HttpClient, private jwtService: JwtService) { }

  searchbyUrn(items: any) {

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    }
    let token = this.jwtService.getJwtToken();
    let fullUrl = searchbyurn + "?urnno=" + items.urnno;

    return this.http.get(fullUrl, options)
  }

  searchbyUrn1(items: any) {

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    }
    let token = this.jwtService.getJwtToken();
    let fullUrl = searchbyurn + "?urnno=" + items;

    return this.http.get(fullUrl, options)
  }

  searchbyUrn2(items: any, token: any): Observable<any> {

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
      params: {
        'urnno': items

      }
    };
    let fullUrl = searchbyurn;
    return this.http.get(fullUrl, options);
    // let headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'Authorization': this.jwtService.getJwtToken()
    // });
    // let options = {
    //   headers:headers,
    //   params: {
    //     'urnno': items

    //   }
    // };


    // let fullUrl = searchbyurn;

    // return this.http.get(fullUrl, options)
  }

  searchbyUrnSna(items: any, token: any, userId: any): Observable<any> {

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
      params: {
        'urnno': items,
        'userId': userId
      }
    };
    let fullUrl = getTreatMentHistorySna;
    return this.http.get(fullUrl, options);
  }
  searchbyUrnSnaUser(items: any, userId: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
      params: {
        'urnno': items,
        'userId': userId
      }
    };
    let fullUrl = getTreatMentHistorySna;
    return this.http.get(fullUrl, options);
  }
  OldsearchbyUrnSna(items: any, token: any, userId: any): Observable<any> {

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
      params: {
        'urnno': items,
        'userId': userId
      }
    };
    let fullUrl = getOldTreatMentHistorySna;
    return this.http.get(fullUrl, options);
  }
  oldsearchbyUrnSnaUser(items: any, userId: any): Observable<any> {

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
      params: {
        'urnno': items,
        'userId': userId
      }
    };
    let fullUrl = getOldTreatMentHistorySna;
    return this.http.get(fullUrl, options);
  }


  getOldTreatmentHistoryURNCPD(urn: any, token: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
      params: {
        'urn': urn
      }
    };
    return this.http.get(getOldTreatmentHistoryCPD, options);
  }
  getOnGoingTreatmenthistory(items: any, userId: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
      params: {
        'urnno': items,
        'userId': userId
      }
    };
    let fullUrl = getOnGoingTreatmenthistory;
    return this.http.get(fullUrl, options);
  }

  patienttreatmnetlog(urno: any, userId: any, txnid: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
      params: {
        'urnno': urno,
        'userId': userId,
        'txnid': txnid
      }
    };
    let fullUrl = patienttreatmnetlog;
    return this.http.get(fullUrl, options);
  }

  multipackthroughcaseno(claimCaseNo: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
      params: {
        'caseno': claimCaseNo
      }
    };
    let fullUrl = multipackthroughcaseno;
    return this.http.get(fullUrl, options);
  }
  getFamilytreatement(dateofadmission: any, memeberid: any, urn: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
      params: {
        'dateofadmission': dateofadmission,
        'memeberid': memeberid,
        'urn': urn

      }
    };
    let fullUrl = getFamilytreatmentlist;
    return this.http.get(fullUrl, options);
  }

  getPatientTreatmentLogThroughProcedureCode(procedureCode: any, uidreferencenumber: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
      params: {
        'procedureCode': procedureCode,
        'uidreferencenumber': uidreferencenumber
      }
    };
    let fullUrl = getPatienttreatmentlistbyProcedure;
    return this.http.get(fullUrl, options);
  }
  getCPDTriggerdetails(hospitalcode: any, dateofAdmission: any, dateofdischarge: any, procedurecode: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
      params: {
        'hospitalcode': hospitalcode,
        'dateofAdmission': dateofAdmission,
        'dateofdischarge': dateofdischarge,
        'procedurecode': procedurecode,
      }
    };
    let fullUrl = getCPDTriggerdetails;
    return this.http.get(fullUrl, options);
  }


  getmultipledocumentList(caseno: any, loginid: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
      params: {
        'caseno': caseno,
        'loginid': loginid
      }
    };
    let fullUrl = getmultipledocumentList;
    return this.http.get(fullUrl, options);
  }

  getwardnextentiondetailsList(claimCaseNo: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
      params: {
        'claimCaseNo': claimCaseNo,
      }
    };
    let fullUrl = getwardandextenstionlist;
    return this.http.get(fullUrl, options);
  }


  getswasthyamitrapatientreviewdtls(transactionid: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
      params: {
        'transactionid': transactionid,
      }
    };
    let fullUrl = getswathyamitrapatientrviedetls;
    return this.http.get(fullUrl, options);
  }
}
