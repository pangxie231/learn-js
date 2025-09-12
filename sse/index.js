const evtSource = new EventSource('http://localhost:3000/sse')

evtSource.onmessage = (event)=> {
  const newElement = document.createElement('li')
  const eventList = document.getElementById('list')

  newElement.textContent = `message: ${event.data}`
  eventList.append(newElement)
}