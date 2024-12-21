import { Dimensions, Image, Pressable, StyleSheet, View } from "react-native";
import { Heading } from "../../../components/Heading";


const windowWidth = Dimensions.get('window').width;
const cardWidth = 0.8*windowWidth;

export interface image {
    source: any;
    alt: string;
  }
export interface Props {
    title: string;
    image: image;
    index: number;
    onPress: () => void;
}


  export function PartCard({
    title,
    image ,
    index,
    onPress,
  }: Props) {
    return (
      <Pressable
        onPress={onPress}
        style={partCard.root}>
        <View style={partCard.imageContainer}>
        <Image
          style={partCard.image}
          source={image.source}
          alt={image.alt}
          resizeMode="cover"
        />
        </View>
        <View style={partCard.textContainer}>
          <Heading text={title} fontSize={18} />
        </View>
      </Pressable>
    );
  }

  const partCard = StyleSheet.create({
    root: {
      flex: 0.5,
      //maxWidth: cardWidth,
      backgroundColor: 'white',
      borderRadius: 8,
      marginBottom: 8,
      elevation: 2, // for Android shadow
      shadowColor: '#000', // for iOS shadow
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      marginHorizontal: 10,
      justifyContent: 'center',
      height: 250,

    },
    imageContainer: {
      width: '100%',
      height: cardWidth * 0.6, // Tỉ lệ khung hình 3:2
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: '90%',
    },
    textContainer: {
      paddingHorizontal: 8,
      paddingBottom: 8,
      marginLeft: 10,
      justifyContent: 'center',
    },
  });
  