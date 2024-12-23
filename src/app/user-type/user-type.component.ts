import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-type',
  templateUrl: './user-type.component.html',
  styleUrls: ['./user-type.component.scss']
})
export class UserTypeComponent implements OnInit {
  show=0;
  constructor(    public router: Router,
    ) { }

  ngOnInit(): void {

    // utility show
  //   this.header.isIndicate(false);
  //   this.header.isPrint(false);
  //   this.header.isDelete(true);
  //   this.header.isDownload(true);
  //   this.header.isBack(false);
  // }

  }
  
  onclickEvent(){
    var user =$('#user').val();
    if(user == "CPD"){
      this.show=1;
      this.router.navigate(['/application/createcpd']);
    }else if(user == "SNO"){
      this.show=2;
     this.router.navigate(['/application/createsno']);
    }else{
      if(user == "default"){
        // this.swal('', 'Please Select UserType', 'error');
      }
    }
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

}
