import { View, Text, StyleSheet } from "react-native";
import { SafeAreaBox } from "../../components";

export function SettingsScreen() {
  return (
    <SafeAreaBox>
      <View style={styles.container}>
        <Text style={styles.title}>Settings</Text>
      </View>
    </SafeAreaBox>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
  },
});
