import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import { HomeCard } from "./components";
import { HomeScreenProps } from "../types";
import { Heading, SafeAreaBox } from "../../components";
import { skills } from "./data";
import { vocabulary } from "./data";
export function HomeScreen({ navigation }: HomeScreenProps) {
  return (
    <SafeAreaBox>
      <ScrollView>
        <View style={homeScreen.rootContainer}>
          <WelcomeCard />

          <Text style={homeScreen.title}>Skills</Text>

          <FlatList
            scrollEnabled={false}
            numColumns={2}
            data={skills}
            renderItem={({ item, index }) => (
              <HomeCard
                title={item.title}
                image={item.image}
                // numOfQuestions={item.numOfQuestions}
                // duration={item.duration}
                index={index}
                onPress={() => {
                  navigation.navigate("Test", {
                    title: item.title,
                    testName: item.testName,
                  });
                }}
              />
            )}
            keyExtractor={(item) => item.id}
          />
          <Text style={homeScreen.title}>Vocabualry</Text>
          <FlatList
            scrollEnabled={false}
            numColumns={2}
            data={vocabulary}
            renderItem={({ item, index }) => (
              <HomeCard
                title={item.title}
                image={item.image}
                // numOfQuestions={item.numOfQuestions}
                // duration={item.duration}
                index={index}
                onPress={() => {
                  navigation.navigate("Test", {
                    title: item.title,
                    testName: item.testName,
                  });
                }}
              />
            )}
            keyExtractor={(item) => item.id}
          />

        </View>
      </ScrollView>
    </SafeAreaBox>
  );
}

function WelcomeCard() {
  return (
    <View style={welcomeCard.root}>
      <Heading text="TOEIC Practice App" fontSize={24} color="#fafafa" />
      <Text style={welcomeCard.text}>
      Welcome to the TOEIC Practice App! Let's achieve your TOEIC goals together!
      </Text>
    </View>
  );
}

const homeScreen = StyleSheet.create({
  rootContainer: {
    padding: 16,
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#525252",
  },
});

const welcomeCard = StyleSheet.create({
  root: {
    backgroundColor: "#4B5563",
    gap: 16,
    borderRadius: 24,
    padding: 24,
  },
  heading: {
    color: "#fafafa",
    fontSize: 24,
    fontWeight: "bold",
  },
  text: {
    color: "#fafafa",
    fontWeight: "500",
  },
});
