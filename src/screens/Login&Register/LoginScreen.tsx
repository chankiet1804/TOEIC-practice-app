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
} from 'react-native';
//import { SafeAreaBox } from "../../components";
//import axios from "../../utils/axios.customize";
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
  EC:number;
  onClose: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ visible, type, message, onClose,navigation,EC }) => {
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
              color={type === 'success' ? '#fff' : '#fff'}
            />
          </View>
          <Text style={styles.alertMessage}>{message}</Text>
          <TouchableOpacity
            style={styles.alertButton}
            onPress={()=>
              {
              onClose();
              if(EC===0){
                navigation.navigate("Home")
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
    EC:number;
  }>({
    visible: false,
    type: 'success',
    message: '',
    EC:1,
  });

  const handleLogin = async (data:FormData) => {

    try {
      const { name, email, password } = data;
      const res = await loginApi( { name, email, password } );
      
      if (res && res.EC === 0) {
        
        setAlert({
          visible: true,
          type: 'success',
          message: 'Đăng nhập thành công! Chào mừng bạn đến với ứng dụng.',
          EC:0,

        });
        console.log('>>>Success login ', res);
      }
      else if (res && res.EC){
        setAlert({
          visible: true,
          type: 'error',
          message: 'Thông tin đăng nhập không chính xác. Vui lòng thử lại!',
          EC:1,
        });
        console.log('>>>check login ', res);
      }
    } catch (error) {
      setAlert({
        visible: true,
        type: 'error',
        message: 'Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại!',
        EC:1,
      });
      
      console.error('Login error:', error);
    } 
  };

  return (
    <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <View style={styles.formContainer}>
            <Text style={styles.title}>Đăng nhập</Text>
    
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
    
    
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { paddingRight: 50 }]}
                placeholder="Mật khẩu"
                value={formData.password}
                onChangeText={(text) => setFormData({ ...formData, password: text })}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={24}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
    
            <TouchableOpacity style={styles.button} onPress={()=>handleLogin(formData)}>
              <Text style={styles.buttonText}>Đăng nhập</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate("RegisterScreen")}>
                <Text style={styles.registerButtonText}>Chưa có tài khoản? Đăng ký ngay</Text>
            </TouchableOpacity>
          </View>
          <CustomAlert
            visible={alert.visible}
            type={alert.type}
            message={alert.message}
            navigation={navigation}
            onClose={() => setAlert(prev => ({ ...prev, visible: false }))}
            EC={alert.EC}
          />
        </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  formContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
    position: 'relative',
  },
  input: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
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
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
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
    lineHeight: 22,
  },
  alertButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#fff',
  },
  alertButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  registerButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3
  },
  registerButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center'
  }
});
