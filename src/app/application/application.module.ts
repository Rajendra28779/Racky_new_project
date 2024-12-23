import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ApplicationRoutingModule } from './application-routing.module';
import { ApplicationComponent } from './application.component';
import { AppheaderComponent } from './shared/appheader/appheader.component';
import { AppfooterComponent } from './shared/appfooter/appfooter.component';
import { AppsidebarComponent } from './shared/appsidebar/appsidebar.component';
import { AddComponent } from './add/add.component';
import { ViewComponent } from './view/view.component';
import { UtiliteComponent } from './shared/utilite/utilite.component';
import { CreatesnoComponent } from './sno/createsno/createsno.component';
import { CreatecpdComponent } from './sno/createcpd/createcpd.component';
import { TurncatepipePipe } from './turncatepipe.pipe';
import { ForgotpasswordComponent } from '../forgotpassword/forgotpassword.component';
import { ClaimraiseComponent } from './hospital/claimraise/claimraise.component';
import { ClaimraisedetailsComponent } from './hospital/claimraisedetails/claimraisedetails.component';
import { PendingclaimComponent } from './hospital/pendingclaim/pendingclaim.component';
import { QueryComponent } from './hospital/query/query.component';
import { PaidComponent } from './hospital/paid/paid.component';
import { StopPropogationDirective } from './stop-propogation.directive';
import { CreategroupComponent } from './creategroup/creategroup.component';
import { SnoactionComponent } from './sna/snoaction/snoaction.component';
import { CardiologyComponent } from './reports/cardiology/cardiology.component';
import { CategorywisetreatComponent } from './reports/categorywisetreat/categorywisetreat.component';
import { DischargeclaimComponent } from './reports/dischargeclaim/dischargeclaim.component';
import { HospitalwisepaidComponent } from './reports/hospitalwisepaid/hospitalwisepaid.component';
import { KhurdaComponent } from './reports/khurda/khurda.component';
import { MultiplepackageComponent } from './reports/multiplepackage/multiplepackage.component';
import { OngoingicuComponent } from './reports/ongoingicu/ongoingicu.component';
import { SNOConfigurationComponent } from './sno/sno-configuration/sno-configuration.component';
import { UserGroupComponent } from './BSKY-Master/user-group/user-group.component';
import { UserSubGroupComponent } from './BSKY-Master/user-sub-group/user-sub-group.component';
import { ClaimquerybycpdComponent } from './hospital/claimquerybycpd/claimquerybycpd.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { CpdrejectedactionComponent } from './sna/cpdrejectedaction/cpdrejectedaction.component';
import { ClaimsqueriedbySNOComponent } from './hospital/claimsqueriedbySNO/claimsqueriedbySNO.component';
import { ClaimsqueriedbySNOdetailsComponent } from './hospital/claimsqueriedbySNOdetails/claimsqueriedbySNOdetails.component';
import { ClaimquerybyCPDdetailsComponent } from './hospital/claimqueryby-cpddetails/claimqueryby-cpddetails.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { ViewSubGroupComponent } from './BSKY-Master/view-sub-group/view-sub-group.component';
import { CPDConfigurationComponent } from './CPD/cpdconfiguration/cpdconfiguration.component';
import { UsergroupViewComponent } from './BSKY-Master/usergroup-view/usergroup-view.component';
import { TreatmenthistoryPerUrnComponent } from './treatmenthistory-per-urn/treatmenthistory-per-urn.component';
import { GroupTypeComponent } from './BSKY-Master/group-type/group-type.component';
import { GroupTypeViewComponent } from './BSKY-Master/group-type-view/group-type-view.component';
import { SnoReActionComponent } from './sna/sno-re-action/sno-re-action.component';
import { UserHospitalComponent } from './BSKY-Master/user-hospital/user-hospital.component';
import { UserHospitalViewComponent } from './BSKY-Master/user-hospital-view/user-hospital-view.component';
import { ViewcpdComponent } from './sno/viewcpd/viewcpd.component';
import { CpdconfigurationdetailsComponent } from './CPD/cpdconfigurationdetails/cpdconfigurationdetails.component';
import { SnoconfigurationdetailsComponent } from './sno/snoconfigurationdetails/snoconfigurationdetails.component';
import { CpdReApprovalActionComponent } from './CPD/claim_management/cpd-re-approval-action/cpd-re-approval-action.component';
import { CreatesnoviewComponent } from './sno/createsnoview/createsnoview.component';
import { DcapprovalComponent } from './dcapproval/dcapproval.component';
import { DcactionComponent } from './dcaction/dcaction.component';
import { TreatmenthistoryPerUrnPackageComponent } from './treatmenthistory-per-urn-package/treatmenthistory-per-urn-package.component';
import { CpdpipePipe } from './pipes/cpdpipe.pipe';
import { ClaimactioncountdetailsComponent } from './reports/claimactioncountdetails/claimactioncountdetails.component';
import { SnopipePipe } from './pipes/snopipe.pipe';
import { SnoconfigpipePipe } from './pipes/snoconfigpipe.pipe';
import { HospitalpipePipe } from './pipes/hospitalpipe.pipe';
import { UnprocessedclaimComponent } from './sna/unprocessedclaim/unprocessedclaim.component';
import { UnprocessedactionComponent } from './sna/unprocessedaction/unprocessedaction.component';
import { CpdrevertComponent } from './CPD/claim_management/cpdrevert/cpdrevert.component';
import { CpdrevertactionComponent } from './CPD/claim_management/cpdrevertaction/cpdrevertaction.component';
import { CpdleaveapproveComponent } from './cpdleaveapprove/cpdleaveapprove.component';
import { PendingclaimdetailsComponent } from './hospital/pendingclaimdetails/pendingclaimdetails.component';
import { SNARejectListHospitalComponent } from './hospital/snareject-list-hospital/snareject-list-hospital.component';
import { CPDRejectListHospitalComponent } from './hospital/cpdreject-list-hospital/cpdreject-list-hospital.component';
import { CpdleaveapproveactionComponent } from './cpdleaveapproveaction/cpdleaveapproveaction.component';
import { CpdleaveviewComponent } from './cpdleaveview/cpdleaveview.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { RejectrequestsnaComponent } from './rejectrequestsna/rejectrequestsna.component';
import { RejectrequestsnadetailsComponent } from './rejectrequestsnadetails/rejectrequestsnadetails.component';
import { CpdLeaveHistoryComponent } from './CPD/hr/cpd-leave-history/cpd-leave-history.component';
import { FunctionMasterComponent } from './admin-console/function-master/function-master.component';
import { GlobalLinkComponent } from './admin-console/global-link/global-link.component';
import { PrimaryLinkComponent } from './admin-console/primary-link/primary-link.component';
import { ViewfnmasterComponent } from './admin-console/viewfnmaster/viewfnmaster.component';
import { ViewgllinkComponent } from './admin-console/viewgllink/viewgllink.component';
import { ViewpmlinkComponent } from './admin-console/viewpmlink/viewpmlink.component';
import { CpdrejectlisthospitaldetailsComponent } from './hospital/cpdrejectlisthospitaldetails/cpdrejectlisthospitaldetails.component';
import { SnarejectlisthospitaldetailsComponent } from './hospital/snarejectlisthospitaldetails/snarejectlisthospitaldetails.component';
import { ClaimProcessedComponent } from './sna/claim-processed/ClaimProcessedComponent';
import { SnaBulkApprovedComponent } from './sna-bulk-approved/sna-bulk-approved.component';
import { SnanoncompliancequeryrequestComponent } from './sna/snanoncompliancequeryrequest/snanoncompliancequeryrequest.component';
import { SnanoncompliancequeryrequestdetailsComponent } from './sna/snanoncompliancequeryrequestdetails/snanoncompliancequeryrequestdetails.component';
import { UserMenuMappingComponent } from './admin-console/user-menu-mapping/user-menu-mapping.component';
import { CpdprofileComponent } from './profile/cpdprofile/cpdprofile.component';
import { SidebarmenuComponent } from './shared/sidebarmenu/sidebarmenu.component';
import { SnarejectedlistComponent } from '../snarejectedlist/snarejectedlist.component';
import { FoFloatReportComponent } from './fo-float-report/fo-float-report.component';
import { FinancialofficerdetailsComponent } from '../financialofficerdetails/financialofficerdetails.component';
import { FloateDetailsComponent } from './admin-console/floate-details/floate-details.component';
import { SnaViewFloatComponent } from './sna-view-float/sna-view-float.component';
import { SnafloatactionComponent } from './snafloataction/snafloataction.component';
import { CreateuserComponent } from './BSKY-Master/createuser/createuser.component';
import { ViewuserComponent } from './BSKY-Master/viewuser/viewuser.component';
import { SnaFloatReportComponent } from './sna-float-report/sna-float-report.component';
import { UserInactiveComponent } from './user-inactive/user-inactive.component';
import { HospitalprofileComponent } from './profile/hospitalprofile/hospitalprofile.component';
import { AuditorFloatReportComponent } from './auditor-float-report/auditor-float-report.component';
import { SysrejectedreportsComponent } from './sno/sysrejectedreports/sysrejectedreports.component';
import { DcConfigurationComponent } from './dc/dc-configuration/dc-configuration.component';
import { DcconfigurationdetailsComponent } from './dc/dcconfigurationdetails/dcconfigurationdetails.component';
import { DcresetpasswordComponent } from './dcresetpassword/dcresetpassword.component';
import { UserprofileComponent } from './profile/userprofile/userprofile.component';
import { HoispitalinfoReportComponent } from 'src/app/application/admin-console/hoispitalinfo-report/hoispitalinfo-report.component';
import { QueryLoginComponent } from './query-login/query-login.component';
import { QueryBuilderComponent } from './query-builder/query-builder.component';
import { SnadoctorTagComponent } from './snadoctor-tag/snadoctor-tag.component';
import { HospitalmasterComponent } from './hospitalmaster/hospitalmaster.component';
import { TransactioncountdetalsReportsComponent } from './reports/transactioncountdetals-reports/transactioncountdetals-reports.component';
import { QueryTypeComponent } from './query-type/query-type.component';
import { QuerytypeviewComponent } from './querytypeview/querytypeview.component';
import { GroupMenuMappingComponent } from './admin-console/group-menu-mapping/group-menu-mapping.component';
import { DoctorsDetailsComponent } from './doctors-details/doctors-details.component';
import { DischargedetailsHistoryComponent } from './hospital/dischargedetails-history/dischargedetails-history.component';
import { ClaimRecievedDetailsComponent } from './reports/claim-recieved-details/claim-recieved-details.component';
import { CpdmappingComponent } from './cpdmapping/cpdmapping.component';
import { HospitalMasterUserComponent } from './BSKY-Master/hospital-master-user/hospital-master-user.component';
import { HospitalMasterUserDetailsComponent } from './BSKY-Master/hospital-master-user-details/hospital-master-user-details.component';
import { ClaimstatictiscDetailsComponent } from './reports/claimstatictisc-details/claimstatictisc-details.component';
import { CPDActionReportComponent } from './CPD/mis_report/cpdaction-report/cpdaction-report.component';
import { TreatmentHistorySnaComponent } from './treatment-history-sna/treatment-history-sna.component';
import { SnaactiontakenlogdetailsrprtComponent } from './reports/snaactiontakenlogdetailsrprt/snaactiontakenlogdetailsrprt.component';
import { CpdLeaveactionAdminComponent } from './cpd-leaveaction-admin/cpd-leaveaction-admin.component';
import { CpdLeaveviewAdminComponent } from './cpd-leaveview-admin/cpd-leaveview-admin.component';
import { RunCpdScheduleComponent } from './run-cpd-schedule/run-cpd-schedule.component';
import { CpdTrackingDetailsComponent } from './cpd-tracking-details/cpd-tracking-details.component';
import { PackageDetailsComponent } from './package-details/package-details.component';
import { NonComplianceQueryCPDToSNAComponent } from './sna/non-compliance-query-cpdto-sna/non-compliance-query-cpdto-sna.component';
import { NonComplianceQueryCPDToSNAActionComponent } from './sna/non-compliance-query-cpdto-snaaction/non-compliance-query-cpdto-snaaction.component';
import { NotificationDetailsReportComponent } from './notification-details-report/notification-details-report.component';
import { NotificationComponent } from './notification/notification.component';
import { ViewnotificationComponent } from './notificationview/viewnotification.component';
import { ClaimcountprogressreportDetailsComponent } from './reports/claimcountprogressreport-details/claimcountprogressreport-details.component';
import { SnasysrejbtnEnableComponent } from './sna/snasysrejbtn-enable/snasysrejbtn-enable.component';
import { SnasysrejbtnEnableActionComponent } from './sna/snasysrejbtn-enable-action/snasysrejbtn-enable-action.component';
import { LoginSharedServiceService } from '../login-shared-service.service';
import { PackageMasterComponent } from './package-master/package-master.component';
import { PackageMasterViewComponent } from './package-master-view/package-master-view.component';
import { SnaapprovedComponent } from './Payment/snaapproved/snaapproved.component';
import { FloatListComponent } from './Payment/float-list/float-list.component';
import { FloatdetailsComponent } from './Payment/floatdetails/floatdetails.component';
import { PaymentfreezListComponent } from './Payment/paymentfreez-list/paymentfreez-list.component';
import { UrnwiseactionComponent } from './sna/urnwiseaction/urnwiseaction.component';
import { TransactionClaimDumpComponent } from './transaction-claim-dump/transaction-claim-dump.component';
import { ViewFoatListComponent } from './Payment/view-foat-list/view-foat-list.component';
import { PendingClaimSnareportsComponent } from './reports/pending-claim-snareports/pending-claim-snareports.component';
import { UntaggedHospitalsComponent } from './sno/untagged-hospitals/untagged-hospitals.component';
import { PackageHeaderViewComponent } from './package-header-view/package-header-view.component';
import { PackageHeaderComponent } from './package-header/package-header.component';
import { PackageSubcatagoryViewComponent } from './package-subcatagory-view/package-subcatagory-view.component';
import { PackageSubCatagoryComponent } from './package-sub-catagory/package-sub-catagory.component';
import { VitalStatisticsViewComponent } from './BSKY-Master/vital-statistics-view/vital-statistics-view.component';
import { VitalStatisticsComponent } from './BSKY-Master/vital-statistics/vital-statistics.component';
import { FpOverrideCodeComponent } from './fp-override-code/fp-override-code.component';
import { HospitalPackageMappingComponent } from './BSKY-Master/hospital-package-mapping/hospital-package-mapping.component';
import { HospitalPackageMappingViewComponent } from './BSKY-Master/hospital-package-mapping-view/hospital-package-mapping-view.component';
import { PreauthApprovalComponent } from './preauth-approval/preauth-approval.component';
import { PackageDetailsMasterComponent } from './BSKY-Master/package-details-master/package-details-master.component';
import { PackageDetailsMasterViewComponent } from './BSKY-Master/package-details-master-view/package-details-master-view.component';
import { OldtreatmentHistorySNAComponent } from './oldtreatment-history-sna/oldtreatment-history-sna.component';
import { ImplantMasterComponent } from './BSKY-Master/implant-master/implant-master.component';
import { ImplantMasterViewComponent } from './BSKY-Master/implant-master-view/implant-master-view.component';
import { HighEndDrugsComponent } from './BSKY-Master/high-end-drugs/high-end-drugs.component';
import { HighEndDrugsViewComponent } from './BSKY-Master/high-end-drugs-view/high-end-drugs-view.component';
import { HospitalWiseClaimReportComponent } from './hospital-wise-claim-report/hospital-wise-claim-report.component';
import { NonComplianceExtnComponent } from './non-compliance-extn/non-compliance-extn.component';
import { FloatgenerationComponent } from './float-generation/floatgeneration/floatgeneration.component';
import { ViewfloatreportComponent } from './float-generation/viewfloatreport/viewfloatreport.component';
import { UnprocessedmasterConfigurationComponent } from './BSKY-Master/unprocessedmaster-configuration/unprocessedmaster-configuration.component';
import { UnprocessedMasterViewComponent } from './BSKY-Master/unprocessed-master-view/unprocessed-master-view.component';
import { HospitalAuthClaimMngmtComponent } from './hospital-auth-claim-mngmt/hospital-auth-claim-mngmt.component';
//=========================Empanelment==================================
import { ViewApplicationListComponent } from './form-application/view-application-list/view-application-list.component';
import { ViewFormListComponent } from './form-application/view-form-list/view-form-list.component';
import { PendingApplicationComponent } from './form-application/pending-application/pending-application.component';
import { TakeActionComponent } from './form-application/take-action/take-action.component';
import { ApplicationSummaryComponent } from './form-application/application-summary/application-summary.component';
import { ApprovedApplicationComponent } from './form-application/approved-application/approved-application.component';
import { RejectedApplicationComponent } from './form-application/rejected-application/rejected-application.component';
import { RevertedApplicationComponent } from './form-application/reverted-application/reverted-application.component';
import { DynamicformsComponent } from './form-application/dynamicforms/dynamicforms.component';
import { NoteingComponent } from './form-application/noteing/noteing.component';
import { FormApplyComponent } from './form-application/form-apply/form-apply.component';
import { CardPolicyUpdateComponent } from './BSKY-Master/card-policy-update/card-policy-update.component';
import { NgChartsModule } from 'ng2-charts';
import { HospitalAuthClaimQryCPDComponent } from './hospital-auth-claim-qry-cpd/hospital-auth-claim-qry-cpd.component';
import { IncludesModule } from './form-application/includes/includes.module';
import { PatientReferalComponent } from './patient-referal/patient-referal.component';
import { UnprocessedforAdminComponent } from './unprocessedfor-admin/unprocessedfor-admin.component';
import { HospitalAuthClaimQrySNAComponent } from './hospital-auth-claim-qry-sna/hospital-auth-claim-qry-sna.component';
import { GrievanceByComponent } from './BSKY-Master/grievance-by/grievance-by.component';
import { GrievanceByViewComponent } from './BSKY-Master/grievance-by-view/grievance-by-view.component';
import { HospitalOperatorComponent } from './hospital/hospital-operator/hospital-operator.component';
import { ViewHospitalOperatorComponent } from './hospital/view-hospital-operator/view-hospital-operator.component';
import { GrievanceTypeComponent } from './BSKY-Master/grievance-type/grievance-type.component';
import { GrievanceTypevieComponent } from './BSKY-Master/grievance-typevie/grievance-typevie.component';
import { GrievanceMediumComponent } from './BSKY-Master/grievance-medium/grievance-medium.component';
import { CallCenterExecutiveAddComponent } from './call-center-executive-add/call-center-executive-add.component';
import { CallCenterExecutiveViewComponent } from './call-center-executive-view/call-center-executive-view.component';
import { NotConnectedAddComponent } from './not-connected-add/not-connected-add.component';
import { NotConnectedViewComponent } from './not-connected-view/not-connected-view.component';
import { PatientReferralViewComponent } from './patient-referral-view/patient-referral-view.component';
import { NonComplianceQuerySNAToSNAComponent } from './sna/non-compliance-query-snato-sna/non-compliance-query-snato-sna.component';
import { NonComplianceQuerySNAToSNAViewComponent } from './sna/non-compliance-query-snato-snaview/non-compliance-query-snato-snaview.component';
import { SnaexecutivemappingComponent } from './sno/snaexecutivemapping/snaexecutivemapping.component';
import { NoncompleincequeryreportComponent } from './noncompleincequeryreport/noncompleincequeryreport.component';
import { CpdactiontakenlogdetailsComponent } from './cpdactiontakenlogdetails/cpdactiontakenlogdetails.component';
import { GrievanceMediumViewComponent } from './BSKY-Master/grievance-medium-view/grievance-medium-view.component';
import { CDMOConfigurationComponent } from './cdmo/cdmo-configuration/cdmoconfiguration/cdmoconfiguration.component';
import { CdmoconfigurationdetailsComponent } from './cdmo/cdmoconfigurationdetails/cdmoconfigurationdetails/cdmoconfigurationdetails.component';
import { AbstractFloatGenerationComponent } from './float-generation/abstract-float-generation/abstract-float-generation.component';
import { HospitaldashboardComponent } from './dashboard/hospitaldashboard/hospitaldashboard.component';
import { BankMasterViewComponent } from './BSKY-Master/bank-master-view/bank-master-view.component';
import { ViewSnaExecutiveComponent } from './sno/view-sna-executive/view-sna-executive.component';
import { SnoapprovalComponent } from './sna/snoapproval/snoapproval.component';
import { SnoreapprovalComponent } from './sna/snoreapproval/snoreapproval.component';
import { CpdrejectedComponent } from './sna/cpdrejected/cpdrejected.component';
import { ViewPreauthApprovalComponent } from './view-preauth-approval/view-preauth-approval.component';
import { DcComplianceComponent } from './sna/dc-compliance/dc-compliance.component';
import { DcComplianceActionComponent } from './sna/dc-compliance-action/dc-compliance-action.component';
import { BankMasterComponent } from './BSKY-Master/bank-master/bank-master.component';
import { PostPaymentListComponent } from './Payment/post-payment-list/post-payment-list.component';
import { HospempanelmentdownlordpdfComponent } from './hospempanelmentdownlordpdf/hospempanelmentdownlordpdf.component';
import { SnaDashboardComponent } from './dashboard/sna-dashboard/sna-dashboard.component';
import { CpdactionComponent } from './CPD/claim_management/cpdaction/cpdaction.component';
import { CpdapprovalComponent } from './CPD/claim_management/cpdapproval/cpdapproval.component';
import { CpdreapprovalComponent } from './CPD/claim_management/cpdreapproval/cpdreapproval.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { SwathyaMitraHospitalConfigurationComponent } from './admin-console/swathya-mitra-hospital-configuration/swathya-mitra-hospital-configuration.component';
import { SwathyaMitraHospitalConfigurationViewComponent } from './admin-console/swathya-mitra-hospital-configuration-view/swathya-mitra-hospital-configuration-view.component';
import { MessageMasterComponent } from './BSKY-Master/message-master/message-master.component';
import { ViewMessageMasterComponent } from './BSKY-Master/view-message-master/view-message-master.component';
import { PaidreportComponent } from './paidreport/paidreport.component';
import { CpdNamewsiseCountReportComponent } from './cpd-namewsise-count-report/cpd-namewsise-count-report.component';
import { PendingGrievanceApplicationComponent } from './pending-grievance-application/pending-grievance-application.component';
import { GrievanceTakeActionComponent } from './form-application/grievance-take-action/grievance-take-action.component';
import { CpdnamewisedetailsComponent } from './cpdnamewisedetails/cpdnamewisedetails.component';
import { RunUnprocessedClaimComponent } from './run-unprocessed-claim/run-unprocessed-claim.component';
import { CpdDashboardComponent } from './dashboard/cpd-dashboard/cpd-dashboard.component';
import { FpOverrideViewComponent } from './fp-override-view/fp-override-view.component';
import { PaymentFreezeComponentUpdate } from './sna/payment-freeze/payment-freeze.component';
import { TsuCpdMappingComponent } from './tsu-report/tsu-cpd-mapping/tsu-cpd-mapping.component';
import { TsuSnaMappingComponent } from './tsu-report/tsu-sna-mapping/tsu-sna-mapping.component';
import { TsuDcMappingComponent } from './tsu-report/tsu-dc-mapping/tsu-dc-mapping.component';
import { TsuHospitalMasterComponent } from './tsu-report/tsu-hospital-master/tsu-hospital-master.component';
import { TsuCpdMasterComponent } from './tsu-report/tsu-cpd-master/tsu-cpd-master.component';
import { TsuUserMasterComponent } from './tsu-report/tsu-user-master/tsu-user-master.component';
import { PaymentFreezeActionComponent } from './Payment/payment-freeze-action/payment-freeze-action.component';
import { PaidinternalComponent } from '../paidinternal/paidinternal.component';
import { CceOutboundCallComponent } from './cce-outbound-call/cce-outbound-call.component';
import { PaymentFreezeViewComponent } from './Payment/payment-freeze-view/payment-freeze-view.component';
import { ActionWiseFloatGenerationComponent } from './float-generation/action-wise-float-generation/action-wise-float-generation.component';
import { CceOutboundCallViewComponent } from './cce-outbound-call-view/cce-outbound-call-view.component';
import { PaymentfrezzereportComponent } from './reports/paymentfrezzereport/paymentfrezzereport.component';
import { RemarksViewComponent } from './BSKY-Master/remarks-view/remarks-view.component';
import { RemarksAddComponent } from './BSKY-Master/remarks-add/remarks-add.component';
import { WardMasterViewComponent } from './BSKY-Master/ward-master-view/ward-master-view.component';
import { WarddetailsAddComponent } from './BSKY-Master/warddetails-add/warddetails-add.component';
import { WarddetailsViewComponent } from './BSKY-Master/warddetails-view/warddetails-view.component';
import { WardMasterComponent } from './BSKY-Master/ward-master/ward-master.component';
import { ApplicationGrievanceSummaryComponent } from './form-application/application-grievance-summary/application-grievance-summary.component';
import { GrievanceApplicationSummaryComponent } from './form-application/grievance-application-summary/grievance-application-summary.component';
import { GrievancePreviewComponent } from './form-application/grievance-preview/grievance-preview.component';
import { SummaryComponent } from './payment/summary/summary.component';
import { UnlockUserComponent } from './admin-console/unlock-user/unlock-user.component';
import { DgoCallCenterComponent } from './dgo-call-center/dgo-call-center.component';
import { DgoCallCenterViewComponent } from './dgo-call-center-view/dgo-call-center-view.component';
import { GrievanceApplicationCeoComponent } from './form-application/grievance-application-ceo/grievance-application-ceo.component';
import { InternalGrivanceComponent } from './internal-grivance/internal-grivance.component';
import { InternalGrievanceViewComponent } from './internal-grievance-view/internal-grievance-view.component';
import { RevertbyfodetailsComponent } from './payment/revertbyfodetails/revertbyfodetails.component';
import { GrievanceCCEViewComponent } from './grievance-cce-view/grievance-cce-view.component';
import { GrievanceCCEComponent } from './grievance-cce/grievance-cce.component';
import { SnawisependingreportComponent } from './snawisependingreport/snawisependingreport.component';
import { CceReportComponent } from './BSKY-Master/cce-report/cce-report.component';
import { CceReportTotalConnectedComponent } from './BSKY-Master/cce-report-total-connected/cce-report-total-connected.component';
import { SnawisependingreportdetailsComponent } from './snawisependingreportdetails/snawisependingreportdetails.component';
import { HospitalwiseFloatListComponent } from './Payment/hospitalwise-float-list/hospitalwise-float-list.component';
import { FloatNavComponent } from './shared/float-nav/float-nav.component';
import { SupervisorCceComponent } from './supervisor-cce/supervisor-cce.component';
import { SupervisorCceViewComponent } from './supervisor-cce-view/supervisor-cce-view.component';
import { OngoingTreatmentReportComponent } from './ongoing-treatment-report/ongoing-treatment-report.component';
import { HospitalwiseCcedataComponent } from './BSKY-Master/hospitalwise-ccedata/hospitalwise-ccedata.component';
import { ReAssignAddComponent } from './re-assign-add/re-assign-add.component';
import { ReAssignViewComponent } from './re-assign-view/re-assign-view.component';
import { OngoingtreatmentHospitalwiseReportComponent } from './ongoingtreatment-hospitalwise-report/ongoingtreatment-hospitalwise-report.component';
import { SnaPreauthDetailsComponent } from './sna-preauth-details/sna-preauth-details.component';
import { SmhospitalconfigurationComponent } from './smhospitalconfiguration/smhospitalconfiguration.component';
import { SmhospitalconfigurationviewComponent } from './smhospitalconfigurationview/smhospitalconfigurationview.component';
import { ReportMasterLinkComponent } from './admin-console/report-master-link/report-master-link.component';
import { CpdreceivedcountreportdetailsComponent } from './cpdreceivedcountreportdetails/cpdreceivedcountreportdetails.component';
import { RationCardSchedularReportComponent } from './ration-card-schedular-report/ration-card-schedular-report.component';
import { CheckcardbalanceComponent } from './reports/checkcardbalance/checkcardbalance.component';
import { ChechbeneficiaryComponent } from './reports/chechbeneficiary/chechbeneficiary.component';
import { RationCardSchedularDetailsReportComponent } from './ration-card-schedular-details-report/ration-card-schedular-details-report.component';
import { OldprocessedclaimlistComponent } from './sna/oldprocessedclaimlist/oldprocessedclaimlist.component';
import { OldprocessedclaimDetailsComponent } from './sna/oldprocessedclaim-details/oldprocessedclaim-details.component';
import { CpdwiseunprocessedComponent } from './cpdwiseunprocessed/cpdwiseunprocessed.component';
import { CpdwiseunprocesseddetailsComponent } from './cpdwiseunprocesseddetails/cpdwiseunprocesseddetails.component';
import { QcadminformComponent } from './qcadminform/qcadminform.component';
import { CpdwishospitalwisedetailspageComponent } from './cpdwishospitalwisedetailspage/cpdwishospitalwisedetailspage.component';
import { SnaExecHsptlFloatGenComponent } from './float-generation/sna-exec-hsptl-float-gen/sna-exec-hsptl-float-gen.component';
import { HospitalWisePackageDataReportComponent } from './reports/hospital-wise-package-data-report/hospital-wise-package-data-report.component';
import { SnaExecViewfloatrptComponent } from './float-generation/sna-exec-viewfloatrpt/sna-exec-viewfloatrpt.component';
import { OldclaimquerybysnaComponent } from './hospital/oldclaimquerybysna/oldclaimquerybysna.component';
import { OldclaimquerybysnadetailsComponent } from './hospital/oldclaimquerybysnadetails/oldclaimquerybysnadetails.component';
import { ApplicationSummeryQcComponent } from './form-application/application-summery-qc/application-summery-qc.component';
import { FloatReportComponent } from './Payment/float-report/float-report.component';
import { InternalcommAddComponent } from './Internal-Communication/internalcomm-add/internalcomm-add.component';
import { InternalcommViewComponent } from './Internal-Communication/internalcomm-view/internalcomm-view.component';
import { OldclaimResettlementComponent } from './sna/oldclaim-resettlement/oldclaim-resettlement.component';
import { OldclaimResettlementDetailsComponent } from './sna/oldclaim-resettlement-details/oldclaim-resettlement-details.component';
import { InternalcommTaskComponent } from './Internal-Communication/internalcomm-task/internalcomm-task.component';
import { BulkExtensionOfNonComplianceComponent } from './bulk-extension-of-non-compliance/bulk-extension-of-non-compliance.component';
import { GrievanceReportComponent } from './form-application/grievance-report/grievance-report.component';
import { SnaViewPreauthDetailsComponent } from './sna-view-preauth-details/sna-view-preauth-details.component';
import { SmcreateuserComponent } from './smcreateuser/smcreateuser.component';
import { SmviewuserComponent } from './smviewuser/smviewuser.component';
import { WalletRefundComponent } from './sna/wallet-refund/wallet-refund.component';
import { WalletRefundedClaimsComponent } from './sna/wallet-refunded-claims/wallet-refunded-claims.component';
import { PreauthCaseDetailsComponent } from '../preauth-case-details/preauth-case-details.component';
import { ClaimsOnHoldComponent } from './sna/claims-on-hold/claims-on-hold.component';
import { HoldactionComponent } from './sna/holdaction/holdaction.component';
import { QcadminformviewComponent } from './qcadminformview/qcadminformview.component';
import { SystemadminSnarejectedComponent } from './hospital/systemadmin-snarejected/systemadmin-snarejected.component';
import { DcDashboardComponent } from './dashboard/dc-dashboard/dc-dashboard.component';
import { SystemadminsnarejectedlistComponent } from './sna/systemadminsnarejectedlist/systemadminsnarejectedlist.component';
import { TestingProcessExecutionComponent } from './testing-process-execution/testing-process-execution.component';
import { TreamenthistorybyurnadhardetailsComponent } from './treamenthistorybyurnadhardetails/treamenthistorybyurnadhardetails.component';
import { UrnAuthenticationComponent } from './mo-seva-kendra/urn-authentication/urn-authentication.component';
import { UrnwiseactionreportDetailsComponent } from './reports/urnwiseactionreport-details/urnwiseactionreport-details.component';
import { FloatDistributionComponent } from './Payment/float-distribution/float-distribution.component';
import { RunsnawiseunprocessedComponent } from './runsnawiseunprocessed/runsnawiseunprocessed.component';
import { NonComplianceExtnviewComponent } from './non-compliance-extnview/non-compliance-extnview.component';
import { HospitalbackdateconfigComponent } from './BSKY-Master/hospitalbackdateconfig/hospitalbackdateconfig.component';
import { HospitalbackdateconfigviewComponent } from './BSKY-Master/hospitalbackdateconfigview/hospitalbackdateconfigview.component';
import { HospitalbackdateconfigviewreportComponent } from './BSKY-Master/hospitalbackdateconfigviewreport/hospitalbackdateconfigviewreport.component';
import { SNAWisePaymentStatusComponent } from './snawise-payment-status/snawise-payment-status.component';
import { CpdPaymentDetailsReportComponent } from './cpd-payment-details-report/cpd-payment-details-report.component';
import { DischargereportComponent } from './dischargereport/dischargereport.component';
import { HospitalwisesummaryreportComponent } from './hospitalwisesummaryreport/hospitalwisesummaryreport.component';
import { CpdactionwiseperformanceComponent } from './cpdactionwiseperformance/cpdactionwiseperformance.component';
import { GrievanceDashboardComponent } from './dashboard/grievance-dashboard/grievance-dashboard.component';
import { FloatVerifiedListComponent } from './Payment/float-verified-list/float-verified-list.component';
import { ViewVerifiedListComponent } from './Payment/view-verified-list/view-verified-list.component';
import { PaymentFreezeDetailsComponent } from './Payment/payment-freeze-details/payment-freeze-details.component';
import { CpdactionwiseperformancedetailsComponent } from './cpdactionwiseperformancedetails/cpdactionwiseperformancedetails.component';
import { ViewDistributionComponent } from './Payment/view-distribution/view-distribution.component';
import { OldClaimFloatgenerationComponent } from './float-generation/old-claim-floatgeneration/old-claim-floatgeneration.component';
import { OldClaimPostPaymentComponent } from './Payment/old-claim-post-payment/old-claim-post-payment.component';
import { OldClaimPaymentFreezeComponent } from './Payment/old-claim-payment-freeze/old-claim-payment-freeze.component';
import { OldFloatViewReportsComponent } from './float-generation/old-float-view-reports/old-float-view-reports.component';
import { SchedulerReportDetailsComponent } from './reports/scheduler-report-details/scheduler-report-details.component';
import { OldClaimPaymentViewComponent } from './Payment/old-claim-payment-view/old-claim-payment-view.component';
import { SnawiseClaimsubmitReportComponent } from './reports/snawise-claimsubmit-report/snawise-claimsubmit-report.component';
import { SnamonthwiseclaimsubmitreportComponent } from './reports/snamonthwiseclaimsubmitreport/snamonthwiseclaimsubmitreport.component';
import { ForemarkComponent } from './BSKY-Master/foremark/foremark.component';
import { ForemarkviewComponent } from './BSKY-Master/foremarkview/foremarkview.component';
import { HospitalwisedischargeandclaimComponent } from './reports/hospitalwisedischargeandclaim/hospitalwisedischargeandclaim.component';
import { CpdwisemaximumminimumlimitComponent } from './cpdwisemaximumminimumlimit/cpdwisemaximumminimumlimit.component';
import { EmpanelmentDetailUpdationComponent } from './empanelment-detail-updation/empanelment-detail-updation.component';
import { DBSchedulerReportComponent } from './dbscheduler-report/dbscheduler-report.component';
import { ViewcpdwisemaximumminimumlimitComponent } from './viewcpdwisemaximumminimumlimit/viewcpdwisemaximumminimumlimit.component';
import { PostPaymentReversalComponent } from './Payment/post-payment-reversal/post-payment-reversal.component';
import { DbschedulerdetailsreportComponent } from './dbschedulerdetailsreport/dbschedulerdetailsreport.component';
import { ShasqcDashbordComponent } from './dashboard/shasqc-dashbord/shasqc-dashbord.component';
import { HospitalincentivereportComponent } from './hospitalincentivereport/hospitalincentivereport.component';
import { HospitalincentivedetailsreportComponent } from './hospitalincentivedetailsreport/hospitalincentivedetailsreport.component';
import { MailServiceComponent } from './BSKY-Master/mail-service/mail-service.component';
import { MailServiceConfigurationComponent } from './configuration/mail-service-configuration/mail-service-configuration.component';
import { BlockedDataApprovalComponent } from './sna/old-blocked-data-monitoring/blocked-data-approval/blocked-data-approval.component';
import { BlockedDataApprovalDetailsComponent } from './sna/old-blocked-data-monitoring/blocked-data-approval-details/blocked-data-approval-details.component';
import { ViewBlockedDataApprovedComponent } from './sna/old-blocked-data-monitoring/view-blocked-data-approved/view-blocked-data-approved.component';
import { UpdateformapplyComponent } from './form-application/updateformapply/updateformapply.component';
import { UpdatedynamicformsComponent } from './form-application/updatedynamicforms/updatedynamicforms.component';
import { OldclaimQueryToHospitalToSNAComponent } from './sna/oldclaim-query-to-hospital-to-sna/oldclaim-query-to-hospital-to-sna.component';
import { OldclaimtrackingdetailsComponent } from './sna/oldclaimtrackingdetails/oldclaimtrackingdetails.component';
import { SnaOldclaimProcessedListComponent } from './sna/sna-oldclaim-processed-list/sna-oldclaim-processed-list.component';
import { OldReCLaimPendingAtSNAComponent } from './hospital/old-re-claim-pending-at-sna/old-re-claim-pending-at-sna.component';
import { HospitaldetailsComponent } from './BSKY-Master/hospitaldetails/hospitaldetails.component';
import { HospitalexclusionapplyComponent } from './hospitalexclusionapply/hospitalexclusionapply.component';
import { HospitalexclusionapproveComponent } from './hospitalexclusionapprove/hospitalexclusionapprove.component';
import { PostPaymentViewComponent } from './Payment/post-payment-view/post-payment-view.component';
import { EnableHospitalDischargeComponent } from './enable-hospital-discharge/enable-hospital-discharge.component';
import { HospitalinclusionapproveComponent } from './hospitalinclusionapprove/hospitalinclusionapprove.component';
import { HospitalinclusionapplyComponent } from './hospitalinclusionapply/hospitalinclusionapply.component';
import { HospitalcpdtaggingreportComponent } from './hospitalcpdtaggingreport/hospitalcpdtaggingreport.component';
import { FloatlistCeoComponent } from './Payment/floatlist-ceo/floatlist-ceo.component';
import { SnaReconsiderDetailsPageComponent } from './sna/sna-reconsider-details-page/sna-reconsider-details-page.component';
import { CpdremarkComponent } from './BSKY-Master/cpdremark/cpdremark.component';
import { CpdremarkviewComponent } from './BSKY-Master/cpdremarkview/cpdremarkview.component';
import { SnaremarkComponent } from './BSKY-Master/snaremark/snaremark.component';
import { SnaremarkviewComponent } from './BSKY-Master/snaremarkview/snaremarkview.component';
import { ApplicationGrievanceSummaryCDMOComponent } from './form-application/application-grievance-summary-cdmo/application-grievance-summary-cdmo.component';
import { GrievanceTakeActionCDMOComponent } from './form-application/grievance-take-action-cdmo/grievance-take-action-cdmo.component';
import { GrievanceApplicationSummaryCDMOComponent } from './form-application/grievance-application-summary-cdmo/grievance-application-summary-cdmo.component';
import { RunsnawiseunprocessedviewComponent } from './runsnawiseunprocessedview/runsnawiseunprocessedview.component';
import { HospitalwiseongoingtreatmentdetailsComponent } from './hospitalwiseongoingtreatmentdetails/hospitalwiseongoingtreatmentdetails.component';
import { BenificaryGenderWiseComponent } from './reports/benificary-gender-wise/benificary-gender-wise.component';
import { BenificiaryGenderWiseDtlsComponent } from './reports/benificiary-gender-wise-dtls/benificiary-gender-wise-dtls.component';
import { BenificiaryGenderGramWiseDtlsComponent } from './reports/benificiary-gender-gram-wise-dtls/benificiary-gender-gram-wise-dtls.component';
import { BenificiaryVillageDtlsComponent } from './reports/benificiary-village-dtls/benificiary-village-dtls.component';
import { BenificaryDetailsComponent } from './reports/benificary-details/benificary-details.component';
import { AuthenticationonlivestatusComponent } from './authenticationonlivestatus/authenticationonlivestatus.component';
import { HospitalauthenticationdetailsComponent } from './reports/hospitalauthenticationdetails/hospitalauthenticationdetails.component';
import { PackagewisedischargeclaimComponent } from './reports/packagewisedischargeclaim/packagewisedischargeclaim.component';
import { PackagewisedischargeclaimdetailsComponent } from './reports/packagewisedischargeclaimdetails/packagewisedischargeclaimdetails.component';
import { CreatereferaldoctoruserComponent } from './Referral/createreferaldoctoruser/createreferaldoctoruser.component';
import { ReferalDoctorConfigurationComponent } from './Referral/referal-doctor-configuration/referal-doctor-configuration.component';
import { ViewreferaldoctoruserComponent } from './Referral/viewreferaldoctoruser/viewreferaldoctoruser.component';
import { ReferalDoctorConfigurationviewComponent } from './Referral/referal-doctor-configurationview/referal-doctor-configurationview.component';
import { ReferralresonComponent } from './Referral/referralreson/referralreson.component';
import { PackagebenificiarydtlsComponent } from './reports/packagebenificiarydtls/packagebenificiarydtls.component';
import { CpdMappingReportComponent } from './reports/cpd-mapping-report/cpd-mapping-report.component';
import { PaymentfreezreportComponent } from './reports/paymentfreezreport/paymentfreezreport.component';
import { CpdReportDtlsComponent } from './CPD/mis_report/cpd-report-dtls/cpd-report-dtls.component';
import { BlockedcaselogdetailsreportComponent } from './blockedcaselogdetailsreport/blockedcaselogdetailsreport.component';
import { UnprocessedsummarydetailsComponent } from './unprocessedsummarydetails/unprocessedsummarydetails.component';
import { MnthWiseDischargeMeComponent } from './reports/mnth-wise-discharge-me/mnth-wise-discharge-me.component';
import { MnthWiseDischargeMedtlsComponent } from './reports/mnth-wise-discharge-medtls/mnth-wise-discharge-medtls.component';
import { MemnthDischargeDetailsComponent } from './reports/memnth-discharge-details/memnth-discharge-details.component';
import { ReferralHospitalComponent } from './Referral/referral-hospital/referral-hospital.component';
import { ReferralHospitalviewComponent } from './Referral/referral-hospitalview/referral-hospitalview.component';
import { HospitaltypemasterComponent } from './Referral/hospitaltypemaster/hospitaltypemaster.component';
import { DynamicConfigurationAddComponent } from './dynamicreport/dynamic-configuration-add/dynamic-configuration-add.component';
import { DynamicConfigurationViewComponent } from './dynamicreport/dynamic-configuration-view/dynamic-configuration-view.component';
import { DynamicReportComponent } from './dynamicreport/dynamic-report/dynamic-report.component';
import { SearchTextHighlighterPipe } from './pipes/search-text-highlighter.pipe';
import { DynamicreportdetailsComponent } from './dynamicreport/dynamicreportdetails/dynamicreportdetails.component';
import { SnaremarkwiseactionComponent } from './snaremarkwiseaction/snaremarkwiseaction.component';
import { DynamicreportclaimdetailsComponent } from './dynamicreport/dynamicreportclaimdetails/dynamicreportclaimdetails.component';
import { MeclaimdetailsComponent } from './dynamicreport/meclaimdetails/meclaimdetails.component';
import { MeactiontakenviewComponent } from './dynamicreport/meactiontakenview/meactiontakenview.component';
import { CasespecificreportComponent } from './dynamicreport/casespecificreport/casespecificreport.component';
import { GrievanceCceResettlementComponent } from './grievance-cce-resettlement/grievance-cce-resettlement.component';
import { DgoQueryBucketComponent } from './dgo-query-bucket/dgo-query-bucket.component';
import { GrievanceMskComponent } from './grievance-msk/grievance-msk.component';
import { MosarkarreportComponent } from './mosarkarreport/mosarkarreport.component';
import { GrievanceQueryForDGOComponent } from './form-application/grievance-query-for-dgo/grievance-query-for-dgo.component';
import { GrievanceQuerySettleForGOComponent } from './form-application/grievance-query-settle-for-go/grievance-query-settle-for-go.component';
import { DCInitialTakeActionComponent } from './dcinitial-take-action/dcinitial-take-action.component';
import { DGOInitialTakeActionComponent } from './dgoinitial-take-action/dgoinitial-take-action.component';
import { GOInitialTakeActionComponent } from './goinitial-take-action/goinitial-take-action.component';
import { HospitalenrollmentlistComponent } from './hospitalenrollmentlist/hospitalenrollmentlist.component';
import { EnrollmentdetailsComponent } from './enrollmentdetails/enrollmentdetails.component';
import { FilterPipe } from './filter.pipe';
import { RecomplyenrollmentComponent } from './recomplyenrollment/recomplyenrollment.component';
import { HospitalotpconfigurationComponent } from './hospitalotpconfiguration/hospitalotpconfiguration.component';
import { DGODashboardComponent } from './dashboard/dgodashboard/dgodashboard.component';
import { OldBlockDatareportComponent } from './reports/old-block-datareport/old-block-datareport.component';
import { OldBlockDatareportListComponent } from './reports/old-block-datareport-list/old-block-datareport-list.component';
import { SurgicalMedicalMappingComponent } from './surgical-medical-mapping/surgical-medical-mapping.component';
import { UsermanualuploadsectionComponent } from './usermanualuploadsection/usermanualuploadsection.component';
import { ViewusermanuluploadsectionComponent } from './viewusermanuluploadsection/viewusermanuluploadsection.component';
import { UsermanualdownloadComponent } from './usermanualdownload/usermanualdownload.component';
import { GrievanceCCEFeedbackReportComponent } from './grievance-ccefeedback-report/grievance-ccefeedback-report.component';
import { HospitalSpecilityAddComponent } from './BSKY-Master/hospital-specility-add/hospital-specility-add.component';
import { HospitalCivilinfraAddComponent } from './BSKY-Master/hospital-civilinfra-add/hospital-civilinfra-add.component';
import { HospitaldoctorprofileComponent } from './hospitaldoctorprofile/hospitaldoctorprofile.component';
import { HospitaldoctorprofileviewComponent } from './hospitaldoctorprofileview/hospitaldoctorprofileview.component';
import { SpecialityWiseDistrictReportComponent } from './reports/speciality-wise-district-report/speciality-wise-district-report.component';
import { HospitalCivilInfraViewComponent } from './BSKY-Master/hospital-civil-infra-view/hospital-civil-infra-view.component';
import { HospitalCivilInfraViewDetailsComponent } from './BSKY-Master/hospital-civil-infra-view-details/hospital-civil-infra-view-details.component';
import { HospitalspecialistupdationreportComponent } from './BSKY-Master/hospitalspecialistupdationreport/hospitalspecialistupdationreport.component';
import { TreatingdoctorrconfigurationComponent } from './treatingdoctorrconfiguration/treatingdoctorrconfiguration.component';
import { SmfaceregistrationComponent } from './smfaceregistration/smfaceregistration.component';
import { DbschedulerAddComponent } from './dbscheduler-add/dbscheduler-add.component';
import { DbschedulerViewComponent } from './dbscheduler-view/dbscheduler-view.component';
import { SmfaceregistrationviewComponent } from './smfaceregistrationview/smfaceregistrationview.component';
import { GrievanceMskViewComponent } from './grievance-msk-view/grievance-msk-view.component';
import { TreatingdoctorlogComponent } from './treatingdoctorlog/treatingdoctorlog.component';
import { UnboundlingpackageAddComponent } from './unboundlingpackage-add/unboundlingpackage-add.component';
import { UnboundlingpackageViewComponent } from './unboundlingpackage-view/unboundlingpackage-view.component';
import { MnthWiseFloatdtlsRertComponent } from './reports/mnth-wise-floatdtls-rert/mnth-wise-floatdtls-rert.component';
import { ExpiredBeneficiaryRprtComponent } from './reports/expired-beneficiary-rprt/expired-beneficiary-rprt.component';
import { ExpiredbeneficiaryDtlsComponent } from './reports/expiredbeneficiary-dtls/expiredbeneficiary-dtls.component';
import { MultipledoctortreatedbysamedoctorComponent } from './multipledoctortreatedbysamedoctor/multipledoctortreatedbysamedoctor.component';
import { MedicalinfracategoryComponent } from './HE-Master/medicalinfracategory/medicalinfracategory.component';
import { MedicalinfracategoryviewComponent } from './HE-Master/medicalinfracategoryview/medicalinfracategoryview.component';
import { MedicalinfrasubcategoryaddComponent } from './HE-Master/medicalinfrasubcategoryadd/medicalinfrasubcategoryadd.component';
import { MedicalinfrasubcategoryviewComponent } from './HE-Master/medicalinfrasubcategoryview/medicalinfrasubcategoryview.component';
import { TypeofexpertiseComponent } from './HE-Master/typeofexpertise/typeofexpertise.component';
import { TypeofexpertiseviewComponent } from './HE-Master/typeofexpertiseview/typeofexpertiseview.component';
import { MedicalExpertiseMasterComponent } from './HE-Master/medical-expertise-master/medical-expertise-master.component';
import { MedicalExpertiseMasterViewComponent } from './HE-Master/medical-expertise-master-view/medical-expertise-master-view.component';
import { FacilityDetailMasterComponent } from './HE-Master/facility-detail-master/facility-detail-master.component';
import { FacilityDetailViewComponent } from './HE-Master/facility-detail-view/facility-detail-view.component';
import { SearchbynameComponent } from './searchbyname/searchbyname.component';
import { MakeAliveBeneficiaryRptComponent } from './reports/make-alive-beneficiary-rpt/make-alive-beneficiary-rpt.component';
import { CpdPaymentCalculationComponent } from "./reports/cpd-payment-calculation/cpd-payment-calculation.component";
import { OldblockGenericSearchComponent } from './misreports/oldblock-generic-search/oldblock-generic-search.component';
import { OldblockDataViewlistComponent } from './misreports/oldblock-data-viewlist/oldblock-data-viewlist.component';
import { OldblockDataViewdetailsComponent } from './misreports/oldblock-data-viewdetails/oldblock-data-viewdetails.component';
import { PackageUpdationComponent } from './BSKY-Master/package-updation/package-updation.component';
import { HospitalSpecilityQcApprovalComponent } from './hospital-specility-qc-approval/hospital-specility-qc-approval.component';
import { BlockwisetreetmentdatareportComponent } from './misreports/blockwisetreetmentdatareport/blockwisetreetmentdatareport.component';
import { GpwisetreetmentdatareportComponent } from './misreports/gpwisetreetmentdatareport/gpwisetreetmentdatareport.component';
import { VillagewisetreetmentdatareportComponent } from './misreports/villagewisetreetmentdatareport/villagewisetreetmentdatareport.component';
import { OldclmprocessblockrprtComponent } from './reports/oldclmprocessblockrprt/oldclmprocessblockrprt.component';
import { OldprocessdischargerptComponent } from './reports/oldprocessdischargerpt/oldprocessdischargerpt.component';
import { ProcedureTaggingComponent } from './BSKY-Master/procedure-tagging/procedure-tagging.component';
import { HospitalSpecialityQcApprovalViewComponent } from './hospital/hospital-speciality-qc-approval-view/hospital-speciality-qc-approval-view.component';
import { ApprovalstatusreportComponent } from './BSKY-Master/approvalstatusreport/approvalstatusreport.component';
import { IcdConfigComponent } from './icd-config/icd-config.component';
import { SnafloaterevertComponent } from './snafloaterevert/snafloaterevert.component';
import { HospitalloginotpconfigurationComponent } from './hospitalloginotpconfiguration/hospitalloginotpconfiguration.component';
import { SnabulkapprovedrevertComponent } from './snabulkapprovedrevert/snabulkapprovedrevert.component';
import { FunctionMasterUnlinkedComponent } from './admin-console/function-master-unlinked/function-master-unlinked.component';
import { ViewFunctionMasterUnlinkedComponent } from './admin-console/view-function-master-unlinked/view-function-master-unlinked.component';
import { HospitalOperatorApprovalComponent } from './hospital-operator-approval/hospital-operator-approval.component';
import { HospitalOperatorListreportComponent } from './hospital-operator-listreport/hospital-operator-listreport.component';
import { HospitaloperatorprofileComponent } from './profile/hospitaloperatorprofile/hospitaloperatorprofile.component';
import { AbstractmereportComponent } from './dynamicreport/abstractmereport/abstractmereport.component';
import { SnawisepreauthactiondetailsComponent } from './snawisepreauthactiondetails/snawisepreauthactiondetails.component';
import { DctaggedreportComponent } from './reports/dctaggedreport/dctaggedreport.component';
import { UserOtpRequiredComponent } from './BSKY-Master/user-otp-required/user-otp-required.component';
import { DbschedulerLogComponent } from './dbscheduler-log/dbscheduler-log.component';
import { SnafloatedetailsforrevertComponent } from './snafloatedetailsforrevert/snafloatedetailsforrevert.component';
import { SnaapplyforunfrezefloateoldComponent } from './snaapplyforunfrezefloateold/snaapplyforunfrezefloateold.component';
import { SnaappliedlistforunfreezefloateComponent } from './snaappliedlistforunfreezefloate/snaappliedlistforunfreezefloate.component';
import { SupervisorCceDCRevertedComponent } from './supervisor-cce-dcreverted/supervisor-cce-dcreverted.component';
import { DynamicreportsubdetailsComponent } from './dynamicreport/dynamicreportsubdetails/dynamicreportsubdetails.component';
import { CCEOutboundCallShasCEOComponent } from './cceoutbound-call-shas-ceo/cceoutbound-call-shas-ceo.component';
import { QuestionmasterComponent } from './survey-form/questionmaster/questionmaster.component';
import { SurveymasterComponent } from './survey-form/surveymaster/surveymaster.component';
import { QuestionmasterviewComponent } from './survey-form/questionmasterview/questionmasterview.component';
import { SurveymasterviewComponent } from './survey-form/surveymasterview/surveymasterview.component';
import { SurveygoupmappingComponent } from './survey-form/surveygoupmapping/surveygoupmapping.component';
import { SurveygoupmappingviewComponent } from './survey-form/surveygoupmappingview/surveygoupmappingview.component';
import { SurveyquestionmappingComponent } from './survey-form/surveyquestionmapping/surveyquestionmapping.component';
import { SurveyquestionmappingviewComponent } from './survey-form/surveyquestionmappingview/surveyquestionmappingview.component';
import { TriggerReportforuserComponent } from './dynamicreport/trigger-reportforuser/trigger-reportforuser.component';
import { ClaimProcessedActionComponent } from './sna/claim-processed-action/claim-processed-action.component';
import { UrnwiseDetailsActionComponent } from './sna/urnwise-details-action/urnwise-details-action.component';
import { SystemAdminSnaRejectedActionComponent } from './sna/system-admin-sna-rejected-action/system-admin-sna-rejected-action.component';
import { PackagecalculatorComponent } from './packagecalculator/packagecalculator.component';
import { SpecialfloateverificationreportComponent } from './specialfloateverificationreport/specialfloateverificationreport.component';
import { HospitalenrollmentactiontakenreportComponent } from './hospitalenrollmentactiontakenreport/hospitalenrollmentactiontakenreport.component';
import { OldClaimProgressReportComponent } from './old-claim-progress-report/old-claim-progress-report.component';
import { OldClaimProgressReportDetailsComponent } from './old-claim-progress-report-details/old-claim-progress-report-details.component';
import { CpdDraftComponent } from './CPD/claim_management/cpd-draft/cpd-draft.component';
import { CpdDraftActionComponent } from './CPD/claim_management/cpd-draft-action/cpd-draft-action.component';
import { CpdhosptaltaggingreportComponent } from './sno/cpdhosptaltaggingreport/cpdhosptaltaggingreport.component';
import { CpdspecialitymappingComponent } from './sno/cpdspecialitymapping/cpdspecialitymapping.component';
import { CpdspecialitymappingviewComponent } from './sno/cpdspecialitymappingview/cpdspecialitymappingview.component';
import { CpdspecialitysummaryreportComponent } from './sno/cpdspecialitysummaryreport/cpdspecialitysummaryreport.component';
import { ClaimDraftViewReportComponent } from './reports/claim-draft-view-report/claim-draft-view-report.component';
import { StatedashboareddataComponent } from './statedashboareddata/statedashboareddata.component';
import { ImplantprocedureconfigComponent } from './implantprocedureconfig/implantprocedureconfig.component';
import { ImplantprocedureconfigviewComponent } from './implantprocedureconfigview/implantprocedureconfigview.component';
import { SmhelpdeskregisterrptComponent } from './swasthyamitrareview/smhelpdeskregisterrpt/smhelpdeskregisterrpt.component';
import { SmpendingreportComponent } from './swasthyamitrareview/smpendingreport/smpendingreport.component';
import { SmscoringComponent } from './swasthyamitrareview/smscoring/smscoring.component';
import { SmscoringviewComponent } from './swasthyamitrareview/smscoringview/smscoringview.component';
import { SmscoringreportComponent } from './swasthyamitrareview/smscoringreport/smscoringreport.component';
import { CpdEmpanelRequestListComponent } from './CPD/hr/cpd-empanel-request-list/cpd-empanel-request-list.component';
import { CpdFreshApplicationDetailsComponent } from './CPD/hr/cpd-fresh-application-details/cpd-fresh-application-details.component';
import { CpdEmpanelViewComponent } from './CPD/hr/cpd-empanel-view/cpd-empanel-view.component';
import { CpdECardInfoComponent } from './CPD/hr/cpd-e-card-info/cpd-e-card-info.component';
import { CpdEmpaneledApprovedListComponent } from './CPD/hr/cpd-empaneled-approved-list/cpd-empaneled-approved-list.component';
import { CpdEmpaneledApproveDetailsComponent } from './CPD/hr/cpd-empaneled-approve-details/cpd-empaneled-approve-details.component';
import { PackageTaggingReportComponent } from './BSKY-Master/package-tagging-report/package-tagging-report.component';
import { SwasthyaMitraGeoTaggingComponent } from './BSKY-Master/swasthya-mitra-geo-tagging/swasthya-mitra-geo-tagging.component';
import { CpdregistrationpreviewdetailspreviewComponent } from './CPD/hr/cpdregistrationpreviewdetailspreview/cpdregistrationpreviewdetailspreview.component';
import { CpdEmpaneledViewListComponent } from './CPD/hr/cpd-empaneled-view-list/cpd-empaneled-view-list.component';
import { SmincentivereportComponent } from './swasthyamitrareview/smincentivereport/smincentivereport.component';
import { CpdPostPaymentComponent } from './CPD/payment/cpd-post-payment/cpd-post-payment.component';
import { CpdPostPaymentViewComponent } from './CPD/payment/cpd-post-payment-view/cpd-post-payment-view.component';
import { HospitalSpecialityRequestComponent } from './hospital-speciality-request/hospital-speciality-request.component';
import { ViewSpecialityRequestComponent } from './view-speciality-request/view-speciality-request.component';
import { SpecialityRequestDetailsComponent } from './speciality-request-details/speciality-request-details.component';
import { MobilenouupdateComponent } from './admin-console/mobilenouupdate/mobilenouupdate.component';
import { MoboilenoupdatelogComponent } from './admin-console/moboilenoupdatelog/moboilenoupdatelog.component';
import { SchemewisepackagemappingComponent } from './schemewisepackagemapping/schemewisepackagemapping.component';
import { SchemewisehospitalmappingreportComponent } from './schemewisehospitalmappingreport/schemewisehospitalmappingreport.component';
import { DcCdmomappingComponent } from './dc/dc-cdmomapping/dc-cdmomapping.component';
import { DcCdmomappingviewComponent } from './dc/dc-cdmomappingview/dc-cdmomappingview.component';
import { CheckCardBalanceLogComponent } from './reports/check-card-balance-log/check-card-balance-log.component';
import { AssemblyConstituencyReportComponent } from './assembly-constituency-report/assembly-constituency-report.component';
import { MDRmasterComponent } from './MDR_Master/mdrmaster/mdrmaster.component';
import { MdrmasterviewComponent } from './MDR_Master/mdrmasterview/mdrmasterview.component';

