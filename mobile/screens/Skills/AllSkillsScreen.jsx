import { useEffect, useState } from 'react'
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { getAllSkillsAPI, deleteSkillAPI } from '../../api/api'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { COLORS } from '../../constants/styles'
import Icon from 'react-native-vector-icons/Ionicons'
import useAppStore from '../../store/appStore'

export default function AllSkillScreen({ navigation }) {
    const { getToken, USER_ID } = useAppStore()
    const isFocused = useIsFocused()
    const [skills, setSkills] = useState([])

    useEffect(() => {
        isFocused && fetchSkills()
    }, [isFocused])

    async function fetchSkills() {
        const token = getToken()
        if (!token) return navigation.replace('Login')
        const newSkills = (await getAllSkillsAPI(token, USER_ID)).skills
        setSkills([{}, ...newSkills])
    }
    async function deleteSkill(skill) {
        Alert.alert(
            'Delete Skill?',
            `You have invested ${skill.timeInvested.toFixed(2)} hour(s) in this skill.`,
            [
                { text: "Cancel", style: 'cancel', onPress: () => { } },
                {
                    text: 'Confirm Delete', style: 'destructive',
                    onPress: async () => {
                        const token = getToken()
                        if (!token) return navigation.replace('Login')
                        const response = await deleteSkillAPI(skill._id, token)
                        if (response) {
                            fetchSkills()
                        }
                    }
                },
            ]
        );
    }


    return (
        <View style={[styles.container, skills.length == 1 && { alignItems: 'flex-start' }]}>
            <FlatList
                data={skills}
                numColumns={2}
                contentContainerStyle={{ padding: 8, paddingTop: 16 }}
                keyExtractor={(item) => item._id}
                ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
                renderItem={({ item, index }) => index === 0 ?
                    <TouchableOpacity onPress={() => navigation.navigate("CreateNewSkill")} style={[styles.skillBar, styles.addItemBtn, { marginRight: 7 }]}>
                        <Icon name="add" size={70} color="#000" />
                    </TouchableOpacity> :
                    <SkillItem skill={item} index={index} onDelete={() => deleteSkill(item)} />}
            />
        </View>
    )
}

function SkillItem({ skill, index, onDelete }) {
    const navigation = useNavigation()
    const progress = skill.timeInvested / 20 * 100
    const progressStyle = {
        position: 'absolute',
        width: "100%",
        height: progress.toFixed(2),
        backgroundColor: COLORS.green,
        bottom: 0,
    }

    return (
        <TouchableOpacity onPress={() => navigation.navigate('SkillDetailScreen', { skill: skill })} style={[styles.skillBar, index % 2 === 0 ? { marginRight: 7 } : { marginLeft: 7 }]}>
            <View style={progressStyle}></View>
            <View style={{ padding: 8 }}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate('CreateNewSkill', { skill })}>
                        <Icon name="pencil" size={30} color="#000" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onDelete}>
                        <Icon name="trash" size={30} color="#000" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.text}>{skill.name.length > 11 ? `${skill.name.slice(0, 11)}...` : skill.name}</Text>
                <Text style={styles.text}>{skill.goal.length > 11 ? `${skill.goal.slice(0, 11)}...` : skill.goal}</Text>
                <Text style={styles.text}>Time: {skill.timeInvested.toFixed(2)}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    skillBar: {
        borderRadius: 8,
        height: 180,
        width: 180,
        backgroundColor: '#fff',
        position: 'relative',
        elevation: 4,
        overflow: "hidden"
    },
    addItemBtn: {
        justifyContent: "center",
        alignItems: "center"
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: 'space-between',
        marginBottom: 16
    },
    text: {
        color: "black",
        fontSize: 24
    },
})