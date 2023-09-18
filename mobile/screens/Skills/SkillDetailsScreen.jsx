import { Alert, Button, Keyboard, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import useCountdown from '../../hooks/useCountdown'
import { formatDuration } from '../../helpers/helpers'
import useAppStore from '../../store/appStore'

export default function SkillDetailsScreen({ navigation }) {
  const { setTimeStarted, getSecsLeft, durationInSecs, timeStarted } = useAppStore()
  const { secondsLeft, startCountdown, stopCountdown } = useCountdown()
  const [startTime, setStartTime] = useState()
  const [error, setError] = useState()
  const [congrats, setCongrats] = useState(false)

  function startTimer() {
    const trimmed = startTime.trim()
    const regex = /^[0-9]+$/;
    if (!regex.test(trimmed)) {
      setError("Please enter a valid duration in minutes")
      return
    }
    Keyboard.dismiss()
    const timeInSec = +startTime * 60
    setTimeStarted(Date.now(), timeInSec)
    startCountdown(timeInSec)
  }

  function stopTimer() {
    setStartTime()
    stopCountdown()
  }

  function updateTime(text) {
    setError()
    setCongrats(false)
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

  function saveSession() {
    console.log("save")
  }

  useEffect(() => {
    const secondsLeft = getSecsLeft()
    if (secondsLeft <= 0) {
      setTimeStarted(null, null)
      return
    }
    setTimeStarted(timeStarted, durationInSecs)
    setStartTime("" + parseInt(durationInSecs / 60))
    startCountdown(secondsLeft)
  }, [])

  useEffect(() => {
    if (secondsLeft === 0) {
      setCongrats(true)
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
      {congrats && <Text style={{ color: "black" }}>Congrats!</Text>}
      {congrats && <Button title='Save session' onPress={saveSession} />}
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