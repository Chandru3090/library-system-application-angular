import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value || '';

        if (!value) {
            return { required: true };
        }

        // Define password validation rules
        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasNumber = /\d/.test(value);
        const hasSpecialChar = /[@$!%*?&]/.test(value);
        const minLength = value.length >= 8;

        const isValid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && minLength;

        return !isValid
            ? { passwordStrength: 'Password must include at least 8 characters, an uppercase letter, a lowercase letter, a number, and a special character' }
            : null;
    };
}
