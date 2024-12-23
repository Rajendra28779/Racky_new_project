import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { JwtService } from 'src/app/services/jwt.service';
import {
  assemblyConstituencyLgdCode,
  assemblyConstituencyLgdCodeData,
  downloadFileBySNA,
  getExtensionOfStayAprvList,
  getextensionofstaydtls,
  getPreAuthCaseDeatails,
  getPreAuthorizationDeatails,
  getpreAuthorizationList,
  getspecialtyreuquestdetails,
  getspecialtyreuquestlist,
  getWardchanegeDetails,
  getwardchangeList,
  updatepreAuthorization,
  updatepreAuthorizationList,
  updatespecialtyrequest,
  updatetextensionofstay,
  updatetwardchangeaprv,
} from 'src/app/services/api-config';

@Injectable({
  providedIn: 'root',
})
export class PreauthService {
  constructor(
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private jwtService: JwtService
  ) {}

  getPreAuthorizationList(requestData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = getpreAuthorizationList;
    return this.http.post(fullUrl, requestData, options);
  }

  updatePreAuthorizationList(object: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    // alert(object)
    let fullUrl = updatepreAuthorizationList;
    return this.http.post(fullUrl, object, options);
  }

  downloadFileBySNA(pdfName: any, hCode: any, dateOfAdm: any) {
    let jsonObj = {
      f: pdfName,
      h: hCode,
      d: dateOfAdm,
    };
    let jsonString = JSON.stringify(jsonObj);
    let queryParam = btoa(jsonString);
    return downloadFileBySNA + '?' + 'data=' + queryParam;
  }
  getPreAutDetails(txnPackgId, urn) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params: {
        txnPackgId: txnPackgId,
        urn: urn,
      },
    };
    let fullUrl = getPreAuthorizationDeatails;
    return this.http.get(fullUrl, options);
  }
  getPreAuthCaseDetails(txnPackgId) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params: {
        txnPackgId: txnPackgId,
      },
    };
    let fullUrl = getPreAuthCaseDeatails;
    return this.http.get(fullUrl, options);
  }
  updatePreAuthorization(object: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    // alert(object)
    let fullUrl = updatepreAuthorization;
    return this.http.post(fullUrl, object, options);
  }
  getSpecialityRequestList(reqData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = getspecialtyreuquestlist;
    return this.http.post(fullUrl, reqData, options);
  }
  getSpecialityRequestDetails(requestId) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params: {
        requestId: requestId,
      },
    };
    let fullUrl = getspecialtyreuquestdetails;
    return this.http.get(fullUrl, options);
  }
  updateSpecialtyRequest(object: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    // alert(object)
    let fullUrl = updatespecialtyrequest;
    return this.http.post(fullUrl, object, options);
  }



  getgetAssemblyConstituencyReport() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = assemblyConstituencyLgdCode;
    return this.http.get(fullUrl, options);
  }

  getdatafromlgdcode(lgdcode:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params: {
        "lgdcode": lgdcode,
      },
    };
    let fullUrl = assemblyConstituencyLgdCodeData;
    return this.http.get(fullUrl, options);
  }
  getExtentionList(requestData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = getExtensionOfStayAprvList;
    return this.http.post(fullUrl,requestData,options);
  }
  getExtensionOfStayDetails(extensionId) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params: {
        extensionId: extensionId,
      },
    };
    let fullUrl = getextensionofstaydtls;
    return this.http.get(fullUrl, options);
  }
  updatetExtensionOfStay(object: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    // alert(object)
    let fullUrl = updatetextensionofstay;
    return this.http.post(fullUrl, object, options);
  }

  getwardchangeList(requestData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = getwardchangeList;
    return this.http.post(fullUrl,requestData,options);
  }

  getWardchanegeDetails(wardchangeId:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params: {
        wardchangeId: wardchangeId,
      },
    };
    let fullUrl = getWardchanegeDetails;
    return this.http.get(fullUrl, options);
  }
  updatetwardchangeaprv(object: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = updatetwardchangeaprv;
    return this.http.post(fullUrl, object, options);
  }
}
