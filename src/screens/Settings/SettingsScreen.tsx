import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback, Alert } from "react-native";
import { SafeAreaBox } from "../../components";
import { SettingsScreenProps } from "../types";
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";

export function SettingsScreen({ navigation }: SettingsScreenProps) {
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const showLogoutModal = () => {
    setLogoutModalVisible(true);
  };

  const hideLogoutModal = () => {
    setLogoutModalVisible(false);
  };

  const removeToken = async () => {
    try {
      await AsyncStorage.removeItem("access_token");
      console.log("Đã xóa token, đăng xuất thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa token:", error);
    }
  };

  const handleLogout = () => {
    // Thực hiện các thao tác đăng xuất ở đây, ví dụ:
    // - Xóa token khỏi AsyncStorage
    removeToken();
    
    // Đóng modal
    hideLogoutModal();
    
    // Chuyển đến màn hình đăng nhập
    navigation.navigate('LoginScreen');
  };

  const settingsOptions = [
    { 
      id: 'profile', 
      title: 'Thông tin cá nhân', 
      icon: 'person-outline',
      onPress: () => Alert.alert('Thông báo', 'Tính năng đang phát triển')
    },
    { 
      id: 'notification', 
      title: 'Thông báo', 
      icon: 'notifications-outline',
      onPress: () => Alert.alert('Thông báo', 'Tính năng đang phát triển')
    },
    { 
      id: 'appearance', 
      title: 'Giao diện', 
      icon: 'color-palette-outline',
      onPress: () => Alert.alert('Thông báo', 'Tính năng đang phát triển')
    },
    { 
      id: 'language', 
      title: 'Ngôn ngữ', 
      icon: 'language-outline',
      onPress: () => Alert.alert('Thông báo', 'Tính năng đang phát triển')
    },
    { 
      id: 'about', 
      title: 'Về ứng dụng', 
      icon: 'information-circle-outline',
      onPress: () => Alert.alert('Thông báo', 'Tính năng đang phát triển')
    },
  ];

  return (
    <SafeAreaBox>
      <View style={styles.container}>
        <Text style={styles.title}>Cài đặt</Text>
        
        <View style={styles.optionsContainer}>
          {settingsOptions.map((option) => (
            <TouchableOpacity 
              key={option.id} 
              style={styles.optionItem}
              onPress={option.onPress}
            >
              {/* <View style={styles.optionIconContainer}>
                <Ionicons name={option.icon} size={22} color="#4A7AFF" />
              </View> */}
              <Text style={styles.optionText}>{option.title}</Text>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.divider} />
        
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={showLogoutModal}
        >
          <Ionicons name="log-out-outline" size={22} color="#ff5252" />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
        
        {/* Modal xác nhận đăng xuất */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={logoutModalVisible}
          onRequestClose={hideLogoutModal}
        >
          <TouchableWithoutFeedback onPress={hideLogoutModal}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContainer}>
                  <View style={styles.modalHeader}>
                    <Ionicons name="alert-circle-outline" size={50} color="#4A7AFF" />
                    <Text style={styles.modalTitle}>Xác nhận đăng xuất</Text>
                  </View>
                  
                  <Text style={styles.modalMessage}>
                    Bạn có chắc chắn muốn đăng xuất khỏi ứng dụng?
                  </Text>
                  
                  <View style={styles.modalButtons}>
                    <TouchableOpacity 
                      style={[styles.modalButton, styles.cancelButton]}
                      onPress={hideLogoutModal}
                    >
                      <Text style={styles.cancelButtonText}>Hủy</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[styles.modalButton, styles.confirmButton]}
                      onPress={handleLogout}
                    >
                      <Text style={styles.confirmButtonText}>Đăng xuất</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </SafeAreaBox>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 24,
  },
  optionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(74, 122, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 10,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  logoutText: {
    marginLeft: 16,
    fontSize: 16,
    fontWeight: '500',
    color: '#ff5252',
  },
  // Styles cho Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  modalMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  confirmButton: {
    backgroundColor: '#ff5252',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});