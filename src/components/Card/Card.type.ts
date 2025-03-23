export interface CardProps {
  value?: string | null;
  flipped?: boolean;
  selected?: boolean;
  hoverable?: boolean;
  onClick?: () => void;
}
