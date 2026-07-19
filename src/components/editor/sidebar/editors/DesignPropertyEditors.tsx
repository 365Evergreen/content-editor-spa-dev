import React from "react";
import type { PropertyEditorProps } from "../PropertyEditorTypes";

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="space-y-2">
    <h4 className="font-semibold text-sm">{title}</h4>
    <div className="space-y-2">{children}</div>
  </div>
);

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <label className="block text-xs text-gray-500">
    {label}
    <div className="mt-1">{children}</div>
  </label>
);

export const AccordionPropertyEditor: React.FC<PropertyEditorProps> = ({ block, onUpdate }) => (
  <Section title="Accordion settings">
    <label className="flex items-center gap-2 text-xs text-gray-600">
      <input
        type="checkbox"
        checked={Boolean(block.openByDefault)}
        onChange={(event) => onUpdate({ openByDefault: event.target.checked })}
      />
      Open by default
    </label>
    <label className="flex items-center gap-2 text-xs text-gray-600">
      <input type="checkbox" checked={Boolean(block.autoClose)} onChange={(event) => onUpdate({ autoClose: event.target.checked })} />
      Auto-close
    </label>
    <label className="flex items-center gap-2 text-xs text-gray-600">
      <input type="checkbox" checked={block.showIcon !== false} onChange={(event) => onUpdate({ showIcon: event.target.checked })} />
      Show icon
    </label>
    <Field label="Icon position">
      <select
        className="w-full border rounded p-1 text-xs"
        value={block.iconPosition || "right"}
        onChange={(event) => onUpdate({ iconPosition: event.target.value })}
      >
        <option value="left">Left</option>
        <option value="right">Right</option>
      </select>
    </Field>
  </Section>
);

export const ButtonsPropertyEditor: React.FC<PropertyEditorProps> = ({ block, onUpdate }) => (
  <Section title="Buttons settings">
    <Field label="Alignment">
      <select className="w-full border rounded p-1 text-xs" value={block.alignment || "none"} onChange={(event) => onUpdate({ alignment: event.target.value })}>
        <option value="none">None</option>
        <option value="wide">Wide</option>
        <option value="full">Full</option>
      </select>
    </Field>
    <Field label="Justification">
      <select className="w-full border rounded p-1 text-xs" value={block.justification || "left"} onChange={(event) => onUpdate({ justification: event.target.value })}>
        <option value="left">Left</option>
        <option value="center">Center</option>
        <option value="right">Right</option>
        <option value="space-between">Space between</option>
      </select>
    </Field>
    <Field label="Vertical alignment">
      <select
        className="w-full border rounded p-1 text-xs"
        value={block.verticalAlignment || "top"}
        onChange={(event) => onUpdate({ verticalAlignment: event.target.value })}
      >
        <option value="top">Top</option>
        <option value="middle">Middle</option>
        <option value="bottom">Bottom</option>
        <option value="stretch">Stretch</option>
      </select>
    </Field>
    <Field label="Orientation">
      <select className="w-full border rounded p-1 text-xs" value={block.orientation || "horizontal"} onChange={(event) => onUpdate({ orientation: event.target.value })}>
        <option value="horizontal">Horizontal</option>
        <option value="vertical">Vertical</option>
      </select>
    </Field>
    <Field label="Gap">
      <input
        type="text"
        className="w-full border rounded p-1 text-xs"
        value={block.gap || "12px"}
        onChange={(event) => onUpdate({ gap: event.target.value })}
      />
    </Field>
  </Section>
);

