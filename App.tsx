import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeStackParamList } from "./src/screens/types";
import { HomeScreen} from "./src/screens";
import { SpeakingScreen } from "./src/screens/Speaking";
import { WritingScreen } from "./src/screens/Writing";
import { VocabularyScreen } from "./src/screens/Vocabulary";
import { NoteScreen } from "./src/screens/Note";
import { SettingsScreen } from "./src/screens/Settings";
import { Image } from "react-native";
import { InforTestScreen } from "./src/screens/Speaking/SpeakingSubscreen/InforTestScreen";
import { InforTestScreenWR } from "./src/screens/Writing/WritingSubscreen/InforTestScreen";

import { TestScreen } from "./src/screens/Speaking/SpeakingSubscreen/TestScreen";
import { DatabaseProvider } from "./src/database/DatabaseContext";
import { DatabaseStateHandler } from "./src/database/DatabaseStateHandler";
import { TestScreenWR } from "./src/screens/Writing/WritingSubscreen/TestScreen";

import 'expo-dev-client';

const Stack = createNativeStackNavigator<HomeStackParamList>();

function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="Speaking" 
        component={SpeakingScreen}
        options={{
          headerTitle: "Các phần trong Speaking",
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#5799DB',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen 
        name="InforTestScreen" 
        component={InforTestScreen}
        options={{
          headerTitle: "Thông tin bài thi",
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#5799DB',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen name="TestScreen" component={TestScreen}
        options={{
          headerTitle: "Trang bài thi",
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#5799DB',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen name="Writing" component={WritingScreen}
      options={{
        headerTitle: "Các phần trong Writing",
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#5799DB',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
      />
      <Stack.Screen 
        name="InforTestScreenWR" 
        component={InforTestScreenWR}
        options={{
          headerTitle: "Thông tin bài thi",
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#5799DB',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen name="TestScreenWR" component={TestScreenWR}
        options={{
          headerTitle: "Trang bài thi",
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#5799DB',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      
      <Stack.Screen name="Vocabulary" component={VocabularyScreen} />
      
      <Stack.Screen name="NoteScreen" component={NoteScreen} />

      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />

      
      
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <DatabaseProvider>
      <DatabaseStateHandler>
        <NavigationContainer>
          <MainStack />
        </NavigationContainer>
      </DatabaseStateHandler>
    </DatabaseProvider>
  );
}
