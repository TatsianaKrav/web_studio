import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from "@angular/router";
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {LoaderComponent} from './components/loader/loader.component';
import {NgxSpinnerModule} from "ngx-spinner";
import {ArticleCardComponent} from "./components/article-card/article-card.component";
import { CommentsComponent } from './components/comments/comments.component';


@NgModule({
  declarations: [
    ArticleCardComponent,
    LoaderComponent,
    CommentsComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    RouterModule
  ],
  exports: [
    ArticleCardComponent,
    LoaderComponent,
    CommentsComponent
  ]
})
export class SharedModule {
}
