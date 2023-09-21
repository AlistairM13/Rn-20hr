import { Button, FlatList, StyleSheet, Text, View } from 'react-native'
import { useLayoutEffect, useState } from 'react'
import { fetchUserDetailsAPI, followUserAPI, unFollowUserAPI } from '../../api/api'
import { COLORS } from '../../constants/styles'
import { showToast } from '../../helpers/helpers'
import useAppStore from '../../store/appStore'

export default function UserProfileScreen({ navigation, route }) {
    const user = route.params.user
    const { getToken, USER_ID } = useAppStore()
    const [userSkills, setUserSkills] = useState([])
    const [token, setToken] = useState()
    const [isFollowed, setIsFollowed] = useState(false)

    useLayoutEffect(() => {
        const token = getToken()
        if (!token) return navigation.replace('Login')
        setToken(token)
        fetchUserDetails()
    }, [])

    function alreadyFollowed(followers) {
        if (followers.includes(USER_ID)) {
            setIsFollowed(true)
        } else {
            setIsFollowed(false)
        }
    }

    async function fetchUserDetails() {
        try {
            const response = await fetchUserDetailsAPI(user.id, token)
            setUserSkills(response.user.skills)
            alreadyFollowed(response.user.followers)
        } catch (err) {
            showToast("error", 'Error', "Could not fetch player details")
        }
    }

    async function follow() {
        try {
            await followUserAPI(user.id, token)
            await fetchUserDetails()
        } catch (err) {
            showToast("error", 'Error', "Could not follow player")
        }
    }

    async function unFollow() {
        try {
            await unFollowUserAPI(user.id, token)
            await fetchUserDetails()
        } catch (err) {
            showToast("error", 'Error', "Could not unfollow player")
        }
    }

    return (
        <View style={styles.container}>
            <View style={{ padding: 16 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text style={styles.text}>{user.name}</Text>
                    {!isFollowed && <Button onPress={follow} title='Follow' color="#3272DB" />}
                    {isFollowed && <Button onPress={unFollow} title='Unfollow' color="#ccc" />}
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.text}>Skills: {user.skillCount}</Text>
                    <Text style={styles.text}>Total Time:{user.totalTimeInvested.toFixed(2)} hour(s)</Text>
                </View>
            </View>
            <FlatList
                contentContainerStyle={{ padding: 8, paddingTop: 16 }}
                ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
                numColumns={2}
                data={userSkills}
                renderItem={({ item, index }) => <SkillItem skill={item} index={index} />}
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
                <Text style={styles.text}>{skill.name.length > 11 ? `${skill.name.slice(0, 11)}...` : skill.name}</Text>
                <Text style={styles.text}>{skill.goal.length > 11 ? `${skill.goal.slice(0, 11)}...` : skill.goal}</Text>
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