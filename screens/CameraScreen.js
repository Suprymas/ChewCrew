import 'react-native-url-polyfill/auto'; 
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Pressable
} from 'react-native';
import {RequestPermissionView} from "../components/RequestPermissionView";

const CameraScreen = ({ route, navigation }) => {
  const { onPhotoTaken } = route.params;
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const cameraRef = useRef(null);


  if (!permission) return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20}}>
      <Text style={{color: '#FFF', fontSize: 18, marginBottom: 8}}>Permission was not granted!</Text>
      <Text style={{color: '#FFF', fontSize: 16, marginBottom: 24}}>You cannot take pictures!</Text>

      <Pressable
        onPress={() => navigation.goBack()}
        style={{
          backgroundColor: '#FFF',
          paddingHorizontal: 24,
          paddingVertical: 12,
          borderRadius: 8,
          marginTop: 16
        }}
      >
        <Text style={{color: '#000', fontSize: 16, fontWeight: '600'}}>Go Back</Text>
      </Pressable>
    </View>
  );

  if (!permission.granted) {
    return (
      <RequestPermissionView  requestPermission={requestPermission} navigation={navigation} />
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

const handleTakePhoto = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.5, 
          base64: true, 
          exif: false,
          shutterSound: false
        });
        setCapturedPhoto(photo); 
      } catch (error) {
        console.error("Error taking photo:", error);
      }
    }
  };

const save = async () => {
    if (!capturedPhoto || !capturedPhoto.base64) return;

    onPhotoTaken(capturedPhoto);
    setCapturedPhoto(null);
    navigation.goBack();
  };

  // --- Render Preview ---
  if (capturedPhoto) {
    return (
      <View style={styles.container}>
        <Image
          source={{ uri: capturedPhoto.uri }}
          style={styles.previewImage}
        />

        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>x</Text>
        </Pressable>

        <View style={styles.previewButtonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.retakeButton]}
            onPress={() => setCapturedPhoto(null)}
          >
            <Text style={styles.buttonText}>Retake</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.confirmButton]}
            onPress={save}
          >
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // --- Render Camera ---
  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}/>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.iconButton} onPress={toggleCameraFacing}>
          <Text style={styles.text}>Flip</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shutterButton} onPress={handleTakePhoto}>
          <View style={styles.shutterInner} />
        </TouchableOpacity>
        <View style={styles.iconButton} />
      </View>
    </View>
  );
}

export default CameraScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  previewImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '600',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
  },
  iconButton: {
    flex: 1,
    alignItems: 'center',
  },
  shutterButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 5,
    borderColor: 'white',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterInner: {
    width: 55,
    height: 55,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  previewButtonContainer: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 30,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  retakeButton: {
    backgroundColor: '#FF6B6B',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
  },
  disabledButton: {
    backgroundColor: '#A5D6A7',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});