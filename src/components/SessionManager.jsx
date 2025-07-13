import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * SessionManager Component
 * 
 * Komponen untuk menangani session management, notification, dan redirect
 * saat token expired atau session bermasalah
 */
const SessionManager = () => {
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleSessionExpired = (event) => {
      const { reason } = event.detail || {};
      
      // Show notification to user
      setNotification({
        type: 'error',
        message: 'Sesi Anda telah berakhir. Silakan login kembali.',
        details: reason
      });

      // Redirect to login after short delay
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2000);
    };

    const handleUserLoggedOut = () => {
      setNotification({
        type: 'info',
        message: 'Anda telah berhasil logout.',
      });

      // Redirect to login after short delay
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1500);
    };

    // Add event listeners
    window.addEventListener('sessionExpired', handleSessionExpired);
    window.addEventListener('userLoggedOut', handleUserLoggedOut);

    return () => {
      window.removeEventListener('sessionExpired', handleSessionExpired);
      window.removeEventListener('userLoggedOut', handleUserLoggedOut);
    };
  }, [navigate]);

  // Auto hide notification after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notification]);

  if (!notification) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <div
        className={`
          rounded-lg p-4 shadow-lg border-l-4 transition-all duration-300
          ${notification.type === 'error' 
            ? 'bg-red-50 border-red-500 text-red-700' 
            : 'bg-blue-50 border-blue-500 text-blue-700'
          }
        `}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {notification.type === 'error' ? (
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium">
              {notification.message}
            </p>
            {notification.details && (
              <p className="text-xs mt-1 opacity-75">
                {notification.details}
              </p>
            )}
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={() => setNotification(null)}
              className="inline-flex rounded-md text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionManager;
