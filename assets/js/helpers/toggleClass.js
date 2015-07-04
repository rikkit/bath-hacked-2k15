/**
 * Toggle a class on a DOM element, uses classlist if supported and falls back to classname
 * @param  {Object} DOM object
 * @param  {String} Class name to toggle on the DOM element
 * @return {Boolean} Does the classlist contain the specified class
 */
function toggleClass(el, className) {
    if (el && className) {

        if (el.classList) {

            el.classList.toggle(className);

        } else {

            var classes = el.className.split(' '),
                existingIndex = classes.indexOf(className);

            if (existingIndex >= 0) {

                classes.splice(existingIndex, 1);

            } else {

                classes.push(className);

            }

            el.className = classes.join(' ');
        }

        return el.classList.contains(className);

    } else {

        throw new Error('Invalid parameters, expected valid DOM object and class string');

    }
}

export default toggleClass;
