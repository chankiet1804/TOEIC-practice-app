import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeStackParamList } from "./src/screens/types";
import { HomeScreen, ResultScreen, TestScreen,VocabularyScreen,SpeakingListTestScreen } from "./src/screens";

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="SpeakingListTest"component={SpeakingListTestScreen}/>
        <Stack.Screen name="Result" component={ResultScreen} />
        <Stack.Screen name="Vocabulary" component={VocabularyScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
