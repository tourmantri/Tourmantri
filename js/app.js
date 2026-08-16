// ==========================================
// TOAST NOTIFICATIONS MODULE
// ==========================================
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  let icon = '🔔';
  if (type === 'success') icon = '✅';
  else if (type === 'error') icon = '❌';
  else if (type === 'warning') icon = '⚠️';

  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-message">${message}</span>
  `;

  container.appendChild(toast);
  
  // Force reflow and show
  setTimeout(() => toast.classList.add('show'), 10);

  // Auto remove toast
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ==========================================
// BOOKING MODULE
// ==========================================
function initBookingModule() {
  const bookingModal = document.getElementById('booking-modal');
  const closeBtn = bookingModal?.querySelector('.modal-close-btn');
  const bookingForm = document.getElementById('booking-form');
  const guestsInput = document.getElementById('booking-guests');
  const durationInput = document.getElementById('booking-duration');

  if (!bookingModal || !bookingForm) return;

  let currentPackage = null;

  // Handle closing modal
  closeBtn?.addEventListener('click', () => {
    bookingModal.classList.remove('active');
  });

  bookingModal.addEventListener('click', (e) => {
    if (e.target === bookingModal) {
      bookingModal.classList.remove('active');
    }
  });

  // Handle price recalculations
  const recalculatePrice = () => {
    if (!currentPackage) return;
    
    const guests = parseInt(guestsInput.value) || 1;
    const duration = parseInt(durationInput.value) || currentPackage.duration;

    const basePrice = currentPackage.price * guests * (duration / currentPackage.duration);
    const serviceFee = basePrice * 0.08;
    const total = basePrice + serviceFee;

    document.getElementById('summary-base-price').textContent = `₹${Math.round(basePrice).toLocaleString('en-IN')}`;
    document.getElementById('summary-service-fee').textContent = `₹${Math.round(serviceFee).toLocaleString('en-IN')}`;
    document.getElementById('summary-total-price').textContent = `₹${Math.round(total).toLocaleString('en-IN')}`;
  };

  guestsInput?.addEventListener('input', recalculatePrice);
  durationInput?.addEventListener('input', recalculatePrice);

  // Submit booking
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!currentPackage) return;

    const travelerName = document.getElementById('booking-name').value.trim();
    const travelerEmail = document.getElementById('booking-email').value.trim();
    const travelDate = document.getElementById('booking-date').value;
    const guests = parseInt(guestsInput.value) || 1;
    const duration = parseInt(durationInput.value) || currentPackage.duration;

    if (!travelerName || !travelerEmail || !travelDate) {
      showToast('Please fill in all details', 'error');
      return;
    }

    const basePrice = currentPackage.price * guests * (duration / currentPackage.duration);
    const serviceFee = basePrice * 0.08;
    const totalPrice = Math.round(basePrice + serviceFee);

    // Save reservation to LocalStorage
    const newBooking = {
      id: 'BKG-' + Math.floor(Math.random() * 900000 + 100000),
      packageId: currentPackage.id,
      title: currentPackage.title,
      location: currentPackage.location,
      image: currentPackage.image,
      travelerName,
      travelerEmail,
      travelDate,
      guests,
      duration,
      totalPrice,
      status: 'confirmed',
      createdDate: new Date().toISOString().split('T')[0]
    };

    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    bookings.push(newBooking);
    localStorage.setItem('bookings', JSON.stringify(bookings));

    // Success Actions
    bookingModal.classList.remove('active');
    bookingForm.reset();
    showToast(`Inquiry registered! Opening WhatsApp to send your request...`, 'success');

    // Construct WhatsApp message details
    const whatsappMessage = `Hello Tourmantri! I would like to inquire about a tour package:

*Package:* ${currentPackage.title}
*Location:* ${currentPackage.location}
*Duration:* ${duration} Days
*Departure Date:* ${travelDate}
*Travelers:* ${guests} Guest(s)
*Estimated Price:* ₹${totalPrice.toLocaleString('en-IN')}

*My Details:*
*Name:* ${travelerName}
*Email:* ${travelerEmail}

Please confirm availability. Thank you!`;

    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/918200453651?text=${encodedMessage}`;
    
    // Redirect/Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');

    // Trigger update dashboard event
    window.dispatchEvent(new CustomEvent('bookingsUpdated'));
  });

  // Listen to open booking event globally
  window.addEventListener('openBookingModal', (e) => {
    const pkg = e.detail;
    if (!pkg) return;

    currentPackage = pkg;
    document.getElementById('modal-package-title').textContent = `Book: ${pkg.title}`;
    
    // Reset defaults
    document.getElementById('booking-duration').value = pkg.duration;
    document.getElementById('booking-guests').value = 1;
    
    // Set min date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('booking-date').min = tomorrow.toISOString().split('T')[0];

    recalculatePrice();
    bookingModal.classList.add('active');
  });
}

