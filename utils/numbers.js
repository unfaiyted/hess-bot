/**
 * randomFailChance
 * chance that hessBot will respond with a fail/ignore response on a command
 * @param failChance
 * @returns {boolean}
 */
export const randomFailChance =  (failChance) => {
    return !((Math.random())>=failChance);
};


export const random = (min = 0, max = 100) => {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
};


export const counting = (type,current) => {

    switch (type) {
        case 0: // normal
            console.log("count type: normal");
            return current+1;
            break;
        case 1: // at zero
            console.log("count type: at zero");
            return current;
            break;
        case 2: // by 10s
            console.log("count type: by tens");
            return current+10;
            break;
        case 3: // 100% random
            console.log("count type: all random");
            return current + random();
            break;
        case 4: // almost normal
            console.log("count type: almost normal");
            if (current <= 1) return current++;
            return (randomFailChance(.15)) ? current + random() : current++;
            break;

    }

};
