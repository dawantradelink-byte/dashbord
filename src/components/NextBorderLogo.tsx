import React from 'react';

interface NextBorderLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const NextBorderLogo: React.FC<NextBorderLogoProps> = ({
  className = '',
  size = 56,
  showText = false
}) => {
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <img
        src="https://www.nextborder.online/nextborder-logo.svg"
        alt="Next Border official logo"
        width={size}
        height={size}
        className="shrink-0 object-contain"
        style={{ width: size, height: size }}
        draggable={false}
      />
      {showText && (
        <div className="flex flex-col text-left">
          <div className="text-sm font-extrabold tracking-wider text-white flex items-center gap-1.5 uppercase leading-none">
            <span>Next</span>
            <span className="text-rose-300">Border</span>
          </div>
          <div className="text-[9px] tracking-widest text-amber-300/80 font-semibold uppercase mt-1">
            Visa Consultancy
          </div>
        </div>
      )}
    </div>
  );
};
