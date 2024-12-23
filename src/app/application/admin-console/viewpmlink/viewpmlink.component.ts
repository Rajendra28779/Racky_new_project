import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { PrimarylinkserviceService } from '../../Services/primarylinkservice.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-viewpmlink',
  templateUrl: './viewpmlink.component.html',
  styleUrls: ['./viewpmlink.component.scss'],
})
export class ViewpmlinkComponent implements OnInit {
  childmessage: any;
  txtsearchDate: any;
  showPegi: any;
  pageElement: any;
  currentPage: any;
  pmlinklist: any;
  pmlinklist2: any;
  user: any;
  dataa: any;
  countpmlist: any;
  globalist: any;
  functionlist: any;
  group = new FormGroup({
    primary: new FormControl(''),
    globalLinkId: new FormControl(''),
    functionId: new FormControl(''),
  });
  show: any;

  constructor(
    private route: Router,
    public headerService: HeaderService,
    private pmservice: PrimarylinkserviceService,
    private sessionService: SessionStorageService
  ) {}

  ngOnInit(): void {
    this.headerService.setTitle('View-primary-Link');
    this.user = this.sessionService.decryptSessionData('user');
    this.getallpmlink();

    this.getallpmlink();
    this.gllist();
  }
  fnlist() {
    this.pmservice.getfnlist().subscribe((data) => {
      this.functionlist = data;
    });
  }
  getpmlink(id) {
    if (id == '') {
      this.getallpmlink();
    }
    this.pmservice.getrespmlist(id).subscribe((data) => {
      this.pmlinklist2 = data;
    });
  }
  gllist() {
    this.pmservice.getgllist().subscribe((data) => {
      this.globalist = data;
    });
  }

  getallpmlink() {
    this.pmservice.getalldata().subscribe((data) => {
      this.pmlinklist = data;
      this.countpmlist = this.pmlinklist.length;
      if (this.countpmlist > 0) {
        this.currentPage = 1;
        this.pageElement = 50;
        this.showPegi = true;
      } else {
        this.showPegi = false;
      }
    });
  }
  delete(item: any) {
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Save it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.pmservice.delete(item).subscribe((data) => {
          this.dataa = data;
          if (this.dataa.status == 'Success') {
            this.swal('Success', this.dataa.message, 'success');
            this.getallpmlink();
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
    this.route.navigate(['application/primarylink'], navigationExtras);
  }

  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }

  submit() {
    var gid = $('#global').val();
    var pid = $('#primary').val();
    this.group.value.primary = pid;
    if (this.group.value.globalLinkId == '') {
      this.swal('Info', 'Please Fill Global Name', 'info');
      return;
    }
    this.pmservice.filter(this.group.value).subscribe((data) => {
      this.pmlinklist = data;
      this.countpmlist = this.pmlinklist.length;
      if (this.countpmlist > 0) {
        this.currentPage = 1;
        this.pageElement = 50;
        this.showPegi = true;
      } else {
        this.showPegi = false;
      }
    });
  }
  reset() {
    //  this.group.reset();
    // this.getallpmlink();
    window.location.reload();
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
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
