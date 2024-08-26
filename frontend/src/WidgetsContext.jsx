import React, { createContext, useReducer, useContext } from 'react';
import data from './components/Data'

const WidgetContext = createContext();

const ADD_WIDGET = 'ADD_WIDGET';
const REMOVE_WIDGET = 'REMOVE_WIDGET';

const widgetReducer = (state, action) => {
    switch (action.type) {
        case ADD_WIDGET:
            return {
                ...state,
                [action.payload.category]: [
                    ...(state[action.payload.category] || []),
                    action.payload.widget
                ]
            };
        case REMOVE_WIDGET:
            return {
                ...state,
                [action.payload.category]: state[action.payload.category].filter(
                    widget => widget.key !== action.payload.key
                )
            };
        default:
            return state;
    }
};

const initialState = data.reduce((acc, category) => {
    acc[category.title] = category.widgets;
    return acc;
}, {});

export const WidgetProvider = ({ children }) => {
    const [state, dispatch] = useReducer(widgetReducer, initialState);

    return (
        <WidgetContext.Provider value={{ state, dispatch }}>
            {children}
        </WidgetContext.Provider>
    );
};

export const useWidgetContext = () => useContext(WidgetContext);
