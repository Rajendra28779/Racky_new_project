import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getdetailsoldandnewclaimdetailsforview } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class OldandnewclaimdetailsService {

  constructor(private http: HttpClient, private jwtService: JwtService) { }

  getdetailsdatathroughurn(urnnumber:any,claimid:any,selctedvalue:any,claimnumber:any,transactiondetailsid:any,authorizedcode:any,hospitalcode:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
    .append('urnnumber', urnnumber)
    .append('claimid', claimid)
    .append('selctedvalue', selctedvalue)
    .append('claimnumber', claimnumber)
    .append('transactiondetailsid', transactiondetailsid)
    .append('authorizedcode', authorizedcode)
    .append('hospitalcode', hospitalcode)
    let options = {
      headers:headers,
      params: queryparams
    }
    let fullUrl = getdetailsoldandnewclaimdetailsforview;
    return this.http.get(fullUrl, options)
  }
}
