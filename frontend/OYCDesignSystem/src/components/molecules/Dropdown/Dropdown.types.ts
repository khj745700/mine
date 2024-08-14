import { ReactNode } from 'react';
import { Size } from '../../../themes/themeBase';
import { Palette } from '../../../themes/lightTheme';

export type DropdownVariant = 'contained' | 'outlined';

export interface DropdownProps
  extends Omit<React.ComponentProps<'select'>, 'size' | 'onChange'> {
  children: ReactNode;
  size?: Size;
  variant?: DropdownVariant;
  color?: Palette;
  name?: string;
}
