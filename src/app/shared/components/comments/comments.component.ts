import {Component, Input} from '@angular/core';
import {ArticleType} from "../../../../types/article.type";
import {environment} from "../../../../environments/environment";
import {ArticlesType} from "../../../../types/articles.type";
import {CommentType} from "../../../../types/comment.type";
import {CommentParamsType} from "../../../../types/comment-params.type";
import {CommentActionsType} from "../../../../types/comment-actions.type";
import {AuthService} from "../../../core/auth/auth.service";
import {ActionsService} from "../../services/actions.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {Reactions} from "./reactions";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})

export class CommentsComponent {

  @Input() article!: ArticleType;

  serverStaticPath = environment.serverStaticPath;
  relatedArticles: ArticlesType[] = [];
  offset: number = 0;
  comments: CommentType[] = [];
  allComments: CommentType[] = [];
  allCommentsAmount: number = 0;
  commentsParams: CommentParamsType = {article: ''};
  isLogged: boolean = false;
  commentValue: string = '';
  complaintSend: boolean = false;
  commentActions: CommentActionsType[] = [];
  notShowComments: boolean = false;
  restComments: number = 0;
  firstCommentsAmount: number = 0;
  commentsLength: number = 0;


  constructor(private authService: AuthService,
              private actionsService: ActionsService,
              private _snackBar: MatSnackBar) {
    this.isLogged = this.authService.getIsLoggedIn();
  }

  ngOnInit() {

    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn;
    });

    this.comments = this.article.comments;
    this.allCommentsAmount = this.article.commentsCount;
    this.firstCommentsAmount = this.comments.length;
    this.commentsLength = this.firstCommentsAmount;

    if (this.isLogged) {
      this.markReactions();
    }
  }

  markReactions() {
    this.actionsService.getCommentsActions(this.article.id)
      .subscribe((data: CommentActionsType[] | DefaultResponseType) => {

        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }

        const commentActions = data as CommentActionsType[];

        commentActions.forEach(item => {
          let commentWithReaction = this.comments.find(comment => comment.id === item.comment);

          if (commentWithReaction) {
            if (item.action === Reactions.like) {
              commentWithReaction.isActiveLike = true;
            } else if (item.action === Reactions.dislike) {
              commentWithReaction.isActiveDislike = true;
            }
          }
        })
      })
  }


  addComment() {
    this.commentsLength++;

    this.actionsService.addComment(this.commentValue, this.article.id)
      .subscribe((data: DefaultResponseType) => {
        if ((data as DefaultResponseType).error) {
          throw new Error((data as DefaultResponseType).message);
        }


        this.commentsParams = {offset: 0, article: this.article.id};
        this.getComments();
        this.commentValue = '';
      })

  }

  getComments() {

    if (this.notShowComments) {
      this.offset = 0;
    }

    this.actionsService.getComments(this.commentsParams)
      .subscribe((data: DefaultResponseType | { allCount: number, comments: CommentType[] }) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }

        this.allComments = (data as { allCount: number, comments: CommentType[] }).comments;
        this.allCommentsAmount = (data as { allCount: number, comments: CommentType[] }).allCount;

        if (this.offset === 0) {

          if (this.notShowComments) {
            this.comments.unshift(this.allComments[0]);
          } else {
            this.comments = [];
            for (let i = 0; i < this.commentsLength; i++) {
              this.comments.push(this.allComments[i]);
            }
          }

        } else {
          for (let i = 0; i < this.allComments.length; i++) {
            this.comments.push(this.allComments[i]);
          }
        }


        if (this.isLogged) {
          this.markReactions();
        }

        this.restComments = this.allCommentsAmount - this.comments.length;
        this.notShowComments = this.restComments <= 0;

      })

  }

  showMoreComments() {

    if (this.offset === 0) {
      this.offset = this.commentsLength;
      this.commentsParams = {offset: this.offset, article: this.article.id};
      this.getComments();


    } else {
      this.offset += 10;
      this.commentsParams = {offset: this.offset, article: this.article.id};
      this.getComments();
    }
  }

  applyAction(comment: CommentType, action: string) {

    if (this.isLogged) {
      if (action === Reactions.violate) {
        if (this.complaintSend) {
          this._snackBar.open('Жалоба уже отправлена');
        } else {
          this.actionsService.applyAction(comment.id, action)
            .subscribe({
              next: (data: DefaultResponseType) => {
                this.complaintSend = true;
                this._snackBar.open('Жалоба отправлена')
              },
              error: (err: HttpErrorResponse) => console.log(err),
            })
        }
      } else {

        this.actionsService.getCommentActions(comment.id)
          .subscribe(data => {
            this.commentActions = data as CommentActionsType[];
          })

        this.actionsService.applyAction(comment.id, action)
          .subscribe({
            next: (data: DefaultResponseType) => {

              if (this.commentActions && this.commentActions.length === 0) {
                if (action === Reactions.like) {
                  comment.isActiveLike = true;
                  comment.likesCount += 1;
                } else if (action === Reactions.dislike) {
                  comment.isActiveDislike = true;
                  comment.dislikesCount += 1;
                }
                this._snackBar.open('Ваш голос учтен');
              } else if (this.commentActions && this.commentActions.length > 0) {
                if (action === Reactions.like && this.commentActions[0].action === Reactions.dislike) {
                  comment.isActiveLike = true;
                  comment.likesCount += 1;
                  comment.isActiveDislike = false;
                  comment.dislikesCount -= 1;
                  this._snackBar.open('Ваш голос учтен');
                } else if (action === Reactions.dislike && this.commentActions[0].action === Reactions.like) {
                  comment.isActiveLike = false;
                  comment.likesCount -= 1;
                  comment.isActiveDislike = true;
                  comment.dislikesCount += 1;
                  this._snackBar.open('Ваш голос учтен');
                } else if (action === Reactions.like && this.commentActions[0].action === Reactions.like) {
                  comment.isActiveLike = false;
                  comment.likesCount -= 1;
                } else if (action === Reactions.dislike && this.commentActions[0].action === Reactions.dislike) {
                  comment.isActiveDislike = false;
                  comment.dislikesCount -= 1;
                }
              }
            },
            error: (err) => console.log(err),
          })
      }
    } else {
      this._snackBar.open("Необходимо авторизоваться")
    }

  }
}