import { OutOfPocketExpenditureComponent } from './out-of-pocket-expenditure/out-of-pocket-expenditure.component';
import { OutOfPocketExpenditureviewComponent } from './out-of-pocket-expenditureview/out-of-pocket-expenditureview.component';

import { MdrproceduremappingComponent } from './MDR_Master/mdrproceduremapping/mdrproceduremapping.component';
import { DcHospitalmappingComponent } from './dc/dc-hospitalmapping/dc-hospitalmapping.component';
import { DcHospitalmappingviewComponent } from './dc/dc-hospitalmappingview/dc-hospitalmappingview.component';
import { WhatsappuserConfigurationComponent } from './whatsappuser-configuration/whatsappuser-configuration.component';
import { WhatsappUserConfigurationViewComponent } from './whatsapp-user-configuration-view/whatsapp-user-configuration-view.component';
import { MdrprodeduremappingviewComponent } from './MDR_Master/mdrprodeduremappingview/mdrprodeduremappingview.component';
import { DcfaceregistrationComponent } from './dc/dcfaceregistration/dcfaceregistration.component';
import { DcfaceregistrationviewComponent } from './dc/dcfaceregistrationview/dcfaceregistrationview.component';
import { TaggingHistoryComponent } from './tagging-history/tagging-history.component';
import { PostmasterAddComponent } from './postmaster-add/postmaster-add.component';
import { PostmasterViewComponent } from './postmaster-view/postmaster-view.component';
import { OnlinePostConfigurationComponent } from './online-post-configuration/online-post-configuration.component';
import { OnlinePostConfigurationViewComponent } from './online-post-configuration-view/online-post-configuration-view.component';
import { AllowfohospitalattedanceComponent } from './dc/allowfohospitalattedance/allowfohospitalattedance.component';
import { DraftFloatListComponent } from './Payment/draft-float-list/draft-float-list.component';
import { FloatlistCeoviewComponent } from './Payment/floatlist-ceoview/floatlist-ceoview.component';
import { OldclaimNoncomplianceComponent } from './sna/oldclaim-noncompliance/oldclaim-noncompliance.component';
import { PostpaymentnewComponent } from './Payment/postpaymentnew/postpaymentnew.component';
import { OldblockcasesComponent } from './oldblockcases/oldblockcases.component';
import { FloatlistdetailsComponent } from './floatlistdetails/floatlistdetails.component';
import { ManagedduplicatedbenbeneficiaryComponent } from './managedduplicatedbenbeneficiary/managedduplicatedbenbeneficiary.component';
import { CurrencyInrPipe } from './pipes/currency-inr.pipe';
import { HospitalUidAuthConfigurationComponent } from './admin-console/hospital-uid-auth-configuration/hospital-uid-auth-configuration.component';
import { TemporaryOverrideCodeComponent } from './admin-console/temporary-override-code/temporary-override-code.component';
import { TemporaryOverrideCodeViewComponent } from './admin-console/temporary-override-code-view/temporary-override-code-view.component';
import { HospitalUidAuthConfigurationViewComponent } from './admin-console/hospital-uid-auth-configuration-view/hospital-uid-auth-configuration-view.component';
import { ManageduplicatebenificaryviewComponent } from './manageduplicatebenificaryview/manageduplicatebenificaryview.component';
import { HospitalDeactivationProcessComponent } from './BSKY-Master/hospital-deactivation-process/hospital-deactivation-process.component';
import { HospitalDeactivionProcessviewComponent } from './BSKY-Master/hospital-deactivion-processview/hospital-deactivion-processview.component';
import { PartialClaimRaisedComponent } from './hospital/partial-claim-raised/partial-claim-raised.component';
import { PartialClaimSnoapprovalComponent } from './sna/partial-claim-snoapproval/partial-claim-snoapproval.component';
import { PartialClaimApprovalDetailsComponent } from './sna/partial-claim-approval-details/partial-claim-approval-details.component';
import { GrieancePartiaalClaimComponent } from './Partial-Float/grieance-partiaal-claim/grieance-partiaal-claim.component';
import { PartialclaimraiseComponent } from './Partial-Float/partialclaimraise/partialclaimraise.component';
import { PartialclaimraisedetailsComponent } from './Partial-Float/partialclaimraisedetails/partialclaimraisedetails.component';
import { PartialclaimraiseviewComponent } from './Partial-Float/partialclaimraiseview/partialclaimraiseview.component';
import { NewfreshraisclaimedComponent } from './NewHospitalRaisedClaim/newfreshraisclaimed/newfreshraisclaimed.component';
import { SnaLeaveApplyComponent } from './HR/sna-leave-apply/sna-leave-apply.component';
import { SnaLeaveViewComponent } from './HR/sna-leave-view/sna-leave-view.component';
import { CasewiseHospitalclaimSubmitComponent } from './NewHospitalRaisedClaim/casewise-hospitalclaim-submit/casewise-hospitalclaim-submit.component';
import { PartialClaimDcComplianceComponent } from './sna/partial-claim-dc-compliance/partial-claim-dc-compliance.component';
import { PcDcComplianceActionComponent } from './sna/pc-dc-compliance-action/pc-dc-compliance-action.component';
import { PartialClaimDcComponent } from './Partial-Float/partial-claim-dc/partial-claim-dc.component';
import { PartialClaimDcDetailsComponent } from './Partial-Float/partial-claim-dc-details/partial-claim-dc-details.component';
import { PartialClaimDcViewComponent } from './Partial-Float/partial-claim-dc-view/partial-claim-dc-view.component';
import { PartialClaimSnoReapprovalComponent } from './sna/partial-claim-sno-reapproval/partial-claim-sno-reapproval.component';
import { PcSnoReapprovalActionComponent } from './sna/pc-sno-reapproval-action/pc-sno-reapproval-action.component';
import { PartialClaimQuereidComponent } from './Partial-Float/partial-claim-quereid/partial-claim-quereid.component';
import { PartialClaimSnaViewComponent } from './Partial-Float/partial-claim-sna-view/partial-claim-sna-view.component';
import { PartialClaimSnaViewDetailsComponent } from './Partial-Float/partial-claim-sna-view-details/partial-claim-sna-view-details.component';
import { PartialClaimHospitalNoncomplianceComponent } from './Partial-Float/partial-claim-hospital-noncompliance/partial-claim-hospital-noncompliance.component';
import { PartialClaimDcNoncomplianceComponent } from './Partial-Float/partial-claim-dc-noncompliance/partial-claim-dc-noncompliance.component';
import { FreshClaimAllocationComponent } from './CPD/claim_management/fresh-claim-allocation/fresh-claim-allocation.component';
import { ManualCpdAllotmentComponent } from './CPD/manual-cpd-allotment/manual-cpd-allotment.component';
import { MobileAttendanceMasterComponent } from './mobile-attendance-master/mobile-attendance-master.component';
import { MobileAttendanceMasterViewComponent } from './mobile-attendance-master-view/mobile-attendance-master-view.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CasewiseHospitalQueriedbycpdComponent } from './NewHospitalRaisedClaim/casewise-hospital-queriedbycpd/casewise-hospital-queriedbycpd.component';
import { CasewiseQueriedbycpdsubmitComponent } from './NewHospitalRaisedClaim/casewise-queriedbycpdsubmit/casewise-queriedbycpdsubmit.component';
import { CpdfreshcaseDetailsComponent } from './CPD/claim_management/cpdfreshcase-details/cpdfreshcase-details.component';
import { CpdfreshclaimDetailsComponent } from './CPD/claim_management/cpdfreshclaim-details/cpdfreshclaim-details.component';
import { HospitalFaceauthRadiousConfigComponent } from './BSKY-Master/hospital-faceauth-radious-config/hospital-faceauth-radious-config.component';
import { FreshClaimDetailsComponent } from './sna/claim-management/fresh-claim-details/fresh-claim-details.component';

