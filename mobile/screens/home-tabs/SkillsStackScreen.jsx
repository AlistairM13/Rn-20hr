import { createNativeStackNavigator } from '@react-navigation/native-stack'
import CreateNewSkill from '../Skills/CreateNewSkillModal'
import SkillDetailsScreen from '../Skills/SkillDetailsScreen'
import AllSkillScreen from '../Skills/AllSkillsScreen'

const Stack = createNativeStackNavigator()

export default function Skills({ navigation }) {
  return(
      <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name='AllSkills' component={AllSkillScreen} />
        <Stack.Screen name='SkillDetailScreen' component={SkillDetailsScreen} />
        <Stack.Screen name='CreateNewSkill' component={CreateNewSkill}  options={{presentation:"transparentModal",animation:'slide_from_bottom'}}/>
      </Stack.Navigator>
  )
}