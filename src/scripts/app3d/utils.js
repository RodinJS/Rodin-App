export const splitLongWords = str => {
    str = str.replace(/\s\s+/g, ' ');
    let lastSpace = 0;
    let res = '';
    for (let i = 0; i < str.length; i++) {
        if (str.charAt[i] === ' ') {
            lastSpace = i;
        }

        if (i - lastSpace > 40) {
            res += ' ';
            lastSpace = i;
        }

        res += str.charAt(i);
    }
    return res;
};

export const cropText = (text, symbols) => {
    if(text.length > symbols)
        text = `${text.substr(0, symbols - 3)}...`;

    return text;
};