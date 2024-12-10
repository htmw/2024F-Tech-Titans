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
    />
  )
}