import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PatternValidatorService {
  atleastTwoNumbers(value: string): boolean {
    return /\d{2}/.test(value)
  }

  atleastOneCharacter(value: string): boolean {
    return /[!@#$%^&*]/.test(value)
  }

  atleastOneUppercaseLetter(value: string): boolean {
    return /[A-Z]/.test(value)
  }

  atleastOneLowercaseLetter(value: string): boolean {
    return /[a-z]/.test(value)
  }

  invalidSpecialCharacter(value: string): boolean {
    return /[^!@#$%^&*|A-Za-z0-9]/.test(value)
  }

  removeHeadersFromImg(image: string): string | boolean {
    const string: RegExpExecArray | null = /base64,(.+)/.exec(image)
    if (string != null) {
      let data: string | null = string[1]
      if (data != null) {
        return (<string>data);
      }
    }
    return false;
  }
  getSample(image: string) {
    const string: RegExpExecArray | null = /base64,(.+)/.exec(image)
    return string
  }

  getNumbersfromDiv(str: string) {
    return str.match(/(?!<div>)([0-9]+)(?!\\<\/div>)/gm)
  }
}
