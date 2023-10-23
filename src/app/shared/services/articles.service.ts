import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {ActiveParamsType} from "../../../types/active-params.type";
import {CategoriesType} from "../../../types/categories.type";
import {ArticlesType} from "../../../types/articles.type";
import {ArticleType} from "../../../types/article.type";
import {DefaultResponseType} from "../../../types/default-response.type";

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  constructor(private http: HttpClient) {
  }


  getPopularArticles(): Observable<ArticlesType[]> {
    return this.http.get<ArticlesType[]>(environment.api + 'articles/top');
  }

  getArticles(): Observable<{ count: number, pages: number, items: ArticlesType[] }> {
    return this.http.get<{ count: number, pages: number, items: ArticlesType[] }>(environment.api + 'articles');
  }

  getRelatedArticles(url: string): Observable<ArticlesType[]> {
    return this.http.get<ArticlesType[]>(environment.api + 'articles/related/' + url);
  }


  getArticle(url: string): Observable<DefaultResponseType | ArticleType> {
    return this.http.get<DefaultResponseType | ArticleType>(environment.api + 'articles/' + url);
  }

  getCategories(): Observable<CategoriesType[]> {
    return this.http.get<CategoriesType[]>(environment.api + 'categories');
  }

  getSortedArticles(params: ActiveParamsType): Observable<{ count: number, pages: number, items: ArticlesType[] }> {
    return this.http.get<{ count: number, pages: number, items: ArticlesType[] }>(environment.api +
      'articles', {params});
  }
}
