import { Link, useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaViewBase } from 'react-native';
import { StatusBar } from 'react-native';
import { Pressable } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { Image } from 'react-native';
import { Dimensions } from 'react-native';
import { Platform } from 'react-native';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native';
import { Text, StyleSheet } from 'react-native';
import { useAuth } from '../AuthContext';

const { height } = Dimensions.get('window');

const Menues = () => {

    const router = useRouter()
    const { user } = useAuth()

    return (
        <View style={styles.mainMenues}>
            <View style={styles.mainMenuesData}>
                <View style={styles.heading}>
                    <Text style={styles.mainHeading}>
                        Carton Portal
                    </Text>
                </View>
                <SafeAreaView style={styles.mainContainer}>
                    <View style={styles.mainScreen}>
                    </View>
                    {/* <TouchableOpacity style={styles.registerButton} onPress={() => router.push("/register")}>
                        <Text style={styles.registerButtonText}>Sign up</Text>
                    </TouchableOpacity> */}
                    <View style={styles.screensMenues}>
                        <TouchableOpacity style={styles.boxes} onPress={() => router.push({
                            pathname: "/(tabs)/packagingLists",
                            params: { id: 2 },
                        })}>
                                <Image
                                    source={require('../assets/favicon.png')}
                                    style={styles.image}
                                />
                                <Text style={styles.boxesText}>Packaging Lists</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainMenues: {
        flex: 1,
        paddingTop: 10,
        paddingBottom: 10,
        paddingHorizontal: '5%',
        // backgroundColor: "#F4FFFB",
        // backgroundColor: "#F4FFFB",
    },
    mainMenuesData: {

    },
    heading: {
        paddingBottom: 13,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30
    },
    mainHeading: {
        fontSize: 22,
        fontWeight: '800',
        textAlign: 'center',
        color: "#2C779F",
        paddingTop: 10,
    },
    screensMenues: {
        marginTop: 20,
        flexDirection: "row",
        paddingHorizontal: "5%",
        justifyContent: "center",
        margin: "auto",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 15,
        justifyContent: "space-between"
    },
    boxes: {
        flexDirection: "column",
        alignItems: "center",
        // justifyContent: "center",
        gap: 5
    },
    image: {
    },
    boxesText: {
        color: '#2C779F',
        fontWeight: "600",
        shadowColor: '#52006A',
        elevation: 20,
    },
})

export default Menues;
