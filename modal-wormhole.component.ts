import { Component, ViewChild, ViewContainerRef, Injector, OnInit, ComponentFactoryResolver } from '@angular/core';

import { ModalService } from './modal.service';

@Component({
  selector: 'modal-wormhole',
  template: `<div #modalwormhole></div>`
})
export class ModalWormholeComponent implements OnInit {
  @ViewChild('modalwormhole', {read: ViewContainerRef}) viewContainerRef;

  constructor(
    private modalService: ModalService,
    private injector: Injector,
    private resolver: ComponentFactoryResolver
  ) {}

  ngOnInit() {
    this.modalService.registerViewContainerRef(this.viewContainerRef);
    this.modalService.registerInjector(this.injector);
    this.modalService.registerResolver(this.resolver);
  }
}
