import { View } from 'react-native';

interface QuizProgressBarProps {
  current: number;
  total: number;
}

export const QuizProgressBar: React.FC<QuizProgressBarProps> = ({ current, total }) => {
  const progress = (current / total) * 100;

  return (
    <View className="h-2 w-full overflow-hidden rounded-full bg-secondary">
      <View className="h-full bg-primary" style={{ width: `${progress}%` }} />
    </View>
  );
};
