export const theme = {
  colors: {
    primary: "#E8594F",
    primaryGradient: "linear-gradient(135deg, #E8594F, #E8956A)",

    successGradient: "linear-gradient(135deg, #34C759, #4CD964)",

    textPrimary: "#3d3129",
    textSecondary: "#a09488",

    border: "#e8e0da",
    background: "#ffffff",
    errorBg: "#FFF0EE",
    errorBorder: "#FDDDD9",
  },

  font: {
    brand: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    heading: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    body: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  },

  shadow: {
    card: "0 2px 12px rgba(120,80,60,0.07)",
    button: "0 4px 18px rgba(232, 89, 79, 0.25)",
  },

  components: {
    input: {
      base: {
        background: "transparent",
        border: "none",
        borderBottom: "1px solid #e8e0da",
        outline: "none",
        padding: "10px 0",
        fontSize: "14px",
      },
    },

    label: {
      fontSize: "13.5px",
      fontWeight: 500,
      minWidth: "180px",
    },

    card: {
      borderRadius: "18px",
      padding: "36px 40px 28px",
    },
  },
};