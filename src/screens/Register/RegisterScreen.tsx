import React, { useState } from "react";
import { View, TextInput, Button, Text, Alert } from "react-native";
import { registerUser } from "../../backend/utils/api";
import { RegisterScreenProps } from '../types';

const RegisterScreen = ({ navigation } : RegisterScreenProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await registerUser(username, password);
      Alert.alert("Success", "Account registered successfully!");
      navigation.navigate("LoginScreen");
    } catch (error) {
      Alert.alert("Error", error.message || "Registration failed");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Username:</Text>
      <TextInput value={username} onChangeText={setUsername} style={{ borderWidth: 1, padding: 10, marginBottom: 10 }} />
      
      <Text>Password:</Text>
      <TextInput value={password} onChangeText={setPassword} secureTextEntry style={{ borderWidth: 1, padding: 10, marginBottom: 10 }} />
      
      <Button title="Register" onPress={handleRegister} />
      <Button title="Already have an account? Login" onPress={() => navigation.navigate("LoginScreen")} />
    </View>
  );
};

export default RegisterScreen;
