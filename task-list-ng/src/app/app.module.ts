import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { HttpClient, HttpClientModule } from "@angular/common/http";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { MainPageComponent } from "./main-page/main-page.component";
import { TaskService } from "./services/task.service";
import { TaskEditComponent } from "./task-edit/task-edit.component";

@NgModule({
  declarations: [AppComponent, MainPageComponent, TaskEditComponent],
  imports: [
    // Angular imports
    BrowserModule,
    FormsModule,
    NgbModule,
    HttpClientModule,
    // Application imports
    AppRoutingModule
  ],
  providers: [
    // Angular providers
    HttpClient,
    // Application providers
    TaskService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
