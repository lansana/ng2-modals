import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModalService } from './modal.service';
import { ModalWormholeComponent } from './modal-wormhole.component';
import { ModalComponent } from './modal.component';

@NgModule({
  imports: [CommonModule],
  exports: [
    ModalComponent,
    ModalWormholeComponent
  ],
  declarations: [
    ModalComponent,
    ModalWormholeComponent
  ],
  entryComponents: [],
  providers: [ModalService]
})
export class ModalModule {}
