
import { Text } from "react-native";
import { SafeAreaBox } from "../../../../components";
import { SpeakingScreenProps } from "../../../types";
import { RouteProp, useRoute } from '@react-navigation/native';
import { HomeStackParamList } from '../../../../screens/types';

type InforTestScreenRouteProp = RouteProp<HomeStackParamList, 'InforTestScreen'>;

export function InforTestScreen() {
  const route = useRoute<InforTestScreenRouteProp>();
  const { SpeakTestID } = route.params;
  return (
    <SafeAreaBox>
      <Text>Infor Test {SpeakTestID}</Text>
    </SafeAreaBox>
  );
}
