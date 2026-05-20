/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 *
 * Modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */

import React, { useContext } from 'react';
import { ThemeContext } from '../../components/with_theme';

const KEYFRAMES = `
@keyframes olly-sway {
  0%, 100% { transform: rotate(-2deg); }
  50%      { transform: rotate(2deg); }
}
@keyframes olly-pulse {
  0%, 100% { transform: scale(1); opacity: 0.25; }
  50%      { transform: scale(1.7); opacity: 0.55; }
}
@keyframes olly-blink {
  0%, 80%, 84%, 86%, 90%, 100% { transform: scaleY(1); }
  82%, 88%                     { transform: scaleY(0.06); }
}
`;

const LIGHT = {
  faceStops: ['#ffffff', '#f6f8fc', '#e3e9f4'],
  stroke: '#0e3a6b',
  curl: '#0e3a6b',
  leftEye: '#275DB2',
  rightEye: '#153A5A',
};

const DARK = {
  faceStops: ['#1c3158', '#0e1a2e', '#0a1424'],
  stroke: '#e8eef8',
  curl: '#e8eef8',
  leftEye: '#5a8de0',
  rightEye: '#2e528a',
};

export const OllyMascot = ({ size = 48 }) => {
  const themeContext = useContext(ThemeContext);
  const isDark = themeContext.theme === 'v9-dark';
  const t = isDark ? DARK : LIGHT;

  return (
    <>
      <style>{KEYFRAMES}</style>
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 282"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Olly mascot"
        style={{ overflow: 'visible' }}>
        <defs>
          <radialGradient id="ollyFaceGrad" cx="42%" cy="32%" r="78%">
            <stop offset="0%" stopColor={t.faceStops[0]} />
            <stop offset="55%" stopColor={t.faceStops[1]} />
            <stop offset="100%" stopColor={t.faceStops[2]} />
          </radialGradient>
          <radialGradient id="ollyHaloGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6fa3ec" stopOpacity="0.7" />
            <stop offset="60%" stopColor="#6fa3ec" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#6fa3ec" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Body */}
        <circle cx="100" cy="181.667" r="92.5" fill="url(#ollyFaceGrad)" stroke={t.stroke} strokeWidth="15" />

        {/* Curl + dot */}
        <g style={{ animation: 'olly-sway 4s ease-in-out infinite', transformBox: 'fill-box', transformOrigin: '82px 95px' }}>
          <circle cx="82.29" cy="26.67" r="34" fill="url(#ollyHaloGrad)" style={{ animation: 'olly-pulse 1.8s ease-in-out infinite', transformBox: 'fill-box', transformOrigin: 'center' }} />
          <path fill={t.curl} d="M82.2868 5.72205e-06C67.5592 5.72205e-06 55.6202 11.9391 55.6202 26.6667C55.6202 41.3943 67.5592 53.3333 82.2868 53.3333C97.0144 53.3333 108.954 41.3943 108.954 26.6667C108.954 11.9391 97.0144 5.72205e-06 82.2868 5.72205e-06ZM92.4653 57.0667L87.9985 54.8199L87.9985 54.8199L92.4653 57.0667ZM77.4012 69.0667L82.1742 70.5559V70.5559L77.4012 69.0667ZM78.0943 89.3912C79.599 91.7066 82.6959 92.3639 85.0113 90.8592C87.3268 89.3545 87.984 86.2576 86.4794 83.9422L82.2868 86.6667L78.0943 89.3912ZM82.2868 26.6667C77.9436 29.1438 77.9434 29.1434 77.9432 29.1431C77.9432 29.1431 77.9431 29.1429 77.9431 29.143C77.9432 29.143 77.9434 29.1435 77.9438 29.1443C77.9447 29.1458 77.9464 29.1488 77.9489 29.1532C77.9539 29.162 77.9621 29.1764 77.9733 29.1962C77.9957 29.2358 78.0303 29.2972 78.0762 29.3791C78.168 29.5429 78.3048 29.7886 78.4793 30.1063C78.8284 30.742 79.3273 31.664 79.9172 32.7934C81.1008 35.0595 82.6329 38.1261 84.0545 41.3714C85.4907 44.6499 86.7434 47.9516 87.442 50.7241C87.7916 52.1114 87.9639 53.2181 87.9949 54.0352C88.0285 54.9189 87.8803 55.055 87.9985 54.8199L92.4653 57.0667L96.9321 59.3134C97.8892 57.4106 98.052 55.346 97.9877 53.6552C97.9209 51.8977 97.5863 50.0561 97.1389 48.2807C96.2437 44.7279 94.742 40.8465 93.2142 37.3588C91.6718 33.8379 90.0301 30.5553 88.781 28.1638C88.1545 26.9643 87.6222 25.9804 87.2443 25.2924C87.0553 24.9482 86.9046 24.6776 86.7998 24.4905C86.7474 24.397 86.7064 24.3243 86.6778 24.2737C86.6635 24.2484 86.6523 24.2287 86.6443 24.2146C86.6403 24.2075 86.6371 24.2019 86.6348 24.1977C86.6336 24.1956 86.6326 24.1939 86.6318 24.1925C86.6314 24.1919 86.631 24.1911 86.6308 24.1908C86.6304 24.1901 86.6301 24.1895 82.2868 26.6667ZM92.4653 57.0667L87.9985 54.8199C87.3012 56.2064 86.0715 56.8343 82.5868 58.284C79.6908 59.4889 74.5078 61.5531 72.6281 67.5774L77.4012 69.0667L82.1742 70.5559C82.5143 69.4661 83.1857 68.8657 86.428 67.5168C89.0816 66.4128 94.2741 64.5978 96.9321 59.3134L92.4653 57.0667ZM77.4012 69.0667L72.6281 67.5774C71.7662 70.34 71.9117 73.1839 72.3488 75.5855C72.7934 78.0288 73.6079 80.3783 74.4356 82.3534C75.2706 84.3461 76.1713 86.0803 76.8588 87.3118C77.2048 87.9314 77.5022 88.4335 77.7181 88.7884C77.8262 88.9661 77.9142 89.1076 77.9782 89.2091C78.0102 89.2599 78.0362 89.3008 78.0557 89.3312C78.0655 89.3465 78.0736 89.3591 78.0801 89.3691C78.0833 89.3741 78.0861 89.3785 78.0885 89.3821C78.0897 89.384 78.0908 89.3857 78.0917 89.3872C78.0922 89.3879 78.0929 89.3889 78.0931 89.3893C78.0937 89.3902 78.0943 89.3912 82.2868 86.6667C86.4794 83.9422 86.4799 83.943 86.4804 83.9438C86.4805 83.944 86.481 83.9448 86.4813 83.9452C86.4819 83.946 86.4823 83.9467 86.4826 83.9473C86.4833 83.9483 86.4836 83.9487 86.4835 83.9485C86.4832 83.9481 86.4813 83.9452 86.4779 83.9398C86.471 83.929 86.4579 83.9085 86.439 83.8786C86.4014 83.8188 86.3409 83.7218 86.2614 83.5912C86.1022 83.3295 85.8685 82.9355 85.5903 82.4373C85.0297 81.4331 84.3105 80.0443 83.6585 78.4885C82.9991 76.915 82.4593 75.2903 82.1872 73.7949C81.9074 72.258 81.9736 71.1991 82.1742 70.5559L77.4012 69.0667Z" />
        </g>

        {/* Eyes */}
        <g style={{ animation: 'olly-blink 5s infinite', transformBox: 'fill-box', transformOrigin: 'center' }}>
          <ellipse cx="77" cy="168.167" rx="25" ry="33.5" fill={t.leftEye} />
        </g>
        <g style={{ animation: 'olly-blink 5s infinite', transformBox: 'fill-box', transformOrigin: 'center' }}>
          <ellipse cx="148" cy="168.167" rx="24" ry="33.5" fill={t.rightEye} />
        </g>
      </svg>
    </>
  );
};
