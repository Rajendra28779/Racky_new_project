import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtService } from 'src/app/services/jwt.service';
import { getCardPolicyDate, updateCardPolicy } from 'src/app/services/api-config';

@Injectable({
  providedIn: 'root'
})
export class CardPolicyService {

  constructor(private http: HttpClient, private jwtService: JwtService) { }

  getCardPolicyDate(){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl =getCardPolicyDate;
    return this.http.get(fullUrl,options)

  }

updateCardPolicy(requestData) {
  console.log(requestData)
  let headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': this.jwtService.getJwtToken(),
  })
  let options = {
    headers: headers,
    // params: queryparams
  }
  let fullUrl = updateCardPolicy;
  return this.http.post(fullUrl,requestData,options)
}
}
