import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {HeaderService} from "../../header.service";
import {MailCommunicationService} from "../../Services/mail-communication.service";
import {ChangeEvent} from "@ckeditor/ckeditor5-angular/ckeditor.component";
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Swal from "sweetalert2";
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-mail-service-configuration',
  templateUrl: './mail-service-configuration.component.html',
  styleUrls: ['./mail-service-configuration.component.scss']
})
export class MailServiceConfigurationComponent implements OnInit {

  showPagination: any;
  pageElement: any = 25;
  currentPage: any = 1;
  searchFilter: any;
  isVisible: any = true;
  isVisibleSave: any = true;
  isCustom: any = false;
  reportList : any = [];
  mailServiceList: any[] = [];
  mailServiceForm : FormGroup;
  public Editor = ClassicEditor;
  serviceStartTime: any;
  ccRecipientMailList: any[] = [];
  bccRecipientMailList: any[] = [];
  mailBodyModal: any;
  recipientMailsHeading: any;
  recipientMailsModal: any[] = [];
  selectedMailServiceId: any;
  selectedMailServiceFrequency: any;
  activeStatus: boolean = true;
  id: any;
  data: any = 0;

  constructor(
    private headerService: HeaderService,
    private mailCommunicationService: MailCommunicationService,
    private formBuilder: FormBuilder,
    private sessionService: SessionStorageService,
  ) { }

  ngOnInit(): void {
    this.headerService.setTitle('Mail Service Configuration');

    this.mailServiceForm = this.formBuilder.group({
      selectedMailServiceId : new FormControl(''),
      mailServiceId : new FormControl(''),
      mailServiceName : new FormControl(''),
      mailDescription : new FormControl(''),
      mailSubject : new FormControl(''),
      mailBody : new FormControl(''),
      mailServiceStartTime : new FormControl(''),
      mailServiceFrequency : new FormControl(''),
      mailServiceFrequencyFrom : new FormControl(''),
      mailServiceFrequencyTo : new FormControl(''),
      ccEmail : new FormControl(''),
      bccEmail : new FormControl(''),
    });

    this.getMailServiceNameList();
    this.serviceStartTime = new Date().toLocaleTimeString('en', {hour12: false, hour: '2-digit', minute: '2-digit'});
  }

  getMailServiceNameList() {
    this.mailCommunicationService.getMailServiceNameList().subscribe((res: any) => {
      if (res.status == 'success' && res.statusCode == 200)
        this.mailServiceList = res.data;
    });
  }

  getMailServiceConfigList() {
    this.mailCommunicationService.getMailServiceConfigList().subscribe((res: any) => {
      if (res.status == 'success' && res.statusCode == 200)  {
        this.reportList = res.data;
        this.showPagination = true;
      } else {
        this.reportList = [];
        this.showPagination = false;
      }
    });
  }

  addRecipient(emailInput: string, recipientList: string[], formControlName: string, containerId: string): void {
    if (!emailInput) {
      Swal.fire({
        title: 'Info',
        text: `Please enter ${formControlName} Email`,
        icon: 'info',
      });
      return;
    }

    const emailList = emailInput.split(',').map((email: string) => email.trim());
    const invalidEmails: string[] = [];
    const uniqueEmails: string[] = [];
    const duplicateEmails: string[] = [];

    const recipientMailSet = new Set(recipientList);
    const uniqueEmailsSet = new Set(uniqueEmails);

    emailList.forEach((email: string) => {
      if (this.validateEmail(email)) {
        if (!recipientMailSet.has(email) && !uniqueEmailsSet.has(email)) {
          recipientList.push(email.trim());
          uniqueEmails.push(email);
        } else
          duplicateEmails.push(email);
      } else
        invalidEmails.push(email);
    });

    if (invalidEmails.length > 0) {
      const invalidEmailsMessage = `<b style="color: #b40505">${invalidEmails.join('</b>, <b style="color: #b40505">')}</b> is/are not valid email address(es)`;
      Swal.fire({
        title: 'Info',
        html: invalidEmailsMessage,
        icon: 'info',
      });
    }

    if (duplicateEmails.length > 0) {
      const duplicateEmailsMessage = `<b style="color: #b40505">${duplicateEmails.join('</b>, <b style="color: #b40505">')}</b> already added`;
      Swal.fire({
        title: 'Info',
        html: duplicateEmailsMessage,
        icon: 'info',
      });
    }

    this.mailServiceForm.patchValue({
      [formControlName]: ''
    });
  }

