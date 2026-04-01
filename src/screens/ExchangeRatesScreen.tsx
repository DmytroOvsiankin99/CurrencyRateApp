import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useCnbDailyRates } from "../hooks/useCnbDailyRates";
import { Screen } from "../components/Screen";
import { Card } from "../components/Card";
import { Container } from "../components/Container";
import styled from "styled-components/native";

const Title = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSize.xl}px;
  font-weight: 900;
`;

const ExchangeRatesScreen = () => {
  const { data, isLoading, isFetching, error, refetch } = useCnbDailyRates();
  console.log(data);

  if (isLoading) {
    return (<ActivityIndicator />)
  }

  return (<Screen>
    <Container>
      <Card>
          <Title>ČNB Exchange Rates</Title>

      </Card>
    </Container>
  </Screen>);
}

export default ExchangeRatesScreen;