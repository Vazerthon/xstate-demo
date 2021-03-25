import { useMachine } from '@xstate/react';
import { Machine, actions } from 'xstate';

const { send: sendAction, cancel } = actions;

const getTrafficState = (state) => state.value.traffic;
const getWaitState = (state) => state.value.wait;
const getPedestrianState = (state) => state.value.pedestrian;

const sendTrafficTimerAfterDelay = (delay, id) =>
  sendAction('TRAFFIC_TIMER', {
    delay,
    id,
  });

const cancelTimer = (id) => cancel(id);

const pedestrianNotGreen = (_context, _event, meta) =>
  getPedestrianState(meta.state) !== 'green';

const waitIsLit = (_context, _event, meta) =>
  getWaitState(meta.state) === 'lit';

export default function useTraffic() {
  const lightMachine = Machine({
    type: 'parallel',
    id: 'lightMachine',
    states: {
      wait: {
        initial: 'unlit',
        states: {
          unlit: {
            on: {
              ENABLE_WAIT: [
                {
                  target: 'lit',
                  cond: pedestrianNotGreen,
                },
              ],
            },
          },
          lit: {
            on: {
              DISABLE_WAIT: 'unlit',
            },
          },
        },
      },
      pedestrian: {
        initial: 'red',
        states: {
          red: {
            entry: sendAction('DISABLE_WAIT'),
            on: {
              PEDESTRIAN_GREEN: [
                {
                  target: 'green',
                  cond: waitIsLit,
                },
              ],
            },
          },
          green: {
            entry: sendAction('DISABLE_WAIT'),
            on: {
              PEDESTRIAN_FLASH: 'flashGreen',
            },
          },
          flashGreen: {
            on: {
              PEDESTRIAN_RED: 'red',
            },
          },
        },
      },
      traffic: {
        initial: 'green',
        states: {
          green: {
            entry: [
              sendTrafficTimerAfterDelay(5000, 'greenToAmberTimer'),
              sendAction('PEDESTRIAN_RED'),
            ],
            on: {
              TRAFFIC_TIMER: 'amber',
              CANCEL: { actions: cancelTimer('greenToAmberTimer') },
            },
          },
          amber: {
            entry: [sendTrafficTimerAfterDelay(2000, 'amberToRedTimer')],
            on: {
              TRAFFIC_TIMER: 'red',
              CANCEL: { actions: cancelTimer('amberToRedTimer') },
            },
          },
          red: {
            entry: [
              sendTrafficTimerAfterDelay(4000, 'redToFlashAmberTimer'),
              sendAction('PEDESTRIAN_GREEN'),
            ],
            on: {
              TRAFFIC_TIMER: 'flashAmber',
              CANCEL: { actions: cancelTimer('redToFlashAmberTimer') },
            },
          },
          flashAmber: {
            entry: [
              sendTrafficTimerAfterDelay(2000, 'flashAmberToGreenTimer'),
              sendAction('PEDESTRIAN_FLASH'),
            ],
            on: {
              TRAFFIC_TIMER: 'green',
              CANCEL: { actions: cancelTimer('flashAmberToGreenTimer') },
            },
          },
        },
      },
    },
  });

  const [state, send] = useMachine(lightMachine);

  return {
    state: {
      traffic: getTrafficState(state),
      wait: getWaitState(state),
      pedestrian: getPedestrianState(state),
    },
    actions: {
      enableWait: () => send('ENABLE_WAIT'),
    },
  };
}
