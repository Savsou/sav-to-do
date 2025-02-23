import TopBar from "./components/TopBar"
import TodoList from "./components/TodoList"

function App() {
  // const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  return (
    <>
      <TopBar></TopBar>
      <TodoList></TodoList>
    </>
  )
}

export default App
