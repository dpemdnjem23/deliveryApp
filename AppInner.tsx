import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';


export type RootStackParamList = {
    SignIn: undefined;
    SignUp: undefined;
  };

function AppInner(){

    const Tab = createBottomTabNavigator()
    const Stack = createNativeStackNavigator()




    return(

        // <Tab.Navigator>

        //     <Tab.Screen
        //     name='Orders'
        //     options={{

        //         title:'주문 목록',
                
        //         tabBarIcon:({color})=>(


        //             <FontAwesome5 name='list' size={20} style={{color}} />
        //         ),
        //         tabBarActiveTintColor:'blue'
                

        //     }}
        //     >


        //     </Tab.Screen>


        // </Tab.Navigator>


        <Stack.Navigator>

            <Stack.Screen
            name='SignIn'
            options={{title:'로그인'}}
        

            >
           

            </Stack.Screen>
            <Stack.Screen
                name='SignUp'
                options={{title:'회원가입'}}
                >
                    


                </Stack.Screen>

        </Stack.Navigator>
    )

}


export default AppInner;