import { Alert, Button, Keyboard, StyleSheet, Text, TextInput, View } from 'react-native'
import { useState, useEffect, useLayoutEffect } from 'react'
import { formatDuration } from '../../helpers/helpers'
import { updateSkillAPI } from '../../api/api'
import { COLORS } from '../../constants/styles'
import useAppStore from '../../store/appStore'
import useCountdown from '../../hooks/useCountdown'

export default function SkillDetailsScreen({ navigation, route }) {
  const currentSkill = route.params.skill
  const { setTimeStarted, getSecsLeft, durationInSecs, timeStarted, getToken } = useAppStore()
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
    setTimeStarted(Date.now(), timeInSec)
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
          onPress: () => {
            stopTimer()
            navigation.dispatch(e.data.action)
          }
        },
      ]
    );
  }

  async function saveSession() {
    Alert.alert(
      "Session complete", "",
      [{
        text: "Save session", onPress: async () => {
          const token = getToken()
          if (!token) return navigation.replace('Login')
          const response = await updateSkillAPI(currentSkill._id, token, currentSkill.name, currentSkill.goal, durationInSecs / 3600)
          if (response != null) {
            navigation.pop()
          }
        }
      }]
    )
  }

  useLayoutEffect(() => {
    navigation.setOptions({ title: currentSkill.name })
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
      if (timeStarted && durationInSecs && Date.now() > (timeStarted + durationInSecs * 1000)) {
        saveSession()
      }
      setTimeStarted(null, null)
      return;
    }
    navigation.addListener('beforeRemove', preventReturn)
    return () => navigation.removeListener('beforeRemove', preventReturn)
  }, [navigation, secondsLeft]);

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ alignSelf: 'center', fontSize:20, marginTop: 16, color:'black' }}>Goal: {currentSkill.goal}</Text>
      <View style={styles.innerContainer}>
        <Text style={styles.secondsLeft}>{formatDuration(secondsLeft)}</Text>
        {secondsLeft === 0 && <TextInput style={styles.textInput} placeholderTextColor="#999" placeholder='Time in min' keyboardType='number-pad' value={startTime} onChangeText={(text) => updateTime(text)} />}
        {error && <Text style={styles.errorText}>{error}</Text>}
        {startTime && secondsLeft == 0 && <Button title='Start' onPress={startTimer} />}
        {secondsLeft > 0 && <Button title='Stop' onPress={stopTimer} />}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  secondsLeft: {
    color: "#000",
    marginBottom: 16,
    fontSize: 24,
    fontWeight: "900"
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    padding: 10,
    color: "#000",
    marginBottom: 16
  },
  errorText: {
    marginBottom: 16,
    color: COLORS.red
  }
})