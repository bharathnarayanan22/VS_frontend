import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Homepage.module.css';
import { TypeAnimation } from 'react-type-animation';

const Homepage = () => {
  return (
    <div className={styles.homepageContainer}>
      <div className={styles.content}>
        <h1 className={styles.heading}>
        <TypeAnimation
  sequence={[
    'Voting System',
    1000,
    'Voting is our responsibility',
    1000,
    'Voting System',
    1000,
  ]}
  speed={50}
  repeat={Infinity}
/>
        </h1>
        <p className={styles.subtext}>Please select your role to continue.</p>
        <div className={styles.buttonsContainer}>
          <div className={styles.buttonRow}>
            <Link to="/voterverification" className={styles.buttonLink}>
              <button className={styles.button}>Voter</button>
            </Link>
          </div>
          <div className={styles.buttonRow}>
            <Link to="/login" className={styles.buttonLink}>
              <button className={styles.button}>Organizer</button>
            </Link>
          </div>
          <div className={styles.buttonRow}>
            <Link to="/result" className={styles.buttonLink}>
              <button className={styles.button}>View Live Result</button>
            </Link>
          </div>
        </div>
      </div>
      <div className={styles.image}></div>
    </div>
  );
}

export default Homepage;