export const ColumnsPropertyEditor: React.FC<PropertyEditorProps> = ({ block, onUpdate }) => (
  <Section title="Columns settings">
    <Field label="Alignment">
      <select className="w-full border rounded p-1 text-xs" value={block.alignment || "none"} onChange={(event) => onUpdate({ alignment: event.target.value })}>
        <option value="none">None</option>
        <option value="wide">Wide</option>
        <option value="full">Full</option>
      </select>
    </Field>
    <Field label="Vertical alignment">
      <select
        className="w-full border rounded p-1 text-xs"
        value={block.verticalAlignment || "top"}
        onChange={(event) => onUpdate({ verticalAlignment: event.target.value })}
      >
        <option value="top">Top</option>
        <option value="middle">Middle</option>
        <option value="bottom">Bottom</option>
        <option value="stretch">Stretch</option>
      </select>
    </Field>
    <label className="flex items-center gap-2 text-xs text-gray-600">
      <input type="checkbox" checked={block.stackOnMobile !== false} onChange={(event) => onUpdate({ stackOnMobile: event.target.checked })} />
      Stack on mobile
    </label>
  </Section>
);

export const GridPropertyEditor: React.FC<PropertyEditorProps> = ({ block, onUpdate }) => (
  <Section title="Grid settings">
    <Field label="Alignment">
      <select className="w-full border rounded p-1 text-xs" value={block.alignment || "none"} onChange={(event) => onUpdate({ alignment: event.target.value })}>
        <option value="none">None</option>
        <option value="wide">Wide</option>
        <option value="full">Full</option>
      </select>
    </Field>
    <Field label="Max columns">
      <input
        type="number"
        min={1}
        max={12}
        className="w-full border rounded p-1 text-xs"
        value={Number(block.maxColumns || 3)}
        onChange={(event) => onUpdate({ maxColumns: Number(event.target.value || 1) })}
      />
    </Field>
    <Field label="Min column width">
      <input
        type="text"
        className="w-full border rounded p-1 text-xs"
        value={block.minColumnWidth || "12rem"}
        onChange={(event) => onUpdate({ minColumnWidth: event.target.value })}
      />
    </Field>
  </Section>
);

export const GroupPropertyEditor: React.FC<PropertyEditorProps> = ({ block, onUpdate }) => (
  <Section title="Group settings">
    <Field label="Orientation">
      <select className="w-full border rounded p-1 text-xs" value={block.orientation || "vertical"} onChange={(event) => onUpdate({ orientation: event.target.value })}>
        <option value="vertical">Vertical</option>
        <option value="horizontal">Horizontal</option>
      </select>
    </Field>
    <Field label="Gap">
      <input type="text" className="w-full border rounded p-1 text-xs" value={block.gap || "12px"} onChange={(event) => onUpdate({ gap: event.target.value })} />
    </Field>
  </Section>
);

export const RowPropertyEditor: React.FC<PropertyEditorProps> = ({ block, onUpdate }) => (
  <Section title="Row settings">
    <Field label="Justification">
      <select className="w-full border rounded p-1 text-xs" value={block.justification || "left"} onChange={(event) => onUpdate({ justification: event.target.value })}>
        <option value="left">Left</option>
        <option value="center">Center</option>
        <option value="right">Right</option>
        <option value="space-between">Space between</option>
      </select>
    </Field>
    <label className="flex items-center gap-2 text-xs text-gray-600">
      <input type="checkbox" checked={block.wrap !== false} onChange={(event) => onUpdate({ wrap: event.target.checked })} />
      Wrap
    </label>
  </Section>
);

export const StackPropertyEditor: React.FC<PropertyEditorProps> = ({ block, onUpdate }) => (
  <Section title="Stack settings">
    <Field label="Vertical distribution">
      <select className="w-full border rounded p-1 text-xs" value={block.justification || "top"} onChange={(event) => onUpdate({ justification: event.target.value })}>
        <option value="top">Top</option>
        <option value="middle">Middle</option>
        <option value="bottom">Bottom</option>
        <option value="space-between">Space between</option>
      </select>
    </Field>
    <Field label="Horizontal alignment">
      <select
        className="w-full border rounded p-1 text-xs"
        value={block.horizontalAlignment || "left"}
        onChange={(event) => onUpdate({ horizontalAlignment: event.target.value })}
      >
        <option value="left">Left</option>
        <option value="center">Center</option>
        <option value="right">Right</option>
        <option value="stretch">Stretch</option>
      </select>
    </Field>
  </Section>
);
