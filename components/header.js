import React from 'react';
import { SafeAreaViewBase } from 'react-native';
import { StatusBar } from 'react-native';
import { Dimensions } from 'react-native';
import { Platform } from 'react-native';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native';
import { Text, StyleSheet } from 'react-native';

const { height } = Dimensions.get('window');

const Header = () => {

    return (
        <View>
            <View style={styles.heading}>
                <Text style={styles.mainHeading}>
                    Logi Tech
                </Text>
            </View>
            <SafeAreaView style={styles.mainContainer}>
                <View style={styles.mainScreen}>
                </View>
                <View style={styles.screensMenues}>

                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        // minHeight: height,
    },
    mainScreen: {
        paddingVertical: 10,
        paddingHorizontal: '5%',
    },
    heading: {
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        paddingBottom: 13,
        backgroundColor: "#2C779F",
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30
    },
    mainHeading: {
        fontSize: 22,
        fontWeight: '800',
        textAlign: 'center',
        color: "white",
        paddingTop: 10,
    },
    screensMenues: {

    }
})

export default Header;
