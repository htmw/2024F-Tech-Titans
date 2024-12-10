import { Redirect, Stack } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'

export default function HomeLayout() {
  const { isSignedIn } = useAuth()
  
  if (!isSignedIn) {
    return <Redirect href="/sign-in" />
  }
  
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#0A0A0A' },
        animation: 'fade'
      }}
    >
      <Stack.Screen 
        name="index"
        options={{
          animation: 'fade'
        }}
      />
      <Stack.Screen 
        name="quiz/[id]/questions"
        options={{
          animation: 'slide_from_bottom',
          presentation: 'fullScreenModal',
          gestureEnabled: false
        }}
      />
      <Stack.Screen 
        name="topics/[id]"
        options={{
          animation: 'slide_from_right'
        }}
      />
      <Stack.Screen 
        name="quizzes"
        options={{
          animation: 'slide_from_right'
        }}
      />
      <Stack.Screen 
        name="topics"
        options={{
          animation: 'slide_from_right'
        }}
      />
    </Stack>
  )
}