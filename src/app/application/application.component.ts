import { Component, OnInit } from '@angular/core';
import { LoginSharedServiceService } from '../login-shared-service.service';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    document.styleSheets[1].disabled = true;
    document.styleSheets[2].disabled = false;
  }

}
