import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getclaimbyUrnAndClaimNo,getsnawisependingreportdetails,snawiseunprocessedreport ,getUnProcessedClaimDetailsById,getsnawisependingreport ,snoUnprocessedAction, snoUnprocessedList, getUnprocessedShedule, runUnprocessedClaim, cpdwiseunprocesseddetails, cpdwisehospitalwiseactiondetails, getSnawiseunprocessedclaimlist, getSnawiseunprocessedclaimupdatet, getdischargereport, getunprocessedsummarydetails } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class UnprocessedclaimService {
  isValidData: number = 0; 
  constructor(private http: HttpClient, private jwtService: JwtService) { }

 public setIsValidData(data){
  this.isValidData = data;
 }
 public getIsValidData(){
  return this.isValidData;
 }

  getUnProcessedClaimList(requestData) {
    //alert(userId)
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    console.log(requestData);
    let options = {
      headers: headers,
    }
    let fullUrl = snoUnprocessedList;
    return this.http.post(fullUrl,requestData,options)
  }
  saveUnprocessedDetails(formData) {
    //alert(claimAmount)
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let fullUrl = snoUnprocessedAction;
    console.log(formData);
    return this.http.post(fullUrl, formData, options);

  }
  getSnoUnProcessedClaimById(txnId: any) {
    //let claimUrl=snoapprovalById;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams().append('txnId', txnId);
    let options = {
      headers: headers,
      params: queryparams
    }
    //let token = this.jwtService.getJwtToken();
    let fullUrl = getUnProcessedClaimDetailsById;
    return this.http.get(fullUrl, options);
    //return this.http.get<any>(`${this.Dataurl}/snoapproval/${claimid}`);
  }
  getByUrnAndClaimNo(userId:any,searchBy:any,fieldValue:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
    .append('userId', userId)
    .append('searchBy', searchBy)
    .append('fieldValue', fieldValue);
    let options = {
      headers:headers,
      params: queryparams
    }
    let fullUrl = getclaimbyUrnAndClaimNo;
    return this.http.get(fullUrl, options)
  }
  rununprocessed(requestData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    console.log(requestData);
    let options = {
      headers: headers,
    }
    let fullUrl = getUnprocessedShedule;
    return this.http.post(fullUrl,requestData,options)
  }
  runsnawiseunprocessed(requestData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    console.log(requestData);
    let options = {
      headers: headers,
    }
    let fullUrl = getSnawiseunprocessedclaimlist;
    return this.http.post(fullUrl,requestData,options)
  }

  snawiseunprocessedreport(data: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    console.log(data);
    let options = {
      headers: headers,
    }
    let fullUrl = snawiseunprocessedreport;
    return this.http.post(fullUrl,data,options)
  }


  snawisepending(requestData: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    console.log(requestData);
    let options = {
      headers: headers,
    }
    let fullUrl = getsnawisependingreport;
    return this.http.post(fullUrl,requestData,options)
  }
  getsnawisependingreportdetails(requestData: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    console.log(requestData);
    let options = {
      headers: headers,
    }
    let fullUrl = getsnawisependingreportdetails;
    return this.http.post(fullUrl,requestData,options)
  }
  rununprocessedClaim(requestData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    console.log(requestData);
    let options = {
      headers: headers,
    }
    let fullUrl = runUnprocessedClaim;
    return this.http.post(fullUrl,requestData,options)
  }


  getcpdunprocessseddetails(requestData:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
    }
    let fullUrl = cpdwiseunprocesseddetails;
    return this.http.post(fullUrl,requestData,options)
  }
  getcpdwisehospitalwisedetails(requestData:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
    }
    let fullUrl = cpdwisehospitalwiseactiondetails;
    return this.http.post(fullUrl,requestData,options)
  }
  runsnawiseunprocessedupdate(requestData){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
    }
    let fullUrl = getSnawiseunprocessedclaimupdatet;
    return this.http.post(fullUrl,requestData,options)
  }
  getdischargereort(fromdate:any,today:any,state:any,dist:any,hospital:any,pageIn:any,pageEnd:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params: {
        'fromdate': fromdate,
        'todate': today,
        'state': state,
        'dist': dist,
        'hospital': hospital,
        'pageIn': pageIn,
        'pageEnd': pageEnd
      }
    }
    var fullUrl =getdischargereport;
    return this.http.get(fullUrl,options)
  }

  getunprocessedsummarydetails(unprocessed: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params: {
        'fromdate': unprocessed.fromDate,
        'todate': unprocessed.toDate,
        'state': unprocessed.stateCode,
        'dist': unprocessed.districtCode,
        'hospital': unprocessed.hospitalCode,
        'flag': unprocessed.flag,
      }
    }
    var fullUrl =getunprocessedsummarydetails;
    return this.http.get(fullUrl,options)
  }
}
