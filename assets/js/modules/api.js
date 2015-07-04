function forData(resource) {
    let url = 'https://data.bathhacked.org/' + resource;

    return fetch(url).then(response => response.json())
}

export {forData};
