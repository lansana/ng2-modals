import {
  Injectable,
  ViewContainerRef,
  ComponentRef,
  Injector,
  ReflectiveInjector,
  Type,
  ComponentFactoryResolver
} from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export enum ModalEvent {
  CREATED,
  DESTROYED
}

@Injectable()
export class ModalService {
  // The modalwormhole lives here
  private viewContainerRef: ViewContainerRef;

  // The injector is held here
  private injector: Injector;

  // Allow registration of ComponentFactoryResolver to fix AOT compilation compiler not found error
  private resolver: ComponentFactoryResolver;

  // This number can be used for the z-index of modals
  activeModals = 0;

  // A map to store modals by index (activeModals), so they can be
  // reference when multiple modals are on the screen at the same time.
  componentRefMap: Map<number, BehaviorSubject<ComponentRef<any>>> = new Map();
  componentRefEventMap: Map<number, BehaviorSubject<ModalEvent>> = new Map();

  private destroyComponentRef(componentRef: ComponentRef<any>) {
    if (this.componentRefEvents) {
      componentRef.destroy();

      this.componentRefEvents.next(ModalEvent.DESTROYED);
      this.componentRefEvents.complete();

      this.activeModals--;
    }
  }

  get componentRef(): BehaviorSubject<ComponentRef<any>> {
    return this.componentRefMap.get(this.activeModals);
  }

  get componentRef$(): Observable<ComponentRef<any>> {
    return this.componentRef.asObservable();
  }

  get componentRefEvents(): BehaviorSubject<any> {
    return this.componentRefEventMap.get(this.activeModals);
  }

  get componentRefEvents$(): Observable<ModalEvent> {
    return this.componentRefEvents.asObservable();
  }

  registerViewContainerRef(viewContainerRef: ViewContainerRef): void {
    this.viewContainerRef = viewContainerRef;
  }

  registerInjector(injector: Injector): void {
    this.injector = injector;
  }

  registerResolver(resolver: ComponentFactoryResolver) {
    this.resolver = resolver;
  }

  create<T>(component: Type<T>, parameters?: Object): Observable<ComponentRef<T>> {
    this.activeModals++;

    // Get the component factory from the resolver
    const componentFactory = this.resolver.resolveComponentFactory(component);

    // The injector will be needed for DI in the custom component
    const childInjector = ReflectiveInjector.fromResolvedProviders([], this.viewContainerRef.parentInjector);

    // Create the actual component
    const componentRef = this.viewContainerRef.createComponent(componentFactory, 0, childInjector);

    this.componentRefMap.set(this.activeModals, new BehaviorSubject(componentRef));
    this.componentRefEventMap.set(this.activeModals, new BehaviorSubject(ModalEvent.CREATED));

    // Pass the @Input parameters to the instance
    Object.assign(componentRef.instance, parameters);

    componentRef.instance['activeModals'] = this.activeModals;
    componentRef.instance['destroy'] = () => this.destroyComponentRef(componentRef);

    componentRef.changeDetectorRef.detectChanges();

    // The component is rendered into the ViewContainerRef, so we can update
    // and complete the stream.
    this.componentRef.next(componentRef);
    this.componentRef.complete();

    // We return the stream so we can access the componentRef on creation
    return this.componentRef$;
  }

  destroyAll() {
    this.componentRefMap.forEach((subject: BehaviorSubject<ComponentRef<any>>) => this.destroyComponentRef(subject.getValue()));
  }
}
