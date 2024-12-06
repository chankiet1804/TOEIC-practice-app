import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaBox } from "../../../../components";
import { useRoute} from '@react-navigation/native';
import { HomeStackParamList, InforTestScreenProps} from '../../../types';
import { RouteProp } from '@react-navigation/native';
import { Modal } from 'react-native';

type InforTestScreenRouteProp = RouteProp<HomeStackParamList, 'InforTestScreen'>;

const partInstructions = {
  '1': {
    title: 'Đọc đoạn văn',
    time: '45 giây',
    preparation: '45 giây',
    description: 'Trong phần này, bạn sẽ đọc to một đoạn văn. Bạn có 45 giây để chuẩn bị. Sau đó bạn có 45 giây để đọc đoạn văn.',
    tips: [
      'Đọc to và rõ ràng',
      'Chú ý phát âm và ngữ điệu',
      'Đọc với tốc độ vừa phải',
      'Chú ý dấu câu khi đọc'
    ]
  },
  '2': {
    title: 'Mô tả hình ảnh',
    time: '45 giây',
    preparation: '30 giây',
    description: 'Bạn sẽ nhìn một bức ảnh và mô tả những gì bạn thấy trong ảnh. Bạn có 30 giây để chuẩn bị và 45 giây để trả lời.',
    tips: [
      'Mô tả tổng quan bức ảnh trước',
      'Chú ý đến các chi tiết quan trọng',
      'Sử dụng thì hiện tại tiếp diễn',
      'Mô tả vị trí các đối tượng trong ảnh'
    ]
  },
  '3': {
    title: 'Trả lời câu hỏi với tình huống',
    time: '45 giây',
    preparation: '30 giây',
    description: 'Bạn sẽ trả lời 3 câu hỏi về một tình huống cụ thể. Bạn có 30 giây để chuẩn bị cho mỗi câu hỏi.',
    tips: [
      'Lắng nghe câu hỏi cẩn thận',
      'Trả lời ngắn gọn và đúng trọng tâm',
      'Sử dụng từ ngữ đơn giản, dễ hiểu',
      'Giải thích lý do cho câu trả lời của bạn'
    ]
  },
  '4': {
    title: 'Trả lời câu hỏi với thông tin cho trước',
    time: '60 giây',
    preparation: '30 giây',
    description: 'Bạn sẽ đọc một đoạn thông tin và trả lời câu hỏi dựa trên thông tin đó. Bạn có 30 giây để chuẩn bị.',
    tips: [
      'Đọc kỹ thông tin được cung cấp',
      'Ghi chú các điểm chính',
      'Trả lời dựa trên thông tin đã cho',
      'Sắp xếp câu trả lời logic'
    ]
  },
  '5': {
    title: 'Bày tỏ quan điểm cá nhân',
    time: '60 giây',
    preparation: '30 giây',
    description: 'Bạn sẽ đưa ra ý kiến về một chủ đề và giải thích lý do cho quan điểm của mình. Bạn có 30 giây chuẩn bị.',
    tips: [
      'Đưa ra quan điểm rõ ràng',
      'Cung cấp ít nhất 2 lý do ủng hộ',
      'Sử dụng các từ nối logic',
      'Kết luận rõ ràng'
    ]
  }
};

export function InforTestScreen({ navigation }: InforTestScreenProps) {
  const route = useRoute<InforTestScreenRouteProp>();
  const { PartNumber } = route.params;
  const partInfo = partInstructions[PartNumber as keyof typeof partInstructions];
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedTest, setSelectedTest] = React.useState<number | null>(null);

  const availableTests = [
    { id: 1, title: 'Bài test 1' },
    { id: 2, title: 'Bài test 2' },
    { id: 3, title: 'Bài test 3' },
    { id: 4, title: 'Bài test 4' },
    { id: 5, title: 'Bài test 5' },
    { id: 6, title: 'Bài test 6' },
    { id: 7, title: 'Bài test 7' },
    { id: 8, title: 'Bài test 8' },
    { id: 9, title: 'Bài test 9' },
    { id: 10, title: 'Bài test 10' },
  ];

  return (
    <SafeAreaBox>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.mainTitle}>Part {PartNumber}: {partInfo.title}</Text>
          
          <View style={styles.timeSection}>
            <View style={styles.timeItem}>
              <Text style={styles.timeLabel}>Thời gian chuẩn bị</Text>
              <Text style={styles.timeValue}>{partInfo.preparation}</Text>
            </View>
            <View style={styles.timeItem}>
              <Text style={styles.timeLabel}>Thời gian trả lời</Text>
              <Text style={styles.timeValue}>{partInfo.time}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mô tả</Text>
            <Text style={styles.description}>{partInfo.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mẹo làm bài</Text>
            {partInfo.tips.map((tip, index) => (
              <View key={index} style={styles.tipItem}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chọn bài test</Text>
              <TouchableOpacity
                style={styles.closeIcon}
                onPress={() => {
                  setModalVisible(false);
                  setSelectedTest(null);
                }}
              >
                <Text style={styles.closeIconText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.testList}>
              {availableTests.map((test) => (
                <TouchableOpacity
                  key={test.id}
                  style={[
                    styles.testItem,
                    selectedTest === test.id && styles.selectedTest
                  ]}
                  onPress={() => setSelectedTest(test.id)}
                >
                  <Text style={styles.testItemText}>{test.title}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={[
                styles.startButton,
                !selectedTest && styles.startButtonDisabled
              ]}
              onPress={() => {
                if (selectedTest) {
                  setModalVisible(false);
                  navigation.navigate('TestScreen');
                  setSelectedTest(null);
                }
              }}
              disabled={!selectedTest}
            >
              <Text style={styles.startButtonText}>Làm bài</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.buttonContainer}>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8} 
      >
        <Text style={styles.buttonText}>Bắt đầu làm bài</Text>
      </TouchableOpacity>
    </View>
      
    </SafeAreaBox>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 20,
  },
  timeSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  timeItem: {
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 5,
  },
  timeValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2980B9',
  },
  section: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#34495E',
    lineHeight: 24,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  tipBullet: {
    fontSize: 16,
    color: '#2980B9',
    marginRight: 8,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 16,
    color: '#34495E',
    lineHeight: 24,
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingBottom: 30
  },
  button: {
    backgroundColor: '#2980B9', 
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3, 
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
    alignItems: 'center',
  },
  modalHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  closeIcon: {
    position: 'absolute',
    right: 0,
    top: 0,
    padding: 5,
  },
  closeIconText: {
    fontSize: 20,
    color: '#95a5a6',
    fontWeight: '500',
  },
  testItem: {
    width: '100%',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#f8f9fa',
  },
  selectedTest: {
    borderColor: '#2980B9',
    backgroundColor: '#ebf5fb',
  },
  startButton: {
    backgroundColor: '#2980B9',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 10,
  },
  startButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  testItemText: {
    fontSize: 16,
    color: '#2C3E50',
    textAlign: 'center',
  },
  testList: {
    width: '90%',
    maxHeight: '70%',
  },
});