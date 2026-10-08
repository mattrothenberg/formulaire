import * as React from 'react';
import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { CheckboxGroup } from '@base-ui/react/checkbox-group';
import { Field as BaseField } from '@base-ui/react/field';
import { Fieldset } from '@base-ui/react/fieldset';
import { Form as BaseForm } from '@base-ui/react/form';
import { Input as BaseInput } from '@base-ui/react/input';
import { NumberField } from '@base-ui/react/number-field';
import { Radio } from '@base-ui/react/radio';
import { RadioGroup } from '@base-ui/react/radio-group';
import { Select as BaseSelect } from '@base-ui/react/select';

export type Mode = 'edit' | 'filled';
export type Density = 'compact' | 'comfortable' | 'roomy';

const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(' ');

const ModeContext = React.createContext<Mode>('edit');
const useReadOnly = () => React.useContext(ModeContext) === 'filled';

// Controls that render a <button> (Select) or a group (radios, checkboxes)
// can't be the target of a native <label>. They flip this so the Field
// renders its label as a <div> and lets Base UI wire up aria-labelledby.
const LabelContext = React.createContext<((native: boolean) => void) | null>(
  null
);
function useNonNativeLabel() {
  const setNative = React.useContext(LabelContext);
  React.useLayoutEffect(() => {
    setNative?.(false);
    return () => setNative?.(true);
  }, [setNative]);
}

/* -------------------------------------------------------------------------- */

type FormErrors = NonNullable<React.ComponentProps<typeof BaseForm>['errors']>;

// The form's external errors (e.g. from a server), so each Field can show its
// own message. Root keeps the working copy and hands it to Base UI's Form too,
// so both always agree on which fields are invalid.
const FormErrorsContext = React.createContext<{
  errors: FormErrors;
  clear: (name: string) => void;
} | null>(null);

export interface RootProps
  extends Omit<React.ComponentProps<typeof BaseForm>, 'className'> {
  /** `filled` renders every control read-only, like a completed paper form. */
  mode?: Mode;
  density?: Density;
  className?: string;
}

