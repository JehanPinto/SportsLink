import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import { useLoginMutation } from '../../api/authApi';
import { useAppDispatch } from '../../hooks';
import { setCredentials } from './authSlice';
import { saveToken } from '../../utils/storage';

const loginSchema = yup.object().shape({
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

interface LoginFormData {
  username: string;
  password: string;
}

export default function LoginScreen() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [useMock, setUseMock] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const fillTestCredentials = () => {
    setValue('username', 'emilys');
    setValue('password', 'emilyspass');
  };

    const onSubmit = async (data: LoginFormData) => {
    // If mock mode, skip API call
    if (useMock) {
      const mockUser = {
        id: 1,
        username: data.username,
        email: `${data.username}@example.com`,
        firstName: 'Mock',
        lastName: 'User',
        image: 'https://via.placeholder.com/150',
      };
      const mockToken = `mock_token_${Date.now()}`;
      
      try {
        await saveToken('auth_token', mockToken);
        
        dispatch(
          setCredentials({
            user: mockUser,
            token: mockToken,
          })
        );
      } catch (error) {
        console.error('Mock login error:', error);
        Alert.alert('Error', 'Failed to save login credentials');
      }
      return;
    }

    try {
      console.log('Attempting login with:', data);
      const result = await login(data).unwrap();
      
      console.log('Login successful:', result);
      await saveToken('auth_token', result.accessToken);
      
      dispatch(
        setCredentials({
          user: {
            id: result.id,
            username: result.username,
            email: result.email,
            firstName: result.firstName,
            lastName: result.lastName,
            image: result.image,
          },
          token: result.accessToken,
        })
      );
    } catch (error: any) {
      console.error('Login error:', error);
      
      Alert.alert(
        'Login Failed',
        error?.data?.message || 'Invalid credentials. Try "emilys" / "emilyspass" or use Mock Login.',
        [
          {
            text: 'Use Mock Login',
            onPress: () => {
              setUseMock(true);
              handleSubmit(onSubmit)();
            },
          },
          {
            text: 'OK',
            style: 'cancel',
          },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sportify</Text>
      <Text style={styles.subtitle}>Login to your account</Text>

      <View style={styles.form}>
        <Controller
          control={control}
          name="username"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, errors.username && styles.inputError]}
                placeholder="Username"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
              />
              {errors.username && (
                <Text style={styles.errorText}>{errors.username.message}</Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                placeholder="Password"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry={true}
                autoCapitalize="none"
              />
              {errors.password && (
                <Text style={styles.errorText}>{errors.password.message}</Text>
              )}
            </View>
          )}
        />

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {useMock ? 'Login (Mock)' : 'Login'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={fillTestCredentials}
          style={[styles.linkButton, { marginTop: 8 }]}
        >
          <Text style={styles.linkText}>Fill Test Credentials</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Register' as never)}
          style={styles.linkButton}
        >
          <Text style={styles.linkText}>
            Don't have an account? Register
          </Text>
        </TouchableOpacity>

        <Text style={styles.hint}>
          Test: emilys / emilyspass
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  inputError: {
    borderColor: '#ff3b30',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  linkText: {
    color: '#007AFF',
    fontSize: 14,
  },
  hint: {
    marginTop: 24,
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
  },
});