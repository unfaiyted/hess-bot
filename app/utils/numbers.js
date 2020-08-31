/**
 * randomFailChance
 * chance that hessBot will respond with a fail/ignore response on a command
 * This will ust randomly return a false value with a given % chance of doing so
 * @param failChance, 0.1 = 10%  1.0 = 100%, will always fail, 0 to disable
 * @returns {boolean}
 */
exports.randomFailChance =  (failChance = .15) => {
    return !((Math.random())>=failChance);
};


/**
 * Responds with a random integer, defaults at 0 to 100
 * @param min
 * @param max
 * @returns {number}
 */
exports.random = (min = 0, max = 100) => {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
};


/**
 * Counts in unique and not useful ways.
 * This it to mimic Hess's wont to count randomly wrong
 * and to just be generally annoying for the lulz
 * @param type
 * @param current
 * @returns {number|*}
 */
exports.counting = (type,current) => {

    switch (type) {
        case 0: // normal
            log.info("count type: normal");
            return current+1;
            break;
        case 1: // at zero
            log.info("count type: at zero");
            return current;
            break;
        case 2: // by 10s
            log.info("count type: by tens");
            return current+(10*current);
            break;
        case 3: // 100% random
            log.info("count type: all random");
            return current + exports.random();
            break;
        case 4: // almost normal
            log.info("count type: almost normal");
            if (current <= 1) return current++;
            return (this.randomFailChance(.15)) ? current + exports.random() : current++;
            break;
    }

};
