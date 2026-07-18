import type {PropertyEditorComponent} from "./PropertyEditorTypes";
import { ParagraphPropertyEditor } from "./editors/ParagraphPropertyEditor";

export const PropertyEditorRegistry: Record<string, PropertyEditorComponent> = {
  paragraph: ParagraphPropertyEditor,
};
