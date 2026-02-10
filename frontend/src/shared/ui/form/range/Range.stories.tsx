import type { Meta, StoryObj } from "@storybook/react";
import { Range } from "./Range";

const meta: Meta<typeof Range> = {
  title: "UI/Form/Range",
  component: Range,
  args: {
    label: "Price",
    minValue: 0,
    maxValue: 100,
    defaultValue: [20, 80],
  },
};

export default meta;

type Story = StoryObj<typeof Range>;

export const Default: Story = {};
