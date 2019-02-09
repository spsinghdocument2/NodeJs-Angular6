import { Injectable } from '@angular/core';

// reference to alertify framework, loaded by index.html
// declare var alertify: any;
declare var alertify: any;
declare var $: any;

@Injectable()
export class NotificationService {

    public closeAll(): void {
        $('.alertify').addClass('hide');
    }

    public success(text: string): void {
       return alertify.success(text);
    }
    public error(text: string): void {
   return  alertify.error(text);
    }

    public errorMessage(text: string): void {
    		return	alertify.alert(text);
    }

    public delay( text: string): void {
           alertify.set({ delay: 10000 });
		return	alertify.log(text);
    }

    public confirm(callback: Function, message: string): void {
        	// 		alertify.confirm("This is a confirm dialog", function (e)
            //          {
			// 	if (e) {
			// 		alertify.success("You've clicked OK");
			// 	} else {
			// 		alertify.error("You've clicked Cancel");
			// 	}
			// });
    }

    public confirmPromise(message: string) {
   return  alertify.log(message, "", 0);
    }

    public custom(message: string) {
			alertify.custom = alertify.extend("custom");
		return	alertify.custom(message);
    }

    public configureAlertify(message: string) {
      			alertify.prompt(message, function (e, str) {
				if (e) {
					alertify.success("You've clicked OK and typed: " + str);
				} else {
					alertify.error("You've clicked Cancel");
				}
			}, "Default Value");
    }
    //  public confirmUnsaved(message: string) {
    //     return alertify
    //         .okBtn("Continue Without Saving")
    //         .cancelBtn("Cancel")
    //  }
}

