/**
 * randomFailChance
 * chance that hessBot will respond with a fail/ignore response on a command
 * @param failChance
 * @returns {boolean}
 */
export const randomFailChance =  (failChance) => {
    return !((Math.random())>=failChance);
};


