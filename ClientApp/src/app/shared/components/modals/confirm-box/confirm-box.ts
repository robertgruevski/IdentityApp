import { Component, inject, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-box',
  imports: [],
  templateUrl: './confirm-box.html',
  styleUrl: './confirm-box.scss'
})
export class ConfirmBox {
  @Input() message: string = '';
  result?: boolean;

  public activeModel = inject(NgbActiveModal);

  yes() {
    this.activeModel.close(true);
  }

  no() {
    this.activeModel.close(false);
  }
}
