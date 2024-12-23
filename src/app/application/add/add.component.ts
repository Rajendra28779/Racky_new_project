import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { UtiliteComponent } from '../shared/utilite/utilite.component';
// import { IDropdownSettings, } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  message: any;
dropdownlist:any;
// dropdownSettings:IDropdownSettings={};
  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe( params => console.log(params) );
  }

  ngOnInit(): void {

    this.dropdownlist=[
      { item_id: 1, item_text: 'select1' },
      { item_id: 2, item_text: 'select2' },
      { item_id: 3, item_text: 'select3' },
      { item_id: 4, item_text: 'select4' },
      { item_id: 5, item_text: 'select5' },
      { item_id: 1, item_text: 'select6' },
      { item_id: 2, item_text: 'select7' },
      { item_id: 3, item_text: 'select8' },
      { item_id: 4, item_text: 'select9' },
      { item_id: 5, item_text: 'select10' }


    ];
    // this.dropdownSettings = {
    //   idField: 'item_id',
    //   textField: 'item_text',
    // };
  }



  getResponseFromUtil(parentData: any) {
    this.message = parentData;
  }

  save(){
    Swal.fire({
      title: 'Are you sure?',
      // text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Save it!'
    }).then((result) => {
      if (result.isConfirmed) {

      }
    })
  }

}
