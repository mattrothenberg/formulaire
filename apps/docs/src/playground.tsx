// Playground: scenarios for trying the library by hand. Not linked from the
// site; open /playground.html on the dev server.
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Controller, useForm } from 'react-hook-form';
import { GridForm } from 'formulaire-ui';
import 'formulaire-ui/styles.css';
import './demo.css';

const stocks = [
  { value: 'portra-400', label: 'Kodak Portra 400' },
  { value: 'hp5', label: 'Ilford HP5 Plus' },
  { value: 'cinestill-800t', label: 'CineStill 800T' },
];

const formats = [
  { value: '35', label: '35mm' },
  { value: '120', label: '120' },
  { value: '4x5', label: '4×5' },
];

function Scenario({
  title,
  children,
  notes,
}: {
  title: string;
  children: React.ReactNode;
  notes: React.ReactNode;
}) {
  return (
    <section className="pg-scenario">
      <h2>{title}</h2>
      <p className="pg-notes">{notes}</p>
      {children}
    </section>
  );
}

function Output({ label, value }: { label: string; value: unknown }) {
  return (
    <pre className="pg-output" aria-label={label}>
      {value === undefined ? '—' : JSON.stringify(value, null, 2)}
    </pre>
  );
}

/* ------------------------------------------------------------------------ */

type Order = {
  name: string;
  email: string;
  stock: string | null;
  rolls: number | null;
  format: string;
};

function ReactHookForm() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Order>({
    defaultValues: { name: '', email: '', stock: null, rolls: 1, format: '35' },
  });
  const [submitted, setSubmitted] = React.useState<Order>();

  return (
    <>
      <GridForm.Root noValidate onSubmit={handleSubmit(setSubmitted)}>
        <GridForm.Section legend="Customer">
          <GridForm.Row>
            <GridForm.Field
              name="name"
              label="Full name"
              span={2}
              error={errors.name?.message}
            >
              <GridForm.Input
                autoComplete="name"
                {...register('name', { required: 'Required' })}
              />
            </GridForm.Field>
            <GridForm.Field
              name="email"
              label="Email"
              span={2}
              error={errors.email?.message}
            >
              <GridForm.Input
                type="email"
                autoComplete="email"
                {...register('email', {
                  required: 'Required',
                  pattern: { value: /^\S+@\S+\.\S+$/, message: 'Needs an @' },
                })}
              />
            </GridForm.Field>
          </GridForm.Row>
        </GridForm.Section>
        <GridForm.Section legend="Rolls">
          <GridForm.Row>
            <GridForm.Field
              name="stock"
              label="Film stock"
              span={2}
              error={errors.stock?.message}
            >
              <Controller
                name="stock"
                control={control}
                rules={{ required: 'Pick a stock' }}
                render={({ field }) => (
                  <GridForm.Select
                    items={stocks}
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                  />
                )}
              />
            </GridForm.Field>
            <GridForm.Field name="rolls" label="Rolls" error={errors.rolls?.message}>
              <Controller
                name="rolls"
                control={control}
                rules={{
                  required: 'Required',
                  min: { value: 1, message: 'At least 1' },
                  max: { value: 40, message: '40 max' },
                }}
                render={({ field }) => (
                  <GridForm.Number
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                  />
                )}
              />
            </GridForm.Field>
          </GridForm.Row>
          <GridForm.Row>
            <GridForm.Field name="format" label="Format" span={3}>
              <Controller
                name="format"
                control={control}
                render={({ field }) => (
                  <GridForm.Choice
                    options={formats}
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                  />
                )}
              />
            </GridForm.Field>
          </GridForm.Row>
        </GridForm.Section>
        <GridForm.Actions>
          <GridForm.Button type="submit" variant="primary">
            Place order
          </GridForm.Button>
        </GridForm.Actions>
      </GridForm.Root>
      <Output label="Submitted values" value={submitted} />
    </>
  );
}

/* ------------------------------------------------------------------------ */

function ServerErrors() {
  const [errors, setErrors] = React.useState<Record<string, string>>();
  return (
    <>
      <div className="pg-toolbar">
        <button
          type="button"
          onClick={() =>
            setErrors({
              email: 'That email is already registered to another lab account',
              zip: "We don't ship there",
            })
          }
        >
          Simulate server response
        </button>
        <button type="button" onClick={() => setErrors(undefined)}>
          Clear
        </button>
      </div>
      <GridForm.Root errors={errors}>
        <GridForm.Row>
          <GridForm.Field name="email" label="Email" span={2}>
            <GridForm.Input type="email" defaultValue="ada@post.fr" />
          </GridForm.Field>
          <GridForm.Field name="zip" label="ZIP">
            <GridForm.Input inputMode="numeric" defaultValue="99999" />
          </GridForm.Field>
        </GridForm.Row>
      </GridForm.Root>
    </>
  );
}

/* ------------------------------------------------------------------------ */

function LongMessages() {
  return (
    <div className="pg-narrow">
      <GridForm.Root>
        <GridForm.Row>
          <GridForm.Field
            name="phone"
            label="Phone"
            error="Use a number the courier can text on the day of delivery"
          >
            <GridForm.Input type="tel" defaultValue="555" />
          </GridForm.Field>
          <GridForm.Field name="unit" label="Apt / unit" error="Too long">
            <GridForm.Input defaultValue="Penthouse B, rear entrance" />
          </GridForm.Field>
        </GridForm.Row>
      </GridForm.Root>
    </div>
  );
}

/* ------------------------------------------------------------------------ */

function FilledWhileInvalid() {
  return (
    <GridForm.Root mode="filled">
      <GridForm.Row>
        <GridForm.Field name="name" label="Full name" span={2}>
          <GridForm.Input defaultValue="Ada Lovelace" />
        </GridForm.Field>
        <GridForm.Field name="email" label="Email" span={2} error="Bounced">
          <GridForm.Input defaultValue="ada@post" />
        </GridForm.Field>
      </GridForm.Row>
    </GridForm.Root>
  );
}

/* ------------------------------------------------------------------------ */

function Playground() {
  return (
    <main className="pg">
      <h1>Playground</h1>
      <Scenario
        title="react-hook-form"
        notes="register() for text fields, Controller for Select, Number and Choice. Submit empty: each cell shows react-hook-form's message through the error prop."
      >
        <ReactHookForm />
      </Scenario>
      <Scenario
        title="Server errors"
        notes="<GridForm.Root errors={…}>. Simulate a response: both cells show their message. Editing a field clears just its error, as in Base UI."
      >
        <ServerErrors />
      </Scenario>
      <Scenario
        title="Long messages in narrow cells"
        notes="The error column takes up to 60% of the cell and wraps beyond that; the label keeps the rest."
      >
        <LongMessages />
      </Scenario>
      <Scenario
        title="Filled while invalid"
        notes="A completed form that still has an error."
      >
        <FilledWhileInvalid />
      </Scenario>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(<Playground />);
