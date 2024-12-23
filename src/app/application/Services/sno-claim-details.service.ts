import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import {
  autoappprovedbulkapproved,
  bulksearccountdetails,
  countreport,
  dischargeTreatment,
  distListSno,
  downLoadAction,
  downLoadAll,
  downloadAllDocuments,
  downLoadDocAction,
  getDcAprvListById,
  getdcClaimApprovedlist,
  getDcDetailsById,
  getPreAuth,
  getRemarks,
  getRemarksById,
  hospitalList,
  snoaction,
  snoactionofDCApproved,
  snoapprovalById,
  snoapprovallist,
  snoPackageBlock,
  snoreapprovallist,
  statelistSno,
  banklist,
  bankmode,
  snopostpaymentlist,
  updatepostpayment,
  getDistrictbystate,
  getHospitalByDistrictId,
  paymentfreezefromexcel,
  getOldProcessedClaimlist,
  getOldProcessedClaimById,
  SaveOldProcessedClaim,
  getOldClaimQueryBySNAlist,
  getOldClaimResettlementlist,
  getOldClaimResettlementById,
  snoactionofOldReClaim,
  getClaimsOnHoldList,
  getPackageDetailsByProcedure,
  downLoadOldDocAction,
  getOldPostPaymentList,
  updateoldpostpayment,
  getPaymentList,
  getPaidClaimList,
  reversepayment,
  getOldClaimActionlist,
  getOldClaimTrackingById,
  getSNAProcessedOldClaimlist,
  getReClaimedAndPendingAtSNAlist,
  getPackageDetailByCode,
  getAuthenticationDetails,
  getOverridecodeDetails,
  getpostpaymenView,
  getTreatmentHistoryoverpackgae,
  getremarkdetails,
  getcountremarkdetails,
  getdetailsonfloatclaimdetails,
  floatLogHistory,
  getActiondetails,
  getactionremarkdetails,
  getcountremarkforsnactiondetails,
  docenrollment,
  getEnrollmentAllRemarks,
  getHistoryofclaimno,
  getTriggerDetails,
  getbulkapprovalrevertlist,
  getbulkapprovalrevertSubmit,
  getDistrictByMultiState,
  getHospitalByMultiDistrict,
  claimprocesseddetails,
  saveclaimprocesseddetails,
  urnwisedetails,
  saveurnwisedetails,
  systemadminrejecteddetails,
  saveSyatemAdminSnaRejectedDetails,
  snoreaction,
  cpdapprovalcount,
  getsnafloatclaimdetails,
  postpaymentupdationnew,
  getsnamortalitystatus,
  getMstschemesubcategory,
  partialclaimsnodetails,
  forwardpartialclaim,
  getdccompliancepartialclaimlist,
  getpartialclaimdcdetails,
  snoactionofpartialclaimDC,
  getreapprovalpartialclaimlist,
  getsnaviewpartialclaimlist,
  savePartialClaimresetelment,
  getcostdata,
  gethedandimplantlist,
} from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root',
})
export class SnoCLaimDetailsService {


  constructor(
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private jwtService: JwtService
  ) {}

  downloadFile(fileName, hCode, dateOfAdm) {
    let jsonObj = {
      f: fileName,
      h: hCode,
      d: dateOfAdm,
    };
    let jsonString = JSON.stringify(jsonObj);
    let queryParam = btoa(jsonString);
    let fullUrl = downLoadDocAction + '?' + 'data=' + queryParam;
    return fullUrl;
  }
  downloadFiles(fileName, hCode, dateOfAdm,) {
    let jsonObj = {
      f: fileName,
      h: hCode,
      d: dateOfAdm,
    };
    let jsonString = JSON.stringify(jsonObj);
    let queryParam = btoa(jsonString);
    let fullUrl = downLoadDocAction + '?' + 'data=' + queryParam;
    return this.http.get(fullUrl, { responseType: 'blob' });
  }
  downloadAllFiles(fileArray) {
    let jsonString = JSON.stringify(fileArray);
    let queryParam = btoa(jsonString);
    let fullUrl = downLoadAll + '?' + 'data=' + queryParam;
    return this.http.get(fullUrl, { responseType: 'blob' });
  }
  getSnoClaimList(requestData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    console.log(requestData);

    // let queryparams = new HttpParams()
    //   .append('userId', userId)
    //   .append('flag', flag)
    //   .append('fromDate', fromDate)
    //   .append('toDate', toDate)
    //   .append('stateCode', stateCode1)
    //   .append('distCode', distCode1)
    //   .append('hospitalCode', hospitalCode)
    //   .append('cpdFlag', cpdFlag);
    let options = {
      headers: headers,
      // params: queryparams
    };
    let fullUrl = snoapprovallist;
    return this.http.post(fullUrl, requestData, options);
  }
  getSnoCount(requestData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    console.log(requestData);
    let options = {
      headers: headers,
    };
    let fullUrl = cpdapprovalcount;
    return this.http.post(fullUrl, requestData, options);
  }

