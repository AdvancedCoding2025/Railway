// Configuration object
const config = {
  defaultCoachType: 'chair-car',
  totalSeats: {
    'chair-car': 78,
    '2s': 108,
    '2a': 54,
    '3a': 72
  },
  prebookedSeats: {
    'chair-car': ['1A', '1B', '3D', '5E', '7A', '12C', '15B'],
    '2s': ['2A', '2B', '4D', '6F', '8A', '10C', '13E'],
    '2a': ['1LB', '3UB', '5SL', '8LB', '12UB', '15SU'],
    '3a': ['2MB', '4UB', '7SL', '9LB', '11MB', '14SU', '18UB']
  }
};

// Global state
let currentCoachType = config.defaultCoachType;
let selectedSeats = [];
let maxPeople = 1;
let seatData = {};

// DOM elements
const passengerNameInput = document.getElementById('passenger-name');
const numPeopleInput = document.getElementById('num-people');
const coachClassSelect = document.getElementById('coach-class');
const seatMapContainer = document.getElementById('seat-map');
const selectionCounter = document.getElementById('selection-counter');
const summaryName = document.getElementById('summary-name');
const summaryClass = document.getElementById('summary-class');
const summarySeats = document.getElementById('summary-seats');
const clearBtn = document.getElementById('clear-btn');
const confirmBtn = document.getElementById('confirm-btn');

// Event listeners
numPeopleInput.addEventListener('input', handlePeopleCountChange);
coachClassSelect.addEventListener('change', handleCoachTypeChange);
passengerNameInput.addEventListener('input', updateSummary);
clearBtn.addEventListener('click', clearSelection);
confirmBtn.addEventListener('click', confirmBooking);

// Initialize the application
init();

function init() {
  maxPeople = parseInt(numPeopleInput.value);
  generateSeatMap();
  updateSummary();
  setupKeyboardNavigation();
}

function handlePeopleCountChange() {
  maxPeople = parseInt(numPeopleInput.value);
  
  // Remove excess selected seats if count is reduced
  if (selectedSeats.length > maxPeople) {
    selectedSeats = selectedSeats.slice(0, maxPeople);
    renderSeats();
  }
  
  updateCounter();
  updateSummary();
}

function handleCoachTypeChange() {
  currentCoachType = coachClassSelect.value;
  selectedSeats = [];
  generateSeatMap();
  updateSummary();
}

function generateSeatMap() {
  seatData = {};
  seatMapContainer.innerHTML = '';
  
  const totalSeats = config.totalSeats[currentCoachType];
  const prebookedSeats = config.prebookedSeats[currentCoachType];
  
  switch (currentCoachType) {
    case 'chair-car':
      generateChairCarLayout(totalSeats, prebookedSeats);
      break;
    case '2s':
      generate2SLayout(totalSeats, prebookedSeats);
      break;
    case '2a':
      generate2ALayout(totalSeats, prebookedSeats);
      break;
    case '3a':
      generate3ALayout(totalSeats, prebookedSeats);
      break;
  }
  
  updateCounter();
}

function generateChairCarLayout(totalSeats, prebookedSeats) {
  const rows = Math.ceil(totalSeats / 5);
  let seatNumber = 1;
  
  for (let row = 0; row < rows && seatNumber <= totalSeats; row++) {
    const seatRow = document.createElement('div');
    seatRow.className = 'seat-row';
    
    // Left side (3 seats)
    for (let i = 0; i < 3 && seatNumber <= totalSeats; i++) {
      const seatId = `${row + 1}${String.fromCharCode(65 + i)}`;
      const seat = createSeat(seatId, seatNumber.toString(), prebookedSeats.includes(seatId));
      seatRow.appendChild(seat);
      seatNumber++;
    }
    
    // Aisle
    if (seatNumber <= totalSeats) {
      const aisle = document.createElement('div');
      aisle.className = 'aisle';
      seatRow.appendChild(aisle);
    }
    
    // Right side (2 seats)
    for (let i = 0; i < 2 && seatNumber <= totalSeats; i++) {
      const seatId = `${row + 1}${String.fromCharCode(68 + i)}`;
      const seat = createSeat(seatId, seatNumber.toString(), prebookedSeats.includes(seatId));
      seatRow.appendChild(seat);
      seatNumber++;
    }
    
    seatMapContainer.appendChild(seatRow);
  }
}

