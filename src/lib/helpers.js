const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';

export function randomString (stringLength = 5) {
    let randomString = '';
    for (let i=0; i < stringLength; i++) {
        const rnum = Math.floor(Math.random() * chars.length);
        randomString += chars.substring(rnum, rnum + 1);
    }
    return randomString;
}


export function shuffleProps (obj) {
    const result = {};
    const keysOrder = Object.keys(obj).sort((a, b) => Math.random() - 0.5);
    keysOrder.forEach(key => result[key] = obj[key]);
    return result;
}
