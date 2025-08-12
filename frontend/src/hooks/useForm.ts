import { useState, useCallback, useEffect } from 'react';
import { z } from 'zod';

type FieldErrors<T> = {
  [K in keyof T]?: string;
};

interface UseFormOptions<T> {
  initialValues: T;
  validationSchema?: z.ZodSchema<T>;
  onSubmit?: (values: T) => Promise<void> | void;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

interface UseFormReturn<T> {
  values: T;
  errors: FieldErrors<T>;
  touched: { [K in keyof T]?: boolean };
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
  setFieldValue: <K extends keyof T>(field: K, value: T[K]) => void;
  setFieldError: <K extends keyof T>(field: K, error: string) => void;
  setFieldTouched: <K extends keyof T>(field: K, touched?: boolean) => void;
  handleChange: (field: keyof T) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleBlur: (field: keyof T) => (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  resetForm: (newValues?: Partial<T>) => void;
  validateField: <K extends keyof T>(field: K) => Promise<string | undefined>;
  validateForm: () => Promise<FieldErrors<T>>;
}

/**
 * Custom hook for form state management with validation
 */
export function useForm<T extends Record<string, any>>(
  options: UseFormOptions<T>
): UseFormReturn<T> {
  const {
    initialValues,
    validationSchema,
    onSubmit,
    validateOnChange = false,
    validateOnBlur = true,
  } = options;

  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FieldErrors<T>>({});
  const [touched, setTouched] = useState<{ [K in keyof T]?: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialFormValues] = useState<T>(initialValues);

  // Compute derived state
  const isValid = Object.keys(errors).length === 0;
  const isDirty = JSON.stringify(values) !== JSON.stringify(initialFormValues);

  // Validate a single field
  const validateField = useCallback(
    async <K extends keyof T>(field: K): Promise<string | undefined> => {
      if (!validationSchema) return undefined;

      try {
        // Validate just this field value
        await validationSchema.parseAsync({ ...values, [field]: values[field] });
        return undefined;
      } catch (error) {
        if (error instanceof z.ZodError) {
          const fieldError = error.errors.find(err => err.path.includes(field as string));
          return fieldError?.message;
        }
        return 'Validation error';
      }
    },
    [validationSchema, values]
  );

  // Validate the entire form
  const validateForm = useCallback(async (): Promise<FieldErrors<T>> => {
    if (!validationSchema) return {};

    try {
      await validationSchema.parseAsync(values);
      return {};
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formErrors: FieldErrors<T> = {};
        error.errors.forEach(err => {
          const field = err.path[0] as keyof T;
          if (field && !formErrors[field]) {
            formErrors[field] = err.message;
          }
        });
        return formErrors;
      }
      return {};
    }
  }, [validationSchema, values]);

  // Set field value
  const setFieldValue = useCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      setValues(prev => ({ ...prev, [field]: value }));
      
      if (validateOnChange) {
        validateField(field).then(error => {
          setErrors(prev => ({
            ...prev,
            [field]: error,
          }));
        });
      }
    },
    [validateOnChange, validateField]
  );

  // Set field error
  const setFieldError = useCallback(
    <K extends keyof T>(field: K, error: string) => {
      setErrors(prev => ({ ...prev, [field]: error }));
    },
    []
  );

  // Set field touched
  const setFieldTouched = useCallback(
    <K extends keyof T>(field: K, isTouched: boolean = true) => {
      setTouched(prev => ({ ...prev, [field]: isTouched }));
    },
    []
  );

  // Handle input change
  const handleChange = useCallback(
    (field: keyof T) => (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      const { type, value } = event.target;
      let fieldValue: any = value;

      // Handle different input types
      if (type === 'checkbox') {
        fieldValue = (event.target as HTMLInputElement).checked;
      } else if (type === 'number') {
        fieldValue = value ? parseFloat(value) : undefined;
      }

      setFieldValue(field, fieldValue);
    },
    [setFieldValue]
  );

  // Handle input blur
  const handleBlur = useCallback(
    (field: keyof T) => (
      _event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      setFieldTouched(field, true);
      
      if (validateOnBlur) {
        validateField(field).then(error => {
          setErrors(prev => ({
            ...prev,
            [field]: error,
          }));
        });
      }
    },
    [validateOnBlur, validateField, setFieldTouched]
  );

  // Handle form submission
  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsSubmitting(true);

      try {
        // Validate form
        const formErrors = await validateForm();
        setErrors(formErrors);

        // Mark all fields as touched
        const allTouched = Object.keys(values).reduce(
          (acc, key) => ({ ...acc, [key]: true }),
          {}
        );
        setTouched(allTouched);

        // Submit if no errors
        if (Object.keys(formErrors).length === 0 && onSubmit) {
          await onSubmit(values);
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validateForm, onSubmit]
  );

  // Reset form
  const resetForm = useCallback(
    (newValues?: Partial<T>) => {
      const resetValues = newValues ? { ...initialValues, ...newValues } : initialValues;
      setValues(resetValues);
      setErrors({});
      setTouched({});
      setIsSubmitting(false);
    },
    [initialValues]
  );

  // Update values when initialValues change
  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    isDirty,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    validateField,
    validateForm,
  };
}

/**
 * Helper hook for getting field props
 */
export function useFormField<T>(
  form: UseFormReturn<T>,
  field: keyof T
) {
  const { values, errors, touched, handleChange, handleBlur } = form;
  
  return {
    name: field as string,
    value: values[field],
    error: touched[field] ? errors[field] : undefined,
    onChange: handleChange(field),
    onBlur: handleBlur(field),
  };
}

export default useForm;