import type { Meta, StoryObj } from "@storybook/react";
import { ProgressBar } from "./ProgressBar";

const meta: Meta<typeof ProgressBar> = {
  title: "UI/ProgressBar",
  component: ProgressBar,
  args: {
    value: 40,
    minValue: 0,
    maxValue: 100,
    label: "Progress",
  },
};

export default meta;

type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = {};
