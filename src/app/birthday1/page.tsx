// components/BirthdayCard.tsx

import React from 'react';
import styles from '../modules/BirthdayCard.module.css';

const BirthdayCard: React.FC = () => {
  return (
    <div className='fixed top-0 left-0 w-full h-full bg-yellow-400 flex items-center justify-center'>
        <div className={styles.containerBg} >
            <div className={styles.card}>
              <div className={styles.outside}>
                <div className={styles.front}>
                  <p>Happy Birthday</p>
                  <div className={styles.cake}>
                    <div className={styles.topLayer}></div>
                    <div className={styles.middleLayer}></div>
                    <div className={styles.bottomLayer}></div>
                    <div className={styles.candle}></div>
                  </div>
                </div>
                <div className={styles.back}></div>
              </div>
              <div className={styles.inside}>
                <p className='text-black '>
                  This is a preview of the card. You can latter write a short message to get started...
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                </p>
                <h1 style={{ fontSize: '2rem' }}>&#127873;</h1>
              </div>
            </div>
        </div>
    </div>
  );
};

export default BirthdayCard;
