import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, generate, Observable} from 'rxjs';
import {__values} from 'tslib';

//import { getCPDCliamDetails, getIndividualClaimDetails, saveCpdClaimActionRequest, getCPDReapprovalClaimList, getReapprovalClaimDetails, saveCpdReapprovalClaimRequest,createcpd,viewcpd, deletecpduser, getbyid, updatecpduser,getbankdetails, downLoadBankDocAction, getPreAuthDetails, getMultiPackDtls, checkDuplicatelicense } from 'src/app/services/api-config';
import {
  checkDuplicatelicense,
  createcpd,
  deletecpduser,
  downloadAllDocuments,
  downLoadBankDocAction,
  getbankdetails,
  getbyid,
  getbyuserid,
  getCPDClaimRevertDetails,
  getCPDCliamDetails,
  getCPDCliamRevert,
  getCPDReapprovalClaimList,
  getIndividualClaimDetails,
  getMultiPackDtls,
  getPackageDetails,
  getPreAuthDetails,
  getReapprovalClaimDetails,
  saveCpdClaimActionRequest,
  savecpdlog,
  saveCpdReapprovalClaimRequest,
  updatecpduser,
  viewcpd,
  checkCPDStatus,
  generatePDF,
  getCPDApprovalListCount,
  getCPDReApprovalClaimListCount,
  getCPDClaimRevertListCount,
  getPackageDetailsInfoList,
  documnetinsertstatus,
  cpdapprovalnew,
  getCPDDraftCliamDetails,
  getIndividualDraftClaimDetails,
  cpddraftaction,
  cpdRevertClaimAction,
} from 'src/app/services/api-config';

import {JwtService} from 'src/app/services/jwt.service';
import {fromJSDate} from "@ng-bootstrap/ng-bootstrap/datepicker/ngb-calendar";
import {trigger} from "@angular/animations";

@Injectable({
  providedIn: 'root',
})
export class CreatecpdserviceService {
  private messageSource = new BehaviorSubject(__values);
  currentMessage = this.messageSource.asObservable();

  constructor(private http: HttpClient, private jwtService: JwtService) {}

  getBankDetailsByIFSC(ifscCode: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };

