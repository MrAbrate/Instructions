const JSONCache = {};

function getExercises() {
  // Example: ?e=books-0

  return new Promise((resolve, reject) => {
    const exerciseIds = getUrlParams('e').split(',');
    const exercises = [];
    let counter = 0;

    exerciseIds.forEach(loadCollection);

    function loadCollection(exerciseId, i) {
      const [collectionName, exerciseIndex] = exerciseId.split('-');
      getJSON(`json/${ collectionName }.json`)
      .then(collection => {
        exercises[i] = collection[exerciseIndex];
        counter += 1;
        if (counter >= exerciseIds.length) {
          resolve(exercises);
        }
      });
    }
  });
}


function getUrlParams(prop) {
    const params = {};
    const paramIndex = window.location.href.indexOf('?') + 1;
    const search = decodeURIComponent( window.location.href.slice(paramIndex) );
    const definitions = search.split('&');

    definitions.forEach( (val, key) => {
        const parts = val.split('=', 2);
        params[ parts[0] ] = parts[1];
    });

    return (prop && prop in params) ? params[prop] : params;
}

function getJSON(url, data, cache = true) {
  return new Promise((resolve, reject) => {
    if (cache && JSONCache[url] !== undefined) {
      resolve(JSONCache[url]);
    }

    const request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = function() {
      if (this.status >= 200 && this.status < 400) {
        // Success!
        var data = JSON.parse(this.response);
        JSONCache[url] = data
        resolve(data);
      } else {
        // We reached our target server, but it returned an error
        reject();
      }
    };

    request.onerror = function() {
      // There was a connection error of some sort
      reject();
    };

    request.send();
  });
}
