import { Injectable } from '@angular/core';
import { JwtService } from 'src/app/services/jwt.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {getbenificiaryblockwisetreatmentdata, getbenificiarygpwisetreatmentdata, getbenificiaryvillagewisetreatmentdata, getstatedashboarddata} from 'src/app/services/api-config';

@Injectable({
  providedIn: 'root'
})
export class BenificiarydistrictwisedataService {

  constructor(private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private jwtService: JwtService) { }

    getbenificiaryblockwisetreatmentdata(age: any, agecondition: any, districtId: any,userid:any) {
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.jwtService.getJwtToken(),
      })

      let options = {
        headers: headers,
        params: {
          "age": age,
          "ageconditions": agecondition,
          "distcode":districtId,
          "userid": userid
        }
      }
      let fullUrl = getbenificiaryblockwisetreatmentdata;
      return this.http.get(fullUrl,options)
    }

    getbenificiarygpwisetreatmentdata(age: any, agecondition: any, districtId: any, blockId: any,userid:any) {
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.jwtService.getJwtToken(),
      })

      let options = {
        headers: headers,
        params: {
          "age": age,
          "ageconditions": agecondition,
          "distcode":districtId,
          "blockcode":blockId,
          "userid": userid
        }
      }
      let fullUrl = getbenificiarygpwisetreatmentdata;
      return this.http.get(fullUrl,options)
    }

    getbenificiaryvillagewisetreatmentdata(age: any, agecondition: any, districtId: any, blockId: any, gramId: any,userid:any) {
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.jwtService.getJwtToken(),
      })
      let options = {
        headers: headers,
        params: {
          "age": age,
          "ageconditions": agecondition,
          "distcode":districtId,
          "blockcode":blockId,
          "gpcode":gramId,
          "userid": userid
        }
      }
      let fullUrl = getbenificiaryvillagewisetreatmentdata;
      return this.http.get(fullUrl,options)
    }

    getstatedashboarddata(formdate:any,todate:any) {
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.jwtService.getJwtToken(),
      })
      let options = {
        headers: headers,
        params: {
          "formdate": formdate,
          "todate": todate
        }
      }
      let fullUrl = getstatedashboarddata;
      return this.http.get(fullUrl,options)
    }
}
