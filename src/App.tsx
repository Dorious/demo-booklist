import React, { useReducer } from 'react';
import styles from './App.module.scss';
import reducer from "./reducer";
import BookTable from './components/BookTable';

// Create a context for the whole app
export interface IAppState {
  loading: boolean,
  books: object[]
}
export const initialState: any  = {
  loading: false,
  books: []
};

interface BaseAction {
  type: string,
  payload?: any
}
const defaultContext: [any, React.Dispatch<BaseAction>] = [initialState, (action) => {}];
export const AppContext = React.createContext(defaultContext);
AppContext.displayName = "AppContext";

// Context provider
export interface IAppProvider {
  reducer: any;
  initialState: object;
  children: any;
}
export const AppProvider = ({reducer, initialState, children}: IAppProvider) => {
  return (
    <AppContext.Provider value={useReducer(reducer, initialState)}>
      {children}
    </AppContext.Provider>
  );
};

// App in it's glory
const App: React.FC = () => {
  return (
    <div className={styles['App']}>
      <AppProvider 
        reducer={reducer} 
        initialState={initialState}
      >
        <BookTable />
      </AppProvider>
    </div>
  );
}

export default App;