  addCCEmail(): void {
    const ccEmailInput = this.mailServiceForm.value.ccEmail;
    this.addRecipient(ccEmailInput, this.ccRecipientMailList, 'ccEmail', 'chipsContainer');
  }

  addBCCEmail(): void {
    const bccEmailInput = this.mailServiceForm.value.bccEmail;
    this.addRecipient(bccEmailInput, this.bccRecipientMailList, 'bccEmail', 'chipsContainer1');
  }

  removeBCCEmail(email: string): void {
    if (this.bccRecipientMailList.includes(email)) {
      const index = this.bccRecipientMailList.indexOf(email);
      this.bccRecipientMailList.splice(index, 1);
    }
  }

  removeCCEmail(email: string): void {
    if (this.ccRecipientMailList.includes(email)) {
      const index = this.ccRecipientMailList.indexOf(email);
      this.ccRecipientMailList.splice(index, 1);
    }
  }

  add() {
    this.isVisible = true;
    this.isVisibleSave = true;
    $('#add').addClass('active');
    $('#view').removeClass('active');
  }

  view() {
    this.isVisible = false;
    $('#view').addClass('active');
    $('#add').removeClass('active');
    this.getMailServiceConfigList();
  }

  update() {
    this.isVisibleSave = false;
    this.isVisible = true;
    $('#update').addClass('active');
    $('#view').removeClass('active');
  }

  public onChange( { editor }: ChangeEvent ) {
    this.mailServiceForm.value.mailBody = editor.getData();
  }

  selectMailServiceName(event : any) {
    this.mailServiceList.forEach((item : any) => {
      if (item.id == event.target.value) {
        this.mailServiceForm.patchValue({
          mailServiceId : item.id,
          mailServiceName : item.mailServiceName,
          mailDescription : item.mailDescription
        });
      }
    });
  }

  convertTime(time: any) {
    let timeArray = time.split(":");
    let hours = timeArray[0];
    let minutes = timeArray[1];
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return hours + ':' + minutes + ' ' + ampm;
  }

  getFrequencyLabel(frequency: number): string {
    const frequencyMap = {
      1: 'Daily',
      2: 'Weekly',
      3: 'Monthly',
      4: 'Yearly',
      5: 'Custom'
    };
    return frequencyMap[frequency] || '';
  }

  getRowNumber(report: any): number {
    const index = this.reportList.indexOf(report);
    const currentPage = this.currentPage || 1;
    const pageElement = this.pageElement || 10;
    return (currentPage - 1) * pageElement + index + 1;
  }

  trackByReportId(index: number, report: any): any {
    return report.id;
  }

  selectServiceFrequency(event : any) {
    this.isCustom = event.target.value == 5;
    this.mailServiceForm.patchValue({
      mailServiceFrequency : event.target.value
    });
  }

  viewMailBody(mailBody: any) {
    this.mailBodyModal = mailBody;
    $("#modal").show();
    $(".claim-detail").css("filter", "blur(5px)");
  }

  viewRecipientMails(heading : any, recipientMails: any) {
    this.recipientMailsHeading = heading;
    this.recipientMailsModal = JSON.parse(recipientMails)
    $("#modal1").show();
    $(".claim-detail").css("filter", "blur(5px)");
  }

  closeModal() {
    $("#modal").hide();
    $("#modal1").hide();
    $(".claim-detail").css("filter", "blur(0px)");
  }