import { ShasceoDashboardComponent } from './dashboard/shasceo-dashboard/shasceo-dashboard.component';
import { CasewisehospitalqueriedbysnaComponent } from './NewHospitalRaisedClaim/casewisehospitalqueriedbysna/casewisehospitalqueriedbysna.component';
import { CasewiseQueriedbysnasubmitComponent } from './NewHospitalRaisedClaim/casewise-queriedbysnasubmit/casewise-queriedbysnasubmit.component';
import { CasewiseNonUploadingInitialDocumentComponent } from './NewHospitalRaisedClaim/casewise-non-uploading-initial-document/casewise-non-uploading-initial-document.component';
import { FreshClaimCaseDetailsComponent } from './sna/claim-management/fresh-claim-case-details/fresh-claim-case-details.component';
import { SnaCpdInvestigatedlistComponent } from './sna/claim-management/sna-cpd-investigatedlist/sna-cpd-investigatedlist.component';
import { CpdCaseResettlementComponent } from './CPD/claim_management/cpd-case-resettlement/cpd-case-resettlement.component';
import { CpdCaseResettlementActionComponent } from './CPD/claim_management/cpd-case-resettlement-action/cpd-case-resettlement-action.component';
import { CpdrejectiontohospitalComponent } from './NewHospitalRaisedClaim/cpdrejectiontohospital/cpdrejectiontohospital.component';
import { CpdrejectiontohospitaldetailsComponent } from './NewHospitalRaisedClaim/cpdrejectiontohospitaldetails/cpdrejectiontohospitaldetails.component';
import { SnaClaimDetailsViewComponent } from './sna/claim-management/sna-claim-details-view/sna-claim-details-view.component';
import { SnaCaseResettlemntComponent } from './sna/claim-management/sna-case-resettlemnt/sna-case-resettlemnt.component';
import { SnaCaseClaimActionResettlementComponent } from './sna/claim-management/sna-case-claim-action-resettlement/sna-case-claim-action-resettlement.component';
import { NoncompliancecpdquerytohospitalComponent } from './NewHospitalRaisedClaim/noncompliancecpdquerytohospital/noncompliancecpdquerytohospital.component';
import { NoncompliancesnaquerytohospitalComponent } from './NewHospitalRaisedClaim/noncompliancesnaquerytohospital/noncompliancesnaquerytohospital.component';
import { CpdCaseReconsiderComponent } from './CPD/claim_management/cpd-case-reconsider/cpd-case-reconsider.component';
import { CpdCaseReconsiderActionComponent } from './CPD/claim_management/cpd-case-reconsider-action/cpd-case-reconsider-action.component';
import { TimerLeft } from './pipes/timerleft.pipe';
import { ExtnsnStayApproveListComponent } from './sna/extnsn-stay-approve-list/extnsn-stay-approve-list.component';
import { ExtnsnStayAprvDetailsComponent } from './sna/extnsn-stay-aprv-details/extnsn-stay-aprv-details.component';
import { CsmdcconfigurationComponent } from './csmdcconfiguration/csmdcconfiguration.component';
import { CsmdcconfigurationviewComponent } from './csmdcconfigurationview/csmdcconfigurationview.component';
import { CeoDashboardComponent } from './dashboard/ceo-dashboard/ceo-dashboard.component';
import { ExtensionOfStayViewComponent } from './sna/extension-of-stay-view/extension-of-stay-view.component';
import { DcgeetagconfigComponent } from './dc/dcgeetagconfig/dcgeetagconfig.component';
import { UsermobiletrackingConfigComponent } from './dc/usermobiletracking-config/usermobiletracking-config.component';
import { WardChangeComponent } from './ward-change/ward-change.component';
import { WardChangeApvDtlsComponent } from './ward-change-apv-dtls/ward-change-apv-dtls.component';
import { WardChangeApvViewComponent } from './ward-change-apv-view/ward-change-apv-view.component';
import { CsmdcstatendistrictmappingComponent } from './csmdcstatendistrictmapping/csmdcstatendistrictmapping.component';
import { CsmdcstatendistrictmappingviewComponent } from './csmdcstatendistrictmappingview/csmdcstatendistrictmappingview.component';
import { AuthIrisFingerComponent } from './auth-iris-finger/auth-iris-finger.component';

