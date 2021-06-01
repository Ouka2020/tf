/**
 * load style file
 * @param {String} url
 */
export const loadStyle = (url: string): void => {
    const head = document.querySelector('head');
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = url;
    link.media = 'screen';
    head.appendChild(link);
}

//module.exports={loadStyle}