// ==========================================
// DASHBOARD MODULE
// ==========================================
function initDashboardModule() {
  const sidebarItems = document.querySelectorAll('.sidebar-item');
  const sections = document.querySelectorAll('.dashboard-section');
  const bookingSelect = document.getElementById('itinerary-booking-select');
  const addActivityBtn = document.getElementById('btn-add-activity');
  const profileForm = document.getElementById('profile-settings-form');

  // Tab switching
  sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
      const sectionId = item.getAttribute('data-section');
      if (!sectionId) return;

      sidebarItems.forEach(i => i.classList.remove('active'));
      sections.forEach(s => s.classList.remove('active'));

      item.classList.add('active');
      const targetSec = document.getElementById(`${sectionId}-section`);
      if (targetSec) targetSec.classList.add('active');

      // Double-check if we need to draw chart
      if (sectionId === 'overview') {
        renderTravelChart();
      }
    });
  });

  // Load profile details from storage
  const loadProfileSettings = () => {
    const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    const defaultProfile = {
      name: 'Elena Rostova',
      email: 'elena.rostova@tourmantri.com',
      tier: 'Explorer Elite',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      preferences: ['beach', 'adventure']
    };

    const currentProfile = { ...defaultProfile, ...profile };
    
    // Update header/sidebar UI
    document.querySelectorAll('.sidebar-profile-name').forEach(el => el.textContent = currentProfile.name);
    document.querySelectorAll('.sidebar-avatar').forEach(el => el.src = currentProfile.avatar);
    
    // Fill settings inputs
    const nameInput = document.getElementById('profile-name');
    const emailInput = document.getElementById('profile-email');
    const avatarSelect = document.getElementById('profile-avatar-select');
    
    if (nameInput) nameInput.value = currentProfile.name;
    if (emailInput) emailInput.value = currentProfile.email;
    if (avatarSelect) avatarSelect.value = currentProfile.avatar;

    // Check checkboxes
    currentProfile.preferences.forEach(pref => {
      const checkbox = document.querySelector(`input[name="pref-${pref}"]`);
      if (checkbox) checkbox.checked = true;
    });
  };

  // Save profile settings
  profileForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('profile-name').value.trim();
    const email = document.getElementById('profile-email').value.trim();
    const avatar = document.getElementById('profile-avatar-select').value;
    
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    const preferences = Array.from(checkboxes).map(cb => cb.name.replace('pref-', ''));

    if (!name || !email) {
      showToast('Name and email are required', 'error');
      return;
    }

    const updatedProfile = { name, email, avatar, preferences };
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    
    // Apply changes
    loadProfileSettings();
    showToast('Profile updated successfully!', 'success');
  });

  // Calculate and display overview metrics
  const updateOverviewMetrics = () => {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');

    const activeBookings = bookings.filter(b => b.status === 'confirmed');
    const totalSpent = bookings.reduce((sum, b) => b.status === 'confirmed' ? sum + b.totalPrice : sum, 0);
    
    // Base formula for travel points: 10% of total spent
    const loyaltyPoints = Math.round(totalSpent * 0.1);

    document.getElementById('stat-bookings-count').textContent = activeBookings.length;
    document.getElementById('stat-wishlist-count').textContent = wishlist.length;
    document.getElementById('stat-points').textContent = loyaltyPoints.toLocaleString();
    document.getElementById('stat-spent').textContent = `₹${totalSpent.toLocaleString('en-IN')}`;

    // Update countdown timer to next confirmed booking
    updateCountdown(activeBookings);
  };

  // Countdown timer logic
  let countdownInterval = null;
  const updateCountdown = (activeBookings) => {
    if (countdownInterval) clearInterval(countdownInterval);

    const countdownBanner = document.getElementById('upcoming-countdown-banner');
    if (!countdownBanner) return;

    if (activeBookings.length === 0) {
      countdownBanner.style.display = 'none';
      return;
    }

    // Find nearest future booking
    const now = new Date();
    const futureBookings = activeBookings
      .map(b => ({ ...b, dateObj: new Date(b.travelDate) }))
      .filter(b => b.dateObj > now)
      .sort((a, b) => a.dateObj - b.dateObj);

    if (futureBookings.length === 0) {
      countdownBanner.style.display = 'none';
      return;
    }

    countdownBanner.style.display = 'flex';
    const nextBooking = futureBookings[0];
    document.getElementById('countdown-dest-title').textContent = nextBooking.title;

    const timerDays = document.getElementById('timer-days');
    const timerHours = document.getElementById('timer-hours');
    const timerMins = document.getElementById('timer-mins');

    const tick = () => {
      const currentTime = new Date();
      const difference = nextBooking.dateObj - currentTime;

      if (difference <= 0) {
        clearInterval(countdownInterval);
        updateOverviewMetrics();
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);

      if (timerDays) timerDays.textContent = String(days).padStart(2, '0');
      if (timerHours) timerHours.textContent = String(hours).padStart(2, '0');
      if (timerMins) timerMins.textContent = String(minutes).padStart(2, '0');
    };

    tick();
    countdownInterval = setInterval(tick, 60000);
  };

  // Render SVG custom travel analytics chart
  const renderTravelChart = () => {
    const chartWrapper = document.getElementById('travel-svg-container');
    if (!chartWrapper) return;

    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Prepare monthly travel spending data based on bookings
    const monthlySpending = Array(12).fill(0);
    bookings.forEach(b => {
      if (b.status === 'confirmed') {
        const monthIndex = new Date(b.travelDate).getMonth();
        monthlySpending[monthIndex] += b.totalPrice;
      }
    });

    // Generate chart points
    const width = 500;
    const height = 200;
    const padding = 35;
    
    const maxVal = Math.max(...monthlySpending, 1000); // minimum scale peak
    const currentMonth = new Date().getMonth();
    
    // Select last 6 months to display
    const activeMonths = [];
    for (let i = 5; i >= 0; i--) {
      let m = currentMonth - i;
      if (m < 0) m += 12;
      activeMonths.push({ index: m, label: months[m], value: monthlySpending[m] });
    }

    const maxActiveVal = Math.max(...activeMonths.map(m => m.value), 1000);

    // Map chart points to coordinates
    const points = activeMonths.map((m, idx) => {
      const x = padding + (idx * (width - 2 * padding) / 5);
      const y = height - padding - (m.value * (height - 2 * padding) / maxActiveVal);
      return { x, y, ...m };
    });

    // Create SVG paths
    let gridLinesHTML = '';
    const yGridCount = 4;
    for (let i = 0; i <= yGridCount; i++) {
      const y = padding + (i * (height - 2 * padding) / yGridCount);
      const value = Math.round(maxActiveVal - (i * maxActiveVal / yGridCount));
      gridLinesHTML += `
        <line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" class="chart-grid-line" />
        <text x="${padding - 5}" y="${y + 4}" text-anchor="end" class="chart-axis-text">₹${value}</text>
      `;
    }

    // Line paths
    let linePath = `M ${points[0].x} ${points[0].y}`;
    let fillPath = `M ${points[0].x} ${height - padding} L ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      linePath += ` L ${points[i].x} ${points[i].y}`;
      fillPath += ` L ${points[i].x} ${points[i].y}`;
    }
    
    fillPath += ` L ${points[points.length - 1].x} ${height - padding} Z`;

    let dotsHTML = '';
    let labelsHTML = '';

    points.forEach((p) => {
      dotsHTML += `<circle cx="${p.x}" cy="${p.y}" r="5" class="chart-dot" data-val="${p.value}" />`;
      labelsHTML += `
        <text x="${p.x}" y="${height - 10}" text-anchor="middle" class="chart-axis-text">${p.label}</text>
      `;
    });

    chartWrapper.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" class="chart-svg">
        <defs>
          <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--primary)" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="var(--primary)" stop-opacity="0"/>
          </linearGradient>
        </defs>
        ${gridLinesHTML}
        <path d="${fillPath}" class="chart-gradient-fill" />
        <path d="${linePath}" class="chart-line" />
        ${dotsHTML}
        ${labelsHTML}
      </svg>
    `;
  };

  // Populate booked tours list
  const renderBookingsTable = () => {
    const tableBody = document.getElementById('bookings-table-body');
    if (!tableBody) return;

    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');

    if (bookings.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 40px;">
            No bookings found. Head over to Home/Destinations to book your first adventure!
          </td>
        </tr>
      `;
      return;
    }

    // Sort bookings (newest first)
    bookings.sort((a, b) => new Date(b.travelDate) - new Date(a.travelDate));

    tableBody.innerHTML = bookings.map(b => `
      <tr>
        <td>
          <div class="booking-dest-cell">
            <img src="${b.image}" alt="${b.title}" class="booking-dest-thumb">
            <div class="booking-dest-info">
              <h5>${b.title}</h5>
              <span>ID: ${b.id}</span>
            </div>
          </div>
        </td>
        <td>${b.travelDate}</td>
        <td>${b.duration} Days</td>
        <td>${b.guests} Guests</td>
        <td><strong>₹${b.totalPrice.toLocaleString('en-IN')}</strong></td>
        <td>
          <span class="status-badge ${b.status}">${b.status}</span>
        </td>
        <td>
          <div class="actions-cell">
            <button class="btn-icon btn-ticket" data-id="${b.id}" title="View E-Ticket">🎫</button>
            ${b.status === 'confirmed' ? `
              <button class="btn-icon delete btn-cancel-booking" data-id="${b.id}" title="Cancel Booking">🗑️</button>
            ` : ''}
          </div>
        </td>
      </tr>
    `).join('');

    // Attach button listeners
    tableBody.querySelectorAll('.btn-cancel-booking').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = btn.getAttribute('data-id');
        cancelBooking(id);
      });
    });

    tableBody.querySelectorAll('.btn-ticket').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        viewTicket(id);
      });
    });
  };

  // Cancel booking
  const cancelBooking = (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking? This action is irreversible.')) return;

    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const index = bookings.findIndex(b => b.id === bookingId);
    
    if (index !== -1) {
      bookings[index].status = 'cancelled';
      localStorage.setItem('bookings', JSON.stringify(bookings));
      showToast('Booking cancelled successfully.', 'warning');
      
      // Refresh views
      updateOverviewMetrics();
      renderBookingsTable();
      updateItinerarySelector();
    }
  };

  // View Ticket Modal popup simulation
  const viewTicket = (bookingId) => {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    const ticketOverlay = document.createElement('div');
    ticketOverlay.className = 'modal-overlay active';
    ticketOverlay.innerHTML = `
      <div class="modal-container" style="max-width: 480px; text-align: center;">
        <div class="modal-header">
          <h3>Boarding Pass / E-Ticket</h3>
          <button class="modal-close-btn">&times;</button>
        </div>
        <div style="background-color: #ffffff; color: #000000; border-radius: var(--radius-md); padding: 24px; box-shadow: var(--shadow-sm); border: 2px dashed var(--primary); text-align: left; margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #ddd; padding-bottom: 12px; margin-bottom: 12px;">
            <img src="assets/logo.png" alt="Tour Mantri Logo" class="ticket-logo-img" style="height: 38px; object-fit: contain; display: block;">
            <span style="font-weight:700; color:#555;">${booking.id}</span>
          </div>
          <div style="margin-bottom: 8px;"><strong>Dest:</strong> ${booking.title}</div>
          <div style="margin-bottom: 8px;"><strong>Traveler:</strong> ${booking.travelerName}</div>
          <div style="margin-bottom: 8px;"><strong>Date:</strong> ${booking.travelDate}</div>
          <div style="margin-bottom: 8px;"><strong>Duration / Guests:</strong> ${booking.duration} Days / ${booking.guests} Guests</div>
          <div style="margin-bottom: 12px;"><strong>Total Price Paid:</strong> ₹${booking.totalPrice.toLocaleString('en-IN')}</div>
          <div style="border-top:1px solid #ddd; padding-top: 12px; text-align:center; font-size:0.75rem; color:#777;">
            Please present this barcode on your phone at check-in.<br><br>
            <div style="letter-spacing: 0.35em; font-size: 1.5rem; font-weight: bold; background: #eee; padding: 6px;">||| | ||||| | || | |||</div>
          </div>
        </div>
        <button class="btn-primary" id="btn-close-ticket">Close Ticket</button>
      </div>
    `;

    document.body.appendChild(ticketOverlay);

    const closeActions = () => ticketOverlay.remove();
    ticketOverlay.querySelector('.modal-close-btn').addEventListener('click', closeActions);
    ticketOverlay.querySelector('#btn-close-ticket').addEventListener('click', closeActions);
    ticketOverlay.addEventListener('click', (e) => {
      if (e.target === ticketOverlay) closeActions();
    });
  };

  // Populate Wishlist items
  const renderWishlist = () => {
    const wishlistGrid = document.getElementById('wishlist-grid');
    if (!wishlistGrid) return;

    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const packages = JSON.parse(localStorage.getItem('packages') || '[]');

    if (wishlist.length === 0) {
      wishlistGrid.innerHTML = `
        <div style="grid-column: span 3; text-align: center; color: var(--text-muted); padding: 40px;">
          Your wishlist is empty. Explore our travel options and tap the heart icon to save!
        </div>
      `;
      return;
    }

    const wishlistedPackages = packages.filter(p => wishlist.includes(p.id));

    wishlistGrid.innerHTML = wishlistedPackages.map(pkg => `
      <div class="destination-card">
        <div class="card-img-wrapper" style="height: 180px;">
          <img src="${pkg.image}" alt="${pkg.title}" class="card-img">
          <span class="card-tag">${pkg.category}</span>
        </div>
        <div class="card-content" style="padding: 16px;">
          <div class="card-location">📍 ${pkg.location}</div>
          <h4 class="card-title" style="font-size:1.15rem; margin-bottom: 8px;">${pkg.title}</h4>
          <div style="display:flex; justify-content:space-between; align-items:center; border-top: 1px solid var(--border-color); padding-top: 12px; margin-top: auto;">
            <div class="card-price">
              <span class="price-value" style="font-size:1.15rem;">₹${pkg.price.toLocaleString('en-IN')}</span>
            </div>
            <div style="display:flex; gap: 8px;">
              <button class="btn-icon btn-remove-wishlist" data-id="${pkg.id}" title="Remove from Wishlist">❌</button>
              <button class="btn-primary btn-book-wishlist" data-id="${pkg.id}" style="padding: 6px 12px; font-size: 0.8rem;">Book Now</button>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    // Attach event listeners
    wishlistGrid.querySelectorAll('.btn-remove-wishlist').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        removeFromWishlist(id);
      });
    });

    wishlistGrid.querySelectorAll('.btn-book-wishlist').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const pkg = packages.find(p => p.id === id);
        if (pkg) {
          window.dispatchEvent(new CustomEvent('openBookingModal', { detail: pkg }));
        }
      });
    });
  };

  const removeFromWishlist = (pkgId) => {
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    wishlist = wishlist.filter(id => id !== pkgId);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    showToast('Removed package from wishlist', 'warning');
    
    // Reload components
    updateOverviewMetrics();
    renderWishlist();
    window.dispatchEvent(new CustomEvent('wishlistUpdated'));
  };

  // Itinerary planner interactions
  const updateItinerarySelector = () => {
    if (!bookingSelect) return;

    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed');

    if (confirmedBookings.length === 0) {
      bookingSelect.innerHTML = `<option value="">-- No Confirmed Bookings --</option>`;
      renderItineraryDays(null);
      return;
    }

    bookingSelect.innerHTML = confirmedBookings.map(b => `
      <option value="${b.id}">${b.title} (${b.travelDate})</option>
    `).join('');

    renderItineraryDays(bookingSelect.value);
  };

  bookingSelect?.addEventListener('change', () => {
    renderItineraryDays(bookingSelect.value);
  });

  const renderItineraryDays = (bookingId) => {
    const container = document.getElementById('itinerary-days-container');
    if (!container) return;

    if (!bookingId) {
      container.innerHTML = `
        <div class="itinerary-placeholder">
          <i>🗺️</i>
          <p>Book a tour to start building your custom travel itinerary schedule!</p>
        </div>
      `;
      if (addActivityBtn) addActivityBtn.style.display = 'none';
      return;
    }

    if (addActivityBtn) addActivityBtn.style.display = 'flex';

    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    // Load custom itinerary schedule or create initial default template
    const itineraries = JSON.parse(localStorage.getItem('itineraries') || '{}');
    let travelPlan = itineraries[bookingId];

    if (!travelPlan) {
      // Seed default placeholder itinerary template
      travelPlan = Array.from({ length: booking.duration }, (_, i) => ({
        day: i + 1,
        activities: [
          { time: '09:00', text: 'Hotel Breakfast & Orientation' },
          { time: '14:00', text: 'Scenic City Walk & Photography Tour' }
        ]
      }));
      itineraries[bookingId] = travelPlan;
      localStorage.setItem('itineraries', JSON.stringify(itineraries));
    }

    container.innerHTML = travelPlan.map(dayPlan => `
      <div class="itinerary-day-card">
        <div class="day-header" data-day="${dayPlan.day}">
          <h4>Day ${dayPlan.day} - Schedule</h4>
          <span>🔽</span>
        </div>
        <div class="day-content" id="day-content-${dayPlan.day}">
          <div class="day-activities-list">
            ${dayPlan.activities.length === 0 ? `
              <div style="color: var(--text-muted); font-size: 0.85rem; padding: 12px; text-align: center;">No activities planned yet. Add one!</div>
            ` : dayPlan.activities.sort((a,b) => a.time.localeCompare(b.time)).map((act, actIdx) => `
              <div class="activity-item">
                <div class="activity-time-box">
                  <span class="activity-time">${act.time}</span>
                  <span class="activity-desc">${act.text}</span>
                </div>
                <button class="btn-icon delete btn-remove-activity" data-day="${dayPlan.day}" data-idx="${actIdx}">❌</button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `).join('');

    // Hook collapsible sections
    container.querySelectorAll('.day-header').forEach(header => {
      header.addEventListener('click', () => {
        const day = header.getAttribute('data-day');
        const content = document.getElementById(`day-content-${day}`);
        if (content) {
          content.style.display = content.style.display === 'none' ? 'block' : 'none';
        }
      });
    });

    // Hook remove activities buttons
    container.querySelectorAll('.btn-remove-activity').forEach(btn => {
      btn.addEventListener('click', () => {
        const day = parseInt(btn.getAttribute('data-day'));
        const idx = parseInt(btn.getAttribute('data-idx'));
        removeActivity(bookingId, day, idx);
      });
    });
  };

  const removeActivity = (bookingId, dayNum, actIdx) => {
    const itineraries = JSON.parse(localStorage.getItem('itineraries') || '{}');
    if (!itineraries[bookingId]) return;

    const dayPlan = itineraries[bookingId].find(d => d.day === dayNum);
    if (dayPlan) {
      dayPlan.activities.splice(actIdx, 1);
      localStorage.setItem('itineraries', JSON.stringify(itineraries));
      renderItineraryDays(bookingId);
      showToast('Activity removed', 'warning');
    }
  };

  // Add customized activity overlay modal
  addActivityBtn?.addEventListener('click', () => {
    const bookingId = bookingSelect.value;
    if (!bookingId) return;

    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    const daysOptions = Array.from({ length: booking.duration }, (_, i) => `
      <option value="${i+1}">Day ${i+1}</option>
    `).join('');

    const activityOverlay = document.createElement('div');
    activityOverlay.className = 'modal-overlay active';
    activityOverlay.innerHTML = `
      <div class="modal-container" style="max-width: 400px;">
        <div class="modal-header">
          <h3>Add Schedule Activity</h3>
          <button class="modal-close-btn">&times;</button>
        </div>
        <form id="activity-add-form" class="booking-form">
          <div class="form-group">
            <label for="act-day">Select Day</label>
            <select id="act-day" class="form-control">${daysOptions}</select>
          </div>
          <div class="form-group">
            <label for="act-time">Activity Time</label>
            <input type="time" id="act-time" class="form-control" required value="10:00">
          </div>
          <div class="form-group">
            <label for="act-desc">Description</label>
            <input type="text" id="act-desc" class="form-control" placeholder="e.g. Visit Museum, Beach Dinner" required>
          </div>
          <button type="submit" class="btn-book-confirm">Add to Schedule</button>
        </form>
      </div>
    `;

    document.body.appendChild(activityOverlay);

    const closeActions = () => activityOverlay.remove();
    activityOverlay.querySelector('.modal-close-btn').addEventListener('click', closeActions);
    
    activityOverlay.querySelector('#activity-add-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const day = parseInt(document.getElementById('act-day').value);
      const time = document.getElementById('act-time').value;
      const text = document.getElementById('act-desc').value.trim();

      if (!time || !text) return;

      const itineraries = JSON.parse(localStorage.getItem('itineraries') || '{}');
      if (!itineraries[bookingId]) return;

      const dayPlan = itineraries[bookingId].find(d => d.day === day);
      if (dayPlan) {
        dayPlan.activities.push({ time, text });
        localStorage.setItem('itineraries', JSON.stringify(itineraries));
        renderItineraryDays(bookingId);
        showToast('Activity added to day itinerary schedule!', 'success');
      }

      closeActions();
    });
  });

  // Sync listener when booking has been added
  window.addEventListener('bookingsUpdated', () => {
    updateOverviewMetrics();
    renderBookingsTable();
    updateItinerarySelector();
    renderTravelChart();
  });

  // Listen to wishlist sync
  window.addEventListener('wishlistUpdated', () => {
    updateOverviewMetrics();
    renderWishlist();
  });

  // Initial load
  loadProfileSettings();
  updateOverviewMetrics();
  renderBookingsTable();
  renderWishlist();
  updateItinerarySelector();
  renderTravelChart();
}

// ==========================================
// CORE APP ROUTER
// ==========================================
const DEFAULT_PACKAGES = [
  {
    id: 'PKG-RAJASTHAN',
    title: 'Rajasthan Heritage & Desert Safari',
    location: 'Rajasthan, India',
    description: 'Explore royal forts of Jaipur, blue streets of Jodhpur, and experience camel safari camp under starry desert skies of Jaisalmer.',
    price: 8999,
    duration: 6,
    rating: 4.9,
    category: 'domestic',
    image: 'assets/rajasthan.jpg'
  },
  {
    id: 'PKG-KASHMIR',
    title: 'Kashmir Paradise Valleys',
    location: 'Kashmir, India',
    description: 'Stay in cozy houseboats on Dal Lake, walk blooming tulip gardens in Srinagar, and enjoy snow sledge in Gulmarg.',
    price: 15500,
    duration: 5,
    rating: 4.8,
    category: 'domestic',
    image: 'assets/kashmir.jpg'
  },
  {
    id: 'PKG-KERALA',
    title: 'Kerala Backwaters & Hills',
    location: 'Kerala, India',
    description: 'Cruise tranquil backwaters of Alleppey on a traditional houseboat, and stroll through mist-clad tea gardens of Munnar.',
    price: 15000,
    duration: 6,
    rating: 4.8,
    category: 'domestic',
    image: 'assets/kerala.jpg'
  },
  {
    id: 'PKG-GOA',
    title: 'Goa Beach Paradise Escapade',
    location: 'Goa, India',
    description: 'Sunbathe on gold beaches of Calangute, explore historic churches of Old Goa, and enjoy cruise dinners.',
    price: 5500,
    duration: 4,
    rating: 4.7,
    category: 'domestic',
    image: 'assets/goa.png'
  },
  {
    id: 'PKG-MAHARASHTRA',
    title: 'Maharashtra Forts & Caves Tour',
    location: 'Maharashtra, India',
    description: 'Discover Ajanta & Ellora caves, explore historic Maratha hill forts of Lonavala, and visit Mumbai sights.',
    price: 8000,
    duration: 5,
    rating: 4.8,
    category: 'domestic',
    image: 'assets/maharashtra.png'
  },
  {
    id: 'PKG-SIKKIM',
    title: 'Sikkim Himalayan Valleys & Lakes',
    location: 'Gangtok & Sikkim, India',
    description: 'Witness snowy peaks of Kanchenjunga, visit pristine Tsomgo Lake, and walk colorful Gangtok monasteries.',
    price: 20000,
    duration: 6,
    rating: 4.9,
    category: 'domestic',
    image: 'assets/sikkim.png'
  },
  {
    id: 'PKG-HIMACHAL',
    title: 'Himachal Snowy Escapes & Valleys',
    location: 'Himachal Pradesh, India',
    description: 'Explore scenic Shimla & Manali, go paragliding in Solang Valley, walk through pine forests, and see Dharamshala temples.',
    price: 15000,
    duration: 6,
    rating: 4.8,
    category: 'domestic',
    image: 'assets/himachal.png'
  },
  {
    id: 'PKG-GUJARAT',
    title: 'Vibrant Gujarat Culture & Heritage',
    location: 'Gujarat, India',
    description: 'Explore the historic heritage of Ahmedabad, witness the white salt desert of Rann of Kutch, see Gir forest lions, and visit Somnath Temple.',
    price: 8000,
    duration: 5,
    rating: 4.8,
    category: 'domestic',
    image: 'assets/gujarat.png'
  },
  {
    id: 'PKG-DUBAI',
    title: 'Dubai Luxury Wonders',
    location: 'Dubai, UAE',
    description: 'Witness high-tech skyscrapers like Burj Khalifa, enjoy desert dune bashing, and experience premium cruise dining.',
    price: 59999,
    duration: 5,
    rating: 4.9,
    category: 'international',
    image: 'assets/dubai.jpg'
  },
  {
    id: 'PKG-THAILAND',
    title: 'Thailand Island Explorer',
    location: 'Bangkok & Phuket, Thailand',
    description: 'Relax on golden sand beaches of Phuket, visit gold-plated grand palaces, and shop local floating night markets.',
    price: 34999,
    duration: 6,
    rating: 4.8,
    category: 'international',
    image: 'assets/thailand.jpg'
  },
  {
    id: 'PKG-MALDIVES',
    title: 'Maldives Bliss Villa',
    location: 'Malé, Maldives',
    description: 'Rejuvenate at premium private overwater bungalows surrounded by turquoise waters, coral reefs, and colorful marine life.',
    price: 79999,
    duration: 4,
    rating: 4.9,
    category: 'international',
    image: 'assets/maldives.jpg'
  },
  {
    id: 'PKG-VIETNAM',
    title: 'Vietnam Halong Bay Cruise',
    location: 'Halong Bay, Vietnam',
    description: 'Sail through towering limestone pillars of Halong Bay on a luxury cruise, explore vibrant streets of Hanoi, and visit historic sites of Ho Chi Minh City.',
    price: 33000,
    duration: 6,
    rating: 4.8,
    category: 'international',
    image: 'assets/vietnam.png'
  },
  {
    id: 'PKG-POLO-FOREST',
    title: 'Polo Forest Heritage Day Hike',
    location: 'Sabarkantha, Gujarat',
    description: 'Trek through green forest trails, discover ancient 15th-century temples, Harnav dam, and enjoy a local picnic.',
    price: 1100,
    duration: 1,
    rating: 4.8,
    category: 'day-tours',
    image: 'assets/poloforest.png'
  },
  {
    id: 'PKG-BAKOR',
    title: 'Bakor Nature Camp Day Trip',
    location: 'Mahisagar, Gujarat',
    description: 'Explore nature camps, waterfall treks, historic ruins, bird watching, and enjoy hot traditional Gujarati meals.',
    price: 900,
    duration: 1,
    rating: 4.7,
    category: 'day-tours',
    image: 'assets/bakor.png'
  }
];

// Initialize default packages in storage if missing or outdated
const existingPackages = localStorage.getItem('packages');
if (!existingPackages || existingPackages.includes('PKG-SWISS') || !existingPackages.includes('8999') || !existingPackages.includes('PKG-GOA') || !existingPackages.includes('PKG-POLO-FOREST') || !existingPackages.includes('PKG-HIMACHAL') || !existingPackages.includes('PKG-GUJARAT') || !existingPackages.includes('PKG-VIETNAM')) {
  localStorage.setItem('packages', JSON.stringify(DEFAULT_PACKAGES));
}

document.addEventListener('DOMContentLoaded', () => {
  // Init sub-modules
  initBookingModule();
  initDashboardModule();

  // Hero Screensaver Slideshow
  const heroSlides = document.querySelectorAll('.hero-slide');
  if (heroSlides.length > 0) {
    let currentSlide = 0;
    setInterval(() => {
      heroSlides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % heroSlides.length;
      heroSlides[currentSlide].classList.add('active');
    }, 5000);
  }

  // DOM Elements
  const header = document.querySelector('header');
  const themeToggle = document.getElementById('theme-toggle');
  const packagesContainer = document.getElementById('packages-grid');
  const searchForm = document.getElementById('hero-search-form');
  const filterBtns = document.querySelectorAll('.filter-btn');

  // Sticky header scroll behavior
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Color Theme Management (Default Dark theme for immersive aesthetics)
  let currentTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);
  updateLogoTheme(currentTheme);

  themeToggle?.addEventListener('click', () => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeIcon(currentTheme);
    updateLogoTheme(currentTheme);
  });

  function updateThemeIcon(theme) {
    if (!themeToggle) return;
    themeToggle.innerHTML = theme === 'dark' ? '☀️' : '🌙';
  }

  function updateLogoTheme(theme) {
    const logoImgs = document.querySelectorAll('.logo-img');
    logoImgs.forEach(img => {
      const darkSrc = img.getAttribute('data-dark-src');
      const lightSrc = img.getAttribute('data-light-src');
      if (theme === 'dark' && darkSrc) {
        img.src = darkSrc;
      } else if (theme === 'light' && lightSrc) {
        img.src = lightSrc;
      }
    });
  }

  // Render travel packages dynamically
  function renderPackages(filteredPackages = null) {
    if (!packagesContainer) return;
    
    const pkgs = filteredPackages || JSON.parse(localStorage.getItem('packages') || '[]');
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');

    if (pkgs.length === 0) {
      packagesContainer.innerHTML = `
        <div style="grid-column: span 3; text-align: center; color: var(--text-muted); padding: 40px;">
          No destinations match your filters. Try searching for something else!
        </div>
      `;
      return;
    }

    packagesContainer.innerHTML = pkgs.map(pkg => {
      const isWishlisted = wishlist.includes(pkg.id);
      return `
        <div class="destination-card" data-category="${pkg.category}">
          <div class="card-img-wrapper">
            <img src="${pkg.image}" alt="${pkg.title}" class="card-img" onerror="this.src='https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&auto=format&fit=crop&q=80'">
            <span class="card-tag">${pkg.category}</span>
            <button class="btn-wishlist" data-id="${pkg.id}" style="position: absolute; top: 16px; right: 16px; background: rgba(9, 13, 22, 0.6); backdrop-filter: blur(4px); border: none; width: 36px; height: 36px; border-radius: 50%; color: ${isWishlisted ? '#ef4444' : '#fff'}; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.15rem; transition: transform 0.2s;">
              ${isWishlisted ? '❤️' : '🤍'}
            </button>
            <div class="card-rating">
              <i>★</i> ${pkg.rating.toFixed(1)}
            </div>
          </div>
          <div class="card-content">
            <div class="card-location">📍 ${pkg.location}</div>
            <h3 class="card-title">${pkg.title}</h3>
            <p class="card-description">${pkg.description}</p>
            <div class="card-footer">
              <div class="card-price">
                <span class="price-label">Per traveler</span>
                <span class="price-value">₹${pkg.price.toLocaleString('en-IN')}</span>
              </div>
              <button class="btn-primary btn-book-now" data-id="${pkg.id}">Book Now</button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach Wishlist Button Events
    packagesContainer.querySelectorAll('.btn-wishlist').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        toggleWishlist(id);
      });
    });

    // Attach Booking Modal trigger Events
    packagesContainer.querySelectorAll('.btn-book-now').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const pkg = pkgs.find(p => p.id === id);
        if (pkg) {
          window.dispatchEvent(new CustomEvent('openBookingModal', { detail: pkg }));
        }
      });
    });
  }

  // Toggle wishlist state
  function toggleWishlist(pkgId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const index = wishlist.indexOf(pkgId);
    
    if (index === -1) {
      wishlist.push(pkgId);
    } else {
      wishlist.splice(index, 1);
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    renderPackages();
    
    // Sync wishlist inside dashboard.js
    window.dispatchEvent(new CustomEvent('wishlistUpdated'));
  }

  // Handle category filtering
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');
      const allPkgs = JSON.parse(localStorage.getItem('packages') || '[]');
      
      if (filterVal === 'all') {
        renderPackages(allPkgs);
      } else {
        const filtered = allPkgs.filter(p => p.category === filterVal);
        renderPackages(filtered);
      }
    });
  });

  // Handle Search Queries
  searchForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const destQuery = document.getElementById('search-dest').value.toLowerCase().trim();
    
    const allPkgs = JSON.parse(localStorage.getItem('packages') || '[]');
    
    const filtered = allPkgs.filter(pkg => {
      const matchText = pkg.title.toLowerCase().includes(destQuery) || 
                        pkg.location.toLowerCase().includes(destQuery) ||
                        pkg.description.toLowerCase().includes(destQuery);
      return matchText;
    });

    renderPackages(filtered);
    
    // Scroll to destinations view
    const destSection = document.getElementById('destinations');
    if (destSection) {
      destSection.scrollIntoView({ behavior: 'smooth' });
    }
  });

  // Handle Dropdown Menu Clicks
  const dropdownItems = document.querySelectorAll('.dropdown-item');
  dropdownItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const filterVal = item.getAttribute('data-filter');
      const destVal = item.getAttribute('data-dest');

      // Scroll to destinations view
      const destSection = document.getElementById('destinations');
      if (destSection) {
        destSection.scrollIntoView({ behavior: 'smooth' });
      }

      // Highlight the corresponding filter button tab
      filterBtns.forEach(btn => {
        if (btn.getAttribute('data-filter') === filterVal) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      // Filter and render packages
      const allPkgs = JSON.parse(localStorage.getItem('packages') || '[]');
      let filtered = allPkgs;

      if (filterVal !== 'all') {
        filtered = allPkgs.filter(p => p.category === filterVal);
      }

      if (destVal) {
        filtered = filtered.filter(p => p.id.toLowerCase().includes(destVal) || p.title.toLowerCase().includes(destVal) || p.location.toLowerCase().includes(destVal));
        // Set search select option if it exists
        const searchSelect = document.getElementById('search-dest');
        if (searchSelect) {
          searchSelect.value = destVal;
        }
      }

      renderPackages(filtered);
    });
  });

  // View Navigation Router (SPA Swapping)
  const homeViews = document.querySelectorAll('.home-view-group');
  const dashboardView = document.getElementById('dashboard-view');
  const navLinks = document.querySelectorAll('.nav-link:not(.nav-dashboard)');
  const dashboardNavLink = document.querySelector('.nav-dashboard');

  const showView = (viewName) => {
    if (viewName === 'dashboard') {
      homeViews.forEach(v => v.style.display = 'none');
      dashboardView.style.display = 'block';
      navLinks.forEach(l => l.classList.remove('active'));
      dashboardNavLink?.classList.add('active');
      
      // Force trigger dashboard metrics render
      window.dispatchEvent(new CustomEvent('bookingsUpdated'));
    } else {
      dashboardView.style.display = 'none';
      homeViews.forEach(v => v.style.display = 'block');
      dashboardNavLink?.classList.remove('active');
      
      // Update correct home sub-link
      navLinks.forEach(l => {
        if (l.getAttribute('href') === `#${viewName}`) {
          l.classList.add('active');
        } else {
          l.classList.remove('active');
        }
      });
    }
  };

  // Nav link click events
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      
      if (href.startsWith('#')) {
        showView(href.substring(1));
        const targetSection = document.querySelector(href);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  dashboardNavLink?.addEventListener('click', (e) => {
    e.preventDefault();
    showView('dashboard');
  });

  // Testimonials Carousel slider
  const track = document.getElementById('testimonials-track');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');
  let currentSlide = 0;

  if (track && prevBtn && nextBtn) {
    const slides = Array.from(track.children);
    
    const moveToSlide = (slideIdx) => {
      if (slideIdx < 0) slideIdx = slides.length - 1;
      if (slideIdx >= slides.length) slideIdx = 0;
      
      track.style.transform = `translateX(-${slideIdx * 100}%)`;
      currentSlide = slideIdx;
    };

    prevBtn.addEventListener('click', () => moveToSlide(currentSlide - 1));
    nextBtn.addEventListener('click', () => moveToSlide(currentSlide + 1));
    
    // Auto slide every 8s
    setInterval(() => moveToSlide(currentSlide + 1), 8000);
  }

  // Initial draw
  renderPackages();

  // Listen to wishlist sync changes
  window.addEventListener('wishlistUpdated', () => {
    renderPackages();
  });
});
