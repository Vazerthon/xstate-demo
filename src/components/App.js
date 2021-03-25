import TrafficLight from './TrafficLight';
import useTraffic from '../hooks/useTraffic';

function App() {
  const { state, actions } = useTraffic();

  return (
    <TrafficLight
      traffic={state.traffic}
      wait={state.wait}
      pedestrians={state.pedestrian}
      onWaitClick={actions.enableWait}
    />
  );
}

export default App;
