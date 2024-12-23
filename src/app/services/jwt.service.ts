import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SessionStorageService } from './session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  private jwtToken: string;

  constructor(private sessionService: SessionStorageService) {
    let auth_token = sessionStorage.getItem('auth_token');
    this.jwtToken = auth_token;
  }

  getJwtToken(): string {
    // this.jwtToken=this.sessionService.decryptSessionData("user");
    return this.sessionService.decryptSessionData("auth_token");
  }

  setJwtToken(jwtToken) {
    this.sessionService.encryptSessionData('auth_token', jwtToken);
    this.jwtToken = jwtToken;
  }
}
