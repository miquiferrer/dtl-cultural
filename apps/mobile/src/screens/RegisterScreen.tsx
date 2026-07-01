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
import Constants from 'expo-constants'
import { supabase } from '../lib/supabase'

interface Props {
  onGoToLogin: () => void
  onRegistered?: () => void
}

export function RegisterScreen({ onGoToLogin, onRegistered }: Props) {
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleRegister() {
    if (!displayName.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Rellena todos los campos.')
      return
    }
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      return
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }
    setError(null)
    setLoading(true)

    // Call the Supabase Edge Function to create the user with email confirmed
    const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl as string
    const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey as string

    try {
      const res = await fetch(`${supabaseUrl}/functions/v1/register-app-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseAnonKey,
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
          display_name: displayName.trim(),
        }),
      })

      const json = await res.json()

      if (!res.ok) {
        setError(json.error ?? json.message ?? 'Error al registrarse.')
        setLoading(false)
        return
      }

      // Auto sign-in after successful registration
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (signInError) {
        setError('Cuenta creada. Por favor inicia sesión.')
        onGoToLogin()
      } else {
        // Notify caller so the onboarding screen can be shown
        onRegistered?.()
      }
      // On success, AuthContext's onAuthStateChange fires automatically.
    } catch {
      setError('Error de conexión. Inténtalo de nuevo.')
    }

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
          <Text style={styles.title}>Crear cuenta</Text>
          <Text style={styles.subtitle}>Únete a la agenda cultural de Terrassa</Text>

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Nombre</Text>
              <TextInput
                style={styles.input}
                value={displayName}
                onChangeText={setDisplayName}
                autoCapitalize="words"
                placeholder="Tu nombre"
                placeholderTextColor="rgba(30,38,64,0.35)"
              />
            </View>

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
                  placeholder="Mínimo 8 caracteres"
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

            <View style={styles.field}>
              <Text style={styles.label}>Confirmar contraseña</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  placeholder="Repite la contraseña"
                  placeholderTextColor="rgba(30,38,64,0.35)"
                />
                <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() => setShowConfirmPassword((v) => !v)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={styles.eyeText}>{showConfirmPassword ? 'Ocultar' : 'Ver'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {error && <Text style={styles.error}>{error}</Text>}

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Registrarse</Text>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={onGoToLogin} style={styles.link}>
            <Text style={styles.linkText}>
              ¿Ya tienes cuenta?{' '}
              <Text style={styles.linkAccent}>Inicia sesión</Text>
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
