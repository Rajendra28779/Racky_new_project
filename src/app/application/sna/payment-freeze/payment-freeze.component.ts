import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../header.service';
import Swal from 'sweetalert2';
import { SnoCLaimDetailsService } from '../../Services/sno-claim-details.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-payment-freeze',
  templateUrl: './payment-freeze.component.html',
  styleUrls: ['./payment-freeze.component.scss'],
})
export class PaymentFreezeComponentUpdate implements OnInit {
  selectFile: File;
  user: any;

  constructor(
    public headerService: HeaderService,
    public snoService: SnoCLaimDetailsService,
    private sessionService: SessionStorageService
  ) {}

  ngOnInit(): void {
    this.headerService.setTitle('Payment freeze');
    this.user = this.sessionService.decryptSessionData("user");
  }
  selectedFile(event) {
    // this.selectFile = event.target.files;
    let documentFile = event.target.files[0];
    var fname = documentFile.name;
    var re = /(\.xlsx|\.xls)$/i;
    if (!re.exec(fname)) {
      this.swal('Warning', 'Unsupported file', 'warning');
      $('#file').val('');
      return;
    }
    this.selectFile = documentFile;

  }
  submit() {
    let useId= this.user.userId;
    let file = this.selectFile;
    if(file==null||file==undefined) {
      this.swal('Info', 'Please choose file', 'info');
      return;
    }
    const form: FormData = new FormData();
    form.append('userId', useId);
    form.append('file', file);
    this.snoService.readExcelData(form).subscribe(
      (response: any) => {
        let responseData = response;
        if (responseData.status == 'success') {
          if (responseData.data.status == 'success') {
            this.swal('Success', responseData.data.message, 'success');
            $('#file').val('');
          }else if (responseData.data.status == 'invalid') {
            this.swal('Info', responseData.data.message, 'info');
            $('#file').val('');
          } else {
            this.swal('', responseData.data.message, 'info');
          }
        } else {
          this.swal(
            '',
            'Something went wrong... Please try again later.',
            'error'
          );
        }
      },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      }
    );
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
}
