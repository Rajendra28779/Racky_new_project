import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/services/jwt.service';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { ReportcountService } from '../../Services/reportcount.service';

@Component({
  selector: 'app-transactioncountdetals-reports',
  templateUrl: './transactioncountdetals-reports.component.html',
  styleUrls: ['./transactioncountdetals-reports.component.scss']
})
export class TransactioncountdetalsReportsComponent implements OnInit {
  token: any;
  eventName:any;
  claimCountDetails:any=[];
  showPegi:boolean;
  record:any;
  currentPage:any;
  pageElement:any;
  txtsearchDate:any;
  userId: any;
  years: string;
  months: string;
  days:string;
  constructor(public headerService:HeaderService,private reportcount:ReportcountService,public route:Router,private jwtService: JwtService) { }

  ngOnInit(): void {
   this.years= localStorage.getItem("years");
   this.months= localStorage.getItem("months");
   this.days= localStorage.getItem("days");
   this.eventName= localStorage.getItem("eventName");
   this.token=localStorage.getItem("token");
   this.userId=localStorage.getItem("userId");
   this.getTransCountDetails();
  }

  getTransCountDetails(){
    this.reportcount.getTransactionCountDetails(this.userId,this.years,this.months,this.days,this.eventName).subscribe((data:any)=>{
      console.log(data);
      this.claimCountDetails=data;
      this.record=this.claimCountDetails.length;
      if(this.record>0){
        this.showPegi=true;
      }
      else{
        this.showPegi=false;
      }
      localStorage.removeItem("years");
      localStorage.removeItem("months");
      localStorage.removeItem("days");
      localStorage.removeItem("eventName");
      localStorage.removeItem("token");
      
    },(error) => {
      console.log(error);
      this.swal('', 'Something went wrong.', 'error');
    })
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  pageItemChange() {
    // this.ngOnInit();
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
    console.log(this.pageElement);
    // alert("Page Capcity Extended Upto " + this.pageElement);

  }
}
