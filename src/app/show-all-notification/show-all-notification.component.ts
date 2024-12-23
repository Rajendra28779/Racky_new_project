import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-show-all-notification',
  templateUrl: './show-all-notification.component.html',
  styleUrls: ['./show-all-notification.component.scss']
})
export class ShowAllNotificationComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
  }

}
