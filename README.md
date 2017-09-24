# ng2-modals
A lightweight, expressive and durable approach to Angular 2 modals.

## Installation
Copy and paste the files in the repository into a directory in your project, namely `modals`. Then import `ModalModule` into your projects root component.

That's it.

## Creating custom modals
Create custom modal components inside `modals` and add them to the `declarations`, `exports`, and `entryComponents` of your `ModalModule`.

### Example
In `modals/confirm-modal/conform-modal.component.ts`:

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'confirm-modal',
  template: `<modal></modal>`
})
export class ConfirmModalComponent {}
```

In `modals/modal.module.ts`:
```typescript
@NgModule({
  imports: [CommonModule],
  exports: [
    ModalComponent,
    ModalWormholeComponent,
    ConfirmModalComponent // <---- HERE
  ],
  declarations: [
    ModalComponent,
    ModalWormholeComponent,
    ConfirmModalComponent // <---- HERE
  ],
  entryComponents: [
    ConfirmModalComponent // <---- HERE
  ],
  providers: [ModalService]
})
```

Now use it like so in any of your other app components:
```typescript
@Component({
  template: `
    <button (click)="openConfirmModal()">Confirm Modal</button>
  `
})
export class MyComponent {
  constructor(private modalService: ModalService) {}

  openConfirmModal() {
    this.modalService.create(ConfirmModalComponent, {
      // Options/callback functions go here. 
      // These will override class properties of ConfirmModalComponent.
    });
  }
}
```

For a full guide, read the [Medium article](https://medium.com/@Lansana/angular-2-modals-a-different-approach-23c286585df4).
