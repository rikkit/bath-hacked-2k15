/**
 * Remove a class from a DOM element, uses classlist if supported and falls back to classname
 * @param  {Object} DOM object
 * @param  {String} Class name to remove from the DOM element
 * @return {Boolean} Does the classlist contain the specified class
 */
function removeClass(el, className) {

    if (el && className) {

        if (el.classList) {

            el.classList.remove(className);

        } else {

            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');

        }

        return el.classList.contains(className);

    } else {

        throw new Error('Invalid parameters, expected valid DOM object and class string');

    }
}

export default removeClass;
