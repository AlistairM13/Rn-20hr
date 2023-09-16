import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Login from './screens/auth/Login'
import Signup from './screens/auth/Signup'
import Home from './screens/home-tabs/Home'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import useAppStore from './store/appStore'

const Stack = createNativeStackNavigator()

export default function App() {
  const { getToken } = useAppStore()
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={!!getToken() ? "Home" : "Login"} screenOptions={{ contentStyle: { backgroundColor: '#000' } }}>
        <Stack.Screen name='SignUp' component={Signup} options={{ headerShown: false }} />
        <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
        <Stack.Screen name='Home' component={Home} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({})