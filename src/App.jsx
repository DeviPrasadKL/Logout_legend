import { Box } from "@mui/material"
import { lazy } from "react"
import Loadable from "./Components/Lodable";
const ThemeChanger = Loadable(lazy(()=> import('../src/Theme/ThemeChanger')));

function App() {

  return (
    <>
      <Box>
        <ThemeChanger/>
      </Box>
    </>
  )
}

export default App
