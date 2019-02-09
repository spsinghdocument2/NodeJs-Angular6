import { OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';


export class ComponentBase implements OnDestroy {

    private isClearing: boolean = false;
    private subscriptions: Array<Subscription> = new Array<Subscription>();

    protected set addSubscription(newSubscription: Subscription) {
        this.subscriptions.push(newSubscription);
    }

    protected clearClosedSubscriptions() {
        if (!this.isClearing && Array.isArray(this.subscriptions)) {
            this.isClearing = true;
            this.subscriptions = this.subscriptions.filter(subscription => !subscription.closed);
            this.isClearing = false;
        }
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.subscriptions = null;
    }
}