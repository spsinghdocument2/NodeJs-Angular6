import {Pipe, PipeTransform} from '@angular/core';

@Pipe({ name: 'columnExclude', pure: false })
export class ColumnExcludePipe implements PipeTransform {
    transform(value, args?) {
        // ES6 array destructuring
        if (!value) {
            return;
        }
        return value.filter(column => {
            return (!column.IsKeyColumn && !column.IsGroupColumn)
        });
    }
}