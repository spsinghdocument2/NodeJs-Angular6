/**
 This is the Angular 2 lang class, they refer to it a lot and I wanted a version we could use
 Glenn; based on Angular 2 2.0.0 on 9/15/2016
 */


export function getTypeNameForDebugging(type: any): string {
	if (type['name']) {
		return type['name'];
	}
	return typeof type;
}

export function isPresent(obj: any): boolean {
	return obj !== undefined && obj !== null;
}

export function isBlank(obj: any): boolean {
	return obj === undefined || obj === null;
}

export function isBoolean(obj: any): boolean {
	return typeof obj === 'boolean';
}

export function isNumber(obj: any): boolean {
	return typeof obj === 'number';
}

export function isString(obj: any): obj is string {
	return typeof obj === 'string';
}

export function isFunction(obj: any): boolean {
	return typeof obj === 'function';
}

export function isType(obj: any): boolean {
	return isFunction(obj);
}

export function isStringMap(obj: any): obj is Object {
	return typeof obj === 'object' && obj !== null;
}

const STRING_MAP_PROTO = Object.getPrototypeOf({});
export function isStrictStringMap(obj: any): boolean {
	return isStringMap(obj) && Object.getPrototypeOf(obj) === STRING_MAP_PROTO;
}

export function isPromise(obj: any): boolean {
	// allow any Promise/A+ compliant thenable.
	// It's up to the caller to ensure that obj.then conforms to the spec
	return isPresent(obj) && isFunction(obj.then);
}

export function isArray(obj: any): boolean {
	return Array.isArray(obj);
}

export function isDate(obj: any): obj is Date {
	return obj instanceof Date && !isNaN(obj.valueOf());
}

export function noop() { }

export function stringify(token: any): string {
	if (typeof token === 'string') {
		return token;
	}

	if (token === undefined || token === null) {
		return '' + token;
	}

	if (token.overriddenName) {
		return token.overriddenName;
	}
	if (token.name) {
		return token.name;
	}

	var res = token.toString();
	var newLineIndex = res.indexOf('\n');
	return (newLineIndex === -1) ? res : res.substring(0, newLineIndex);
}

// serialize / deserialize enum exist only for consistency with dart API
// enums in typescript don't need to be serialized

export function serializeEnum(val: any): number {
	return val;
}

export function deserializeEnum(val: any, values: Map<number, any>): any {
	return val;
}

export function resolveEnumToken(enumValue: any, val: any): string {
	return enumValue[val];
}

export class StringWrapper {
	static fromCharCode(code: number): string { return String.fromCharCode(code); }

	static charCodeAt(s: string, index: number): number { return s.charCodeAt(index); }

	static split(s: string, regExp: RegExp): string[] { return s.split(regExp); }

	static equals(s: string, s2: string): boolean { return s === s2; }

	static stripLeft(s: string, charVal: string): string {
		if (s && s.length) {
			var pos = 0;
			for (var i = 0; i < s.length; i++) {
				if (s[i] != charVal) break;
				pos++;
			}
			s = s.substring(pos);
		}
		return s;
	}

	static stripRight(s: string, charVal: string): string {
		if (s && s.length) {
			var pos = s.length;
			for (var i = s.length - 1; i >= 0; i--) {
				if (s[i] != charVal) break;
				pos--;
			}
			s = s.substring(0, pos);
		}
		return s;
	}

	static replace(s: string, from: string, replace: string): string {
		return s.replace(from, replace);
	}

	static replaceAll(s: string, from: RegExp, replace: string): string {
		return s.replace(from, replace);
	}

	static slice<T>(s: string, from: number = 0, to: number = null): string {
		return s.slice(from, to === null ? undefined : to);
	}

	static replaceAllMapped(s: string, from: RegExp, cb: (m: string[]) => string): string {
		return s.replace(from, function (...matches: any[]) {
			// Remove offset & string from the result array
			matches.splice(-2, 2);
			// The callback receives match, p1, ..., pn
			return cb(matches);
		});
	}