function generate2SLayout(totalSeats, prebookedSeats) {
  const rows = Math.ceil(totalSeats / 6);
  let seatNumber = 1;
  
  for (let row = 0; row < rows && seatNumber <= totalSeats; row++) {
    const seatRow = document.createElement('div');
    seatRow.className = 'seat-row';
    
    // Left side (3 seats)
    for (let i = 0; i < 3 && seatNumber <= totalSeats; i++) {
      const seatId = `${row + 1}${String.fromCharCode(65 + i)}`;
      const seat = createSeat(seatId, seatNumber.toString(), prebookedSeats.includes(seatId));
      seatRow.appendChild(seat);
      seatNumber++;
    }
    
    // Aisle
    if (seatNumber <= totalSeats) {
      const aisle = document.createElement('div');
      aisle.className = 'aisle';
      seatRow.appendChild(aisle);
    }
    
    // Right side (3 seats)
    for (let i = 0; i < 3 && seatNumber <= totalSeats; i++) {
      const seatId = `${row + 1}${String.fromCharCode(68 + i)}`;
      const seat = createSeat(seatId, seatNumber.toString(), prebookedSeats.includes(seatId));
      seatRow.appendChild(seat);
      seatNumber++;
    }
    
    seatMapContainer.appendChild(seatRow);
  }
}

function generate2ALayout(totalSeats, prebookedSeats) {
  const bays = Math.ceil(totalSeats / 6);
  let seatNumber = 1;
  
  for (let bay = 0; bay < bays && seatNumber <= totalSeats; bay++) {
    const seatRow = document.createElement('div');
    seatRow.className = 'seat-row';
    
    // Main berth bay (4 berths)
    const mainBay = document.createElement('div');
    mainBay.className = 'berth-bay';
    
    // Lower berths
    const lowerStack = document.createElement('div');
    lowerStack.className = 'berth-stack';
    
    if (seatNumber <= totalSeats) {
      const lbId = `${seatNumber}LB`;
      const lb1 = createSeat(lbId, seatNumber.toString(), prebookedSeats.includes(lbId), 'LB');
      lowerStack.appendChild(lb1);
      seatNumber++;
    }
    
    if (seatNumber <= totalSeats) {
      const lbId = `${seatNumber}LB`;
      const lb2 = createSeat(lbId, seatNumber.toString(), prebookedSeats.includes(lbId), 'LB');
      lowerStack.appendChild(lb2);
      seatNumber++;
    }
    
    mainBay.appendChild(lowerStack);
    
    // Upper berths
    const upperStack = document.createElement('div');
    upperStack.className = 'berth-stack';
    
    if (seatNumber <= totalSeats) {
      const ubId = `${seatNumber}UB`;
      const ub1 = createSeat(ubId, seatNumber.toString(), prebookedSeats.includes(ubId), 'UB');
      upperStack.appendChild(ub1);
      seatNumber++;
    }
    
    if (seatNumber <= totalSeats) {
      const ubId = `${seatNumber}UB`;
      const ub2 = createSeat(ubId, seatNumber.toString(), prebookedSeats.includes(ubId), 'UB');
      upperStack.appendChild(ub2);
      seatNumber++;
    }
    
    mainBay.appendChild(upperStack);
    seatRow.appendChild(mainBay);
    
    // Aisle
    const aisle = document.createElement('div');
    aisle.className = 'aisle';
    seatRow.appendChild(aisle);
    
    // Side berths
    const sideBay = document.createElement('div');
    sideBay.className = 'berth-bay';
    
    if (seatNumber <= totalSeats) {
      const slId = `${seatNumber}SL`;
      const sl = createSeat(slId, seatNumber.toString(), prebookedSeats.includes(slId), 'SL');
      sideBay.appendChild(sl);
      seatNumber++;
    }
    
    if (seatNumber <= totalSeats) {
      const suId = `${seatNumber}SU`;
      const su = createSeat(suId, seatNumber.toString(), prebookedSeats.includes(suId), 'SU');
      sideBay.appendChild(su);
      seatNumber++;
    }
    
    seatRow.appendChild(sideBay);
    seatMapContainer.appendChild(seatRow);
  }
}

