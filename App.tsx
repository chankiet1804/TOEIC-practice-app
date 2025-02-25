import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeStackParamList } from "./src/screens/types";
import { HomeScreen} from "./src/screens";
import { SpeakingScreen } from "./src/screens/Speaking";
import { WritingScreen } from "./src/screens/Writing";
import { NoteScreen } from "./src/screens/Note";
import { SettingsScreen } from "./src/screens/Settings";
import { Image,TouchableOpacity, ActivityIndicator, Text } from "react-native"; // Add these imports
import { InforTestScreen } from "./src/screens/Speaking/SpeakingSubscreen/InforTestScreen";
import { InforTestScreenWR } from "./src/screens/Writing/WritingSubscreen/InforTestScreen";

import { TestScreen } from "./src/screens/Speaking/SpeakingSubscreen/TestScreen";
import { DatabaseProvider } from "./src/database/DatabaseContext";
import { DatabaseStateHandler } from "./src/database/DatabaseStateHandler";
import { TestScreenWR } from "./src/screens/Writing/WritingSubscreen/TestScreen";
import { ResultScreen } from "./src/screens/Result";

import { MyLibraryScreen } from './src/screens/Vocabulary/VocabularySubscreen/MyLibraryScreen/MyLibraryScreen';
import { TopicsScreen } from "./src/screens/Vocabulary/TopicsScreen/TopicsScreen";
import { Ionicons } from '@expo/vector-icons';
import { VocabularyScreen } from './src/screens/Vocabulary'; 
import { LoginScreen } from "./src/screens/Login&Register";
import { RegisterScreen } from "./src/screens/Login&Register";


import 'expo-dev-client';
import 'react-native-gesture-handler';
import 'firebase/firestore';

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
      name="LoginScreen" 
      component={LoginScreen}
      options={{
        headerShown: false,
      }} />

      <Stack.Screen 
      name="RegisterScreen" 
      component={RegisterScreen}
      options={{
        headerShown: false,
      }}
       />
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
          headerRight: () => (
            <TouchableOpacity onPress={async () => {
              if (route.params?.handleSaveTopic) {
                await route.params.handleSaveTopic();
                navigation.navigate('Vocabulary');
              }
            }}>
              <Ionicons name="checkmark" size={24} color="#fff" style={{ marginRight: 10 }} />
            </TouchableOpacity>
          ),
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
      
      <Stack.Screen name="NoteScreen" component={NoteScreen} />
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      

      <Stack.Screen 
        name="ResultScreen" 
        component={ResultScreen}
        options={{
          headerTitle: "Kết quả bài làm",
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