@NgModule({
  declarations: [
    ApplicationComponent,
    AppheaderComponent,
    AppfooterComponent,
    AppsidebarComponent,
    AddComponent,
    ViewComponent,
    UtiliteComponent,
    ClaimraiseComponent,
    ClaimraisedetailsComponent,
    PendingclaimComponent,
    QueryComponent,
    PaidComponent,
    CreatesnoComponent,
    CreatecpdComponent,
    TurncatepipePipe,
    SnoapprovalComponent,
    ForgotpasswordComponent,
    HospitaldashboardComponent,
    StopPropogationDirective,
    CreategroupComponent,
    SnoactionComponent,
    CpdapprovalComponent,
    CpdactionComponent,
    CpdreapprovalComponent,
    SnoreapprovalComponent,
    CardiologyComponent,
    CategorywisetreatComponent,
    DischargeclaimComponent,
    HospitalwisepaidComponent,
    KhurdaComponent,
    MultiplepackageComponent,
    OngoingicuComponent,
    ClaimquerybycpdComponent,
    CpdrejectedComponent,
    SNOConfigurationComponent,
    UserGroupComponent,
    UserSubGroupComponent,
    CpdrejectedactionComponent,
    ClaimsqueriedbySNOComponent,
    ClaimsqueriedbySNOdetailsComponent,
    ClaimquerybyCPDdetailsComponent,
    CPDConfigurationComponent,
    UsergroupViewComponent,
    TreatmenthistoryPerUrnComponent,
    GroupTypeComponent,
    GroupTypeViewComponent,
    SnoReActionComponent,
    CpdReApprovalActionComponent, CreatesnoviewComponent,
    ViewSubGroupComponent, UserHospitalComponent, UserHospitalViewComponent,
    DcapprovalComponent, DcactionComponent,
    ViewcpdComponent,
    FilterPipe,
    TreatmenthistoryPerUrnPackageComponent,
    CpdconfigurationdetailsComponent, SnoconfigurationdetailsComponent,
    CpdpipePipe, SnopipePipe, SnoconfigpipePipe,
    ClaimactioncountdetailsComponent,
    HospitalpipePipe,
    UnprocessedclaimComponent,
    UnprocessedactionComponent,
    CpdrevertComponent,
    CpdrevertactionComponent,
    CpdleaveapproveComponent,
    PendingclaimdetailsComponent,
    SNARejectListHospitalComponent,
    CPDRejectListHospitalComponent,
    CpdleaveapproveactionComponent,
    CpdleaveviewComponent,
    ResetPasswordComponent,
    RejectrequestsnaComponent,
    RejectrequestsnadetailsComponent,
    FunctionMasterComponent,
    GlobalLinkComponent,
    PrimaryLinkComponent,
    ViewfnmasterComponent,
    ViewgllinkComponent,
    ViewpmlinkComponent,
    CpdrejectlisthospitaldetailsComponent,
    SnarejectlisthospitaldetailsComponent,
    SnaBulkApprovedComponent,
    ClaimProcessedComponent,
    SnaBulkApprovedComponent,
    SnanoncompliancequeryrequestComponent,
    SnanoncompliancequeryrequestdetailsComponent,
    UserMenuMappingComponent,
    SidebarmenuComponent,
    SnarejectedlistComponent,
    CpdprofileComponent,
    SidebarmenuComponent,
    FoFloatReportComponent,
    FinancialofficerdetailsComponent,
    FloateDetailsComponent,
    SnaViewFloatComponent,
    SnafloatactionComponent,
    CreateuserComponent,
    ViewuserComponent,
    SnaFloatReportComponent,
    UserInactiveComponent,
    HospitalprofileComponent,
    AuditorFloatReportComponent,
    SysrejectedreportsComponent,
    DcConfigurationComponent,
    DcconfigurationdetailsComponent,
    DcresetpasswordComponent,
    UserprofileComponent,
    HoispitalinfoReportComponent,
    QueryLoginComponent,
    QueryBuilderComponent,
    HospitalmasterComponent,
    TransactioncountdetalsReportsComponent,
    SnadoctorTagComponent,
    HospitalmasterComponent,
    QueryTypeComponent,
    QuerytypeviewComponent,
    GroupMenuMappingComponent,
    DoctorsDetailsComponent,
    DischargedetailsHistoryComponent,
    ClaimRecievedDetailsComponent,
    CpdmappingComponent,
    HospitalMasterUserComponent,
    HospitalMasterUserDetailsComponent,
    ClaimstatictiscDetailsComponent,
    CPDActionReportComponent,
    FloatgenerationComponent,
    TreatmentHistorySnaComponent,
    SnaactiontakenlogdetailsrprtComponent,
    CpdLeaveactionAdminComponent,
    CpdLeaveviewAdminComponent,
    RunCpdScheduleComponent,
    CpdTrackingDetailsComponent,
    PackageDetailsComponent,
    NonComplianceQueryCPDToSNAComponent,
    NonComplianceQueryCPDToSNAActionComponent,
    NotificationDetailsReportComponent,
    NotificationComponent,
    ViewnotificationComponent,
    ClaimcountprogressreportDetailsComponent,
    SnasysrejbtnEnableComponent,
    SnasysrejbtnEnableActionComponent,
    PackageMasterComponent,
    PackageMasterViewComponent,
    SnaapprovedComponent,
    FloatListComponent,
    FloatdetailsComponent,
    UrnwiseactionComponent,
    PaymentfreezListComponent,
    TransactionClaimDumpComponent,
    ViewFoatListComponent,
    PendingClaimSnareportsComponent,
    UntaggedHospitalsComponent,
    PackageHeaderComponent,
    PackageHeaderViewComponent,
    PackageSubCatagoryComponent,
    PackageSubcatagoryViewComponent,
    VitalStatisticsViewComponent,
    VitalStatisticsComponent,
    FpOverrideCodeComponent,
    HospitalPackageMappingComponent,
    HospitalPackageMappingViewComponent,
    PreauthApprovalComponent,
    PackageDetailsMasterComponent,
    PackageDetailsMasterViewComponent,
    OldtreatmentHistorySNAComponent,
    ImplantMasterComponent,
    ImplantMasterViewComponent,
    HighEndDrugsComponent,
    HighEndDrugsViewComponent,
    HospitalWiseClaimReportComponent,
    CpdLeaveHistoryComponent,
    NonComplianceExtnComponent,
    ViewfloatreportComponent,
    UnprocessedmasterConfigurationComponent,
    UnprocessedMasterViewComponent,
    HospitalAuthClaimMngmtComponent,
    ViewApplicationListComponent,
    ViewFormListComponent,
    PendingApplicationComponent,
    TakeActionComponent,
    ApplicationSummaryComponent,
    RejectedApplicationComponent,
    RevertedApplicationComponent,
    ApprovedApplicationComponent,
    FormApplyComponent,
    DynamicformsComponent,
    NoteingComponent,
    CardPolicyUpdateComponent,
    HospitalAuthClaimQryCPDComponent,
    PatientReferalComponent,
    UnprocessedforAdminComponent,
    HospitalAuthClaimQrySNAComponent,
    GrievanceByComponent,
    GrievanceByViewComponent,
    HospitalOperatorComponent,
    ViewHospitalOperatorComponent,
    GrievanceTypeComponent,
    GrievanceTypevieComponent,
    GrievanceMediumComponent,
    PatientReferralViewComponent,
    CallCenterExecutiveAddComponent,
    CallCenterExecutiveViewComponent,
    NotConnectedAddComponent,
    NotConnectedViewComponent,
    NonComplianceQuerySNAToSNAComponent,
    NonComplianceQuerySNAToSNAViewComponent,
    SnaexecutivemappingComponent,
    NoncompleincequeryreportComponent,
    CpdactiontakenlogdetailsComponent,
    CDMOConfigurationComponent,
    CdmoconfigurationdetailsComponent,
    GrievanceMediumViewComponent,
    SnaDashboardComponent,
    PostPaymentListComponent,
    AbstractFloatGenerationComponent,
    BankMasterComponent,
    BankMasterViewComponent,
    ViewSnaExecutiveComponent,
    PostPaymentListComponent,
    ViewPreauthApprovalComponent,
    DcComplianceComponent,
    DcComplianceActionComponent,
    HospempanelmentdownlordpdfComponent,
    DashboardComponent,
    SwathyaMitraHospitalConfigurationComponent,
    SwathyaMitraHospitalConfigurationViewComponent,
    MessageMasterComponent,
    ViewMessageMasterComponent,
    PaidreportComponent,
    CpdNamewsiseCountReportComponent,
    PendingGrievanceApplicationComponent,
    GrievanceTakeActionComponent,
    ApplicationGrievanceSummaryComponent,
    GrievanceApplicationSummaryComponent,
    GrievancePreviewComponent,
    GrievanceApplicationCeoComponent,
    CpdnamewisedetailsComponent,
    RunUnprocessedClaimComponent,
    CpdDashboardComponent,
    FpOverrideViewComponent,
    PaymentFreezeComponentUpdate,
    TsuCpdMappingComponent,
    TsuSnaMappingComponent,
    TsuDcMappingComponent,
    TsuHospitalMasterComponent,
    TsuCpdMasterComponent,
    TsuUserMasterComponent,
    PaymentFreezeActionComponent,
    CceOutboundCallComponent,
    PaidinternalComponent,
    PaymentFreezeViewComponent,
    ActionWiseFloatGenerationComponent,
    CceOutboundCallViewComponent,
    PaymentfrezzereportComponent,
    RemarksAddComponent,
    RemarksViewComponent,
    WardMasterComponent,
    WardMasterViewComponent,
    WarddetailsAddComponent,
    WarddetailsViewComponent,
    SummaryComponent,
    UnlockUserComponent,
    GrievanceCCEComponent,
    GrievanceCCEViewComponent,
    DgoCallCenterComponent,
    DgoCallCenterViewComponent,
    InternalGrivanceComponent,
    InternalGrievanceViewComponent,
    RevertbyfodetailsComponent,
    SnawisependingreportComponent,
    CceReportComponent,
    CceReportTotalConnectedComponent,
    SnawisependingreportdetailsComponent,
    HospitalwiseFloatListComponent,
    FloatNavComponent,
    SupervisorCceComponent,
    SupervisorCceViewComponent,
    OngoingTreatmentReportComponent,
    ReAssignAddComponent,
    ReAssignViewComponent,
    HospitalwiseCcedataComponent,
    OngoingtreatmentHospitalwiseReportComponent,
    ReAssignAddComponent,
    ReAssignViewComponent,
    HospitalwiseCcedataComponent,
    SnaPreauthDetailsComponent,
    SmhospitalconfigurationComponent,
    SmhospitalconfigurationviewComponent,
    ReportMasterLinkComponent,
    CpdreceivedcountreportdetailsComponent,
    RationCardSchedularReportComponent,
    CheckcardbalanceComponent,
    ChechbeneficiaryComponent,
    RationCardSchedularDetailsReportComponent,
    OldprocessedclaimlistComponent,
    OldprocessedclaimDetailsComponent,
    CpdwiseunprocessedComponent,
    CpdwiseunprocesseddetailsComponent,
    QcadminformComponent,
    SnaExecHsptlFloatGenComponent,
    CpdwishospitalwisedetailspageComponent,
    SnaExecHsptlFloatGenComponent,
    HospitalWisePackageDataReportComponent,
    SnaExecViewfloatrptComponent,
    OldclaimquerybysnaComponent,
    OldclaimquerybysnadetailsComponent,
    ApplicationSummeryQcComponent,
    FloatReportComponent,
    InternalcommAddComponent,
    InternalcommViewComponent,
    OldclaimResettlementComponent,
    OldclaimResettlementDetailsComponent,
    InternalcommTaskComponent,
    SnaExecViewfloatrptComponent,
    OldclaimquerybysnaComponent,
    OldclaimquerybysnadetailsComponent,
    ApplicationSummeryQcComponent,
    FloatReportComponent,
    OldclaimResettlementComponent,
    OldclaimResettlementDetailsComponent,
    BulkExtensionOfNonComplianceComponent,
    GrievanceReportComponent,
    SnaViewPreauthDetailsComponent,
    SmcreateuserComponent,
    SmviewuserComponent,
    WalletRefundComponent,
    WalletRefundedClaimsComponent,
    PreauthCaseDetailsComponent,
    ClaimsOnHoldComponent,
    HoldactionComponent,
    QcadminformviewComponent,
    SystemadminSnarejectedComponent,
    DcDashboardComponent,
    SystemadminsnarejectedlistComponent,
    TestingProcessExecutionComponent,
    UrnAuthenticationComponent,
    RunsnawiseunprocessedComponent,
    SNAWisePaymentStatusComponent,
    CpdPaymentDetailsReportComponent,
    UrnwiseactionreportDetailsComponent,
    TreamenthistorybyurnadhardetailsComponent,
    UrnAuthenticationComponent,
    UrnAuthenticationComponent,
    FloatDistributionComponent,
    RunsnawiseunprocessedComponent,
    NonComplianceExtnviewComponent,
    HospitalbackdateconfigComponent,
    HospitalbackdateconfigviewComponent,
    HospitalbackdateconfigviewreportComponent,
    DischargereportComponent,
    HospitalwisesummaryreportComponent,
    CpdactionwiseperformanceComponent,
    GrievanceDashboardComponent,
    FloatVerifiedListComponent,
    ViewVerifiedListComponent,
    PaymentFreezeDetailsComponent,
    CpdactionwiseperformancedetailsComponent,
    ViewDistributionComponent,
    OldClaimFloatgenerationComponent,
    OldClaimPaymentFreezeComponent,
    OldClaimPostPaymentComponent,
    OldFloatViewReportsComponent,
    SchedulerReportDetailsComponent,
    OldClaimPaymentViewComponent,
    SnawiseClaimsubmitReportComponent,
    SnamonthwiseclaimsubmitreportComponent,
    ForemarkComponent,
    ForemarkviewComponent,
    HospitalwisedischargeandclaimComponent,
    CpdwisemaximumminimumlimitComponent,
    EmpanelmentDetailUpdationComponent,
    DBSchedulerReportComponent,
    ViewcpdwisemaximumminimumlimitComponent,
    PostPaymentReversalComponent,
    DbschedulerdetailsreportComponent,
    ShasqcDashbordComponent,
    HospitalincentivereportComponent,
    HospitalincentivedetailsreportComponent,
    MailServiceComponent,
    MailServiceConfigurationComponent,
    BlockedDataApprovalComponent,
    BlockedDataApprovalDetailsComponent,
    ViewBlockedDataApprovedComponent,
    UpdateformapplyComponent,
    UpdatedynamicformsComponent,
    OldclaimQueryToHospitalToSNAComponent,
    OldclaimtrackingdetailsComponent,
    SnaOldclaimProcessedListComponent,
    OldReCLaimPendingAtSNAComponent,
    HospitaldetailsComponent,
    HospitalexclusionapplyComponent,
    HospitalexclusionapproveComponent,
    PostPaymentViewComponent,
    HospitalinclusionapproveComponent,
    HospitalinclusionapplyComponent,
    HospitalcpdtaggingreportComponent,
    FloatlistCeoComponent,
    SnaReconsiderDetailsPageComponent,
    EnableHospitalDischargeComponent,
    CpdremarkComponent,
    CpdremarkviewComponent,
    SnaremarkComponent,
    SnaremarkviewComponent,
    ApplicationGrievanceSummaryCDMOComponent,
    GrievanceTakeActionCDMOComponent,
    GrievanceApplicationSummaryCDMOComponent,
    RunsnawiseunprocessedviewComponent,
    HospitalwiseongoingtreatmentdetailsComponent,
    BenificaryGenderWiseComponent,
    BenificiaryGenderWiseDtlsComponent,
    BenificiaryGenderGramWiseDtlsComponent,
    BenificiaryVillageDtlsComponent,
    BenificaryDetailsComponent,
    AuthenticationonlivestatusComponent,
    HospitalauthenticationdetailsComponent,
    CreatereferaldoctoruserComponent,
    ViewreferaldoctoruserComponent,
    ReferalDoctorConfigurationComponent,
    PackagewisedischargeclaimComponent,
    PackagewisedischargeclaimdetailsComponent,
    ReferalDoctorConfigurationviewComponent,
    ReferralresonComponent,
    PackagebenificiarydtlsComponent,
    CpdMappingReportComponent,
    PaymentfreezreportComponent,
    CpdReportDtlsComponent,
    BlockedcaselogdetailsreportComponent,
    UnprocessedsummarydetailsComponent,
    UnprocessedsummarydetailsComponent,
    MnthWiseDischargeMeComponent,
    MnthWiseDischargeMedtlsComponent,
    MemnthDischargeDetailsComponent,
    ReferralHospitalComponent,
    ReferralHospitalviewComponent,
    HospitaltypemasterComponent,
    SearchTextHighlighterPipe,
    SnaremarkwiseactionComponent,
    DynamicConfigurationAddComponent,
    DynamicConfigurationViewComponent,
    DynamicReportComponent,
    DynamicreportdetailsComponent,
    DynamicreportclaimdetailsComponent,
    MeclaimdetailsComponent,
    MeactiontakenviewComponent,
    CasespecificreportComponent,
    GrievanceCceResettlementComponent,
    DgoQueryBucketComponent,
    GrievanceMskComponent,
    MosarkarreportComponent,
    GrievanceQueryForDGOComponent,
    GrievanceQuerySettleForGOComponent,
    GrievanceQuerySettleForGOComponent,
    DCInitialTakeActionComponent,
    DGOInitialTakeActionComponent,
    GOInitialTakeActionComponent,
    HospitalenrollmentlistComponent,
    EnrollmentdetailsComponent,
    RecomplyenrollmentComponent,
    HospitalotpconfigurationComponent,
    DGODashboardComponent,
    OldBlockDatareportComponent,
    OldBlockDatareportListComponent,
    SurgicalMedicalMappingComponent,
    UsermanualuploadsectionComponent,
    ViewusermanuluploadsectionComponent,
    UsermanualdownloadComponent,
    GrievanceCCEFeedbackReportComponent,
    HospitalSpecilityAddComponent,
    HospitalCivilinfraAddComponent,
    HospitaldoctorprofileComponent,
    HospitaldoctorprofileviewComponent,
    HospitalCivilInfraViewComponent,
    HospitalCivilInfraViewDetailsComponent,
    SpecialityWiseDistrictReportComponent,
    HospitalspecialistupdationreportComponent,
    TreatingdoctorrconfigurationComponent,
    SmfaceregistrationComponent,
    DbschedulerAddComponent,
    DbschedulerViewComponent,
    SmfaceregistrationviewComponent,
    GrievanceMskViewComponent,
    TreatingdoctorlogComponent,
    UnboundlingpackageAddComponent,
    UnboundlingpackageViewComponent,
    MnthWiseFloatdtlsRertComponent,
    ExpiredBeneficiaryRprtComponent,
    ExpiredbeneficiaryDtlsComponent,
    MultipledoctortreatedbysamedoctorComponent,
    MedicalinfracategoryComponent,
    MedicalinfracategoryviewComponent,
    MedicalinfrasubcategoryaddComponent,
    MedicalinfrasubcategoryviewComponent,
    TypeofexpertiseComponent,
    TypeofexpertiseviewComponent,
    MedicalExpertiseMasterComponent,
    MedicalExpertiseMasterViewComponent,
    FacilityDetailMasterComponent,
    FacilityDetailViewComponent,
    SearchbynameComponent,
    MakeAliveBeneficiaryRptComponent,
    CpdPaymentCalculationComponent,
    OldblockGenericSearchComponent,
    OldblockDataViewlistComponent,
    OldblockDataViewdetailsComponent,
    PackageUpdationComponent,
    HospitalSpecilityQcApprovalComponent,
    BlockwisetreetmentdatareportComponent,
    GpwisetreetmentdatareportComponent,
    VillagewisetreetmentdatareportComponent,
    OldclmprocessblockrprtComponent,
    OldprocessdischargerptComponent,
    ProcedureTaggingComponent,
    HospitalSpecialityQcApprovalViewComponent,
    ApprovalstatusreportComponent,
    IcdConfigComponent,
    SnafloaterevertComponent,
    HospitalloginotpconfigurationComponent,
    SnabulkapprovedrevertComponent,
    FunctionMasterUnlinkedComponent,
    ViewFunctionMasterUnlinkedComponent,
    HospitalOperatorApprovalComponent,
    HospitalOperatorListreportComponent,
    HospitaloperatorprofileComponent,
    AbstractmereportComponent,
    SnawisepreauthactiondetailsComponent,
    DctaggedreportComponent,
    UserOtpRequiredComponent,
    DbschedulerLogComponent,
    SnafloatedetailsforrevertComponent,
    SnaapplyforunfrezefloateoldComponent,
    SnaappliedlistforunfreezefloateComponent,
    SupervisorCceDCRevertedComponent,
    DynamicreportsubdetailsComponent,
    CCEOutboundCallShasCEOComponent,
    QuestionmasterComponent,
    SurveymasterComponent,
    QuestionmasterviewComponent,
    SurveymasterviewComponent,
    SurveygoupmappingComponent,
    SurveygoupmappingviewComponent,
    SurveyquestionmappingComponent,
    SurveyquestionmappingviewComponent,
    TriggerReportforuserComponent,
    ClaimProcessedActionComponent,
    UrnwiseDetailsActionComponent,
    SystemAdminSnaRejectedActionComponent,
    PackagecalculatorComponent,
    SpecialfloateverificationreportComponent,
    HospitalenrollmentactiontakenreportComponent,
    OldClaimProgressReportComponent,
    OldClaimProgressReportDetailsComponent,
    CpdDraftComponent,
    CpdDraftActionComponent,
    CpdhosptaltaggingreportComponent,
    CpdspecialitymappingComponent,
    CpdspecialitymappingviewComponent,
    CpdspecialitysummaryreportComponent,
    ClaimDraftViewReportComponent,
    StatedashboareddataComponent,
    ImplantprocedureconfigComponent,
    ImplantprocedureconfigviewComponent,
    SmhelpdeskregisterrptComponent,
    SmpendingreportComponent,
    SmscoringComponent,
    SmscoringviewComponent,
    SmscoringreportComponent,
    CpdEmpanelRequestListComponent,
    CpdFreshApplicationDetailsComponent,
    CpdEmpanelViewComponent,
    CpdECardInfoComponent,
    CpdEmpaneledApprovedListComponent,
    CpdEmpaneledApproveDetailsComponent,
    PackageTaggingReportComponent,
    SmincentivereportComponent,
    SwasthyaMitraGeoTaggingComponent,
    CpdregistrationpreviewdetailspreviewComponent,
    CpdEmpaneledViewListComponent,
    CpdPostPaymentComponent,
    CpdPostPaymentViewComponent,
    HospitalSpecialityRequestComponent,
    ViewSpecialityRequestComponent,
    SpecialityRequestDetailsComponent,
    MobilenouupdateComponent,
    MoboilenoupdatelogComponent,
    SchemewisepackagemappingComponent,
    SchemewisehospitalmappingreportComponent,
    DcCdmomappingComponent,
    DcCdmomappingviewComponent,
    CheckCardBalanceLogComponent,
    AssemblyConstituencyReportComponent,
    MDRmasterComponent,
    MdrmasterviewComponent,
    OutOfPocketExpenditureComponent,
    OutOfPocketExpenditureviewComponent,
    MdrproceduremappingComponent,
    DcHospitalmappingComponent,
    DcHospitalmappingviewComponent,
    WhatsappuserConfigurationComponent,
    WhatsappUserConfigurationViewComponent,
    MdrprodeduremappingviewComponent,
    DcfaceregistrationComponent,
    DcfaceregistrationviewComponent,
    TaggingHistoryComponent,
    PostmasterAddComponent,
    PostmasterViewComponent,
    OnlinePostConfigurationComponent,
    OnlinePostConfigurationViewComponent,
    AllowfohospitalattedanceComponent,
    DraftFloatListComponent,
    FloatlistCeoviewComponent,
    OldclaimNoncomplianceComponent,
    PostpaymentnewComponent,
    OldblockcasesComponent,
    FloatlistdetailsComponent,
    ManagedduplicatedbenbeneficiaryComponent,
    CurrencyInrPipe,
    HospitalUidAuthConfigurationComponent,
    TemporaryOverrideCodeComponent,
    TemporaryOverrideCodeViewComponent,
    HospitalUidAuthConfigurationViewComponent,
    ManageduplicatebenificaryviewComponent,
    HospitalDeactivationProcessComponent,
    HospitalDeactivionProcessviewComponent,
    PartialClaimRaisedComponent,
    PartialClaimSnoapprovalComponent,
    PartialClaimApprovalDetailsComponent,
    GrieancePartiaalClaimComponent,
    PartialclaimraiseComponent,
    PartialclaimraisedetailsComponent,
    PartialclaimraiseviewComponent,
    NewfreshraisclaimedComponent,
    SnaLeaveApplyComponent,
    SnaLeaveViewComponent,
    CasewiseHospitalclaimSubmitComponent,
    PartialClaimDcComplianceComponent,
    PcDcComplianceActionComponent,
    PartialClaimDcComponent,
    PartialClaimDcDetailsComponent,
    PartialClaimDcViewComponent,
    PartialClaimSnoReapprovalComponent,
    PcSnoReapprovalActionComponent,
    PartialClaimQuereidComponent,
    PartialClaimSnaViewComponent,
    PartialClaimSnaViewDetailsComponent,
    PartialClaimHospitalNoncomplianceComponent,
    PartialClaimDcNoncomplianceComponent,
    FreshClaimAllocationComponent,
    ManualCpdAllotmentComponent,
    MobileAttendanceMasterComponent,
    MobileAttendanceMasterViewComponent,
    CasewiseHospitalQueriedbycpdComponent,
    CasewiseQueriedbycpdsubmitComponent,
    CpdfreshcaseDetailsComponent,
    CpdfreshclaimDetailsComponent,
    HospitalFaceauthRadiousConfigComponent,
    FreshClaimDetailsComponent,
    ShasceoDashboardComponent,
    CasewisehospitalqueriedbysnaComponent,
    CasewiseQueriedbysnasubmitComponent,
    CasewiseNonUploadingInitialDocumentComponent,
    CpdCaseReconsiderComponent,
    CpdCaseReconsiderActionComponent,
    SnaCpdInvestigatedlistComponent,
    CpdCaseResettlementComponent,
    CpdCaseResettlementActionComponent,
    FreshClaimCaseDetailsComponent,
    SnaCpdInvestigatedlistComponent,
    CpdrejectiontohospitalComponent,
    CpdrejectiontohospitaldetailsComponent,
    SnaClaimDetailsViewComponent,
    SnaCaseResettlemntComponent,
    SnaCaseClaimActionResettlementComponent,
    NoncompliancecpdquerytohospitalComponent,
    NoncompliancesnaquerytohospitalComponent,
    TimerLeft,
    ExtnsnStayApproveListComponent,
    ExtnsnStayAprvDetailsComponent,
    CsmdcconfigurationComponent,
    CsmdcconfigurationviewComponent,
    CeoDashboardComponent,
    ExtensionOfStayViewComponent,
    DcgeetagconfigComponent,
    UsermobiletrackingConfigComponent,
    WardChangeComponent,
    WardChangeApvDtlsComponent,
    WardChangeApvViewComponent,
    CsmdcstatendistrictmappingComponent,
    CsmdcstatendistrictmappingviewComponent,
    AuthIrisFingerComponent,
  ],
  imports: [
    CommonModule,
    ApplicationRoutingModule,
    NgMultiSelectDropDownModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    AutocompleteLibModule,
    NgChartsModule,
    IncludesModule,
    CKEditorModule,
    NgbTooltipModule,
  ],
  providers: [
    CurrencyPipe, CpdpipePipe, SnopipePipe, SnoconfigpipePipe, HospitalpipePipe, LoginSharedServiceService, DatePipe, TimerLeft
  ]
})
export class ApplicationModule { }

declare module "@angular/core" {
  interface ModuleWithProviders<T = any> {
    ngModule: Type<T>;
    providers?: Provider[];
  }
}
