export const setStore = (name, content) => {
    if (!name) return;
    if (typeof content !== 'string') {
        content = JSON.stringify(content);
    }
    window.sessionStorage.setItem(name, content);
}
export const getStore = name => {
    if (!name) return;
    return window.sessionStorage.getItem(name);
}
export const removeStore = name => {
    if(!name) return;
    window.sessionStorage.removeItem(name);
}