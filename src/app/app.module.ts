import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogElementsExampleDialogComponent } from './dialog-elements-example-dialog/dialog-elements-example-dialog.component';
import { ShowAllNotificationComponent } from './show-all-notification/show-all-notification.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { UserTypeComponent } from './user-type/user-type.component';
import { CreategroupComponent } from './creategroup/creategroup.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { TreatmentHistoryComponent } from './treatment-history/treatment-history.component';
import { TreatmentHistoryPackageComponent } from './treatment-history-package/treatment-history-package.component';
import { PreauthHistoryComponent } from './preauth-history/preauth-history.component';
import { TrackingDetailsComponent } from './tracking-details/tracking-details.component';
import { CpdMultiPackageBlockingComponent } from './cpd-multi-package-blocking/cpd-multi-package-blocking.component';
import { SnaPackageBlockingComponent } from './sna-package-blocking/sna-package-blocking.component';
import { DischargedTreatmentInfoComponent } from './discharged-treatment-info/discharged-treatment-info.component';
import { NgxUiLoaderHttpModule, NgxUiLoaderModule } from 'ngx-ui-loader';
import { UnauthorizeComponent } from './unauthorize/unauthorize.component';
import { CommonModule, DatePipe } from '@angular/common';
import { CpdLeaveActionComponent } from './application/cpd-leave-action/cpd-leave-action.component';
import { FinancialofficerdetailservicedetailsComponent } from './financialofficerdetailservicedetails/financialofficerdetailservicedetails.component';
import { ValidateOtpComponent } from './validate-otp/validate-otp.component';
import { SidebarmenuComponent } from './shared/sidebarmenu/sidebarmenu.component';
import { AppheaderComponent } from './shared/appheader/appheader.component';
import { AppfooterComponent } from './shared/appfooter/appfooter.component';
import { UtiliteComponent } from './shared/utilite/utilite.component';
import { TreatmentHistoryCpdComponent } from './treatment-history-cpd/treatment-history-cpd.component';
import { TrackingDetailsHospitalComponent } from './tracking-details-hospital/tracking-details-hospital.component';
import { TreatmentHistoryHospitalComponent } from './treatment-history-hospital/treatment-history-hospital.component';
import { ChangeUserPasswordComponent } from './change-user-password/change-user-password.component';
import { HospitalWiseClaimReportDetailComponent } from './hospital-wise-claim-report-detail/hospital-wise-claim-report-detail.component';
import { PatientDetailsComponent } from './patient-details/patient-details.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { LandingComponent } from './landing/landing.component';
import { ErrorInterceptor } from './services/interceptor.service';
import { HospitalwisesummarryinnerpageComponent } from './hospitalwisesummarryinnerpage/hospitalwisesummarryinnerpage.component';
import { HospitalwisefloatdetailsComponent } from './hospitalwisefloatdetails/hospitalwisefloatdetails.component';
import { SummarydetailsComponent } from './summarydetails/summarydetails.component';
import { ViewoldclaimandnewclaimdetailsComponent } from './viewoldclaimandnewclaimdetails/viewoldclaimandnewclaimdetails.component';
import { MobileapiComponent } from './mobileapi/mobileapi.component';
import { FilterService } from './filter.service';
import { PendingmortalitystatusComponent } from './pendingmortalitystatus/pendingmortalitystatus.component';
import { SnarejectiondetailsComponent } from './snarejectiondetails/snarejectiondetails.component';
import { PendingHospitalClaimsComponent } from './pending-hospital-claims/pending-hospital-claims.component';
import { SnaremarkcountdetailsComponent } from './snaremarkcountdetails/snaremarkcountdetails.component';
import { FloatclaimdetailsComponent } from './floatclaimdetails/floatclaimdetails.component';
import { GrievanceCountReportComponent } from './grievance-count-report/grievance-count-report.component';
import { PackagedetailsforspecialityComponent } from './packagedetailsforspeciality/packagedetailsforspeciality.component';
import { DoctorprofiledetailsComponent } from './doctorprofiledetails/doctorprofiledetails.component';
import { TreatmenthistoryofurnComponent } from './treatmenthistoryofurn/treatmenthistoryofurn.component';
import { ICDSharedServices } from './services/ICDSharedServices';
import { CpdPaymentCalculationDetailsComponent } from "./cpd-payment-calculation-details/cpd-payment-calculation-details.component";
import { MortalitydetailsComponent } from './mortalitydetails/mortalitydetails.component';
import { UrnwiseamounntblockreportComponent } from './urnwiseamounntblockreport/urnwiseamounntblockreport.component';
import { UrnwiseamountutilizegplistComponent } from './urnwiseamountutilizegplist/urnwiseamountutilizegplist.component';
import { UrnwiseamountutilizevillagelistComponent } from './urnwiseamountutilizevillagelist/urnwiseamountutilizevillagelist.component';
import { OutsideodishatreatmentdetailsblockComponent } from './outsideodishatreatmentdetailsblock/outsideodishatreatmentdetailsblock.component';
import { OutsideodishatreatmentdetailspanchayatComponent } from './outsideodishatreatmentdetailspanchayat/outsideodishatreatmentdetailspanchayat.component';
import { OutsideodishatreatmentdetailsvillageComponent } from './outsideodishatreatmentdetailsvillage/outsideodishatreatmentdetailsvillage.component';
import { CpdclaimprocessingpaymentreportdetailsComponent } from './cpdclaimprocessingpaymentreportdetails/cpdclaimprocessingpaymentreportdetails.component';
import { SnamappingreportComponent } from './snamappingreport/snamappingreport.component';
import { DishonordeactivationComponent } from './dishonordeactivation/dishonordeactivation.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { HospitalwiseAbstractComponent } from './hospitalwise-abstract/hospitalwise-abstract.component';
import { PackagepatternComponent } from './packagepattern/packagepattern.component';
import { IndianCurrencyPipe } from './indian-currency.pipe';
import { MobileattendancegroupconfigurationComponent } from './mobileattendancegroupconfiguration/mobileattendancegroupconfiguration.component';
import { MobileattendanceuserconfigurationComponent } from './mobileattendanceuserconfiguration/mobileattendanceuserconfiguration.component';
import { MobileattendancegroupwiseconfigurationComponent } from './mobileattendancegroupwiseconfiguration/mobileattendancegroupwiseconfiguration.component';
import { MobileattendanceconfigurationviewComponent } from './mobileattendanceconfigurationview/mobileattendanceconfigurationview.component';
import { PostpaymentsummarydetailsComponent } from './postpaymentsummarydetails/postpaymentsummarydetails.component';
import { AuthenticationdeviceComponent } from './authenticationdevice/authenticationdevice.component';
import { CasewisehospitaldetailsComponent } from './casewisehospitaldetails/casewisehospitaldetails.component';
import { SmpatientreviewdetailsComponent } from './smpatientreviewdetails/smpatientreviewdetails.component';

