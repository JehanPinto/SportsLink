import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useLoginMutation } from '../../api/authApi';
import { useAppDispatch } from '../../hooks';
import { setCredentials } from './authSlice';
import { useTheme } from '../../context/ThemeContext';
import { loginLocalUser } from '../../utils/localAuthStorage';
import { RootStackParamList } from '../../navigation/types';

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
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const [login, { isLoading: isApiLoading }] = useLoginMutation();
  const { theme, isDark } = useTheme();
  const [isLocalLoading, setIsLocalLoading] = React.useState(false);

  const isLoading = isApiLoading || isLocalLoading;

  const {
    control,
    handleSubmit,
    formState: { errors },
    
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLocalLoading(true);

      // Step 1: Try local user first
      const localUser = await loginLocalUser(data.username, data.password);

      if (localUser) {
        // Login successful with local user
        dispatch(
          setCredentials({
            user: {
              id: parseInt(localUser.id, 10),
              username: localUser.username,
              email: localUser.email,
              firstName: localUser.firstName,
              lastName: localUser.lastName,
              gender: localUser.gender || '',
              image: localUser.image || '',
            },
            token: `local_${localUser.id}`, // Generate a local token
          })
        );
        setIsLocalLoading(false);
        return;
      }

      // Step 2: If no local user, try API (for test users)
      setIsLocalLoading(false);
      const result = await login(data).unwrap();

      dispatch(
        setCredentials({
          user: {
            id: parseInt(result.id, 10),
            username: result.username,
            email: result.email,
            firstName: result.firstName,
            lastName: result.lastName,
            gender: result.gender,
            image: result.image,
          },
          token: result.accessToken,
        })
      );
    } catch {
      setIsLocalLoading(false);
      Alert.alert('Login Failed', 'Invalid credentials. Please check your username and password.', [
        { text: 'OK' },
      ]);
    }
  };

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

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
                placeholderTextColor={theme.colors.placeholder}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
              />
              {errors.username && <Text style={styles.errorText}>{errors.username.message}</Text>}
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
                placeholderTextColor={theme.colors.placeholder}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry
                autoCapitalize="none"
              />
              {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
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
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.linkButton}>
          <Text style={styles.linkText}>
            Don't have an account? <Text style={styles.linkTextBold}>Register</Text>
          </Text>
        </TouchableOpacity>

        <Text style={styles.hint}>Test API user: emilys / emilyspass</Text>
      </View>
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 20,
      justifyContent: 'center',
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
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
      borderColor: theme.colors.border,
      borderRadius: 12,
      padding: 14,
      fontSize: 16,
      backgroundColor: theme.colors.surface,
      color: theme.colors.text,
    },
    inputError: {
      borderColor: theme.colors.error,
    },
    errorText: {
      color: theme.colors.error,
      fontSize: 12,
      marginTop: 4,
      marginLeft: 4,
    },
    button: {
      backgroundColor: theme.colors.primary,
      padding: 16,
      borderRadius: 12,
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
      color: theme.colors.textSecondary,
      fontSize: 14,
    },
    linkTextBold: {
      color: theme.colors.primary,
      fontWeight: '600',
    },
    hint: {
      marginTop: 24,
      textAlign: 'center',
      color: theme.colors.textSecondary,
      fontSize: 12,
    },
  });
