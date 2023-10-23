import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleRoutingModule } from './article-routing.module';
import { BlogComponent } from './blog/blog.component';
import { InfoComponent } from './info/info.component';
import {SharedModule} from "../../shared/shared.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    BlogComponent,
    InfoComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ArticleRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ArticleModule { }
