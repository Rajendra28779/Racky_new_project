import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderService } from '../header.service';
import { NotificationService } from '../Services/notification.service';

@Component({
  selector: 'app-viewnotification',
  templateUrl: './viewnotification.component.html',
  styleUrls: ['./viewnotification.component.scss']
})
export class ViewnotificationComponent implements OnInit {
  notificationlist: any;
  list: any;
  txtsearchDate: any;
  showPegi: any;
  pageElement: any;
  currentPage: any;
  listc: any

  constructor(public headerService: HeaderService, private notificationservice: NotificationService, private route: Router) { }

  ngOnInit(): void {
    this.getnotification();
  }

  getnotification() {
    this.notificationservice.getalldata().subscribe((data) => {
      this.list = data;
      this.listc = this.list.length
      if (this.listc > 0) {
        this.currentPage = 1;
        this.pageElement = 10;
        this.showPegi = true;
      } else {
        this.showPegi = false
      }
    })
  }

  edit(v: any) {
    let navigationExtras: NavigationExtras = {
      state: {
        id: v.notificationId,
        content: v.noticeContent,
        fromdate: v.fdate,
        Todate: v.tdate,
        groupid: v.groupId.typeId,
        status: v.statusFlag,
        docpath: v.docpath,
        popupFlag: v.popupFlag
      }
    };
    this.route.navigate(['application/notification'], navigationExtras);
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  downlordnotification(event: any, docpath: any) {

    if (docpath != null && docpath != '' && docpath != undefined) {
      let img = this.notificationservice.downloadFile(docpath);
      window.open(img, '_blank');
    } else {
      this.swal('Info', 'There Is No File', 'info');
    }

  }


  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
  }
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }

}