  getPostPaymentList(requestData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = snopostpaymentlist;
    return this.http.post(fullUrl, requestData, options);
  }

  getOldPostPaymentList(requestData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = getOldPostPaymentList;
    return this.http.post(fullUrl, requestData, options);
  }

  getPaymentList(requestData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = getPaymentList;
    return this.http.post(fullUrl, requestData, options);
  }

  getPaidClaimList(requestData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = getPaidClaimList;
    return this.http.post(fullUrl, requestData, options);
  }

  updatePayment(data) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = updatepostpayment;
    return this.http.post(fullUrl, data, options);
  }

  updatePaymentnew(data) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = postpaymentupdationnew;
    return this.http.post(fullUrl, data, options);
  }

  updateOldPayment(data) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = updateoldpostpayment;
    return this.http.post(fullUrl, data, options);
  }

  reversePayment(data) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = reversepayment;
    return this.http.post(fullUrl, data, options);
  }

  getBulkapproved(requestData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    console.log(requestData);

    // let queryparams = new HttpParams()
    //   .append('userId', userId)
    //   .append('flag', flag)
    //   .append('fromDate', fromDate)
    //   .append('toDate', toDate)
    //   .append('stateCode', stateCode1)
    //   .append('distCode', distCode1)
    //   .append('hospitalCode', hospitalCode)
    //   .append('cpdFlag', cpdFlag);
    let options = {
      headers: headers,
      // params: queryparams
    };
    let fullUrl = bulksearccountdetails;
    return this.http.post(fullUrl, requestData, options);
  }
  getCountReport(requestData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = countreport;
    return this.http.post(fullUrl, requestData, options);
  }
  getSnoReAprovClaimList(requestData) {
    //alert(userId)
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    console.log(requestData);
    // let queryparams = new HttpParams()
    //   .append('userId', userId)
    //   .append('flag', flag)
    //   .append('fromDate', fromDate)
    //   .append('toDate', toDate)
    //   .append('stateCode', stateCode1)
    //   .append('distCode', distCode1)
    //   .append('hospitalCode', hospitalCode);
    let options = {
      headers: headers,
      // params: queryparams
    };
    let fullUrl = snoreapprovallist;
    return this.http.post(fullUrl, requestData, options);
  }
  getStateList() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });

    let options = {
      headers: headers,
    };
    let fullUrl = statelistSno;
    return this.http.get(fullUrl, options);
  }
  getBankMode() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });

    let options = {
      headers: headers,
    };
    let fullUrl = bankmode;
    return this.http.get(fullUrl, options);
  }
  getBankList() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });

    let options = {
      headers: headers,
    };
    let fullUrl = banklist;
    return this.http.get(fullUrl, options);
  }
  getDistrictListByState(userId, stateCode) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let queryparams = new HttpParams()
      .append('stateCode', stateCode)
      .append('userId', userId);
    let options = {
      headers: headers,
      params: queryparams,
    };
    //let token = this.jwtService.getJwtToken();
    let fullUrl = distListSno;
    return this.http.get(fullUrl, options);
  }
  getDistrictListByStateCode(stateCode) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let queryparams = new HttpParams().append('stateCode', stateCode);
    let options = {
      headers: headers,
      params: queryparams,
    };
    let fullUrl = getDistrictbystate;
    return this.http.get(fullUrl, options);
  }
  getHospitalByDist(userId, stateCode, distCode) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let queryparams = new HttpParams()
      .append('stateCode', stateCode)
      .append('distCode', distCode)
      .append('userId', userId);
    let options = {
      headers: headers,
      params: queryparams,
    };
    //let token = this.jwtService.getJwtToken();
    let fullUrl = hospitalList;
    return this.http.get(fullUrl, options);
  }
  getHospitalByDistCode(stateCode, distCode) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let queryparams = new HttpParams()
      .append('stateCode', stateCode)
      .append('districtCode', distCode);
    let options = {
      headers: headers,
      params: queryparams,
    };
    //let token = this.jwtService.getJwtToken();
    let fullUrl = getHospitalByDistrictId;
    return this.http.get(fullUrl, options);
  }
  getMultiPackage(txnId: any) {
    //let claimUrl=snoapprovalById;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let queryparams = new HttpParams().append('txnId', txnId);
    let options = {
      headers: headers,
      params: queryparams,
    };
    //let token = this.jwtService.getJwtToken();
    let fullUrl = snoapprovalById;
    return this.http.get(fullUrl, options);
    //return this.http.get<any>(`${this.Dataurl}/snoapproval/${claimid}`);
  }
  claimProcessedDetails(txnId: any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let queryparams = new HttpParams().append('txnId', txnId);
    let options = {
      headers: headers,
      params: queryparams,
    };
    let fullUrl = claimprocesseddetails;
    return this.http.get(fullUrl, options);
  }
  urnWiseDetails(txnId: any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let queryparams = new HttpParams().append('txnId', txnId);
    let options = {
      headers: headers,
      params: queryparams,
    };
    let fullUrl = urnwisedetails;
    return this.http.get(fullUrl, options);
  }
  systemAdminSnaRejectedDetails(txnId: any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let queryparams = new HttpParams().append('txnId', txnId);
    let options = {
      headers: headers,
      params: queryparams,
    };
    let fullUrl = systemadminrejecteddetails;
    return this.http.get(fullUrl, options);
  }
  getDischargeDetails(txnId: any) {
    //let claimUrl=snoapprovalById;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let queryparams = new HttpParams().append('txnId', txnId);
    let options = {
      headers: headers,
      params: queryparams,
    };
    //let token = this.jwtService.getJwtToken();
    let fullUrl = dischargeTreatment;
    return this.http.get(fullUrl, options);
    //return this.http.get<any>(`${this.Dataurl}/snoapproval/${claimid}`);
  }
  getSnoClaimListById(txnId: any) {
    //let claimUrl=snoapprovalById;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let queryparams = new HttpParams().append('txnId', txnId);
    let options = {
      headers: headers,
      params: queryparams,
    };
    //let token = this.jwtService.getJwtToken();
    let fullUrl = snoPackageBlock;
    return this.http.get(fullUrl, options);
    //return this.http.get<any>(`${this.Dataurl}/snoapproval/${claimid}`);
  }

  getPreAuthData(urn: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let queryparams = new HttpParams().append('urn', urn);
    let options = {
      headers: headers,
      params: queryparams,
    };
    //let token = this.jwtService.getJwtToken();
    let fullUrl = getPreAuth;
    return this.http.get(fullUrl, options);
    //return this.http.get<any>(`${this.Dataurl}/snoapproval/${claimid}`);
  }
  getRemarks() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    //let token = this.jwtService.getJwtToken();
    let fullUrl = getRemarks;
    return this.http.get(fullUrl, options);
  }
  getRemarksById(remarkid) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let queryparams = new HttpParams().append('remarkId', remarkid);
    let options = {
      headers: headers,
      params: queryparams,
    };
    let fullUrl = getRemarksById;
    return this.http.get(fullUrl, options);
    //getRemarksById
  }

  saveSnoDetails(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = snoaction;
    return this.http.post(fullUrl, formData, options);
  }
  saveSnoReActionDetails(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = snoreaction;
    return this.http.post(fullUrl, formData, options);
  }
  saveClaimProcessedDetails(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = saveclaimprocesseddetails;
    return this.http.post(fullUrl, formData, options);
  }
  saveUrnWiseDetails(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = saveurnwisedetails;
    return this.http.post(fullUrl, formData, options);
  }
  saveSyatemAdminSnaRejectedDetails(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = saveSyatemAdminSnaRejectedDetails;
    return this.http.post(fullUrl, formData, options);
  }
  dowloadMethod(fileName, hCode, dateOfAdm): Observable<Blob> {
    //console.log(data);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let queryparams = new HttpParams()
      .append('fileName', fileName)
      .append('hCode', hCode)
      .append('dateOfAdm', dateOfAdm);
    // alert(queryparams)
    let options = {
      headers: headers,
      params: queryparams,
    };
    let fullUrl = downLoadAction;
    return this.http.get<Blob>(fullUrl, options);
  }
  getDetails(txnId: any) {
    //let claimUrl=snoapprovalById;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let queryparams = new HttpParams().append('txnId', txnId);
    let options = {
      headers: headers,
      params: queryparams,
    };
    //let token = this.jwtService.getJwtToken();
    let fullUrl = getDcDetailsById;
    return this.http.get(fullUrl, options);
    //return this.http.get<any>(`${this.Dataurl}/snoapproval/${claimid}`);
  }

  downloadAllDocuments(fileArray) {
    let jsonString = JSON.stringify(fileArray);
    let queryParam = btoa(jsonString);
    let fullUrl = downloadAllDocuments + '?' + 'documentData=' + queryParam;
    return this.http.get(fullUrl, { responseType: 'blob' });
  }

  getapprovedforbulk(user: any, group: any, flags:any, fromDate:any, toDate:any,stateid:any,districtid:any,hospitalid:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let queryparams = new HttpParams()
      .append('user', user)
      .append('group', group)
      .append('flags', flags)
      .append('fromDate', fromDate)
      .append('toDate', toDate)
      .append('stateid', stateid)
      .append('districtid', districtid)
      .append('hospitalid', hospitalid);
    let options = {
      headers: headers,
      params: queryparams,
    };
    let fullUrl = autoappprovedbulkapproved;
    return this.http.get(fullUrl, options);
  }

  getSnoDCApprovedClaimList(requestData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    console.log(requestData);
    let options = {
      headers: headers,
    };
    let fullUrl = getdcClaimApprovedlist;
    return this.http.post(fullUrl, requestData, options);
  }
  getSnoDcAprvClaimListById(txnId: any) {
    //let claimUrl=snoapprovalById;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let queryparams = new HttpParams().append('txnId', txnId);
    let options = {
      headers: headers,
      params: queryparams,
    };
    let fullUrl = getDcAprvListById;
    return this.http.get(fullUrl, options);
  }
  saveSnoDetailsOfDCAprv(formData) {
    //alert(claimAmount)
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = snoactionofDCApproved;
    console.log(formData);
    return this.http.post(fullUrl, formData, options);
  }
  readExcelData(form) {
    let headers = new HttpHeaders({
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = paymentfreezefromexcel;
    console.log(form);
    return this.http.post(fullUrl, form, options);
  }

  getOldProcessedClaimlist(requestData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    console.log(requestData);
    let options = {
      headers: headers,
    };
    let fullUrl = getOldProcessedClaimlist;
    return this.http.post(fullUrl, requestData, options);
  }
  getOldClaimDetailsById(txnId: any) {
    //let claimUrl=snoapprovalById;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let queryparams = new HttpParams().append('txnId', txnId);
    let options = {
      headers: headers,
      params: queryparams,
    };
    let fullUrl = getOldProcessedClaimById;
    return this.http.get(fullUrl, options);
  }
  saveOldClaimDetails(formData) {
    //alert(claimAmount)
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = SaveOldProcessedClaim;
    console.log(formData);
    return this.http.post(fullUrl, formData, options);
  }
  getOldClaimQueryBySNAlist(requestData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    console.log(requestData);
    let options = {
      headers: headers,
    };
    let fullUrl = getOldClaimQueryBySNAlist;
    return this.http.post(fullUrl, requestData, options);
  }
  getOldClaimResettlementlist(requestData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    console.log(requestData);
    let options = {
      headers: headers,
    };
    let fullUrl = getOldClaimResettlementlist;
    return this.http.post(fullUrl, requestData, options);
  }
  getOldClaimResettlementById(txnId: any) {
    //let claimUrl=snoapprovalById;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let queryparams = new HttpParams().append('txnId', txnId);
    let options = {
      headers: headers,
      params: queryparams,
    };
    let fullUrl = getOldClaimResettlementById;
    return this.http.get(fullUrl, options);
  }
  saveSnoDetailsOfOldReAprv(formData) {
    //alert(claimAmount)
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = snoactionofOldReClaim;
    console.log(formData);
    return this.http.post(fullUrl, formData, options);
  }

  getClaimsOnHoldList(requestData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = getClaimsOnHoldList;
    return this.http.post(fullUrl, requestData, options);
  }

  getPackageName(procedureCode) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let queryparams = new HttpParams().append('procedureCode', procedureCode);
    let options = {
      headers: headers,
      params: queryparams,
    };
    //let token = this.jwtService.getJwtToken();
    let fullUrl = getPackageDetailsByProcedure;
    return this.http.get(fullUrl, options);
  }
  downloadOldFiles(fileName, hCode, year) {
    let jsonObj = {
      f: fileName,
      h: hCode,
      d: year,
    };
    let jsonString = JSON.stringify(jsonObj);
    let queryParam = btoa(jsonString);
    let fullUrl = downLoadOldDocAction + '?' + 'data=' + queryParam;
    return this.http.get(fullUrl, { responseType: 'blob' });
  }
  getPackageDetails(packageCode, subPackageCode, procedureCode, hospitalCode) {
    //let claimUrl=snoapprovalById;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let queryparams = new HttpParams()
      .append('packageCode', packageCode)
      .append('subPackageCode', subPackageCode)
      .append('procedureCode', procedureCode)
      .append('hospitalCode', hospitalCode);
    let options = {
      headers: headers,
      params: queryparams,
    };
    let fullUrl = getPackageDetailByCode;
    return this.http.get(fullUrl, options);
  }
  getauthentocationdetails(urn, memberid, type,Hospitalcode,caseno:any) {
    //let claimUrl=snoapprovalById;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let queryparams = new HttpParams()
      .append('Urn', urn)
      .append('memberid', memberid)
      .append('flag', type)
      .append('Hospitalcode', Hospitalcode)
      .append('caseno', caseno);
    let options = {
      headers: headers,
      params: queryparams,
    };
    let fullUrl = getAuthenticationDetails;
    return this.http.get(fullUrl, options);
  }
  getOverridecodedetails(overridecode,memeberid,urn,hospitalcode){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let queryparams = new HttpParams()
      .append('overridecode', overridecode)
      .append('Urn', urn)
      .append('memberid', memeberid)
      .append('hospitalcode', hospitalcode);
    let options = {
      headers: headers,
      params: queryparams,
    };
    let fullUrl = getOverridecodeDetails;
    return this.http.get(fullUrl, options);
  }
  getOldClaimActionlist(requestData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    console.log(requestData);
    let options = {
      headers: headers,
    };
    let fullUrl = getOldClaimActionlist;
    return this.http.post(fullUrl, requestData, options);
  }
  getOldClaimTrackingById(txnId: any) {
    //let claimUrl=snoapprovalById;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let queryparams = new HttpParams().append('txnId', txnId);
    let options = {
      headers: headers,
      params: queryparams,
    };
    let fullUrl = getOldClaimTrackingById;
    return this.http.get(fullUrl, options);
  }
  getSNAProcessedOldClaimlist(requestData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    console.log(requestData);
    let options = {
      headers: headers,
    };
    let fullUrl = getSNAProcessedOldClaimlist;
    return this.http.post(fullUrl, requestData, options);
  }
  getReCLaimedAndPendingAtSNAlist(requestData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    console.log(requestData);
    let options = {
      headers: headers,
    };
    let fullUrl = getReClaimedAndPendingAtSNAlist;
    return this.http.post(fullUrl, requestData, options);
  }


  getPostpayemtview(requestData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = getpostpaymenView;
    return this.http.post(fullUrl, requestData, options);
  }
  getTreatmentHistoryoverpackgae(txnId:any,urnnumber:any,hospitalcode:any,caseno:any,uidreferencenumber:any,userid:any) {
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
    let fullUrl = getTreatmentHistoryoverpackgae;
    return this.http.get(fullUrl, options);
  }

  getremarkdetails(snaid:any,fromdate:any,todate:any, hospitalcode:any,stateode:any, distcode:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });

    let queryparams = new HttpParams()
      .append('snaid', snaid)
      .append('fromdate', fromdate)
      .append('todate', todate)
      .append('hospitalcode', hospitalcode)
      .append('stateode', stateode)
      .append('distcode', distcode);
    let options = {
      headers: headers,
      params: queryparams,
    };
    let fullUrl = getremarkdetails;
    return this.http.get(fullUrl, options);

  }
  getcountremarkdetails(userid:any,fromdate:any,todate:any,statecode:any,districtcode:any,hospitalcode:any,remarkid:any,hospitalcodeforremark:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let queryparams = new HttpParams()
      .append('userid', userid)
      .append('fromdate', fromdate)
      .append('todate', todate)
      .append('statecode', statecode)
      .append('districtcode', districtcode)
      .append('hospitalcode', hospitalcode)
      .append('remarkid', remarkid)
      .append('hospitalcodeforremark', hospitalcodeforremark);
    let options = {
      headers: headers,
      params: queryparams,
    };
    let fullUrl = getcountremarkdetails;
    return this.http.get(fullUrl, options);
  }
  getdetailsonfloatclaimdetails(urn:any,claimid:any,floatno:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });

    let queryparams = new HttpParams()
      .append('urn', urn)
      .append('claimid', claimid)
      .append('floatno', floatno);
    let options = {
      headers: headers,
      params: queryparams,
    };
    let fullUrl = getdetailsonfloatclaimdetails;
    return this.http.get(fullUrl, options);
  }
  getSnaFloatClaimDetails(urn:any,claimid:any,floatno:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });

    let queryparams = new HttpParams()
      .append('urn', urn)
      .append('claimid', claimid)
      .append('floatno', floatno);
    let options = {
      headers: headers,
      params: queryparams,
    };
    let fullUrl = getsnafloatclaimdetails;
    return this.http.get(fullUrl, options);
  }

  getfloatlist(floatid:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });

    let queryparams = new HttpParams()
      .append('floatId', floatid);
    let options = {
      headers: headers,
      params: queryparams,
    };
    let fullUrl = floatLogHistory;
    return this.http.get(fullUrl, options);

  }
  getActiondetails(groupId:any, statecode:any,districtcode:any,hospitalcode:any,fromDate:any,toDate:any,userId:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let queryparams = new HttpParams()
      .append('groupId', groupId)
      .append('statecode', statecode)
      .append('districtcode', districtcode)
      .append('hospitalcode', hospitalcode)
      .append('fromDate', fromDate)
      .append('toDate', toDate)
      .append('userId', userId);
    let options = {
      headers: headers,
      params: queryparams,
    };
    let fullUrl = getActiondetails;
    return this.http.get(fullUrl, options);
  }
  getActionremarkdetails(snaid:any,fromdate:any,todate:any, hospitalcode:any,stateode:any, distcode:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let queryparams = new HttpParams()
      .append('snaid', snaid)
      .append('fromdate', fromdate)
      .append('todate', todate)
      .append('hospitalcode', hospitalcode)
      .append('stateode', stateode)
      .append('distcode', distcode);
    let options = {
      headers: headers,
      params: queryparams,
    };
    let fullUrl = getactionremarkdetails;
    return this.http.get(fullUrl, options);

  }
  getcountremarkforsnactiondetails(userid:any,fromdate:any,todate:any,statecode:any,districtcode:any,hospitalcode:any,remarkid:any,hospitalcodeforremark:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let queryparams = new HttpParams()
      .append('userid', userid)
      .append('fromdate', fromdate)
      .append('todate', todate)
      .append('statecode', statecode)
      .append('districtcode', districtcode)
      .append('hospitalcode', hospitalcode)
      .append('remarkid', remarkid)
      .append('hospitalcodeforremark', hospitalcodeforremark);
    let options = {
      headers: headers,
      params: queryparams,
    };
    let fullUrl = getcountremarkforsnactiondetails;
    return this.http.get(fullUrl, options);
  }
  downloadFilesenrollment(fileName, hCode, dateOfAdm,statecode,districtcode,blockcode) {
    let jsonObj = {
      f: fileName,
      h: hCode,
      d: dateOfAdm,
      s:statecode,
      dis:districtcode,
      b:blockcode
    };
    let jsonString = JSON.stringify(jsonObj);
    let queryParam = btoa(jsonString);
    let fullUrl = docenrollment + '?' + 'data=' + queryParam;
    return this.http.get(fullUrl, { responseType: 'blob' });
  }
  getEnrollmentRemarks() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    //let token = this.jwtService.getJwtToken();
    let fullUrl = getEnrollmentAllRemarks;
    return this.http.get(fullUrl, options);
  }
  getclaimnodetails(claimno:any){
       let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: this.jwtService.getJwtToken(),
      });
      let queryparams = new HttpParams().append('claimno', claimno);
      let options = {
        headers: headers,
        params: queryparams,
      };
      let fullUrl = getHistoryofclaimno;
      return this.http.get(fullUrl, options);

  }
  getTriggerDetails(data){
    let headers = new HttpHeaders({
     'Content-Type': 'application/json',
     Authorization: this.jwtService.getJwtToken(),
   });
  //  let queryparams = new HttpParams().append('claimId', claimId).append('slNo', slNo);
   let options = {
     headers: headers,
    //  params: queryparams,
   };
   let fullUrl = getTriggerDetails;
   console.log(fullUrl);
   return this.http.post(fullUrl, data, options);

  }
  getBulkapprovalist(fromDate:any,toDate:any,userId:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
    .append('fromDate',fromDate)
    .append('toDate',toDate)
    .append('userId',userId)
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getbulkapprovalrevertlist ;
    return this.http.get(fullUrl, options)
  }

  getBulkrevertsubmit(data) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = getbulkapprovalrevertSubmit;
    console.log(data);
    return this.http.post(fullUrl, data, options);
  }
  getDistrictByMultiState(requestData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    // let queryparams = new HttpParams()
    //   .append('stateCode', stateCode)
    //   .append('userId', userId);
    let options = {
      headers: headers,
      // params: queryparams,
    };
    //let token = this.jwtService.getJwtToken();
    let fullUrl = getDistrictByMultiState;
    return this.http.post(fullUrl,requestData, options);
  }
  getHospitalByMultiDistrict(requestData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    // let queryparams = new HttpParams()
    //   .append('stateCode', stateCode)
    //   .append('userId', userId);
    let options = {
      headers: headers,
      // params: queryparams,
    };
    //let token = this.jwtService.getJwtToken();
    let fullUrl = getHospitalByMultiDistrict;
    return this.http.post(fullUrl,requestData, options);
  }

  getsnamortalitystatus(claimid: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let queryparams = new HttpParams()
      .append('claimid', claimid);
    let options = {
      headers: headers,
      params: queryparams,
    };
    let fullUrl = getsnamortalitystatus;
    return this.http.get(fullUrl, options);
  }

  getSchemesubcategory() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });

    let options = {
      headers: headers,
    };
    let fullUrl = getMstschemesubcategory;
    return this.http.get(fullUrl, options);
  }

  partialClaimSnoDetails(txnId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let queryparams = new HttpParams().append('txnId', txnId);
    let options = {
      headers: headers,
      params: queryparams,
    };
    let fullUrl = partialclaimsnodetails;
    return this.http.get(fullUrl, options);
  }
  forwardSnoPartialClaim(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = forwardpartialclaim;
    return this.http.post(fullUrl, formData, options);
  }

  getSnoDCApprovedPartialClaimList(requestData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    console.log(requestData);
    let options = {
      headers: headers,
    };
    let fullUrl = getdccompliancepartialclaimlist;
    return this.http.post(fullUrl, requestData, options);
  }
  getPCDcAprvClaimById(txnId: any) {
    //let claimUrl=snoapprovalById;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let queryparams = new HttpParams().append('txnId', txnId);
    let options = {
      headers: headers,
      params: queryparams,
    };
    let fullUrl = getpartialclaimdcdetails;
    return this.http.get(fullUrl, options);
  }
  savePartialClaimOf(formData) {
    //alert(claimAmount)
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = snoactionofpartialclaimDC;
    console.log(formData);
    return this.http.post(fullUrl, formData, options);
  }

  savePartialClaimresetelment(data: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = savePartialClaimresetelment;
    return this.http.post(fullUrl, data, options);
  }
  getSnoReApprovalPartialClaimList(requestData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    console.log(requestData);
    let options = {
      headers: headers,
    };
    let fullUrl = getreapprovalpartialclaimlist;
    return this.http.post(fullUrl, requestData, options);
  }

  getsnaviewpartialclaimlist(requestData:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    console.log(requestData);
    let options = {
      headers: headers,
    };
    let fullUrl = getsnaviewpartialclaimlist;
    return this.http.post(fullUrl, requestData, options);
  }


  getcostlist(actioncode:any,packagedetailsid:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
    .append('actioncode',actioncode)
    .append('packagedetailsid',packagedetailsid)
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getcostdata ;
    return this.http.get(fullUrl, options)
  }


  gethedandimpalntlist(actioncode:any,packagedetailsid:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
    .append('actioncode',actioncode)
    .append('packagedetailsid',packagedetailsid)
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = gethedandimplantlist ;
    return this.http.get(fullUrl, options)
  }
}
