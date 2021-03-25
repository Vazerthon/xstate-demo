import styled from '@emotion/styled';
import { keyframes, css } from '@emotion/react';
import useKeyboard from '../hooks/useKeyboard';

const flash = keyframes`
  0% {
    opacity: 0.2;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.2;
  }
`;

const Person = ({ className }) => (
  <path
    className={className}
    d="m615.7 377.5c0 20.5-16.6 37.1-37.1 37.1-20.5 0-37.1-16.6-37.1-37.1 0-20.5 16.6-37.1 37.1-37.1 20.5 0 37.1 16.6 37.1 37.1zM516.4 490.4s-30.3 157.5-36.9 168.2c-5.6 9.1-49.2 80.6-49.2 80.6-9.3 15.3-0.5 26.2 9.4 31.9 8.4 4.8 26.4 3.6 32.4-6.5 0 0 48.4-75.3 53.6-91.5 3.7-11.2 12.1-57.9 12.1-57.9s47 48.5 52.1 57.1c6.5 10.9 18.6 87.1 18.6 87.1 2.9 13.6 15.8 18 29.3 15.7 10.6-1.8 21.8-9 19.3-22.1 0 0-10.7-88.4-19.3-102.9-10.2-17.3-65-76.4-65-76.4l15.7-70s10.1 20.4 17.1 29.3c8 10.1 58.6 39.3 58.6 39.3 4.6 3.1 15.1 1.4 19.3-6.4 3.3-6.3 3.2-16.5-4.3-21.4 0 0-41.7-26.2-51.4-34.3-10.9-9-32.9-69.3-32.9-69.3-6.8-9.4-16.2-19.7-32.1-20-16.1-0.3-24.2 8.6-31.4 13.6 0 0-61.7 45.1-67.9 54.3-6.1 9.2-17.1 78.6-17.1 78.6-1.7 7.9 1.4 14.3 10.7 16.4 11.4 2.7 19.6-4.5 20.7-10 0 0 7.1-54.8 12.1-62.9 5.9-9.4 26.3-20.5 26.3-20.5z"
  />
);

const Container = styled.svg`
  height: 800px;
`;

const AmberLight = styled.circle`
  opacity: 0.2;
  ${({ traffic }) => traffic === 'amber' && 'opacity: 1'};
  ${({ traffic }) => traffic === 'flashAmber' && css`animation: ${flash} 0.6s ease infinite;`};
`;

const RedMan = styled(Person)`
  transform: scale(0.1) translate(-220%, 400%);
  fill: red;
  opacity: ${({ show }) => (show ? 1 : 0.2)};
`;

const GreenMan = styled(Person)`
  transform: scale(0.1) translate(150%, 400%);
  fill: green;
  opacity: 0.2;
  ${({ pedestrians }) => pedestrians === 'green' && 'opacity: 1'};
  ${({ pedestrians }) => pedestrians === 'flashGreen' && css`animation: ${flash} 0.6s ease infinite;`};
`;

const PedestrianButton = styled.circle`
  cursor: pointer;
`;

function TrafficLight({ traffic, pedestrians, wait, onWaitClick }) {
  const { onKeyboardEvent } = useKeyboard({
    Enter: onWaitClick,
  })

  return (
    <Container viewBox="0 0 100 680" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="100" height="280" fill="black" />

      <circle
        cx="50"
        cy="50"
        r="40"
        fill="red"
        opacity={traffic === 'red' ? 1 : 0.2}
      />
      <AmberLight
        cx="50"
        cy="140"
        r="40"
        fill="gold"
        traffic={traffic}
      />
      <circle
        cx="50"
        cy="230"
        r="40"
        fill="green"
        opacity={traffic === 'green' ? 1 : 0.2}
      />

      <rect x="40" y="280" width="20" height="300" fill="darkgray" />

      <rect x="10" y="300" width="80" height="120" fill="gray" />
      <text x="12" y="380" fill="gold" fontSize="30" opacity={wait === 'lit' ? 1 : 0.2}>
        WAIT
      </text>
      <PedestrianButton
        cx="50"
        cy="400"
        r="15"
        fill="black"
        onClick={onWaitClick}
        onKeyDown={onKeyboardEvent}
        tabIndex={0}
      />
      <RedMan show={pedestrians === 'red'} />
      <GreenMan pedestrians={pedestrians} />
    </Container>
  );
}

export default TrafficLight;
