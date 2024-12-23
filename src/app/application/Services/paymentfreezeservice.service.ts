import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JwtService } from 'src/app/services/jwt.service';
import { Observable } from 'rxjs';
import { floatdetailslist, floatlist, floatlistview, getFloatDetails, getFloatList, getPaymentFrzDtlsList, getFloatClaimDetails,
  paymentfreezelist, remarkUpdate, updateSnaApprvdAmnt, verifyFloat, paymentFreeze, snaApprovedList, paymentFreezeAction,
  paymentFreezeView, downloadPfzFile, getforemarkList, generatefloat, forwardToSNA, onclickdetailsnuttonforemarks, paymentforward,
  summmaydetails, viewmodaldata, getHospitalwisefloatdetails, getHospitalwisefloatdetailsmodaldata, getCountDetails,
  getCountDetailsByFloatNo, floatdetailsbyhospital, getrefundlist, pendingFloatFo, assignFLoat, forwardFloat, paymentFreezeOldAction,
  paymentFreezeViewOld, downloadOldPfzFile, paymentFreezeDetails, paymentFreezeOldDetails, pendingmoratlityStatus, floatLogHistory, floatdocdownload,
  downLoadDocActionFloat,
  floatDraftList,
  forwardDraftFloat,
  floatView,
  floatclaimaction,
  getfloatdetailshospitalwiseabstaact,
  getfloatdetailshospitalwiseabstaactLogRecord,
  getfloatdetailshospitalwiseabstaactView,
  gethospwisependingclaimdetails,
  getFloatClaimDetailsList,
  iaForwardToSNA} from 'src/app/services/api-config';

