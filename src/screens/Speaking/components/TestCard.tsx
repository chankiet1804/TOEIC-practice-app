import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Heading } from "../../../components/Heading";


export interface Props {
    title: string;
    index: number;
    onPress: () => void;
  }
const img = {
    uri: 'https://literalni.com/wp-content/uploads/2023/04/podcast-radio.jpg',
    alt: 'Speaking Test',
  };

  export function TestCard({
    title,
    index,
    onPress,
  }: Props) {
    return (
      <Pressable
        onPress={onPress}
        style={[testCard.root, { marginRight: index % 2 === 0 ? 8 : 0 }]}>
        <View style={testCard.aspectRatio}>
        <Image
          style={testCard.image}
          source={{
            uri: img?.uri,
          }}
          alt={img?.alt}
        />
        </View>
        <View style={testCard.textContainer}>
          <Heading text={title} fontSize={18} />
        </View>
      </Pressable>
    );
  }

  const testCard = StyleSheet.create({
    root: {
      flex: 1,
      marginVertical: 8,
      borderRadius: 8,
      borderColor: "#cbd2d9",
      borderWidth: 1,
      overflow: "hidden",
    },
    aspectRatio: {
      aspectRatio: 16 / 7,
    },
    image: {
      flex: 1,
      resizeMode: "cover",
    },
    textContainer: {
      padding: 16,
    },
    footer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 8,
    },
    footerText: {
      fontSize: 12,
      color: "#718096",
    },
  });
  