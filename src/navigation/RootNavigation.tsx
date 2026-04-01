import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ExchangeRatesScreen from "../screens/ExchangeRatesScreen";
import { RootStackParamList } from "../types/navigation";
 
const Tab = createBottomTabNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ 
        headerStyle: { backgroundColor: "#0B1220" },
        headerTintColor: "#EAF0FF",
        tabBarStyle: { 
          backgroundColor: "#0B1220", 
          borderTopColor: "rgba(255,255,255,0.10)",
        },
        tabBarActiveTintColor: "#7AA7FF",
        tabBarInactiveTintColor: "#AFC0E8",
        tabBarIcon: () => null, 
        tabBarLabelStyle: {
          fontSize: 14,
        },
      }}
    >            
      <Tab.Screen name={'ExchangeRatesScreen'} component={ExchangeRatesScreen} options={{ title: "Exchange Rates Screen" }} />
    </Tab.Navigator>
  );
}
