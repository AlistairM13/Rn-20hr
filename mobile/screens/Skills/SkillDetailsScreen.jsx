import { Button, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import useCountdown from '../../hooks/useCountdown'

export default function SkillDetailsScreen() {
  const { secondsLeft, start } = useCountdown()
  const [startTime, setStartTime] = useState(0)
  function startTimer() {
    console.log(startTime)

  }
  return (
    <View style={styles.container}>
      <TextInput placeholder='Time in min' keyboardType='number-pad' value={startTime} onChangeText={setStartTime} />
      <Text style={styles.text}>{secondsLeft}</Text>
      <Button title='Start' onPress={startTimer} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    color: "#000"
  }
})