    let fullUrl = getbankdetails + '/validateIFSC/' + ifscCode;
    return this.http.get<any>(fullUrl, options);
  }

  getCPDClaimList(userId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params: {
        userId: userId,
      },
    };
    let fullUrl = getCPDCliamDetails;
    return this.http.get(fullUrl, options);
  }
  getCPDClaimListOrderBy(userId : any, orderValue : any, fromDate : any, toDate : any, authMode : any, trigger: any,schemeid:any,schemecategoryid:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params: {
        userId: userId,
        orderValue: orderValue,
        fromDate : fromDate,
        toDate : toDate,
        authMode : authMode,
        trigger: trigger,
        schemeid: schemeid,
        schemecategoryid: schemecategoryid
      },
    };
    return this.http.get(getCPDCliamDetails, options);
  }
  getCPDDraftClaimListOrderBy(userId : any,schemeid:any,schemecategoryid:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params: {
        userId: userId,
        schemeid: schemeid,
        schemecategoryid: schemecategoryid

      },
    };
    return this.http.get(getCPDDraftCliamDetails, options);
  }

  getIndividualClaimDetails(
    transactionId: any,
    urn: any,
    claimId: any,
    authorizedCode: any,
    hospitalCode: any,
    actualDate: any,
    caseNo : any,
    userId : any,
    claimNo : any
  ): Observable<any> {

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params: {
        transaction_id: transactionId,
        urn: urn,
        claimId: claimId,
        authorizedCode: authorizedCode,
        hospitalCode: hospitalCode,
        actualDate: actualDate,
        caseNo : caseNo,
        userId : userId,
        claimNo : claimNo
      },
    };
    let fullUrl = getIndividualClaimDetails;
    return this.http.get(fullUrl, options);
  }
  getIndividualDraftClaimDetails(
    transactionId: any,
    urn: any,
    claimId: any,
    authorizedCode: any,
    hospitalCode: any,
    actualDate: any,
    caseNo : any,
    userId : any,
    claimNo : any
  ): Observable<any> {

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params: {
        transaction_id: transactionId,
        urn: urn,
        claimId: claimId,
        authorizedCode: authorizedCode,
        hospitalCode: hospitalCode,
        actualDate: actualDate,
        caseNo : caseNo,
        userId : userId,
        claimNo : claimNo
      },
    };
    let fullUrl = getIndividualDraftClaimDetails;
    return this.http.get(fullUrl, options);
  }

  cpdClaimActionRequest(data): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = saveCpdClaimActionRequest;
    return this.http.post(fullUrl, data, options);
  }

  saveData1(formData: any): Observable<any> {
    let headers = new HttpHeaders({
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    var fullUrl = createcpd;
    return this.http.post(fullUrl, formData, options);
  }

  downloadPDF(url): any {
    // const options = { responseType: 'blob' as 'json' };
    // return this.http.get(url, options).map(
    //   (res) => {
    //       return new Blob([res.blob()], { type: 'application/pdf' });
    //   });
  }
  exchangeData(data: any) {
    this.messageSource.next(data);
  }

  getcpdlist(fromDate,toDate,status:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let queryparams = new HttpParams()
      .append('fromDate', fromDate)
      .append('toDate', toDate)
      .append('status', status);
    let options = {
      headers: headers,
      params: queryparams
    };
    var fullUrl = viewcpd;
    return this.http.get(fullUrl, options);
  }

  delete(item: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    var fullUrl = deletecpduser + '?id=' + item;
    return this.http.get(fullUrl, options);
  }
  getbyid(items: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    var fullUrl = getbyid + '?id=' + items;
    return this.http.get(fullUrl, options);
  }
  getbyUserid(items: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    var fullUrl = getbyuserid + '?id=' + items;
    return this.http.get(fullUrl, options);
  }

  updatecpd(formData: any): Observable<any> {
    let headers = new HttpHeaders({
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    var fullUrl = updatecpduser;
    return this.http.post(fullUrl, formData, options);
  }

  savecpdlog(userId:any, createdBy:any): Observable<any> {
    let headers = new HttpHeaders({
      Authorization: this.jwtService.getJwtToken(),
    });
    let queryparams = new HttpParams()
      .append('userId', userId)
      .append('createdBy', createdBy);
    let options = {
      headers: headers,
      params: queryparams
    };
    var fullUrl = savecpdlog;
    return this.http.get(fullUrl, options);
  }

  checkCPDStatus(object: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    let fullUrl = checkCPDStatus;
    return this.http.post(fullUrl, object, options);
  }

  getCPDReapprovalClaimList(userId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params: {
        userId: userId,
      },
    };
    let fullUrl = getCPDReapprovalClaimList;
    return this.http.get(fullUrl, options);
  }

  getCPDReapprovalClaimListSearchFilter(userId: any, orderValue: any, fromDate: any, toDate: any, authMode : any, trigger: any,schemeid:any,schemecategoryid:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params: {
        userId: userId,
        orderValue: orderValue,
        fromDate: fromDate,
        toDate: toDate,
        authMode: authMode,
        trigger: trigger,
        schemeid: schemeid,
        schemecategoryid: schemecategoryid
      },
    };
    return this.http.get(getCPDReapprovalClaimList, options);
  }

  getReapprovalClaimDetails(
    transactionId: any,
    urn: any,
    claimId: any,
    authorizedCode: any,
    hospitalCode: any,
    actualDate: any,
    caseNo : any,
    userId : any,
    claimNo : any,
  ): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params: {
        transaction_id: transactionId,
        urn: urn,
        claimId: claimId,
        authorizedCode: authorizedCode,
        hospitalCode: hospitalCode,
        actualDate: actualDate,
        caseNo : caseNo,
        userId : userId,
        claimNo : claimNo
      },
    };
    let fullUrl = getReapprovalClaimDetails;
    return this.http.get(fullUrl, options);
  }

  cpdReapprovalClaimRequest(data): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = saveCpdReapprovalClaimRequest;
    return this.http.post(fullUrl, data, options);
  }
  cpdRevertClaimRequest(data): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = cpdRevertClaimAction;
    return this.http.post(fullUrl, data, options);
  }

  downloadFile(fileName) {
    let jsonObj = {
      f: fileName,
    };
    let jsonString = JSON.stringify(jsonObj);
    let queryParam = btoa(jsonString);
    let url = downLoadBankDocAction + '?' + 'data=' + queryParam;
    return url;
  }

  // getPreAuthHistory(urno,authorizedCode,hospitalCode,token){
  //   let headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Authorization': token
  //   });
  //   let options = {
  //     headers:headers
  //   }
  //   let fullUrl = getPreAuthDetails+"?urnno="+urno;

  //   return this.http.get(fullUrl, options)
  // }

  getPreAuthHistory(
    urno: any,
    authorizedCode: any,
    hospitalCode: any
  ): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params: {
        urn: urno,
        authorizedCode: authorizedCode,
        hospitalCode: hospitalCode,
      },
    };
    let fullUrl = getPreAuthDetails;
    return this.http.get(fullUrl, options);

    //return this.http.get<any>(`${environment.getIndividualClaimDetails}` + "?transaction_id=" + transactionId + "&urn=" + urn + "&claimId=" + claimId);
  }

  getMultiPackDtls(
    urno: any,
    authorizedCode: any,
    hospitalCode: any,
    transactionID: any
  ): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params: {
        urn: urno,
        authorizedCode: authorizedCode,
        hospitalCode: hospitalCode,
        transactionID: transactionID,
      },
    };
    let fullUrl = getMultiPackDtls;
    return this.http.get(fullUrl, options);

    //return this.http.get<any>(`${environment.getIndividualClaimDetails}` + "?transaction_id=" + transactionId + "&urn=" + urn + "&claimId=" + claimId);
  }

  checkDuplicateLicense(license: any, username: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl =
      checkDuplicatelicense + '?license=' + license + '&username=' + username;
    return this.http.get(fullUrl, options);
  }

  getCPDCliamRevertList(userId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params: {
        userId: userId,
      },
    };
    let fullUrl = getCPDCliamRevert;
    return this.http.get(fullUrl, options);
  }

  getCPDCliamRevertListSearchFilter(userId: any, orderValue: any, fromDate : any, toDate : any, authMode : any, trigger: any,schemeid:any,schemecategoryid:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params: {
        userId: userId,
        orderValue: orderValue,
        fromDate : fromDate,
        toDate: toDate,
        authMode: authMode,
        trigger: trigger,
        schemeid: schemeid,
        schemecategoryid: schemecategoryid
      },
    };
    return this.http.get(getCPDCliamRevert, options);
  }

  getCPDClaimRevertDetails(
    transactionId: any,
    urn: any,
    claimId: any,
    authorizedCode: any,
    hospitalCode: any,
    actualDate: any,
    caseNo : any,
    userId : any,
    claimNo : any,
  ): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params: {
        transaction_id: transactionId,
        urn: urn,
        claimId: claimId,
        authorizedCode: authorizedCode,
        hospitalCode: hospitalCode,
        actualDate: actualDate,
        caseNo : caseNo,
        userId : userId,
        claimNo : claimNo
      },
    };
    let fullUrl = getCPDClaimRevertDetails;
    return this.http.get(fullUrl, options);
  }

  getPackeDetails(
    packageId: any,
    procedureCode: any
  ): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params: {
        packageId: packageId,
        procedureCode: procedureCode,

      },
    };
    let fullUrl = getPackageDetails;
    return this.http.get(fullUrl, options);

    //return this.http.get<any>(`${environment.getIndividualClaimDetails}` + "?transaction_id=" + transactionId + "&urn=" + urn + "&claimId=" + claimId);
  }

  downloadAllDocuments(fileArray){
    let jsonString = JSON.stringify(fileArray);
    let queryParam = btoa(jsonString);
    let fullUrl = downloadAllDocuments + '?' + 'documentData=' + queryParam;
    return this.http.get(fullUrl,  { responseType: 'blob' });
  }

  generatePDF(report, heading){
    let jsonObj = {
      report: report,
      heading: heading
    };
    let jsonString = JSON.stringify(jsonObj);
    let queryParam = btoa(jsonString);
    return this.http.get(generatePDF + '?' + 'data=' + queryParam,  { responseType: 'blob' });
  }

  getCPDApprovalListCount(userId: any, orderValue: any, fromDate : any, toDate : any, authMode : any, trigger: any,schemeid:any,schemecategoryid:any) : Observable<any> {
    let options;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    if (fromDate == null && toDate == null) {
      options = {
        headers: headers,
        params: {
          userId: userId,
          orderValue: orderValue,
        }
      };
    } else {
      options = {
        headers: headers,
        params: {
          userId: userId,
          orderValue: orderValue,
          fromDate : fromDate,
          toDate: toDate,
          authMode : authMode,
          trigger: trigger,
          schemeid: schemeid,
          schemecategoryid: schemecategoryid
        }
      };
    }
    return this.http.get(getCPDApprovalListCount, options);
  }

  getCPDReApprovalClaimListCount(userId: any, orderValue: any, fromDate : any, toDate : any, authMode : any, trigger: any,schemeid:any,schemecategoryid:any) : Observable<any> {
    let options;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    if (fromDate == null && toDate == null) {
      options = {
        headers: headers,
        params: {
          userId: userId,
          orderValue: orderValue,
        }
      };
    } else {
      options = {
        headers: headers,
        params: {
          userId: userId,
          orderValue: orderValue,
          fromDate : fromDate,
          toDate: toDate,
          authMode : authMode,
          trigger: trigger,
          schemeid: schemeid,
          schemecategoryid: schemecategoryid
        }
      };
    }
    return this.http.get(getCPDReApprovalClaimListCount, options);
  }

  getCPDClaimRevertListCount(userId: any, orderValue: any, fromDate : any, toDate : any, authMode : any, trigger: any,schemeid:any,schemecategoryid:any) : Observable<any> {
    let options;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    if (fromDate == null && toDate == null) {
      options = {
        headers: headers,
        params: {
          userId: userId,
          orderValue: orderValue,
        }
      };
    } else {
      options = {
        headers: headers,
        params: {
          userId: userId,
          orderValue: orderValue,
          fromDate : fromDate,
          toDate: toDate,
          authMode : authMode,
           trigger: trigger,
           schemeid: schemeid,
           schemecategoryid: schemecategoryid
        }
      };
    }
    return this.http.get(getCPDClaimRevertListCount, options);
  }

  getPackageDetailsInfoList(txnPackageDetailsId : any) {
    let options;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    options = {
      headers: headers,
      params: {
        txnPackageDetailsId: txnPackageDetailsId
      }
    }
    return this.http.get(getPackageDetailsInfoList, options);
  }
  insertdocumnetstatus(requestData){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    console.log(requestData);
    let options = {
      headers: headers,
    }
    let fullUrl = documnetinsertstatus;
    return this.http.post(fullUrl,requestData,options)
  }
  //new api for cpd claim approval (developer hrusi)
  cpdClaimActionRequestnew(data): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = cpdapprovalnew;
    return this.http.post(fullUrl, data, options);
  }
  cpdClaimDraftAction(data): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = cpddraftaction;
    return this.http.post(fullUrl, data, options);
  }
  }

