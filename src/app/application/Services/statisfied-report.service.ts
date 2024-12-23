import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { JwtService } from 'src/app/services/jwt.service';
@Injectable({
  providedIn: 'root'
})
export class StatisfiedReportService {

  constructor(private http: HttpClient, private jwtService: JwtService) { }


}
