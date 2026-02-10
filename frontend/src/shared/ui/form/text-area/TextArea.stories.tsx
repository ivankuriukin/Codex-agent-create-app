import type { Meta, StoryObj } from "@storybook/react";
import { TextArea } from "./TextArea";

const meta: Meta<typeof TextArea> = {
  title: "UI/Form/TextArea",
  component: TextArea,
  args: {
    label: "About",
    placeholder: "Type here...",
  },
};

export default meta;

type Story = StoryObj<typeof TextArea>;

export const Default: Story = {};
