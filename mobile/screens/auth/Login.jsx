import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View } from 'react-native'
import { useState } from 'react'
import { z } from 'zod'
import { loginUser } from '../../api/api'
import useAppStore from '../../store/appStore'
import { COLORS } from '../../constants/styles'

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Minimum of 6 characters required").max(15, "Maximum of 15 characters allowed"),
})

export default function Login({ navigation }) {
  const { setToken } = useAppStore()
  const [errors, setErrors] = useState({})


  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [isLoading, setIsLoading] = useState()
  function updateForm(fieldName, text) {
    setErrors(prev => ({ ...prev, [fieldName]: '' }))
    setLoginData(prev => ({ ...prev, [fieldName]: text }))
  }

  const login = async () => {
    try {
      setIsLoading(true)
      loginSchema.parse(loginData)
      const loginResponse = await loginUser({ ...loginData })
      const token = "Bearer " + loginResponse.token
      setIsLoading(false)
      setToken(token)
      navigation.replace('Home')
    } catch (err) {
      if (err.formErrors) {
        const fieldErrors = {};
        const errors = err.formErrors.fieldErrors
        for (let err in errors) {
          fieldErrors[err] = errors[err][0]
        }
        setErrors(fieldErrors);
      } else {
        console.error("error logging in ", err);
      }
    }
  }
  return (
    <View style={styles.container}>

      <TextInput placeholderTextColor={'#999'} style={styles.textInput} placeholder="Enter your email" value={loginData.email} onChangeText={text => updateForm("email", text)} />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      <TextInput placeholderTextColor={'#999'} style={styles.textInput} placeholder="Enter your password" value={loginData.password} onChangeText={text => updateForm("password", text)} />
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
      <Text style={{ paddingVertical: 16, color: 'black' }} onPress={() => navigation.replace('SignUp')}>Don't have an account? <Text style={{ fontSize: 16, fontWeight: "600" }}>Signup!</Text></Text>
      {!isLoading && <Button title='login' onPress={login} />}
      {isLoading && <ActivityIndicator size="large" color={COLORS.blue} />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 8,
    backgroundColor: COLORS.bgGray
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    color: 'black'
  },
  errorText: {
    color: COLORS.red
  }
})