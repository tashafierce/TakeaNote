import { createContext } from 'react';

export const NotesContext = createContext({
    nextId: 0,
    onAdd() {},
});