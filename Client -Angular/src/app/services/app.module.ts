import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from '../app-routing.module';
import { AppComponent } from '../app.component';
import { UserformComponent } from '../userform/userform.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {HttpClientModule} from '@angular/common/http';
 import { CreateDocumentComponent } from '../create-document/create-document.component';
import { DrawComponent } from '../draw/draw.component';
import { MainDocumentComponent } from '../main-document/main-document.component';
import { LogInComponent } from '../log-in/log-in.component'
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    AppComponent,
    UserformComponent,
    CreateDocumentComponent,
    DrawComponent,
    MainDocumentComponent,
    LogInComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    NgSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
