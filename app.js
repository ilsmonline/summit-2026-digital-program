'use strict';
const program = window.SUMMIT;
const list = document.getElementById('schedule-list');
function element(tag, className, value) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (value) node.textContent = value;
  return node;
}
function displayTime(time) {
  const [hour, minute] = time.split(':').map(Number);
  return `${hour % 12 || 12}:${String(minute).padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`;
}
function renderDay(key) {
  const day = program.days[key];
  document.getElementById('day-title').textContent = day.label;
  document.querySelectorAll('[data-day]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.day === key)));
  list.replaceChildren();
  day.events.forEach(event => {
    const row = element('article', `event${event.featured ? ' featured' : ''}${event.tracks ? ' breakout' : ''}`);
    const time = element('time', 'event-time', displayTime(event.time));
    time.dateTime = `${day.date}T${event.time}`;
    const details = element('div', 'event-details');
    details.append(element('h4', '', event.title));
    if (event.location) {
      const location = element('a', 'event-location', event.location + ' ↗');
      location.href = '#map';
      details.append(location);
    }
    if (event.speaker) details.append(element('p', 'event-speaker', event.speaker));
    if (event.description) details.append(element('p', 'event-speaker', event.description));
    if (event.spotlight) details.append(element('p', 'spotlight', `5-minute spotlight · ${event.spotlight}`));
    if (event.tracks) {
      const tracks = element('div', 'tracks');
      event.tracks.forEach(track => {
        const card = element('div', 'track');
        card.append(element('h5', '', track.name), element('p', 'track-speaker', track.speaker));
        const location = element('a', 'track-location', track.location + ' ↗');
        location.href = '#map';
        card.append(location);
        if (track.spotlight) card.append(element('p', 'spotlight', `5-minute spotlight · ${track.spotlight}`));
        tracks.append(card);
      });
      details.append(tracks);
    }
    row.append(time, details);
    list.append(row);
  });
}
document.querySelectorAll('[data-day]').forEach(button => button.addEventListener('click', () => renderDay(button.dataset.day)));
renderDay('monday');
program.resources.forEach(resource => {
  const url = new URL(resource.url, window.location.href);
  if (!['https:', 'http:', 'file:'].includes(url.protocol)) return;
  const card = element('a', 'resource-card');
  card.href = url.href;
  card.target = '_blank';
  card.rel = 'noopener';
  card.append(element('h3', '', resource.title), element('p', '', resource.description), element('span', 'resource-action', 'Open resource ↗'));
  document.getElementById('resource-list').append(card);
});
