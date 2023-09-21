import Toast from 'react-native-toast-message'

export function formatDuration(seconds) {
  // 4000 - 1hr, 6min, 40s
  const hours = Math.floor(seconds / 3600);           // Div by min
  const minutes = Math.floor((seconds % 3600) / 60);  // Remainder of div by min->min
  const remainingSeconds = seconds % 60;

  // Use String.padStart to add leading zeros if needed
  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

export function showToast(type, text1, text2) {
  Toast.show({
    type,
    text1,
    text2,
    position: 'bottom'
  });
}
