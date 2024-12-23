import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { ForemarkService } from '../../Services/foremark.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-foremarkview',
  templateUrl: './foremarkview.component.html',
  styleUrls: ['./foremarkview.component.scss']
})
export class ForemarkviewComponent implements OnInit {
  childmessage: any;

  txtsearchDate:any;
  showPegi:any=false;
  pageElement:any;
  currentPage:any;
  list:any
  user: any;
  dataa: any;
  countgllist: any;
  constructor(private route:Router,public headerService:HeaderService,public foremarkservice:ForemarkService, private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle('View-FO Remark');
    this.user = this.sessionService.decryptSessionData("user");
    this.getallgloballink();
  }

  getallgloballink(){
    this.foremarkservice.getalldata().subscribe(data=>{
      // console.log(data)
      this.list=data;
      this.countgllist=this.list.length
        if(this.countgllist>0){
          this.currentPage = 1;
          this.pageElement = 20;
          this.showPegi=true;
        }else{
          this.showPegi=false;
        }
    });
  }

  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  edit(item:any){
    let navigationExtras: NavigationExtras = {
      state: {
        user: item
      }
    };
    this.route.navigate(['application/foremark'], navigationExtras);
  }

  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }
}
