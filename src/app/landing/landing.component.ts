import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {EncryptionPassService} from "../services/encryption-pass.service";
import { SessionStorageService } from '../services/session-storage.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  user:any;
  constructor(private router : ActivatedRoute, private router1:Router, private encPassService  : EncryptionPassService,
    private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.user = this.sessionService.decryptSessionData("user");
    this.router.queryParamMap.subscribe((params) => { 
      console.log(params.get('data'))
      if (params.get('data') != null) {
        console.log("Data Found")
        const queryParam = this.encPassService.OnDecryptPwd(params.get('data'));
        this.sessionService.encryptSessionData("user", JSON.parse(queryParam).user);
        this.sessionService.encryptSessionData("auth_token", JSON.parse(queryParam).authToken);
        this.router1.navigate(['application/dashboard']);
      }
    });

    setTimeout(() => {
      if (this.user != null) {
        window.location.reload();
      }
    }, 1000);
  }
}

