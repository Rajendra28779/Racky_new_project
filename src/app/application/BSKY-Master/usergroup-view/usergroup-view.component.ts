import { Component, OnInit } from '@angular/core';
import { GroupService } from '../../Services/group.service';
import { FormGroup, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { NavigationExtras, Router } from '@angular/router';
import { HeaderService } from '../../header.service';


@Component({
  selector: 'app-usergroup-view',
  templateUrl: './usergroup-view.component.html',
  styleUrls: ['./usergroup-view.component.scss']
})
export class UsergroupViewComponent implements OnInit {

  updateGroup = new FormGroup({
    groupName: new FormControl(''),

  });

  record: any;
  currentPage: any;
  pageElement: any;
  showPegi: boolean;
  txtsearchDate: any;
  constructor(private groupservice: GroupService, private route: Router, public headerService: HeaderService) { }
  groupData: any = [];
  ngOnInit(): void {
    this.headerService.setTitle("View Group");
    this.currentPage = 1;
    this.pageElement = 10;
    this.getGroupdetails();
  }

  delete(item: any) {
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.groupservice.delete(item.groupId).subscribe(
          (resp: any) => {
            if (resp == 1) {
              Swal.fire(
                'Deleted!',
                'Record has been Inactivate.',
                'success'
              )
            }
            this.getGroupdetails();
          },
          (err: any) => {
          }
        )

      }
    })
  }

  getGroupdetails() {
    this.groupservice.getGroupData().subscribe((alldata) => {
      this.groupData = alldata;
      this.record = this.groupData.length;
      if (this.record > 0) {
        this.showPegi = true;
      }
      else {
        this.showPegi = false;
      }
    })
  }

  edit(item: any) {
    let objToSend: NavigationExtras = {
      state: {
        groupId: item
      }
    };
    this.route.navigate(['/application/userGroup'], objToSend);
  }

  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });

  }

}
