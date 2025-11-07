import { ReactNode, useEffect, useRef } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  ScrollViewProps,
} from "react-native";
import styled from "styled-components/native";

type AutoScrollViewProps = {
  children: ReactNode;
  dependencies: unknown[];
  threshold?: number;
} & Omit<
  ScrollViewProps,
  | "onScroll"
  | "onScrollBeginDrag"
  | "onScrollEndDrag"
  | "onMomentumScrollEnd"
  | "onContentSizeChange"
>;

export const AutoScrollView = ({
  children,
  dependencies,
  threshold = 20,
  ...scrollViewProps
}: AutoScrollViewProps) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const shouldAutoScrollRef = useRef(true);
  const isUserScrollingRef = useRef(false);
  const lastDependencyLengthRef = useRef(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const isNearBottom =
      contentOffset.y + layoutMeasurement.height >=
      contentSize.height - threshold;

    shouldAutoScrollRef.current = isNearBottom;
  };

  const handleScrollBeginDrag = () => {
    isUserScrollingRef.current = true;
  };

  const handleScrollEndDrag = () => {
    isUserScrollingRef.current = false;
  };

  const handleMomentumScrollEnd = () => {
    isUserScrollingRef.current = false;
  };

  const handleContentSizeChange = () => {
    // Only auto-scroll if user hasn't manually scrolled and is at bottom
    if (shouldAutoScrollRef.current && !isUserScrollingRef.current) {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  };

  useEffect(() => {
    // Only auto-scroll if content actually increased (new messages)
    // Check if first dependency is an array and use its length, otherwise use dependencies length
    const firstDep = dependencies[0];
    const dependencyLength = Array.isArray(firstDep)
      ? firstDep.length
      : dependencies.length;

    const contentIncreased = dependencyLength > lastDependencyLengthRef.current;
    lastDependencyLengthRef.current = dependencyLength;

    if (
      dependencyLength > 0 &&
      shouldAutoScrollRef.current &&
      contentIncreased &&
      !isUserScrollingRef.current
    ) {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  }, [dependencies]);

  return (
    <ScrollView
      ref={scrollViewRef}
      onScroll={handleScroll}
      onScrollBeginDrag={handleScrollBeginDrag}
      onScrollEndDrag={handleScrollEndDrag}
      onMomentumScrollEnd={handleMomentumScrollEnd}
      scrollEventThrottle={16}
      onContentSizeChange={handleContentSizeChange}
      {...scrollViewProps}
    >
      {children}
      <PaddingContainer />
    </ScrollView>
  );
};

const PaddingContainer = styled.View`
  height: 40px;
`;