@NgModule({
  declarations: [
    AppComponent,
    PagenotfoundComponent,
    LoginComponent,
    DialogElementsExampleDialogComponent,
    ShowAllNotificationComponent,
    UserTypeComponent,
    CreategroupComponent,
    TreatmentHistoryComponent,
    TreatmentHistoryPackageComponent,
    PreauthHistoryComponent,
    TrackingDetailsComponent,
    CpdMultiPackageBlockingComponent,
    SnaPackageBlockingComponent,
    DischargedTreatmentInfoComponent,
    UnauthorizeComponent,
    CpdLeaveActionComponent,
    FinancialofficerdetailservicedetailsComponent,
    ValidateOtpComponent,
    SidebarmenuComponent,
    AppheaderComponent,
    AppfooterComponent,
    UtiliteComponent,
    TreatmentHistoryCpdComponent,
    TrackingDetailsHospitalComponent,
    TreatmentHistoryHospitalComponent,
    ChangeUserPasswordComponent,
    HospitalWiseClaimReportDetailComponent,
    PatientDetailsComponent,
    LandingComponent,
    HospitalwisesummarryinnerpageComponent,
    HospitalwisefloatdetailsComponent,
    SummarydetailsComponent,
    ViewoldclaimandnewclaimdetailsComponent,
    MobileapiComponent,
    FilterService,
    PendingmortalitystatusComponent,
    SnarejectiondetailsComponent,
    PendingHospitalClaimsComponent,
    SnaremarkcountdetailsComponent,
    FloatclaimdetailsComponent,
    GrievanceCountReportComponent,
    PackagedetailsforspecialityComponent,
    DoctorprofiledetailsComponent,
    TreatmenthistoryofurnComponent,
    CpdPaymentCalculationDetailsComponent,
    MortalitydetailsComponent,
    UrnwiseamounntblockreportComponent,
    UrnwiseamountutilizegplistComponent,
    UrnwiseamountutilizevillagelistComponent,
    OutsideodishatreatmentdetailsblockComponent,
    OutsideodishatreatmentdetailspanchayatComponent,
    OutsideodishatreatmentdetailsvillageComponent,
    CpdclaimprocessingpaymentreportdetailsComponent,
    SnamappingreportComponent,
    DishonordeactivationComponent,
    HospitalwiseAbstractComponent,
    PackagepatternComponent,
    IndianCurrencyPipe,
    MobileattendancegroupconfigurationComponent,
    MobileattendanceuserconfigurationComponent,
    MobileattendancegroupwiseconfigurationComponent,
    MobileattendanceconfigurationviewComponent,
    PostpaymentsummarydetailsComponent,
    AuthenticationdeviceComponent,
    CasewisehospitaldetailsComponent,
    SmpatientreviewdetailsComponent,
  ],
  imports: [
    AutocompleteLibModule,
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    NgbModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgxUiLoaderModule,
    NgxUiLoaderHttpModule.forRoot({
      showForeground: true,
    }),

  ],
  providers: [ICDSharedServices, DatePipe,{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },],
  bootstrap: [AppComponent]
})
export class AppModule { }
