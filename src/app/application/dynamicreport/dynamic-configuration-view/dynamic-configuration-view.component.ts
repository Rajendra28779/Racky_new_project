import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { NavigationExtras, Router } from '@angular/router';
import { DynamicreportService } from '../../Services/dynamicreport.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-dynamic-configuration-view',
  templateUrl: './dynamic-configuration-view.component.html',
  styleUrls: ['./dynamic-configuration-view.component.scss']
})
export class DynamicConfigurationViewComponent implements OnInit {
  user: any;
  list: any = [];
  showPegi: boolean;
  currentPage: any;
  pageElement: any;
  totalcount: any = 0;
  txtsearchDate: any;




  constructor(public headerService: HeaderService,
    public route: Router,
    private service: DynamicreportService,private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle("Dynamic Configuration Report");
    this.user = this.sessionService.decryptSessionData("user");
    this.getlist();
  }

  getlist() {
    this.service.getdynamicconfigurationlist().subscribe((data: any) => {
      console.log(data);
      this.list = data;
      this.totalcount = this.list.length;
      if (this.totalcount > 0) {
        this.showPegi = true
        this.currentPage = 1
        this.pageElement = 100
      } else {
        this.showPegi = false
      }
    })
  }

  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }

  edit(item: any) {
    let navigationExtras: NavigationExtras = {
      state: {
        id: item.slno,
      }
    };
    this.route.navigate(['application/dynamicconfigurationadd'], navigationExtras);
  }

}
