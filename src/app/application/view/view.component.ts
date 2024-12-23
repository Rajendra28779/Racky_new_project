import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../header.service';
import { UtiliteComponent } from '../shared/utilite/utilite.component';
declare let $: any;

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  childmessage: any;

  constructor(public headerService:HeaderService) { }

  ngOnInit(): void {

    this.headerService.setTitle('View Page');

    this.headerService.isIndicate(true);
    this.headerService.isPrint(false);
    this.headerService.isDownload(true);
    this.headerService.isDelete(true);
    this.headerService.isBack(true);

    $('#demoDatatable').DataTable({
      //paging: true,
      //ordering: false,
      info: false,
    });

  }

  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }

  
}
