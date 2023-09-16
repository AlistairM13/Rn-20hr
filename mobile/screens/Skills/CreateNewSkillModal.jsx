import { Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useState } from 'react'
import { z } from 'zod'

const skillSchema = z.object({
    name: z.string().nonempty().max(15, "Maximum of 15 characters allowed"),
    goal: z.string().nonempty("What do you wish to finish by 20 hours").max(30, "Maximum of 30 characters allowed"),
})


export default function CreateNewSkillScreen({ navigation }) {
    const [skillInfo, setSkillInfo] = useState({ name: "", goal: "" })
    const [errors, setErrors] = useState({})
    function updateSkillInfo(fieldName, text) {
        setSkillInfo(prev => ({ ...prev, [fieldName]: text }))
    }
    function createSkill() {
        try {
            skillSchema.parse(skillInfo)
            navigation.navigate("SkillDetailScreen")
        } catch (err) {
            if (err.formErrors) {
                const fieldErrors = {};
                const errors = err.formErrors.fieldErrors
                for (let err in errors) {
                    fieldErrors[err] = errors[err][0]
                }
                setErrors(fieldErrors);
            } else {
                console.error("error logging in ", err);
            }
        }
    }
    return (
        <View style={styles.modalContent} >
            <Pressable onPress={navigation.goBack} style={{ position: 'absolute', height: "100%", width: "100%", backgroundColor: "rgba(0,0,0,0.8)" }} />
            <TextInput style={styles.textInput} placeholder="Name of the skill" value={skillInfo.name} onChangeText={text => updateSkillInfo("name", text)} />
            {errors.name && <Text>{errors.name}</Text>}
            <TextInput style={styles.textInput} placeholder="Enter your goal" value={skillInfo.goal} onChangeText={text => updateSkillInfo("goal", text)} />
            {errors.goal && <Text>{errors.goal}</Text>}
            <TouchableOpacity style={styles.button} onPress={createSkill}>
                <Text>Create Skill</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    modalContent: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    textInput: {
        width: "70%",
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginTop: 16,
        marginBottom: 4
    },
    button: {
        width: "70%",
        alignItems: "center",
        paddingVertical: 8,
        backgroundColor: "#ccc",
        borderRadius: 8,
        marginTop: 16
    }

})

