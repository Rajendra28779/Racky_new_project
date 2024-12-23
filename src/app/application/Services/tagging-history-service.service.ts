import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { gettaggedhistory } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class TaggingHistoryServiceService {

  constructor(private http: HttpClient, private jwtService: JwtService) { }

  gettaggedhistory(stateId, districtId, hospitalId){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params: {
        stateId: stateId,
        districtId: districtId,
        hospitalId: hospitalId
        // taggedType: taggedType
      },
    };
    let fullUrl = gettaggedhistory;
    return this.http.get(fullUrl, options);
  }
}
