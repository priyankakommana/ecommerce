import { useState } from 'react';
import HomeHubView from '../components/HomeHubView';
import SplashView from '../components/SplashView';
import WelcomeView from '../components/WelcomeView';
import { UserProfile } from '../types';

export default function ApplicationEntryHub() {
  const [screen, setScreen] = useState<'SPLASH' | 'WELCOME' | 'HOME'>('SPLASH');

  // Initialize your user state cleanly from storage memory to stop cascading loops
  // const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // // Sync state and manage session caches on page mounting cycles
  // useEffect(() => {
  //   // 💡 REMOVES CACHED MOCK SESSIONS SO YOU CAN SEE THE SIGN-IN OPTIONS ON REFRESH
  //   localStorage.removeItem('dp_user_session'); 
    
  //   const cachedSession = localStorage.getItem('dp_user_session');
  //   if (cachedSession) {
  //     setCurrentUser(JSON.parse(cachedSession));
  //   }
  // }, []);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    if (typeof window !== 'undefined') {
      // Un-comment the line below if you still want to force-clear the cache on refresh:
      // localStorage.removeItem('dp_user_session');
      
      const cachedSession = localStorage.getItem('dp_user_session');
      return cachedSession ? JSON.parse(cachedSession) : null;
    }
    return null;
  });

  const handleLoginSuccess = (profile: UserProfile) => {
    setCurrentUser(profile);
    localStorage.setItem('dp_user_session', JSON.stringify(profile));
  };

  const handleLogoutAction = () => {
    localStorage.removeItem('dp_user_session');
    setCurrentUser(null);
    setScreen('WELCOME');
  };

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    setCurrentUser(updatedProfile);
    localStorage.setItem('dp_user_session', JSON.stringify(updatedProfile));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      {screen === 'SPLASH' && (
        <SplashView onTimeout={() => setScreen('WELCOME')} />
      )}

      {screen === 'WELCOME' && (
        <WelcomeView 
          user={currentUser}
          onLogin={handleLoginSuccess}
          onStartShopping={() => setScreen('HOME')}
        />
      )}

      {screen === 'HOME' && (
        <HomeHubView 
          user={currentUser}
          onLogout={handleLogoutAction}
          onExit={() => setScreen('WELCOME')}
          onUpdateProfile={handleProfileUpdate}
        />
      )}
    </div>
  );
}
