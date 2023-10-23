import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {DefaultResponseType} from "../../../types/default-response.type";
import {CommentParamsType} from "../../../types/comment-params.type";
import {CommentType} from "../../../types/comment.type";
import {CommentActionsType} from "../../../types/comment-actions.type";

@Injectable({
  providedIn: 'root'
})
export class ActionsService {

  constructor(private http: HttpClient) {
  }

  sendRequest(name: string, phone: string, service: string, type: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'requests',
      {name, phone, service, type});
  }

  getComments(params: CommentParamsType): Observable<DefaultResponseType | { allCount: number, comments: CommentType[] }> {
    return this.http.get<DefaultResponseType | { allCount: number, comments: CommentType[] }>(environment.api + 'comments/', {params})
  }

  addComment(text: string, article: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments', {text, article})
  }

  applyAction(idComment: string, action: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments/' + idComment + '/apply-action',
      {action: action})
  }

  getCommentsActions(articleId: string): Observable<DefaultResponseType | CommentActionsType[]> {
    return this.http.get<DefaultResponseType | CommentActionsType[]>(environment.api +
      'comments/article-comment-actions?articleId=' + articleId)
  }

  getCommentActions(commentId: string): Observable<DefaultResponseType | CommentActionsType[]> {
    return this.http.get<DefaultResponseType | CommentActionsType[]>(environment.api +
      'comments/' + commentId + '/actions')
  }

}


