import type { Meta, StoryObj } from "@storybook/react";
import { DatePicker } from "./DatePicker";

const meta: Meta<typeof DatePicker> = {
  title: "UI/Form/DatePicker",
  component: DatePicker,
  args: {
    label: "Pick a date",
  },
};

export default meta;

type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {};
