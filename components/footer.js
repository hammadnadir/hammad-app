import React from 'react';
import { SafeAreaViewBase } from 'react-native';
import { StatusBar } from 'react-native';
import { Image } from 'react-native';
import { Dimensions } from 'react-native';
import { Platform } from 'react-native';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native';
import { Text, StyleSheet } from 'react-native';

const { height } = Dimensions.get('window');

const Footer = () => {

    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={styles.mainScreen}>
                <View style={styles.innerMainScreen}>
                    <Image
                        source={require('../assets/favicon.png')}
                        style={styles.image}
                    />
                    <Image
                        source={require('../assets/favicon.png')}
                        style={styles.image}
                    />
                    <Image
                        source={require('../assets/favicon.png')}
                        style={styles.image}
                    />
                    <Image
                        source={require('../assets/favicon.png')}
                        style={styles.image}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingVertical: 20,
    },
    mainScreen: {
        width: "100%",
    },
    innerMainScreen: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: '5%',
        flexDirection: "row",
        borderColor: "#3D92BF",
        borderWidth: 1,
        gap: 20,
        marginBottom: -20
    },
    image: {
        width: 30,
        height: 30
    }
})

export default Footer;
