import TopBar from "./components/TopBar"
import TodoList from "./components/TodoList"

function App() {
  // const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  return (
    <div id="app-container">
      <TopBar></TopBar>
      <TodoList></TodoList>
    </div>
  )
}

export default App
