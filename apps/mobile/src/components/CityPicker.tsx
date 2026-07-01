import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Pressable,
} from 'react-native'
import { useCityContext } from '../context/CityContext'
import type { City } from '@dtl-cultural/shared'

export function CityPicker() {
  const { cities, selectedCity, setSelectedCity } = useCityContext()
  const [open, setOpen] = useState(false)

  if (!selectedCity) return null

  function handleSelect(city: City) {
    setSelectedCity(city)
    setOpen(false)
  }

  return (
    <>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        style={styles.trigger}
        accessibilityRole="button"
        accessibilityLabel={`Ciudad seleccionada: ${selectedCity.name}. Pulsa para cambiar.`}
      >
        <Text style={styles.triggerText} numberOfLines={1}>
          {selectedCity.name}
        </Text>
        <Text style={styles.chevron}>▾</Text>
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Selecciona ciudad</Text>
            <FlatList
              data={cities}
              keyExtractor={(c) => c.id}
              renderItem={({ item }) => {
                const isSelected = item.id === selectedCity.id
                return (
                  <TouchableOpacity
                    style={[styles.row, isSelected && styles.rowSelected]}
                    onPress={() => handleSelect(item)}
                  >
                    <Text style={[styles.rowText, isSelected && styles.rowTextSelected]}>
                      {item.name}
                    </Text>
                    {isSelected && <Text style={styles.checkmark}>✓</Text>}
                  </TouchableOpacity>
                )
              }}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
    backgroundColor: 'rgba(30,38,64,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(30,38,64,0.15)',
    maxWidth: 130,
    gap: 4,
  },
  triggerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e2640',
    flexShrink: 1,
  },
  chevron: {
    fontSize: 10,
    color: 'rgba(30,38,64,0.45)',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  sheet: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#fcf6e3',
    borderRadius: 20,
    paddingTop: 20,
    paddingBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(30,38,64,0.1)',
  },
  sheetTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(30,38,64,0.4)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  rowSelected: {
    backgroundColor: 'rgba(244,146,30,0.1)',
  },
  rowText: {
    flex: 1,
    fontSize: 16,
    color: 'rgba(30,38,64,0.75)',
    fontWeight: '500',
  },
  rowTextSelected: {
    color: '#f4921e',
    fontWeight: '700',
  },
  checkmark: {
    fontSize: 14,
    color: '#f4921e',
    fontWeight: '700',
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(30,38,64,0.07)',
    marginHorizontal: 20,
  },
})
