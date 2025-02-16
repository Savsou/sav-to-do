import TopBar from "./components/TopBar"

function App() {
  // const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  return (
    <>
      <TopBar></TopBar>
      <h1 class="text-3xl font-bold underline">
        Hello world!
      </h1>
    </>
  )
}

export default App
