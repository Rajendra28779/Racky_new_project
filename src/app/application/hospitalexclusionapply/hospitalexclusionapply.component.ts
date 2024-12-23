import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { HeaderService } from '../header.service';
import { ConfigurationService } from '../Services/configuration.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-hospitalexclusionapply',
  templateUrl: './hospitalexclusionapply.component.html',
  styleUrls: ['./hospitalexclusionapply.component.scss']
})
export class HospitalexclusionapplyComponent implements OnInit {
  user:any;
  list:any=[];
  txtsearchDate:any;
  showPegi: boolean;
  currentPage: any;
  pageElement: any;
  totalcount:any=0;
  name:any;

  constructor(public headerService: HeaderService,public config:ConfigurationService,private sessionService: SessionStorageService
    ) { }

  ngOnInit(): void {
    this.headerService.setTitle("CPD Configuration Apply");
    this.user = this.sessionService.decryptSessionData("user");
    this.name=this.user.fullName;
    this.gettaggedhospitalofcpd();
  }

  gettaggedhospitalofcpd(){
    let userid=this.user.userId;
      this.config.gettaggedhospitalofcpd(userid).subscribe((data:any)=>{
        // console.log(data);
        this.list=data;
        this.totalcount=this.list.length;
        if(this.totalcount>0){
          this.showPegi=true;
          this.currentPage=1;
          this.pageElement=20;
        }else{
          this.showPegi=false;
        }
      },
      (error) => console.log(error)
      )
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  onaction(item:any){
    Swal.fire({
      title: 'Are you sure?',
      text: "You Want Apply For Exclusion !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Save it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.config.applyforexclusion(item.hospital?.hospitalCode,item.bskyuserid).subscribe((data:any)=>{
          if(data.status==200){
            this.swal("Success", data.message, "success");
            this.gettaggedhospitalofcpd();
          }else{
            this.swal("Error", data.message, "error");
          }
        },
          (error) => console.log(error)
          );      }
    });
  }
}
