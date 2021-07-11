import { COUNTER_ID } from '../../server/config';

function quantile(arr, q) {
  const sorted = arr.sort((a, b) => a - b);
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;

  if (sorted[base + 1] !== undefined) {
    return Math.floor(sorted[base] + rest * (sorted[base + 1] - sorted[base]));
  } else {
    return Math.floor(sorted[base]);
  }
}

function prepareData(result) {
  return result.data.map((item) => {
    item.date = item.timestamp.split('T')[0];

    return item;
  });
}

// показать значение метрики за несколько день
function showMetricByPeriod(data, page, name, startDate, endDate) {
  const sampleData = data
    .filter((item) => item.page === page && item.name === name && item.date >= startDate && item.date <= endDate)
    .map((item) => item.value);

  return `Event ${name}\nPage ${page}\nFrom ${startDate} to ${endDate}:
    p25=${quantile(sampleData, 0.25)} p50=${quantile(sampleData, 0.5)}
    p75=${quantile(sampleData, 0.75)} p90=${quantile(sampleData, 0.95)}
    hits=${sampleData.length}`;
}

// показать сессию пользователя
function showSession(data, requestId, date) {
  const sampleData = data.filter((item) => item.requestId === requestId && item.date === date);
  let output = `Session ${requestId}\n${date}:`;

  sampleData.forEach((hit) => {
    output += `\n    Page ${hit.page} - Event ${hit.name} - ${hit.value}`;
  });

  output += `\n    hits=${sampleData.length}`;

  return output;
}

// сравнить метрику в разных срезах
function compareMetric(data, page, parameter, name, date) {
  const resultSample = {};
  const sampleData = data.filter((item) => item.page === page && item.name === name && item.date === date);
  let output = `Event ${name}\nComparison ${parameter}\nPage ${page}\n${date}:`;

  sampleData.forEach((hit) => {
    if (resultSample[hit.additional[parameter]]) {
      resultSample[hit.additional[parameter]].push(hit.value);
    } else {
      resultSample[hit.additional[parameter]] = [hit.value];
    }
  });

  let undefinedValueOutput = '';
  Object.keys(resultSample).forEach((paramValue) => {
    const nextValueOutput = `\n    ${paramValue === 'undefined' ? 'not set' : paramValue}: p25=${quantile(
      resultSample[paramValue],
      0.25
    )} p50=${quantile(resultSample[paramValue], 0.5)} p75=${quantile(resultSample[paramValue], 0.75)} p90=${quantile(
      resultSample[paramValue],
      0.95
    )} hits=${resultSample[paramValue].length}`;

    if (paramValue === 'undefined') {
      undefinedValueOutput = nextValueOutput;
    } else {
      output += ` ${nextValueOutput}`;
    }
  });

  return `${output}${undefinedValueOutput}`;
}

// рассчитать метрику за выбранный день
function calcMetricByDate(data, page, name, date) {
  let sampleData = data
    .filter((item) => item.page === page && item.name === name && item.date === date)
    .map((item) => item.value);

  return `Event ${name}\nPage ${page}\n${date}:
    p25=${quantile(sampleData, 0.25)} p50=${quantile(sampleData, 0.5)}
    p75=${quantile(sampleData, 0.75)} p90=${quantile(sampleData, 0.95)}
    hits=${sampleData.length}`;
}

fetch(`https://shri.yandex/hw/stat/data?counterId=${COUNTER_ID}`)
  .then((res) => res.json())
  .then((result) => {
    let data = prepareData(result);
    document.querySelector('#output').textContent = `Metrics:
- domReady - time from the start of the page load to the end of the DOMContentLoaded event
- modalOpenDelay - the difference between the expected time of the modal opening (500 ms)
  and the real time from clicking on the opening button to the completion of the opening animation
- firstTenScrollTicksTiming - the speed of the first ten scroll handlers firing
- settingsSubmit - time of settings form handling from click on the submitter to the request sending
- settingsChange - time of settings changing from click on the submitter to the response getting

Parameters:
- env - in which environment the metric was obtained (production / development)
- platform - device type (desktop / touch)
- os - operating system (iOS / Android / Linux / Windows / MacOS)
- gmt - timezone offset in GMT format (e.g. +3:00)
- language - user's preferred language (e.g. ru-RU)
- hasAdBlockers - does the user have ad blockers installed (true / false)
- dpr - device pixel ratio (e.g. 2)
    
    
Report examples:

# Metrics for certain date:
${calcMetricByDate(data, 'builds-list', 'modalOpenDelay', '2021-07-11')}

# Metrics for certain period:
${showMetricByPeriod(data, 'build-logs', 'domReady', '2021-07-11', '2021-07-28')}

# Metrics for certain session:
${showSession(data, '510267335695', '2021-07-11')}

# Metric comparison depending on passed parameter:
${compareMetric(data, 'builds-list', 'os', 'domReady', '2021-07-11')}

${compareMetric(data, 'builds-list', 'gmt', 'modalOpenDelay', '2021-07-11')}

${compareMetric(data, 'settings', 'dpr', 'settingsSubmit', '2021-07-11')}

${compareMetric(data, 'settings', 'platform', 'settingsChange', '2021-07-11')}`;
  });
