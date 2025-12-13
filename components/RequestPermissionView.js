import {View, Pressable, Text} from "react-native";

export function RequestPermissionView ({requestPermission, navigation}){
  return (
    <View style={{flex: 1, justifyContent: 'center',}}>
      <View style={{alignItems: 'center', paddingHorizontal: 32}}>
        <Text style={{fontSize: 64, marginBottom: 24}}>📷</Text>

        <Text style={{
          color: '#FFF',
          fontSize: 24,
          fontWeight: '700',
          marginBottom: 12,
          textAlign: 'center'
        }}>
          Camera Access Needed
        </Text>

        <Text style={{
          color: '#FFF',
          fontSize: 16,
          textAlign: 'center',
          lineHeight: 24,
          opacity: 0.9,
          marginBottom: 32
        }}>
          Allow us to access your camera to upload photos of your fantastic meals!
        </Text>

        <Pressable
          onPress={requestPermission}
          style={{
            backgroundColor: '#FFF',
            paddingHorizontal: 32,
            paddingVertical: 16,
            borderRadius: 12,
            width: '100%',
            alignItems: 'center'
          }}
        >
          <Text style={{
            color: '#000',
            fontSize: 18,
            fontWeight: '600'
          }}>
            Grant Permission
          </Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.goBack()}
          style={{
            marginTop: 16,
            padding: 12
          }}
        >
          <Text style={{
            color: '#FFF',
            fontSize: 16,
            opacity: 0.7
          }}>
            Maybe Later
          </Text>
        </Pressable>
      </View>
    </View>
  )
}