function generate3ALayout(totalSeats, prebookedSeats) {
  const bays = Math.ceil(totalSeats / 8);
  let seatNumber = 1;
  
  for (let bay = 0; bay < bays && seatNumber <= totalSeats; bay++) {
    const seatRow = document.createElement('div');
    seatRow.className = 'seat-row';
    
    // Main berth bay (6 berths)
    const mainBay = document.createElement('div');
    mainBay.className = 'berth-bay';
    
    // Lower berths
    const lowerStack = document.createElement('div');
    lowerStack.className = 'berth-stack';
    
    if (seatNumber <= totalSeats) {
      const lbId = `${seatNumber}LB`;
      const lb1 = createSeat(lbId, seatNumber.toString(), prebookedSeats.includes(lbId), 'LB');
      lowerStack.appendChild(lb1);
      seatNumber++;
    }
    
    if (seatNumber <= totalSeats) {
      const lbId = `${seatNumber}LB`;
      const lb2 = createSeat(lbId, seatNumber.toString(), prebookedSeats.includes(lbId), 'LB');
      lowerStack.appendChild(lb2);
      seatNumber++;
    }
    
    mainBay.appendChild(lowerStack);
    
    // Middle berths
    const middleStack = document.createElement('div');
    middleStack.className = 'berth-stack';
    
    if (seatNumber <= totalSeats) {
      const mbId = `${seatNumber}MB`;
      const mb1 = createSeat(mbId, seatNumber.toString(), prebookedSeats.includes(mbId), 'MB');
      middleStack.appendChild(mb1);
      seatNumber++;
    }
    
    if (seatNumber <= totalSeats) {
      const mbId = `${seatNumber}MB`;
      const mb2 = createSeat(mbId, seatNumber.toString(), prebookedSeats.includes(mbId), 'MB');
      middleStack.appendChild(mb2);
      seatNumber++;
    }
    
    mainBay.appendChild(middleStack);
    
    // Upper berths
    const upperStack = document.createElement('div');
    upperStack.className = 'berth-stack';
    
    if (seatNumber <= totalSeats) {
      const ubId = `${seatNumber}UB`;
      const ub1 = createSeat(ubId, seatNumber.toString(), prebookedSeats.includes(ubId), 'UB');
      upperStack.appendChild(ub1);
      seatNumber++;
    }
    
    if (seatNumber <= totalSeats) {
      const ubId = `${seatNumber}UB`;
      const ub2 = createSeat(ubId, seatNumber.toString(), prebookedSeats.includes(ubId), 'UB');
      upperStack.appendChild(ub2);
      seatNumber++;
    }
    
    mainBay.appendChild(upperStack);
    seatRow.appendChild(mainBay);
    
    // Aisle
    const aisle = document.createElement('div');
    aisle.className = 'aisle';
    seatRow.appendChild(aisle);
    
    // Side berths
    const sideBay = document.createElement('div');
    sideBay.className = 'berth-bay';
    
    if (seatNumber <= totalSeats) {
      const slId = `${seatNumber}SL`;
      const sl = createSeat(slId, seatNumber.toString(), prebookedSeats.includes(slId), 'SL');
      sideBay.appendChild(sl);
      seatNumber++;
    }
    
    if (seatNumber <= totalSeats) {
      const suId = `${seatNumber}SU`;
      const su = createSeat(suId, seatNumber.toString(), prebookedSeats.includes(suId), 'SU');
      sideBay.appendChild(su);
      seatNumber++;
    }
    
    seatRow.appendChild(sideBay);
    seatMapContainer.appendChild(seatRow);
  }
}

