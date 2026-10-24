const eventsList = document.querySelector("#events-list");
const sanity = window.KAVA_SANITY;
const fallbackFlyer = "./assets/KavaKoru_bartop.jpeg";
const logo = "./assets/KavaKoru_Logo.jpeg";

function makeElement(tagName, className, text) {
  const element = document.createElement(tagName);
  element.className = className;
  if (text) element.textContent = text;
  return element;
}

function displayDate(dateValue) {
  const localDate = new Date(`${dateValue}T12:00:00`);
  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(localDate);
}

function addDateTime(parent, label, value, flyer = false) {
  if (flyer) {
    const row = makeElement("p", "", label);
    row.append(makeElement("span", "", value));
    parent.append(row);
    return;
  }

  parent.append(makeElement("span", "", label), document.createTextNode(value));
}

function createEventCard(event) {
  const article = makeElement("article", "event");
  const flyer = makeElement("div", "event__flyer");
  const photo = makeElement("img", "event__photo");
  photo.src = event.flyerUrl || fallbackFlyer;
  photo.alt = event.flyerAlt || `Flyer for ${event.title}`;
  photo.loading = "lazy";
  flyer.append(photo);

  const flyerContent = makeElement("div", "event__flyer-content");
  const logoImage = makeElement("img", "event__logo");
  logoImage.src = logo;
  logoImage.alt = "Kava Koru";
  flyerContent.append(logoImage);
  flyerContent.append(
    makeElement("p", "event__flyer-label", "Upcoming at Kava Koru"),
  );
  flyerContent.append(makeElement("h3", "event__flyer-title", event.title));

  const flyerMeta = makeElement("div", "event__flyer-meta");
  addDateTime(flyerMeta, "Date", displayDate(event.date), true);
  addDateTime(flyerMeta, "Time", event.time, true);
  flyerContent.append(flyerMeta);
  flyer.append(flyerContent);

  const details = makeElement("div", "event__details");
  details.append(makeElement("p", "event__eyebrow", "Save the date"));
  details.append(makeElement("h3", "event__name", event.title));
  details.append(makeElement("p", "event__description", event.description));

  const schedule = makeElement("div", "event__schedule");
  addDateTime(schedule, "Date", displayDate(event.date));
  addDateTime(schedule, "Time", event.time);
  details.append(schedule);

  article.append(flyer, details);
  return article;
}

async function loadEvents() {
  if (!sanity || sanity.projectId === "YOUR_SANITY_PROJECT_ID") {
    eventsList.replaceChildren(
      makeElement(
        "p",
        "events__status",
        "Upcoming events will be announced soon.",
      ),
    );
    console.info(
      "Set your Sanity project ID in events-config.js to load events.",
    );
    return;
  }

  const now = new Date();
  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
  const query =
    '*[_type == "event" && date >= $today] | order(date asc) { _id, title, date, time, description, "flyerUrl": flyer.asset->url, "flyerAlt": flyer.alt }';
  const params = new URLSearchParams({
    query,
    $today: JSON.stringify(today),
    perspective: "published",
  });
  const endpoint = `https://${sanity.projectId}.api.sanity.io/v${sanity.apiVersion}/data/query/${sanity.dataset}?${params}`;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error(`Sanity returned ${response.status}`);

    const { result } = await response.json();
    if (!result.length) {
      eventsList.replaceChildren(
        makeElement(
          "p",
          "events__status",
          "No upcoming events are scheduled right now.",
        ),
      );
      return;
    }

    eventsList.replaceChildren(...result.map(createEventCard));
  } catch (error) {
    console.error("Could not load upcoming events:", error);
    eventsList.replaceChildren(
      makeElement(
        "p",
        "events__status",
        "Events are temporarily unavailable. Please check back soon.",
      ),
    );
  }
}

loadEvents();
