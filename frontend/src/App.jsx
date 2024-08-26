import React from 'react'
import Dashboards from './components/Dashboards'
import { WidgetProvider } from './WidgetsContext'
const App = () => {
  return (
    <WidgetProvider>
      <Dashboards/>
    </WidgetProvider>
  )
}

export default App
