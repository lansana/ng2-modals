import { Component, ComponentRef, OnInit, ElementRef, AfterViewInit, HostListener } from '@angular/core';

import { ModalService } from './modal.service';

@Component({
  selector: 'modal',
  template: `
    <div class="modal modal--backdrop" [style.zIndex]="modalIndex">
      <div class="modal-dialog-wrapper" [style.zIndex]="modalDialogIndex">
        <div class="modal-dialog" [style.zIndex]="modalDialogIndex">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit, AfterViewInit {
  private hasClosed = false;

  activeModals: number;
  modalIndex: number;
  modalDialogIndex: number;

  destroy: Function;

  constructor(
    private el: ElementRef,
    private modalService: ModalService
  ) {}

  @HostListener('window:resize')
  onResize() {
    this.verticallyCenterModal();
  }

  private closeOnBackdropClick() {
    this.el.nativeElement.querySelector('.modal').addEventListener('click', () => {
      // Close the modal.
      // This check is to prevent a document click being triggered multiple times.
      if (!this.hasClosed) {
        this.hasClosed = true;
        this.close();
      }
    }, false);
  }

  private verticallyCenterModal() {
    const modal = this.el.nativeElement.querySelector('.modal-dialog');
    const modalRect = modal.getBoundingClientRect();

    const viewportHeight = Math.max(window.document.documentElement.clientHeight, window.innerHeight || 0);

    if (viewportHeight > modalRect.height) {
      modal.style.top = `${(viewportHeight / 2) - (modalRect.height / 2)}px`;
    }
  }

  ngOnInit() {
    this.modalService.componentRef$.subscribe((modal: ComponentRef<any>) => {
      this.activeModals = modal.instance['activeModals'];
      this.destroy = modal.instance['destroy'];
      this.modalIndex = this.activeModals + 1000;
      this.modalDialogIndex = this.activeModals + 1001;

      this.closeOnBackdropClick();
    });
  }

  ngAfterViewInit() {
    this.verticallyCenterModal();
  }

  close() {
    this['destroy']();
  }
}
