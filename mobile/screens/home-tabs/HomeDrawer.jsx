import { StyleSheet, View } from 'react-native'
import LeaderBoards from './LeaderBoards';
import Skills from './SkillsStackScreen';
import {
  createDrawerNavigator,
  DrawerItemList,
  DrawerItem,
  DrawerContentScrollView
} from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import useAppStore from '../../store/appStore';
import { COLORS } from '../../constants/styles';

const Drawer = createDrawerNavigator();

export default function Home() {
  return (
    <Drawer.Navigator
    screenOptions={{headerStyle:{backgroundColor:COLORS.blue}, headerTintColor:"#fff"}}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Skills" component={Skills} />
      <Drawer.Screen name="Leaderboards" component={LeaderBoards} />
    </Drawer.Navigator>
  )
}


function CustomDrawerContent(props) {
  const { removeToken } = useAppStore()
  const nav = useNavigation()
  function logout() {
    removeToken()
    nav.navigate('Login')
  }
  return (
    <DrawerContentScrollView contentContainerStyle={{ flex: 1, justifyContent: "space-between" }} {...props}>
      <View>
        <DrawerItemList {...props} />
      </View>
      <DrawerItem label="Log out" style={{ marginBottom: 10 }} onPress={logout} />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({})