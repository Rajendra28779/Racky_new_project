import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { DcCdmomappingService } from '../../Services/dc-cdmomapping.service';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';

@Component({
  selector: 'app-allowfohospitalattedance',
  templateUrl: './allowfohospitalattedance.component.html',
  styleUrls: ['./allowfohospitalattedance.component.scss']
})
export class AllowfohospitalattedanceComponent implements OnInit {
  user:any;
  allowlist:any[];
  showPegi:any=false;
  pageElement:any;
  currentPage:any;
  count:any=0;
  txtsearchDate:any;

  constructor(private dcService: DcCdmomappingService,
    private sessionService: SessionStorageService,
    public headerService: HeaderService,private snoService: SnocreateserviceService,
    private route:Router) {}

  ngOnInit(): void {
    this.headerService.setTitle('Allow For Hopsitl Visit And Attendance');
    this.user =  this.sessionService.decryptSessionData("user");
    this.getlist();
  }

  swal(title, text, icon) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  getlist(){
    this.dcService.allowhospitalmobileactivitylist().subscribe(
      (response:any) => {
        if(response.status==200){
          this.allowlist = response.data;
          if(this.allowlist.length>0){
            this.showPegi=true;
            this.currentPage=1;
            this.pageElement=50;
          }else{
            this.showPegi=false;
          }
        }else{
          this.swal("Error", "Something Went Wrong", 'error');
        }
      },
      (error) => console.log(error)
    )
  }

  stat:any=false;
  selectitem(item:any,no:any){
    this.stat=true;
    for(let element of this.allowlist){
      if(element.groupid==item.groupid){
        if(no==1){
          element.visitstatus=element.visitstatus==0?1:0
        }else{
          element.attendancestatus=element.attendancestatus==0?1:0
        }
        element.createby=this.user.userId
      }
    }
  }

  onReset(){
    this.getlist();
  }

  submit(){
    if(!this.stat){
      this.swal("Warning", "Plesae Check One !", 'warning');
      return;
    }

    Swal.fire({
      title: 'Are You Sure?',
      text: "You Want To Update !",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,Update It!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.dcService.allowhospitalmobileactivity(this.allowlist).subscribe(
          (response:any) => {
            if(response.status==200){
              this.swal("Success", "Record Updated Successfully.", 'success');
              this.getlist();
            }else{
              this.swal("Error", "Something Went Wrong.", 'error');
            }
          },
          (error) => console.log(error)
        )
      }
    });
  }

}
