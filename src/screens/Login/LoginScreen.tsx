import React, { useState } from "react";
import { View, TextInput, Button, Text, Alert } from "react-native";
import { LoginScreenProps } from '../types';
import { loginUser } from "../../backend/utils/api"
//import { RootStackParamList } from "../navigation/types";

// type LoginScreenProps = {
//   navigation: NativeStackNavigationProp<RootStackParamList, "Login">;
// };

const LoginScreen  = ({ navigation } : LoginScreenProps) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async () => {
    try {
      await loginUser(username, password);
      Alert.alert("Success", "Login successful!");
      navigation.navigate("Home");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Login failed");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Username:</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      
      <Text>Password:</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      
      <Button title="Login" onPress={handleLogin} />
      <Button title="Don't have an account? Register" onPress={() => navigation.navigate("RegisterScreen")} />
    </View>
  );
};

export default LoginScreen;
