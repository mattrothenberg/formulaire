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
  ...props
}: RootProps) {
  return (
    <ModeContext.Provider value={mode}>
      <BaseForm
        data-mode={mode}
        data-density={density}
        className={cx('gf', className)}
        {...props}
      />
    </ModeContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */

export interface SectionProps
  extends Omit<React.ComponentProps<typeof Fieldset.Root>, 'className'> {
  legend?: React.ReactNode;
  className?: string;
}

function Section({ legend, className, children, ...props }: SectionProps) {
  return (
    <Fieldset.Root className={cx('gf-section', className)} {...props}>
      {legend != null && (
        <Fieldset.Legend className="gf-legend">{legend}</Fieldset.Legend>
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
  /** Override the short default validation messages. */
  messages?: Partial<Record<keyof ValidityState, React.ReactNode>>;
  className?: string;
  style?: React.CSSProperties;
}

function Field({
  label,
  span = 1,
  description,
  messages,
  className,
  style,
  children,
  ...props
}: FieldProps) {
  const [nativeLabel, setNativeLabel] = React.useState(true);
  const allMessages = { ...DEFAULT_MESSAGES, ...messages };

  return (
    <LabelContext.Provider value={setNativeLabel}>
      <BaseField.Root
        className={cx('gf-field', className)}
        data-field={props.name}
        data-span={span}
        style={{ '--gf-span': span, ...style } as React.CSSProperties}
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
        {Object.entries(allMessages).map(([key, message]) => (
          <BaseField.Error
            key={key}
            className="gf-error"
            match={key as keyof ValidityState}
          >
            {message}
          </BaseField.Error>
        ))}
        <BaseField.Error className="gf-error" match="customError" />
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
