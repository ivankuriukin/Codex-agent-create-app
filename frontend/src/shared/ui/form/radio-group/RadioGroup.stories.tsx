import type { Meta, StoryObj } from "@storybook/react";
import { Radio, RadioGroup } from "./RadioGroup";

const meta: Meta<typeof RadioGroup> = {
  title: "UI/Form/RadioGroup",
  component: RadioGroup,
  args: {
    label: "Role",
  },
};

export default meta;

type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="designer">Designer</Radio>
      <Radio value="engineer">Engineer</Radio>
    </RadioGroup>
  ),
};
