import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../context/ThemeContext';
import { registerLocalUser } from '../../utils/localAuthStorage';

const registerSchema = yup.object().shape({
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: yup.string().required('Email is required').email('Please enter a valid email'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
});

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export default function RegisterScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { theme, isDark } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const newUser = await registerLocalUser({
        username: data.username,
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      });

      // Reset form
      reset();

      // Show success alert with automatic redirect
      Alert.alert(
        '🎉 Success!',
        `Welcome ${newUser.firstName}! Your account has been created successfully. You can now login with your credentials.`,
        [
          {
            text: 'Login Now',
            onPress: () => navigation.navigate('Login'),
            style: 'default',
          },
        ],
        { cancelable: false }
      );

      // Auto redirect after 2 seconds if user doesn't click
      setTimeout(() => {
        navigation.navigate('Login');
      }, 3000);
    } catch (error: any) {
      Alert.alert(
        '❌ Registration Failed',
        error.message || 'Something went wrong. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const styles = createStyles(theme, isDark);

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Feather name="arrow-left" size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={styles.title}>Create Account</Text>
            <View style={{ width: 40 }} />
          </View>

          <Text style={styles.subtitle}>Join Sportify today! 🚀</Text>

          {/* Form */}
          <View style={styles.form}>
            {/* First Name */}
            <Controller
              control={control}
              name="firstName"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>First Name *</Text>
                  <View style={styles.inputWrapper}>
                    <Feather
                      name="user"
                      size={18}
                      color={theme.colors.textSecondary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[styles.input, errors.firstName && styles.inputError]}
                      placeholder="John"
                      placeholderTextColor={theme.colors.placeholder}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      autoCapitalize="words"
                    />
                  </View>
                  {errors.firstName && (
                    <Text style={styles.errorText}>
                      <Feather name="alert-circle" size={12} /> {errors.firstName.message}
                    </Text>
                  )}
                </View>
              )}
            />

            {/* Last Name */}
            <Controller
              control={control}
              name="lastName"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Last Name *</Text>
                  <View style={styles.inputWrapper}>
                    <Feather
                      name="user"
                      size={18}
                      color={theme.colors.textSecondary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[styles.input, errors.lastName && styles.inputError]}
                      placeholder="Doe"
                      placeholderTextColor={theme.colors.placeholder}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      autoCapitalize="words"
                    />
                  </View>
                  {errors.lastName && (
                    <Text style={styles.errorText}>
                      <Feather name="alert-circle" size={12} /> {errors.lastName.message}
                    </Text>
                  )}
                </View>
              )}
            />

            {/* Username */}
            <Controller
              control={control}
              name="username"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Username *</Text>
                  <View style={styles.inputWrapper}>
                    <Feather
                      name="at-sign"
                      size={18}
                      color={theme.colors.textSecondary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[styles.input, errors.username && styles.inputError]}
                      placeholder="johndoe"
                      placeholderTextColor={theme.colors.placeholder}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      autoCapitalize="none"
                    />
                  </View>
                  {errors.username && (
                    <Text style={styles.errorText}>
                      <Feather name="alert-circle" size={12} /> {errors.username.message}
                    </Text>
                  )}
                </View>
              )}
            />

            {/* Email */}
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Email *</Text>
                  <View style={styles.inputWrapper}>
                    <Feather
                      name="mail"
                      size={18}
                      color={theme.colors.textSecondary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[styles.input, errors.email && styles.inputError]}
                      placeholder="john@example.com"
                      placeholderTextColor={theme.colors.placeholder}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      autoCapitalize="none"
                      keyboardType="email-address"
                    />
                  </View>
                  {errors.email && (
                    <Text style={styles.errorText}>
                      <Feather name="alert-circle" size={12} /> {errors.email.message}
                    </Text>
                  )}
                </View>
              )}
            />

            {/* Password */}
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Password *</Text>
                  <View style={styles.inputWrapper}>
                    <Feather
                      name="lock"
                      size={18}
                      color={theme.colors.textSecondary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[styles.input, errors.password && styles.inputError]}
                      placeholder="••••••••"
                      placeholderTextColor={theme.colors.placeholder}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      secureTextEntry
                      autoCapitalize="none"
                    />
                  </View>
                  {errors.password && (
                    <Text style={styles.errorText}>
                      <Feather name="alert-circle" size={12} /> {errors.password.message}
                    </Text>
                  )}
                </View>
              )}
            />

            {/* Confirm Password */}
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Confirm Password *</Text>
                  <View style={styles.inputWrapper}>
                    <Feather
                      name="lock"
                      size={18}
                      color={theme.colors.textSecondary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[styles.input, errors.confirmPassword && styles.inputError]}
                      placeholder="••••••••"
                      placeholderTextColor={theme.colors.placeholder}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      secureTextEntry
                      autoCapitalize="none"
                    />
                  </View>
                  {errors.confirmPassword && (
                    <Text style={styles.errorText}>
                      <Feather name="alert-circle" size={12} /> {errors.confirmPassword.message}
                    </Text>
                  )}
                </View>
              )}
            />

            {/* Register Button */}
            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <ActivityIndicator color="#fff" />
                  <Text style={styles.buttonText}>Creating Account...</Text>
                </>
              ) : (
                <>
                  <Text style={styles.buttonText}>Create Account</Text>
                  <Feather name="arrow-right" size={20} color="#fff" />
                </>
              )}
            </TouchableOpacity>

            {/* Login Link */}
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              style={styles.linkButton}
            >
              <Text style={styles.linkText}>
                Already have an account? <Text style={styles.linkTextBold}>Login</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    safeArea: {
      flex: 1,
    },
    scrollContent: {
      padding: 20,
      paddingBottom: 40,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    backButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginBottom: 32,
    },
    form: {
      width: '100%',
    },
    inputContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 8,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 12,
      backgroundColor: theme.colors.surface,
    },
    inputIcon: {
      marginLeft: 12,
    },
    input: {
      flex: 1,
      padding: 14,
      fontSize: 16,
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
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    button: {
      backgroundColor: theme.colors.primary,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 8,
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 8,
      ...theme.shadows?.medium,
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
      marginTop: 20,
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
  });
