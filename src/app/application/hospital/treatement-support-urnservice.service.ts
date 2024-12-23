import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { searchthroughturn } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class TreatementSupportUrnserviceService {

  constructor(private http: HttpClient,private jwtService: JwtService) { }
  gettsu(urn){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
    .append('urn',urn);
    let options = {
      headers:headers,
      params: queryparams
    }

    let fullUrl = searchthroughturn;
    return this.http.get(fullUrl, options)

  }
}
