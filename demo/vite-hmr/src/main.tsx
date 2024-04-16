import { render } from './render';
import { initState } from './state';

render();
initState();

if(import.meta.hot) {
  import.meta.hot.accept(['./render.ts', './state.ts'], (modules: any) => {
    const [renderModule, stateModule] = modules
    if (renderModule) {
      renderModule.render()
    }
    if (stateModule) {
      stateModule.render()
    }
  })
}