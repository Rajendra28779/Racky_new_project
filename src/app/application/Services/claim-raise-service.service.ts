import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { __values } from 'tslib';
import { checkhospitalalclaimraise, claimRiseInsert, datasearchforpacname, downLoadActioncpd, getcasewisenonuploadinginitialdocument, getcasewiseretedlisttohospital, getClaimDetailsthroughid, getclaimlist, getCpdnoncompliacequerytohospital, getHospitalPackageSchemeWiseDataForPackageHeadercode, getHospitalPackageSchemeWiseDataForPackageName, gethospitalpatienttratmentdetailsthroughid, getnewclaimDetailslist, getpartialclaimlist, getparticuiddataclaimdetails, getselectedrecorddelition, getsetecledDocumentUploaded, getSnanoncompliacequerytohospital, Inclusionofsearchingforpackagedetails, savecasewisedata } from '../../services/api-config';
import { JwtService } from '../../services/jwt.service';
@Injectable({
  providedIn: 'root'
})
export class ClaimRaiseServiceService {
  private messageSource = new BehaviorSubject(__values);
  currentMessage = this.messageSource.asObservable();
  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute, private jwtService: JwtService) { }


  getClaimList(hospitalCode, fromDate, toDate, Package, packageCode, URN, caseno, schemeid, schemecategoryid) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
      .append('hospitalCode', hospitalCode)
      .append('fromDate', fromDate)
      .append('toDate', toDate)
      .append('Package', Package)
      .append('packageCode', packageCode)
      .append('URN', URN)
      .append('caseno', caseno)
      .append('schemeid', schemeid)
      .append('schemecategoryid', schemecategoryid)

    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getclaimlist;
    return this.http.get(fullUrl, options)
  }

  exchangeData(data: any) {
    this.messageSource.next(data)
  }

  getiduserDetails(check: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers
    }
    let fullUrl = getparticuiddataclaimdetails + "/" + check;
    return this.http.get(fullUrl, options)
  }
  getainserteddata(data: FormData): Observable<any> {
    let headers = new HttpHeaders({
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    let fullUrl = claimRiseInsert;
    return this.http.post(fullUrl, data, options);

  }
  downloadFile(data: FormData) {
    let headers = new HttpHeaders({
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };

    let fullUrl = downLoadActioncpd;
    return this.http.post(fullUrl, data, options);
  }
  getsearcdetails() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    }
    let fullUrl = Inclusionofsearchingforpackagedetails;
    return this.http.get(fullUrl, options);
  }



  getdatapackgaename(packageName) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    }
    let fullUrl = datasearchforpacname + "/" + packageName;
    return this.http.get(fullUrl, options);

  }

  InclusionofsearchingforschemePackageData(schemeId: any, schemeCategoryId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
      .append('schemeId', schemeId)
      .append('schemeCategoryId', schemeCategoryId)
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getHospitalPackageSchemeWiseDataForPackageName;
    return this.http.get(fullUrl, options)
  }

  getPackageProcedurecodeSchemeWise(schemeId: any, schemeCategoryId: any, acronym: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
      .append('schemeId', schemeId)
      .append('schemeCategoryId', schemeCategoryId)
      .append('acronym', acronym)
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getHospitalPackageSchemeWiseDataForPackageHeadercode;
    return this.http.get(fullUrl, options)
  }

  getPartialClaimList(userId, fromDate, toDate, schemeid, schemecategoryid) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
      .append('userId', userId)
      .append('fromDate', fromDate)
      .append('toDate', toDate)
      .append('schemeid', schemeid)
      .append('schemecategoryid', schemecategoryid)
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getpartialclaimlist;
    return this.http.get(fullUrl, options)

  }


  // ============================================================================for new Claim Raise===============================================================================

  getnewClaimList(hospitalCode: any, fromDate: any, toDate: any, urn: any, caseno: any, schemeid: any, schemecategoryid: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
      .append('hospitalCode', hospitalCode)
      .append('fromDate', fromDate)
      .append('toDate', toDate)
      .append('urn', urn)
      .append('caseno', caseno)
      .append('schemeid', schemeid)
      .append('schemecategoryid', schemecategoryid)

    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getnewclaimDetailslist;
    return this.http.get(fullUrl, options)
  }


  getClaimDetailsthroughid(transactionid: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let queryparams = new HttpParams().append('transactionid', transactionid);
    let options = {
      headers: headers,
      params: queryparams,
    };
    let fullUrl = getClaimDetailsthroughid;
    return this.http.get(fullUrl, options);
  }
  getdeletedRecord(selectedtransactiondetailsid: any, deleteReason: any, userid: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
      .append('selectedtransactiondetailsid', selectedtransactiondetailsid)
      .append('deleteReason', deleteReason)
      .append('userid', userid)
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getselectedrecorddelition;
    return this.http.get(fullUrl, options)
  }


  getselecteddocumentUpload(data: FormData): Observable<any> {
    let headers = new HttpHeaders({
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    let fullUrl = getsetecledDocumentUploaded;
    return this.http.post(fullUrl, data, options);

  }

  getcasewiseclaimSubmite(data: FormData): Observable<any> {
    let headers = new HttpHeaders({
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    let fullUrl = savecasewisedata;
    return this.http.post(fullUrl, data, options);
  }

  gethospitalpatienttreatmentdetails(transactionid: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let queryparams = new HttpParams().append('transactionid', transactionid);
    let options = {
      headers: headers,
      params: queryparams,
    };
    let fullUrl = gethospitalpatienttratmentdetailsthroughid;
    return this.http.get(fullUrl, options);
  }

  getNonUploadingInitialDocument(hospitalCode: any, fromDate: any, toDate: any, urn: any, caseno: any, schemeid: any, schemecategoryid: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
      .append('hospitalCode', hospitalCode)
      .append('fromDate', fromDate)
      .append('toDate', toDate)
      .append('urn', urn)
      .append('caseno', caseno)
      .append('schemeid', schemeid)
      .append('schemecategoryid', schemecategoryid)

    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getcasewisenonuploadinginitialdocument;
    return this.http.get(fullUrl, options)
  }



  getcpdrejectedList(hospitalCode: any, fromDate: any, toDate: any, urn: any, caseno: any, schemeid: any, schemecategoryid: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
      .append('hospitalCode', hospitalCode)
      .append('fromDate', fromDate)
      .append('toDate', toDate)
      .append('urn', urn)
      .append('caseno', caseno)
      .append('schemeid', schemeid)
      .append('schemecategoryid', schemecategoryid)

    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getcasewiseretedlisttohospital;
    return this.http.get(fullUrl, options)
  }



  getnoncompliancesnaquery(hospitalCode: any, fromDate: any, toDate: any, urn: any, caseno: any, schemeid: any, schemecategoryid: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
      .append('hospitalCode', hospitalCode)
      .append('fromDate', fromDate)
      .append('toDate', toDate)
      .append('urn', urn)
      .append('caseno', caseno)
      .append('schemeid', schemeid)
      .append('schemecategoryid', schemecategoryid)

    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getSnanoncompliacequerytohospital;
    return this.http.get(fullUrl, options)
  }


  getnoncompliancecpdquery(hospitalCode: any, fromDate: any, toDate: any, urn: any, caseno: any, schemeid: any, schemecategoryid: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
      .append('hospitalCode', hospitalCode)
      .append('fromDate', fromDate)
      .append('toDate', toDate)
      .append('urn', urn)
      .append('caseno', caseno)
      .append('schemeid', schemeid)
      .append('schemecategoryid', schemecategoryid)

    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getCpdnoncompliacequerytohospital;
    return this.http.get(fullUrl, options)
  }

  checkhospitaleligiblityforclaimraise(hospitalcode: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
      .append('hospitalcode', hospitalcode)

    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = checkhospitalalclaimraise;
    return this.http.get(fullUrl, options);
  }

  // ============================================================================END===============================================================================

}