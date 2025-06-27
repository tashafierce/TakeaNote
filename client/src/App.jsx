import React, { useReducer } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import NotesModule from "./components/NotesModule";


function App() {

  return (
    <>
      <Header />
      <NotesModule />
      <Footer />
    </>
  );
};

export default App;