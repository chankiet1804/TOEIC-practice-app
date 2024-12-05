import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { HomeScreenProps } from "../types";
import { SafeAreaBox } from "../../components";

const { width } = Dimensions.get("window");

export function HomeScreen({ navigation }: HomeScreenProps) {
  return (
    <SafeAreaBox>
      <ScrollView scrollEnabled={false}>
        <View style={homeScreen.rootContainer}>
          <WelcomeCard />

          <Text style={homeScreen.sectionTitle}>Skills</Text>
          <TouchableOpacity
            style={homeScreen.card}
            onPress={() => navigation.navigate("Speaking")}
          >
            <View style={[homeScreen.cardContent, homeScreen.speakingCard]}>
              <Image
                source={require("../../../assets/speaking-thumb.png")}
                style={homeScreen.cardThumb}
                resizeMode="contain"
              />
              <Text style={[homeScreen.cardText, { color: "#000" }]}>
                Speaking
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={homeScreen.card}
            onPress={() => navigation.navigate("Writing")}
          >
            <View style={[homeScreen.cardContent, homeScreen.writingCard]}>
              <Image
                source={require("../../../assets/writing-thumb.png")}
                style={homeScreen.cardThumb}
                resizeMode="contain"
              />
              <Text style={[homeScreen.cardText, { color: "#000" }]}>
                Writing
              </Text>
            </View>
          </TouchableOpacity>

          <Text style={homeScreen.sectionTitle}>Vocabulary</Text>
          <TouchableOpacity
            style={homeScreen.card}
            onPress={() => navigation.navigate("Vocabulary")}
          >
            <Image
              source={require("../../../assets/vocabulary-thumb.png")}
              style={homeScreen.vocabularyImage}
              resizeMode="cover"
            />
            <Text style={homeScreen.cardText}>Learn Vocabulary</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaBox>
  );
}

function WelcomeCard() {
  return (
    <View style={welcomeCard.root}>
      <Text style={welcomeCard.heading}>
        Welcome to the TOEIC Practice App!
      </Text>
      <Text style={welcomeCard.text}>
        Let's achieve your TOEIC goals together!
      </Text>
    </View>
  );
}

const homeScreen = StyleSheet.create({
  rootContainer: {
    padding: 16,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
    marginBottom: 8,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    overflow: "hidden",
  },
  cardContent: {
    width: "100%",
    height: 120,
    padding: 16,
    position: "relative",
  },
  speakingCard: {
    backgroundColor: "#FFD7CE",
  },
  writingCard: {
    backgroundColor: "#90EE90",
  },
  cardThumb: {
    width: width - 64,
    height: "100%",
  },
  vocabularyImage: {
    width: "100%",
    height: 200,
  },
  cardText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
    position: "absolute",
    bottom: 16,
    left: 16,
  },
});

const welcomeCard = StyleSheet.create({
  root: {
    backgroundColor: "#60A5FA",
    gap: 8,
    borderRadius: 16,
    padding: 24,
  },
  heading: {
    color: "#fafafa",
    fontSize: 20,
    fontWeight: "bold",
  },
  text: {
    color: "#fafafa",
    fontWeight: "500",
  },
});
