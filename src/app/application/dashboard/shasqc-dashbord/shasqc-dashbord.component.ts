import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../header.service';
import { HospitalService } from '../../Services/hospital.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';


@Component({
  selector: 'app-shasqc-dashbord',
  templateUrl: './shasqc-dashbord.component.html',
  styleUrls: ['./shasqc-dashbord.component.scss']
})
export class ShasqcDashbordComponent implements OnInit {
  mouexplist:any=[]
  hcexplist:any=[]
  show: boolean=false;
  show1: boolean=false;
  user:any;
  pageElement: any;
  currentPage: any;
  pageElement1: any;
  currentPage1: any;
  record: any;
  record1:any;

  constructor(public headerService: HeaderService, private hospitaService: HospitalService, private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle('Dashboard');
    this.user = this.sessionService.decryptSessionData("user");
    this.getmouexplist();
    this.gethcexplist();
  }
  getmouexplist(){
    this.hospitaService.getmouexplist().subscribe((data)=>{
      console.log(data);
      this.mouexplist=data;
      this.record=this.mouexplist.length;
      if(this.mouexplist.length>0){
        this.show=true;
      }
    })
  }
  gethcexplist(){
    this.hospitaService.gethcexplist().subscribe((data)=>{
      console.log(data);
      this.hcexplist=data;
      this.record1=this.hcexplist.length;
      if(this.hcexplist.length>0){
        this.show1=true;
      }
    })
  }



  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
    console.log(this.pageElement);

   }


  closemodeal(){
    this.show=false;
  }
  closemodeal1(){
    this.show1=false;
  }

}
