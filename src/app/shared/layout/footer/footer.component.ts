import {Component, TemplateRef, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {FormBuilder, Validators} from "@angular/forms";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  @ViewChild('modal')
  modal!: TemplateRef<any>;

  @ViewChild('modalResponse')
  modalResponse!: TemplateRef<any>;


  constructor(private dialog: MatDialog, private fb: FormBuilder) {
  }


  popupForm = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(/^([А-ЯЁ][а-яё]+)$/)]],
    phone: ['', [Validators.required, Validators.pattern(/^(\+375|8|\+7)[\s(]*\d{2,3}[)\s]*\d{3}[\s-]?\d{2}[\s-]?\d{2}$/)]]
  });

  openModal() {
    this.dialog.open(this.modal);
  }

  openModalResponse() {

    setTimeout(() => {
      this.dialog.open(this.modalResponse);
    }, 500)
  }

}
