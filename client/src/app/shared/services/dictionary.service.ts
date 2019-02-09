import { Injectable } from '@angular/core';


@Injectable()
export class DictionaryService {
    private dictionary: any = {};

    public addOrUpdateItem(key: string, value: any) {        
        this.dictionary[key] = value;  
        sessionStorage.setItem(key, this.dictionary[key]);   
    }

    public removeItem(key: string) {
        if (key in this.dictionary) {
            delete this.dictionary.key;
            sessionStorage.removeItem(key);
        }
    }

    public getItem(key: string): any {
        this.dictionary[key] = sessionStorage.getItem(key);
        if (key in this.dictionary) {
            return this.dictionary[key];
        }
        return null;
    }
}