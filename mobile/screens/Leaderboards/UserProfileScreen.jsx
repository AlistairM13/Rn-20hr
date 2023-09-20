import { FlatList, StyleSheet, Text, View } from 'react-native'
import { useEffect, useState } from 'react'
import useAppStore from '../../store/appStore'
import { fetchUserDetailsAPI } from '../../api/api'
import { COLORS } from '../../constants/styles'


export default function UserProfileScreen({ navigation, route }) {
    const user = route.params.user
    const { getToken } = useAppStore()
    const [userSkills, setUserSkills] = useState([])
    useEffect(() => {
        fetchUserDetails()
    }, [])

    async function fetchUserDetails() {
        try {
            const token = getToken()
            if (!token) return navigation.replace('Login')
            const response = await fetchUserDetailsAPI(user.id, token)
            setUserSkills(response.user.skills)
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <View style={styles.container}>
            <View style={{padding:16}}>
            <Text style={styles.text}>{user.name}</Text>
            <Text style={styles.text}>{user.skillCount}</Text>
            <Text style={styles.text}>{user.totalTimeInvested.toFixed(2)}</Text>
            </View>
            <FlatList
                contentContainerStyle={{ padding: 8, paddingTop: 16 }}
                ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
                numColumns={2}
                data={userSkills}
                renderItem={({ item, index }) => <SkillItem skill={item} index={index} /> }
            />
        </View>
    )
}

function SkillItem({ skill, index }) {
    const progress = skill.timeInvested / 20 * 100
    const progressStyle = {
        position: 'absolute',
        width: "100%",
        height: progress.toFixed(2),
        backgroundColor: COLORS.green,
        bottom: 0,
    }

    return (
        <View style={[styles.skillBar, index % 2 === 0 ? { marginRight: 7 } : { marginLeft: 7 }]}>
            <View style={progressStyle}></View>
            <View style={{ padding: 8 }}>
                <Text style={styles.text}>{skill.name}</Text>
                <Text style={styles.text}>{skill.goal}</Text>
                <Text style={styles.text}>Time: {skill.timeInvested.toFixed(2)}</Text>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 16
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
    text: {
        color: "black",
        fontSize: 24
    },
})