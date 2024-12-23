import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtService } from '../services/jwt.service';
import { getcarbalancedetailsbyurn, refundAmount } from '../services/api-config';

@Injectable({
  providedIn: 'root'
})
export class CardbalanceupdateserviceService {

  constructor(private http: HttpClient,private jwtService: JwtService) { }




  getcarbalancedetailsbyurn(urn:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams().append('urn',urn);
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getcarbalancedetailsbyurn;
    return this.http.get(fullUrl, options);
  }

  refundAmount(userid:any, memberId:any, urn:any, balanceAmount:any, claimid: any, remarks:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
      .append('userid',userid)
      .append('memberId',memberId)
      .append('urn',urn)
      .append('balanceAmount',balanceAmount)
      .append('claimid',claimid)
      .append('remarks',remarks);
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = refundAmount;
    return this.http.get(fullUrl, options);
  }

}
