import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ArticlesType} from "../../../types/articles.type";
import {ArticlesService} from "../../shared/services/articles.service";
import {OwlOptions} from "ngx-owl-carousel-o";
import {environment} from "../../../environments/environment.development";
import {MatDialog} from "@angular/material/dialog";
import {FormBuilder, Validators} from "@angular/forms";
import {ActionsService} from "../../shared/services/actions.service";
import {SERVICES, REVIEWS, CUSTOM_OPTIONS, CUSTOM_OPTIONS2, OFFERS} from "./constants/constants"


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  @ViewChild('modal')
  modal!: TemplateRef<ElementRef>;

  @ViewChild('modalResponse')
  modalResponse!: TemplateRef<ElementRef>;


  constructor(private articlesService: ArticlesService, private dialog: MatDialog,
              private fb: FormBuilder, private actionsService: ActionsService) {
  }

  popularArticles: ArticlesType[] = [];
  selectedOption: string = '';
  phoneValue: string = '';
  nameValue: string = '';
  errorRequest: boolean = false;
  serviceName: string = '';
  type: string = 'order';
  serverStaticPath = environment.serverStaticPath;
  customOptions: OwlOptions = CUSTOM_OPTIONS;
  customOptions2: OwlOptions = CUSTOM_OPTIONS2;
  services = SERVICES;
  reviews = REVIEWS;
  offers = OFFERS;


  popupForm = this.fb.group({
    select: ['valid', [Validators.required]],
    name: ['', [Validators.required, Validators.pattern(/^([А-ЯЁ][а-яё]+)$/)]],
    phone: ['', [Validators.required, Validators.pattern(/^(\+375|8|\+7)[\s(]*\d{2,3}[)\s]*\d{3}[\s-]?\d{2}[\s-]?\d{2}$/)]]
  });


  ngOnInit() {
    this.errorRequest = false;

    this.articlesService.getPopularArticles()
      .subscribe((articles: ArticlesType[]) => {
        this.popularArticles = articles;
      })
  }

  openModal(serviceTitle: string) {
    this.selectedOption = serviceTitle;
    this.dialog.open(this.modal);
  }

  getFormValues() {
    const popupForm = this.popupForm.value;

    if (popupForm.name && popupForm.phone && popupForm.select) {
      this.nameValue = popupForm.name;
      this.phoneValue = popupForm.phone;
      this.serviceName = this.selectedOption;
    }
  }

  sendRequest() {
    this.getFormValues();

    this.actionsService.sendRequest(this.nameValue, this.phoneValue, this.serviceName, this.type)
      .subscribe({
        next: (data => {

          this.dialog.closeAll();

          setTimeout(() => {
            this.dialog.open(this.modalResponse);
          }, 500)
        }),
        error: err => {
          this.errorRequest = true;
          console.log(err)

          this.popupForm.reset();
        }
      })
  }
}


