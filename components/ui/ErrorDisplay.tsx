// import { useServices } from "@/domain/core/service.provider";
// import { useObservable } from "micro-observables";
// import { TouchableOpacity } from "react-native";
// import styled from "styled-components/native";
// import { Colors } from "@/constants/colors";
// import { Padding, BorderRadius } from "@/constants/spacing";
// import Feather from "@expo/vector-icons/Feather";

// /**
//  * Error display component that shows error messages to users
//  * Appears when the stream service is in ERROR state
//  */
// export const ErrorDisplay = () => {
//   const { streamService } = useServices();
//   const loading = useObservable(streamService.loading);

//   if (loading !== "ERROR") {
//     return null;
//   }

//   const handleRetry = () => {
//     // Reset error state - user can try again
//     streamService.close();
//   };

//   return (
//     <ErrorContainer>
//       <ErrorContent>
//         <ErrorIcon name="alert-circle" size={24} />
//         <ErrorText>
//           Something went wrong. Please try again.
//         </ErrorText>
//         <RetryButton onPress={handleRetry} accessibilityLabel="Retry" accessibilityRole="button">
//           <RetryText>Retry</RetryText>
//         </RetryButton>
//       </ErrorContent>
//     </ErrorContainer>
//   );
// };

// const ErrorContainer = styled.View`
//   padding: ${Padding.header}px;
//   background-color: ${Colors.background.primary};
// `;

// const ErrorContent = styled.View`
//   background-color: ${Colors.status.error}15;
//   border-left-width: 4px;
//   border-left-color: ${Colors.status.error};
//   border-radius: ${BorderRadius.medium}px;
//   padding: ${Padding.header}px;
//   flex-direction: row;
//   align-items: center;
//   flex-wrap: wrap;
// `;

// const ErrorIcon = styled(Feather)`
//   color: ${Colors.status.error};
//   margin-right: ${Padding.md}px;
// `;

// const ErrorText = styled.Text`
//   flex: 1;
//   color: ${Colors.text.primary};
//   font-size: 14px;
//   margin-right: ${Padding.md}px;
// `;

// const RetryButton = styled(TouchableOpacity)`
//   background-color: ${Colors.status.error};
//   padding: ${Padding.sm}px ${Padding.md}px;
//   border-radius: ${BorderRadius.small}px;
// `;

// const RetryText = styled.Text`
//   color: ${Colors.background.white};
//   font-weight: bold;
//   font-size: 14px;
// `;
