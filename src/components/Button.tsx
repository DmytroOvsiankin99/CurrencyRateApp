import styled from "styled-components/native";

export const Button = styled.Pressable<{ disabled?: boolean }>`
  background-color: ${({ theme, disabled }) =>
    disabled ? theme.colors.surface2 : theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  opacity: ${({ disabled }) => (disabled ? 0.7 : 1)};
`;

export const ButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 700;
  text-align: center;
`;