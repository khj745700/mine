import type { Meta, StoryObj } from '@storybook/react';
import { Toast } from './Toast';
import { Palette } from '../../../themes/lightTheme';
import { Typography } from '../../atoms/Typography';

const meta = {
  title: 'UI/Molecules/Toast',
  component: Toast,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '1rem' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['!autodocs'],
  argTypes: {
    children: {
      description:
        'Toast 안에 표시할 텍스트입니다. Typography 로 원하는 텍스트도 가능합니다',
    },
    variant: {
      description: 'Toast 의 스타일입니다.',
    },
    color: {
      description: '적용할 컬러 팔레트입니다.',
    },
  },
} satisfies Meta<typeof Toast>;

export default meta;

type Story = StoryObj<typeof Toast>;

export const Primary: Story = {
  args: {
    children: '이건 토스트입니다.',
    variant: 'contained',
    color: 'primary',
  },
};

const colorList: Palette[] = ['primary', 'secondary', 'success', 'danger'];

export const Contained: Story = {
  args: {
    ...Primary.args,
    variant: 'contained',
  },
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
      {colorList.map((color) => (
        <Toast {...args} color={color}>
          <Typography size="sm" color="dark">
            이건 토스트입니다
          </Typography>
        </Toast>
      ))}
    </div>
  ),
};

export const Filled: Story = {
  args: {
    ...Primary.args,
    variant: 'filled',
  },
  parameters: {
    controls: false,
  },
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
      {colorList.map((color) => (
        <Toast {...args} color={color}>
          <Typography size="sm" color="light">
            이건 토스트입니다
          </Typography>
        </Toast>
      ))}
    </div>
  ),
};

export const Outlined: Story = {
  args: {
    ...Primary.args,
    variant: 'outlined',
  },
  parameters: {
    controls: false,
  },
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
      {colorList.map((color) => (
        <Toast {...args} color={color}>
          <Typography size="sm" color="dark">
            이건 토스트입니다
          </Typography>
        </Toast>
      ))}
    </div>
  ),
};
