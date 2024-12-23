import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/shared-services/login.service';

@Component({
  selector: 'app-pagenotfound',
  templateUrl: './pagenotfound.component.html',
  styleUrls: ['./pagenotfound.component.scss'],
})
export class PagenotfoundComponent implements OnInit {
  constructor(private loginService: LoginService) {}

  ngOnInit(): void {}
  backToLogin() {
    this.loginService.logout();
  }
}
