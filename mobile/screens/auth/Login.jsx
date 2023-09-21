import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View } from 'react-native'
import { useRef, useState } from 'react'
import { z } from 'zod'
import { loginUser } from '../../api/api'
import { COLORS } from '../../constants/styles'
import { showToast } from '../../helpers/helpers'
import useAppStore from '../../store/appStore'

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Minimum of 6 characters required").max(15, "Maximum of 15 characters allowed"),
})

export default function Login({ navigation }) {
  const { setToken } = useAppStore()
  const [errors, setErrors] = useState({})
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [isLoading, setIsLoading] = useState()

  const passwordRef = useRef()
  const loginBtnRef = useRef()

  function updateForm(fieldName, text) {
    setErrors(prev => ({ ...prev, [fieldName]: '' }))
    setLoginData(prev => ({ ...prev, [fieldName]: text }))
  }

  const login = async () => {
    try {
      loginSchema.parse(loginData)
      setIsLoading(true)
      const loginResponse = await loginUser({ ...loginData })
      if (!loginResponse) throw new Error("error")
      const token = "Bearer " + loginResponse.token
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
        showToast("error", 'Error', "Could not login")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        autoCapitalize='none'
        placeholder="Enter your email"
        placeholderTextColor='#999'
        returnKeyType='next'
        blurOnSubmit={false}
        onSubmitEditing={() => passwordRef.current.focus()}
        value={loginData.email}
        onChangeText={text => updateForm("email", text)}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      <TextInput
        ref={passwordRef}
        autoCapitalize='none'
        placeholder="Enter your password"
        placeholderTextColor='#999'
        style={styles.textInput}
        returnKeyType='done'
        blurOnSubmit={true}
        onSubmitEditing={() => loginBtnRef.current.props.onPress()}
        value={loginData.password}
        onChangeText={text => updateForm("password", text)}
      />
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
      <Text
        style={{ paddingVertical: 16, color: 'black' }}
        onPress={() => navigation.replace('SignUp')}
      >Don't have an account?
        <Text style={{ fontSize: 16, fontWeight: "600", color: COLORS.blue }}> Signup!</Text>
      </Text>
      {!isLoading && <Button ref={loginBtnRef} title='login' onPress={login} />}
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