/**
 * Add a class to a DOM element, uses classlist if supported and falls back to classname
 * @param {Object} DOM object
 * @param {String} Class name to add to the DOM element
 * @return {Boolean} Does the classlist contain the specified class
 */
function addClass(el, className) {

    if (el && className) {

        if (el.classList) {

            el.classList.add(className);

        } else {

            el.className += ' ' + className;

        }

        return el.classList.contains(className);

    } else {

        throw new Error('Invalid parameters, expected valid DOM object and class string');

    }
}

export default addClass;