function createSeat(seatId, displayNumber, isBooked = false, berthType = '') {
  const seat = document.createElement('button');
  seat.className = 'seat';
  seat.textContent = displayNumber;
  seat.setAttribute('data-seat-id', seatId);
  seat.setAttribute('tabindex', '0');
  
  // Create tooltip text
  let tooltipText = `Seat ${seatId}`;
  if (berthType) {
    tooltipText += ` (${berthType})`;
  }
  seat.setAttribute('title', tooltipText);
  seat.setAttribute('aria-label', tooltipText);
  
  if (isBooked) {
    seat.classList.add('booked');
    seat.setAttribute('aria-disabled', 'true');
  } else {
    seat.addEventListener('click', () => handleSeatClick(seatId));
  }
  
  seatData[seatId] = {
    element: seat,
    berthType: berthType,
    isBooked: isBooked
  };
  
  return seat;
}

function handleSeatClick(seatId) {
  if (seatData[seatId].isBooked) return;
  
  const isSelected = selectedSeats.includes(seatId);
  
  if (isSelected) {
    // Deselect seat
    selectedSeats = selectedSeats.filter(id => id !== seatId);
    seatData[seatId].element.classList.remove('selected');
  } else {
    // Select seat if under limit
    if (selectedSeats.length < maxPeople) {
      selectedSeats.push(seatId);
      seatData[seatId].element.classList.add('selected');
    } else {
      // Show feedback that limit is reached
      showMessage('Maximum seats selected for the number of people!', 'warning');
    }
  }
  
  updateCounter();
  updateSummary();
}

function updateCounter() {
  selectionCounter.textContent = `Selected ${selectedSeats.length} / ${maxPeople}`;
}

function updateSummary() {
  // Update passenger name
  summaryName.textContent = passengerNameInput.value || '-';
  
  // Update coach class
  const coachText = coachClassSelect.options[coachClassSelect.selectedIndex].text;
  summaryClass.textContent = coachText;
  
  // Update selected seats
  if (selectedSeats.length === 0) {
    summarySeats.innerHTML = 'None selected';
  } else {
    const seatTags = selectedSeats.map(seatId => {
      const berthType = seatData[seatId]?.berthType || '';
      const displayText = berthType ? `${seatId}` : seatId;
      return `<span class="seat-tag">${displayText}</span>`;
    }).join('');
    summarySeats.innerHTML = seatTags;
  }
  
  // Enable/disable confirm button
  const hasName = passengerNameInput.value.trim().length > 0;
  const hasCorrectSeats = selectedSeats.length === maxPeople;
  confirmBtn.disabled = !hasName || !hasCorrectSeats;
}

function clearSelection() {
  selectedSeats.forEach(seatId => {
    if (seatData[seatId]) {
      seatData[seatId].element.classList.remove('selected');
    }
  });
  selectedSeats = [];
  updateCounter();
  updateSummary();
  showMessage('Selection cleared!', 'info');
}

