import { AbstractControl, ValidationErrors } from '@angular/forms';

export function minLengthArray(min: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control instanceof Array || (control as any).controls) {
      const array = (control as any).controls || [];
      return array.length >= min
        ? null
        : { minLengthArray: { requiredLength: min, actualLength: array.length } };
    }
    return null;
  };
}
