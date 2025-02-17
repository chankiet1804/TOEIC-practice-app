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
            
              <Image
                source={require("../../../assets/speaking2.png")}
                style={homeScreen.Image}
                resizeMode="cover"
              />
          </TouchableOpacity>

          <TouchableOpacity
            style={homeScreen.card}
            onPress={() => navigation.navigate("Writing")}
          >
            
              <Image
                
                source={require("../../../assets/writing-toeic.jpg")}
                style={homeScreen.Image}
                resizeMode="cover"
              />
          </TouchableOpacity>

          <Text style={homeScreen.sectionTitle}>Vocabulary</Text>
          <TouchableOpacity
            style={homeScreen.card}
            onPress={() => navigation.navigate("Vocabulary")}
          >
            <Image
              source={require("../../../assets/vocabulary-thumb.png")}
              style={homeScreen.Image}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* <View style={homeScreen.bottomNavContainer}>
        <TouchableOpacity
          style={homeScreen.bottomNavButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Image
            source={require("../../../assets/main-icon.png")}
            style={homeScreen.bottomNavIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={homeScreen.bottomNavButton}
          onPress={() => navigation.navigate("NoteScreen")}
        >
          <Image
            source={require("../../../assets/note-icon.png")}
            style={homeScreen.bottomNavIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={homeScreen.bottomNavButton}
          onPress={() => navigation.navigate("SettingsScreen")}
        >
          <Image
            source={require("../../../assets/settings-icon.png")}
            style={homeScreen.bottomNavIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

      </View> */}

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
    marginTop: 4,
    marginBottom: 4,
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
  Image: {
    width: "100%",
    height: 160,
  },

  bottomNavContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: "#f8f8f8",
    borderTopColor: "#ddd",
    borderTopWidth: 2,
  },
  bottomNavButton: {
    padding: 10,
  },
  bottomNavIcon: {
    width: 30, // Định kích thước icon
    height: 30,
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
