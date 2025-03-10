'use client';

import * as React from 'react';
import { updateDurationAction } from './action';

interface UpdateDurationProps {
  stepId: string;
  taskId: string;
}

export function UpdateDuration({ stepId, taskId }: UpdateDurationProps) {
  const secondsRef = React.useRef(0);
  const [seconds, setSeconds] = React.useState(0);

  React.useEffect(() => {
    // Reset counters
    secondsRef.current = 0;
    setSeconds(0);

    let interval: NodeJS.Timer;

    const startInterval = () => {
      interval = setInterval(() => {
        secondsRef.current += 1;
        setSeconds(secondsRef.current);

        if (secondsRef.current >= 5 && secondsRef.current % 5 === 0) {
          const formData = new FormData();
          formData.set('stepId', stepId);
          formData.set('taskId', taskId);
          updateDurationAction(formData);
        }
      }, 1000);
    };

    const stopInterval = () => {
      clearInterval(interval);
    };

    // Function to handle both visibility and focus changes
    const handleActivityChange = () => {
      if (document.hidden || !document.hasFocus()) {
        stopInterval();
      } else {
        startInterval();
      }
    };

    // Add both visibility and focus/blur listeners
    document.addEventListener('visibilitychange', handleActivityChange);
    window.addEventListener('focus', handleActivityChange);
    window.addEventListener('blur', handleActivityChange);

    // Start interval only if page is visible and focused
    if (!document.hidden && document.hasFocus()) {
      startInterval();
    }

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleActivityChange);
      window.removeEventListener('focus', handleActivityChange);
      window.removeEventListener('blur', handleActivityChange);
      clearInterval(interval);
    };
  }, [stepId, taskId]);

  return <div>Time spent on page: {seconds} seconds</div>;
}
