"use client";

import type { OrderAddress } from "@/types/order";

export type CheckoutContact = OrderAddress & { email: string };

type Props = {
  values: CheckoutContact;
  onChange: (patch: Partial<CheckoutContact>) => void;
  saveAddress: boolean;
  onSaveAddressChange: (v: boolean) => void;
  showSaveOption: boolean;
  usingSaved: boolean;
};

export function CheckoutAddressFields({
  values,
  onChange,
  saveAddress,
  onSaveAddressChange,
  showSaveOption,
  usingSaved,
}: Props) {
  return (
    <>
      <section>
        <h2 className="text-[11px] uppercase tracking-[0.16em] text-muted mb-4">Contact</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Field
            label="Email"
            name="email"
            type="email"
            required
            value={values.email}
            onChange={(v) => onChange({ email: v })}
          />
          <Field
            label="Mobile"
            name="phone"
            type="tel"
            required
            placeholder="+91 98765 43210"
            value={values.phone}
            onChange={(v) => onChange({ phone: v })}
          />
        </div>
      </section>

      <section>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <h2 className="text-[11px] uppercase tracking-[0.16em] text-muted">Delivery address</h2>
          {usingSaved && (
            <span className="text-[10px] uppercase tracking-widest text-accent border border-accent/40 px-2 py-0.5">
              Saved address
            </span>
          )}
        </div>
        <div className="space-y-4">
          <Field
            label="Full name"
            name="fullName"
            required
            value={values.fullName}
            onChange={(v) => onChange({ fullName: v })}
          />
          <Field
            label="Address line"
            name="address"
            required
            value={values.address}
            onChange={(v) => onChange({ address: v })}
          />
          <div className="grid md:grid-cols-3 gap-4">
            <Field label="City" name="city" required value={values.city} onChange={(v) => onChange({ city: v })} />
            <Field label="State" name="state" required value={values.state} onChange={(v) => onChange({ state: v })} />
            <Field
              label="PIN code"
              name="pin"
              required
              pattern="[1-9][0-9]{5}"
              maxLength={6}
              value={values.pin}
              onChange={(v) => onChange({ pin: v })}
            />
          </div>
        </div>
        {showSaveOption && (
          <label className="flex items-center gap-2 mt-4 text-sm text-muted cursor-pointer">
            <input
              type="checkbox"
              checked={saveAddress}
              onChange={(e) => onSaveAddressChange(e.target.checked)}
              className="accent-accent"
            />
            Save this address for next checkout
          </label>
        )}
      </section>
    </>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  value,
  onChange,
  placeholder,
  pattern,
  maxLength,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
  pattern?: string;
  maxLength?: number;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-xs text-muted mb-1.5">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        pattern={pattern}
        maxLength={maxLength}
        className="w-full h-11 border border-line bg-paper px-3 text-sm outline-none focus:ring-2 focus:ring-accent/30"
      />
    </div>
  );
}
