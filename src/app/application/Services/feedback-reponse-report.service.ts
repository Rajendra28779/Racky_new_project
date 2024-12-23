import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { log } from 'console';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class FeedbackReponseReportService {
  

  constructor(private jwtService: JwtService, private http: HttpClient) { }
}
