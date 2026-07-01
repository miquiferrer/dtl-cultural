import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native'

import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '../lib/supabase'
import { ForgotPasswordScreen } from './ForgotPasswordScreen'

interface Props {
  onGoToRegister: () => void
}

export function LoginScreen({ onGoToRegister }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)

  if (showForgotPassword) {
    return <ForgotPasswordScreen onGoBack={() => setShowForgotPassword(false)} />
  }

  async function handleLogin() {
    if (!email.trim() || !password) {
      setError('Introduce tu correo y contraseña.')
      return
    }
    setError(null)
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })

    if (error) {
      setError('Correo o contraseña incorrectos.')
    }
    // On success, AuthContext's onAuthStateChange fires and updates the session.
    setLoading(false)
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Iniciar sesión</Text>
          <Text style={styles.subtitle}>Accede a la agenda cultural de Terrassa</Text>

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Correo electrónico</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="tu@email.com"
                placeholderTextColor="rgba(30,38,64,0.35)"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Contraseña</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholder="••••••••"
                  placeholderTextColor="rgba(30,38,64,0.35)"
                />
                <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() => setShowPassword((v) => !v)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={styles.eyeText}>{showPassword ? 'Ocultar' : 'Ver'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => setShowForgotPassword(true)}
              style={styles.forgotLink}
            >
              <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>

            {error && <Text style={styles.error}>{error}</Text>}

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Entrar</Text>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={onGoToRegister} style={styles.link}>
            <Text style={styles.linkText}>
              ¿No tienes cuenta?{' '}
              <Text style={styles.linkAccent}>Regístrate</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fcf6e3' },
  flex: { flex: 1 },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1e2640',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(30,38,64,0.5)',
    marginBottom: 32,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    gap: 16,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(30,38,64,0.6)',
  },
  input: {
    backgroundColor: 'rgba(30,38,64,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(30,38,64,0.12)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1e2640',
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    paddingRight: 60,
  },
  eyeBtn: {
    position: 'absolute',
    right: 14,
  },
  eyeText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(30,38,64,0.4)',
  },
  error: {
    fontSize: 13,
    color: '#e8463a',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#f4921e',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  forgotLink: {
    alignSelf: 'flex-end',
  },
  forgotText: {
    fontSize: 13,
    color: '#f4921e',
    fontWeight: '600',
  },
  link: {
    marginTop: 24,
  },
  linkText: {
    fontSize: 14,
    color: 'rgba(30,38,64,0.5)',
  },
  linkAccent: {
    color: '#f4921e',
    fontWeight: '700',
  },
})
