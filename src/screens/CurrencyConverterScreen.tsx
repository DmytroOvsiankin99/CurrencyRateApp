import React, { useEffect, useMemo, useState } from "react";
import {
  AccessibilityInfo,
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from "react-native";
import styled from "styled-components/native";

import { Screen } from "../components/Screen";
import { Card } from "../components/Card";
import { Button, ButtonText } from "../components/Button";
import { Input, Label } from "../components/Input";

import { CurrencySelectModal, CurrencyOption } from "../components/CurrencySelectModal";
import { convertFromCzk, getCzkPerUnit } from "../api/cnb";
import { useCnbDailyRates } from "../hooks/useCnbDailyRates";

const Container = styled.View`
  padding: ${({ theme }) => theme.spacing.md}px;
  flex: 1;
  gap: 12;
`;


const Muted = styled.Text`
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

const InlineError = styled.Text`
  color: ${({ theme }) => theme.colors.danger};
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

const Title = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSize.xl}px;
  font-weight: 900;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const SelectButton = styled.Pressable`
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.surface2};
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: ${({ theme }) => theme.spacing.md}px;
`;

const SelectButtonMain = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSize.md}px;
  font-weight: 800;
`;

const SelectButtonSub = styled.Text`
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  font-size: ${({ theme }) => theme.fontSize.sm}px;
`;

const Result = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSize.xl}px;
  font-weight: 900;
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

function parseUserNumber(input: string): number | null {
  const cleaned = input.trim().replace(/\s+/g, "").replace(",", ".");

  if (!cleaned) return null;

  const dotCount = (cleaned.match(/\./g) ?? []).length;
  if (dotCount > 1) return null;

  const n = Number(cleaned);
  if (!Number.isFinite(n)) return null;

  return n;
}

function formatNumber(
  n: number,
  opts: { minFraction?: number; maxFraction: number }
): string {
  const { maxFraction } = opts;
  return n.toFixed(Math.min(maxFraction, 6));
}

const CurrencyConverterScreen = () => {
  const { data, isLoading, error, refetch, isFetching } = useCnbDailyRates();

  const rows = data?.rows ?? [];

  const currencyOptions: CurrencyOption[] = useMemo(
    () =>
      rows.map((r) => ({
        code: r.code,
        currency: r.currency,
        country: r.country
      })),
    [rows]
  );

  const [amountText, setAmountText] = useState("");
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (rows.length === 0) return;

    const preferred = ["EUR", "USD"];
    const firstExisting =
      preferred.find((c) => rows.some((r) => r.code === c)) ?? rows[0].code;

    if (!selectedCode) {
      setSelectedCode(firstExisting);
      return;
    }

    if (!rows.some((r) => r.code === selectedCode)) {
      setSelectedCode(firstExisting);
    }
  }, [rows, selectedCode]);

  const selectedRow = useMemo(() => {
    if (!selectedCode) return null;
    return rows.find((r) => r.code === selectedCode) ?? null;
  }, [rows, selectedCode]);

  const amountNumber = useMemo(() => parseUserNumber(amountText), [amountText]);

  const validationError = useMemo(() => {
    if (amountText.trim().length === 0) return null;

    if (amountNumber === null) {
      return "Enter a valid number (comma or period allowed).";
    }

    if (amountNumber < 0) {
      return "Amount cannot be negative.";
    }

    return null;
  }, [amountText, amountNumber]);

  const computed = useMemo(() => {
    if (!selectedRow || validationError || amountNumber === null) return null;
    if (!Number.isFinite(amountNumber) || amountNumber < 0) return null;

    const foreign = convertFromCzk(amountNumber, selectedRow);
    const czkPerUnit = getCzkPerUnit(selectedRow);

    return { czk: amountNumber, foreign, czkPerUnit, code: selectedRow.code };
  }, [selectedRow, amountNumber, validationError]);

  useEffect(() => {
    if (!computed) return;

    AccessibilityInfo.announceForAccessibility?.(
      `Result: ${formatNumber(computed.foreign, {
        minFraction: 2,
        maxFraction: 2
      })} ${computed.code}`
    );
  }, [computed]);

  function openCurrencyModal() {
    Keyboard.dismiss();
    setModalVisible(true);
  }

  return (
    <Screen>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          <Container>
            <Card>
              <Title>Converter</Title>
              <Muted>
                Rates are taken from daily.txt ČNB. Publication date: {data?.dateText || "—"}
              </Muted>
              {data?.sequenceInYear ? <Muted>Issue in year: #{data.sequenceInYear}</Muted> : null}
            </Card>

            {isLoading ? (
              <Card>
                <Row>
                  <Muted>Loading rates…</Muted>
                  <ActivityIndicator />
                </Row>
              </Card>
            ) : error ? (
              <Card>
                <Title style={{ fontSize: 18 }}>Error</Title>
                <Muted>Failed to fetch rates. Please try again.</Muted>
                <Muted>{String(error)}</Muted>

                <Button onPress={() => refetch()}>
                  <ButtonText>Try Again</ButtonText>
                </Button>
              </Card>
            ) : rows.length === 0 ? (
              <Card>
                <Muted>The list of currencies is empty. Please try updating the data.</Muted>
                <Button onPress={() => refetch()}>
                  <ButtonText>Update</ButtonText>
                </Button>
              </Card>
            ) : (
              <>
                <Card>
                  <Label>Amount (CZK)</Label>
                  <Input
                    value={amountText}
                    onChangeText={setAmountText}
                    placeholder="E.g., 1000,50"
                    placeholderTextColor="rgba(234,240,255,0.35)"
                    keyboardType="decimal-pad"
                    returnKeyType="done"
                    onSubmitEditing={Keyboard.dismiss}
                    accessibilityLabel="Amount in Czech Crowns"
                    accessibilityHint="Enter amount in CZK. Comma or period allowed."
                  />
                  {validationError ? <InlineError>{validationError}</InlineError> : null}
                </Card>

                <Card>
                  <Label>Target Currency</Label>

                  <SelectButton
                    onPress={openCurrencyModal}
                    accessibilityRole="button"
                    accessibilityLabel="Select Currency"
                    accessibilityHint="Opens the list of currencies for selection"
                  >
                    <SelectButtonMain>
                      {selectedRow
                        ? `${selectedRow.code} — ${selectedRow.currency}`
                        : "Select Currency"}
                    </SelectButtonMain>

                    <SelectButtonSub>
                      {selectedRow
                        ? `${selectedRow.country} • rate: ${formatNumber(
                            getCzkPerUnit(selectedRow),
                            { minFraction: 3, maxFraction: 3 }
                          )} CZK per 1`
                        : "—"}
                    </SelectButtonSub>
                  </SelectButton>

                  {isFetching ? <Muted>Updating data…</Muted> : null}
                </Card>

                <Card>
                  <Label>Result</Label>

                  {computed ? (
                    <>
                      <Result>
                        {formatNumber(computed.foreign, { minFraction: 2, maxFraction: 2 })}{" "}
                        {computed.code}
                      </Result>
                      <Muted>
                        {formatNumber(computed.czk, { minFraction: 2, maxFraction: 2 })} CZK →{" "}
                        {computed.code}
                      </Muted>
                      <Muted>
                        Rate: {formatNumber(computed.czkPerUnit, { minFraction: 3, maxFraction: 3 })}{" "}
                        CZK / 1 {computed.code}
                      </Muted>
                    </>
                  ) : (
                    <Muted>Enter a valid amount and select a currency.</Muted>
                  )}
                </Card>
              </>
            )}
          </Container>
        </ScrollView>

        <CurrencySelectModal
          visible={isModalVisible}
          options={currencyOptions}
          selectedCode={selectedCode}
          onClose={() => setModalVisible(false)}
          onSelect={(code) => {
            setSelectedCode(code);
          }}
        />
      </KeyboardAvoidingView>
    </Screen>
  );
};

export default CurrencyConverterScreen;