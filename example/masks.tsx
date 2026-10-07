// Input masks for the demo, via Maskito. Formulaire doesn't bundle a mask
// library; any ref-based one works because GridForm.Input passes its ref
// straight to the <input>.
import type { MaskitoOptions } from '@maskito/core';
import { maskitoPhone } from '@maskito/phone';
import { useMaskito } from '@maskito/react';
import metadata from 'libphonenumber-js/min/metadata';
import { GridForm, type InputProps } from '../src';

// (212) 343-3355. Options live at module scope so useMaskito doesn't
// rebuild the mask on every render.
export const phoneMask: MaskitoOptions = maskitoPhone({
  countryIsoCode: 'US',
  metadata,
  format: 'NATIONAL',
});

export const zipMask: MaskitoOptions = {
  mask: [/\d/, /\d/, /\d/, /\d/, /\d/],
};

/*
 * The hook lives with the input it masks. Calling useMaskito higher up and
 * passing the ref down breaks when the input remounts (the form's Reset):
 * Maskito tears down the new mask while cleaning up the old one.
 */
export function MaskedInput({
  mask,
  ...props
}: InputProps & { mask: MaskitoOptions }) {
  const ref = useMaskito({ options: mask });
  return <GridForm.Input ref={ref} {...props} />;
}
