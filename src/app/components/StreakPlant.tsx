import React from 'react';
import Image from 'next/image';

// Map plant stages to image filenames
const stageToImage: Record<number, string> = {
  1: '/images/StreakPlantImages/Stage 1 Normal.gif',
  2: '/images/StreakPlantImages/Stage 2 to Stage 1.gif',
  3: '/images/StreakPlantImages/Stage 3 to Stage 2.gif',
  4: '/images/StreakPlantImages/Stage 4 to Stage 3.gif',
};

interface StreakPlantProps {
  stage: 1 | 2 | 3 | 4;
  className?: string;
}

const StreakPlant: React.FC<StreakPlantProps> = ({ stage, className }) => {
  const src = stageToImage[stage] || stageToImage[4];
  return (
    <div
      className={className}
      style={{
          width: '10rem',
          height: '19rem',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          marginTop: 'auto',
          position: 'relative',
          zIndex: 3,
      }}
    >
      <Image
        src={src}
        alt={`Streak Plant Stage ${stage}`}
        width={300}
        height={300}
        style={{ objectFit: 'contain', maxWidth: '100%', maxHeight: '100%' }}
        priority
      />
    </div>
  );
};

export default StreakPlant; 