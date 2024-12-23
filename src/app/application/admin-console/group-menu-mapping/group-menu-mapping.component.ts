import { Component, OnInit, ViewChild } from '@angular/core';
import { HeaderService } from '../../header.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { AdminconsoleService } from '../../Services/adminconsole.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

declare let $: any;

@Component({
  selector: 'app-group-menu-mapping',
  templateUrl: './group-menu-mapping.component.html',
  styleUrls: ['./group-menu-mapping.component.scss'],
})
export class GroupMenuMappingComponent implements OnInit {
  @ViewChild('autocopy') autocopy;

  userList: any = [];
  groupList: any = [];
  globalLinks: any = [];
  primaryLinks: any = [];
  selected: any = [];
  copyList: any = [];
  visibleIndices = new Set<number>();
  loginpageForm!: FormGroup;
  //userId: any;
  groupId: any;
  //fullname: any;
  fullnamecopy: any;
  keyword = 'fullname';
  childmessage: any;
  curruser: any;

  constructor(
    public fb: FormBuilder,
    private adminService: AdminconsoleService,
    public headerService: HeaderService,
    public route: Router,
    private encryptionService: EncryptionService,
    private sessionService: SessionStorageService
  ) {}

  ngOnInit(): void {
    this.headerService.setTitle('Group Menu Mapping');
    this.headerService.isIndicate(false);
    this.headerService.isBack(true);
    this.getUserList();
    this.getGroupList();
    this.getGlobalLinks();

    this.loginpageForm = this.fb.group({
      groupId: new FormControl(''),
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

  getGroupList() {
    this.adminService.getGroupList().subscribe(
      (response: any) => {
        response = this.encryptionService.getDecryptedData(response);
        this.groupList = response.data;
      },
      (error) => console.log(error)
    );
  }

  getGlobalLinks() {
    this.globalLinks = [];
    var userId;
    this.adminService.getGlobalLinks(userId).subscribe(
      (response) => {
        this.globalLinks = response;
        for (var i = 0; i < this.globalLinks.length; i++) {
          var gl = this.globalLinks[i];
          this.visibleIndices.delete(gl.globalLinkId);
          for (var j = 0; j < gl.pLinks.length; j++) {
            var pl = gl.pLinks[j];
            var stat = pl.status;
            //alert(pl.status);
            if (stat == true) {
              //alert(stat);
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
    let groupId = $('#groupId').val();
    if (groupId == null || groupId == '' || groupId == undefined) {
      this.swal('Info', 'Please Select Group', 'info');
      return;
    }
    if (
      this.fullnamecopy == null ||
      this.fullnamecopy == '' ||
      this.fullnamecopy == undefined
    ) {
      this.swal('Info', 'Please Select User To Copy From', 'info');
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
      this.swal('Info', 'Please Select Any Primary Link', 'info');
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
        this.loginpageForm.value.groupId = groupId;
        this.loginpageForm.value.createdby = createby;
        this.adminService
          .setPrimaryLinksForGroup(this.loginpageForm.value)
          .subscribe((data) => {
            if (data.status == 'Success') {
              this.swal('Success', data.message, 'success');
              $('#groupId').val('');
              this.fullnamecopy = '';
              this.getGlobalLinks();
              this.autocopy.clear();
              this.route.navigate(['/application/groupMenuMapping']);
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

  selectCopyEvent(item) {
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
    let groupId = $('#groupId').val();
    if (groupId == '') {
      this.getGlobalLinks();
    }
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
