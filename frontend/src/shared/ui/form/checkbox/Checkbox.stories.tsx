import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "./Checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "UI/Form/Checkbox",
  component: Checkbox,
  args: {
    children: "Accept terms",
  },
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {};
