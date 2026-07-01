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

interface Props {
  onGoBack: () => void
}

export function ForgotPasswordScreen({ onGoBack }: Props) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleReset() {
    if (!email.trim()) {
      setError('Introduce tu correo electrónico.')
      return
    }
    setError(null)
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: 'dtlcultural://reset-password',
    })
    setLoading(false)
    if (error) {
      setError('No se pudo enviar el correo. Inténtalo de nuevo.')
    } else {
      setSent(true)
    }
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

          {sent ? (
            <>
              <Text style={styles.title}>Revisa tu correo</Text>
              <Text style={styles.subtitle}>
                Te hemos enviado un enlace para restablecer tu contraseña a{' '}
                <Text style={styles.emailHighlight}>{email.trim()}</Text>.
              </Text>
              <TouchableOpacity style={styles.button} onPress={onGoBack} activeOpacity={0.85}>
                <Text style={styles.buttonText}>Volver al inicio de sesión</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.title}>¿Olvidaste tu contraseña?</Text>
              <Text style={styles.subtitle}>
                Introduce tu correo y te enviaremos un enlace para restablecerla.
              </Text>

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

                {error && <Text style={styles.error}>{error}</Text>}

                <TouchableOpacity
                  style={[styles.button, loading && styles.buttonDisabled]}
                  onPress={handleReset}
                  disabled={loading}
                  activeOpacity={0.85}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Enviar enlace</Text>
                  )}
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={onGoBack} style={styles.link}>
                <Text style={styles.linkText}>
                  ← <Text style={styles.linkAccent}>Volver al inicio de sesión</Text>
                </Text>
              </TouchableOpacity>
            </>
          )}
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
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(30,38,64,0.5)',
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 20,
  },
  emailHighlight: {
    color: '#1e2640',
    fontWeight: '700',
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
    width: '100%',
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