  validateEmail(email : any) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  saveMailService() {

    if (this.mailServiceForm.value.mailServiceId === '' || this.mailServiceForm.value.mailServiceId === null) {
      Swal.fire({
        title: 'Info',
        text: 'Please select mail service name',
        icon: 'info',
      });
      return
    }

    if (this.mailServiceForm.value.mailSubject === '' || this.mailServiceForm.value.mailSubject == null) {
      Swal.fire({
        title: 'Info',
        text: 'Please enter mail subject',
        icon: 'info',
      });
      return;
    }

    if (this.mailServiceForm.value.mailServiceFrequency === '' || this.mailServiceForm.value.mailServiceFrequency == null) {
      Swal.fire({
        title: 'Info',
        text: 'Please select mail service frequency',
        icon: 'info',
      });
      return;
    }

    if (this.mailServiceForm.value.mailServiceFrequency == 5) {
      if (this.mailServiceForm.value.mailServiceFrequencyFrom == '' || this.mailServiceForm.value.mailServiceFrequencyFrom == null) {
        Swal.fire({
          title: 'Info',
          text: 'Please enter mail service frequency from',
          icon: 'info'
        })
        return;
      } else if (this.mailServiceForm.value.mailServiceFrequencyTo == '' || this.mailServiceForm.value.mailServiceFrequencyTo == null) {
        Swal.fire({
          title: 'Info',
          text: 'Please enter mail service frequency to',
          icon: 'info'
        })
        return;
      }
    }

    if (this.mailServiceForm.value.mailServiceFrequency == 1) {
      if (this.mailServiceForm.value.mailServiceStartTime.trim() === '') {
        Swal.fire({
          title: 'Info',
          text: 'Please enter mail service start time',
          icon: 'info'
        })
        return;
      }
    }

    if (this.mailServiceForm.value.mailBody === '' || this.mailServiceForm.value.mailBody == null) {
      Swal.fire({
        title: 'Info',
        text: 'Please enter mail body',
        icon: 'info'
      })
      return;
    } else {
      let object = {
        id : this.id,
        mailServiceId : this.mailServiceForm.value.mailServiceId,
        mailServiceName : this.mailServiceForm.value.mailServiceName,
        mailDescription : this.mailServiceForm.value.mailDescription,
        mailSubject : this.mailServiceForm.value.mailSubject,
        mailCCRecipient : this.ccRecipientMailList,
        mailBCCRecipient : this.bccRecipientMailList,
        mailServiceFrequency : this.mailServiceForm.value.mailServiceFrequency,
        mailServiceStartTime : this.mailServiceForm.value.mailServiceStartTime,
        mailServiceFrequencyFrom : this.mailServiceForm.value.mailServiceFrequencyFrom,
        mailServiceFrequencyTo : this.mailServiceForm.value.mailServiceFrequencyTo,
        mailBody : this.mailServiceForm.value.mailBody,
        activeStatus : this.activeStatus == true ? 0 : 1,
        createdBy : this.sessionService.decryptSessionData("user").userId,
      }
      this.mailCommunicationService.saveMailServiceConfigData(object).subscribe((res: any) => {
        if (res.status == 'success' && res.statusCode == 200) {
          Swal.fire({
            title: 'Success',
            text: res.message,
            icon: 'success',
          }).then((result) => {
            if (result.value) {
              this.resetMailService();
            }
          });
        } else {
          Swal.fire({
            title: 'Error',
            text: res.message,
            icon: 'error',
          });
        }
      });
    }
  }

  resetMailService() {
    window.location.reload();
  }

  editMailService(id : any) {
    this.mailCommunicationService.getMailServiceConfigDataById(id).subscribe((res: any) => {
      if (res.status == 'success' && res.statusCode == 200)  {
        this.id = res.data.id;
        this.mailServiceForm.patchValue({
          mailServiceId : res.data.mstMailService.id,
          mailServiceName : res.data.mstMailService.mstMailService,
          mailDescription : res.data.mstMailService.mailDescription,
          mailSubject : res.data.mailSubject,
          mailServiceFrequency : res.data.mailFrequency,
          mailServiceStartTime : res.data.mailTime,
          mailServiceFrequencyFrom : res.data.mailFrequencyFrom,
          mailServiceFrequencyTo : res.data.mailFrequencyTo,
          mailBody : res.data.mailBody,
        });
        this.activeStatus = res.data.statusFlag == 0;
        this.selectedMailServiceId = res.data.mstMailService.id;
        this.selectedMailServiceFrequency = res.data.mailFrequency;
        JSON.parse(res.data.mailCcRecipient).forEach((element: any) => {
          this.ccRecipientMailList.push(element);
        });
        JSON.parse(res.data.mailBccRecipient).forEach((element: any) => {
          this.bccRecipientMailList.push(element);
        });
        this.update();
      }
    });
  }

  pageItemChange(event : any) {
    this.pageElement = event.target.value;
  }

  downloadReport(status : any) {
  }

  protected readonly Number = Number;
}
