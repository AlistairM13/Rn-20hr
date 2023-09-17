import { Alert, Button, Keyboard, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import useCountdown from '../../hooks/useCountdown'
import { formatDuration } from '../../helpers/helpers'

export default function SkillDetailsScreen({ navigation }) {
  const { secondsLeft, startCountdown, stopCountdown } = useCountdown()
  const [startTime, setStartTime] = useState()
  const [error, setError] = useState()

  function startTimer() {
    const trimmed = startTime.trim()
    const regex = /^[0-9]+$/;
    if (!regex.test(trimmed)) {
      setError("Please enter a valid duration in minutes")
      return
    }

    Keyboard.dismiss()
    const timeInSec = +startTime * 60
    startCountdown(timeInSec)
  }

  function stopTimer() {
    setStartTime()
    stopCountdown()
  }

  function updateTime(text) {
    setError()
    setStartTime(text)
  }

  function preventReturn(e) {
    e.preventDefault();
    Alert.alert(
      'Discard changes?',
      'You have unsaved changes. Are you sure to discard them and leave the screen?',
      [
        { text: "Don't leave", style: 'cancel', onPress: () => { } },
        {
          text: 'Discard', style: 'destructive',
          onPress: () => navigation.dispatch(e.data.action),
        },
      ]
    );
  }

  useEffect(() => {
    if (secondsLeft === 0) {
      return;
    }
    navigation.addListener('beforeRemove', preventReturn)
    return () => navigation.removeListener('beforeRemove', preventReturn)
  }, [navigation, secondsLeft]);

  return (
    <View style={styles.container}>
      <TextInput style={styles.textInput} placeholderTextColor="#999" placeholder='Time in min' keyboardType='number-pad' value={startTime} onChangeText={(text) => updateTime(text)} />
      <Text style={styles.text}>{formatDuration(secondsLeft)}</Text>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {startTime && secondsLeft == 0 && <Button title='Start' onPress={startTimer} />}
      {secondsLeft > 0 && <Button title='Stop' onPress={stopTimer} />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#000",
    marginTop: 16
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    padding: 10,
    color: "#000"
  },
  errorText: {
    marginBottom: 16,
    color: "red"
  }
})