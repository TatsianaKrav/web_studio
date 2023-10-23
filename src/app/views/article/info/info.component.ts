import {Component, OnInit} from '@angular/core';
import {ArticlesService} from "../../../shared/services/articles.service";
import {ActivatedRoute, Router} from "@angular/router";
import {environment} from "../../../../environments/environment";
import {ArticleType} from "../../../../types/article.type";
import {ArticlesType} from "../../../../types/articles.type";
import {DefaultResponseType} from "../../../../types/default-response.type";


@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
  article!: ArticleType;
  serverStaticPath = environment.serverStaticPath;
  relatedArticles: ArticlesType[] = [];

  constructor(private articleService: ArticlesService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {

    this.activatedRoute.params.subscribe(params => {
      this.articleService.getArticle(params['url'])
        .subscribe((article: DefaultResponseType | ArticleType) => {
          if ((article as DefaultResponseType).error !== undefined) {
            throw new Error((article as DefaultResponseType).message);
          }

          this.article = article as ArticleType;
        })

      this.articleService.getRelatedArticles(params['url'])
        .subscribe(articles => {
          this.relatedArticles = articles;
        })
    })
  }

  backToBlog() {
    this.router.navigate(['/blog']);
  }

}
