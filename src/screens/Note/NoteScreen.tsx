
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
import { createUserApi } from "../../utils/api";

interface FormData {
  email: string;
  name: string;
  password: string;
}

interface CustomAlertProps {
  visible: boolean;
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ visible, type, message, onClose }) => {
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
            onPress={onClose}
          >
            <Text style={styles.alertButtonText}>Đóng</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

export function NoteScreen() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState<{
    visible: boolean;
    type: 'success' | 'error';
    message: string;
  }>({
    visible: false,
    type: 'success',
    message: '',
  });

  const handleRegister = async (data:FormData) => {
    // const {name,email,password} = data;

    // const res = await createUserApi({name,email,password});

    // console.log('>>>Success register ', res);
    try {
      const { name, email, password } = data;
      const res = await createUserApi({ name, email, password });
      
      if (res) {
        setAlert({
          visible: true,
          type: 'success',
          message: 'Đăng ký thành công! Chào mừng bạn đến với ứng dụng.',
        });
        setFormData({
          email: '',
          name: '',
          password: '',
        });
        console.log('>>>Success register ', res);
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


  //console.log(">>> NoteScreen rendered");
  //const [data, setData] = useState<any>(null);
  // useEffect(() => {
  //   const fetchHelloWorld = async () => {
  //     try {
  //       const res = await axios.get("/v1/api"); // Đổi localhost thành IP máy, 10.0.2.2 la ip cua android studio
  //       console.log(">>> check res : ", res);
  //       setData(res);
  //     } catch (error) {
  //       console.error(">>> API fetch error: ", error);
  //     }
  //   };
  //   fetchHelloWorld();
  // }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        <Text style={styles.title}>Đăng ký</Text>

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
            style={styles.input}
            placeholder="Họ và tên"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
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

        <TouchableOpacity style={styles.button} onPress={()=>handleRegister(formData)}>
          <Text style={styles.buttonText}>Đăng ký</Text>
        </TouchableOpacity>
      </View>
      <CustomAlert
        visible={alert.visible}
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert(prev => ({ ...prev, visible: false }))}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
});
