import React, { useEffect, useMemo, useState } from "react";
import {
  AccessibilityInfo,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  FlatList,
  View
} from "react-native";
import styled from "styled-components/native";
import { Input, Label } from "./Input";

export type CurrencyOption = {
  code: string;          
  currency: string;    
  country: string;  
};

type Props = {
  visible: boolean;
  title?: string;
  options: CurrencyOption[];
  selectedCode: string | null;
  onClose: () => void;
  onSelect: (code: string) => void;
};

const Overlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.55);
  justify-content: flex-end;
`;

const Sheet = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  border-top-left-radius: ${({ theme }) => theme.radius.lg}px;
  border-top-right-radius: ${({ theme }) => theme.radius.lg}px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.md}px;
  max-height: 80%;
`;

const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const Title = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSize.lg}px;
  font-weight: 900;
`;

const CloseText = styled.Text`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 800;
`;

const SearchWrap = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const Row = styled.Pressable`
  padding: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  background-color: ${({ theme }) => theme.colors.surface2};
  border: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const RowTop = styled.View`
  flex-direction: row;
  align-items: baseline;
  justify-content: space-between;
`;

const Code = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSize.lg}px;
  font-weight: 900;
`;

const Meta = styled.Text`
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Sub = styled.Text`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const SelectedBadge = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 900;
`;

const Empty = styled.Text`
  color: ${({ theme }) => theme.colors.textMuted};
  padding: ${({ theme }) => theme.spacing.md}px;
`;

function normalizeForSearch(s: string): string {
  return s.trim().toLowerCase();
}

export function CurrencySelectModal({
  visible,
  title = "Select Currency",
  options,
  selectedCode,
  onClose,
  onSelect
}: Props) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!visible) setQuery("");
  }, [visible]);

  const filtered = useMemo(() => {
    const q = normalizeForSearch(query);
    if (!q) return options;

    return options.filter((o) => {
      const hay = `${o.code} ${o.currency} ${o.country}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query, options]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Overlay>
        <Pressable
          style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close currency selection"
          accessibilityHint="Closes the modal window for selecting a currency"
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <Sheet
            accessible
            accessibilityViewIsModal
            importantForAccessibility="yes"
          >
            <HeaderRow>
              <Title accessibilityRole="header">{title}</Title>
              <Pressable
                onPress={onClose}
                accessibilityRole="button"
                accessibilityLabel="Close"
                accessibilityHint="Closes the modal window"
                hitSlop={12}
              >
                <CloseText>Close</CloseText>
              </Pressable>
            </HeaderRow>

            <SearchWrap>
              <Label>Search</Label>
              <Input
                value={query}
                onChangeText={setQuery}
                placeholder="Code / name / country (e.g. usd)"
                placeholderTextColor="rgba(234,240,255,0.35)"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
              />
            </SearchWrap>

            <FlatList
              data={filtered}
              keyExtractor={(item) => item.code}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => {
                const isSelected = item.code === selectedCode;

                return (
                  <Row
                    onPress={() => {
                      onSelect(item.code);

                      AccessibilityInfo.announceForAccessibility?.(
                        `Selected ${item.code}`
                      );

                      onClose();
                    }}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    accessibilityLabel={`${item.code}, ${item.currency}, ${item.country}`}
                    accessibilityHint="Press to select this currency"
                  >
                    <RowTop>
                      <Code>{item.code}</Code>
                      <Meta>{isSelected ? <SelectedBadge>Selected ✓</SelectedBadge> : null}</Meta>
                    </RowTop>
                    <Sub>
                      {item.currency} • {item.country}
                    </Sub>
                  </Row>
                );
              }}
              ListEmptyComponent={
                <View>
                  <Empty>Nothing found for “{query}”.</Empty>
                </View>
              }
            />
          </Sheet>
        </KeyboardAvoidingView>
      </Overlay>
    </Modal>
  );
}
