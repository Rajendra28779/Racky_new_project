import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../header.service';
import { LoginService } from 'src/app/services/shared-services/login.service';
import Swal from 'sweetalert2';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-query-builder',
  templateUrl: './query-builder.component.html',
  styleUrls: ['./query-builder.component.scss'],
})
export class QueryBuilderComponent implements OnInit {
  query: any;
  user:any;
  constructor(
    public headerService: HeaderService,
    private service: LoginService,
    private sessionService: SessionStorageService,
  ) {}

  ngOnInit(): void {
    this.headerService.setTitle('Query builder');
    // this.user = JSON.parse(sessionStorage.getItem('user'));
    this.user = this.sessionService.decryptSessionData("user"); 
    // this.query = "Select * from userdetails";
    // this.getDetails();
  }
  responseData: any;
  columnHead:any = [];
  columnDatas:any = [];
  dataCheck:boolean = false;
  getDetails() {
    if(this.query == null || this.query == undefined || this.query == "") {
      this.swal("", "Query can't be Blank.", "info");
      return;
    }
    let requestData = {
      message: this.query,
      userId:this.user.userId
    };
    this.service.queryDetails(requestData).subscribe(
      (response) => {
        console.log(response);
        this.responseData = response;
        if (this.responseData.status == 'success') {
          let queryData = this.responseData.data;
          this.columnHead = queryData.columnNames;
          this.columnDatas = queryData.columnData;
          if(this.columnHead.length > 0) {
            this.dataCheck = true;
          }
        } else {
          this.swal('', this.responseData.msg, 'error');
        }
      },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      }
    );
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
}
