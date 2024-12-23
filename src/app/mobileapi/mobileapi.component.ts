import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtService } from '../services/jwt.service';
import { LoginService } from '../services/shared-services/login.service';
import { SessionStorageService } from '../services/session-storage.service';

@Component({
  selector: 'app-mobileapi',
  templateUrl: './mobileapi.component.html',
  styleUrls: ['./mobileapi.component.scss']
})
export class MobileapiComponent implements OnInit {

  constructor(
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private service: LoginService,
    private jwtService: JwtService,
    private sessionService: SessionStorageService
  ) { }

  ngOnInit(): void {
    this.getmobileapidata();
  }

  getmobileapidata(){
    this.activatedRoute.queryParamMap.subscribe((params) => {
     let username=atob(params.get('username'));
     let status=params.get('status');
     let data=atob(params.get('data'));
     let object=JSON.parse(data)
console.log(object);
      if (username != null) {
        this.service.mobileapilogin(username).subscribe((data:any)=>{
          let responseData = data.data;
          sessionStorage.clear();
          // sessionStorage.setItem('auth_token', responseData.auth_token);
          // sessionStorage.setItem('user', JSON.stringify(responseData.user));
          this.sessionService.encryptSessionData('user', responseData.user);
          this.sessionService.encryptSessionData('auth_token', responseData.auth_token);
          const sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
          sessionStorage.setItem('sessionId', sessionId);
          localStorage.setItem('sessionId', sessionId);
          this.jwtService.setJwtToken(responseData.auth_token);
          // this.router.navigate(['/application/sna-dashboard']);
          if(status!=null || status!=undefined){
            if(parseInt(status)==1){
              let state = object;
              localStorage.setItem('actionData', JSON.stringify(state));
              this.router.navigate(['/application/snoapproval/action']);
            }else if(parseInt(status)==2){
              let state = object;
              localStorage.setItem('actionData', JSON.stringify(state));
              this.router.navigate(['/application/snoreapproval/action']);
            }else if(parseInt(status)==3){
              let state = object;
              localStorage.setItem("actionData", JSON.stringify(state));
              this.router.navigate(['/application/cpdrejectedaction/action']);
            }else if(parseInt(status)==4){
              let state = object;
              localStorage.setItem('actionData', JSON.stringify(state));
              this.router.navigate(['/application/unProcessedClaimList/action']);
            }else{
              this.router.navigate(['/application/sna-dashboard']);
            }
          }else{
            this.router.navigate(['/application/sna-dashboard']);
          }
        });
        }else {
          this.router.navigate(['/unauthorize'], { queryParams: { unAuthrized: 'unauthorise' } });
        }
      });
  }

}
