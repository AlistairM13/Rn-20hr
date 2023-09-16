import { Button, StyleSheet, Text, TextInput, View } from 'react-native'
import { useState } from 'react'
import { z } from 'zod'
import { signupUser } from '../../api/api'
import useAppStore from '../../store/appStore'

export default function Signup({ navigation }) {
  const { setToken } = useAppStore()
  const [errors, setErrors] = useState({})
  const signupSchema = z.object({
    name: z.string().nonempty("Please enter a name").max(15, "Maximum of 15 characters allowed"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Minimum of 6 characters required").max(15, "Maximum of 15 characters allowed"),
  })

  const [signupData, setSignupData] = useState({ name: '', email: '', password: '' })

  function updateForm(fieldName, text) {
    setErrors(prev => ({ ...prev, [fieldName]: '' }))
    setSignupData(prev => ({ ...prev, [fieldName]: text }))
  }

  const signup = async () => {
    try {
      signupSchema.parse(signupData)
      const signupResponse = await signupUser({ ...signupData })
      setToken(signupResponse.token)
      navigation.replace('Home')
    } catch (err) {
      if (z.instanceof(err)) {
        const fieldErrors = {};
        const errors = err.formErrors.fieldErrors
        for (let err in errors) {
          fieldErrors[err] = errors[err][0]
        }
        setErrors(fieldErrors);
      } else {
        console.error("error signing up ", err);
      }
    }
  }
  return (
    <View style={{ padding: 8 }}>
      <TextInput style={styles.textInput} placeholder="Enter your name" value={signupData.name} onChangeText={text => updateForm("name", text)} />
      {errors.name && <Text>{errors.name}</Text>}
      <TextInput style={styles.textInput} placeholder="Enter your email" value={signupData.email} onChangeText={text => updateForm("email", text)} />
      {errors.email && <Text>{errors.email}</Text>}
      <TextInput style={styles.textInput} placeholder="Enter your password" value={signupData.password} onChangeText={text => updateForm("password", text)} />
      {errors.password && <Text>{errors.password}</Text>}
      <Text style={{ paddingVertical: 16 }} onPress={() => navigation.replace('Login')}>Already have an account? <Text style={{ fontSize: 16, fontWeight: "600" }}>Login!</Text></Text>
      <Button title='Signup' onPress={signup} />
    </View>
  )
}

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginTop: 10
  }
})