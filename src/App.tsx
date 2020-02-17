import React, { useReducer } from 'react';
import styles from './App.module.scss';
import reducer from "./reducer";
import BookTable from './components/BookTable';
import { SortDirectionType } from 'react-virtualized';

// Create a context for the whole app
export interface IAppState {
  loading: boolean;
  books: object[];
  sortBy?: string;
  sortDirection?: SortDirectionType;
  filters: {
    [prop: string]: string[]
  }
}

export const initialState: any  = {
  loading: false,
  books: [],
  filters: {}
};

export interface BaseAction {
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
        <header className={styles['App-header']}>
          <h1>BookList Demo</h1>
          <section>

          </section>
        </header>
        <BookTable />
      </AppProvider>
    </div>
  );
}

export default App;
