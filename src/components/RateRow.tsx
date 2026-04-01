import React from "react";
import styled from "styled-components/native";
import { CnbRateRow, getCzkPerUnit } from "../api/cnb";

const Row = styled.View`
  padding: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const Top = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: baseline;
`;

const Code = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSize.lg}px;
  font-weight: 800;
`;

const Rate = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSize.md}px;
  font-weight: 700;
`;

const Sub = styled.Text`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSize.sm}px;
`;

export function RateRow({ row }: { row: CnbRateRow }) {
  const czkPerUnit = getCzkPerUnit(row);

  return (
    <Row>
      <Top>
        <Code>{row.code}</Code>
        <Rate>{czkPerUnit.toFixed(3)} CZK / 1</Rate>
      </Top>
      <Sub>
        {row.country} — {row.currency} • {row.amount} {row.code} = {row.rate.toFixed(3)} CZK
      </Sub>
    </Row>
  );
}
