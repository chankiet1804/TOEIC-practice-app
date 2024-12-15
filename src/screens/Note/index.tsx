import React, { useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Audio } from 'expo-av';
import { SafeAreaBox } from '../../components/SafeAreaBox';

interface RecordingLine {
  sound: Audio.Sound;
  duration: string;
  file: string;
}

export function NoteScreen() {
  const [recording, setRecording] = useState<Audio.Recording | undefined>();
  const [recordings, setRecordings] = useState<RecordingLine[]>([]);

  async function startRecording() {
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (perm.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true
        });
        const { recording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        setRecording(recording);
      }
    } catch (err) {
      console.error('Error starting recording:', err);
    }
  }

  async function stopRecording() {
    if (!recording) return;
    
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    
    const uri = recording.getURI();
    if (!uri) return;

    let allRecordings = [...recordings];
    const { sound, status } = await recording.createNewLoadedSoundAsync();
    
    if (!status.isLoaded || !status.durationMillis) return;

    allRecordings.push({
      sound: sound,
      duration: getDurationFormatted(status.durationMillis),
      file: uri
    });

    setRecordings(allRecordings);
  }

  function getDurationFormatted(milliseconds: number): string {
    const minutes = milliseconds / 1000 / 60;
    const seconds = Math.round((minutes - Math.floor(minutes)) * 60);
    return seconds < 10 ? `${Math.floor(minutes)}:0${seconds}` : `${Math.floor(minutes)}:${seconds}`;
  }

  function getRecordingLines() {
    return recordings.map((recordingLine, index) => {
      return (
        <View key={index} style={styles.row}>
          <Text style={styles.fill}>
            Recording #{index + 1} | {recordingLine.duration}
          </Text>
          <Button 
            onPress={() => {
              console.log('File Path:', recordingLine.file);
              recordingLine.sound.replayAsync()} }
            title="Play"
          />
        </View>
      );
    });
  }

  function clearRecordings() {
    setRecordings([]);
  }

  return (
    <SafeAreaBox>
      <View style={styles.container}>
        <Button
          title={recording ? "Stop Recording" : "Start Recording"}
          onPress={recording ? stopRecording : startRecording}
        />
        {getRecordingLines()}
        {recordings.length > 0 && (
          <Button title="Clear Recordings" onPress={clearRecordings} />
        )}
      </View>
    </SafeAreaBox>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  fill: {
    flex: 1,
    margin: 8,
  }
});
