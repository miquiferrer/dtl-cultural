import React from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'

type Props = { children: React.ReactNode; label?: string }
type State = { error: Error | null }

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>{this.props.label ?? 'Screen'} crashed</Text>
        <Text style={styles.message}>{error.message}</Text>
        <Text style={styles.stack}>{error.stack}</Text>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#1a0000',
    padding: 20,
    paddingTop: 60,
  },
  label: {
    color: '#ff6b6b',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 8,
  },
  message: {
    color: '#ffcccc',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 16,
  },
  stack: {
    color: '#ff9999',
    fontSize: 11,
    fontFamily: 'monospace',
    lineHeight: 16,
  },
})
