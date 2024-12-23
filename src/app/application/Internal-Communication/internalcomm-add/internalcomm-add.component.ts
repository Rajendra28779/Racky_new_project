import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { HeaderService } from '../../header.service';
import { InternalcommServiceService } from '../../Services/internalcomm-service.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-internalcomm-add',
  templateUrl: './internalcomm-add.component.html',
  styleUrls: ['./internalcomm-add.component.scss']
})
export class InternalcommAddComponent implements OnInit {
  public Editor = ClassicEditor;
  editorvalue: any;
  priority: any = "";
  fileToUpload?: File;
  fileToUpload2?: File;
  flag: any = false;
  documentType: any;
  user: any
  fullname
  intcommuserlist: any = [];
  dataa: any;
  maxChars = 240;

  constructor(public headerService: HeaderService, private route: Router, public intservice: InternalcommServiceService, private sessionService: SessionStorageService
  ) { }

  ngOnInit(): void {
    this.user = this.sessionService.decryptSessionData("user");
    this.headerService.setTitle("Internal Communication");
    this.fullname = this.user.fullName

    $('.selectpicker').selectpicker();

    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
      // endDate: '0d',
      minDate: new Date(),
      daysOfWeekDisabled: ['', 7],
    });
    $('.timepicker').datetimepicker({
      format: 'LT',
      daysOfWeekDisabled: ['', 7],
    });
    $('.datetimepicker').datetimepicker({
      format: 'YYYY-MM-DD LT',
      daysOfWeekDisabled: ['', 7],
    });
    var date = new Date();
    let month: any = date.getMonth();

    if (month == 0) {
      month = 'Jan';
    } else if (month == 1) {
      month = 'Feb';
    } else if (month == 2) {
      month = 'Mar';
    } else if (month == 3) {
      month = 'Apr';
    } else if (month == 4) {
      month = 'May';
    } else if (month == 5) {
      month = 'Jun';
    } else if (month == 6) {
      month = 'Jul';
    } else if (month == 7) {
      month = 'Aug';
    } else if (month == 8) {
      month = 'Sep';
    } else if (month == 9) {
      month = 'Oct';
    } else if (month == 10) {
      month = 'Nov';
    } else if (month == 11) {
      month = 'Dec';
    }

    // $('input[name="toDate"]').val('');
    $('input[name="toDate"]').attr('placeholder', 'To Date *');

    this.getintcommuserlist();
  }

  public model = {
    editorData: ""
  };
  public config = {
    placeholder: 'Type the content here!'
  }
  public onChange({ editor }: ChangeEvent) {
    this.editorvalue = editor.getData();

    console.log(this.editorvalue);
  }
  no2(event: any) {
    this.priority = event;
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  keyPress(event: KeyboardEvent) {
    const pattern = /^[A-Za-z0-9.,-_ \\s]+$/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

  getintcommuserlist() {
    this.intservice.getintcommuserlist().subscribe((data: any) => {
      console.log(data);
      this.intcommuserlist = data;
    },
      (error) => console.log(error)
    );

  }

  handleFileInput(event: any) {
    this.flag = false;
    this.fileToUpload2 = event.target.files[0];
    if (this.fileToUpload2 != null || this.fileToUpload2 != undefined) {
      console.log(Math.round(this.fileToUpload2.size / 1024));

      if (Math.round(this.fileToUpload2.size / 1024) >= 8192) {
        this.swal('Warning', ' Please Provide Document Size Less than 8MB', 'warning');
        $('#notficationdoc').val('');
        this.fileToUpload = event.target.files[0];
        this.flag = false;
      } else {
        this.fileToUpload = event.target.files[0];
        this.flag = true;
      }
      console.log(this.fileToUpload);
    } else {

    }
  }

  downloadfiletreatmentbill(event: any) {
    if (this.fileToUpload) {
      const file: File | null = this.fileToUpload;
      if (file) {
        this.documentType = file.type;
        const blob = new Blob([file], { type: this.documentType });
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      }
    } else {
      this.swal('Info', 'Please Select File', 'info');
    }
  }

  submit() {
    let whom = $('#towhom').val();
    let requestfor = $('#reqfor').val();
    let requiredby = $('#reqdby').val();
    if (whom == null || whom == "" || whom == undefined) {
      this.swal("Info", "Please Fill To Whom ", 'info');
      return;
    }
    if (requestfor == null || requestfor == "" || requestfor == undefined) {
      this.swal("Info", "Please Fill Request For", 'info');
      return;
    }
    if (requiredby == null || requiredby == "" || requiredby == undefined) {
      this.swal("Info", "Please Fill Required By", 'info');
      return;
    }
    if (this.editorvalue == null || this.editorvalue == "" || this.editorvalue == undefined) {
      this.swal("Info", "Please Fill Description", 'info');
      return;
    }
    if (this.editorvalue.length > 1000) {
      this.swal(this.editorvalue.length, "Too Long Description ", 'info');
      return;
    }
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
        this.intservice.saveintcomm(whom, requestfor, requiredby, this.user.userId, this.priority, this.fileToUpload, this.editorvalue).subscribe((data: any) => {
          console.log(data);
          this.dataa = data;
          if (this.dataa.status == 200) {
            this.swal("Success", this.dataa.message, "success");
            this.route.navigate(['/application/intcommview']);
          } else if (this.dataa.status == 400) {
            this.swal("Error", this.dataa.message, "error");
          }

        },
          (error) => console.log(error)
        );

      }
    })

  }
  reset() {
    window.location.reload();
  }


}
