import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { savevitalstatistics, getvitalstatistics, deletevitalstatistics, getByvitalstatistics, updatevitalstatistics, checkDuplicatevitalstatisticsname, checkDuplicatevitalstatisticscode } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class VitalStatisticsService {
  

  constructor(private http: HttpClient, private jwtService: JwtService) { }

  save(items:any)
  
  {
    
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl =savevitalstatistics;
    return this.http.post(fullUrl,items,options)
  }
  getalldata() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl =getvitalstatistics;
    return this.http.get(fullUrl,options)
  }
  deletevitalStatistics(id : any): Observable<any>{
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    let token = this.jwtService.getJwtToken();
    var fullUrl = deletevitalstatistics+`/${id}`  ;

    return this.http.delete(fullUrl,options)

  }
  updatevitalstatistics(data:any,id:string): Observable<any>{
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    let token = this.jwtService.getJwtToken();
    var fullUrl =updatevitalstatistics+`/${id}`;
    return this.http.put(fullUrl,data,options)


  }
  getbyvitalstatistics(id :string): Observable<any>{
  
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    let token = this.jwtService.getJwtToken();
    var fullUrl =getByvitalstatistics+`/${id}`;
    return this.http.get(fullUrl,options)
  }

  checkDuplicateData(vitalstatisticsname: any): Observable<any> {

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    };
    let token = this.jwtService.getJwtToken();
    let fullUrl = checkDuplicatevitalstatisticsname + "?vitalstatisticsname=" + vitalstatisticsname;
    return this.http.get(fullUrl, options);
  }
  checkDuplicateVitalStatisticsCode(vitalstatisticscode: any): Observable<any> {

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    };
    let token = this.jwtService.getJwtToken();
    let fullUrl = checkDuplicatevitalstatisticscode + "?vitalstatisticscode=" + vitalstatisticscode;
    return this.http.get(fullUrl, options);
  }

}
