import { StyleSheet } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LeaderBoards from './LeaderBoardsTab';
import Icon from 'react-native-vector-icons/Ionicons';
import Skills from './SkillsTab';

const Tab = createBottomTabNavigator();

export default function Home({ navigation }) {

  return (

    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#120E43',
      }}
    >
      <Tab.Screen
        name='Skills'
        component={Skills}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Icon name={focused ? "home" : "home-outline"} color={color} size={size} />
          )
        }}
      />
      <Tab.Screen
        name='Leaderboards'
        component={LeaderBoards}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Icon name={focused ? 'people' : "people-outline"} color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>

  )
}

const styles = StyleSheet.create({})