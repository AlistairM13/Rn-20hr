import { StatusBar, StyleSheet } from 'react-native'
import { COLORS } from './constants/styles'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import Login from './screens/auth/Login'
import Signup from './screens/auth/Signup'
import Home from './screens/home-tabs/HomeDrawer'
import useAppStore from './store/appStore'
import Toast from 'react-native-toast-message'

const Stack = createNativeStackNavigator()

export default function App() {
  const { getToken } = useAppStore()
  return (
    <>
    <StatusBar backgroundColor={COLORS.blue}/>
    <NavigationContainer>
      <Stack.Navigator initialRouteName={!!getToken() ? "Home" : "Login"} screenOptions={{ contentStyle: { backgroundColor: '#000' } }}>
        <Stack.Screen name='SignUp' component={Signup} options={{ headerShown: false }} />
        <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
        <Stack.Screen name='Home' component={Home} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
    <Toast />
    </>
  )
}

const styles = StyleSheet.create({})