	static contains(s: string, substr: string): boolean { return s.indexOf(substr) != -1; }

	static compare(a: string, b: string): number {
		if (a < b) {
			return -1;
		} else if (a > b) {
			return 1;
		} else {
			return 0;
		}
	}
}

export class StringJoiner {
	constructor(public parts: string[] = []) { }

	add(part: string): void { this.parts.push(part); }

	toString(): string { return this.parts.join(''); }
}


export class NumberWrapper {
	static toFixed(n: number, fractionDigits: number): string { return n.toFixed(fractionDigits); }

	static equal(a: number, b: number): boolean { return a === b; }

	static parseIntAutoRadix(text: string): number {
		var result: number = parseInt(text);
		if (isNaN(result)) {
			throw new Error('Invalid integer literal when parsing ' + text);
		}
		return result;
	}

	static parseInt(text: string, radix: number): number {
		if (radix == 10) {
			if (/^(\-|\+)?[0-9]+$/.test(text)) {
				return parseInt(text, radix);
			}
		} else if (radix == 16) {
			if (/^(\-|\+)?[0-9ABCDEFabcdef]+$/.test(text)) {
				return parseInt(text, radix);
			}
		} else {
			var result: number = parseInt(text, radix);
			if (!isNaN(result)) {
				return result;
			}
		}
		throw new Error('Invalid integer literal when parsing ' + text + ' in base ' + radix);
	}

	static get NaN(): number { return NaN; }

	static isNumeric(value: any): boolean { return !isNaN(value - parseFloat(value)); }

	static isNaN(value: any): boolean { return isNaN(value); }

	static isInteger(value: any): boolean { return Number.isInteger(value); }
}

export class FunctionWrapper {
	static apply(fn: Function, posArgs: any): any { return fn.apply(null, posArgs); }

	static bind(fn: Function, scope: any): Function { return fn.bind(scope); }
}

// JS has NaN !== NaN
export function looseIdentical(a: any, b: any): boolean {
	return a === b || typeof a === 'number' && typeof b === 'number' && isNaN(a) && isNaN(b);
}

// JS considers NaN is the same as NaN for map Key (while NaN !== NaN otherwise)
// see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
export function getMapKey<T>(value: T): T {
	return value;
}

export function normalizeBlank(obj: Object): any {
	return isBlank(obj) ? null : obj;
}

export function normalizeBool(obj: boolean): boolean {
	return isBlank(obj) ? false : obj;
}

export function isJsObject(o: any): boolean {
	return o !== null && (typeof o === 'function' || typeof o === 'object');
}

export function print(obj: Error | Object) {
	console.log(obj);
}

export function warn(obj: Error | Object) {
	console.warn(obj);
}

export class DateWrapper {
	static create(
		year: number, month: number = 1, day: number = 1, hour: number = 0, minutes: number = 0,
		seconds: number = 0, milliseconds: number = 0): Date {
		return new Date(year, month - 1, day, hour, minutes, seconds, milliseconds);
	}
	static fromISOString(str: string): Date { return new Date(str); }
	static fromMillis(ms: number): Date { return new Date(ms); }
	static toMillis(date: Date): number { return date.getTime(); }
	static now(): Date { return new Date(); }
	static toJson(date: Date): string { return date.toJSON(); }
}

export function setValueOnPath(global: any, path: string, value: any) {
	var parts = path.split('.');
	var obj: any = global;
	while (parts.length > 1) {
		var name = parts.shift();
		if (obj.hasOwnProperty(name) && isPresent(obj[name])) {
			obj = obj[name];
		} else {
			obj = obj[name] = {};
		}
	}
	if (obj === undefined || obj === null) {
		obj = {};
	}
	obj[parts.shift()] = value;
}

export function isPrimitive(obj: any): boolean {
	return !isJsObject(obj);
}

export function hasConstructor(value: Object, type: any): boolean {
	return value.constructor === type;
}

export function escapeRegExp(s: string): string {
	return s.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
}