import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View } from 'react-native'
import { useRef, useState } from 'react'
import { z } from 'zod'
import { signupUser } from '../../api/api'
import { COLORS } from '../../constants/styles'
import { showToast } from '../../helpers/helpers'
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
  const [isLoading, setIsLoading] = useState(false)

  const emailRef = useRef()
  const passwordRef = useRef()
  const signUpBtnRef = useRef()

  function updateForm(fieldName, text) {
    setErrors(prev => ({ ...prev, [fieldName]: '' }))
    setSignupData(prev => ({ ...prev, [fieldName]: text }))
  }

  const signup = async () => {
    try {
      signupSchema.parse(signupData)
      setIsLoading(true)
      const signupResponse = await signupUser({ ...signupData })
      const token = "Bearer " + signupResponse.token
      setToken(token)
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
        showToast("error", 'Error', "Could not signup")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        autoCapitalize='none'
        placeholderTextColor='#999'
        style={styles.textInput}
        placeholder="Enter your name"
        returnKeyType='next'
        blurOnSubmit={false}
        onSubmitEditing={() => emailRef.current.focus()}
        value={signupData.name}
        onChangeText={text => updateForm("name", text)}
      />
      {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
      <TextInput
        ref={emailRef}
        autoCapitalize='none'
        placeholderTextColor='#999'
        style={styles.textInput}
        placeholder="Enter your email"
        returnKeyType='next'
        blurOnSubmit={false}
        onSubmitEditing={() => passwordRef.current.focus()}
        value={signupData.email}
        onChangeText={text => updateForm("email", text)}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      <TextInput
        autoCapitalize='none'
        placeholderTextColor='#999'
        style={styles.textInput}
        placeholder="Enter your password"
        returnKeyType='done'
        blurOnSubmit={true}
        onSubmitEditing={() => signUpBtnRef.current.press()}
        value={signupData.password}
        onChangeText={text => updateForm("password", text)}
      />
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
      <Text
        style={{ paddingVertical: 16, color: 'black' }}
        onPress={() => navigation.replace('Login')}
      >Already have an account?
        <Text style={{ fontSize: 16, fontWeight: "600", color: COLORS.blue }}> Login!</Text>
      </Text>
      {!isLoading && <Button title='Signup' onPress={signup} />}
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