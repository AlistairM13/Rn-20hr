import { StyleSheet, View } from 'react-native'
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
import LeaderBoardTabScreen from './LeaderBoardTabsScreen';

const Drawer = createDrawerNavigator();

export default function Home() {
  return (
    <Drawer.Navigator
      screenOptions={{ sceneContainerStyle: { backgroundColor: COLORS.bgGray }, headerStyle: { backgroundColor: COLORS.blue }, headerTintColor: "#fff" }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Skills" component={Skills} />
      <Drawer.Screen name="Leaderboards" component={LeaderBoardTabScreen} />
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