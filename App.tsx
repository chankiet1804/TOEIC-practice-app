import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeStackParamList } from "./src/screens/types";
import { HomeScreen } from "./src/screens";
import { SpeakingScreen } from "./src/screens/Speaking";
import { WritingScreen } from "./src/screens/Writing";
import { VocabularyScreen } from "./src/screens/Vocabulary";
import { NoteScreen } from "./src/screens/Note";
import { SettingsScreen } from "./src/screens/Settings";
import { Image } from "react-native";

const Stack = createNativeStackNavigator<HomeStackParamList>();
const Tab = createBottomTabNavigator();

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
      <Stack.Screen name="Speaking" component={SpeakingScreen} />
      <Stack.Screen name="Writing" component={WritingScreen} />
      <Stack.Screen name="Vocabulary" component={VocabularyScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconSource;
            if (route.name === "Main") {
              iconSource = require("./assets/main-icon.png");
            } else if (route.name === "Note") {
              iconSource = require("./assets/note-icon.png");
            } else if (route.name === "Settings") {
              iconSource = require("./assets/settings-icon.png");
            }
            return (
              <Image
                source={iconSource}
                style={{
                  width: size,
                  height: size,
                  tintColor: color,
                }}
              />
            );
          },
          tabBarActiveTintColor: "#60A5FA",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen
          name="Main"
          component={MainStack}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Note"
          component={NoteScreen}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ headerShown: false }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
