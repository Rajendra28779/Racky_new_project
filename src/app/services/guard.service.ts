import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { checkPrimaryLinkAccess } from './api-config';
import { JwtService } from './jwt.service';
import { EncryptionService } from './encryption.service';

@Injectable({
  providedIn: 'root'
})
export class GuardService {

  constructor(
    private http: HttpClient,
    private jwtService: JwtService,
    private encryptionService: EncryptionService) { }

  checkPrimaryLinkAccess(userId: any, url: any): Observable<any> {
    const httpOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.jwtService.getJwtToken()
      },
      // params: { 'userId': userId, 'url': url }
    };
    let data = {
      userId: userId,
      url: url
    }
    let fullUrl = checkPrimaryLinkAccess;
    return this.http.post(fullUrl, this.encryptionService.encryptRequest(data), httpOptions);
  }
}