@Injectable({
  providedIn: 'root'
})
export class PaymentfreezeserviceService {

  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute, private jwtService: JwtService) { }

  getpaymentlist(requestData) {
    console.log(requestData)
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    }
    let fullUrl = paymentfreezelist;
    return this.http.post(fullUrl,requestData,options)
  }

  getrefundlist(requestData) {
    console.log(requestData)
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    }
    let fullUrl = getrefundlist;
    return this.http.post(fullUrl,requestData,options)
  }

  getSnaApprovedList(requestData) {
    console.log(requestData)
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    }
    let fullUrl = snaApprovedList;
    return this.http.post(fullUrl,requestData,options)
  }

  getCountDetails(requestData) {
    console.log(requestData)
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    }
    let fullUrl = getCountDetails;
    return this.http.post(fullUrl,requestData,options)
  }

  getCountDetailsByFloatNo(floatNumber,levelId) {
    // console.log(requestData)
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    });
    let params = new HttpParams().append('floatNumber', floatNumber).append('levelId', levelId);
    let options = {
      headers: headers,
      params: params
    }
    let fullUrl = getCountDetailsByFloatNo;
    return this.http.get(fullUrl,options)
  }

  getFloatList(id,fromdate,todate,snoid,userid,authMode) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let queryparams = new HttpParams()
      .append('groupId', id)
      .append('fromdate', fromdate)
      .append('todate', todate)
      .append('snoid', snoid)
      .append('userid', userid)
      .append('authMode', authMode)
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = floatlist;
    return this.http.get(fullUrl,options)
  }
  getVerifiedFloatList(id) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let queryparams = new HttpParams()
      .append('groupId', id)
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = floatlistview;
    return this.http.get(fullUrl,options)
  }
  generateFloat(requestData) {
    let headers = new HttpHeaders({
      'Authorization': this.jwtService.getJwtToken(),
    })
    console.log(requestData);
    let options = {
      headers: headers,
    }
    let fullUrl = generatefloat;
    return this.http.post(fullUrl,requestData,options)
  }

  getfloatlist(requestData) {
    console.log(requestData)
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
      // params: queryparams
    }
    let fullUrl = getFloatList;
    return this.http.post(fullUrl,requestData,options)
  }

  getfloatdetails(requestData) {
    console.log(requestData)
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
      // params: queryparams
    }
    let fullUrl = getFloatDetails;
    return this.http.post(fullUrl,requestData,options)
  }
  getFloatDetails(floatNumber){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let queryparams = new HttpParams()
      .append('floatNumber', floatNumber)

    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = floatdetailslist;
    return this.http.get(fullUrl,options)
  }
  getFloatDetailsByHospital(floatNumber, hospitalCode){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let queryparams = new HttpParams()
      .append('floatNumber', floatNumber)
      .append('hospitalCode', hospitalCode);

    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = floatdetailsbyhospital;
    return this.http.get(fullUrl,options)
  }
  updateRemark(data){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    // let queryparams = new HttpParams()
    //   .append('floatNumber', floatNumber)

    let options = {
      headers: headers,
      // params: queryparams
    }
    let fullUrl = remarkUpdate;
    return this.http.post(fullUrl,data,options)
  }
  verifyFloat(formData:FormData){
    let headers = new HttpHeaders({
      // 'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    // let queryparams = new HttpParams()
    //   .append('floatNumber', floatNumber)
    //   .append('actionBy', actionBy)
    //   .append('remark', remark)
    let options = {
      headers: headers,
      // params: queryparams
    }
    let fullUrl = verifyFloat;
    return this.http.post(fullUrl,formData,options)
  }
  forwardToSNA(formData:FormData){
    let headers = new HttpHeaders({
      // 'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    // let queryparams = new HttpParams()
    //   .append('floatNumber', floatNumber)
    //   .append('actionBy', actionBy)
    //   .append('remark', remark)
    let options = {
      headers: headers,
      // params: queryparams
    }
    let fullUrl = forwardToSNA;
    return this.http.post(fullUrl,formData,options)
  }

  getPaymentFrzDtlsList(userId: any, fromDate: any, toDate: any,pendingAt:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
    .append('userId', userId)
    .append('fromDate', fromDate)
    .append('toDate', toDate)
    .append('pendingAt', pendingAt);
    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = getPaymentFrzDtlsList;
    return this.http.get(fullUrl, options);
  }

  getFloatClaimDetails(floatNo: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams().append('floatNo', floatNo);
    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = getFloatClaimDetails;
    return this.http.get(fullUrl, options);
  }

  updateSnaApprvdAmnt(claimId: any, amount: any, userId: any, remark: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
      .append('claimId', claimId)
      .append('amount', amount)
      .append('userId', userId)
      .append('remark', remark)
    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = updateSnaApprvdAmnt;
    return this.http.get(fullUrl, options);
  }

  paymentFreeze(floatNo: any, userId: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
      .append('floatNo', floatNo)
      .append('userId', userId);
    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = paymentFreeze;
    return this.http.get(fullUrl, options);
  }

  paymentFreezeAction(formData: any): Observable<any> {
    let headers = new HttpHeaders({
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = paymentFreezeAction;
    return this.http.post(fullUrl, formData, options);
  }

  paymentFreezeOldAction(formData: any): Observable<any> {
    let headers = new HttpHeaders({
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = paymentFreezeOldAction;
    return this.http.post(fullUrl, formData, options);
  }

  paymentFreezeView(requestData) {
    console.log(requestData)
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
      // params: queryparams
    }
    let fullUrl = paymentFreezeView;
    return this.http.post(fullUrl,requestData,options)
  }

  paymentFreezeViewOld(requestData) {
    console.log(requestData)
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
      // params: queryparams
    }
    let fullUrl = paymentFreezeViewOld;
    return this.http.post(fullUrl,requestData,options)
  }

  downloadPfzFile(filename: any, userId: any) {
    let jsonObj = {
      f: filename,
      u: userId
    };
    let jsonString = JSON.stringify(jsonObj);
    let queryParam = btoa(jsonString);
    let url = downloadPfzFile + '?' + 'file=' + queryParam;
    return url;
  }

  downloadOldPfzFile(filename: any, userId: any) {
    let jsonObj = {
      f: filename,
      u: userId
    };
    let jsonString = JSON.stringify(jsonObj);
    let queryParam = btoa(jsonString);
    let url = downloadOldPfzFile + '?' + 'file=' + queryParam;
    return url;
  }

  getforemarkslist(userId:any,fromDate:any,toDate:any,pendingAt:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
    .append('userId', userId)
    .append('fromDate', fromDate)
    .append('toDate', toDate)
    .append('pendingAt', pendingAt);
    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = getforemarkList;
    return this.http.get(fullUrl, options);
  }
  getforemarksdetails(floatno:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams().append('floatno', floatno);
    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = onclickdetailsnuttonforemarks;
    return this.http.get(fullUrl, options);
  }
  paymentForward(header: any, userId: any,remarks:any,pendingAt:any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
      .append('header', header)
      .append('userId', userId)
      .append('remarks', remarks)
      .append('pendingAt', pendingAt);
    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = paymentforward;
    return this.http.get(fullUrl, options);
  }
  getSummary(userid:any,fromDate:any,toDate:any,verify:any,schemecategoryid:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
    .append('userid', userid)
    .append('fromDate', fromDate)
    .append('toDate', toDate)
    .append('verify', verify)
    .append('schemecategoryid', schemecategoryid)
    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = summmaydetails;
    return this.http.get(fullUrl, options);

  }
  modalvalue(claimid:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams().append('claimid', claimid)
    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = viewmodaldata;
    return this.http.get(fullUrl, options);
  }
  getfloatdetailshospitalwise(floatnumberhospitawisedetails:any,fromdate:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
    .append('floatnumberhospitawisedetails', floatnumberhospitawisedetails)
    .append('fromdate', fromdate)
    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = getHospitalwisefloatdetails;
    return this.http.get(fullUrl, options);
  }
  gethospitawisefloatmodalreport(requestData){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
    };
    let fullUrl = getHospitalwisefloatdetailsmodaldata;
    return this.http.post(fullUrl,requestData, options);
  }
  getPendingFloat(user){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
    .append('userId', user)
    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = pendingFloatFo;
    return this.http.get(fullUrl, options);
  }
  assignFo(requestData){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    let fullUrl = assignFLoat;
    return this.http.post(fullUrl,requestData, options);
  }
  forwardFloat(formData:FormData){
    let headers = new HttpHeaders({
      // 'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    // let queryparams = new HttpParams()
    //   .append('floatList', floatList)
    //   .append('remark', remark)
    //   .append('pendingAt', pendingAt)
    //   .append('userId', userId)
    let options = {
      headers: headers,
      // params: queryparams
    };
    let fullUrl = forwardFloat;
    return this.http.post(fullUrl,formData, options);
  }

  paymentFreezeDetails(fromDate: any, toDate: any, stateId: any, districtId: any, hospitalId: any, mortality: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
      .append('fromDate', fromDate)
      .append('toDate', toDate)
      .append('stateId', stateId)
      .append('districtId', districtId)
      .append('hospitalId', hospitalId)
      .append('mortality', mortality);
    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = paymentFreezeDetails;
    return this.http.get(fullUrl, options);
  }

  paymentFreezeOldDetails(fromDate: any, toDate: any, stateId: any, districtId: any, hospitalId: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
      .append('fromDate', fromDate)
      .append('toDate', toDate)
      .append('stateId', stateId)
      .append('districtId', districtId)
      .append('hospitalId', hospitalId);
    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = paymentFreezeOldDetails;
    return this.http.get(fullUrl, options);
  }
  // getUpdatedpaymentinfloatceo(verifyFlag:any,userid:any, floatnumber:any,formdate:any,todate:any,sonid:any,authMode:any): Observable<any> {
  //   let headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Authorization': this.jwtService.getJwtToken()
  //   });
  //   let queryparams = new HttpParams()
  //   .append('verifyFlag', verifyFlag)
  //   .append('userid', userid)
  //   .append('floatnumber', floatnumber)
  //   .append('formdate', formdate)
  //   .append('todate', todate)
  //   .append('sonid', sonid)
  //   .append('authMode', authMode);
  //   let options = {
  //     headers: headers,
  //     params: queryparams
  //   };
  //   let fullUrl = Floatceoupdatelist;
  //   return this.http.get(fullUrl, options);
  // }
  getmortalityStatus(userid:any,fromdate:any,todate:any,statecode:any,districtcode:any,hospitalcode:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
    .append('userid', userid)
    .append('fromdate', fromdate)
    .append('todate', todate)
    .append('statecode', statecode)
    .append('districtcode', districtcode)
    .append('hospitalcode', hospitalcode)
    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = pendingmoratlityStatus;
    return this.http.get(fullUrl, options);
  }

  getFloatLogList(floatId){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
    .append('floatId', floatId)

    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = floatLogHistory;
    return this.http.get(fullUrl, options);
  }
  downloadFloatFiles(data) {
    let jsonObj = {
      f: data.floatDoc,
      h: data.floateno,
    };
    let jsonString = JSON.stringify(jsonObj);
    let queryParam = btoa(jsonString);
    let fullUrl = floatdocdownload + '?' + 'data=' + queryParam;
    // return this.http.get(fullUrl, { responseType: 'blob' });
    return fullUrl;
  }
  downloadFloatFilesss(data) {
    let jsonObj = {
      f: data.floatDoc,
      h: data.floateno,
    };
    let jsonString = JSON.stringify(jsonObj);
    let queryParam = btoa(jsonString);
    let fullUrl = floatdocdownload + '?' + 'data=' + queryParam;
    // return this.http.get(fullUrl, { responseType: 'blob' });
    return fullUrl;
  }

  downloadFilesforfloat(fileName, floatNumber, currentYear) {
    let jsonObj = {
      f: fileName,
      h: floatNumber,
      c: currentYear,
    };
    let jsonString = JSON.stringify(jsonObj);
    let queryParam = btoa(jsonString);
    let fullUrl = downLoadDocActionFloat + '?' + 'data=' + queryParam;
    return this.http.get(fullUrl, { responseType: 'blob' });
  }

  getDraftDetails(snoid:any,fromDate:any,toDate:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let queryparams = new HttpParams()
      .append('snoid', snoid)
      .append('fromdate', fromDate)
      .append('todate', toDate)
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = floatDraftList;
    return this.http.get(fullUrl,options)
  }
  forwardDraftFloat(requestData) {
    let headers = new HttpHeaders({
      'Authorization': this.jwtService.getJwtToken(),
    })
    console.log(requestData);
    let options = {
      headers: headers,
    }
    let fullUrl = forwardDraftFloat;
    return this.http.post(fullUrl,requestData,options)
  }


  getFloatListView(id,fromdate,todate,snoid,userid,authMode) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let queryparams = new HttpParams()
      .append('groupId', id)
      .append('fromdate', fromdate)
      .append('todate', todate)
      .append('snoid', snoid)
      .append('userid', userid)
      .append('authMode', authMode)
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = floatView;
    return this.http.get(fullUrl,options)
  }
  saveFloatClaimAction(formData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = floatclaimaction;
    return this.http.post(fullUrl, formData, options);
  }

  getfloatdetailshospitalwiseabstaact(floateno:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
    .append('floateno', floateno)
    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = getfloatdetailshospitalwiseabstaact;
    return this.http.get(fullUrl, options);
  }

  getpreviousRecord(hospitalcode:any,floateno:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
    .append('floateno', floateno)
    .append('hospitalcode', hospitalcode)
    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = getfloatdetailshospitalwiseabstaactLogRecord;
    return this.http.get(fullUrl, options);
  }

  getLogDetails(hospitalcode:any,floateno:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
    .append('floateno', floateno)
    .append('hospitalcode', hospitalcode)
    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = getfloatdetailshospitalwiseabstaactView;
    return this.http.get(fullUrl, options);
  }

  gethospwisependingclaimdetails(floatNumber: any, hospcode: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
    .append('floatNumber', floatNumber)
    .append('hospcode', hospcode)
    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = gethospwisependingclaimdetails;
    return this.http.get(fullUrl, options);
  }

  getFloatClaimDetailsList(floatNo: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams().append('floatNo', floatNo);
    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = getFloatClaimDetailsList;
    return this.http.get(fullUrl, options);
  }
  iaForwardToSna(formData:FormData){
    let headers = new HttpHeaders({
      // 'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    // let queryparams = new HttpParams()
    //   .append('floatNumber', floatNumber)
    //   .append('actionBy', actionBy)
    //   .append('remark', remark)
    let options = {
      headers: headers,
      // params: queryparams
    }
    let fullUrl = iaForwardToSNA;
    return this.http.post(fullUrl,formData,options)
  }
}
