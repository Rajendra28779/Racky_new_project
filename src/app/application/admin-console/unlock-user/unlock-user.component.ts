import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../header.service';
import { UnlockUserService } from '../../Services/unlock-user.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-unlock-user',
  templateUrl: './unlock-user.component.html',
  styleUrls: ['./unlock-user.component.scss'],
})
export class UnlockUserComponent implements OnInit {
  lockedUserList: any = [];
  searchData: any;
  currentPage: any;
  pageElement: any;
  showPagination: boolean;
  user: any;

  constructor(
    private headerService: HeaderService,
    private unlockUserService: UnlockUserService,
    private router: Router,
    private sessionService: SessionStorageService
  ) {}

  ngOnInit(): void {
    this.pageAccess();
  }

  pageAccess() {
    this.user = this.sessionService.decryptSessionData('user');
    if (this.user.groupId != 1) {
      this.router.navigate(['/unauthorize']).then((r) => this.removeSession());
    } else {
      this.headerService.setTitle('Unlock User');
      this.currentPage = 1;
      this.pageElement = 10;
      this.getLockedUserList();
    }
  }

  removeSession() {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('auth_token');
  }

  getLockedUserList() {
    this.unlockUserService.getLockedUserList().subscribe((data) => {
      this.lockedUserList = data;
      this.showPagination = this.lockedUserList.length > 0;
    });
  }

  unlockUser(userId: any) {
    this.unlockUserService.unlockUser(userId).subscribe((data) => {
      // console.log(data);
      if (JSON.parse(JSON.stringify(data)).status == 200) {
        Swal.fire({
          title: 'Success',
          text: JSON.parse(JSON.stringify(data)).message,
          icon: 'success',
        });
        this.lockedUserList = JSON.parse(JSON.stringify(data)).data;
      }
    });
  }

  pageItemChange(event: any) {
    this.pageElement = event.target.value;
    this.currentPage = 1;
  }
}
