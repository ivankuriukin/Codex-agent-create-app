import type { Meta, StoryObj } from "@storybook/react";
import { Menu } from "./Menu";

const meta: Meta<typeof Menu> = {
  title: "UI/Menu",
  component: Menu,
};

export default meta;

type Story = StoryObj<typeof Menu>;

export const Default: Story = {
  args: {
    triggerLabel: "Open menu",
    items: [
      { id: "profile", label: "Profile" },
      { id: "settings", label: "Settings" },
      { id: "logout", label: "Logout" },
    ],
  },
};
