import { useState, useEffect } from 'react';

export function useIsMobile(breakpoint: number = 768) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkSize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Kiểm tra kích thước ngay lúc đầu
    checkSize();

    // Thêm event listener
    window.addEventListener('resize', checkSize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', checkSize);
    };
  }, [breakpoint]);

  return isMobile;
} 