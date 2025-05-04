
export interface TextBlock {
  id: string;
  title: string;
  content: string;
}

export interface FormatAction {
  icon: JSX.Element;
  tooltip: string;
  action: () => void;
}
