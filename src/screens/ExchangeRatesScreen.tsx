import React, { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { useCnbDailyRates } from "../hooks/useCnbDailyRates";
import { Screen } from "../components/Screen";
import { Card } from "../components/Card";
import { Container } from "../components/Container";
import styled from "styled-components/native";
import { Input, Label } from "../components/Input";
import { RateRow } from "../components/RateRow";

const Title = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSize.xl}px;
  font-weight: 900;
`;

const Muted = styled.Text`
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: ${({ theme }) => theme.spacing.xs}px;
`;

const Spacer = styled.View`
  height: ${({ theme }) => theme.spacing.md}px;
`;


const ExchangeRatesScreen = () => {
  const { data, isLoading, isFetching, error, refetch } = useCnbDailyRates();
  console.log(data);

   const [query, setQuery] = useState("");

  const rows = data?.rows ?? [];
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => {
      return (
        r.code.toLowerCase().includes(q) ||
        r.country.toLowerCase().includes(q) ||
        r.currency.toLowerCase().includes(q)
      );
    });
  }, [query, rows]);

  return (
    <Screen>
      <Container>
        <Card>
          <Title>ČNB Exchange Rates</Title>
          <Muted>
            Publication Date: {data?.dateText || "—"}
            {data?.sequenceInYear ? `  •  #${data.sequenceInYear}` : ""}
          </Muted>
        </Card>

        <Spacer />

        <Label>Search (code / country / currency name)</Label>
        <Input
          placeholder="e.g., USD or euro"
          placeholderTextColor="rgba(234,240,255,0.35)"
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Spacer />

        {isLoading ? (
          <ActivityIndicator />
        ) : error ? (
          <Card>
            <Title style={{ fontSize: 18 }}>Error Loading Data</Title>
            <Muted>Failed to fetch data from ČNB. Please try again.</Muted>
            <Muted>{String(error)}</Muted>
          </Card>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => <RateRow row={item} />}
            ListEmptyComponent={
              <Card>
                <Muted>No results found for “{query}”.</Muted>
              </Card>
            }
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </Container>
    </Screen>
  );
}

export default ExchangeRatesScreen;