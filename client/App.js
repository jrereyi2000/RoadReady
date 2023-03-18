/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, { useState, useReducer } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TabView from './src/components/Protected/TabView';
import AppContext from './src/AppContext';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { getStyle } from './src/css/Styles';
import { StatusBar, Dimensions } from 'react-native';
import * as Keychain from 'react-native-keychain';
import { MMKV } from 'react-native-mmkv';
import * as splashScreen from 'react-native-splash-screen';
import {
  HomeScreen,
  LogEntryScreen,
  LogScreen,
  ProfileScreen,
  SplashScreen,
} from './src/screens';
import { LogBox } from 'react-native';
import images from './res/images';
import { PhoneNumberScreen } from './src/screens/Login/PhoneNumberScreen';
import { CodeScreen } from './src/screens/Login/CodeScreen';
import { NameScreen } from './src/screens/Login/NameScreen';
import { LOGFIELDS, reducer } from './src/utils';

// Amplify.configure(awsconfig);

const Stack = createStackNavigator();
const Log = createStackNavigator();
const LoginStack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

const checkIfFirstLaunch = () => {
  try {
    const hasLaunched = MMKV.getString('HAS_LAUNCHED');
    // console.log(hasLaunched);
    if (hasLaunched === undefined) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

const App = () => {
  const [user, set_user] = useState({});
  const [loading, set_loading] = useState(true);
  const [token, set_token] = useState(false);
  const [log, set_log] = useState(undefined);

  const toggle_launch = () => MMKV.set('HAS_LAUNCHED', 'true');
  LogBox.ignoreLogs(['[react-native-gesture-handler] Seems like you\'re using an old API with gesture components, check out new Gestures system!']);

  const clear_state = () => {
    set_loading(false);
    set_token(false);
    set_user({});
    set_log(undefined);
  };

  const state = {
    loading,
    token,
    user,
    log,
    set_log,
    clear_state,
    set_loading,
    set_token,
    set_user,
    toggle_launch,
  };

  React.useEffect(() => {
    splashScreen.default.hide();
  }, []);

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      const async_state = await Keychain.getGenericPassword();

      if (async_state) {
        const session = JSON.parse(async_state.password);
        set_user(session);
        set_token(true);
      }
      // After restoring token, we may need to validate it in production apps
      set_loading(false);
      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
    };
    bootstrapAsync();
  }, []);

  React.useEffect(() => {
    if (token) {
      Keychain.setGenericPassword(
          'session',
          JSON.stringify({ ...user, token: token }),
      );
    }
  }, [user]);

  const firstLaunch = checkIfFirstLaunch();
  return (
    <AppContext.Provider value={state}>
      <StatusBar backgroundColor="blue" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {state.loading ? (
             <Stack.Screen
               name="Splash"
               component={SplashScreen}
               options={{ animationEnabled: false }}
             />
           ) : state.token ? (
             <>
               <Stack.Screen
                 name="Protected"
                 options={{ animationEnabled: false }}
               >
                 {(props) => <ProtectedScreen {...props} globalState={state} />}
               </Stack.Screen>
               <Stack.Screen
                 name="Home"
                 options={{ gestureEnabled: false }}
                 component={HomeScreen}
               />
               <Stack.Screen name="Login" options={{ animationEnabled: false }}>
                 {(props) => <LoginScreen {...props} globalState={state} />}
               </Stack.Screen>
               {firstLaunch && (
                 <Stack.Screen
                   name="Welcome"
                   component={SplashScreen}
                   options={{ animationEnabled: false, gestureEnabled: false }}
                 />
               )}
             </>
           ) : (
             <>
               {firstLaunch && (
                 <Stack.Screen
                   name="Welcome"
                   component={SplashScreen}
                   options={{ animationEnabled: false, gestureEnabled: false }}
                 />
               )}
               {/* Move below Home when Login flow designed */}
               <Stack.Screen
                 name="Home"
                 component={HomeScreen}
                 options={{ animationEnabled: firstLaunch, gestureEnabled: false }}
               />
               <Stack.Screen name="Login" options={{ animationEnabled: false }}>
                 {(props) => <LoginScreen {...props} globalState={state} />}
               </Stack.Screen>
               <Stack.Screen
                 name="Protected"
                 options={{ animationEnabled: false }}
               >
                 {(props) => <ProtectedScreen {...props} globalState={state} />}
               </Stack.Screen>
             </>
           )}
        </Stack.Navigator>
      </NavigationContainer>
    </AppContext.Provider>
  );
};

const LoginScreen = ({ globalState }) => {
  const [state, dispatch] = useReducer(reducer, {
    mobile_num: '',
    id: '',
    code: '',
  });

  return (
    <AppContext.Provider value={[state, dispatch, globalState]}>
      <LoginStack.Navigator initialRouteName='Phone' screenOptions={{ headerShown: false }}>
        <LoginStack.Screen
          name="Phone"
          component={PhoneNumberScreen}
          options={{ animationEnabled: false }}
        />
        <LoginStack.Screen
          name="Code"
          component={CodeScreen}
          options={{ animationEnabled: false }}
        />
        <LoginStack.Screen
          name="Email"
          component={CodeScreen}
          options={{ animationEnabled: false }}
        />
        <LoginStack.Screen
          name="Name"
          component={NameScreen}
          options={{ animationEnabled: false }}
        />
      </LoginStack.Navigator>
    </AppContext.Provider>
  );
};

const LogStack = ({ globalState }) => {
  const initialState = Object.keys(LOGFIELDS).reduce((a, v) => ({ ...a, [v]: false }), {});

  const [state, dispatch] = useReducer(reducer, initialState);

  const [pictureState, pictureDispatch] = useReducer(reducer, {
    engine_pic: '',
    dolly_pic: '',
    tractor_pic: '',
  });

  return (
    <AppContext.Provider value={[state, dispatch, pictureState, pictureDispatch]}>
      <Log.Navigator screenOptions={{ headerShown: false }}>
        <Log.Screen
          name="Log"
          initialParams={{ log: undefined }}
          options={{ animationEnabled: false }}
        >
          {(props) => <LogScreen {...props} globalState={globalState} />}
        </Log.Screen>
        <Log.Screen
          name="LogEntry"
          options={{ animationEnabled: false }}
        >
          {(props) => <LogEntryScreen {...props} globalState={globalState} />}
        </Log.Screen>
      </Log.Navigator>
    </AppContext.Provider>
  );
};


const ProtectedScreen = ({ globalState }) => {
  return (
    <Tab.Navigator
      initialLayout={{ width: Dimensions.get('window').width }}
      screenOptions={{
        tabBarActiveTintColor: 'white',
        tabBarShowLabel: false,
        tabBarShowIcon: true,
        tabBarIconStyle: getStyle('width-75 height-50'),
        tabBarIndicatorStyle: getStyle('backgroundColor-primary'),
        tabBarStyle: getStyle('height-10p borderColor-black'),
      }}
      initialRouteName="ProfileTab"
      tabBarPosition="bottom">
      <Tab.Screen
        name="LogTab"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabView
              focused={focused}
              focusedIcon={images.requestIconActive}
              notFocusedIcon={images.requestIcon}
              text="Add Log"
            />
          ),
        }}
      >
        {(props) => <LogStack {...props} globalState={globalState} />}
      </Tab.Screen>
      <Tab.Screen
        name="ProfileTab"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabView
              focused={focused}
              focusedIcon={images.profileIconActive}
              notFocusedIcon={images.profileIcon}
              text="Profile"
            />
          ),
        }}
      >
        {(props) => <ProfileScreen {...props} globalState={globalState} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default App;
