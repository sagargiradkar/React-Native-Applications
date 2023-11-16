const commonColor = {
  colors: {
    primary: "#292865",
    secondary: "#695F9B",
    shadowColor: "#130B4D",
  },
};

const light = {
  colors: {
    themeColor: "#FFFFFF",
    text: "#130B4D",
    ...commonColor.colors,
  },
};

const dark = {
  colors: {
    themeColor: "#130B4D",
    text: "#FFFFFF",
    ...commonColor.colors,
  },
};

export default { light, dark };
