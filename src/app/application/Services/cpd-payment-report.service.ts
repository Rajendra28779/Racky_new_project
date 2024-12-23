import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { cpdpostpaymentupdation, cpdpostpaymentupdationview, floatdocdownload, getcpdpaymentdetails, getCPDProcessingPaymentDetails, getFloatDescriptiondata, getmoratlityDetails, getNote, getpackagedetailsData, getpackagedetailsForCalculation, getpackagedetailsForHedCalculation, getpackagedetailsForImpantCalculation, getPatienttreatedinoutsideodishareportforblock, getPatienttreatedinoutsideodishareportforPanchayat, getPatienttreatedinoutsideodishareportforVillage, getpaymentcpdlist, getprocessfloatreport, getUrnWisePaymentUtilizeListForBlock, getUrnWisePaymentUtilizeListForGp, getUrnWisePaymentUtilizeListForVillage } from 'src/app/services/api-config';
 import { JwtService } from 'src/app/services/jwt.service';
@Injectable({
  providedIn: 'root'
})
export class CpdPaymentReportService {



  constructor(private http: HttpClient, private jwtService: JwtService) { }

  getnote() {

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let token = this.jwtService.getJwtToken();
    let fullUrl = getNote;
    return this.http.get(fullUrl, options);

  }
  cpdpaymentdetails(user: any, type: any, Year: any, Month: any, Hospitalcode: any, Statecode: any, Districtcode: any, Flag: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });

    let queryparams = new HttpParams()
      .append('userid', user)
      .append('actiontype', type)
      .append('year', Year)
      .append('month', Month)
      .append('hospitalcode', Hospitalcode)
      .append('statecode', Statecode)
      .append('districtcode', Districtcode)
      .append('flag', Flag)

    let options = {
      headers: headers,
      params: queryparams
    };

    let fullUrl = getcpdpaymentdetails;
    return this.http.get(fullUrl, options);
  }



  getmoratlitydeta(userId: any, fromdate: any, todate: any, stateCodeList: any, districtCodeList: any, hospitalCodeList: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let queryparams = new HttpParams()
      .append('userId', userId)
      .append('fromdate', fromdate)
      .append('todate', todate)
      .append('stateCodeList', stateCodeList)
      .append('districtCodeList', districtCodeList)
      .append('hospitalCodeList', hospitalCodeList)
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getmoratlityDetails;
    return this.http.get(fullUrl, options)
  }
  getblockresultData(distrctCode: any, userid: any, fromDate: any, toDate: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let queryparams = new HttpParams()
      .append('distrctCode', distrctCode)
      .append('userid', userid)
      .append('fromDate', fromDate)
      .append('toDate', toDate)
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getUrnWisePaymentUtilizeListForBlock;
    return this.http.get(fullUrl, options)
  }
  getGpDetailsList(districtcode: any, blockcode: any, fromDate: any, todate: any, userid: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let queryparams = new HttpParams()
      .append('districtcode', districtcode)
      .append('blockcode', blockcode)
      .append('fromDate', fromDate)
      .append('todate', todate)
      .append('userid', userid)
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getUrnWisePaymentUtilizeListForGp;
    return this.http.get(fullUrl, options)
  }
  getVillageData(districtcode: any, blockcode: any, fromDate: any, gpid: any, todate: any, userid: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let queryparams = new HttpParams()
      .append('districtcode', districtcode)
      .append('blockcode', blockcode)
      .append('fromDate', fromDate)
      .append('todate', todate)
      .append('userid', userid)
      .append('gpid', gpid)
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getUrnWisePaymentUtilizeListForVillage;
    return this.http.get(fullUrl, options)
  }

  getoutsidepatienttreatementdetails(districtcode: any, fromDate: any, todate: any, userId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let queryparams = new HttpParams()
      .append('districtcode', districtcode)
      .append('fromDate', fromDate)
      .append('todate', todate)
      .append('userId', userId)
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getPatienttreatedinoutsideodishareportforblock;
    return this.http.get(fullUrl, options)
  }
  getOutsidepanchayatdetaisl(districtcode: any, blockcode: any, fromDate: any, todate: any, userid: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let queryparams = new HttpParams()
      .append('districtcode', districtcode)
      .append('blockcode', blockcode)
      .append('fromDate', fromDate)
      .append('todate', todate)
      .append('userid', userid)
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getPatienttreatedinoutsideodishareportforPanchayat;
    return this.http.get(fullUrl, options)
  }
  getOutsidevillagedetaisl(districtcode: any, blockcode: any, fromDate: any, todate: any, userId: any, gpcode: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let queryparams = new HttpParams()
      .append('districtcode', districtcode)
      .append('blockcode', blockcode)
      .append('fromDate', fromDate)
      .append('todate', todate)
      .append('userId', userId)
      .append('gpcode', gpcode)
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getPatienttreatedinoutsideodishareportforVillage;
    return this.http.get(fullUrl, options)
  }
  getInnerdetails(userId: any, year: any, month: any, hospitalcode: any, statecode: any, districtcode: any, status: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let queryparams = new HttpParams()
      .append('userId', userId)
      .append('year', year)
      .append('month', month)
      .append('hospitalcode', hospitalcode)
      .append('statecode', statecode)
      .append('districtcode', districtcode)
      .append('status', status)
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getCPDProcessingPaymentDetails;
    return this.http.get(fullUrl, options)
  }
  getpackagedetails() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers
    }
    let fullUrl = getpackagedetailsData;
    return this.http.get(fullUrl, options)
  }
  getpackagedetailsForCalculation(packlist: any, userid: any,statedata:any,districtdata:any,hospitaldata:any,hospitaltype:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let queryparams = new HttpParams()
      .append('packlist', packlist)
      .append('userid', userid)
      .append('statedata', statedata)
      .append('districtdata', districtdata)
      .append('hospitaldata', hospitaldata)
      .append('hospitaltype', hospitaltype)
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getpackagedetailsForCalculation;
    return this.http.get(fullUrl, options)
  }
  getpackagedetailsForImpant(userid:any,procedurecode:any,statedata:any,districtdata:any,hospitaldata:any,hospitaltype:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let queryparams = new HttpParams()
      .append('userid', userid)
      .append('procedurecode', procedurecode)
      .append('statedata', statedata)
      .append('districtdata', districtdata)
      .append('hospitaldata', hospitaldata)
      .append('hospitaltype', hospitaltype)
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getpackagedetailsForImpantCalculation;
    return this.http.get(fullUrl, options)
  }
  getheddetails(){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers
    }
    let fullUrl = getpackagedetailsForHedCalculation;
    return this.http.get(fullUrl, options)
  }
  getPaymentcpdList(month,year){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
     let queryparams = new HttpParams()
      .append('month', month)
      .append('year', year)
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getpaymentcpdlist;
    return this.http.get(fullUrl, options)
  }
  updatePayment(data) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = cpdpostpaymentupdation;
    return this.http.post(fullUrl, data, options);
  }
  cpdPostPaymentUpdationView(cpdUserId,year){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
     let queryparams = new HttpParams()
      .append('cpdUserId', cpdUserId)
      .append('year', year)
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = cpdpostpaymentupdationview;
    return this.http.get(fullUrl, options)
  }

//postpayment new List-----------
getprocessfloatfrpostpaymentnew(formdate: any, todate: any, snadoctor: any,userid:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let queryparams = new HttpParams()
      .append('formdate', formdate)
      .append('todate', todate)
      .append('snadoctor', snadoctor)
      .append('userid', userid)
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getprocessfloatreport;
    return this.http.get(fullUrl, options)
  }

  downloadFloatFiles(data) {
    let jsonObj = {
      f: data.document,
      h: data.floatNo,
    };
    let jsonString = JSON.stringify(jsonObj);
    let queryParam = btoa(jsonString);
    let fullUrl = floatdocdownload + '?' + 'data=' + queryParam;
    // return this.http.get(fullUrl, { responseType: 'blob' });
    return fullUrl;
  }

  getFloatDescription(fromDate:any,toDate:any,floatnumber:any,snauserid:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let queryparams = new HttpParams()
      .append('fromDate', fromDate)
      .append('toDate', toDate)
      .append('floatnumber', floatnumber)
      .append('snauserid', snauserid)
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getFloatDescriptiondata;
    return this.http.get(fullUrl, options)
  }
}
