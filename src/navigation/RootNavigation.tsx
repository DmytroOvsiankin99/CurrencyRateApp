import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ExchangeRatesScreen from "../screens/ExchangeRatesScreen";
import { RootStackParamList } from "../types/navigation";
import { theme } from "../styles/theme";
import CurrencyConverterScreen from "../screens/CurrencyConverterScreen";
import { SCREENS } from "../constants/navigation";
 
const Tab = createBottomTabNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ 
        headerShown: false,
        tabBarStyle: { 
          backgroundColor: theme.colors.bg, 
          borderTopColor: "rgba(255,255,255,0.10)",
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarIcon: () => null, 
        tabBarLabelStyle: {
          fontSize: 14,
        },
      }}
    >            
      <Tab.Screen name={SCREENS.ExchangeRatesScreen} component={ExchangeRatesScreen} options={{ title: "Exchange Rate" }} />
      <Tab.Screen name={SCREENS.CurrencyConverterScreen} component={CurrencyConverterScreen} options={{ title: "Converter" }} />
    </Tab.Navigator>
  );
}
