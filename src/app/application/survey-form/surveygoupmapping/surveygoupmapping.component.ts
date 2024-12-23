import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { SurverconfurationService } from '../../Services/surverconfuration.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-surveygoupmapping',
  templateUrl: './surveygoupmapping.component.html',
  styleUrls: ['./surveygoupmapping.component.scss']
})
export class SurveygoupmappingComponent implements OnInit {
  user:any;
  surveylist:any=[];
  grouplist:any=[];
  grouplistbkp:any=[];
  keyword: any = 'surveyName';
  surveyid:any="";
  showgroup:boolean=false;
  @ViewChild('auto') auto;
  checkall:any=false;

  constructor(public headerService: HeaderService,private route:Router,
    private surveyserv:SurverconfurationService,private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.user = this.sessionService.decryptSessionData("user");
    this.headerService.setTitle("Survey Group Mapping");
    this.getactivesurveylist();
  }
  getactivesurveylist(){
    this.surveyserv.getactivesurveylist(0).subscribe((data:any) => {
      if(data.status==200){
        this.surveylist=data.data;
      }else{
        this.surveylist=[];
        this.swal("Error", "Something Went Wrong", "error");
      }
    });
  }

  selectEvent(item) {
    this.surveyid = item.surveyId;
    this.getgrouplist();
    this.showgroup=true;
    this.selectlist=[];
  }
  onReset() {
    this.surveyid = "";
    this.grouplist=[];
    this.showgroup=false;
    this.selectlist=[];
  }

  getgrouplist(){
    this.grouplist=[];
    this.surveyserv.getgrouplist(this.surveyid).subscribe((data:any) => {
      if(data.status==200){
        this.grouplist=data.data;
        this.grouplistbkp=data.data;
        this.checkall=data.checkall;
      }else{
        this.grouplist=[];
        this.swal("Error", "Something Went Wrong", "error");
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

  selectlist: any = [];
  group: any;
  selectitem(item: any){
    // for (let i = 0; i < this.grouplist.length; i++) {
    //   if (this.grouplist[i].typeId == item.typeId) {
    //     this.grouplist[i].status = this.grouplist[i].status == 0 ? 1 : 0;
    //   }
    // }

    this.group = {
      id: '',
      status: 0,
    }

    this.group.id = item.typeId;
    this.group.status = item.status == 0 ? 1 : 0;

    let stat = false;
    for (const i of this.selectlist) {
      if (i.id == this.group.id) {
        stat = true;
      }
    }
    if (stat == false) {
      this.selectlist.push(this.group);
    } else {
      for (var i = 0; i < this.selectlist.length; i++) {
        if (item.typeId == this.selectlist[i].id) {
          var index = this.selectlist.indexOf(this.selectlist[i]);
          if (index !== -1) {
            this.selectlist.splice(index, 1);
          }
        }
      }
    }
  }

  allselectitem(){
    this.grouplist=this.grouplistbkp;
    this.selectlist=[];
    let status;
    if(this.checkall){
      status=1;
    }else{
      status=0;
    }

    for (let i = 0; i < this.grouplist.length; i++) {
      let item=this.grouplist[i];
      this.grouplist[i].status = status;

      this.group = {
        id: '',
        status: 0,
      }

      this.group.id = item.typeId;
      this.group.status = status;

      let stat = false;
      for (const i of this.selectlist) {
        if (i.id == this.group.id) {
          stat = true;
        }
      }
      if (stat == false) {
        this.selectlist.push(this.group);
      } else {
        for (var j = 0; j < this.selectlist.length; j++) {
          if (item.typeId == this.selectlist[j].id) {
            var index = this.selectlist.indexOf(this.selectlist[j]);
            if (index !== -1) {
              this.selectlist.splice(index, 1);
            }
          }
        }
      }
    }
    this.checkall=!this.checkall;
  }

  submit(){
    if (this.surveyid == null || this.surveyid == "" || this.surveyid == undefined) {
      this.swal("Info", "Please select Survey Name", 'info');
      return;
    }
    if (this.selectlist.length == 0) {
      this.swal("Info", "Please select at least One Specialist", 'info');
      return;
    }
    Swal.fire({
      title: 'Are You Sure?',
      text: "You Want To Save This!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,Save It!'
    }).then((result) => {
      if (result.isConfirmed) {
        let object = {
          surveyid: this.surveyid,
          selectlist: this.selectlist,
          createdby: this.user.userId
        }
        this.surveyserv.savegroupmapping(object).subscribe((data:any) => {
          if(data.status==200){
            this.swal("Success", data.message, "success");
            this.getactivesurveylist();
            this.onReset();
            this.auto.clear();
            this.route.navigate(['/application/viewsurveygroupmapping']);
          }else{
            this.swal("Error", "Something Went Wrong", "error");
          }
        });
      }
    });
  }

  Reset(){
    window.location.reload();
  }

}
