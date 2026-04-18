import { theme } from "../../theme/theme";

export default function Input(props) {
  return (
    <input
      {...props}
      className="w-full border-b outline-none py-2 text-sm"
      style={{
        borderColor: theme.colors.border,
        color: theme.colors.textPrimary,
        fontFamily: theme.font.body,
      }}
    />
  );
}