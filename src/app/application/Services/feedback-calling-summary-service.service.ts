import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class FeedbackCallingSummaryServiceService {
  
  constructor(private jwtService: JwtService, private http: HttpClient) { }

  



}
