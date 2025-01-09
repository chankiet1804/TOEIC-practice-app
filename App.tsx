import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeStackParamList } from "./src/screens/types";
import { HomeScreen} from "./src/screens";
import { SpeakingScreen } from "./src/screens/Speaking";
import { WritingScreen } from "./src/screens/Writing";
// import { VocabularyScreen } from "./src/screens/Vocabulary";
import { NoteScreen } from "./src/screens/Note";
import { SettingsScreen } from "./src/screens/Settings";
import { Image, TouchableOpacity, ActivityIndicator, Text } from "react-native";
import { InforTestScreen } from "./src/screens/Speaking/SpeakingSubscreen/InforTestScreen";
import { TestScreen } from "./src/screens/Speaking/SpeakingSubscreen/TestScreen";
import { DatabaseProvider } from "./src/database/DatabaseContext";
import { DatabaseStateHandler } from "./src/database/DatabaseStateHandler";
import { MyLibraryScreen } from './src/screens/Vocabulary/VocabularySubscreen/MyLibraryScreen/MyLibraryScreen';
import { TopicsScreen } from "./src/screens/Vocabulary/TopicsScreen/TopicsScreen";
import { Ionicons } from '@expo/vector-icons';
import { VocabularyScreen } from './src/screens/Vocabulary/VocabularyScreen'; // Nhập khẩu hàm
import { EditTopicScreen } from './src/screens/Vocabulary/EditTopicScreen/EditTopicScreen'; // Nhập khẩu hàm

const Stack = createNativeStackNavigator<HomeStackParamList>();
const Tab = createBottomTabNavigator();

function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        animation: "slide_from_right",
        headerTintColor: '#fff',
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
      <Stack.Screen name="Writing" component={WritingScreen} />
      <Stack.Screen 
        name="Vocabulary" 
        component={VocabularyScreen}
        options={{ 
          headerTitle: 'Thư viện của tôi',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: "#4A90E2"
          },
          headerTitleStyle: {
            color: "#fff",
            fontSize: 18,
            fontWeight: "bold"
          },
          headerTintColor: '#fff'
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
          headerTitle: "Danh sách các bài thi",
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
        name="MyLibraryScreen" 
        component={MyLibraryScreen}
        options={({ navigation, route }) => ({
          headerTitle: "Thêm chủ đề mới",
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: "#4A90E2"
          },
          headerTitleStyle: {
            color: "#fff",
            fontSize: 18,
            fontWeight: "bold"
          },
          headerTintColor: '#fff',
        })}
      />

      <Stack.Screen 
        name="TopicsScreen" 
        component={TopicsScreen} 
        options={{
          headerTitle: "Từ Vựng",
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: "#4A90E2"
          },
          headerTitleStyle: {
            color: "#fff",
            fontSize: 18,
            fontWeight: "bold"
          },
          headerTintColor: '#fff'
        }}
      />
      <Stack.Screen 
        name="EditTopicScreen" 
        component={EditTopicScreen}
        options={{
          title: 'Chỉnh sửa chủ đề',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: "#4A90E2"
          },
          headerTitleStyle: {
            color: "#fff",
            fontSize: 18,
            fontWeight: "bold"
          },
          headerTintColor: '#fff'
        }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <DatabaseProvider>
      <DatabaseStateHandler>
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
      </DatabaseStateHandler>
    </DatabaseProvider>
  );
}
