import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderService } from '../application/header.service';
import { AdminconsoleService } from '../application/Services/adminconsole.service';
import { DcCdmomappingService } from '../application/Services/dc-cdmomapping.service';
import { EncryptionService } from '../services/encryption.service';
import { SessionStorageService } from '../services/session-storage.service';


@Component({
  selector: 'app-mobileattendanceuserconfiguration',
  templateUrl: './mobileattendanceuserconfiguration.component.html',
  styleUrls: ['./mobileattendanceuserconfiguration.component.scss']
})
export class MobileattendanceuserconfigurationComponent implements OnInit {
  @ViewChild('auto') auto;
  user:any;
  groupList:any;
  userlist:any=[];
  userId:any='';
  userdetails:any;
  showuser:any=false;
  keyword: any = 'fullName';
  configgrouplist: any = [];
  selecteditemlist:any=[]

  constructor(private route: Router,
    public headerService: HeaderService,
    private adminService: AdminconsoleService,
    private encryptionService: EncryptionService,
    private sessionService: SessionStorageService,
    private dcService: DcCdmomappingService) { }

  ngOnInit(): void {
    this.user = this.sessionService.decryptSessionData("user");
    this.headerService.setTitle('User Mobile Attendance Configuration');
    this.getGroupList();
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

  selectEvent(item) {
    this.userId = item.userId;
    this.userdetails=item;
    this.showuser=true;
    this.getconfiggroupdata();
    this.selecteditemlist=[];
  }

  clearEvent() {
    this.userId = '';
    this.showuser=false;
    this.selecteditemlist=[];
  }

  getconfiggroupdata(){
    this.dcService.getconfiggroupdata(this.userId).subscribe((data:any) => {
      if(data.status==200){
        this.configgrouplist=data.data;
      } else {
        this.swal('Error','Something Went Wrong','error');
      }
    });
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  getuserDetailsbygroup(groupid:any) {
    this.clearEvent();
    this.dcService.getuserDetailsbygroup(groupid).subscribe(
      (response:any) => {
        this.userlist = response.data;
      },
      (error) => console.log(error)
    )
  }

  selectitem(item:any){
    for(let element of this.configgrouplist){
      if(element.groupid==item.groupid){
        element.tempstatus=element.status==0?1:0
      }
    }
    let obj={
      userid:this.userId,
      createby:this.user.userId,
      groupid:item.groupid,
      statusflag:item.status==0?1:0
    }

    let stat: boolean = false;
    for (const i of this.selecteditemlist) {
      if (i.groupid == item.groupid) {
        stat = true;
      }
    }
    if (stat == false) {
      this.selecteditemlist.push(obj);
    }else{
      for (const element of this.selecteditemlist) {
        if (item.groupid == element.groupid) {
          let index = this.selecteditemlist.indexOf(element);
          if (index !== -1) {
            this.selecteditemlist.splice(index, 1);
          }
        }
      }
    }
  }

  Submit(){
    if(this.selecteditemlist.length==0){
      this.swal("Info","Please select Atleast one","info")
      return;
    }

    Swal.fire({
      title: 'Are You Sure?',
      text: "You Want To Save This Data!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,Submit It!'
    }).then((result) => {
      if (result.isConfirmed) {
          let object={
            selectedlist:this.selecteditemlist,
          }
          this.dcService.saveusermobileconfig(object).subscribe((data:any)=>{
            if(data.status==200){
              this.swal("Success","Mobile User Attendance Configuration Successful","success");
              this.clearEvent();
              $('#groupId').val('');
              this.auto.clear();
            }else{
              this.swal("Error","Something Went Wrong","error");
            }
          });
      }
    });
  }

  resetVal(){
    window.location.reload();
  }

}
