import { Component, OnInit, ViewChild } from '@angular/core';
import { HeaderService } from '../../header.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { AdminconsoleService } from '../../Services/adminconsole.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

declare let $: any;

@Component({
  selector: 'app-user-menu-mapping',
  templateUrl: './user-menu-mapping.component.html',
  styleUrls: ['./user-menu-mapping.component.scss'],
})
export class UserMenuMappingComponent implements OnInit {
  @ViewChild('auto') auto;
  @ViewChild('autocopy') autocopy;

  userList: any = [];
  globalLinks: any = [];
  primaryLinks: any = [];
  selected: any = [];
  copyList: any = [];
  visibleIndices = new Set<number>();
  loginpageForm!: FormGroup;
  userId: any;
  fullname: any;
  fullnamecopy: any;
  keyword = 'fullname';
  childmessage: any;
  curruser: any;

  constructor(
    public fb: FormBuilder,
    private adminService: AdminconsoleService,
    public headerService: HeaderService,
    public route: Router,
    private sessionService: SessionStorageService
  ) {}

  ngOnInit(): void {
    this.headerService.setTitle('User Menu Mapping');
    this.headerService.isIndicate(false);
    this.headerService.isBack(true);
    this.getUserList();
    this.getGlobalLinks(this.userId);

    this.loginpageForm = this.fb.group({
      userId: new FormControl(''),
      fullname: new FormControl(''),
      createdby: new FormControl(''),
      fullnamecopy: new FormControl(''),
      primaryLinks: new FormControl(''),
    });
  }

  getUserList() {
    this.adminService.getUserList().subscribe(
      (response) => {
        this.userList = response;
      },
      (error) => console.log(error)
    );
  }

  getGlobalLinks(userId: any) {
    this.globalLinks = [];
    if (
      userId == null ||
      userId == '' ||
      userId == undefined ||
      userId == 'undefined'
    ) {
      this.userId = 0;
    }
    this.adminService.getGlobalLinks(userId).subscribe(
      (response) => {
        this.globalLinks = response;
        for (var i = 0; i < this.globalLinks.length; i++) {
          var gl = this.globalLinks[i];
          this.visibleIndices.delete(gl.globalLinkId);
          for (var j = 0; j < gl.pLinks.length; j++) {
            var pl = gl.pLinks[j];
            var stat = pl.status;
            if (stat == true) {
              this.visibleIndices.add(pl.globalLinkId);
              break;
            }
          }
          for (var k = 0; k < gl.pLinks.length; k++) {
            var pl = gl.pLinks[k];
            var stat = pl.status;
            if (stat == false) {
              gl.checkstat = false;
              break;
            }
          }
        }
      },
      (error) => console.log(error)
    );
  }

  onSubmit() {
    if (this.userId == null || this.userId == '' || this.userId == undefined) {
      this.swal('Error', 'Please Select Username', 'error');
      return;
    }
    this.selected = [];
    for (var i = 0; i < this.globalLinks.length; i++) {
      var lnk = this.globalLinks[i].pLinks;
      var t = lnk.filter((opt: any) => opt.status).map((opt: any) => opt);
      for (var j = 0; j < t.length; j++) {
        this.selected.push(t[j]);
      }
    }
    if (
      this.selected == null ||
      this.selected.length == 0 ||
      this.selected == undefined ||
      this.selected == ''
    ) {
      this.swal('Error', 'Please Select Any Primary Link', 'error');
      return;
    }
    this.curruser = this.sessionService.decryptSessionData('user');
    var createby = this.curruser.userId;
    Swal.fire({
      title: 'Are You Sure?',
      text: 'You Want To Save This Data?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,Save It!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loginpageForm.value.primaryLinks = this.selected;
        this.loginpageForm.value.userId = this.userId;
        this.loginpageForm.value.createdby = createby;
        this.adminService
          .setPrimaryLinks(this.loginpageForm.value)
          .subscribe((data) => {
            if (data.status == 'Success') {
              this.swal('Success', data.message, 'success');
              this.userId = '';
              this.fullname = '';
              this.fullnamecopy = '';
              this.getGlobalLinks(this.userId);
              this.auto.clear();
              this.autocopy.clear();
              this.route.navigate(['/application/userMenuMapping']);
            } else if (data.status == 'Failed') {
              this.swal('Error', data.message, 'error');
            }
          });
      }
    });
  }

  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }

  show(id) {
    //alert(id);
    if (!this.visibleIndices.delete(id)) {
      this.visibleIndices.add(id);
    }
  }

  call(gl) {
    for (var j = 0; j < gl.pLinks.length; j++) {
      var pl = gl.pLinks[j];
      pl.status = !gl.checkstat;
    }
  }

  selectEvent(item) {
    this.userId = item.userId;
    this.fullname = item.fullname;
    this.getGlobalLinks(item.userId);
  }

  selectCopyEvent(item) {
    // do something with selected item
    this.fullnamecopy = item.fullname;
    this.adminService.getGlobalLinks(item.userId).subscribe((data) => {
      this.copyList = data;
      for (var c = 0; c < this.globalLinks.length; c++) {
        var pls = this.globalLinks[c].pLinks;
        for (var o = 0; o < pls.length; o++) {
          var pl = pls[o];
          if (pl.status == false) {
            pl.status = this.copyList[c].pLinks[o].status;
          }
        }
        for (var o = 0; o < pls.length; o++) {
          var pl = pls[o];
          if (pl.status == true) {
            this.visibleIndices.add(pl.globalLinkId);
            break;
          }
        }
      }
      for (var c = 0; c < this.globalLinks.length; c++) {
        var pls = this.globalLinks[c].pLinks;
        for (var o = 0; o < pls.length; o++) {
          var pl = pls[o];
          if (pl.status == true) {
            this.globalLinks[c].checkstat = true;
          } else {
            this.globalLinks[c].checkstat = false;
            break;
          }
        }
      }
    });
  }

  changeStat(lnk) {
    lnk.status = !lnk.status;
    //alert(lnk.status);
    for (var a = 0; a < this.globalLinks.length; a++) {
      var gl = this.globalLinks[a];
      if (gl.globalLinkId == lnk.globalLinkId) {
        for (var b = 0; b < gl.pLinks.length; b++) {
          var pl = gl.pLinks[b];
          if (pl.status == false) {
            gl.checkstat = false;
            break;
          } else {
            gl.checkstat = true;
          }
        }
      }
    }
  }

  onReset() {
    this.userId = '';
    this.fullname = '';
    this.getGlobalLinks(this.userId);
  }

  onCopyReset() {
    this.fullnamecopy = '';
  }

  swal(title, text, icon) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
}
