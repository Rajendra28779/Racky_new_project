import { HttpClient, HttpHeaders } from '@angular/common/http';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { getfloatreportofAuditor } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class AuditorfloatreportserviceService {

  constructor(private http: HttpClient,private jwtService: JwtService) { }


    getFloatReportOfAuditor(fromdate: any, todate: any, floatno: any){
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.jwtService.getJwtToken()
      })
      let options = {
        headers:headers,
        params: {
          'fromdate':fromdate,
          'todate':todate,
          'floatno':floatno
        }

      }
      var fullUrl=getfloatreportofAuditor;
      return this.http.get(fullUrl,options)
    }
 
}
