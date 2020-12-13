import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserformComponent } from './userform/userform.component';
import { CreateDocumentComponent } from './create-document/create-document.component';
import { DrawComponent } from './draw/draw.component';
import { MainDocumentComponent } from './main-document/main-document.component';
import { LogInComponent } from './log-in/log-in.component';
import {CanNavigateService} from './services/can-navigate.service'

const routes: Routes = [
{path:'',component:LogInComponent},
{path:'mainDocument',component:MainDocumentComponent,canActivate: [CanNavigateService]},
{path:'register',component:UserformComponent},
{path:'createdocument',component:CreateDocumentComponent,canActivate: [CanNavigateService]},
{path:'draw/:docid',component:DrawComponent,canActivate: [CanNavigateService]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
