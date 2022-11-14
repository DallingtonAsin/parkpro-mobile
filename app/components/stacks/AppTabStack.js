import React from 'react';
import { BottomTabBar, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MultiBarProvider, BottomTabBarWrapper} from 'react-native-multibar';
import Icon from 'react-native-vector-icons/FontAwesome5';
import HomeStack from './HomeStack';
import HelpStack from './ContactUsStack';
import WeatherStack from './WeatherStack';
import NotificationStack from './NotificationStack';
import ZoomStack from './ZoomStack';
import { useTheme  } from 'react-native-paper';
import styles from '../../../assets/css/styles';

const BottomTab = createBottomTabNavigator();
const tabIconFontSize = 18;


const AppTabStack = () => {
    
    const { colors } = useTheme();
    
    return (
        
        <MultiBarProvider
        overlayProps={{
            expandingMode: 'staging'
        }}
        data={[
            ({ params }) => (
                <Icon
                name="chevron-left"
                color="#E24E1B"
                size={12}
                onPress={() => {
                    if (params.canGoBack()) {
                        params.goBack();
                    }
                }}
                />
                ),
                ({ params }) => (
                    <Icon
                    name="flag"
                    color="#E24E1B"
                    size={12}
                    onPress={() => {
                    }}
                    />
                    ),
                    ({ params }) => (
                        <Icon
                        name="headphones"
                        color="#E24E1B"
                        size={12}
                        onPress={() => {
                        }}
                        />
                        ),
                        ({ params }) => (
                            <Icon
                            name="heart"
                            color="#E24E1B"
                            size={14}
                            onPress={() => {
                            }}
                            />
                            ),
                        ]}
                        initialExtrasVisible={false}
                        >
                        <BottomTab.Navigator
                        tabBar={(props) => (
                            <BottomTabBarWrapper params={props.navigation}>
                            <BottomTabBar {...props} />
                            </BottomTabBarWrapper>
                            )}
                            tabBarOptions ={{
                                activeTintColor: colors.activeTabColor,
                                inactiveTintColor: styles.colors.black,
                                style: {
                                    backgroundColor: styles.colors.white,
                                },
                                labelStyle:{
                                    fontSize: 14,
                                    textAlign:'center',
                                },
                                labelPosition:'below-icon',
                            }}
                            >
                            <BottomTab.Screen
                            name="Home"
                            component={HomeStack}
                            options={{
                                tabBarIcon: ({ color, size }) => (
                                    <Icon
                                    name="home"
                                    style={{
                                        fontSize: tabIconFontSize,
                                        color: color
                                    }}
                                    />
                                    )
                                }}
                                />
                                
                                <BottomTab.Screen
                                name="Notifications"
                                component={NotificationStack}
                                options={{
                                    tabBarIcon: ({ color, size }) => (
                                        <Icon
                                        name="bell"
                                        style={{
                                            fontSize: tabIconFontSize,
                                            color: color
                                        }}
                                        />
                                        )
                                    }}
                                    />
                                    
                                    <BottomTab.Screen
                                    name="Weather"
                                    component={WeatherStack}
                                    options={{
                                        tabBarIcon: ({ color, size }) => (
                                            <Icon
                                            name="cloud-rain"
                                            style={{
                                                fontSize: tabIconFontSize,
                                                color: color
                                            }}
                                            />
                                            )
                                        }}
                                        />
                                        
                                        
                                        <BottomTab.Screen
                                        name="Help"
                                        component={HelpStack}
                                        options={{
                                            tabBarIcon: ({ color, size }) => (
                                                <Icon
                                                name="question-circle"
                                                style={{
                                                    fontSize: tabIconFontSize,
                                                    color: color
                                                }}
                                                />
                                                )
                                            }}
                                            />
                                            
                                            <BottomTab.Screen
                                            name="Meeting"
                                            component={ZoomStack}
                                            options={{
                                                tabBarIcon: ({ color, size }) => (
                                                    <Icon
                                                    name="video"
                                                    style={{
                                                        fontSize: tabIconFontSize,
                                                        color: color
                                                    }}
                                                    />
                                                    )
                                                }}
                                                />
                                                
                                                
                                                
                                                </BottomTab.Navigator>
                                                </MultiBarProvider>
                                                );
                                            }
                                            export default AppTabStack