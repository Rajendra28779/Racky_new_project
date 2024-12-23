import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { FunctionmasterserviceService } from '../../Services/functionmasterservice.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-viewfnmaster',
  templateUrl: './viewfnmaster.component.html',
  styleUrls: ['./viewfnmaster.component.scss'],
})
export class ViewfnmasterComponent implements OnInit {
  childmessage: any;
  user: any;
  dataa: any;
  countfunctionmaster: any;

  constructor(
    private route: Router,
    public headerService: HeaderService,
    public fnmservice: FunctionmasterserviceService,
    private sessionService: SessionStorageService
  ) {}

  functionmaster: any;
  txtsearchDate: any;
  showPegi: any;
  pageElement: any;
  currentPage: any;

  ngOnInit(): void {
    this.headerService.setTitle('View-Function-Master');
    this.user = this.sessionService.decryptSessionData('user');
    this.getallfnmaster();
    this.currentPage = 1;
    this.pageElement = 20;
    this.showPegi = true;
  }
  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }
  getallfnmaster() {
    this.fnmservice.getalldata().subscribe((data) => {
      this.functionmaster = data;
      this.countfunctionmaster = this.functionmaster.length;
    });
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
        this.fnmservice.delete(this.user.userId, item).subscribe((data) => {
          // console.log(data)
          this.dataa = data;
          if (this.dataa.status == 'Success') {
            this.swal('Success', this.dataa.message, 'success');
            this.getallfnmaster();
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
    this.route.navigate(['application/functionmaster'], navigationExtras);
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
