import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { FunctionmasterserviceService } from '../../Services/functionmasterservice.service';
import { GloballinkserviceService } from '../../Services/globallinkservice.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-viewgllink',
  templateUrl: './viewgllink.component.html',
  styleUrls: ['./viewgllink.component.scss'],
})
export class ViewgllinkComponent implements OnInit {
  childmessage: any;

  txtsearchDate: any;
  showPegi: any;
  pageElement: any;
  currentPage: any;
  gllinklist: any;
  user: any;
  dataa: any;
  countgllist: any;
  constructor(
    private route: Router,
    public headerService: HeaderService,
    public globallinkservice: GloballinkserviceService,
    private sessionService: SessionStorageService
  ) {}

  ngOnInit(): void {
    this.headerService.setTitle('View-Global-Link');
    this.user = this.sessionService.decryptSessionData('user');
    this.getallgloballink();
    this.currentPage = 1;
    this.pageElement = 20;
    this.showPegi = true;
  }

  getallgloballink() {
    this.globallinkservice.getalldata().subscribe((data) => {
      this.gllinklist = data;
      this.countgllist = this.gllinklist.length;
    });
  }

  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
  delete(item: any) {
    Swal.fire({
      title: 'Are you sure?',
      // text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Save it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.globallinkservice.delete(item).subscribe((data) => {
          // console.log(data)
          this.dataa = data;
          if (this.dataa.status == 'Success') {
            this.swal('Success', this.dataa.message, 'success');
            this.getallgloballink();
          } else if (this.dataa.status == 'Failed') {
            this.swal('Error', this.dataa.message, 'error');
          }
        });
      }
    });
  }
  edit(item: any) {
    let navigationExtras: NavigationExtras = {
      state: {
        user: item,
      },
    };
    this.route.navigate(['application/globallink'], navigationExtras);
    // this.route.navigate(['/application/subgroup/'+item]);
  }

  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }
  pageItemChange() {
    this.pageElement = (<HTMLInputElement>(
      document.getElementById('pageItem')
    )).value;
  }
}
