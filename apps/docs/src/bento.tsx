import * as React from 'react';
import { GridForm } from 'formulaire-ui';

// Each tile renders the real component, small and inert.

const stocks = [
  { value: 'portra', label: 'Portra 400' },
  { value: 'hp5', label: 'HP5 Plus' },
];

const formats = [
  { value: '35', label: '35mm' },
  { value: '120', label: '120' },
];

const extras = [
  { value: 'prints', label: 'Prints' },
  { value: 'negs', label: 'Negs' },
];

interface Tile {
  name: string;
  base: string;
  size?: 'wide' | 'big';
  visual: React.ReactNode;
}

const tiles: Tile[] = [
  {
    name: 'Root',
    base: 'Form',
    size: 'big',
    visual: (
      <>
        <GridForm.Section legend="Customer">
          <GridForm.Row>
            <GridForm.Field label="Name" span={2}>
              <GridForm.Input defaultValue="Ada Lovelace" />
            </GridForm.Field>
            <GridForm.Field label="Phone">
              <GridForm.Input defaultValue="555 0136" />
            </GridForm.Field>
          </GridForm.Row>
        </GridForm.Section>
        <GridForm.Section legend="Rolls">
          <GridForm.Row>
            <GridForm.Field label="Stock" span={2}>
              <GridForm.Select items={stocks} defaultValue="portra" />
            </GridForm.Field>
            <GridForm.Field label="Rolls">
              <GridForm.Number defaultValue={3} />
            </GridForm.Field>
          </GridForm.Row>
          <GridForm.Row>
            <GridForm.Field label="Format">
              <GridForm.Choice options={formats} defaultValue="120" />
            </GridForm.Field>
          </GridForm.Row>
        </GridForm.Section>
        <GridForm.Actions>
          <GridForm.Button variant="primary">Place order</GridForm.Button>
        </GridForm.Actions>
      </>
    ),
  },
  {
    name: 'Section',
    base: 'Fieldset',
    visual: (
      <GridForm.Section legend="Shipping">
        <GridForm.Row>
          <GridForm.Field label="City">
            <GridForm.Input defaultValue="Lyon" />
          </GridForm.Field>
        </GridForm.Row>
      </GridForm.Section>
    ),
  },
  {
    name: 'Row',
    base: '—',
    visual: (
      <>
        <GridForm.Row>
          <GridForm.Field label="A">
            <GridForm.Input />
          </GridForm.Field>
          <GridForm.Field label="B" span={2}>
            <GridForm.Input />
          </GridForm.Field>
        </GridForm.Row>
        <GridForm.Row>
          <GridForm.Field label="C" span={2}>
            <GridForm.Input />
          </GridForm.Field>
          <GridForm.Field label="D">
            <GridForm.Input />
          </GridForm.Field>
        </GridForm.Row>
      </>
    ),
  },
  {
    name: 'Field',
    base: 'Field',
    visual: (
      <GridForm.Row>
        <GridForm.Field
          label="Email"
          description="For the scan link"
        >
          <GridForm.Input defaultValue="ada@post.fr" />
        </GridForm.Field>
      </GridForm.Row>
    ),
  },
  {
    name: 'Input',
    base: 'Input',
    visual: (
      <GridForm.Row>
        <GridForm.Field label="Name">
          <GridForm.Input defaultValue="Ada" />
        </GridForm.Field>
      </GridForm.Row>
    ),
  },
  {
    name: 'Textarea',
    base: 'Field.Control',
    size: 'wide',
    visual: (
      <GridForm.Row>
        <GridForm.Field label="Notes">
          <GridForm.Textarea
            rows={2}
            defaultValue="Pushed one stop. Light leak on frame 12, please don't crop it."
          />
        </GridForm.Field>
      </GridForm.Row>
    ),
  },
  {
    name: 'Number',
    base: 'NumberField',
    visual: (
      <GridForm.Row>
        <GridForm.Field label="Rolls">
          <GridForm.Number defaultValue={3} />
        </GridForm.Field>
      </GridForm.Row>
    ),
  },
  {
    name: 'Select',
    base: 'Select',
    visual: (
      <GridForm.Row>
        <GridForm.Field label="Stock">
          <GridForm.Select items={stocks} defaultValue="hp5" />
        </GridForm.Field>
      </GridForm.Row>
    ),
  },
  {
    name: 'Choice',
    base: 'RadioGroup',
    visual: (
      <GridForm.Row>
        <GridForm.Field label="Format">
          <GridForm.Choice options={formats} defaultValue="35" />
        </GridForm.Field>
      </GridForm.Row>
    ),
  },
  {
    name: 'Checks',
    base: 'CheckboxGroup',
    visual: (
      <GridForm.Row>
        <GridForm.Field label="Extras">
          <GridForm.Checks options={extras} defaultValue={['negs']} />
        </GridForm.Field>
      </GridForm.Row>
    ),
  },
  {
    name: 'Actions',
    base: 'Button',
    size: 'wide',
    visual: (
      <>
        <GridForm.Row>
          <GridForm.Field label="Total">
            <GridForm.Input defaultValue="€42.00" />
          </GridForm.Field>
        </GridForm.Row>
        <GridForm.Actions>
          <GridForm.Button>Reset</GridForm.Button>
          <GridForm.Button variant="primary">Place order</GridForm.Button>
        </GridForm.Actions>
      </>
    ),
  },
];

export function ComponentBento() {
  return (
    <ul className="bento">
      {tiles.map((tile) => (
        <li key={tile.name} className="bento-tile" data-size={tile.size}>
          <div className="bento-visual" inert>
            <GridForm.Root density="compact" render={<div />}>
              {tile.visual}
            </GridForm.Root>
          </div>
          <div className="bento-meta">
            <code>GridForm.{tile.name}</code>
            <span>{tile.base}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
