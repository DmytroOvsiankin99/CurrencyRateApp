import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { View } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from "styled-components/native";
import { RootNavigator } from "./navigation/RootNavigation";
import { theme } from "./styles/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // relates to ČNB documentation - their update rates one time per day 
      staleTime: 12 * 60 * 60 * 1000,
      retry: 2,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false
    }
  }
});

export function App() {
  return (
    <View style={{ flex: 1 }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1 }} edges={['top']}>
            <ThemeProvider theme={theme}>
              <QueryClientProvider client={queryClient}>
                <NavigationContainer>
                  <RootNavigator />
                </NavigationContainer>
              </QueryClientProvider>
            </ThemeProvider>
          </SafeAreaView>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </View>
  );
}
