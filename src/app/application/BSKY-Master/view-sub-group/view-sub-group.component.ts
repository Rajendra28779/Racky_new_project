import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { SubgroupserviceService } from '../../Services/subgroupservice.service';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';

@Component({
  selector: 'app-view-sub-group',
  templateUrl: './view-sub-group.component.html',
  styleUrls: ['./view-sub-group.component.scss']
})
export class ViewSubGroupComponent implements OnInit {
  subgrouplist:any
  currentPage:any;
  pageElement:any;
  showPegi:boolean;
  txtsearchDate:any;
  constructor(private subgroupservice:SubgroupserviceService,public route:Router,public headerService:HeaderService) { }

  ngOnInit(): void {
    this.headerService.setTitle('View Sub-Group');
    this.currentPage = 1;
    this.pageElement = 10;
    this.showPegi=true;
    this.getallsubgroup();
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
    // alert("Page Capcity Extended Upto " + this.pageElement);
  }

  //For Get Subgrouplist
  getallsubgroup(){
    this.subgroupservice.getallsubgroup().subscribe(data=>{
      this.subgrouplist=data;

    });
  }
  edit(item:any){
    let navigationExtras: NavigationExtras = {
      state: {
        user: item
      }
    };
    this.route.navigate(['application/userSubGroup'], navigationExtras);
// this.route.navigate(['/application/subgroup/'+item]);
  }
  delete(item:any){
    Swal.fire({
      title: 'Are you sure?',
      // text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.subgroupservice.delete(item).subscribe(data=>{
          if (data == 1) {
            this.swal("Deleted!","Record has been Inactivate", "success");
          }else if(data ==""){
            this.swal("Error","Some error happen", "error");
          }
          this.getallsubgroup();
        });
      }
    })

  }

}
