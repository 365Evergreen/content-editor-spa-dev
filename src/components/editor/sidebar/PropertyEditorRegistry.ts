import type {PropertyEditorComponent} from "./PropertyEditorTypes";
import { ParagraphPropertyEditor } from "./editors/ParagraphPropertyEditor";
import {
  AccordionPropertyEditor,
  ButtonsPropertyEditor,
  ColumnsPropertyEditor,
  GridPropertyEditor,
  GroupPropertyEditor,
  RowPropertyEditor,
  StackPropertyEditor
} from "./editors/DesignPropertyEditors";

export const PropertyEditorRegistry: Record<string, PropertyEditorComponent> = {
  paragraph: ParagraphPropertyEditor,
  accordion: AccordionPropertyEditor,
  button: ButtonsPropertyEditor,
  columns: ColumnsPropertyEditor,
  grid: GridPropertyEditor,
  group: GroupPropertyEditor,
  row: RowPropertyEditor,
  stack: StackPropertyEditor
};
