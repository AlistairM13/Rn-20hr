import { StyleSheet, View, Text } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'

import LeaderBoards from './LeaderBoardsTab';
import Icon from 'react-native-vector-icons/Ionicons';
import Skills from './SkillsTab';
import {
  createDrawerNavigator,
  DrawerItemList,
  DrawerItem,
  DrawerContentScrollView
} from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

export default function Home() {

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Skills" component={Skills} />
      <Drawer.Screen name="Leaderboards" component={LeaderBoards} />
    </Drawer.Navigator>
  )
}


function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView contentContainerStyle={{flex:1, justifyContent:"space-between"}} {...props}>
      <View>
      <DrawerItemList {...props} />
      </View>
      <DrawerItem label="Dark Mode" style={{marginBottom:10}} onPress={() => alert('Link to help')} />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({})