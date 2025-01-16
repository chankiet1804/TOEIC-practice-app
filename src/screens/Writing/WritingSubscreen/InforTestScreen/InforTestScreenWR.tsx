import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaBox } from "../../../../components";
import { useRoute} from '@react-navigation/native';
import { HomeStackParamList, InforTestScreenWRProps} from '../../../types';
import { RouteProp } from '@react-navigation/native';
import { Modal } from 'react-native';

type InforTestScreenRouteProp = RouteProp<HomeStackParamList, 'InforTestScreenWR'>;

const partInstructions = {
  '1': {
    title: 'Mô tả hình ảnh',
    time: '10 phút',
    preparation: '10 phút',
    description: 'Trong phần này của bài thi, bạn sẽ viết MỘT câu dựa trên một bức tranh. Với mỗi bức tranh, bạn sẽ được cung cấp HAI từ hoặc cụm từ mà bạn phải sử dụng trong câu của mình. Bạn có 10 phút để trả lời cho 5 câu hỏi.',
    tips: [
      'Chú ý đảm bảo sử dụng đúng và đầy đủ cả hai từ trong câu mô tả.',
      'Mô tả trực quan những gì nhìn thấy trong ảnh.',
      'Chú ý viết đúng chính tả và đúng ngữ pháp.',
      'Đảm bảo câu có cấu trúc đơn giản, rõ ràng, không rườm rà.'
    ]
  },
  '2': {
    title: 'Phản hồi Email',
    time: '20 phút',
    preparation: '20 phút',
    description: 'Trong phần này của bài thi, bạn sẽ thể hiện khả năng viết phản hồi cho một email. Bạn sẽ có 10 phút để đọc và trả lời mỗi email.',
    tips: [
      'Dành 2-3 phút để đọc email và ghi chú các thông tin cần trả lời.',
      'Cần xác định rõ : Lý do viết email, câu hỏi hoặc vấn đề cần giải quyết.',
      'Đảm bảo ngữ pháp và đúng chính tả.',
      'Chú ý sử dụng các từ nối logic.',
    ]
  },
  '3': {
    title: 'Bày tỏ quan điểm cá nhân ',
    time: '30 phút',
    preparation: '30 phút',
    description: 'Trong phần này của bài thi, bạn sẽ viết một bài luận để bày tỏ ý kiến của mình về một vấn đề được đưa ra. Nhiệm vụ của bạn là trình bày rõ quan điểm, giải thích lý do và đưa ra các lập luận thuyết phục để hỗ trợ ý kiến của mình. Bạn sẽ có 30 phút để lập kế hoạch, viết bài và hoàn thiện nội dung.',
    tips: [
      'Dành 3-5 phút để lập dàn ý bài viết.',
      'Nên viết theo bố cục sau :\n - Mở bài: Giới thiệu vấn đề và quan điểm cá nhân. \n - Thân bài: Chia làm 2 đoạn, mỗi đoạn đưa ra luận điểm và giải thích.  \n - Kết bài: Tóm tắt quan điểm và lập luận.',
      'Chú ý sử dụng từ nối để liên kết các phần.',
      'Nên dành 1-2 phút cuối để đọc lại bài viết và chỉnh sửa nếu cần.'
    ]
  }
};

export function InforTestScreenWR({ navigation }: InforTestScreenWRProps) {
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
    { id: 11, title: 'Bài test 11' },
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
                  navigation.navigate('TestScreenWR', { testId: selectedTest, PartNumber: PartNumber });
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
    top: -5,
    padding: 5,
  },
  closeIconText: {
    fontSize: 20,
    color: '#95a5a6',
    fontWeight: 'bold',
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
    paddingHorizontal: 50,
    borderRadius: 10,
    marginTop: 40,
    
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