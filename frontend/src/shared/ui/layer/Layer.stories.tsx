import type { Meta, StoryObj } from "@storybook/react";
import { Footer, Header, Main, Slider } from "./Layer";

const meta: Meta = {
  title: "UI/Layer",
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div>
      <Header>Header</Header>
      <Main>Main</Main>
      <Slider>Slider</Slider>
      <Footer>Footer</Footer>
    </div>
  ),
};