function Root({
  mode = 'edit',
  density = 'comfortable',
  className,
  errors: errorsProp,
  ...props
}: RootProps) {
  // Like Base UI, a field's external error clears once the user edits it, and
  // a new `errors` prop replaces the set.
  const [errors, setErrors] = React.useState<FormErrors>(errorsProp ?? {});
  const [lastProp, setLastProp] = React.useState(errorsProp);
  if (errorsProp !== lastProp) {
    setLastProp(errorsProp);
    setErrors(errorsProp ?? {});
  }
  const clear = React.useCallback((name: string) => {
    setErrors((current) => {
      if (!Object.hasOwn(current, name)) return current;
      const { [name]: _cleared, ...rest } = current;
      return rest;
    });
  }, []);
  const context = React.useMemo(() => ({ errors, clear }), [errors, clear]);

  return (
    <ModeContext.Provider value={mode}>
      <FormErrorsContext.Provider value={context}>
        <BaseForm
          data-mode={mode}
          data-density={density}
          className={cx('gf', className)}
          errors={errors}
          {...props}
        />
      </FormErrorsContext.Provider>
    </ModeContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */

export interface SectionProps
  extends Omit<React.ComponentProps<typeof Fieldset.Root>, 'className'> {
  legend?: React.ReactNode;
  /** Passed to the legend: className, style (e.g. --gf-legend-* tokens), render. */
  legendProps?: Omit<
    React.ComponentProps<typeof Fieldset.Legend>,
    'children' | 'className'
  > & { className?: string };
  className?: string;
}

function Section({
  legend,
  legendProps,
  className,
  children,
  ...props
}: SectionProps) {
  const { className: legendClassName, ...restLegendProps } = legendProps ?? {};
  return (
    <Fieldset.Root className={cx('gf-section', className)} {...props}>
      {legend != null && (
        <Fieldset.Legend
          className={cx('gf-legend', legendClassName)}
          {...restLegendProps}
        >
          {legend}
        </Fieldset.Legend>
      )}
      {children}
    </Fieldset.Root>
  );
}

/* -------------------------------------------------------------------------- */

function Row({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cx('gf-row', className)} {...props} />;
}

/* -------------------------------------------------------------------------- */

/** The form's last row: buttons sit inside the grid instead of below it. */
function Actions({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cx('gf-actions', className)} {...props} />;
}

export interface ButtonProps extends React.ComponentProps<'button'> {
  variant?: 'primary' | 'secondary';
}

function Button({
  variant = 'secondary',
  type = 'button',
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      data-variant={variant}
      className={cx('gf-button', className)}
      {...props}
    />
  );
}

/* -------------------------------------------------------------------------- */

function useMergedRef<T>(...refs: Array<React.Ref<T> | undefined>) {
  return React.useCallback(
    (node: T | null) => {
      for (const ref of refs) {
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.RefObject<T | null>).current = node;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    refs
  );
}

const hasContent = (value: React.ReactNode) =>
  value != null && value !== false && value !== '';

const DEFAULT_MESSAGES: Partial<Record<keyof ValidityState, string>> = {
  valueMissing: 'Required',
  typeMismatch: 'Check format',
  patternMismatch: 'Check format',
  tooShort: 'Too short',
  tooLong: 'Too long',
  rangeUnderflow: 'Too low',
  rangeOverflow: 'Too high',
  stepMismatch: 'Invalid step',
  badInput: 'Invalid',
};

export interface FieldProps
  extends Omit<
    React.ComponentProps<typeof BaseField.Root>,
    'className' | 'style'
  > {
  label: React.ReactNode;
  /** Relative width within the row. Also sets how early the cell wraps. */
  span?: number;
  description?: React.ReactNode;
  /**
   * An error message from outside the browser's own validation, such as
   * react-hook-form or a server. While set, the field is invalid and this
   * message replaces the built-in ones.
   */
  error?: React.ReactNode;
  /** Override the short default validation messages. */
  messages?: Partial<Record<keyof ValidityState, React.ReactNode>>;
  className?: string;
  style?: React.CSSProperties;
}

function Field({
  label,
  span = 1,
  description,
  error,
  messages,
  className,
  style,
  children,
  invalid,
  onChange,
  ref,
  ...props
}: FieldProps) {
  const [nativeLabel, setNativeLabel] = React.useState(true);
  const allMessages = { ...DEFAULT_MESSAGES, ...messages };

  // An explicit `error` wins; otherwise the form's errors for this name.
  const form = React.useContext(FormErrorsContext);
  const name = props.name;
  const formError = name ? form?.errors[name] : undefined;
  const formMessage = Array.isArray(formError) ? formError[0] : formError;
  const message = hasContent(error) ? error : formMessage;
  const external = hasContent(message);

  // A message that won't fit on one line beside the label (within 60% of the
  // cell) moves to its own full-width line under the control instead.
  const fieldRef = React.useRef<HTMLDivElement>(null);
  const rootRef = useMergedRef(fieldRef, ref);
  const measureRef = React.useRef<HTMLSpanElement>(null);
  const [errorBelow, setErrorBelow] = React.useState(false);
  React.useLayoutEffect(() => {
    const field = fieldRef.current;
    const measure = measureRef.current;
    if (!external || !field || !measure) {
      setErrorBelow(false);
      return;
    }
    const check = () => {
      const style = getComputedStyle(field);
      const inner =
        field.clientWidth -
        parseFloat(style.paddingLeft) -
        parseFloat(style.paddingRight);
      setErrorBelow(measure.offsetWidth > inner * 0.6);
    };
    check();
    const observer = new ResizeObserver(check);
    observer.observe(field);
    return () => observer.disconnect();
  }, [external, message]);

  return (
    <LabelContext.Provider value={setNativeLabel}>
      <BaseField.Root
        ref={rootRef}
        className={cx('gf-field', className)}
        data-error-below={errorBelow || undefined}
        data-field={props.name}
        data-span={span}
        style={{ '--gf-span': span, ...style } as React.CSSProperties}
        invalid={hasContent(error) ? true : invalid}
        onChange={(event) => {
          // Editing the field clears its form-level error, as in Base UI.
          if (name && hasContent(formMessage)) form?.clear(name);
          onChange?.(event);
        }}
        onMouseDown={(event) => {
          // Clicking the cell's padding focuses its control, like the original.
          if (event.target !== event.currentTarget) return;
          const control = event.currentTarget.querySelector<HTMLElement>(
            'input:not([type=hidden]), textarea, button, [tabindex="0"]'
          );
          if (control) {
            event.preventDefault();
            control.focus();
          }
        }}
        {...props}
      >
        <BaseField.Label
          className="gf-label"
          nativeLabel={nativeLabel}
          render={nativeLabel ? undefined : <div />}
        >
          {label}
        </BaseField.Label>
        {external ? (
          <>
            <BaseField.Error className="gf-error" match>
              {message}
            </BaseField.Error>
            {/* Measures the message on one line; never shown or announced. */}
            <span ref={measureRef} className="gf-error gf-error-measure" aria-hidden>
              {message}
            </span>
          </>
        ) : (
          <>
            {Object.entries(allMessages).map(([key, short]) => (
              <BaseField.Error
                key={key}
                className="gf-error"
                match={key as keyof ValidityState}
              >
                {short}
              </BaseField.Error>
            ))}
            <BaseField.Error className="gf-error" match="customError" />
          </>
        )}
        {children}
        {description != null && (
          <BaseField.Description className="gf-description">
            {description}
          </BaseField.Description>
        )}
      </BaseField.Root>
    </LabelContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */

export interface InputProps
  extends Omit<React.ComponentProps<typeof BaseInput>, 'className'> {
  className?: string;
}

function Input({ className, placeholder = ' ', ...props }: InputProps) {
  const readOnly = useReadOnly();
  return (
    <BaseInput
      className={cx('gf-control', 'gf-input', className)}
      placeholder={placeholder}
      readOnly={readOnly || props.readOnly}
      {...props}
    />
  );
}

export interface TextareaProps extends React.ComponentProps<'textarea'> {}

function Textarea({ className, placeholder = ' ', ...props }: TextareaProps) {
  const readOnly = useReadOnly();
  return (
    <BaseField.Control
      render={
        <textarea
          rows={3}
          {...props}
          placeholder={placeholder}
          readOnly={readOnly || props.readOnly}
        />
      }
      className={cx('gf-control', 'gf-input', 'gf-textarea', className)}
    />
  );
}

/* -------------------------------------------------------------------------- */

export interface Option {
  value: string;
  label: React.ReactNode;
}

export interface SelectProps
  extends Omit<React.ComponentProps<typeof BaseSelect.Root>, 'items'> {
  items: Option[];
  placeholder?: React.ReactNode;
  className?: string;
}

function Select({
  items,
  placeholder = 'Select…',
  className,
  onOpenChange,
  onOpenChangeComplete,
  ...props
}: SelectProps) {
  useNonNativeLabel();
  const readOnly = useReadOnly();
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  /*
   * Keeps the cell styled as active from the moment the menu opens until
   * focus is back on the trigger. While the menu animates closed, focus is
   * still on an option outside the cell, and it only returns once the menu
   * unmounts. Without this the focus ring fades out and back in.
   */
  const [active, setActive] = React.useState(false);
  const settle = () => {
    const trigger = triggerRef.current;
    const focused = document.activeElement;
    // Focus moved somewhere else on purpose (e.g. a click into another cell).
    if (!trigger || (focused && focused !== document.body && !focused.closest('.gf-popup'))) {
      setActive(false);
      return;
    }
    const done = () => {
      window.clearTimeout(fallback);
      trigger.removeEventListener('focus', done);
      setActive(false);
    };
    const fallback = window.setTimeout(done, 150);
    trigger.addEventListener('focus', done);
  };

  return (
    <BaseSelect.Root
      items={items}
      readOnly={readOnly}
      onOpenChange={(open, details) => {
        if (open) setActive(true);
        onOpenChange?.(open, details);
      }}
      onOpenChangeComplete={(open) => {
        if (!open) settle();
        onOpenChangeComplete?.(open);
      }}
      {...props}
    >
      <BaseSelect.Trigger
        ref={triggerRef}
        className={cx('gf-control', 'gf-select', className)}
        data-menu-active={active || undefined}
      >
        <BaseSelect.Value
          className="gf-select-value"
          placeholder={placeholder}
        />
        <BaseSelect.Icon className="gf-select-icon">
          <ChevronIcon />
        </BaseSelect.Icon>
      </BaseSelect.Trigger>
      <BaseSelect.Portal>
        <BaseSelect.Positioner
          className="gf-positioner"
          sideOffset={6}
          alignItemWithTrigger={false}
        >
          <BaseSelect.Popup className="gf-popup">
            <BaseSelect.List>
              {items.map((item) => (
                <BaseSelect.Item
                  key={item.value}
                  value={item.value}
                  className="gf-option"
                >
                  <BaseSelect.ItemText>{item.label}</BaseSelect.ItemText>
                  <BaseSelect.ItemIndicator className="gf-option-indicator">
                    <CheckIcon />
                  </BaseSelect.ItemIndicator>
                </BaseSelect.Item>
              ))}
            </BaseSelect.List>
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  );
}

/* -------------------------------------------------------------------------- */

export interface NumberProps
  extends Omit<React.ComponentProps<typeof NumberField.Root>, 'className'> {
  /** Pixels of drag per step when scrubbing the label. */
  scrubSensitivity?: number;
  className?: string;
}

/**
 * A number input with −/+ steppers. Dragging horizontally across the label
 * row scrubs the value, like a design tool.
 */
function NumberInput({
  scrubSensitivity = 6,
  className,
  ...props
}: NumberProps) {
  const readOnly = useReadOnly();
  return (
    <NumberField.Root
      className={cx('gf-number', className)}
      readOnly={readOnly}
      {...props}
    >
      <NumberField.ScrubArea
        className="gf-scrub"
        direction="horizontal"
        pixelSensitivity={scrubSensitivity}
      >
        <NumberField.ScrubAreaCursor className="gf-scrub-cursor">
          <ScrubIcon />
        </NumberField.ScrubAreaCursor>
      </NumberField.ScrubArea>
      <NumberField.Group className="gf-control gf-number-group">
        <NumberField.Input className="gf-input" />
        <NumberField.Decrement className="gf-stepper" aria-label="Decrease">
          <MinusIcon />
        </NumberField.Decrement>
        <NumberField.Increment className="gf-stepper" aria-label="Increase">
          <PlusIcon />
        </NumberField.Increment>
      </NumberField.Group>
    </NumberField.Root>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * When focus is already in the cell, pressing an option's label would blur it
 * before the click lands and flash the focus fill. In that case only, move
 * focus straight to the option. From outside the cell, the browser's default
 * focus handling stays in charge, which avoids a stray keyboard focus ring.
 */
function focusOption(event: React.MouseEvent<HTMLLabelElement>) {
  const label = event.currentTarget;
  if (!label.closest('.gf-field')?.contains(document.activeElement)) return;
  const control = label.querySelector<HTMLElement>(
    '[role="radio"], [role="checkbox"]'
  );
  if (!control) return;
  event.preventDefault();
  control.focus({ focusVisible: false } as FocusOptions);
}

export interface ChoiceProps
  extends Omit<React.ComponentProps<typeof RadioGroup>, 'className'> {
  options: Option[];
  className?: string;
}

/** A single-select radio group laid out inline inside a cell. */
function Choice({ options, className, ...props }: ChoiceProps) {
  useNonNativeLabel();
  // The controls are spans with role="radio"; a wrapping <label> only names
  // native inputs, so each one points at its label text instead.
  const id = React.useId();
  const readOnly = useReadOnly();
  return (
    <RadioGroup
      className={cx('gf-control', 'gf-choices', className)}
      readOnly={readOnly}
      {...props}
    >
      {options.map((option) => (
        <label
          key={option.value}
          className="gf-choice"
          onMouseDown={focusOption}
        >
          <Radio.Root
            value={option.value}
            className="gf-radio"
            aria-labelledby={`${id}-${option.value}`}
          >
            <Radio.Indicator className="gf-radio-indicator" />
          </Radio.Root>
          <span id={`${id}-${option.value}`} aria-hidden>
            {option.label}
          </span>
        </label>
      ))}
    </RadioGroup>
  );
}

export interface ChecksProps
  extends Omit<React.ComponentProps<typeof CheckboxGroup>, 'className'> {
  options: Option[];
  className?: string;
}

/** A multi-select checkbox group laid out inline inside a cell. */
function Checks({ options, className, ...props }: ChecksProps) {
  useNonNativeLabel();
  const id = React.useId();
  const readOnly = useReadOnly();
  return (
    <CheckboxGroup
      className={cx('gf-control', 'gf-choices', className)}
      {...props}
    >
      {options.map((option) => (
        <label
          key={option.value}
          className="gf-choice"
          onMouseDown={focusOption}
        >
          <BaseCheckbox.Root
            value={option.value}
            readOnly={readOnly}
            className="gf-checkbox"
            aria-labelledby={`${id}-${option.value}`}
          >
            <BaseCheckbox.Indicator className="gf-checkbox-indicator">
              <CheckIcon />
            </BaseCheckbox.Indicator>
          </BaseCheckbox.Root>
          <span id={`${id}-${option.value}`} aria-hidden>
            {option.label}
          </span>
        </label>
      ))}
    </CheckboxGroup>
  );
}

/* -------------------------------------------------------------------------- */

function ChevronIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
      <path
        d="M2 3.5 5 6.5 8 3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
      <path
        d="M1.75 5.25 4 7.5 8.25 2.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
      <path d="M2 5h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
      <path
        d="M2 5h6M5 2v6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ScrubIcon() {
  return (
    <svg width="22" height="12" viewBox="0 0 22 12" aria-hidden="true">
      <path
        d="M1 6h20M5 2 1 6l4 4M17 2l4 4-4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const GridForm = {
  Root,
  Section,
  Row,
  Field,
  Input,
  Textarea,
  Number: NumberInput,
  Select,
  Choice,
  Checks,
  Actions,
  Button,
};
