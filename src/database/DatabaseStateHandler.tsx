import { ErrorScreen, LoadingScreen } from '../screens/LoadingscreenAndErrorscreen';
import { useDatabase } from './DatabaseContext';


export function DatabaseStateHandler({ children }: { children: React.ReactNode }) {
  const { isLoading, error } = useDatabase();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorScreen error={error} />;
  }

  return <>{children}</>;
}