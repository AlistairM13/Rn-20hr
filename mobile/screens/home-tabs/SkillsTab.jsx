import { FlatList, StyleSheet, Modal, Text, TouchableOpacity, View, Pressable, TextInput, Button } from 'react-native'

import Icon from 'react-native-vector-icons/Ionicons'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import CreateNewSkill from '../Skills/CreateNewSkillModal'
import SkillDetailsScreen from '../Skills/SkillDetailsScreen'
const Stack = createNativeStackNavigator()

export default function Skills({ navigation }) {

  return(
      <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name='AllSkills' component={AllSkillScreen} />
        <Stack.Screen name='SkillDetailScreen' component={SkillDetailsScreen} />
        <Stack.Screen name='CreateNewSkill' component={CreateNewSkill}  options={{presentation:"containedTransparentModal"}}/>
      </Stack.Navigator>
  )

}

const dum = [
  { id: "1", name: "abc" },
  { id: "2", name: "xyz" },
  { id: "3", name: "xyz" },
  { id: "4", name: "xyz" },
]
dum.unshift({})

function AllSkillScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <FlatList
        data={dum}
        numColumns={2}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        renderItem={({ item, index }) => index === 0 ?
          <TouchableOpacity onPress={()=>navigation.navigate("CreateNewSkill")} style={[styles.skillBar, styles.addItemBtn, { marginRight: 10 }]}>
            <Icon name="add" size={30} color="#000" />
          </TouchableOpacity> :
          <TouchableOpacity style={[styles.skillBar, index % 2 === 0 ? { marginRight: 10 } : { marginLeft: 10 }]}>
            <Text style={styles.text}>{item.name}</Text>
          </TouchableOpacity>}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 8
  },
  skillBar: {
    borderRadius: 4,
    height: 180,
    width: 180,
    backgroundColor: '#ccc',
    position: 'relative'
  },
  text: {
    color: "black",
    fontSize: 24
  },

})