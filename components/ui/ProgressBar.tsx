import { Colors } from "@/constants/colors";
import { BorderRadius, Dimensions } from "@/constants/spacing";
import { SearchStep } from "@/domain/services/stream/stream.service";
import { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import styled from "styled-components/native";

type ProgressBarProps = {
  searchSteps: SearchStep[];
};

export const ProgressBar = ({ searchSteps }: ProgressBarProps) => {
  const progress = calculateProgress(searchSteps);
  const width = useSharedValue(progress);

  useEffect(() => {
    width.value = withTiming(progress, {
      duration: 500,
    });
  }, [progress, width]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${width.value}%`,
    };
  });

  if (searchSteps.length === 0) {
    return null;
  }

  return (
    <ProgressBarContainer>
      <AnimatedProgressBarFill style={animatedStyle} />
    </ProgressBarContainer>
  );
};

// Progress calculation offset for better UX (shows progress slightly ahead)
const PROGRESS_OFFSET = 2;

const calculateProgress = (searchSteps: SearchStep[]): number => {
  if (searchSteps.length === 0) return 0;
  const completedCount =
    searchSteps.filter((step) => step.isCompleted).length + PROGRESS_OFFSET;
  return Math.min(Math.round((completedCount / searchSteps.length) * 100), 100);
};

const ProgressBarContainer = styled.View`
  height: ${Dimensions.progressBarHeight}px;
  background-color: ${Colors.background.secondary};
  border-radius: ${BorderRadius.small}px;
  overflow: hidden;
`;

const AnimatedProgressBarFill = styled(Animated.View)`
  height: 100%;
  background-color: ${Colors.background.black};
  border-radius: ${BorderRadius.small}px;
`;
