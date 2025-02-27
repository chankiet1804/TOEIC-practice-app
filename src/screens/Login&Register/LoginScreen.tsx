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
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from '@expo/vector-icons';
import { loginApi } from "../../utils/api";
import { LoginScreenProps } from "../types";

interface FormData {
  email: string;
  name: string;
  password: string;
}

interface CustomAlertProps {
  visible: boolean;
  type: 'success' | 'error';
  message: string;
  navigation: LoginScreenProps["navigation"];
  EC: number;
  onClose: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ visible, type, message, onClose, navigation, EC }) => {
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
              if (EC === 0) {
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

export function LoginScreen({ navigation }: LoginScreenProps) {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    name: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState<{
    visible: boolean;
    type: 'success' | 'error';
    message: string;
    EC: number;
  }>({
    visible: false,
    type: 'success',
    message: '',
    EC: 1,
  });

  const handleLogin = async (data: FormData) => {
    try {
      const { name, email, password } = data;
      
      // Validation
      if (!email.trim()) {
        setAlert({
          visible: true,
          type: 'error',
          message: 'Vui lòng nhập email',
          EC: 1,
        });
        return;
      }
      
      if (!password.trim()) {
        setAlert({
          visible: true,
          type: 'error',
          message: 'Vui lòng nhập mật khẩu',
          EC: 1,
        });
        return;
      }
      
      const res = await loginApi({ name, email, password });

      if (res && res.EC === 0) {
        await AsyncStorage.setItem("access_token", res.access_token); 
        ///const token = await AsyncStorage.getItem("access_token");
        //console.log('>>>Checkk Token ', token);
        setAlert({
          visible: true,
          type: 'success',
          message: 'Đăng nhập thành công! Chào mừng bạn đến với ứng dụng.',
          EC: 0,
        });
        console.log('>>>Success login ', res);
      }
      else if (res && res.EC) {
        setAlert({
          visible: true,
          type: 'error',
          message: 'Thông tin đăng nhập không chính xác. Vui lòng thử lại!',
          EC: 1,
        });
        console.log('>>>check login ', res);
      }
    } catch (error) {
      setAlert({
        visible: true,
        type: 'error',
        message: 'Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại!',
        EC: 1,
      });

      console.error('Login error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../../assets/toeic-logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
           
            <Text style={styles.appTitle}>TOEIC Practice</Text>
            <Text style={styles.appSlogan}>Luyện thi TOEIC hiệu quả</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>Đăng nhập</Text>

            <View style={styles.inputContainer}>
              <View style={styles.inputIconContainer}>
                <Ionicons name="mail-outline" size={22} color="#5D7EBC" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#a0a0a0"
              />
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputIconContainer}>
                <Ionicons name="lock-closed-outline" size={22} color="#5D7EBC" />
              </View>
              <TextInput
                style={[styles.input, { paddingRight: 50 }]}
                placeholder="Mật khẩu"
                value={formData.password}
                onChangeText={(text) => setFormData({ ...formData, password: text })}
                secureTextEntry={!showPassword}
                placeholderTextColor="#a0a0a0"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={24}
                  color="#5D7EBC"
                />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity style={styles.forgotPasswordButton}>
              <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.loginButton} 
              onPress={() => handleLogin(formData)}
            >
              <Text style={styles.loginButtonText}>Đăng nhập</Text>
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>Hoặc</Text>
              <View style={styles.divider} />
            </View>

            <View style={styles.socialLoginContainer}>
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-google" size={24} color="#DB4437" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-facebook" size={24} color="#4267B2" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-apple" size={24} color="#000000" />
              </TouchableOpacity>
            </View>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Chưa có tài khoản? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("RegisterScreen")}>
                <Text style={styles.registerLink}>Đăng ký ngay</Text>
              </TouchableOpacity>
            </View>
          </View>

          <CustomAlert
            visible={alert.visible}
            type={alert.type}
            message={alert.message}
            navigation={navigation}
            onClose={() => setAlert(prev => ({ ...prev, visible: false }))}
            EC={alert.EC}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3F5CA8',
    marginBottom: 5,
  },
  appSlogan: {
    fontSize: 16,
    color: '#888888',
  },
  formContainer: {
    paddingHorizontal: 25,
    paddingVertical: 30,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginHorizontal: 20,
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#F5F7FA',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  inputIconContainer: {
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: '#333333',
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    height: '100%',
    justifyContent: 'center',
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 25,
  },
  forgotPasswordText: {
    color: '#5D7EBC',
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#5D7EBC',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#5D7EBC',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  loginButtonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E8E8E8',
  },
  dividerText: {
    paddingHorizontal: 15,
    color: '#888888',
    fontSize: 14,
  },
  socialLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 25,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    fontSize: 14,
    color: '#666666',
  },
  registerLink: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#5D7EBC',
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
    backgroundColor: '#fff',
    borderRadius: 20,
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
    backgroundColor: '#f44336',
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
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#fff',
  },
  alertButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});