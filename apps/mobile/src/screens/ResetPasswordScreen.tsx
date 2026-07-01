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
  onDone: () => void
}

export function ResetPasswordScreen({ onDone }: Props) {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  async function handleSave() {
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.')
      return
    }
    setError(null)
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) {
      setError('No se pudo actualizar la contraseña. Inténtalo de nuevo.')
    } else {
      setDone(true)
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

          {done ? (
            <>
              <Text style={styles.title}>Contraseña actualizada</Text>
              <Text style={styles.subtitle}>Ya puedes iniciar sesión con tu nueva contraseña.</Text>
              <TouchableOpacity style={styles.button} onPress={onDone} activeOpacity={0.85}>
                <Text style={styles.buttonText}>Ir al inicio de sesión</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.title}>Nueva contraseña</Text>
              <Text style={styles.subtitle}>Elige una nueva contraseña para tu cuenta.</Text>

              <View style={styles.form}>
                <View style={styles.field}>
                  <Text style={styles.label}>Nueva contraseña</Text>
                  <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholder="••••••••"
                    placeholderTextColor="rgba(30,38,64,0.35)"
                  />
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Confirmar contraseña</Text>
                  <TextInput
                    style={styles.input}
                    value={confirm}
                    onChangeText={setConfirm}
                    secureTextEntry
                    placeholder="••••••••"
                    placeholderTextColor="rgba(30,38,64,0.35)"
                  />
                </View>

                {error && <Text style={styles.error}>{error}</Text>}

                <TouchableOpacity
                  style={[styles.button, loading && styles.buttonDisabled]}
                  onPress={handleSave}
                  disabled={loading}
                  activeOpacity={0.85}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Guardar contraseña</Text>
                  )}
                </TouchableOpacity>
              </View>
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
})
