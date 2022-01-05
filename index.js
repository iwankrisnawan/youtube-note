const mySelector = value => document.querySelector(value);

const youtubeParse = value => {
  let regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  let match = value.match(regExp);
  return match && match[7].length == 11 ? match[7] : false;
};

const changeIframe = (action, value) => {
  let ifrm = document.createElement('iframe');
  ifrm.setAttribute('class', `my-iframe`);
  ifrm.setAttribute('allow', `accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture`);
  ifrm.setAttribute('allowfullscreen', true);
  if (action === 'timer') {
    let srcIfrm = youtubeParse(mySelector('.my-iframe').getAttribute('src'));
    ifrm.setAttribute('src', `https://www.youtube.com/embed/${srcIfrm}?start=${value}`);
    ifrm.style.width = '100%';
    ifrm.style.height = '315px';
    console.log(srcIfrm);
  } else {
    ifrm.setAttribute('src', `https://www.youtube.com/embed/${value}`);
    ifrm.style.width = '100%';
    ifrm.style.height = '315px';
  }
  mySelector('.box-my-video').innerHTML = '';
  mySelector('.box-my-video').appendChild(ifrm);
};

const changeTimer = value => {
  let timer = value;
  let a = timer.split(':');
  let seconds = 0;

  // second
  if (typeof a[2] !== 'undefined') {
    seconds = +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
  } else if (typeof a[1] !== 'undefined') {
    seconds = a[0] * 60 + +a[1];
  } else {
    seconds = a[0];
  }

  changeIframe('timer', seconds);
};

const getTimerByText = test => {
  const regex = /([0-9]+\:[0-9]+\ )|([0-9]+\:[0-9]+\:[0-9]+)/gm;
  const str = `"${test}"`;
  let m;
  let arrayTimes = [];
  while ((m = regex.exec(str)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }

    // The result can be accessed through the `m`-variable.
    m.forEach((match, groupIndex) => {
      if (groupIndex == 0) {
        arrayTimes.push(match);
      }
    });
  }
  mySelector('#my-checkpoint').innerHTML = '';
  createCheckPointTime(arrayTimes);
};

const createCheckPointTime = values => {
  values.forEach(data => {
    let divElement = document.createElement('div');
    divElement.setAttribute('class', 'col-12 checkpoint');
    divElement.setAttribute('data-value', data);
    divElement.innerHTML = `${data}`;
    mySelector('#my-checkpoint').appendChild(divElement);
  });
};

document.addEventListener('click', event => {
  if (event.target.matches('.checkpoint')) {
    let dataTarget = event.target.getAttribute('data-value');
    changeTimer(dataTarget);
  }

  if (event.target.matches('.link-ytb-submit')) {
    let data = mySelector('.input-ytb-link').value;
    let frm = youtubeParse(data);

    changeIframe('new', frm);
  }

  if (event.target.matches('.convert-text')) {
    const str = mySelector('#text-noted').value;
    getTimerByText(str);
  }
});