function confirmBooking() {
  const passengerName = passengerNameInput.value.trim();
  
  if (!passengerName) {
    showMessage('Please enter passenger name!', 'error');
    passengerNameInput.focus();
    return;
  }
  
  if (selectedSeats.length !== maxPeople) {
    showMessage(`Please select exactly ${maxPeople} seat(s)!`, 'error');
    return;
  }
  
  // Simulate booking confirmation
  const coachText = coachClassSelect.options[coachClassSelect.selectedIndex].text;
  const seatList = selectedSeats.map(seatId => {
    const berthType = seatData[seatId]?.berthType || '';
    return berthType ? `${seatId} (${berthType})` : seatId;
  }).join(', ');
  
  const confirmationMessage = `Booking Confirmed!\n\nPassenger: ${passengerName}\nCoach: ${coachText}\nSeats: ${seatList}`;
  
  alert(confirmationMessage);
  
  // Mark selected seats as booked and reset
  selectedSeats.forEach(seatId => {
    if (seatData[seatId]) {
      seatData[seatId].element.classList.remove('selected');
      seatData[seatId].element.classList.add('booked');
      seatData[seatId].element.setAttribute('aria-disabled', 'true');
      seatData[seatId].isBooked = true;
      seatData[seatId].element.removeEventListener('click', () => handleSeatClick(seatId));
    }
  });
  
  selectedSeats = [];
  passengerNameInput.value = '';
  updateCounter();
  updateSummary();
  showMessage('Booking confirmed successfully!', 'success');
}

function showMessage(message, type = 'info') {
  // Create a simple toast notification
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 8px;
    color: white;
    font-weight: 600;
    z-index: 10000;
    opacity: 0;
    transform: translateY(-20px);
    transition: all 0.3s ease;
  `;
  
  // Set background color based on type
  const colors = {
    success: '#238636',
    error: '#f85149',
    warning: '#fb8500',
    info: '#58a6ff'
  };
  toast.style.backgroundColor = colors[type] || colors.info;
  
  document.body.appendChild(toast);
  
  // Animate in
  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  }, 10);
  
  // Remove after 3 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-20px)';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3000);
}

function setupKeyboardNavigation() {
  document.addEventListener('keydown', (e) => {
    const focusedElement = document.activeElement;
    
    if (!focusedElement.classList.contains('seat')) return;
    
    const seats = Array.from(document.querySelectorAll('.seat'));
    const currentIndex = seats.indexOf(focusedElement);
    let newIndex = currentIndex;
    
    switch (e.key) {
      case 'ArrowLeft':
        newIndex = Math.max(0, currentIndex - 1);
        e.preventDefault();
        break;
      case 'ArrowRight':
        newIndex = Math.min(seats.length - 1, currentIndex + 1);
        e.preventDefault();
        break;
      case 'ArrowUp':
        // Find seat in row above
        const currentRow = focusedElement.closest('.seat-row');
        const previousRow = currentRow.previousElementSibling;
        if (previousRow) {
          const seatInPreviousRow = previousRow.querySelector('.seat');
          if (seatInPreviousRow) {
            newIndex = seats.indexOf(seatInPreviousRow);
          }
        }
        e.preventDefault();
        break;
      case 'ArrowDown':
        // Find seat in row below
        const currentRowDown = focusedElement.closest('.seat-row');
        const nextRow = currentRowDown.nextElementSibling;
        if (nextRow) {
          const seatInNextRow = nextRow.querySelector('.seat');
          if (seatInNextRow) {
            newIndex = seats.indexOf(seatInNextRow);
          }
        }
        e.preventDefault();
        break;
      case 'Enter':
      case ' ':
        const seatId = focusedElement.getAttribute('data-seat-id');
        if (seatId) {
          handleSeatClick(seatId);
        }
        e.preventDefault();
        break;
    }
    
    if (newIndex !== currentIndex && seats[newIndex]) {
      seats[newIndex].focus();
    }
  });
}

function renderSeats() {
  // Update visual state of all seats
  selectedSeats.forEach(seatId => {
    if (seatData[seatId]) {
      seatData[seatId].element.classList.add('selected');
    }
  });
  
  Object.keys(seatData).forEach(seatId => {
    if (!selectedSeats.includes(seatId)) {
      seatData[seatId].element.classList.remove('selected');
    }
  });
}