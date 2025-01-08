// import React, { useEffect, useState } from "react";
// import { View, Text, StyleSheet } from "react-native";

// interface CountdownTimerProps {
//   initialMinutes: number;
//   onTimeUp?: () => void;
// }

// export function CountdownTimer({
//   initialMinutes,
//   onTimeUp,
// }: CountdownTimerProps) {
//   const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);

//   useEffect(() => {
//     if (timeLeft === 0) {
//       onTimeUp?.();
//       return;
//     }

//     const timer = setInterval(() => {
//       setTimeLeft((prevTime) => prevTime - 1);
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [timeLeft, onTimeUp]);

//   const minutes = Math.floor(timeLeft / 60);
//   const seconds = timeLeft % 60;

//   return (
//     <View style={styles.container}>
//       <Text style={styles.label}>Thời gian còn lại:</Text>
//       <Text style={styles.timer}>
//         {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
//       </Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     alignItems: "center",
//     padding: 16,
//   },
//   label: {
//     fontSize: 16,
//     color: "#333",
//     marginBottom: 8,
//     fontWeight: "500",
//   },
//   timer: {
//     fontSize: 32,
//     fontWeight: "bold",
//     color: "#60A5FA",
//   },
// });

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

interface CountdownTimerProps {
  initialMinutes: number;
  onTimeUp?: () => void;
}

export function CountdownTimer({
  initialMinutes,
  onTimeUp,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [isExtraTime, setIsExtraTime] = useState(false);
  const [extraTimeSeconds, setExtraTimeSeconds] = useState(0);

  useEffect(() => {
    if (timeLeft === 0) {
      // Khi hết giờ
      setIsExtraTime(true);
      onTimeUp?.();
      
      // Bắt đầu đếm thời gian phụ trội
      const extraTimer = setInterval(() => {
        setExtraTimeSeconds((prevTime) => prevTime + 1);
      }, 1000);

      return () => clearInterval(extraTimer);
    }

    // Timer bình thường cho đếm ngược
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  const formatTime = () => {
    if (isExtraTime) {
      // Trong thời gian phụ trội
      const extraMinutes = Math.floor(extraTimeSeconds / 60);
      const extraSeconds = extraTimeSeconds % 60;
      const totalSeconds = extraMinutes * 60 + extraSeconds;
      const minutes = Math.floor(totalSeconds / 60); // Lấy số phút
      const seconds = totalSeconds % 60; // Lấy số giây còn lại
      return `${minutes}:${String(seconds).padStart(2, "0")}`;
      // return `${String(extraMinutes * 60 + extraSeconds).padStart(2, "0")}`;
    } else {
      // Trong thời gian chính
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {isExtraTime ? "Thời gian phụ trội:" : "Thời gian còn lại:"}
      </Text>
      <Text style={[
        styles.timer,
        isExtraTime && styles.extraTimeTimer
      ]}>
        {formatTime()}
      </Text>
      {isExtraTime && (
        <Text style={styles.extraTimeLabel}>
          (Quá giờ)
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 16,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
    fontWeight: "500",
  },
  timer: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#60A5FA",
  },
  extraTimeTimer: {
    color: "#DC2626", // Màu đỏ
  },
  extraTimeLabel: {
    fontSize: 14,
    color: "#DC2626",
    marginTop: 4,
    fontStyle: "italic",
  },
});