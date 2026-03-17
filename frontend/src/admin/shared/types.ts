export type TableColumn = {
  key: string;
  label: string;
};

export type FormField = {
  name: string;
  label: string;
  type?: "text" | "number" | "textarea" | "select" | "file";
  options?: string[];
};

export type RowData = Record<string, any>;