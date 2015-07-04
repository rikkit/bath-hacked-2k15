function matchesSelector(el, selector) {
    if (el && selector) {

        return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector);

    } else {

        throw new Error('Invalid parameters, expected valid DOM object and selector');

    }
};

export default matchesSelector;
