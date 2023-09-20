import { createNativeStackNavigator } from '@react-navigation/native-stack'
import CreateNewSkill from '../Skills/CreateNewSkillModal'
import SkillDetailsScreen from '../Skills/SkillDetailsScreen'
import AllSkillScreen from '../Skills/AllSkillsScreen'
import { useEffect } from 'react'
import { COLORS } from '../../constants/styles'

const Stack = createNativeStackNavigator()

export default function Skills({ navigation }) {
  return (
    <Stack.Navigator
      screenListeners={{
        state: (e) => {
          if (e.data.state.index === 0) {
            navigation.setOptions({ headerShown: true })
          } else {
            navigation.setOptions({ headerShown: false })
          }
        }
      }}
      screenOptions={{ headerShown: false, headerStyle: { backgroundColor: COLORS.blue }, headerTintColor: "#fff", contentStyle: { backgroundColor: COLORS.bgGray } }}>
      <Stack.Screen name='AllSkills' component={AllSkillScreen} />
      <Stack.Screen name='SkillDetailScreen' component={SkillDetailsScreen} options={{ headerShown: true }} />
      <Stack.Screen name='CreateNewSkill' component={CreateNewSkill} options={{ presentation: "transparentModal", animation: 'slide_from_bottom', contentStyle: { backgroundColor: "transparent" } }} />
    </Stack.Navigator>
  )
}