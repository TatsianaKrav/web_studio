import {Component, Input, ViewEncapsulation} from '@angular/core';
import {ArticlesType} from "../../../../types/articles.type";
import {environment} from "../../../../environments/environment.development";

@Component({
  selector: 'article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ArticleCardComponent {
  @Input() article!: ArticlesType;
  serverStaticPath = environment.serverStaticPath;
}
