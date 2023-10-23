import {Component, OnInit} from '@angular/core';
import {ArticlesService} from "../../../shared/services/articles.service";
import {ArticlesType} from "../../../../types/articles.type";
import {ActivatedRoute, Router} from "@angular/router";
import {ActiveParamsType} from "../../../../types/active-params.type";
import {CategoriesType} from "../../../../types/categories.type";
import {AppliedFilter} from "../../../../types/applied-filter";
import {debounceTime} from "rxjs";

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
  articles: ArticlesType[] = [];
  sortingOpen: boolean = false;
  sortingChosen: boolean = false;
  sortingOptions: CategoriesType[] = [];
  activeParams: ActiveParamsType = {categories: []};
  appliedFilers: AppliedFilter[] = [];
  pages: number[] = [];


  constructor(private articlesService: ArticlesService, private router: Router,
              private activatedRoute: ActivatedRoute) {
    this.sortingOptions.forEach(category => category.chosen = false);
  }


  ngOnInit() {
    this.processBlog();
  }

  processBlog() {
    this.articlesService.getCategories()
      .subscribe((categories: CategoriesType[]) => {
        this.sortingOptions = categories;

        this.activatedRoute.queryParams
          .pipe(
            debounceTime(500)
          )
          .subscribe(params => {
            const activeParams: ActiveParamsType = {categories: []};

            if (params.hasOwnProperty('categories')) {
              activeParams.categories = Array.isArray(params['categories']) ? params['categories'] : [params['categories']];
            }

            if (params.hasOwnProperty('page')) {
              activeParams.page = +params['page'];
            }

            this.activeParams = activeParams;

            //отображение плашек
            this.appliedFilers = [];
            this.activeParams.categories.forEach(url => {

              const foundCategory = this.sortingOptions.find(option => option.url === url);

              if (foundCategory) {
                this.appliedFilers.push({
                  name: foundCategory.name,
                  url: url
                })
              }
            })

            //активные категории после обновления страницы
            if (this.activeParams.categories && this.activeParams.categories.length > 0) {
              this.activeParams.categories = params['categories'];

              this.sortingOptions.forEach(option => {
                if (this.activeParams.categories.includes(option.url)) {
                  option.chosen = true;
                  return;
                } else {
                  option.chosen = false;
                }
              })
            } else {
              this.sortingOptions.forEach(option => option.chosen = false);
            }

            //пагинация
            this.articlesService.getSortedArticles(this.activeParams)
              .subscribe(data => {
                this.pages = [];
                for (let i = 1; i <= data.pages; i++) {
                  this.pages.push(i);
                }

                this.articles = data.items;

              })
          })
      })
  }

  toggleSorting() {
    this.sortingOpen = !this.sortingOpen;
  }


  changeUrlAndFilter(sortingOption: CategoriesType) {

    sortingOption.chosen = !sortingOption.chosen;

    if (this.activeParams.categories && this.activeParams.categories.length > 0) {
      const existingCategoryInParams = this.activeParams.categories.find(item => item === sortingOption.url);

      if (existingCategoryInParams && !sortingOption.chosen) {
        this.activeParams.categories = this.activeParams.categories.filter(item => item !== sortingOption.url);
      } else if (!existingCategoryInParams && sortingOption.chosen) {
        // this.activeParams.categories.push(sortingOption.url);
        this.activeParams.categories = [...this.activeParams.categories, sortingOption.url];
      }
    } else if (sortingOption.chosen) {
      this.activeParams.categories = [sortingOption.url];
    }


    this.activeParams.page = 1;
    this.router.navigate(['/blog'], {
      queryParams: this.activeParams
    })
  }

  removeAppliedFilter(appliedFilter: AppliedFilter) {

    this.activeParams.categories = this.activeParams.categories.filter(item => item !== appliedFilter.url);

    this.activeParams.page = 1;
    this.router.navigate(['/blog'], {
      queryParams: this.activeParams
    });
  }

  openPage(page: number) {
    this.activeParams.page = page;
    this.router.navigate(['/blog'], {
      queryParams: this.activeParams
    });
  }

  openPrevPage() {
    if (this.activeParams.page && this.activeParams.page > 1) {
      this.activeParams.page--;
      this.router.navigate(['/blog'], {
        queryParams: this.activeParams
      });
    }
  }

  openNextPage() {
    console.log(this.activeParams.page);
    if (this.activeParams.page && this.activeParams.page < this.pages.length) {
      this.activeParams.page++;
      this.router.navigate(['/blog'], {
        queryParams: this.activeParams
      });
    }
  }

}
