/**
 * Check if a DOmMelement has a particular class
 * @param  {Object} DOM object to test against
 * @param  {String} Class name to test against the DOM element
 * @return {Boolean} Does the element have the specified class
 */
function hasClass(el, className) {

    if (el && className) {

        if (el.classList) {

            return el.classList.contains(className);

        } else {

            return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);

        }

    } else {

        throw new Error('Invalid parameters, expected valid DOM object and class string');

    }

}

export default hasClass;
