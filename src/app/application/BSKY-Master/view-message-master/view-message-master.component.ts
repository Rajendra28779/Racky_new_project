import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { MessageServiceService } from '../../Services/message-service.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
// import * as CKEditor from '@ckeditor/ckeditor5-build-classic';


@Component({
  selector: 'app-view-message-master',
  templateUrl: './view-message-master.component.html',
  styleUrls: ['./view-message-master.component.scss']
})
export class ViewMessageMasterComponent implements OnInit {

  public isDisabled = true;
  user: any
  childmessage: any
  txtsearchDate: any
  showPegi: any;
  pageElement: any;
  currentPage: any;


  constructor(private route: Router, public headerService: HeaderService, private service: MessageServiceService, private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle('View-Message Master');
    this.user = this.sessionService.decryptSessionData("user");
    this.getallmessagemaster();
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }

  listdata: any
  listdatacount: any
  getallmessagemaster() {
    this.service.getallmessage().subscribe(data => {
      this.listdata = data
      this.listdatacount = this.listdata.length;
      if (this.listdatacount > 0) {
        this.currentPage = 1;
        this.pageElement = 10;
        this.showPegi = true;
      } else {
        this.showPegi = false;
      }
    });
  }
  edit(item: any) {

    let navigationExtras: NavigationExtras = {
      state: {
        user: item
      }
    };
    this.route.navigate(['application/messagemaster'], navigationExtras);
    // this.route.navigate(['/application/subgroup/'+item]);
  }
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }
  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;

  }

}
