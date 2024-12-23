import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JwtService } from 'src/app/services/jwt.service';
import { getpaymentfreezereport} from 'src/app/services/api-config';

@Injectable({
  providedIn: 'root'
})
export class PaymentfreezereportService {


  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute, private jwtService: JwtService) { }

  getpaymentfrezzedetails(userId: any, formdate: any, todate: any, stateId: any, districtId: any, hospitalId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })

    let options = {
      headers: headers,
      params: {
        "formdate": formdate,
        "todate": todate,
        "stateId": stateId,
        "districtId": districtId,
        "hospitalId": hospitalId,
        "userId": userId,

      }
    }
    let fullUrl = getpaymentfreezereport;
    return this.http.get(fullUrl,options)
  }
}
