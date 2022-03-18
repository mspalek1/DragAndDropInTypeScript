export interface Validatable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}

export function validate(validatableInput: Validatable) {
    let isValid = true;
    if (validatableInput.required) {
        isValid = isValid && validatableInput.value.toString().trim().length !== 0;
    }
    if (validatableInput.minLength != null && typeof validatableInput.value === 'string') {
        isValid = isValid && validatableInput.value.length >= validatableInput.minLength;
    }
    if (validatableInput.maxLength != null && typeof validatableInput.value === 'string') {
        isValid = isValid && validatableInput.value.length <= validatableInput.maxLength;
    }

    if(typeof validatableInput.value === 'number') {
        if(validatableInput.min != null) {
            isValid = isValid && validatableInput.value >= validatableInput.min;
        }
        if(validatableInput.max != null) {
            isValid = isValid && validatableInput.value <= validatableInput.max;
        }
    }
    return isValid;
}