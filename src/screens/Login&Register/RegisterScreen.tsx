import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Animated,
  Image,
  ScrollView,
  StatusBar,
} from 'react-native';
//import { SafeAreaBox } from "../../components";
//import axios from "../../utils/axios.customize";
import { Ionicons } from '@expo/vector-icons';
import { createUserApi } from "../../utils/api";
import { RegisterScreenProps } from "../types";

interface FormData {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
}

interface CustomAlertProps {
  visible: boolean;
  type: 'success' | 'error';
  message: string;
  navigation: RegisterScreenProps["navigation"];
  onClose: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ visible, type, message, onClose, navigation }) => {
  const [animation] = useState(new Animated.Value(0));

  React.useEffect(() => {
    if (visible) {
      Animated.spring(animation, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.alertContainer,
            {
              transform: [{
                scale: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              }],
            },
            type === 'success' ? styles.successAlert : styles.errorAlert,
          ]}
        >
          <View style={styles.alertIconContainer}>
            <Ionicons
              name={type === 'success' ? 'checkmark-circle-outline' : 'alert-circle-outline'}
              size={50}
              color="#fff"
            />
          </View>
          <Text style={styles.alertMessage}>{message}</Text>
          <TouchableOpacity
            style={styles.alertButton}
            onPress={() => {
              onClose();
              if (type === 'success') {
                navigation.navigate("Home");
              }
            }}
          >
            <Text style={styles.alertButtonText}>OK</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

export function RegisterScreen({ navigation }: RegisterScreenProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [alert, setAlert] = useState<{
    visible: boolean;
    type: 'success' | 'error';
    message: string;
  }>({
    visible: false,
    type: 'success',
    message: '',
  });

  const validateForm = () => {
    if (!formData.email || !formData.name || !formData.password || !formData.confirmPassword) {
      setAlert({
        visible: true,
        type: 'error',
        message: 'Vui lòng điền đầy đủ thông tin',
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setAlert({
        visible: true,
        type: 'error',
        message: 'Email không hợp lệ',
      });
      return false;
    }

    if (formData.password.length < 6) {
      setAlert({
        visible: true,
        type: 'error',
        message: 'Mật khẩu phải có ít nhất 6 ký tự',
      });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setAlert({
        visible: true,
        type: 'error',
        message: 'Mật khẩu xác nhận không khớp',
      });
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      const { name, email, password } = formData;
      const res = await createUserApi({ name, email, password });
      
      if (res&&res.EC===0) {
        setAlert({
          visible: true,
          type: 'success',
          message: 'Đăng ký thành công! Chào mừng bạn đến với ứng dụng TOEIC.',
        });
        setFormData({
          email: '',
          name: '',
          password: '',
          confirmPassword: '',
        });
      }
      else if (res&&res.EC===1) {
        setAlert({
          visible: true,
          type: 'error',
          message: 'Email đã tồn tại, vui lòng nhập email khác!',
        });
      }
    } catch (error) {
      setAlert({
        visible: true,
        type: 'error',
        message: 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại!',
      });
      console.error('Register error:', error);
    } 
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../../assets/toeic-logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appName}>TOEIC Learning</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Đăng ký tài khoản</Text>
          <Text style={styles.subtitle}>Tạo tài khoản để tiếp cận các bài học TOEIC</Text>

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#4A7AFF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#4A7AFF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Họ và tên"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#4A7AFF" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { paddingRight: 50 }]}
              placeholder="Mật khẩu"
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
              secureTextEntry={!showPassword}
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                size={22}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#4A7AFF" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { paddingRight: 50 }]}
              placeholder="Xác nhận mật khẩu"
              value={formData.confirmPassword}
              onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
              secureTextEntry={!showConfirmPassword}
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons
                name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                size={22}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>ĐĂNG KÝ</Text>
          </TouchableOpacity>

          <View style={styles.loginLinkContainer}>
            <Text style={styles.loginText}>Đã có tài khoản? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
              <Text style={styles.loginLink}>Đăng nhập</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <CustomAlert
        visible={alert.visible}
        type={alert.type}
        message={alert.message}
        navigation={navigation}
        onClose={() => setAlert(prev => ({ ...prev, visible: false }))}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 80,
    marginBottom: 10,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A7AFF',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#777',
    marginBottom: 25,
  },
  inputContainer: {
    marginBottom: 18,
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
  },
  inputIcon: {
    marginLeft: 15,
    marginRight: 5,
  },
  input: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    height: '100%',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#4A7AFF',
    padding: 16,
    borderRadius: 10,
    marginTop: 10,
    elevation: 2,
    shadowColor: '#4A7AFF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#666',
    fontSize: 14,
  },
  loginLink: {
    color: '#4A7AFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  // Styles cho Custom Alert
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContainer: {
    width: '80%',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  successAlert: {
    backgroundColor: '#4CAF50',
  },
  errorAlert: {
    backgroundColor: '#ff5252',
  },
  alertIconContainer: {
    marginBottom: 15,
  },
  alertMessage: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
    fontWeight: '500',
  },
  alertButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  alertButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});